// Code generated by SQLBoiler (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"context"
	"database/sql"
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/volatiletech/null"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/queries/qm"
	"github.com/volatiletech/sqlboiler/strmangle"
)

// UserCreateCode is an object representing the database table.
type UserCreateCode struct {
	ID         uint        `boil:"id" json:"id" toml:"id" yaml:"id"`
	Code       null.String `boil:"code" json:"code,omitempty" toml:"code" yaml:"code,omitempty"`
	UserID     null.Uint   `boil:"user_id" json:"user_id,omitempty" toml:"user_id" yaml:"user_id,omitempty"`
	CreatedAt  time.Time   `boil:"created_at" json:"created_at" toml:"created_at" yaml:"created_at"`
	RedeemedAt null.Time   `boil:"redeemed_at" json:"redeemed_at,omitempty" toml:"redeemed_at" yaml:"redeemed_at,omitempty"`

	R *userCreateCodeR `boil:"-" json:"-" toml:"-" yaml:"-"`
	L userCreateCodeL  `boil:"-" json:"-" toml:"-" yaml:"-"`
}

var UserCreateCodeColumns = struct {
	ID         string
	Code       string
	UserID     string
	CreatedAt  string
	RedeemedAt string
}{
	ID:         "id",
	Code:       "code",
	UserID:     "user_id",
	CreatedAt:  "created_at",
	RedeemedAt: "redeemed_at",
}

// UserCreateCodeRels is where relationship names are stored.
var UserCreateCodeRels = struct {
	User string
}{
	User: "User",
}

// userCreateCodeR is where relationships are stored.
type userCreateCodeR struct {
	User *User
}

// NewStruct creates a new relationship struct
func (*userCreateCodeR) NewStruct() *userCreateCodeR {
	return &userCreateCodeR{}
}

// userCreateCodeL is where Load methods for each relationship are stored.
type userCreateCodeL struct{}

var (
	userCreateCodeColumns               = []string{"id", "code", "user_id", "created_at", "redeemed_at"}
	userCreateCodeColumnsWithoutDefault = []string{"code", "user_id", "redeemed_at"}
	userCreateCodeColumnsWithDefault    = []string{"id", "created_at"}
	userCreateCodePrimaryKeyColumns     = []string{"id"}
)

type (
	// UserCreateCodeSlice is an alias for a slice of pointers to UserCreateCode.
	// This should generally be used opposed to []UserCreateCode.
	UserCreateCodeSlice []*UserCreateCode
	// UserCreateCodeHook is the signature for custom UserCreateCode hook methods
	UserCreateCodeHook func(context.Context, boil.ContextExecutor, *UserCreateCode) error

	userCreateCodeQuery struct {
		*queries.Query
	}
)

// Cache for insert, update and upsert
var (
	userCreateCodeType                 = reflect.TypeOf(&UserCreateCode{})
	userCreateCodeMapping              = queries.MakeStructMapping(userCreateCodeType)
	userCreateCodePrimaryKeyMapping, _ = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, userCreateCodePrimaryKeyColumns)
	userCreateCodeInsertCacheMut       sync.RWMutex
	userCreateCodeInsertCache          = make(map[string]insertCache)
	userCreateCodeUpdateCacheMut       sync.RWMutex
	userCreateCodeUpdateCache          = make(map[string]updateCache)
	userCreateCodeUpsertCacheMut       sync.RWMutex
	userCreateCodeUpsertCache          = make(map[string]insertCache)
)

var (
	// Force time package dependency for automated UpdatedAt/CreatedAt.
	_ = time.Second
)

var userCreateCodeBeforeInsertHooks []UserCreateCodeHook
var userCreateCodeBeforeUpdateHooks []UserCreateCodeHook
var userCreateCodeBeforeDeleteHooks []UserCreateCodeHook
var userCreateCodeBeforeUpsertHooks []UserCreateCodeHook

