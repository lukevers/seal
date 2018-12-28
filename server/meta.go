package main

import (
	"context"
	"errors"
	"net/http"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

// MetaTeamsListResponse is a renderable response type wrapper for multiple posts
type MetaTeamsListResponse []*MetaTeamResponse

// MetaTeamResponse is a renderable response type wrapper for a team
type MetaTeamResponse struct {
	*models.Team
}

// Render is the renderable interface function for the MetaTeamResponse struct
func (e *MetaTeamResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// NewMetaTeamsListResponse wraps multiple posts in a renderable response
func NewMetaTeamsListResponse(ts models.TeamSlice) []render.Renderer {
	list := []render.Renderer{}
	for _, team := range ts {
		list = append(list, &MetaTeamResponse{team})
	}

	return list
}

// MetaListTeams gets meta information for the user related to teams.
func MetaListTeams(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user, ok := ctx.Value("user").(*models.User)
	if !ok {
		render.Render(w, r, ErrRender(errors.New("Could not revive context")))
		return
	}

	if err := r.ParseForm(); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	var mods []qm.QueryMod = []qm.QueryMod{
		qm.InnerJoin("team_members as tm on teams.id = tm.team_id"),
		qm.InnerJoin("users as u on u.id = tm.user_id"),
		qm.Where("tm.user_id = ?", user.ID),
		qm.Where("tm.status = ?", "active"),
		qm.Where("teams.deleted_at IS NULL"),
		qm.Where("u.deleted_at IS NULL"),
	}

	teams, err := models.Teams(mods...).All(context.TODO(), db)
	if err != nil {
		render.Render(w, r, ErrRender(err))
	} else {
		if err := render.RenderList(w, r, NewMetaTeamsListResponse(teams)); err != nil {
			render.Render(w, r, ErrRender(err))
			return
		}
	}
}
