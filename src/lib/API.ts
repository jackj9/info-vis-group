import axios, { AxiosResponse } from 'axios';

const url = "http://172.187.146.140:8080";



const axiosInstance = axios.create({
    
})



export default class API {
  static sendResult(result: NewTrialResult[]): Promise<NewTrialResponse> {
      
       return axiosInstance.post<NewTrialResponse>(`${url}/result/new`, result)
      .then((response: AxiosResponse<NewTrialResponse>) => {
        return response.data;
      })
      .catch((error) => {
        console.error('API request error:', error);
        throw error; 
      });
  }
}
