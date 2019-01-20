/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const TriGridWrapper = ({ children }) => (
    <div css={css`
        display: grid;
        grid-gap: 0;
        grid-template-columns: 50px auto;
        grid-template-rows: 50px auto;
        grid-template-areas:
        "header header"
        "sidebar content";
        height: 100%;
        width: 100%;
    `}>
        {children}
    </div>
);

const TriGridHeader = ({ children }) => (
    <div css={css`
        grid-area: header;
        height: 50px;
        width: 100%;
    `}>
        {children}
    </div>
);

const TriGridSidebar = ({ children }) => (
    <div css={css`
        grid-area: sidebar;
        height: 100%;
        width: 50px;
    `}>
        {children}
    </div>
);

const TriGridContent = ({ children }) => (
    <div css={css`
        grid-area: content;
        max-height: 100%;
        overflow-y: auto;
    `}>
        {children}
    </div>
);

export {
    TriGridWrapper,
    TriGridHeader,
    TriGridSidebar,
    TriGridContent,
};
