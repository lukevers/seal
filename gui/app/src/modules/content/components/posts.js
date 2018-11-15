/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';
import { BiGridWrapper, BiGridSidebar, BiGridContent } from '../../../components/BiGrid';
import { Route, Link } from "react-router-dom";
import { themes } from '../../../base/themes';
import * as Showdown from "showdown";
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

import {
    fetchPostsIfNeeded,
    postEdited,
    postSave,
} from '../actions/posts/';

import {
    getIsLoaded,
    getError,
    getPosts,
} from '../reducers/posts/';

const SidebarItem = ({ post, match }) => (
    <Link to={`${match.url}/${post.id}`}>
        <div>
            {post.title}
        </div>
    </Link>
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

    render() {
        const { posts } = this.props;

        if (posts.error) {
            return <div>Error!</div>;
        } else {
            return (
                <BiGridWrapper columns="200px auto">
                    <BiGridSidebar>
                        <div css={css`
                            border-right: 1px solid ${themes.standard.lightgray};
                            height: 100%;

                            a {
                                padding: .5em;
                                text-decoration: none;
                                display: block;
                                color: ${themes.standard.black};
                            }

                            a:nth-of-type(odd) {
                                background-color: ${themes.standard.lightestgray};
                            }

                            a:hover {
                                background-color: ${themes.standard.lighter.primary};
                            }
                        `}>
                            {posts.items.map((post, index) => (
                               <SidebarItem key={index} match={this.props.match} post={post} />
                            ))}
                        </div>
                    </BiGridSidebar>
                    <BiGridContent>
                        {posts.loaded
                            ? <Route path={`${this.props.match.path}/:id`} render={(props, routeProps) => (
                                    <Content {...routeProps} {...this.props} {...props} />
                                )} />
                            : <div>{/*loading*/}</div>
                        }
                    </BiGridContent>
                </BiGridWrapper>
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
