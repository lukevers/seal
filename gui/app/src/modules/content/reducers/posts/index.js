import {
    CLEAR_NEW_POST_DATA,
    REQUEST_POSTS,
    RECEIVE_POSTS,
    EDITED_POST,
    SWITCH_TAB,
} from '../../actions/posts';

import Html from 'slate-html-serializer';

const getNewPost = () => {
    return {
        title: 'New Post',
        content: JSON.stringify((new Html()).deserialize('<p>Content</p>', {toJSON: true})),
    };
}

const initialState = {
    error: null,
    items: [],
    loaded: false,
    edited: {
        new: getNewPost(),
    },
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
        case CLEAR_NEW_POST_DATA:
            state.edited['new'] = getNewPost();

            return {
                ...state,
            };
        default:
            return state;
    }
};

export default reducer;