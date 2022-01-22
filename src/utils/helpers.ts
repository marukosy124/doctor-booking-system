/*******************************************************************
 * notice that opening hours time are string in 24-hr format already
 * while booking time is floating number
 ******************************************************************/

import { Day, IDoctor, IFormattedDoctor } from '../types/DoctorTypes';

export const convertToTimeString = (time: number): string => {
  let h = String(Math.floor(time));
  let m = String(Math.floor((time - Math.floor(time)) * 60));
  if (Number(h) < 10) {
    h = `0${h}`;
  }
  if (Number(m) < 10) {
    m = `0${m}`;
  }
  return `${h}:${m}`;
};

export const convertToFloat = (
  timeString: string,
  indicator: string
): number => {
  const [h, m] = timeString.split(indicator).map((digit) => Number(digit));
  const decimalPlace = Number(m / 60);
  return h + decimalPlace;
};

export const formatDoctorProfile = (doctor: IDoctor): IFormattedDoctor => {
  return {
    ...doctor,
    fullAddress: doctor.address.line_1.concat(
      ', ',
      doctor.address.line_2,
      ', ',
      doctor.address.district
    ),
    opening_hours: doctor.opening_hours.map((hour) => ({
      ...hour,
      start: convertToFloat(hour.start, '.'),
      end: convertToFloat(hour.end, '.'),
      day: Number(Day[hour.day]),
    })),
  };
};
