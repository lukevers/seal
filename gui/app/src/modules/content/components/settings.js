/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Component } from 'react';
import { connect } from 'react-redux';
import { themes } from '../../../base/themes';

import {
    fetchSettingsIfNeeded,
    settingEdited,
    settingsSave,
} from '../actions/settings/';

import {
    getIsLoaded,
    getError,
    getSettings,
} from '../reducers/settings/';

class Settings extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchSettingsIfNeeded());
    }

    handleChange = (value, key) => {
        const { dispatch } = this.props;
        dispatch(settingEdited(key, value));
    }

    getSettings = () => {
        let settings = {};
        this.props.settings.items.map((k) => {
            settings[k.key] = k.value;

            if (typeof this.props.settings.edited[k.key] != 'undefined') {
                settings[k.key] = this.props.settings.edited[k.key];
            }

            return k;
        });

        return settings;
    }

    saveSettings = () => {
        const { dispatch } = this.props;
        dispatch(settingsSave(this.getSettings()));
    }

    render() {
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
                    border-bottom: 1px solid ${themes.standard.lighter.primary};
                    width: 300px;
                    display: flex;

                    label {
                        padding: .5em 0;
                    }

                    input {
                        padding: .5em 1em;
                        border: 0;
                        width: 100%;
                    }

                    input:focus{
                        outline: none;
                    }
                }

                button {
                    width: 300px;
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
                <div class="form-group">
                    <label for="url">URL</label>
                    <input
                        type="text"
                        name="url"
                        value={setting.url}
                        onChange={(e) => this.handleChange(e.target.value, 'url')}
                    />
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={setting.email}
                        onChange={(e) => this.handleChange(e.target.value, 'email')}
                    />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
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
}

const mapStateToProps = state => ({
    loaded: getIsLoaded(state),
    error: getError(state),
    settings: getSettings(state),
});

export default connect(mapStateToProps)(Settings);
