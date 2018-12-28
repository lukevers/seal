import {
    REQUEST_POSTS,
    RECEIVE_POSTS,
    EDITED_POST,
    SWITCH_TAB,
} from '../../actions/posts';

const initialState = {
    error: null,
    items: [],
    loaded: false,
    edited: {},
    tab: 'all',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_POSTS:
            return {
                ...state,
                error: null,
                loaded: false,
            };
        case RECEIVE_POSTS:
            return {
                ...state,
                loaded: true,
                error: action.error,
                items: action.posts,
            };
        case EDITED_POST:
            state.edited[action.post.id] = action.post;

            return {
                ...state,
            };
        case SWITCH_TAB:
            return {
                ...state,
                tab: action.tab,
            };
        default:
            return state;
    }
};

export default reducer;