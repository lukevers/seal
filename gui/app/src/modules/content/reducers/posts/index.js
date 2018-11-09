import {
    REQUEST_POSTS,
    RECEIVE_POSTS,
} from '../../actions/posts';

const initialState = {
    error: null,
    posts: [],
    loaded: false,
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
                error: action.posts.error,
                posts: action.posts.data,
            };
        default:
            return state;
    }
};

export default reducer;

export const getIsLoaded = state => state.loaded;
export const getError = state => state.error;
export const getPosts = state => state.posts;
