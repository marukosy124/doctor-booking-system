import axios from './config/axios';
import { IDoctor } from './types/DoctorTypes';

export const getDoctors = (): Promise<IDoctor[]> => {
  return axios.get('/doctor').then((res: any) => res.data);
};

export const getDoctorById = (id: string): Promise<IDoctor> => {
  return axios.get(`/doctor/${id}`).then((res: any) => res.data);
};
