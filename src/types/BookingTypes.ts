export interface IBooking {
  id: string;
  status: string;
  name: string;
  start: number;
  doctorId: string;
  date: string;
}

export interface INewBooking extends Omit<IBooking, 'id' | 'status'> {}

export interface IFormattedBooking extends Omit<IBooking, 'status' | 'start'> {
  status: string;
  start: string;
  end: string;
  fullStartDatetime: Date;
}

export interface IUpdateBooking {
  id: string;
  status: string;
}

export interface ISnackbarStatus {
  isOpen: boolean;
  message: string;
  status: 'success' | 'error' | undefined;
}
