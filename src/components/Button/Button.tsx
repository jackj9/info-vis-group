import React from 'react';


interface ImageProps {
    url: string
}

function Image(props: ImageProps) {
    const { url } = props;

    return (
        <img src={url}></img>
    )
}
export default Image