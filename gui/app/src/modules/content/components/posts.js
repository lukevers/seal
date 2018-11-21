/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink } from "react-router-dom";
import { themes } from '../../../base/themes';
import * as Showdown from "showdown";
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

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
} from '../actions/posts/';

import {
    getIsLoaded,
    getError,
    getPosts,
} from '../reducers/posts/';

const SidebarItem = ({ post, match }) => (
    <NavLink to={`${match.url}/${post.id}`} activeClassName="active">
        <div>
            {post.title}
        </div>
    </NavLink>
);

class Content extends Component {
    converter: Showdown.Converter;

    constructor(props) {
        super(props);

        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true
        });
    }

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
        const { dispatch } = this.props;
        dispatch(postSave(this.getPost()));
    }

    getPost = () => {
        const id = parseInt(this.props.match.params.id);
        let post = this.props.posts.items.reduce((result, item) => {
            if (id === item.id) {
                result = item;
            }

            return result;
        });

        if (typeof this.props.posts.edited[id] != 'undefined') {
            post = this.props.posts.edited[id];
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
                    .react-mde, .mde-header {
                        border-radius: 0;
                    }

                    .DraftEditor-root, .DraftEditor-editorContainer, .public-DraftEditor-content {
                        height: 100%;
                    }
                `}>
                    <button onClick={this.savePost}>Save</button>
                    <input
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={(e) => this.handleChange(e.target.value, 'title')}
                    />
                    <ReactMde
                        value={post.markdown}
                        onChange={(e) => this.handleChange(e, 'markdown')}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(this.converter.makeHtml(markdown))
                        }
                    />
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
        const { dispatch, posts, history } = this.props;
        const tab = e.target.dataset.posts;

        if (posts.tab !== tab) {
            dispatch(switchTab(tab));
            history.push('/posts');
            dispatch(fetchPostsIfNeeded());
        }
    }

    render() {
        const { posts } = this.props;

        if (posts.error) {
            return (
                <pre>
                    <code>{posts.error}</code>
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
                            <li className={posts.tab === 'all' ? 'active' : ''} data-posts="all" onClick={this.changePostsTab}>All Posts</li>
                            <li className={posts.tab === 'published' ? 'active' : ''}  data-posts="published" onClick={this.changePostsTab}>Published</li>
                            <li className={posts.tab === 'drafts' ? 'active' : ''} data-posts="drafts" onClick={this.changePostsTab}>Drafts</li>
                            <li className={posts.tab === 'archived' ? 'active' : ''} data-posts="archived" onClick={this.changePostsTab}>Archived</li>
                            <li className={posts.tab === 'new' ? 'active' : ''} data-posts="new" onClick={this.changePostsTab}>Add New</li>
                        </ul>
                    </BiGridVerticalHeader>
                    <BiGridVerticalContent>
                        <BiGridHorizontalWrapper columns="200px auto">
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

                                        &:hover {
                                            background-color: ${themes.standard.lightestgray};
                                        }

                                        &.active {
                                            border-left: 3px solid ${themes.standard.primary};
                                        }
                                    }
                                `}>
                                    {posts.items.map((post, index) => (
                                       <SidebarItem key={index} match={this.props.match} post={post} />
                                    ))}
                                </div>
                            </BiGridHorizontalSidebar>
                            <BiGridHorizontalContent>
                                {posts.loaded
                                    ? <Route path={`${this.props.match.path}/:id`} render={(props, routeProps) => (
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
    loaded: getIsLoaded(state),
    error: getError(state),
    posts: getPosts(state),
});

export default connect(mapStateToProps)(Posts);
