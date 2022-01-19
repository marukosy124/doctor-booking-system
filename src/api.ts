import axios from './config/axios';
import { IDoctor } from './types/DoctorTypes';

export const getDoctors = (): Promise<IDoctor[]> => {
  return axios.get('/doctor').then((res: any) => res.data);
};
