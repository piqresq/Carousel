

import styled from 'styled-components';
import { useState, useEffect} from "react";
import Content from './Content';
import { headerHeight } from "./Header";


const Container = styled.div.attrs(props => ({ onTouchStart: props.touchStart, onMouseDown: props.mouseDown, onTouchMove: props.touchMove, onMouseMove: props.mouseMove, onTouchEnd: props.touchEnd, onMouseUp: props.mouseUp, name:"container" }))`
border-radius:20px;
width:100%;
height:100%;
box-shadow: 2px 2px 0 black;
background-size: cover;
display:flex;
overflow:hidden;
align-items:center;
--movement:0;
--element:1;
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

const getX = (e) => {
    if (e.changedTouches)
        return e.changedTouches[0].clientX;
    else {
        e.preventDefault();
        return e.clientX;
    }
}

function Carousel() {
    const [data, setData] = useState([]);

    let container = document.getElementsByName("container")[0];
    let selectedItem = 1;
    let initialX = 0;
    let clicked = false;
    let items;

    useEffect(() => getAll().then(res => setData(res)), []);
    
    useEffect(() => {
        if (data.length != 0) {
            items = document.getElementsByName("items");
            for (let i = 0; i < items.length; i++) {
                if (data[i][1] !== "audio") {
                    let [width, height] = getDimensions(data[i][2]);
                    items[i].style.setProperty("--width", width);
                    items[i].style.setProperty("--height", height);
                }
                window.addEventListener("resize", resizeHandler);
            }
            return () => window.removeEventListener("resize", resizeHandler)
        }
    },[data])

    function resizeHandler() {
        for (let i = 0; i < items.length; i++) {
            if (data[i] !== "audio") {
                let [width, height] = getDimensions(data[i][2]);
                let prevWidth = getComputedStyle(items[i]).getPropertyValue("--width");
                if (width != prevWidth) {
                    items[i].style.setProperty("--width", width);
                    prevWidth = width;
                    items[i].style.setProperty("--height", height);
                }
            }
        }
    }

    function pressHandler(e) {
        clicked = true;
        initialX = getX(e);
        
    }

    function moveHandler(e) {
        if (clicked) {
            let speed = parseInt(getComputedStyle(container).width) / 100;
            let movement = initialX - getX(e);
            container.style.setProperty("--movement", movement / speed);
            container.style.transition = "none";
        }
    }

    function releaseHandler(e) {
        let breakPoint = parseInt(getComputedStyle(container).width) / 3;
        let movement = initialX - getX(e);
        if (movement > breakPoint && selectedItem + 1 != data.length - 1) {
            selectedItem++;
            container.style.setProperty("--element", selectedItem);          
        }
        else if (movement < -breakPoint && selectedItem - 1 != 0) {
            selectedItem--;
            container.style.setProperty("--element", selectedItem);
            
        }
        else if (movement < -breakPoint && selectedItem + 1 != data.length - 1) {
            selectedItem--;
            container.style.transition = "transform 0.5s ease-out";
            container.style.setProperty("--element", selectedItem);
            setTimeout(() => {
                container.style.transition = "none";
                selectedItem = data.length - 2;
                container.style.setProperty("--element", selectedItem)
            }, 600);
        }
        else if (movement > breakPoint && selectedItem - 1 != 0) {
            selectedItem++;
            container.style.transition = "transform 0.5s ease-out";
            container.style.setProperty("--element", selectedItem);
            setTimeout(() => {
                container.style.transition = "none";
                selectedItem = 1;
                container.style.setProperty("--element", selectedItem);
            }, 600);
        }
        container.style.transition = "transform 0.5s ease-out";
        clicked = false;
        container.style.setProperty("--movement", 0);
    }
    let createElements = [];
    for (let i = 0; i < data.length; i++)
        createElements.push(<Content data={data[i]} key={i + 1} id={i + 1} curElement={selectedItem}></Content>);
    
    return (

            <Container touchStart={pressHandler} mouseDown ={pressHandler} touchMove={moveHandler} mouseMove={moveHandler} touchEnd={releaseHandler} mouseUp={releaseHandler}>
                {createElements}
            </Container>

    );
}

export default Carousel;