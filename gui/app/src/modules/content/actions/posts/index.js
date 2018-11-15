import Conn from '../../../../lib/conn/';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const EDITED_POST = 'EDITED_POST';

function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

function receivePosts(data) {
    return {
        type: RECEIVE_POSTS,
        posts: data.data,
        error: data.error,
    }
}

function fetchPosts() {
    return async (dispatch) => {
        dispatch(requestPosts());
        const data = await Conn.load('posts', '--all');
        dispatch(receivePosts(data));
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
