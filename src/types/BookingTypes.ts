enum Status {
  'cancel',
  'confirmed',
}

export interface IBooking {
  id: string;
  name: string;
  start: number;
  doctorId: string;
  date: string;
  status: Status;
}
