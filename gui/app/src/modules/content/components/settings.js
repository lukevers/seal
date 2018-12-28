/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Component } from 'react';
import { connect } from 'react-redux';
import { themes } from '../../../base/themes';

import {
    BiGridVerticalWrapper,
    BiGridVerticalHeader,
    BiGridVerticalContent,
} from '../../../components/BiGrid';

import {
    fetchSettingsIfNeeded,
    settingEdited,
    settingsSave,
    switchTab,
    getTeamsIfNeeded,
} from '../actions/settings/';

class Content extends Component {
    getSettings = () => {
        let settings = {};
        this.props.items.map((k) => {
            settings[k.key] = k.value;

            if (typeof this.props.edited[k.key] != 'undefined') {
                settings[k.key] = this.props.edited[k.key];
            }

            return k;
        });

        return settings;
    }

    handleChange = (value, key) => {
        const { dispatch } = this.props;
        dispatch(settingEdited(key, value));
    }

    saveSettings = () => {
        const { dispatch } = this.props;
        dispatch(settingsSave(this.getSettings()));
    }

    general = () => {
        const setting = this.getSettings();

        return (
            <div css={css`
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                .form-group {
                    margin: .5em 0;
                    border-bottom: 1px solid ${themes.standard.lightestgray};
                    width: 80%;
                    display: flex;

                    label {
                        padding: .5em 0;
                        width: 75px;
                        text-transform: uppercase;
                        font-size: .5em;
                        line-height: 2em;
                        letter-spaxcing 1px;
                    }

                    input {
                        padding: .5em 1em;
                        border: 0;
                        width: 100%;
                        background: transparent;
                    }

                    input:focus{
                        outline: none;
                    }
                }

                button {
                    border: 0;
                    padding: 1em;
                    background-color: ${themes.standard.primary};
                    color: ${themes.standard.white};
                    cursor: pointer;
                    margin-right: auto;
                    margin-left: 10%;

                    &:hover {
                        background-color: ${themes.standard.darker.primary};
                    }
                }
            `}>
                <div className="form-group">
                    <label>URL</label>
                    <input
                        type="text"
                        name="url"
                        value={setting.url}
                        onChange={(e) => this.handleChange(e.target.value, 'url')}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={setting.email}
                        onChange={(e) => this.handleChange(e.target.value, 'email')}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={setting.password}
                        onChange={(e) => this.handleChange(e.target.value, 'password')}
                    />
                </div>

                <button onClick={this.saveSettings}>Save</button>
            </div>
        );
    }

    teams = () => {
        const { teams, loaded } = this.props;

        if (!loaded) {
            return <div/>;
        }

        return (
            <div>{JSON.stringify(teams)}</div>
        );
    }

    render() {
        switch (this.props.tab) {
            case 'general':
                return this.general();
            case 'teams':
                return this.teams();
            default:
                return <div></div>;
        }
    }
}

class Settings extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchSettingsIfNeeded());
    }

    changeSettingsTab = (e) => {
        const { dispatch, tab } = this.props;
        const tabTarget = e.target.dataset.tab;

        if (tab !== tabTarget) {
            switch (tabTarget) {
                case 'teams':
                    dispatch(getTeamsIfNeeded());
                    break;
                default:
                    break;
            }

            dispatch(switchTab(tabTarget));
        }
    }

    render() {
        const { tab } = this.props;

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
                        <li className={tab === 'general' ? 'active' : ''} data-tab="general" onClick={this.changeSettingsTab}>General</li>
                        <li className={tab === 'teams' ? 'active' : ''} data-tab="teams" onClick={this.changeSettingsTab}>Teams</li>
                    </ul>
                </BiGridVerticalHeader>
                <BiGridVerticalContent>
                    <Content {...this.props} />
                </BiGridVerticalContent>
            </BiGridVerticalWrapper>
        );
    }
}

const mapStateToProps = state => ({
    loaded: state.settings.loaded,
    error: state.settings.error,
    tab: state.settings.tab,
    items: state.settings.items,
    edited: state.settings.edited,
    teams: state.settings.teams,
});

export default connect(mapStateToProps)(Settings);
