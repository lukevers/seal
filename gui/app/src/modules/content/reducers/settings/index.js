import {
    REQUEST_SETTINGS,
    RECEIVE_SETTINGS,
    EDITED_SETTING,
    SWITCH_TAB,
    REQUEST_TEAMS,
    RECEIVE_TEAMS,
} from '../../actions/settings';

export const initialState = {
    error: null,
    items: [
        {
            key: "url",
            value: "",
        },
        {
            key: "email",
            value: "",
        },
        {
            key: "password",
            value: "",
        },
        {
            key: "teamid",
            value: '0',
        },
    ],
    loaded: false,
    edited: {},
    tab: 'general',
    teams: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_SETTINGS:
            return {
                ...state,
                error: null,
                loaded: false,
            };
        case RECEIVE_SETTINGS:
            return {
                ...state,
                loaded: true,
                error: action.error,
                items: action.settings,
            };
        case EDITED_SETTING:
            state.edited[action.key] = action.value;

            return {
                ...state,
            };
        case SWITCH_TAB:
            return {
                ...state,
                tab: action.tab,
            };
        case REQUEST_TEAMS:
            return {
                ...state,
                error: null,
                loaded: false,
            };
        case RECEIVE_TEAMS:
            return {
                ...state,
                // TODO
            };
        default:
            return state;
    }
};

export default reducer;