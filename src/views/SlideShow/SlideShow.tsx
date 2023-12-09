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
  defaults,
} from 'chart.js';


import { Line } from 'react-chartjs-2';
import { boolean } from 'yargs';

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

  // Style options for the Chart component
  // 'options.scales.y.stacked' sets whether the chart is a line or stacked area chart 
  const chartOptions = (chartData: ChartsResponse) => {
    // Determine what type of chart is being displayed
    // fill: true = stacked area chart
    // fill: false = line chart
    const stacked: boolean = chartData.trials[currentImageIndex].chart.datasets[0].fill
    // Set the font size for all labels in the chart 
    defaults.font.size = 16 
    return chartData ? ({
      options: {
        defaults: { 
          font: {
            size: 20
          }
        },
        responsive: true,
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: "Number of medals won",
              padding: 20,
            },
            suggestedMin: 0,
            stacked: stacked,
          }
        },
        plugins: {
          title: {
            display: true,
            text: "Number of Olympic Medals Won"
          },
          legend: {
            display: true,
            position: "top" as const
          },
          tooltip: {
            enabled: false,
          }
        },

      }
    }) : null
  }


  return (
    <>
      {slideShowStarted && chartData ? (
        <>
          {showContent ? (
            
            <>
              <h1>
                Trial {currentImageIndex+1} / 20
              </h1>
              <div className='chart'>
                <Line options={chartOptions(chartData).options} data={chartData.trials[currentImageIndex].chart}></Line>
                
                <p className='question'>{chartData.trials[currentImageIndex].question}</p>

                <div className='buttonGroup'>
                  {chartData.trials[currentImageIndex].chart.datasets.map((value, index) => (
                    <button key={index} className="button" onClick={() => handleButtonClick(value.label)}>
                      {value.label}
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
          <p>
            You are participating in a experiment for a group assignment 
            for COMP3736 Information Visualization. The results from the experiment
            wil be stored by our research group to be used in a study on comparing 
            the effectiveness of stacked area and line charts in visualising data.
          </p>
          <p>
            No personal data about you or your machine will be stored, and your 
            data will not be sold or transfered to any other party outside of the
            University of Leeds. By clicking the start button you consent to your
            answers being stored.
          </p>
          <p>
            <b>Do not refresh the page at any point during the test</b> or
            it will restart the test and your results will not be saved.
          </p>
          <button className='button' onClick={slideShowInit}>start</button>
        </>
      )
      }
      {slideShowEnded && (
        <>
          <p>The experiment is now complete.</p>
          <p>Thank you for your participation</p>
        </>
      )}

    </>
  );
}

export default SlideShow;
