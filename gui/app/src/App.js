import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { BiGridWrapper, BiGridSidebar, BiGridContent } from './components/BiGrid';

import Sidebar from './modules/sidebar';
import Content from './modules/content';

export default class App extends Component {
  render() {
    return (
        <Router>
            <BiGridWrapper columns="3.5em auto">
                <BiGridSidebar>
                    <Sidebar/>
                </BiGridSidebar>
                <BiGridContent>
                    <Content/>
                </BiGridContent>
            </BiGridWrapper>
        </Router>
    );
  }
};
