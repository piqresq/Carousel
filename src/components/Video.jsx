import styled from 'styled-components';
import Play from '../media/resources/play.svg';
import { useState, useRef} from "react";

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

const StyledVideo = styled.video.attrs(props => ({name: "items", loop: true, preload:"auto", ref: props.ref, onClick: props.click}))`
height: var(--height);
width: var(--width);
`;

const videoClick = (vid) => vid.paused ? vid.play() : vid.pause();


function Video(props) {
    const [isPlaying, setIsPlaying] = useState(false)
    const vidRef = useRef(null);

    function handleVideoClick() {
        if (isPlaying) {
            setIsPlaying((prev) => (!prev));
            videoClick(vidRef.current);
        }
    }

    function handleButtonClick() {
        setIsPlaying((prev) => (!prev));
        videoClick(vidRef.current);
    }

    return (
        <>
            <Button click={handleButtonClick}>
                {!isPlaying && <Icon />}
            </Button>
            <StyledVideo ref={vidRef} click={handleVideoClick}>
                <source src={props.video} type="video/mp4"></source>
            </StyledVideo>
        </>
    )
}

export default Video;