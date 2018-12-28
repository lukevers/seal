import Conn from '../../../../lib/conn/';
import { initialState } from '../../reducers/settings';

export const REQUEST_SETTINGS = 'SETTINGS_REQUEST_SETTINGS';
export const RECEIVE_SETTINGS = 'SETTINGS_RECEIVE_SETTINGS';
export const EDITED_SETTING = 'SETTINGS_EDITED_SETTING';
export const SWITCH_TAB = 'SETTINGS_SWITCH_TAB';

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

export function switchTab(tab) {
    return {
        type: SWITCH_TAB,
        tab: tab,
    }
}
