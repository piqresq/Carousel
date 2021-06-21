import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import Video from './Video';
import bg from '../media/resources/bg.jpeg';
import { headerHeight } from "./Header";

const Image = styled.img.attrs(props => ({ src: props.image }))`
height: ${props=>props.fit==="setHeightToFit"?"100%":"auto"};
width: ${props => props.fit === "setWidthToFit" ? "100%" : "auto"};
`;

const Audio = styled.audio.attrs(props => ({ src: props.audio, controls: true, controlsList: "nodownload" }))`
border-radius: 100px;
background-color:inherit;
border:1px solid black;
`;


//TODO: understand CSS animations and add animations on element change or just touch end
const Container = styled.div.attrs(props=>({name:"element"}))`
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
--offset:1;
--element:1;
--movement:0;
transform:translateX( calc( (var(--movement) * -1%) + (var(--element) * -100%)));
`;

function Content(props) {
    let contentType = props.data[1];
    let contentAspect = props.data[2];

    const findToWhatFitContentTo = () => ((window.visualViewport.width / (window.visualViewport.height - headerHeight)) > contentAspect ? "setWidthToFit" : "setHeightToFit")
    
    const [fitContentTo, setFitContentTo] = useState(findToWhatFitContentTo());
    const [offset, setOffset] = useState(0);
    const fitContentToRef = useRef(fitContentTo);


    function resizeHandler() {
        let fit = findToWhatFitContentTo();
        if (fit !== fitContentToRef) {
            setFitContentTo(fit);
            fitContentToRef.current = fitContentTo;
        }
    }

    useEffect(() => {
        //if ((props.curElement === props.id || props.curElement === props.id - 1 || props.curElement === props.id + 1) && contentType !== "audio") {
            window.addEventListener("resize", resizeHandler);
            return () => window.removeEventListener("resize", resizeHandler);
        //}
        //else
            //window.removeEventListener("resize", resizeHandler)
    }, []);
    
    return (
        <Container type={contentType} curElement={props.curElement}>
            {contentType === "image" && <Image image={props.data[0]} fit={fitContentTo}/>}
            {contentType === "video" && <Video video={props.data[0]} fit={fitContentTo}/>}
            {contentType === "audio" && <Audio audio={props.data[0]} />}
        </Container>
    );
}

export default Content;