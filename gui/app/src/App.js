import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TriGridWrapper, TriGridHeader, TriGridSidebar, TriGridContent } from './components/TriGrid';

import Header from './modules/header';
import Sidebar from './modules/sidebar';
import Content from './modules/content';

import Conn from './lib/conn/';

Conn.ping(() => {
    console.log('Connected!');
});

export default class App extends Component {
  render() {
    return (
        <Router>
            <TriGridWrapper columns="3.5em auto">
                <TriGridHeader>
                    <Header/>
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
  }
};
