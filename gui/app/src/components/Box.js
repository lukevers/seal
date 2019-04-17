/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { themes } from '../base/themes';

const Box = ({ children, type, bg, fg }) => (
    <div css={css`
        width: 100%;
        border: 1px solid ${themes.standard.lightgray};
        background: ${bg ? bg : themes.standard.lightestgray};
        color: ${fg ? fg : themes.standard.primary};
        margin-bottom: 1em;
        display: inline-block;
        height: ${type === 'large' ? '17em' : '8em'};
    `}>
        <div css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 100%;
        `}>
            <div>
                {children}
            </div>
        </div>
    </div>
);

export {
    Box
};