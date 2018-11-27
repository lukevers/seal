import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TriGridWrapper, TriGridHeader, TriGridSidebar, TriGridContent } from './components/TriGrid';

import Header from './modules/header';
import Sidebar from './modules/sidebar';
import Content from './modules/content';
import Login from './modules/login';

import Conn from './lib/conn/';

Conn.ping(() => {
    console.log('Connected!');
});

export default class App extends Component {
    state = {
        authenticated: false,
        loading: true,
    };

    constructor(props) {
        super(props);

        Conn.load('settings', JSON.stringify([{"key": "authenticated", "value": ""}]), (data) => {
            console.log(data);

            this.setState({
                loading: false,
                authenticated: data.data[0].value === "true",
            });
        });
    }

    authenticate = (authenticated) => {
        Conn.sync(
            'settings',
            [{key: "authenticated", value: authenticated ? 'true' : 'false'}]
        );

        this.setState({
            authenticated: authenticated,
            loading: false,
        });
    }

    render() {
        if (this.state.authenticated) {
            return (
                <Router>
                    <TriGridWrapper columns="3.5em auto">
                        <TriGridHeader>
                            <Header authenticate={this.authenticate}/>
                        </TriGridHeader>
                        <TriGridSidebar>
                            <Sidebar/>
                        </TriGridSidebar>
                        <TriGridContent>
                            <Content/>
                        </TriGridContent>
                    </TriGridWrapper>
                </Router>
            );
        } else {
            return (
                <Login loading={this.state.loading} authenticate={this.authenticate}/>
            );
        }
    }
};
