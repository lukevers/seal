/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Component } from 'react';
import { connect } from 'react-redux';

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
            <div>
                <button onClick={this.saveSettings}>Save</button>

                <input
                    type="text"
                    name="url"
                    value={setting.url}
                    onChange={(e) => this.handleChange(e.target.value, 'url')}
                />
                <input
                    type="text"
                    name="api_key"
                    value={setting.api_key}
                    onChange={(e) => this.handleChange(e.target.value, 'api_key')}
                />
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
