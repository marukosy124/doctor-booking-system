import axios from './config/axios';
import { IBooking, INewBooking, IUpdateBooking } from './types/BookingTypes';
import { IDoctor } from './types/DoctorTypes';

export const getDoctors = (): Promise<IDoctor[]> => {
  return axios.get('/doctor').then((res: any) => res.data);
};

export const getDoctorById = (doctorId: string): Promise<IDoctor> => {
  return axios.get(`/doctor/${doctorId}`).then((res: any) => res.data);
};

export const getBookings = (): Promise<IBooking[]> => {
  return axios.get('/booking').then((res: any) => res.data);
};

export const getBookingById = (bookingId: string): Promise<IBooking> => {
  return axios.get(`/booking/${bookingId}`).then((res: any) => res.data);
};

export const createBooking = (booking: INewBooking): Promise<IBooking> => {
  return axios.post('/booking', booking).then((res: any) => res.data);
};

export const updateBooking = ({
  bookingId,
  status,
}: IUpdateBooking): Promise<IBooking> => {
  return axios
    .patch(`/booking/${bookingId}`, { status: status })
    .then((res: any) => res.data);
};
