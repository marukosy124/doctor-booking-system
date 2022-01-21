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

export interface ISnackbarStatus {
  isOpen: boolean;
  message: string;
  status: 'success' | 'error' | undefined;
}
