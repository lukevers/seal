import Conn from '../../../../lib/conn/';
import { initialState } from '../../reducers/settings';

export const REQUEST_SETTINGS = 'SETTINGS_REQUEST_SETTINGS';
export const RECEIVE_SETTINGS = 'SETTINGS_RECEIVE_SETTINGS';
export const EDITED_SETTING = 'SETTINGS_EDITED_SETTING';
export const SWITCH_TAB = 'SETTINGS_SWITCH_TAB';
export const REQUEST_TEAMS = 'SETTINGS_REQUEST_TEAMS';
export const RECEIVE_TEAMS = 'SETTINGS_RECEIVE_TEAMS';

function requestSettings() {
    return {
        type: REQUEST_SETTINGS,
    }
}

function receiveSettings(data) {
    return {
        type: RECEIVE_SETTINGS,
        settings: data.data,
        error: data.error,
    }
}

function requestTeams() {
    return {
        type: REQUEST_TEAMS,
    }
}

function receiveTeams(data) {
    return {
        type: RECEIVE_TEAMS,
        teams: data.data,
        error: data.error,
    }
}

function fetchSettings() {
    return async (dispatch, getState) => {
        dispatch(requestSettings());

        const state = getState();
        let how = initialState;
        if (state.settings) {
            how = state.settings;
        }

        const data = await Conn.load('settings', JSON.stringify(how.items));
        dispatch(receiveSettings(data));
    }
}

export function fetchSettingsIfNeeded() {
    return (dispatch, getState) => {
        return dispatch(fetchSettings());
    }
}

export function settingEdited(key, value) {
    return {
        type: EDITED_SETTING,
        key: key,
        value: value,
    }
}

export function settingsSave(settings) {
    return async (dispatch) => {
        const update = [];

        Object.keys(settings).map((key) => {
            update.push({
                key: key,
                value: settings[key],
            });

            return key;
        });

        await Conn.sync('settings', update);
    }
}

function getTeams() {
    return async (dispatch) => {
        dispatch(requestTeams());
        const data = await Conn.load('teams', 'all');
        dispatch(receiveTeams(data));
    }
}

export function getTeamsIfNeeded() {
    return (dispatch, getState) => {
        return dispatch(getTeams());
    }
}

export function switchTab(tab) {
    return {
        type: SWITCH_TAB,
        tab: tab,
    }
}