var userCreateCodeAfterInsertHooks []UserCreateCodeHook
var userCreateCodeAfterSelectHooks []UserCreateCodeHook
var userCreateCodeAfterUpdateHooks []UserCreateCodeHook
var userCreateCodeAfterDeleteHooks []UserCreateCodeHook
var userCreateCodeAfterUpsertHooks []UserCreateCodeHook

// doBeforeInsertHooks executes all "before insert" hooks.
func (o *UserCreateCode) doBeforeInsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeBeforeInsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeUpdateHooks executes all "before Update" hooks.
func (o *UserCreateCode) doBeforeUpdateHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeBeforeUpdateHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeDeleteHooks executes all "before Delete" hooks.
func (o *UserCreateCode) doBeforeDeleteHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeBeforeDeleteHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeUpsertHooks executes all "before Upsert" hooks.
func (o *UserCreateCode) doBeforeUpsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeBeforeUpsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterInsertHooks executes all "after Insert" hooks.
func (o *UserCreateCode) doAfterInsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeAfterInsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterSelectHooks executes all "after Select" hooks.
func (o *UserCreateCode) doAfterSelectHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeAfterSelectHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterUpdateHooks executes all "after Update" hooks.
func (o *UserCreateCode) doAfterUpdateHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeAfterUpdateHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterDeleteHooks executes all "after Delete" hooks.
func (o *UserCreateCode) doAfterDeleteHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeAfterDeleteHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterUpsertHooks executes all "after Upsert" hooks.
func (o *UserCreateCode) doAfterUpsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	for _, hook := range userCreateCodeAfterUpsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// AddUserCreateCodeHook registers your hook function for all future operations.
func AddUserCreateCodeHook(hookPoint boil.HookPoint, userCreateCodeHook UserCreateCodeHook) {
	switch hookPoint {
	case boil.BeforeInsertHook:
		userCreateCodeBeforeInsertHooks = append(userCreateCodeBeforeInsertHooks, userCreateCodeHook)
	case boil.BeforeUpdateHook:
		userCreateCodeBeforeUpdateHooks = append(userCreateCodeBeforeUpdateHooks, userCreateCodeHook)
	case boil.BeforeDeleteHook:
		userCreateCodeBeforeDeleteHooks = append(userCreateCodeBeforeDeleteHooks, userCreateCodeHook)
	case boil.BeforeUpsertHook:
		userCreateCodeBeforeUpsertHooks = append(userCreateCodeBeforeUpsertHooks, userCreateCodeHook)
	case boil.AfterInsertHook:
		userCreateCodeAfterInsertHooks = append(userCreateCodeAfterInsertHooks, userCreateCodeHook)
	case boil.AfterSelectHook:
		userCreateCodeAfterSelectHooks = append(userCreateCodeAfterSelectHooks, userCreateCodeHook)
	case boil.AfterUpdateHook:
		userCreateCodeAfterUpdateHooks = append(userCreateCodeAfterUpdateHooks, userCreateCodeHook)
	case boil.AfterDeleteHook:
		userCreateCodeAfterDeleteHooks = append(userCreateCodeAfterDeleteHooks, userCreateCodeHook)
	case boil.AfterUpsertHook:
		userCreateCodeAfterUpsertHooks = append(userCreateCodeAfterUpsertHooks, userCreateCodeHook)
	}
}

// One returns a single userCreateCode record from the query.
func (q userCreateCodeQuery) One(ctx context.Context, exec boil.ContextExecutor) (*UserCreateCode, error) {
	o := &UserCreateCode{}

	queries.SetLimit(q.Query, 1)

	err := q.Bind(ctx, exec, o)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, errors.Wrap(err, "models: failed to execute a one query for user_create_codes")
	}

	if err := o.doAfterSelectHooks(ctx, exec); err != nil {
		return o, err
	}

	return o, nil
}

