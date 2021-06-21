import styled from "styled-components";
import LogoImage from '../media/resources/logo.svg';

const Container = styled.header`
width:100%;
height: ${props=>props.height+"px"};
background-color:darkblue;
color:white;
display:flex;
justify-content: center;
align-items: center;
gap:10px;
`;

const Logo = styled.img.attrs(({src:LogoImage,alt:"Logo"}))`
height:60px;
`;

const Text = styled.h1`
font-weight:bold;
font-size:28px;
`;

export const headerHeight = 80;

function Header() {
    
    return (
        <Container height = {headerHeight}>
            <Logo />
            <Text>Carousel</Text>
        </Container>
    );
}

export default Header;