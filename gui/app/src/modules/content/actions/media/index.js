import Conn from '../../../../lib/conn/';

import {
    fetchSettingsIfNeeded,
} from '../settings';

export const REQUEST_MEDIA = 'MEDIA_REQUEST_MEDIA';
export const RECEIVE_MEDIA = 'MEDIA_RECEIVE_MEDIA';

function requestMedia() {
    return {
        type: REQUEST_MEDIA,
    }
}

function receiveMedia(data) {
    return {
        type: RECEIVE_MEDIA,
        items: data.data || [],
        error: data.error,
    }
}

function getTeamId(state) {
    let teamid = state.settings.items.filter(item => item.key === 'teamid')[0].value;
    teamid = parseInt(teamid, 10);
    return teamid;
}

function fetchMedia() {
    return async (dispatch, getState) => {
        await dispatch(fetchSettingsIfNeeded());
        dispatch(requestMedia());
        const data = await Conn.load('media', `team=${getTeamId(getState())}`);
        dispatch(receiveMedia(data));
    }
}

export function fetchMediaIfNeeded(force = false) {
    return (dispatch, getState) => {
        const { media } = getState();
        if (force || !media.loaded || media.items.length < 1) {
            return dispatch(fetchMedia());
        }
    }
}
