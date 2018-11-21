/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import logo from '../../../base/logo-white.png';
import { themes } from '../../../base/themes';

export default () => (
    <div css={css`
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: ${themes.standard.lighter.secondary};
        color: ${themes.standard.gray};
        text-transform: uppercase;
        letter-spacing: 1px;

        img {
            max-width: 20em;
            transition: transform 1s ease-in-out;

            &:hover {
                transform: rotate(360deg);
            }
        }

        h1 {
            padding-top: 3em;
            font-size: 1.5em;
            color: ${themes.standard.white};
        }

        h2 {
            padding-top: .5em;
            font-size: .75em;
        }
    `}>
        <img src={logo} alt="Seal"/>
        <h1>Seal</h1>
        <h2>Version 1.0.0</h2>
    </div>
);
