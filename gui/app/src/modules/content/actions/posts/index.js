import Conn from '../../../../lib/conn/';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

function receivePosts(data) {
    return {
        type: RECEIVE_POSTS,
        posts: data,
        receivedAt: Date.now(),
    }
}

function fetchPosts() {
    return async (dispatch) => {
        dispatch(requestPosts());
        const data = await Conn.load('posts', '--all');
        dispatch(receivePosts(data));
    }
}

function shouldFetchPosts(state) {
    if (state.posts.loaded) {
        return false;
    }

    return true;
}

export function fetchPostsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState())) {
            return dispatch(fetchPosts());
        }
    }
}