// All returns all UserCreateCode records from the query.
func (q userCreateCodeQuery) All(ctx context.Context, exec boil.ContextExecutor) (UserCreateCodeSlice, error) {
	var o []*UserCreateCode

	err := q.Bind(ctx, exec, &o)
	if err != nil {
		return nil, errors.Wrap(err, "models: failed to assign all query results to UserCreateCode slice")
	}

	if len(userCreateCodeAfterSelectHooks) != 0 {
		for _, obj := range o {
			if err := obj.doAfterSelectHooks(ctx, exec); err != nil {
				return o, err
			}
		}
	}

	return o, nil
}

// Count returns the count of all UserCreateCode records in the query.
func (q userCreateCodeQuery) Count(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	var count int64

	queries.SetSelect(q.Query, nil)
	queries.SetCount(q.Query)

	err := q.Query.QueryRowContext(ctx, exec).Scan(&count)
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to count user_create_codes rows")
	}

	return count, nil
}

// Exists checks if the row exists in the table.
func (q userCreateCodeQuery) Exists(ctx context.Context, exec boil.ContextExecutor) (bool, error) {
	var count int64

	queries.SetSelect(q.Query, nil)
	queries.SetCount(q.Query)
	queries.SetLimit(q.Query, 1)

	err := q.Query.QueryRowContext(ctx, exec).Scan(&count)
	if err != nil {
		return false, errors.Wrap(err, "models: failed to check if user_create_codes exists")
	}

	return count > 0, nil
}

// User pointed to by the foreign key.
func (o *UserCreateCode) User(mods ...qm.QueryMod) userQuery {
	queryMods := []qm.QueryMod{
		qm.Where("id=?", o.UserID),
	}

	queryMods = append(queryMods, mods...)

	query := Users(queryMods...)
	queries.SetFrom(query.Query, "`users`")

	return query
}

// LoadUser allows an eager lookup of values, cached into the
// loaded structs of the objects. This is for an N-1 relationship.
func (userCreateCodeL) LoadUser(ctx context.Context, e boil.ContextExecutor, singular bool, maybeUserCreateCode interface{}, mods queries.Applicator) error {
	var slice []*UserCreateCode
	var object *UserCreateCode

	if singular {
		object = maybeUserCreateCode.(*UserCreateCode)
	} else {
		slice = *maybeUserCreateCode.(*[]*UserCreateCode)
	}

	args := make([]interface{}, 0, 1)
	if singular {
		if object.R == nil {
			object.R = &userCreateCodeR{}
		}
		if !queries.IsNil(object.UserID) {
			args = append(args, object.UserID)
		}

	} else {
	Outer:
		for _, obj := range slice {
			if obj.R == nil {
				obj.R = &userCreateCodeR{}
			}

			for _, a := range args {
				if queries.Equal(a, obj.UserID) {
					continue Outer
				}
			}

			if !queries.IsNil(obj.UserID) {
				args = append(args, obj.UserID)
			}

		}
	}

	query := NewQuery(qm.From(`users`), qm.WhereIn(`id in ?`, args...))
	if mods != nil {
		mods.Apply(query)
	}

	results, err := query.QueryContext(ctx, e)
	if err != nil {
		return errors.Wrap(err, "failed to eager load User")
	}

	var resultSlice []*User
	if err = queries.Bind(results, &resultSlice); err != nil {
		return errors.Wrap(err, "failed to bind eager loaded slice User")
	}

	if err = results.Close(); err != nil {
		return errors.Wrap(err, "failed to close results of eager load for users")
	}
	if err = results.Err(); err != nil {
		return errors.Wrap(err, "error occurred during iteration of eager loaded relations for users")
	}

	if len(userCreateCodeAfterSelectHooks) != 0 {
		for _, obj := range resultSlice {
			if err := obj.doAfterSelectHooks(ctx, e); err != nil {
				return err
			}
		}
	}

	if len(resultSlice) == 0 {
		return nil
	}

	if singular {
		foreign := resultSlice[0]
		object.R.User = foreign
		if foreign.R == nil {
			foreign.R = &userR{}
		}
		foreign.R.UserCreateCodes = append(foreign.R.UserCreateCodes, object)
		return nil
	}

	for _, local := range slice {
		for _, foreign := range resultSlice {
			if queries.Equal(local.UserID, foreign.ID) {
				local.R.User = foreign
				if foreign.R == nil {
					foreign.R = &userR{}
				}
				foreign.R.UserCreateCodes = append(foreign.R.UserCreateCodes, local)
				break
			}
		}
	}

	return nil
}

