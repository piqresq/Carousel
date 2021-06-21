import styled from 'styled-components';
import { useState, useEffect, useRef } from "react";
import Content from './Content';
import { headerHeight } from "./Header";

const CSSvariables = styled.div.attrs(props=>({id:"vars", ref:props.ref}))`
--movement:0;
--element:0;
`;

const Container = styled.div.attrs(props => ({ onTouchStart: props.touchStart, onTouchEnd: props.touchEnd, onTouchMove: props.touchMove }))`
border-radius:20px;
width:100%;
height:100%;
box-shadow: 2px 2px 0 black;
background-size: cover;
display:flex;
overflow:hidden;
align-items:center;
`;

const getAll =  async () => {
    const content = require.context('../media', false, /\.(mp4|mp3|png|jpg|gif|svg)$/);
    const res = [...new Set(content.keys().map(content).map((element) => element = element.default))];
    let readyToUseContent = [];
    for (let val of res) {
        let format = val.split('.')[val.split('.').length - 1];
        if (format === "jpg" || format === "jpeg" || format === "png" || format === "gif")
            await getAspectRatio(val,"image").then((res)=>readyToUseContent.push([val, "image", res]));
        else if (format === "mp4")
            await getAspectRatio(val,"video").then((res)=>readyToUseContent.push([val, "video",res]));
        else if (format === "mp3")
            readyToUseContent.push([val, "audio", 1]);
    }
    readyToUseContent.unshift(readyToUseContent[readyToUseContent.length - 1])
    readyToUseContent.push(readyToUseContent[1]);
    return readyToUseContent;
}

const getAspectRatio = (content,type) => {
    return new Promise((resolve) => {
        if (type === "image") {
            let image = new Image();
            image.src = content;
            image.onload = () => (resolve(image.width / image.height));
        }
        else if (type === "video"){
            let video = document.createElement("video");
            video.src = content;
            document.body.appendChild(video);
            video.onloadeddata = () => {let ar = video.videoWidth / video.videoHeight; document.body.removeChild(video); return resolve(ar)}
        }
    });
}

    const getDimensions = (aspect) => (window.visualViewport.width/(window.visualViewport.height-headerHeight)>aspect?["100%","auto"]:["auto","100%"])

function Carousel() {
    const [data, setData] = useState([]);
    let prevWidth;
    useEffect(() => getAll().then(res => setData(res)), []);
    let varsRef = useRef(null);
    let scalableContent = data.filter((element) => element[1] != "audio");
    let items;
    let selectedItem = 1;
    let initialX = 0;

    useEffect(() => {
        
        items = document.getElementsByName("content");
        for (let i = 0; i < items.length; i++) {
            const [width, height] = getDimensions(scalableContent[i][2]);
            prevWidth = width;
            items[i].style.setProperty("--width",width);
            items[i].style.setProperty("--height",height);
        }
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize",resizeHandler)
    },[data])

    function resizeHandler() {
        for (let i = 0; i < items.length; i++) {
            const [width, height] = getDimensions(scalableContent[i][2]);
            if (width != prevWidth) {
                items[i].style.setProperty("--width", width);
                prevWidth = width;
                items[i].style.setProperty("--height", height);
            }
        }
    }

    function touchStartHandler(e) {
        initialX = e.touches[0].clientX;
    }

    function touchEndHandler(e) {
        //TODO: get width of the element and divide it by 2 to decide if the element should be switched to a new one
        let movement = initialX - e.changedTouches[0].clientX;
        if (movement > 200) {
            selectedItem++;
            varsRef.current.style.setProperty("--element", selectedItem);
        }
        else if (movement < -200) {
            selectedItem--;
            varsRef.current.style.setProperty("--element", selectedItem);
        }
        varsRef.current.setProperty("--movement", 0);
    }

    function touchMoveHandler(e) {

        let movement = initialX - e.touches[0].clientX;
            varsRef.current.setProperty("--movement", movement/4);
    }

    let createElements = [];
    for (let i = 0; i < data.length; i++)
        createElements.push(<Content data={data[i]} key={i + 1} id={i + 1} curElement={selectedItem}></Content>);
    
    return (

            <Container touchStart={touchStartHandler} touchMove={touchMoveHandler} touchEnd={touchEndHandler} >
                {createElements}
            </Container>

    );
}

export default Carousel;