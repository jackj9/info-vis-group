import React, { useState, useEffect } from 'react';
import API from 'lib/API';
import  "./SlideShow.css"

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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  

  const handleButtonClick = async () => {

    var endTime = Date.now()

    var responseTime = endTime - startTime
    setResponseTime(responseTime)

    var chartType = "area"

    if (currentImageIndex <= 9 ){
      chartType = "line"
    }
    const newTrialResult: NewTrialResult = {
      id: currentImageIndex?.toString(),
      chart: chartType,
      trial: "1",
      timeTaken: responseTime.toString(),
      answer: "red"

    }
    setAnswers(answers => [...answers, newTrialResult]);


    if (currentImageIndex != 9) {
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
        setChartData(apiResult)

      })

      .catch((error) => console.error("Error:", error));
  };
  
  
  useEffect(() => {
    console.log("useeffect")
    console.log(chartData)
    setStartTime(Date.now());
  
    if (!slideShowStarted) {
      setSlideShowStarted(true);
    }

    
  }, [currentImageIndex]);
  

  return (
    <>
      {slideShowStarted && chartData ? (
        <>
          {showContent ? (
            <>
              <div className='chart'>
                <Line  options={{responsive: true}}  data={chartData.lineCharts[currentImageIndex]}></Line>
                <button className="button" onClick={()=> handleButtonClick()}>red</button>

              </div>
          

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
