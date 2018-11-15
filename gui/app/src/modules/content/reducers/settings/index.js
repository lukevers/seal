import {
    REQUEST_SETTINGS,
    RECEIVE_SETTINGS,
    EDITED_SETTING,
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
    ],
    loaded: false,
    edited: {},
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
        default:
            return state;
    }
};

export default reducer;

export const getIsLoaded = state => state.loaded;
export const getError = state => state.error;
export const getSettings = state => state.settings;
