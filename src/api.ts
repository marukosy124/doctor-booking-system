import { AxiosResponse } from 'axios';
import axios from './config/axios';
import { IBooking, INewBooking, IUpdateBooking } from './types/BookingTypes';
import { IDoctor, IFormattedDoctor } from './types/DoctorTypes';
import { formatDoctorProfile } from './utils/helpers';

/*******************************************************************
 * format doctors first before passing to pages
 ******************************************************************/

export const getDoctors = (): Promise<IFormattedDoctor[]> => {
  return axios
    .get('/doctor')
    .then((res: AxiosResponse) =>
      res.data.map((doctor: IDoctor) => formatDoctorProfile(doctor))
    );
};

export const getDoctorById = (doctorId: string): Promise<IFormattedDoctor> => {
  return axios
    .get(`/doctor/${doctorId}`)
    .then((res: AxiosResponse) => formatDoctorProfile(res.data));
};

export const getBookings = (): Promise<IBooking[]> => {
  return axios.get('/booking').then((res: AxiosResponse) => res.data);
};

export const getBookingById = (bookingId: string): Promise<IBooking> => {
  return axios
    .get(`/booking/${bookingId}`)
    .then((res: AxiosResponse) => res.data);
};

export const createBooking = (booking: INewBooking): Promise<IBooking> => {
  return axios.post('/booking', booking).then((res: AxiosResponse) => res.data);
};

export const updateBooking = ({
  bookingId,
  status,
}: IUpdateBooking): Promise<IBooking> => {
  return axios
    .patch(`/booking/${bookingId}`, { status: status })
    .then((res: AxiosResponse) => res.data);
};
