package main

import (
	"context"
	"errors"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

// HostToTeamMap contains a cached mapping of domains to teams. If the domain is in the map, there is an active team associated with it.
var HostToTeamMap *sync.Map

type TeamWrapper struct {
	Team      *models.Team
	Templates *sync.Map
}

func init() {
	if err := initTeams(context.TODO(), db, nil); err != nil {
		log.Fatal("Could not load teams from database:", err)
	}

	models.AddTeamHook(boil.AfterUpsertHook, initTeams)
	models.AddTeamHook(boil.AfterUpdateHook, initTeams)
	models.AddTeamHook(boil.AfterInsertHook, initTeams)
	models.AddTeamHook(boil.AfterDeleteHook, initTeams)
}

func initTeams(ctx context.Context, exe boil.ContextExecutor, team *models.Team) error {
	var mods []qm.QueryMod = []qm.QueryMod{
		qm.Where("teams.deleted_at IS NULL"),
	}

	teams, err := models.Teams(mods...).All(context.TODO(), db)
	if err != nil {
		return err
	}

	var newmap sync.Map
	for _, team := range teams {
		newmap.Store(
			team.Domain,
			&TeamWrapper{
				Team:      team,
				Templates: &sync.Map{},
			},
		)
	}

	HostToTeamMap = &newmap
	log.Println("Successfully re-initialized host/team map")

	initPosts(ctx, exe, team)
	return nil
}

func MapHostToTeam(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Context().Value("api").(bool) || r.Context().Value("static").(bool) {
			next.ServeHTTP(w, r)
			return
		}

		// r.Host = "local.lukevers.com"

		if team, exists := HostToTeamMap.Load(r.Host); !exists {
			render.Render(w, r, ErrInvalidRequest(errors.New("Host given not setup")))
			return
		} else {
			ctx := context.WithValue(r.Context(), "team", team)
			next.ServeHTTP(w, r.WithContext(ctx))
		}
	})
}

func RenderHost(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Context().Value("api").(bool) || r.Context().Value("static").(bool) || r.Context().Value("forms").(bool) {
			next.ServeHTTP(w, r)
			return
		}

		teamWrapper := r.Context().Value("team").(*TeamWrapper)
		team := teamWrapper.Team
		if posts, exists := TeamIDToPostsMap.Load(team.ID); !exists {
			render.Render(w, r, ErrInternalRender(errors.New("Could not find team related to host")))
			return
		} else {
			route := r.URL.Path
			format := "html"
			draft := false

			if strings.HasSuffix(route, ".md") {
				route = strings.TrimSuffix(route, ".md")
				format = "md"
			}

			if strings.HasPrefix(route, "/_draft") {
				route = strings.TrimPrefix(route, "/_draft")
				draft = true
			}

			if post, pexists := posts.(*sync.Map).Load(route); !pexists {
				RenderHostStatusCode(w, r, "404", team)
				return
			} else {
				p := post.(*models.Post)
				if p.Status != "published" {
					if !(p.Status == "draft" && draft) {
						RenderHostStatusCode(w, r, "404", team)
						return
					}
				}

				if format == "md" {
					w.Header().Set("Content-Type", "text/plain")
					w.Write([]byte(p.Markdown.String))
					return
				}

				var t *template.Template
				tmp, exists := teamWrapper.Templates.Load(p.Template)
				if !exists {
					var err error
					t, err = template.New(p.Template).Funcs(
						template.FuncMap{
							"html":      func(text string) template.HTML { return template.HTML(text) },
							"datetime":  func(t time.Time) string { return t.Format("Monday, January 02 2006 15:04:05 MST") },
							"rfc3339":   func(t time.Time) string { return t.Format(time.RFC3339) },
							"cachehash": func() string { return *flagCacheHash },
							"list": func() interface{} {
								posts, ok := TeamIDToPostsMap.Load(team.ID)
								if !ok {
									return nil
								}

								var p []*models.Post
								posts.(*sync.Map).Range(func(k, v interface{}) bool {
									t := v.(*models.Post)
									if t.Status == "published" && t.Template == "post" {
										p = append(p, t)
									}

									return true
								})

								sort.SliceStable(p, func(i, j int) bool {
									return p[i].PublishedAt.Time.Unix() > p[j].PublishedAt.Time.Unix()
								})

								return p
							},
							"tracking": func() string { return team.TrackingHTML.String },
						},
					).ParseFiles(
						fmt.Sprintf("../themes/%s/base.html", team.Theme),
						fmt.Sprintf("../themes/%s/header.html", team.Theme),
						fmt.Sprintf("../themes/%s/footer.html", team.Theme),
						fmt.Sprintf("../themes/%s/%s.html", team.Theme, p.Template),
					)

					if err != nil {
						log.Println(err)
						RenderHostStatusCode(w, r, "500", team)
						return
					}

					teamWrapper.Templates.Store(p.Template, t)
					log.Println(fmt.Sprintf("Successfully re-initialized template \"%s\" for \"%s\"", p.Template, team.Domain))
				} else {
					t = tmp.(*template.Template)
				}

				w.Header().Set("Content-Type", "text/html")
				err := t.ExecuteTemplate(w, fmt.Sprintf("%s-%s", team.Theme, p.Template), p)
				if err != nil {
					log.Println(err)
					RenderHostStatusCode(w, r, "500", team)
					return
				}
			}
		}
	})
}

func RenderHostStatusCode(w http.ResponseWriter, r *http.Request, status string, team *models.Team) {
	t, err := template.New(status).Funcs(
		template.FuncMap{
			"html":      func(text string) template.HTML { return template.HTML(text) },
			"datetime":  func(t time.Time) string { return t.Format("Monday, January 02 2006 15:04:05 MST") },
			"rfc3339":   func(t time.Time) string { return t.Format(time.RFC3339) },
			"cachehash": func() string { return *flagCacheHash },
			"tracking":  func() string { return team.TrackingHTML.String },
		},
	).ParseFiles(
		fmt.Sprintf("../themes/%s/base.html", team.Theme),
		fmt.Sprintf("../themes/%s/header.html", team.Theme),
		fmt.Sprintf("../themes/%s/footer.html", team.Theme),
		fmt.Sprintf("../themes/%s/%s.html", team.Theme, status),
	)

	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrInternalRender(err))
		return
	}

	code, err := strconv.Atoi(status)
	if err != nil {
		if status == "500" {
			render.Render(w, r, ErrInternalRender(err))
		} else {
			RenderHostStatusCode(w, r, "500", team)
		}

		return
	}

	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(code)
	err = t.ExecuteTemplate(w, fmt.Sprintf("%s-%s", team.Theme, status), nil)
	if err != nil {
		log.Println(err)

		// If we error herre and it's already trying to handle the 500, give up
		// and use the other renderer.
		if status == "500" {
			render.Render(w, r, ErrInternalRender(err))
		} else {
			RenderHostStatusCode(w, r, "500", team)
		}

		return
	}
}
