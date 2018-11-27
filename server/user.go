package main

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/null"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

type UserCreateForm struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Code     string `json:"code"`
}

// UpdatePost updates a specific post.
func CreateUser(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	var form UserCreateForm
	err = json.Unmarshal(body, &form)
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	if form.Email == "" {
		render.Render(w, r, ErrRender(errors.New("Email is required")))
		return
	}

	if form.Password == "" {
		render.Render(w, r, ErrRender(errors.New("Password is required")))
		return
	}

	if form.Code == "" {
		render.Render(w, r, ErrRender(errors.New("Code is required")))
		return
	}

	log.Println(form)

	code, err := models.UserCreateCodes(
		qm.Where("code = ?", form.Code),
		qm.Where("redeemed_at IS NULL"),
	).One(context.TODO(), db)
	if err != nil {
		render.Render(w, r, ErrRender(errors.New("Could not find valid code")))
		return
	}

	pass, err := bcrypt.GenerateFromPassword([]byte(form.Password), bcrypt.DefaultCost)
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	user := models.User{
		Email:    form.Email,
		Password: string(pass),
	}

	err = user.Insert(context.TODO(), db, boil.Infer())
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	code.UserID = null.UintFrom(user.ID)
	code.RedeemedAt = null.TimeFrom(time.Now())
	_, err = code.Update(context.TODO(), db, boil.Infer())
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}
