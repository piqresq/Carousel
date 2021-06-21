import styled from 'styled-components';
import { useState, useEffect, useRef } from "react";
import Content from './Content';

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


function Carousel() {

    const [data, setData] = useState([]);
    let selectedItem = 1;
    useEffect(() => getAll().then(res => setData(res)), []);
    let initialX = 0;

//TODO: implement an array of refs that will reference each element
    let elements = document.getElementsByName("element");

    function touchStartHandler(e) {
        initialX = e.touches[0].clientX;
    }

    function touchEndHandler(e) {
        //TODO: get width of the element and divide it by 2 to decide if the element should be switched to a new one
        let movement = initialX - e.changedTouches[0].clientX;
        if (movement > 200) {
            selectedItem++;
            for (let element of elements)
                element.style.setProperty("--element", selectedItem);
        }
        else if (movement < -200) {
            selectedItem--;
            for (let element of elements)
                element.style.setProperty("--element", selectedItem);
        }
        for (let element of elements)
            element.style.setProperty("--movement", 0);
    }

    function touchMoveHandler(e) {

        let movement = initialX - e.touches[0].clientX;
            for (let element of elements)
                element.style.setProperty("--movement", movement/4);
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