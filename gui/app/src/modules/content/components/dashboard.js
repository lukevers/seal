/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';

import Datetime from 'react-datetime';
import '../../../../node_modules/react-datetime/css/react-datetime.css';

import { Box } from '../../../components/Box';
import { Button } from '../../../components/Button';
import { themes } from '../../../base/themes';

class Dashboard extends Component {
    render() {
        return (
            <div css={css`
                height: 100%;
                padding: 1em;

                .dashboard-header {
                    padding-bottom: 1em;
                    display: flex;
                    align-items: center;

                    fieldset {
                        border: 1px solid ${themes.standard.primary};
                        padding: .5em;
                        padding-top: 1em;
                        display: flex;
                        align-items: center;

                        span {
                            position: relative;
                        }

                        label {
                            font-size: .75em;
                            position: absolute;
                            top: -1em;
                        }
                    }

                    input {
                        border: 0;
                        padding: 1em;
                        background-color: ${themes.standard.lightgray};
                        text-shadow: 0 0 0 ${themes.standard.primary};
                        color: transparent;
                        text-align: center;

                        &:focus {
                            outline: none;
                        }
                    }
                }

                .dashboard-boxes {
                    height: 100%;
                    columns: 5;
                    column-gap: 1em;
                    width: 100%;

                    h1 {
                        font-size: 2.5em;
                    }

                    p {
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        padding-top: 2em;
                        font-size: .75em;
                    }
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
            `}>
                <div className="dashboard-header">
                    <fieldset>
                        <legend>&nbsp;Analytics Period&nbsp;</legend>
                        <span>
                            <label>FROM</label>
                            <Datetime
                                // value={post.published_at ? moment(post.published_at).format('MM/DD/YYYY HH:mm a') : null}
                                // onChange={(e) => this.handleChange(e ? e.format('YYYY-MM-DDTHH:mm:ssZ') : null, 'published_at') }/>
                            />
                        </span>
                        <span>
                            <label>TO</label>
                            <Datetime
                                // value={post.published_at ? moment(post.published_at).format('MM/DD/YYYY HH:mm a') : null}
                                // onChange={(e) => this.handleChange(e ? e.format('YYYY-MM-DDTHH:mm:ssZ') : null, 'published_at') }/>
                            />
                        </span>
                        <Button white>View Data</Button>
                        <span css={css`
                            color: ${themes.standard.gray};
                        `}>
                            &nbsp;&mdash;&nbsp;
                        </span>
                        <Button>Watch Live Data</Button>
                    </fieldset>
                </div>
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
