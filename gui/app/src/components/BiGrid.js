/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const BiGridHorizontalWrapper = ({ children, columns }) => (
    <div css={css`
        display: grid;
        grid-gap: 0;
        grid-template-columns: ${columns};
        grid-template-rows: auto auto;
        grid-template-areas:
        "sidebar content"
        "sidebar content";
        height: 100%;
        width: 100%;
    `}>
        {children}
    </div>
);

const BiGridHorizontalSidebar = ({ children }) => (
    <div css={css`
        grid-area: sidebar;
        height: 100%;
    `}>
        {children}
    </div>
);

const BiGridHorizontalContent = ({ children }) => (
    <div css={css`
        grid-area: content;
        max-height: 100%;
        overflow-y: auto;
    `}>
        {children}
    </div>
);

const BiGridVerticalWrapper = ({ children, headerSize = '50px' }) => (
    <div css={css`
        display: grid;
        grid-gap: 0;
        grid-template-columns: auto;
        grid-template-rows: ${headerSize} auto;
        grid-template-areas:
        "header"
        "content";
        height: 100%;
        width: 100%;
    `}>
        {children}
    </div>
);

const BiGridVerticalHeader = ({ children }) => (
    <div css={css`
        grid-area: header;
        height: 100%;
    `}>
        {children}
    </div>
);

const BiGridVerticalContent = ({ children }) => (
    <div css={css`
        grid-area: content;
        max-height: 100%;
        overflow-y: auto;
    `}>
        {children}
    </div>
);

export {
    BiGridHorizontalWrapper,
    BiGridHorizontalSidebar,
    BiGridHorizontalContent,
    BiGridVerticalWrapper,
    BiGridVerticalHeader,
    BiGridVerticalContent,
};
