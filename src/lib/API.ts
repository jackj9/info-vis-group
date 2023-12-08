import axios, { AxiosResponse } from 'axios';

const url = "http://172.187.146.140:8080";



const axiosInstance = axios.create({
    
})

export default class API {

  static sendResult(result: NewTrialRequest): Promise<NewTrialResponse> {
    
    console.log(result)
       return axiosInstance.post<NewTrialResponse>(`${url}/result/new`, result)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('API request error:', error);
        throw error; 
      });
  }

  static getResult(): Promise<ChartsResponse> {
    
       return axiosInstance.get<ChartsResponse>(`${url}/charts`)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error) => {
        console.error('API request error:', error);
        throw error; 
      });
  }


}
