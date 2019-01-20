/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { themes } from '../base/themes';

const Button = ({ children, white, onClick }) => (
    <button
        onClick={onClick}
        css={css`
            border: 0;
            padding: 1em;

            background-color: ${white ? themes.standard.white : themes.standard.primary};
            color: ${white ? themes.standard.secondary : themes.standard.white};
            cursor: pointer;

            &:hover {
                background-color: ${white ? themes.standard.gray : themes.standard.primary};
                color: ${white ? themes.standard.secondary : themes.standard.white};
            }
        `}
    >
        {children}
    </button>
);

export {
    Button
};