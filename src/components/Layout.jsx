import Header, {headerHeight} from './Header';
import styled from "styled-components";
import Carousel from './Carousel';

const Main = styled.main`
padding:20px;
height: calc(100% - ${`${headerHeight}px`});
box-sizing: border-box;
`;

function Layout(props) {
    return (
        <>
            <Header />
            <Main>
                <Carousel/>
            </Main>
        </>
    );
}

export default Layout;