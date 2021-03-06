//import { Data } from './Carousel';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import Video from './Video';
import bg from '../media/resources/bg.jpeg';

const Image = styled.img.attrs(props => ({ src: props.image, name: "items" }))`
width: var(--width);
height:var(--height);
`;

const Audio = styled.audio.attrs(props => ({ src: props.audio, controls: true, controlsList: "nodownload", name:"items" }))`
border-radius: 100px;
background-color:inherit;
border:1px solid black;
`;

const Container = styled.div`
position: relative;
background-size: cover;
background-image: ${props=>props.type==="audio"?`url(${bg})`:"none"};
display:flex;
align-items:center;
justify-content: center;
min-width:100%;
width: 100%; 
height:100%;
overflow:hidden;
transform:translateX( calc( (var(--movement) * -1%) + (var(--element) * -100%)));
transition: inherit;
`;

function Content(props) {
    let contentType = props.data[1];
    return (
        
        <Container type={contentType} curElement={props.curElement}>
            {contentType === "image" && <Image image={props.data[0]} />}
            {contentType === "video" && <Video video={props.data[0]} />}
            {contentType === "audio" && <Audio audio={props.data[0]} />}
        </Container>
    );
}

export default Content;