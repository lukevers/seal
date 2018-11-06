/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Route } from "react-router-dom";

import Home from './home';
import Dashboard from './dashboard';
import Posts from './posts';
import Settings from './settings';

export default () => (
    <div css={css`
        height: 100%;
        width: 100%;
    `}>
        <Route exact path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/posts" component={Posts} />
        <Route path="/settings" component={Settings} />
    </div>
);