// SetUser of the userCreateCode to the related item.
// Sets o.R.User to related.
// Adds o to related.R.UserCreateCodes.
func (o *UserCreateCode) SetUser(ctx context.Context, exec boil.ContextExecutor, insert bool, related *User) error {
	var err error
	if insert {
		if err = related.Insert(ctx, exec, boil.Infer()); err != nil {
			return errors.Wrap(err, "failed to insert into foreign table")
		}
	}

	updateQuery := fmt.Sprintf(
		"UPDATE `user_create_codes` SET %s WHERE %s",
		strmangle.SetParamNames("`", "`", 0, []string{"user_id"}),
		strmangle.WhereClause("`", "`", 0, userCreateCodePrimaryKeyColumns),
	)
	values := []interface{}{related.ID, o.ID}

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, updateQuery)
		fmt.Fprintln(boil.DebugWriter, values)
	}

	if _, err = exec.ExecContext(ctx, updateQuery, values...); err != nil {
		return errors.Wrap(err, "failed to update local table")
	}

	queries.Assign(&o.UserID, related.ID)
	if o.R == nil {
		o.R = &userCreateCodeR{
			User: related,
		}
	} else {
		o.R.User = related
	}

	if related.R == nil {
		related.R = &userR{
			UserCreateCodes: UserCreateCodeSlice{o},
		}
	} else {
		related.R.UserCreateCodes = append(related.R.UserCreateCodes, o)
	}

	return nil
}

// RemoveUser relationship.
// Sets o.R.User to nil.
// Removes o from all passed in related items' relationships struct (Optional).
func (o *UserCreateCode) RemoveUser(ctx context.Context, exec boil.ContextExecutor, related *User) error {
	var err error

	queries.SetScanner(&o.UserID, nil)
	if _, err = o.Update(ctx, exec, boil.Whitelist("user_id")); err != nil {
		return errors.Wrap(err, "failed to update local table")
	}

	o.R.User = nil
	if related == nil || related.R == nil {
		return nil
	}

	for i, ri := range related.R.UserCreateCodes {
		if queries.Equal(o.UserID, ri.UserID) {
			continue
		}

		ln := len(related.R.UserCreateCodes)
		if ln > 1 && i < ln-1 {
			related.R.UserCreateCodes[i] = related.R.UserCreateCodes[ln-1]
		}
		related.R.UserCreateCodes = related.R.UserCreateCodes[:ln-1]
		break
	}
	return nil
}

// UserCreateCodes retrieves all the records using an executor.
func UserCreateCodes(mods ...qm.QueryMod) userCreateCodeQuery {
	mods = append(mods, qm.From("`user_create_codes`"))
	return userCreateCodeQuery{NewQuery(mods...)}
}

// FindUserCreateCode retrieves a single record by ID with an executor.
// If selectCols is empty Find will return all columns.
func FindUserCreateCode(ctx context.Context, exec boil.ContextExecutor, iD uint, selectCols ...string) (*UserCreateCode, error) {
	userCreateCodeObj := &UserCreateCode{}

	sel := "*"
	if len(selectCols) > 0 {
		sel = strings.Join(strmangle.IdentQuoteSlice(dialect.LQ, dialect.RQ, selectCols), ",")
	}
	query := fmt.Sprintf(
		"select %s from `user_create_codes` where `id`=?", sel,
	)

	q := queries.Raw(query, iD)

	err := q.Bind(ctx, exec, userCreateCodeObj)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, errors.Wrap(err, "models: unable to select from user_create_codes")
	}

	return userCreateCodeObj, nil
}

