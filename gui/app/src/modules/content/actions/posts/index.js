/** @jsx jsx */
import { jsx } from '@emotion/core';

import Conn from '../../../../lib/conn/';
import Html from 'slate-html-serializer';
import { Value } from 'slate';

import {
    fetchSettingsIfNeeded,
} from '../settings';

export const CLEAR_EDITED_POST = 'POSTS_CLEAR_EDITED_POST';
export const CLEAR_NEW_POST_DATA = 'POSTS_CLEAR_NEW_POST_DATA';
export const REQUEST_POSTS = 'POSTS_REQUEST_POSTS';
export const RECEIVE_POSTS = 'POSTS_RECEIVE_POSTS';
export const EDITED_POST = 'POSTS_EDITED_POST';
export const SWITCH_TAB = 'POSTS_SWITCH_TAB';

function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

function clearEditedPost(id) {
    return {
        type: CLEAR_EDITED_POST,
        id: id,
    }
}

function receivePosts(data) {
    return {
        type: RECEIVE_POSTS,
        posts: data.data || [],
        error: data.error,
    }
}

function getTeamId(state) {
    let teamid = state.settings.items.filter(item => item.key === 'teamid')[0].value;
    teamid = parseInt(teamid, 10);
    return teamid;
}

function fetchPosts() {
    return async (dispatch, getState) => {
        await dispatch(fetchSettingsIfNeeded());

        const state = getState();
        if (state.posts.tab !== 'new') {
            dispatch(requestPosts());
            const data = await Conn.load('posts', `all&team=${getTeamId(state)}`);
            dispatch(receivePosts(data));
        } else {
            dispatch(requestPosts());
            dispatch(receivePosts([]));
        }
    }
}

export function fetchPostsIfNeeded(force = false) {
    return (dispatch, getState) => {
        const { posts } = getState();
        if (force || !posts.loaded || posts.items.length < 1) {
            return dispatch(fetchPosts());
        }
    }
}

export function postEdited(post, key, value) {
    post[key] = value;

    return {
        type: EDITED_POST,
        post
    }
}

export function postSave(post, cb) {
    return async (dispatch, getState) => {
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
                                case 'image':
                                    return <img src={obj.data.get('src')} alt=""/>
                                case 'pre-code':
                                    const language = obj.data.get('language');
                                    return <pre className="code-block"><code className={`language-${language}`}>{children}</code></pre>
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
                                case 'link':
                                    return <a href={obj.data.get('href')}>{children}</a>
                                default:
                                    break;
                            }
                        }
                    },
                }
            ],
        });

        // Generate HTML
        post.html = html.serialize(Value.fromJSON(JSON.parse(post.content)));

        // Create or update the post
        let response;
        if (typeof post.id === 'undefined') {
            post.owned_by_id = getTeamId(getState());
            response = await Conn.post('post', post);
        } else {
            response = await Conn.sync('post', post);
        }

        if (response.error) {
            // TODO: error feedback
            console.log(response.error)
        } else {
            // TODO: success feedback
            await dispatch(clearEditedPost(post.id));

            if (cb) {
                cb();
            }
        }
    }
}

export function clearNewPostData() {
    return {
        type: CLEAR_NEW_POST_DATA,
    };
}

export function switchTab(tab) {
    return {
        type: SWITCH_TAB,
        tab: tab,
    }
}
