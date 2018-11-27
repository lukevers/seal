package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"sync"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

// HostToTeamMap contains a cached mapping of domains to teams. If the domain is in the map, there is an active team associated with it.
var HostToTeamMap *sync.Map

func init() {
	if err := initTeams(context.TODO(), db, nil); err != nil {
		log.Fatal("Could not load teams from database:", err)
	}

	models.AddTeamHook(boil.AfterUpsertHook, initTeams)
	models.AddTeamHook(boil.AfterUpdateHook, initTeams)
	models.AddTeamHook(boil.AfterInsertHook, initTeams)
	models.AddTeamHook(boil.AfterDeleteHook, initTeams)
}

func initTeams(context.Context, boil.ContextExecutor, *models.Team) error {
	var mods []qm.QueryMod = []qm.QueryMod{
		qm.Where("teams.deleted_at IS NULL"),
	}

	teams, err := models.Teams(mods...).All(context.TODO(), db)
	if err != nil {
		return err
	}

	var newmap sync.Map = sync.Map{}
	for _, team := range teams {
		newmap.Store(team.Domain, team)
	}

	HostToTeamMap = &newmap
	log.Println("Successfully re-initialized host/team map")

	return nil
}

func MapHostToTeam(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Context().Value("api").(bool) {
			next.ServeHTTP(w, r)
			return
		}

		if team, exists := HostToTeamMap.Load(r.Host); !exists {
			render.Render(w, r, ErrRender(errors.New("Host given not setup")))
			return
		} else {
			ctx := context.WithValue(r.Context(), "team", team)
			next.ServeHTTP(w, r.WithContext(ctx))
		}
	})
}