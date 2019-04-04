/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from "react-router-dom";

import {
    faChartPie,
    faPen,
    faImages,
} from '@fortawesome/free-solid-svg-icons';

import { themes } from '../../../base/themes';

const SidebarItem = ({ children }) => (
    <li css={css`
        cursor: pointer;
        padding: 1em;
        color: ${themes.standard.gray};
        display: flex;
        align-items: center;
        font-size: .75em;
        text-transform: uppercase;
        letter-spacing: 1px;

        &:hover {
            color: ${themes.standard.white};
        }

        img {
            max-width: 100%;
            padding: 1em 0;
        }
    `}>
        {children}
    </li>
);

export default () => (
    <ul css={css`
        height: 100%;
        background-color: ${themes.standard.secondary};

        a {
            text-decoration: none;
            display: block;
            border-left: 5px solid transparent;

            &.active {
                border-left: 5px solid ${themes.standard.primary};

                li {
                    color: ${themes.standard.white};
                }
            }
        }
    `}>
        <NavLink to="/dashboard" activeClassName="active">
            <SidebarItem>
                <FontAwesomeIcon icon={faChartPie} />
            </SidebarItem>
        </NavLink>
        <NavLink to="/posts" activeClassName="active">
            <SidebarItem>
                <FontAwesomeIcon icon={faPen} />
            </SidebarItem>
        </NavLink>
        <NavLink to="/media" activeClassName="active">
            <SidebarItem>
                <FontAwesomeIcon icon={faImages} />
            </SidebarItem>
        </NavLink>
    </ul>
);
