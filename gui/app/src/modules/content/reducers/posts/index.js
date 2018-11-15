import {
    REQUEST_POSTS,
    RECEIVE_POSTS,
    EDITED_POST,
} from '../../actions/posts';

const initialState = {
    error: null,
    items: [],
    loaded: false,
    edited: {},
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
        default:
            return state;
    }
};

export default reducer;

export const getIsLoaded = state => state.loaded;
export const getError = state => state.error;
export const getPosts = state => state.posts;
