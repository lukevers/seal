/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Box } from '../../../components/Box';
import { themes } from '../../../base/themes';

class Dashboard extends Component {
    render() {
        return (
            <div css={css`
                height: 100%;
                padding: 1em;

                .dashboard-boxes {
                    height: 100%;
                    columns: 5;
                    column-gap: 1em;
                    width: 100%;
                }

                @media (max-width: 1200px) {
                    .dashboard-boxes {
                        columns: 3;
                    }
                }

                @media (max-width: 800px) {
                    .dashboard-boxes {
                        columns: 2;
                    }
                }

                @media (max-width: 500px) {
                    .dashboard-boxes {
                        columns: 1;
                    }
                }

                h1 {
                    font-size: 2.5em;
                }

                p {
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding-top: 2em;
                    font-size: .75em;
                }
            `}>
                <div className="dashboard-boxes">
                    <Box type="large" bg={themes.standard.secondary} fg={themes.standard.white}>
                        <h1>737</h1>
                        <p>Visitors On Site</p>
                    </Box>
                    <Box><h1>ABC</h1></Box>
                    <Box><h1>DEF</h1></Box>
                    <Box><h1>GHI</h1></Box>
                    <Box><h1>JKL</h1></Box>
                    <Box><h1>MNO</h1></Box>
                    <Box><h1>PQR</h1></Box>
                    <Box><h1>STU</h1></Box>
                    <Box><h1>VWX</h1></Box>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    // TODO
});

export default connect(mapStateToProps)(Dashboard);
