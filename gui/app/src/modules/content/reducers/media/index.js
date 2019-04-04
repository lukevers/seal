import {
    REQUEST_MEDIA,
    RECEIVE_MEDIA,
} from '../../actions/media';

const initialState = {
    error: null,
    items: [],
    loaded: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_MEDIA:
            return {
                ...state,
                error: null,
                loaded: false,
            };
        case RECEIVE_MEDIA:
            console.log(action);

            return {
                ...state,
                loaded: true,
                error: action.error,
                items: action.items,
            };
        default:
            return state;
    }
};

export default reducer;