// Insert a single record using an executor.
// See boil.Columns.InsertColumnSet documentation to understand column list inference for inserts.
func (o *UserCreateCode) Insert(ctx context.Context, exec boil.ContextExecutor, columns boil.Columns) error {
	if o == nil {
		return errors.New("models: no user_create_codes provided for insertion")
	}

	var err error
	currTime := time.Now().In(boil.GetLocation())

	if o.CreatedAt.IsZero() {
		o.CreatedAt = currTime
	}

	if err := o.doBeforeInsertHooks(ctx, exec); err != nil {
		return err
	}

	nzDefaults := queries.NonZeroDefaultSet(userCreateCodeColumnsWithDefault, o)

	key := makeCacheKey(columns, nzDefaults)
	userCreateCodeInsertCacheMut.RLock()
	cache, cached := userCreateCodeInsertCache[key]
	userCreateCodeInsertCacheMut.RUnlock()

	if !cached {
		wl, returnColumns := columns.InsertColumnSet(
			userCreateCodeColumns,
			userCreateCodeColumnsWithDefault,
			userCreateCodeColumnsWithoutDefault,
			nzDefaults,
		)

		cache.valueMapping, err = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, wl)
		if err != nil {
			return err
		}
		cache.retMapping, err = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, returnColumns)
		if err != nil {
			return err
		}
		if len(wl) != 0 {
			cache.query = fmt.Sprintf("INSERT INTO `user_create_codes` (`%s`) %%sVALUES (%s)%%s", strings.Join(wl, "`,`"), strmangle.Placeholders(dialect.UseIndexPlaceholders, len(wl), 1, 1))
		} else {
			cache.query = "INSERT INTO `user_create_codes` () VALUES ()%s%s"
		}

		var queryOutput, queryReturning string

		if len(cache.retMapping) != 0 {
			cache.retQuery = fmt.Sprintf("SELECT `%s` FROM `user_create_codes` WHERE %s", strings.Join(returnColumns, "`,`"), strmangle.WhereClause("`", "`", 0, userCreateCodePrimaryKeyColumns))
		}

		cache.query = fmt.Sprintf(cache.query, queryOutput, queryReturning)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	vals := queries.ValuesFromMapping(value, cache.valueMapping)

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, cache.query)
		fmt.Fprintln(boil.DebugWriter, vals)
	}

	result, err := exec.ExecContext(ctx, cache.query, vals...)

	if err != nil {
		return errors.Wrap(err, "models: unable to insert into user_create_codes")
	}

	var lastID int64
	var identifierCols []interface{}

	if len(cache.retMapping) == 0 {
		goto CacheNoHooks
	}

	lastID, err = result.LastInsertId()
	if err != nil {
		return ErrSyncFail
	}

	o.ID = uint(lastID)
	if lastID != 0 && len(cache.retMapping) == 1 && cache.retMapping[0] == userCreateCodeMapping["ID"] {
		goto CacheNoHooks
	}

	identifierCols = []interface{}{
		o.ID,
	}

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, cache.retQuery)
		fmt.Fprintln(boil.DebugWriter, identifierCols...)
	}

	err = exec.QueryRowContext(ctx, cache.retQuery, identifierCols...).Scan(queries.PtrsFromMapping(value, cache.retMapping)...)
	if err != nil {
		return errors.Wrap(err, "models: unable to populate default values for user_create_codes")
	}

CacheNoHooks:
	if !cached {
		userCreateCodeInsertCacheMut.Lock()
		userCreateCodeInsertCache[key] = cache
		userCreateCodeInsertCacheMut.Unlock()
	}

	return o.doAfterInsertHooks(ctx, exec)
}

