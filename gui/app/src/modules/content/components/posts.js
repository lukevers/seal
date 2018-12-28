/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink } from "react-router-dom";
import { themes } from '../../../base/themes';

import TextEditor from '../../../components/TextEditor';

import {
    BiGridHorizontalWrapper,
    BiGridHorizontalSidebar,
    BiGridHorizontalContent,
    BiGridVerticalWrapper,
    BiGridVerticalHeader,
    BiGridVerticalContent,
} from '../../../components/BiGrid';

import {
    fetchPostsIfNeeded,
    postEdited,
    postSave,
    switchTab,
    clearNewPostData,
} from '../actions/posts/';

const SidebarItem = ({ post, match }) => (
    <NavLink to={`${match.url}/${post.id}`} activeClassName="active">
        <div>
            {post.title}
        </div>
    </NavLink>
);

class Content extends Component {
    componentWillUpdate(props) {
        const { dispatch } = props;

        if (this.props.match.params.id !== props.match.params.id) {
            dispatch(fetchPostsIfNeeded());
        }
    }

    handleChange = (value, key) => {
        const { dispatch } = this.props;
        dispatch(postEdited(this.getPost(), key, value));
    }

    savePost = () => {
        const { dispatch, history } = this.props;
        dispatch(postSave(this.getPost()));
        dispatch(clearNewPostData());

        if (this.props.new) {
            this.props.dispatch(switchTab('all'));
            history.push('/posts');
            dispatch(fetchPostsIfNeeded());
        }
    }

    getPost = () => {
        let id = 'new';
        let post;

        if (!this.props.new) {
            id = parseInt(this.props.match.params.id);
            post = this.props.items.reduce((result, item) => {
                if (id === item.id) {
                    result = item;
                }

                return result;
            });
        }

        if (typeof this.props.edited[id] != 'undefined') {
            post = this.props.edited[id];
        }

        return post;
    }

    render() {
        const post = this.getPost();

        if (post === null) {
            return <div>Could not find post!</div>;
        } else {
            return (
                <div css={css`
                    padding: 1em;

                    button {
                        margin-top: 1.5em;
                        border: 0;
                        padding: 1em;
                        background-color: ${themes.standard.primary};
                        color: ${themes.standard.white};
                        cursor: pointer;

                        &:hover {
                            background-color: ${themes.standard.darker.primary};
                        }
                    }

                `}>
                    <div css={css`
                        font-size: 1.5em;
                        color: ${themes.standard.secondary};
                        margin-bottom: .75em;
                        line-height: 1.25em;
                    `}>
                        <TextEditor
                            value={post.title}
                            plaintext
                            onChange={(value) => this.handleChange(value, 'title')}
                        />
                    </div>

                    <div css={css`
                        color: ${themes.standard.black};
                        padding: 1em;
                        padding-top: .5em;
                        border: 1px solid ${themes.standard.lightgray};
                    `}>
                        <TextEditor
                            toolbar
                            value={JSON.parse(post.content)}
                            onChange={(value) => this.handleChange(value, 'content')}
                        />
                    </div>

                    <button onClick={this.savePost}>Save</button>
                </div>
            );
        }
    }
}

class Posts extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchPostsIfNeeded());
    }

    changePostsTab = (e) => {
        const { dispatch, tab, history } = this.props;
        const tabTarget = e.target.dataset.posts;

        if (tab !== tabTarget) {
            dispatch(switchTab(tabTarget));
            history.push('/posts');
            dispatch(fetchPostsIfNeeded());
        }
    }

    render() {
        const { items, tab, error, loaded } = this.props;

        if (error) {
            return (
                <pre>
                    <code>{error}</code>
                </pre>
            );
        } else {
            return (
                <BiGridVerticalWrapper>
                    <BiGridVerticalHeader>
                        <ul css={css`
                            height: 100%;
                            background-color: ${themes.standard.white};
                            font-size: .75em;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            display: flex;
                            align-items: center;

                            li {
                                padding: 1em;
                                color: ${themes.standard.gray};
                                cursor: pointer;

                                &.active {
                                    color: ${themes.standard.black};
                                }
                            }
                        `}>
                            <li className={tab === 'all' ? 'active' : ''} data-posts="all" onClick={this.changePostsTab}>All Posts</li>
                            <li className={tab === 'published' ? 'active' : ''}  data-posts="published" onClick={this.changePostsTab}>Published</li>
                            <li className={tab === 'drafts' ? 'active' : ''} data-posts="drafts" onClick={this.changePostsTab}>Drafts</li>
                            <li className={tab === 'archived' ? 'active' : ''} data-posts="archived" onClick={this.changePostsTab}>Archived</li>
                            <li className={tab === 'new' ? 'active' : ''} data-posts="new" onClick={this.changePostsTab}>Add New</li>
                        </ul>
                    </BiGridVerticalHeader>
                    <BiGridVerticalContent>
                        <BiGridHorizontalWrapper columns={tab === 'new' ? '0px auto' : '200px auto'}>
                            <BiGridHorizontalSidebar>
                                <div css={css`
                                    border-right: 1px solid ${themes.standard.lightgray};
                                    height: 100%;

                                    a {
                                        padding: 1em;
                                        text-decoration: none;
                                        display: block;
                                        color: ${themes.standard.black};
                                        border-bottom: 1px solid ${themes.standard.lightestgray};
                                        border-left: 3px solid transparent;
                                        line-height: 1.25em;

                                        &:hover {
                                            background-color: ${themes.standard.lightestgray};
                                        }

                                        &.active {
                                            border-left: 3px solid ${themes.standard.primary};
                                        }
                                    }
                                `}>
                                    {items.map((post, index) => (
                                       <SidebarItem key={index} match={this.props.match} post={post} />
                                    ))}
                                </div>
                            </BiGridHorizontalSidebar>
                            <BiGridHorizontalContent>
                                {loaded
                                    ?
                                        tab === 'new' ? <Content {...this.props} new={true}/> :
                                        <Route path={`${this.props.match.path}/:id`} render={(props, routeProps) => (
                                            <Content {...routeProps} {...this.props} {...props} />
                                        )} />
                                    : <div>{/*loading*/}</div>
                                }
                            </BiGridHorizontalContent>
                        </BiGridHorizontalWrapper>
                    </BiGridVerticalContent>
                </BiGridVerticalWrapper>
            );
        }
    }
}

const mapStateToProps = state => ({
    loaded: state.posts.loaded,
    error: state.posts.error,
    items: state.posts.items,
    tab: state.posts.tab,
    edited: state.posts.edited,
});

export default connect(mapStateToProps)(Posts);
