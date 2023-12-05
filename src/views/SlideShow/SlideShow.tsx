import React, { useState, useEffect } from 'react';
import imagearray from 'components/Image/Image';

function SlideShow() {
  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const changeImage = async () => {
    if (currentImageIndex < imagearray.length - 1) {
      await delay(1000);
      setShowButton(true);
      setStartTime(Date.now()); // Record the start time when the button is shown
    }
  };

  const handleButtonClick = () => {
    setShowButton(false);
    const endTime = Date.now();
    setResponseTime(endTime - startTime); // Calculate the response time
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      changeImage();
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  return (
    <div>
      {showButton ? (
        <button onClick={handleButtonClick}>Next Slide</button>
      ) : (
        <img
          src={imagearray[currentImageIndex]}
          alt=""
          style={{ width: '500px', height: '500px', margin: '5px' }}
        />
      )}

      {responseTime !== null && (
        <p>Response Time: {responseTime} milliseconds</p>
      )}
    </div>
  );
}

export default SlideShow;
