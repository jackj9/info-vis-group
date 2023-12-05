import React, { useState, useEffect } from 'react';
import imagearray from 'components/Image/Image';

function SlideShow() {
  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [slideShowStarted, setSlideShowStarted] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const startSlideshow = async () => {
    setShowButton(false);
    await delay(1000); // Initial delay before showing the first image
    setStartTime(Date.now()); // Record the start time when the first image is shown
    setShowButton(true);
  };

  const changeImage = async () => {
    if (currentImageIndex < imagearray.length - 1) {
      await delay(1000);
      setStartTime(Date.now()); // Record the start time when the button is shown
      setShowButton(true);
    }
  };

  const handleButtonClick = () => {
    setShowButton(false);
    const endTime = Date.now();
    setResponseTime(endTime - startTime); // Calculate the response time
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  const slideShowInit = () => {
    setSlideShowStarted(true)
  };



  useEffect(() => {
    console.log(slideShowStarted )
    console.log(currentImageIndex )

    if (currentImageIndex === 0 && slideShowStarted == true) {
      startSlideshow();
    }
    else if (currentImageIndex !== 0 && slideShowStarted == true){
      changeImage();
    }
  }, [currentImageIndex]);

  return (
    <div>
    {slideShowStarted  ? (
        <>
              {showButton ? (
        <button onClick={handleButtonClick}>Next Slide</button>
      ) : (
        <img
          src={imagearray[currentImageIndex]}
          alt=""
          style={{ width: '500px', height: '500px', margin: '5px' }}
        />
      )}
        </>
    ) : (
        <>        <button onClick={slideShowInit}>start</button>
        </>
    )}

    


 
    </div>
  );
}

export default SlideShow;
