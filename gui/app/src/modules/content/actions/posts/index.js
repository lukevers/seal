import Conn from '../../../../lib/conn/';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const EDITED_POST = 'EDITED_POST';
export const SWITCH_TAB = 'SWITCH_TAB';

function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

function receivePosts(data) {
    return {
        type: RECEIVE_POSTS,
        posts: data.data || [],
        error: data.error,
    }
}

function fetchPosts() {
    return async (dispatch, getState) => {
        const state = getState();

        if (state.posts.tab !== 'new') {
            dispatch(requestPosts());
            const data = await Conn.load('posts', state.posts.tab);
            dispatch(receivePosts(data));
        } else {
            dispatch(requestPosts());
            dispatch(receivePosts([]));
        }
    }
}

export function fetchPostsIfNeeded() {
    return (dispatch, getState) => {
        return dispatch(fetchPosts());
    }
}

export function postEdited(post, key, value) {
    post[key] = value;

    return {
        type: EDITED_POST,
        post
    }
}

export function postSave(post) {
    return async (dispatch) => {
        await Conn.sync('post', post);
    }
}

export function switchTab(tab) {
    return {
        type: SWITCH_TAB,
        tab: tab,
    }
}
