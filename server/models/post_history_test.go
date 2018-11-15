// Code generated by SQLBoiler (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"bytes"
	"context"
	"reflect"
	"testing"

	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries"
	"github.com/volatiletech/sqlboiler/randomize"
	"github.com/volatiletech/sqlboiler/strmangle"
)

var (
	// Relationships sometimes use the reflection helper queries.Equal/queries.Assign
	// so force a package dependency in case they don't.
	_ = queries.Equal
)

func testPostHistories(t *testing.T) {
	t.Parallel()

	query := PostHistories()

	if query.Query == nil {
		t.Error("expected a query, got nothing")
	}
}

func testPostHistoriesDelete(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := o.Delete(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testPostHistoriesQueryDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if rowsAff, err := PostHistories().DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testPostHistoriesSliceDeleteAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := PostHistorySlice{o}

	if rowsAff, err := slice.DeleteAll(ctx, tx); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only have deleted one row, but affected:", rowsAff)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 0 {
		t.Error("want zero records, got:", count)
	}
}

func testPostHistoriesExists(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	e, err := PostHistoryExists(ctx, tx, o.ID, o.Revision)
	if err != nil {
		t.Errorf("Unable to check if PostHistory exists: %s", err)
	}
	if !e {
		t.Errorf("Expected PostHistoryExists to return true, but got false.")
	}
}

func testPostHistoriesFind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	postHistoryFound, err := FindPostHistory(ctx, tx, o.ID, o.Revision)
	if err != nil {
		t.Error(err)
	}

	if postHistoryFound == nil {
		t.Error("want a record, got nil")
	}
}

func testPostHistoriesBind(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = PostHistories().Bind(ctx, tx, o); err != nil {
		t.Error(err)
	}
}

func testPostHistoriesOne(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if x, err := PostHistories().One(ctx, tx); err != nil {
		t.Error(err)
	} else if x == nil {
		t.Error("expected to get a non nil record")
	}
}

func testPostHistoriesAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	postHistoryOne := &PostHistory{}
	postHistoryTwo := &PostHistory{}
	if err = randomize.Struct(seed, postHistoryOne, postHistoryDBTypes, false, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}
	if err = randomize.Struct(seed, postHistoryTwo, postHistoryDBTypes, false, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = postHistoryOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = postHistoryTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := PostHistories().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 2 {
		t.Error("want 2 records, got:", len(slice))
	}
}

func testPostHistoriesCount(t *testing.T) {
	t.Parallel()

	var err error
	seed := randomize.NewSeed()
	postHistoryOne := &PostHistory{}
	postHistoryTwo := &PostHistory{}
	if err = randomize.Struct(seed, postHistoryOne, postHistoryDBTypes, false, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}
	if err = randomize.Struct(seed, postHistoryTwo, postHistoryDBTypes, false, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = postHistoryOne.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}
	if err = postHistoryTwo.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 2 {
		t.Error("want 2 records, got:", count)
	}
}

func postHistoryBeforeInsertHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryAfterInsertHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryAfterSelectHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryBeforeUpdateHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryAfterUpdateHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryBeforeDeleteHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryAfterDeleteHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryBeforeUpsertHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func postHistoryAfterUpsertHook(ctx context.Context, e boil.ContextExecutor, o *PostHistory) error {
	*o = PostHistory{}
	return nil
}

func testPostHistoriesHooks(t *testing.T) {
	t.Parallel()

	var err error

	ctx := context.Background()
	empty := &PostHistory{}
	o := &PostHistory{}

	seed := randomize.NewSeed()
	if err = randomize.Struct(seed, o, postHistoryDBTypes, false); err != nil {
		t.Errorf("Unable to randomize PostHistory object: %s", err)
	}

	AddPostHistoryHook(boil.BeforeInsertHook, postHistoryBeforeInsertHook)
	if err = o.doBeforeInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeInsertHook function to empty object, but got: %#v", o)
	}
	postHistoryBeforeInsertHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.AfterInsertHook, postHistoryAfterInsertHook)
	if err = o.doAfterInsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterInsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterInsertHook function to empty object, but got: %#v", o)
	}
	postHistoryAfterInsertHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.AfterSelectHook, postHistoryAfterSelectHook)
	if err = o.doAfterSelectHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterSelectHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterSelectHook function to empty object, but got: %#v", o)
	}
	postHistoryAfterSelectHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.BeforeUpdateHook, postHistoryBeforeUpdateHook)
	if err = o.doBeforeUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpdateHook function to empty object, but got: %#v", o)
	}
	postHistoryBeforeUpdateHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.AfterUpdateHook, postHistoryAfterUpdateHook)
	if err = o.doAfterUpdateHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpdateHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpdateHook function to empty object, but got: %#v", o)
	}
	postHistoryAfterUpdateHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.BeforeDeleteHook, postHistoryBeforeDeleteHook)
	if err = o.doBeforeDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeDeleteHook function to empty object, but got: %#v", o)
	}
	postHistoryBeforeDeleteHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.AfterDeleteHook, postHistoryAfterDeleteHook)
	if err = o.doAfterDeleteHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterDeleteHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterDeleteHook function to empty object, but got: %#v", o)
	}
	postHistoryAfterDeleteHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.BeforeUpsertHook, postHistoryBeforeUpsertHook)
	if err = o.doBeforeUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doBeforeUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected BeforeUpsertHook function to empty object, but got: %#v", o)
	}
	postHistoryBeforeUpsertHooks = []PostHistoryHook{}

	AddPostHistoryHook(boil.AfterUpsertHook, postHistoryAfterUpsertHook)
	if err = o.doAfterUpsertHooks(ctx, nil); err != nil {
		t.Errorf("Unable to execute doAfterUpsertHooks: %s", err)
	}
	if !reflect.DeepEqual(o, empty) {
		t.Errorf("Expected AfterUpsertHook function to empty object, but got: %#v", o)
	}
	postHistoryAfterUpsertHooks = []PostHistoryHook{}
}

