import React, { useState, useEffect } from 'react';
import API from 'lib/API';
import "./SlideShow.css"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  Filler,
} from 'chart.js';


import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  Colors
);

function SlideShow() {

  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideShowStarted, setSlideShowStarted] = useState<boolean>(false);
  const [slideShowEnded, setSlideShowEnded] = useState<boolean>(false);
  const [startTime, setStartTime] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [showContent, setShowContent] = useState<boolean>(true)
  const [chartData, setChartData] = useState<ChartsResponse>(null)
  const [answers, setAnswers] = useState<NewTrialResult[]>([])

  const shuffleArray = (array: any)  => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  
  }
  const handleButtonClick = async (choice: string) => {

    var endTime = Date.now()
    console.log("choice is ", choice)
    console.log("questions is ", chartData.trials[currentImageIndex].question)
    var responseTime = endTime - startTime
    console.log(chartData.trials[currentImageIndex].chart.datasets[0])

    console.log(currentImageIndex)
    const newTrialResult: NewTrialResult = {
      id:currentImageIndex.toString() ,
      chart: chartData.trials[currentImageIndex].chart.datasets[0].fill ? "area" : "line" ,
      trial: chartData.trials[currentImageIndex].id.toString() ,
      timeTaken: responseTime.toString(),
      answer: choice

    }
    setAnswers((prevAnswers) => [...prevAnswers, newTrialResult]);

    console.log("answers are ", answers)

    if (currentImageIndex < chartData.trials.length-1) {
      setShowContent(false)
      delay(1000).then(() => {

        setShowContent(true)
        setStartTime(Date.now())
        setCurrentImageIndex((prevIndex: number) => {
          const newIndex = prevIndex + 1;
          return newIndex;
        });

      })
    }

    else {
      
      const newRequest: NewTrialRequest = {
        data: answers
      }
      API.sendResult(newRequest)
        .then(() => {
          setShowContent(false);
          setSlideShowEnded(true);

        })
        .catch((error) => {
          console.error("Error:", error);
        });

    }

  };


  const slideShowInit = () => {
    delay(1000)
      .then(() => {
        return API.getResult()
      })
      .then((apiResult) => {
        console.log(apiResult);
        const shuffledData = shuffleArray(apiResult.trials);
        apiResult.trials = shuffledData
        setChartData(apiResult)
        setSlideShowStarted(true)
        setStartTime(Date.now());

      })

      .catch((error) => console.error("Error:", error));
  };



  return (
    <>
      {slideShowStarted && chartData ? (
        <>
          {showContent ? (
            
            <>

              <div className='chart'>
                <Line options={{ responsive: true, scales:{y: {suggestedMin: 0, stacked:chartData.trials[currentImageIndex].chart.datasets[0].fill}} }} data={chartData.trials[currentImageIndex].chart}></Line>
                
                <p className='question'>{chartData.trials[currentImageIndex].question}</p>

                <div className='buttonGroup'>
                  {chartData.trials[currentImageIndex].answers.map((value, index) => (
                    <button key={index} className="button" onClick={() => handleButtonClick(value)}>
                      {value}
                    </button>
                  ))}

                </div>
        
              </div>
              
            </>
          ) : (
            <></>
          )}

        </>
      ) : (
        <>
          <p>This is a test for COMP3736 Information visulization.
              The results from the test wil be stored by our research group to be used in a study on the effectiveness of Area and Line charts at showing data across ranges
              No personal data about you or your machine will be stored and your data will not be sold or transfered to any other party outside of the University of Leeds. By click the start button you consent to your answers being stored.
             Do not refresh the page at any point during the test or it will restart the test and your resutls will not be saved.</p>
          <button className='button' onClick={slideShowInit}>start</button>
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
