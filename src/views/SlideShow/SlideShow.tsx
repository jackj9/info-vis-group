import React from 'react';
import {useEffect, useState} from 'react'
import Image1 from 'assets/image9.png'
import imagearray from 'components/Image/Image';

function SlideShow() {
    
    const delay = async (ms: number) => {
        return new Promise((resolve) => 
            setTimeout(resolve, ms));
    };
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        console.log("Current index is " , currentImageIndex)
        changeImage()
    })
    const changeImage =async () => {

        if (currentImageIndex !== imagearray.length -1 ) {
            console.log(currentImageIndex)
            await delay(1000)
    
            setCurrentImageIndex(currentImageIndex + 1);
        }

    };

    return (
        <>
        <div>
            <img src={imagearray[currentImageIndex]}  alt='' style={{ width: '500px', height: '500px', margin: '5px' }} />

        </div>

        </>
    )
}
export default SlideShow