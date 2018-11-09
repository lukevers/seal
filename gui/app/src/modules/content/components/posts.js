/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Component } from 'react';
import { connect } from 'react-redux'
import { BiGridWrapper, BiGridSidebar, BiGridContent } from '../../../components/BiGrid';
import { Route, Link } from "react-router-dom";
import { themes } from '../../../base/themes';
import { fetchPostsIfNeeded } from '../actions/posts/';

import {
    getIsLoaded,
    getError,
    getPosts,
} from '../reducers/posts/';

const SidebarItem = ({ post, match }) => (
    <div>
        <Link to={`${match.url}/${post.id}`}>
            <div>{post.title}</div>
        </Link>
    </div>
);

class Content extends Component {
    render() {
        const { posts } = this.props;
        const id = parseInt(this.props.match.params.id);
        const post = posts.posts.reduce((result, item) => {
            if (id === item.id) {
                result = item;
            }

            return result;
        });

        if (posts.error) {
            return <div>Error!</div>;
        } else if (post === null) {
            return <div>Could not find post!</div>;
        } else if (!posts.loaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>{post.content}</div>
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
        } else if (!posts.loaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <BiGridWrapper columns="200px auto">
                    <BiGridSidebar>
                        <div css={css`
                            border-right: 1px solid ${themes.standard.lightgray};
                            height: 100%;
                        `}>
                            {posts.posts.map(post => (
                                <SidebarItem key={post.id} match={this.props.match} post={post} />
                            ))}
                        </div>
                    </BiGridSidebar>
                    <BiGridContent>
                        <Route path={`${this.props.match.path}/:id`} render={(props, routeProps) => (
                            <Content {...routeProps} {...this.props} {...props} />
                        )} />
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
