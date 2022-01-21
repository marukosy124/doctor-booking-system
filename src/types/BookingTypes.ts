export interface INewBooking {
  name: string;
  start: number;
  doctorId: string;
  date: string;
}

export interface IBooking extends INewBooking {
  id: string;
  status: 'cancelled' | 'confirmed';
}

export interface IFormattedBooking {
  id: string;
  status: 'cancelled' | 'confirmed';
  name: string;
  start: string;
  end: string;
  doctorId: string;
  date: string;
}

export interface IUpdateBooking {
  bookingId: string;
  status: string;
}

export interface ISnackbarStatus {
  isOpen: boolean;
  message: string;
  status: 'success' | 'error' | undefined;
}
