/** @jsx jsx */
import { jsx } from '@emotion/core';

import Conn from '../../../../lib/conn/';
import Html from 'slate-html-serializer';
import { Value } from 'slate';

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
        const html = new Html({
            rules: [
                {
                    serialize(obj, children) {
                        if (obj.object === 'block') {
                            switch (obj.type) {
                                case 'paragraph':
                                    return <p className={obj.data.get('className')}>{children}</p>
                                case 'block-quote':
                                    return <blockquote>{children}</blockquote>
                                case 'bulleted-list':
                                    return <ul>{children}</ul>
                                case 'numbered-list':
                                    return <ol>{children}</ol>
                                case 'list-item':
                                    return <li>{children}</li>
                                case 'heading-one':
                                    return <h1>{children}</h1>
                                case 'heading-two':
                                    return <h2>{children}</h2>
                                case 'heading-three':
                                    return <h3>{children}</h3>
                                case 'heading-four':
                                    return <h4>{children}</h4>
                                case 'heading-five':
                                    return <h5>{children}</h5>
                                case 'heading-six':
                                    return <h6>{children}</h6>
                                default:
                                    break;
                            }
                        }
                    },
                },
                {
                    serialize(obj, children) {
                        if (obj.object === 'mark') {
                            switch (obj.type) {
                                case 'bold':
                                    return <strong>{children}</strong>
                                case 'italic':
                                    return <em>{children}</em>
                                case 'underlined':
                                    return <u>{children}</u>
                                case 'code':
                                    return <code>{children}</code>
                                default:
                                    break;
                            }
                        }
                    },
                }
            ],
        });

        post.html = html.serialize(Value.fromJSON(JSON.parse(post.content)));
        await Conn.sync('post', post);
    }
}

export function switchTab(tab) {
    return {
        type: SWITCH_TAB,
        tab: tab,
    }
}
