import styled from 'styled-components';
import Play from '../media/resources/play.svg';
import { useState } from "react";

const Button = styled.button.attrs(props => ({ onClick: props.click }))`
z-index: 1;
position:absolute;
top:50%;
left:50%;
transform: translate(-50%,-50%);
border:none;
background: none;
cursor:pointer;
pointer-events: all;
appearance: none;
&::-moz-focus-inner {
  border: 0;
}
`;

const Icon = styled.i`
z-index: 2;
display:block;
width: 80px;
height:80px;
background-image:url(${Play});
background-size:contain;
cursor:pointer;
pointer-events: all;
`;

const StyledVideo = styled.video.attrs(props => ({
    id: "vid", loop: true, preload:"auto", onClick: () => {
        if (props.playing) {
            props.setPlaying((prev) => (!prev));
            videoClick();
        }
    }
}))`
height: ${props => props.aspect === "setHeight" ? "100%" : "auto"};
width: ${props => props.aspect === "setWidth" ? "100%" : "auto"};
`;

const videoClick = () => document.getElementById("vid").paused ? document.getElementById("vid").play() : document.getElementById("vid").pause();


function Video(props) {
    const [isPlaying, setIsPlaying] = useState(false)
    return (
        <>
            <Button click={() => { setIsPlaying((prev) => (!prev)); videoClick() }}>
                {!isPlaying && <Icon />}
            </Button>
            <StyledVideo playing={isPlaying} setPlaying={setIsPlaying}>
                <source src={props.video} type="video/mp4"></source>
            </StyledVideo>
        </>
    )
}

export default Video;