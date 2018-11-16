/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import { Link } from "react-router-dom";

import {
    faChartPie,
    faPen,
    faSlidersH
} from '@fortawesome/free-solid-svg-icons';

import { themes } from '../../../base/themes';
import logo from '../../../base/logo.png';

const SidebarItem = ({ children, tooltip }) => (
    <li css={css`
        cursor: pointer;
        padding: 1em;
        color: ${themes.standard.black};
        text-align: center;

        &:hover {
            color: ${themes.standard.primary};
        }

        img {
            max-width: 100%;
            padding: 1em 0;
        }
    `}
    data-tip={tooltip}
    data-place="right"
    data-effect="solid"
    data-delay-show="500">
        {children}
        <ReactTooltip />
    </li>
);

export default () => (
    <ul css={css`
        height: 100%;
        background-color: ${themes.standard.lightgray};
    `}>
        <Link to="/">
            <SidebarItem>
                <img src={logo} alt="Seal"/>
            </SidebarItem>
        </Link>
        <Link to="/dashboard">
            <SidebarItem tooltip="Dashboard">
                <FontAwesomeIcon icon={faChartPie} />
            </SidebarItem>
        </Link>
        <Link to="/posts">
            <SidebarItem tooltip="Posts">
                <FontAwesomeIcon icon={faPen} />
            </SidebarItem>
        </Link>
        <Link to="/settings">
            <SidebarItem tooltip="Settings">
                <FontAwesomeIcon icon={faSlidersH} />
            </SidebarItem>
        </Link>
    </ul>
);
