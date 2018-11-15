import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import posts from './modules/content/reducers/posts/';
import settings from './modules/content/reducers/settings/';

export default (history) => combineReducers({
    router: connectRouter(history),
    posts: posts,
    settings: settings,
});
