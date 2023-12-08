interface NewTrialResult {
    id: string,
    chart: string,
    trial: string,
    timeTaken: string, 
    answer: string
}

interface NewTrialResponse {
    message: string
}

interface NewTrialRequest {
    data: NewTrialResult[]
}


interface CountryData {
    label: "contry"
}


interface LineChart  {
	label:sting 
    data: number[]
}

interface LineData  {
	labels: string[]
	datasets:  LineChart[]
}

interface ChartsResponse {
	lineCharts: LineData[] 
}
interface ChartDataRequest {
    data: number[]
}




interface ChartDataset  {
	label: string,
	data: number, 
	fill: boolean 
}

interface Chart  {
	labels: string[] 
	datasets: ChartDataset[]
}

interface Trial  {
	id: number 
	question: string 
	answers: string[] 
	chart: Chart 
}

interface ChartsResponse  {
	trials: Trial[] 
}