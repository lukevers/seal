/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import logo from '../../../base/logo.png';

export default () => (
    <div css={css`
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        img {
            max-width: 25em;
        }

        h1 {
            padding-top: 1em;
            font-size: 2em;
        }

        h2 {
            padding-top: .5em;
        }
    `}>
        <img src={logo} alt="Seal"/>
        <h1>Seal</h1>
        <h2>Version 0.1.0</h2>
    </div>
);