// Update uses an executor to update the UserCreateCode.
// See boil.Columns.UpdateColumnSet documentation to understand column list inference for updates.
// Update does not automatically update the record in case of default values. Use .Reload() to refresh the records.
func (o *UserCreateCode) Update(ctx context.Context, exec boil.ContextExecutor, columns boil.Columns) (int64, error) {
	var err error
	if err = o.doBeforeUpdateHooks(ctx, exec); err != nil {
		return 0, err
	}
	key := makeCacheKey(columns, nil)
	userCreateCodeUpdateCacheMut.RLock()
	cache, cached := userCreateCodeUpdateCache[key]
	userCreateCodeUpdateCacheMut.RUnlock()

	if !cached {
		wl := columns.UpdateColumnSet(
			userCreateCodeColumns,
			userCreateCodePrimaryKeyColumns,
		)

		if !columns.IsWhitelist() {
			wl = strmangle.SetComplement(wl, []string{"created_at"})
		}
		if len(wl) == 0 {
			return 0, errors.New("models: unable to update user_create_codes, could not build whitelist")
		}

		cache.query = fmt.Sprintf("UPDATE `user_create_codes` SET %s WHERE %s",
			strmangle.SetParamNames("`", "`", 0, wl),
			strmangle.WhereClause("`", "`", 0, userCreateCodePrimaryKeyColumns),
		)
		cache.valueMapping, err = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, append(wl, userCreateCodePrimaryKeyColumns...))
		if err != nil {
			return 0, err
		}
	}

	values := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), cache.valueMapping)

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, cache.query)
		fmt.Fprintln(boil.DebugWriter, values)
	}

	var result sql.Result
	result, err = exec.ExecContext(ctx, cache.query, values...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update user_create_codes row")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by update for user_create_codes")
	}

	if !cached {
		userCreateCodeUpdateCacheMut.Lock()
		userCreateCodeUpdateCache[key] = cache
		userCreateCodeUpdateCacheMut.Unlock()
	}

	return rowsAff, o.doAfterUpdateHooks(ctx, exec)
}

// UpdateAll updates all rows with the specified column values.
func (q userCreateCodeQuery) UpdateAll(ctx context.Context, exec boil.ContextExecutor, cols M) (int64, error) {
	queries.SetUpdate(q.Query, cols)

	result, err := q.Query.ExecContext(ctx, exec)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update all for user_create_codes")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to retrieve rows affected for user_create_codes")
	}

	return rowsAff, nil
}

// UpdateAll updates all rows with the specified column values, using an executor.
func (o UserCreateCodeSlice) UpdateAll(ctx context.Context, exec boil.ContextExecutor, cols M) (int64, error) {
	ln := int64(len(o))
	if ln == 0 {
		return 0, nil
	}

	if len(cols) == 0 {
		return 0, errors.New("models: update all requires at least one column argument")
	}

	colNames := make([]string, len(cols))
	args := make([]interface{}, len(cols))

	i := 0
	for name, value := range cols {
		colNames[i] = name
		args[i] = value
		i++
	}

	// Append all of the primary key values for each column
	for _, obj := range o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), userCreateCodePrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := fmt.Sprintf("UPDATE `user_create_codes` SET %s WHERE %s",
		strmangle.SetParamNames("`", "`", 0, colNames),
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 0, userCreateCodePrimaryKeyColumns, len(o)))

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, sql)
		fmt.Fprintln(boil.DebugWriter, args...)
	}

	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update all in userCreateCode slice")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to retrieve rows affected all in update all userCreateCode")
	}
	return rowsAff, nil
}

var mySQLUserCreateCodeUniqueColumns = []string{
	"id",
	"code",
}

