/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink } from "react-router-dom";
import Datetime from 'react-datetime';
import moment from 'moment';

import '../../../../node_modules/react-datetime/css/react-datetime.css';
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
        <div css={css`
            padding: .5em;
            background: ${!post.edited ? 'auto' :
                `repeating-linear-gradient(135deg, #FFF, #FFF 10px, ${themes.standard.white} 10px, ${themes.standard.white} 20px)`};
        `}>
            {post.title}

            <div css={css`
                font-size: .5em;
                color: ${themes.standard.gray};
            `}>
                {post.status === 'published' ?
                    moment(post.published_at).format('MM/DD/YYYY HH:mm a') :
                    post.status
                }
            </div>
        </div>
    </NavLink>
);

class Content extends Component {
    static post = null;

    componentWillUpdate(props) {
        const { dispatch } = props;

        if (this.props.match.params.id !== props.match.params.id) {
            dispatch(fetchPostsIfNeeded(true));
        }
    }

    handleChange = (value, key) => {
        const { dispatch, updateParentWithChange } = this.props;
        this.post[key] = value;
        dispatch(postEdited(this.getPost(), key, value));
        this.setState({});

        if (!this.props.new) {
            updateParentWithChange();
        }
    }

    savePost = () => {
        const { dispatch, history, updateParentWithChange } = this.props;
        dispatch(postSave(this.getPost(), updateParentWithChange));
        dispatch(clearNewPostData());

        if (this.props.new) {
            this.props.dispatch(switchTab('all'));
            history.push('/posts');
            dispatch(fetchPostsIfNeeded(true));
        }
    }

    getPost = () => {
        if (this.post) {
            return this.post;
        }

        let id = 'new';
        let post = null;

        if (!this.props.new) {
            id = parseInt(this.props.match.params.id);

            if (this.props.items.length > 0) {
                post = this.props.items.reduce((result, item) => {
                    if (id === item.id) {
                        result = item;
                    }

                    return result;
                });
            }
        }

        if (typeof this.props.edited[id] != 'undefined') {
            post = this.props.edited[id];
        }

        this.post = post;
        return this.post;
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

                    <div css={css`
                        color: ${themes.standard.secondary};
                        margin: 1em 0;
                        line-height: 1.25em;
                    `}>
                        <label>Route:</label>
                        <TextEditor
                            value={post.route}
                            plaintext
                            onChange={(value) => this.handleChange(value, 'route')}
                        />
                    </div>

                    <select value={post.status} onChange={(e) => this.handleChange(e.target.value, 'status') }>
                        <option value={'draft'}>Draft</option>
                        <option value={'published'}>Published</option>
                        <option value={'deleted'}>Deleted</option>
                    </select>

                    <Datetime
                        value={post.published_at ? moment(post.published_at).format('MM/DD/YYYY HH:mm a') : null}
                        onChange={(e) => this.handleChange(e ? e.format('YYYY-MM-DDTHH:mm:ssZ') : null, 'published_at') }/>

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

    updateParentWithChange = () => {
        this.setState({state: this.state});
    }

    render() {
        const { items, tab, error, loaded, edited } = this.props;

        let posts = items.map((post) => {
            if (edited[post.id]) {
                edited[post.id].edited = true;
                return edited[post.id];
            } else {
                post.edited = false;
            }

            return post;
        });

        if (tab !== 'all' && tab !== 'new') {
            posts = posts.filter(post => post.status === tab);
        }

        const sortBy = 'id'; // TODO: sort by other things? in a prop, prob too
        posts = posts.sort((a, b) => {
            return a[sortBy] > b[sortBy];
        });

        console.log(posts);

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
                            <li className={tab === 'draft' ? 'active' : ''} data-posts="draft" onClick={this.changePostsTab}>Drafts</li>
                            <li className={tab === 'deleted' ? 'active' : ''} data-posts="deleted" onClick={this.changePostsTab}>Archived</li>
                            <li className={tab === 'new' ? 'active' : ''} data-posts="new" onClick={this.changePostsTab}>Add New</li>
                        </ul>
                    </BiGridVerticalHeader>
                    <BiGridVerticalContent>
                        <BiGridHorizontalWrapper columns={tab === 'new' ? '0px auto' : '200px auto'}>
                            <BiGridHorizontalSidebar>
                                <div css={css`
                                    border-right: 1px solid ${themes.standard.lightgray};
                                    height: 100%;
                                    display: ${tab === 'new' ? 'none' : 'auto'};

                                    a {
                                        text-decoration: none;
                                        display: block;
                                        color: ${themes.standard.secondary};
                                        border-bottom: 1px solid ${themes.standard.lightestgray};
                                        border-left: 3px solid transparent;
                                        line-height: 1.25em;

                                        &:hover {
                                            background-color: ${themes.standard.lightestgray};
                                        }

                                        &.active {
                                            border-left: 3px solid ${themes.standard.primary};
                                            color: ${themes.standard.primary};
                                        }
                                    }
                                `}>
                                    {posts.map((post, index) => (
                                       <SidebarItem key={index} match={this.props.match} post={post} onClick={() => this.changePost(post)}/>
                                    ))}
                                </div>
                            </BiGridHorizontalSidebar>
                            <BiGridHorizontalContent>
                                {loaded
                                    ?
                                        tab === 'new' ? <Content {...this.props} new={true}/> :
                                        <Route path={`${this.props.match.path}/:id`} render={(props, routeProps) => (
                                            <Content {...routeProps} {...this.props} {...props}
                                                updateParentWithChange={this.updateParentWithChange} />
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
