/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const BiGridWrapper = ({ children, columns }) => (
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

const BiGridSidebar = ({ children }) => (
    <div css={css`
        grid-area: sidebar;
        height: 100%;
    `}>
        {children}
    </div>
);

const BiGridContent = ({ children }) => (
    <div css={css`
        grid-area: content;
        max-height: 100%;
        overflow-y: auto;
    `}>
        {children}
    </div>
);

export {
    BiGridWrapper,
    BiGridSidebar,
    BiGridContent,
};
