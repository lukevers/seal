package main

import (
	"context"
	"log"
	"net/http"
	"net/url"

	"github.com/go-chi/chi/middleware"
	"github.com/gorilla/sessions"
	"github.com/lukevers/seal/server/models"
	"github.com/mssola/user_agent"
	"github.com/volatiletech/null"
	"github.com/volatiletech/sqlboiler/boil"
)

var (
	store = sessions.NewCookieStore([]byte(*flagSessionKey))
)

func Track(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

		session, err := store.Get(r, *flagSessionName)
		if err != nil {
			log.Println(err)
		} else {
			if session.IsNew {
				session.Values["rid"] = middleware.GetReqID(r.Context())
				session.Save(r, ww)
			}
		}

		defer func() {
			go collect(ww, r)
		}()

		next.ServeHTTP(ww, r)
	})
}

func collect(w middleware.WrapResponseWriter, r *http.Request) {
	if !shouldCollect(w, r) {
		return
	}

	var new bool
	rid := ""
	session, err := store.Get(r, *flagSessionName)
	if err != nil {
		log.Println(err)
	} else {
		new = session.IsNew
		rid = session.Values["rid"].(string)
	}

	pv := &models.AnalyticsPageview{
		Scheme:        getScheme(r),
		Host:          r.Host,
		Path:          r.URL.Path,
		Method:        r.Method,
		Query:         r.URL.RawQuery,
		RemoteAddress: r.RemoteAddr,
		UserAgent:     null.StringFrom(r.UserAgent()),
		Status:        w.Status(),
		IsNew:         new,
		InitialRid:    rid,
	}

	err = pv.Insert(context.TODO(), db, boil.Infer())
	if err != nil {
		log.Println(err)
		return
	}

	if shouldCollectUa(w, r) {
		rawua := r.UserAgent()
		ua := user_agent.New(rawua)

		browserName, browserVersion := ua.Browser()
		browserEngine, browserEngineVersion := ua.Engine()
		osinfo := ua.OSInfo()

		pvua := &models.AnalyticsPageviewUseragent{
			PageviewID:           pv.ID,
			BrowserName:          null.StringFrom(browserName),
			BrowserVersion:       null.StringFrom(browserVersion),
			BrowserEngine:        null.StringFrom(browserEngine),
			BrowserEngineVersion: null.StringFrom(browserEngineVersion),
			Localization:         null.StringFrom(ua.Localization()),
			Mobile:               null.BoolFrom(ua.Mobile()),
			OsName:               null.StringFrom(osinfo.Name),
			OsVersion:            null.StringFrom(osinfo.Version),
			Platform:             null.StringFrom(ua.Platform()),
			Raw:                  null.StringFrom(rawua),
		}

		err = pvua.Insert(context.TODO(), db, boil.Infer())
		if err != nil {
			log.Println(err)
		}
	}

	if shouldCollectReferer(w, r) {
		ur, err := url.Parse(r.Referer())
		if err != nil {
			log.Println(err)
			return
		}

		pvr := &models.AnalyticsPageviewReferer{
			PageviewID: pv.ID,
			Protocol:   ur.Scheme,
			Host:       ur.Host,
			Path:       ur.Path,
			Query:      ur.RawQuery,
		}

		err = pvr.Insert(context.TODO(), db, boil.Infer())
		if err != nil {
			log.Println(err)
		}
	}
}

func getScheme(r *http.Request) (scheme string) {
	scheme = r.URL.Scheme
	if scheme != "" {
		return
	}

	if r.TLS == nil {
		scheme = "http"
	} else {
		scheme = "https"
	}

	return
}

func shouldCollect(w middleware.WrapResponseWriter, r *http.Request) bool {
	if r.Context().Value("static").(bool) {
		return false
	}

	if r.Context().Value("api").(bool) {
		return false
	}

	if r.URL.Path == "/favicon.ico" {
		return false
	}

	if r.Context().Value("team") == nil {
		return false
	}

	return true
}

func shouldCollectReferer(w middleware.WrapResponseWriter, r *http.Request) bool {
	if r.Referer() == "" {
		return false
	}

	return true
}

func shouldCollectUa(w middleware.WrapResponseWriter, r *http.Request) bool {
	if r.UserAgent() == "" {
		return false
	}

	return true
}
