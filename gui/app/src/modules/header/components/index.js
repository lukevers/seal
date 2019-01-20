/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { NavLink } from "react-router-dom";

import { themes } from '../../../base/themes';
import logo from '../../../base/logo-white.png';

const HeaderItem = ({ children }) => (
    <li css={css`
        cursor: pointer;
        padding: 1em;
        color: ${themes.standard.gray};
        text-align: center;
        display: inline-block;
        font-size: .75em;
        text-transform: uppercase;
        letter-spacing: 1px;

        &:hover {
            color: ${themes.standard.white};
        }
    `}>
        {children}
    </li>
);

const HeaderLeft = () => (
    <div css={css`
        text-align: center;
        background-color: ${themes.standard.primary};

        img {
            height: 50px;
            padding: .5em;
        }
    `}>
        <NavLink to="/">
            <img src={logo} alt="Seal"/>
        </NavLink>
    </div>
);

const HeaderRight = ({ authenticate }) => (
    <div>
        <div css={css`
            position: absolute;
            right: 0;
            top: 5px;
            display: flex;

            a {
                height: 45px;
                display: flex;
                align-items: center;
                border-bottom: 5px solid transparent;
                text-decoration: none;
            }

            .active {
                border-bottom: 5px solid ${themes.standard.primary};

                li {
                    color: ${themes.standard.white};
                }
            }
        `}>
            <NavLink to="/settings" activeClassName="active">
                <HeaderItem>Settings</HeaderItem>
            </NavLink>
            <a href="#/" onClick={() => authenticate(false)}>
                <HeaderItem>Log Out</HeaderItem>
            </a>
        </div>
        {/*
            <div css={css`
                position: absolute;
                top: 0;
                right: 0;
                padding: .5em;

                img {
                    height: calc(50px - 1em);
                    border-radius: 100%;
                    border: 1px solid ${themes.standard.lighter.secondary};
                }
            `}>
                <img src="https://placeimg.com/128/128/people" alt="Person" />
            </div>
        */}
    </div>
);

export default ({ authenticate }) => (
    <ul css={css`
        background-color: ${themes.standard.secondary};
        color: ${themes.standard.gray};
        height: 100%;
        display: flex;
    `}>
        <HeaderLeft/>
        <HeaderRight authenticate={authenticate}/>
    </ul>
);
