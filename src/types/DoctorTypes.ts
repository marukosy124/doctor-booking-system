export enum Day {
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
}

export interface IAddress {
  line_1: string;
  line_2: string;
  district: string;
}

export interface IOpeningHour {
  start: string;
  end: string;
  isClosed: boolean;
  day: Day;
}

export interface IDoctor {
  id: string;
  name: string;
  description: string;
  address: IAddress;
  opening_hours: IOpeningHour[];
}

export interface IDoctorWithFullAddress extends IDoctor {
  fullAddress: string;
}
