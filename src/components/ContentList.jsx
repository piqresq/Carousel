import styled from 'styled-components';

function getAll() {
    const content = require.context('../media', false, /\.(png|jpe?g|gif|svg)$/);
    return content.keys().map(content).map(element=>element=element.default)
}

function ContentList() {
    const content = getAll();
    console.log(content);
    return (
        <>
            {content.map(element => <img src={element}/>)}
        </>
    );
}

export default ContentList;