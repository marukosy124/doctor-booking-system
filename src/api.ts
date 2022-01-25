import { AxiosResponse } from 'axios';
import axiosInstance from './config/axiosInstance';
import { IBooking, INewBooking, IUpdateBooking } from './types/BookingTypes';
import { IDoctor, IFormattedDoctor } from './types/DoctorTypes';
import { formatDoctorProfile } from './utils/helpers';

/*******************************************************************
 * format doctors first before passing to pages
 ******************************************************************/

export const getDoctors = (): Promise<IFormattedDoctor[]> => {
  return axiosInstance
    .get('/doctor')
    .then((res: AxiosResponse) =>
      res.data.map((doctor: IDoctor) => formatDoctorProfile(doctor))
    );
};

export const getDoctorById = (doctorId: string): Promise<IFormattedDoctor> => {
  return axiosInstance
    .get(`/doctor/${doctorId}`)
    .then((res: AxiosResponse) => formatDoctorProfile(res.data));
};

export const getBookings = (): Promise<IBooking[]> => {
  return axiosInstance.get('/booking').then((res: AxiosResponse) => res.data);
};

export const getBookingById = (bookingId: string): Promise<IBooking> => {
  return axiosInstance
    .get(`/booking/${bookingId}`)
    .then((res: AxiosResponse) => res.data);
};

export const createBooking = (booking: INewBooking): Promise<IBooking> => {
  return axiosInstance
    .post('/booking', booking)
    .then((res: AxiosResponse) => res.data);
};

export const updateBooking = ({
  id,
  status,
}: IUpdateBooking): Promise<IBooking> => {
  return axiosInstance
    .patch(`/booking/${id}`, { status: status })
    .then((res: AxiosResponse) => res.data);
};
