import React, { useState, useEffect } from 'react';
import imagearray from 'components/Image/Image';
import questions from "assets/questions.json"
import API from 'lib/API';
import { error } from 'console';

function SlideShow() {

  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [slideShowStarted, setSlideShowStarted] = useState<boolean>(false);
  const [slideShowEnded, setSlideShowEnded] = useState<boolean>(false);

  const [startTime, setStartTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(null)
  const [showContent, setShowContent] = useState<boolean>(true)
  

  const [answers, setAnswers] = useState<NewTrialResult[]>([])
  

  const handleButtonClick = async (choice: string) => {

    var endTime = Date.now()
    
    setResponseTime(endTime - startTime)
    var chartType = "area"


    if (currentImageIndex <= 9 ){
      chartType = "line"
    }
    console.log(choice)
    const newTrialResult: NewTrialResult = {
      id: currentImageIndex,
      chart: chartType,
      trial: 1,
      timeTaken: responseTime,
      answer: choice

    }
    setAnswers(answers => [...answers, newTrialResult]);



    if (currentImageIndex != questions.length - 1) {
      setShowContent(false)
      delay(1000).then(() => {

        setShowContent(true)
        setStartTime(Date.now())  
        setCurrentImageIndex((prevIndex: number) => prevIndex + 1);
        setCurrentQuestion(questions[currentImageIndex])

      })
    }

    else {
      API.sendResult(answers)
      .then(() => {
        setShowContent(false);
        setSlideShowEnded(true);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    }
  
  };

  const slideShowInit = async () => {
    
    setSlideShowStarted(true)

    setStartTime(Date.now())
    await delay(1000); // Initial delay before showing the first image

  };


  useEffect(() => {
    setCurrentQuestion(questions[currentImageIndex]);
  }, [currentImageIndex]);


  return (
    <>
      {slideShowStarted ? (
        <>
          {showContent ? (
            <>
              <img
                src={imagearray[currentImageIndex]}
                alt=""
                style={{ width: '500px', height: '500px', margin: '5px' }}
              />

              <p>{currentQuestion.question}</p>
              {currentQuestion.choices.map((choice, choiceIndex) => (

                <button key={choiceIndex} onClick={() => handleButtonClick(choice)}>
                  {choice}
                </button>

              ))}
              {responseTime !== null && (
                <p>Response Time: {responseTime} milliseconds</p>
              )}

            </>
          ) : (
            <></>
        )}


        </>
      ) : (
        <>
        <p>This is a test for information visulization . Do not refresh the page at any point during the test or it will restart</p>
        <button onClick={slideShowInit}>start</button>
      </>
      )
      
      
      }

      {slideShowEnded && (
        <p>This slideshow is over thank you </p>
      )}
    
    </>
  );
}

export default SlideShow;
