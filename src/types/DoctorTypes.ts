export interface IAddress {
  line_1: 'string';
  line_2: 'string';
  district: 'string';
}

export interface IOpeningHour {
  start: 'string';
  end: 'string';
  isClosed: boolean;
  day: 'string';
}

export interface IDoctor {
  id: 'string';
  name: 'string';
  description: 'string';
  address: IAddress;
  opening_hours: IOpeningHour[];
}