// Upsert attempts an insert using an executor, and does an update or ignore on conflict.
// See boil.Columns documentation for how to properly use updateColumns and insertColumns.
func (o *UserCreateCode) Upsert(ctx context.Context, exec boil.ContextExecutor, updateColumns, insertColumns boil.Columns) error {
	if o == nil {
		return errors.New("models: no user_create_codes provided for upsert")
	}
	currTime := time.Now().In(boil.GetLocation())

	if o.CreatedAt.IsZero() {
		o.CreatedAt = currTime
	}

	if err := o.doBeforeUpsertHooks(ctx, exec); err != nil {
		return err
	}

	nzDefaults := queries.NonZeroDefaultSet(userCreateCodeColumnsWithDefault, o)
	nzUniques := queries.NonZeroDefaultSet(mySQLUserCreateCodeUniqueColumns, o)

	if len(nzUniques) == 0 {
		return errors.New("cannot upsert with a table that cannot conflict on a unique column")
	}

	// Build cache key in-line uglily - mysql vs psql problems
	buf := strmangle.GetBuffer()
	buf.WriteString(strconv.Itoa(updateColumns.Kind))
	for _, c := range updateColumns.Cols {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	buf.WriteString(strconv.Itoa(insertColumns.Kind))
	for _, c := range insertColumns.Cols {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	for _, c := range nzDefaults {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	for _, c := range nzUniques {
		buf.WriteString(c)
	}
	key := buf.String()
	strmangle.PutBuffer(buf)

	userCreateCodeUpsertCacheMut.RLock()
	cache, cached := userCreateCodeUpsertCache[key]
	userCreateCodeUpsertCacheMut.RUnlock()

	var err error

	if !cached {
		insert, ret := insertColumns.InsertColumnSet(
			userCreateCodeColumns,
			userCreateCodeColumnsWithDefault,
			userCreateCodeColumnsWithoutDefault,
			nzDefaults,
		)
		update := updateColumns.UpdateColumnSet(
			userCreateCodeColumns,
			userCreateCodePrimaryKeyColumns,
		)

		if len(update) == 0 {
			return errors.New("models: unable to upsert user_create_codes, could not build update column list")
		}

		ret = strmangle.SetComplement(ret, nzUniques)
		cache.query = buildUpsertQueryMySQL(dialect, "user_create_codes", update, insert)
		cache.retQuery = fmt.Sprintf(
			"SELECT %s FROM `user_create_codes` WHERE %s",
			strings.Join(strmangle.IdentQuoteSlice(dialect.LQ, dialect.RQ, ret), ","),
			strmangle.WhereClause("`", "`", 0, nzUniques),
		)

		cache.valueMapping, err = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, insert)
		if err != nil {
			return err
		}
		if len(ret) != 0 {
			cache.retMapping, err = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, ret)
			if err != nil {
				return err
			}
		}
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	vals := queries.ValuesFromMapping(value, cache.valueMapping)
	var returns []interface{}
	if len(cache.retMapping) != 0 {
		returns = queries.PtrsFromMapping(value, cache.retMapping)
	}

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, cache.query)
		fmt.Fprintln(boil.DebugWriter, vals)
	}

	result, err := exec.ExecContext(ctx, cache.query, vals...)

	if err != nil {
		return errors.Wrap(err, "models: unable to upsert for user_create_codes")
	}

	var lastID int64
	var uniqueMap []uint64
	var nzUniqueCols []interface{}

	if len(cache.retMapping) == 0 {
		goto CacheNoHooks
	}

	lastID, err = result.LastInsertId()
	if err != nil {
		return ErrSyncFail
	}

	o.ID = uint(lastID)
	if lastID != 0 && len(cache.retMapping) == 1 && cache.retMapping[0] == userCreateCodeMapping["id"] {
		goto CacheNoHooks
	}

	uniqueMap, err = queries.BindMapping(userCreateCodeType, userCreateCodeMapping, nzUniques)
	if err != nil {
		return errors.Wrap(err, "models: unable to retrieve unique values for user_create_codes")
	}
	nzUniqueCols = queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), uniqueMap)

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, cache.retQuery)
		fmt.Fprintln(boil.DebugWriter, nzUniqueCols...)
	}

	err = exec.QueryRowContext(ctx, cache.retQuery, nzUniqueCols...).Scan(returns...)
	if err != nil {
		return errors.Wrap(err, "models: unable to populate default values for user_create_codes")
	}

CacheNoHooks:
	if !cached {
		userCreateCodeUpsertCacheMut.Lock()
		userCreateCodeUpsertCache[key] = cache
		userCreateCodeUpsertCacheMut.Unlock()
	}

	return o.doAfterUpsertHooks(ctx, exec)
}

