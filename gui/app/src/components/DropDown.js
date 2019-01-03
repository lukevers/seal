/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { themes } from '../base/themes';
import { Dropdown } from 'reactjs-dropdown-component';

const DropDown = ({ list, onChange, title, styles }) => (
    <div css={css`
        .dd-wrapper {
            font-size: 1em;

            .dd-header {
                line-height: 1em;
                border-radius: 0;

                .dd-header-title {
                    font-weight: normal;
                    margin: 0;
                    padding: .5em;
                }
            }

            svg {
                display: none;
            }

            .dd-list {
                padding: 0;
                font-weight: normal;
            }

            .dd-list-item {
                font-size: 1em;
                padding: .5em;
                line-height: 1.5em;

                &:hover {
                    background-color: ${themes.standard.primary};
                }
            }
        }

        ${styles}
    `}>
        <Dropdown
            list={list}
            resetThenSet={onChange}
            title={title}/>
    </div>
);

export {
    DropDown
};