func testPostHistoriesInsert(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testPostHistoriesInsertWhitelist(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Whitelist(postHistoryColumnsWithoutDefault...)); err != nil {
		t.Error(err)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}
}

func testPostHistoriesReload(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	if err = o.Reload(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testPostHistoriesReloadAll(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice := PostHistorySlice{o}

	if err = slice.ReloadAll(ctx, tx); err != nil {
		t.Error(err)
	}
}

func testPostHistoriesSelect(t *testing.T) {
	t.Parallel()

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	slice, err := PostHistories().All(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if len(slice) != 1 {
		t.Error("want one record, got:", len(slice))
	}
}

var (
	postHistoryDBTypes = map[string]string{`Action`: `enum('insert','update','delete')`, `CreatedAt`: `timestamp`, `CreatedByID`: `int`, `DeletedAt`: `timestamp`, `DeletedByID`: `int`, `HTML`: `mediumtext`, `ID`: `int`, `Markdown`: `mediumtext`, `OwnedByID`: `int`, `PublishedAt`: `timestamp`, `RevisedAt`: `timestamp`, `Revision`: `int`, `Slug`: `varchar`, `Status`: `enum('draft','published','deleted')`, `Title`: `varchar`, `UpdatedAt`: `timestamp`, `UpdatedByID`: `int`}
	_                  = bytes.MinRead
)

func testPostHistoriesUpdate(t *testing.T) {
	t.Parallel()

	if 0 == len(postHistoryPrimaryKeyColumns) {
		t.Skip("Skipping table with no primary key columns")
	}
	if len(postHistoryColumns) == len(postHistoryPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	if rowsAff, err := o.Update(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("should only affect one row but affected", rowsAff)
	}
}

func testPostHistoriesSliceUpdateAll(t *testing.T) {
	t.Parallel()

	if len(postHistoryColumns) == len(postHistoryPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}

	seed := randomize.NewSeed()
	var err error
	o := &PostHistory{}
	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryColumnsWithDefault...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Insert(ctx, tx, boil.Infer()); err != nil {
		t.Error(err)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}

	if count != 1 {
		t.Error("want one record, got:", count)
	}

	if err = randomize.Struct(seed, o, postHistoryDBTypes, true, postHistoryPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	// Remove Primary keys and unique columns from what we plan to update
	var fields []string
	if strmangle.StringSliceMatch(postHistoryColumns, postHistoryPrimaryKeyColumns) {
		fields = postHistoryColumns
	} else {
		fields = strmangle.SetComplement(
			postHistoryColumns,
			postHistoryPrimaryKeyColumns,
		)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	typ := reflect.TypeOf(o).Elem()
	n := typ.NumField()

	updateMap := M{}
	for _, col := range fields {
		for i := 0; i < n; i++ {
			f := typ.Field(i)
			if f.Tag.Get("boil") == col {
				updateMap[col] = value.Field(i).Interface()
			}
		}
	}

	slice := PostHistorySlice{o}
	if rowsAff, err := slice.UpdateAll(ctx, tx, updateMap); err != nil {
		t.Error(err)
	} else if rowsAff != 1 {
		t.Error("wanted one record updated but got", rowsAff)
	}
}

func testPostHistoriesUpsert(t *testing.T) {
	t.Parallel()

	if len(postHistoryColumns) == len(postHistoryPrimaryKeyColumns) {
		t.Skip("Skipping table with only primary key columns")
	}
	if len(mySQLPostHistoryUniqueColumns) == 0 {
		t.Skip("Skipping table with no unique columns to conflict on")
	}

	seed := randomize.NewSeed()
	var err error
	// Attempt the INSERT side of an UPSERT
	o := PostHistory{}
	if err = randomize.Struct(seed, &o, postHistoryDBTypes, false); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	ctx := context.Background()
	tx := MustTx(boil.BeginTx(ctx, nil))
	defer func() { _ = tx.Rollback() }()
	if err = o.Upsert(ctx, tx, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert PostHistory: %s", err)
	}

	count, err := PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}

	// Attempt the UPDATE side of an UPSERT
	if err = randomize.Struct(seed, &o, postHistoryDBTypes, false, postHistoryPrimaryKeyColumns...); err != nil {
		t.Errorf("Unable to randomize PostHistory struct: %s", err)
	}

	if err = o.Upsert(ctx, tx, boil.Infer(), boil.Infer()); err != nil {
		t.Errorf("Unable to upsert PostHistory: %s", err)
	}

	count, err = PostHistories().Count(ctx, tx)
	if err != nil {
		t.Error(err)
	}
	if count != 1 {
		t.Error("want one record, got:", count)
	}
}