// Delete deletes a single UserCreateCode record with an executor.
// Delete will match against the primary key column to find the record to delete.
func (o *UserCreateCode) Delete(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if o == nil {
		return 0, errors.New("models: no UserCreateCode provided for delete")
	}

	if err := o.doBeforeDeleteHooks(ctx, exec); err != nil {
		return 0, err
	}

	args := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), userCreateCodePrimaryKeyMapping)
	sql := "DELETE FROM `user_create_codes` WHERE `id`=?"

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, sql)
		fmt.Fprintln(boil.DebugWriter, args...)
	}

	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete from user_create_codes")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by delete for user_create_codes")
	}

	if err := o.doAfterDeleteHooks(ctx, exec); err != nil {
		return 0, err
	}

	return rowsAff, nil
}

// DeleteAll deletes all matching rows.
func (q userCreateCodeQuery) DeleteAll(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if q.Query == nil {
		return 0, errors.New("models: no userCreateCodeQuery provided for delete all")
	}

	queries.SetDelete(q.Query)

	result, err := q.Query.ExecContext(ctx, exec)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete all from user_create_codes")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by deleteall for user_create_codes")
	}

	return rowsAff, nil
}

// DeleteAll deletes all rows in the slice, using an executor.
func (o UserCreateCodeSlice) DeleteAll(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if o == nil {
		return 0, errors.New("models: no UserCreateCode slice provided for delete all")
	}

	if len(o) == 0 {
		return 0, nil
	}

	if len(userCreateCodeBeforeDeleteHooks) != 0 {
		for _, obj := range o {
			if err := obj.doBeforeDeleteHooks(ctx, exec); err != nil {
				return 0, err
			}
		}
	}

	var args []interface{}
	for _, obj := range o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), userCreateCodePrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := "DELETE FROM `user_create_codes` WHERE " +
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 0, userCreateCodePrimaryKeyColumns, len(o))

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, sql)
		fmt.Fprintln(boil.DebugWriter, args)
	}

	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete all from userCreateCode slice")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by deleteall for user_create_codes")
	}

	if len(userCreateCodeAfterDeleteHooks) != 0 {
		for _, obj := range o {
			if err := obj.doAfterDeleteHooks(ctx, exec); err != nil {
				return 0, err
			}
		}
	}

	return rowsAff, nil
}

// Reload refetches the object from the database
// using the primary keys with an executor.
func (o *UserCreateCode) Reload(ctx context.Context, exec boil.ContextExecutor) error {
	ret, err := FindUserCreateCode(ctx, exec, o.ID)
	if err != nil {
		return err
	}

	*o = *ret
	return nil
}

// ReloadAll refetches every row with matching primary key column values
// and overwrites the original object slice with the newly updated slice.
func (o *UserCreateCodeSlice) ReloadAll(ctx context.Context, exec boil.ContextExecutor) error {
	if o == nil || len(*o) == 0 {
		return nil
	}

	slice := UserCreateCodeSlice{}
	var args []interface{}
	for _, obj := range *o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), userCreateCodePrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := "SELECT `user_create_codes`.* FROM `user_create_codes` WHERE " +
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 0, userCreateCodePrimaryKeyColumns, len(*o))

	q := queries.Raw(sql, args...)

	err := q.Bind(ctx, exec, &slice)
	if err != nil {
		return errors.Wrap(err, "models: unable to reload all in UserCreateCodeSlice")
	}

	*o = slice

	return nil
}

// UserCreateCodeExists checks if the UserCreateCode row exists.
func UserCreateCodeExists(ctx context.Context, exec boil.ContextExecutor, iD uint) (bool, error) {
	var exists bool
	sql := "select exists(select 1 from `user_create_codes` where `id`=? limit 1)"

	if boil.DebugMode {
		fmt.Fprintln(boil.DebugWriter, sql)
		fmt.Fprintln(boil.DebugWriter, iD)
	}

	row := exec.QueryRowContext(ctx, sql, iD)

	err := row.Scan(&exists)
	if err != nil {
		return false, errors.Wrap(err, "models: unable to check if user_create_codes exists")
	}

	return exists, nil
}