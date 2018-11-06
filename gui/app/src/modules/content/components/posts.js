/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { BiGridWrapper, BiGridSidebar, BiGridContent } from '../../../components/BiGrid';
import { Route, Link } from "react-router-dom";
import { themes } from '../../../base/themes';

const SidebarItem = ({ children, match }) => (
    <div>
        <Link to={`${match.url}/components`}>
            <div>{children}</div>
        </Link>
    </div>
);

const SidebarContent = ({ match }) => (
    <div>
        Requested Param: {match.params.id}
    </div>
);

export default ({ match }) => (
    <BiGridWrapper columns="200px auto">
        <BiGridSidebar>
            <div css={css`
                border-right: 1px solid ${themes.standard.lightgray};
                height: 100%;
            `}>
                <SidebarItem match={match}>Com</SidebarItem>
                <SidebarItem match={match}>Com2</SidebarItem>
            </div>
        </BiGridSidebar>
        <BiGridContent>
            <Route path={`${match.path}/:id`} component={SidebarContent} />
        </BiGridContent>
    </BiGridWrapper>
);
