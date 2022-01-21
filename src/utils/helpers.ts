/*******************************************************************
 * notice that opening hours time are string in 24-hr format already
 * while booking time is floating number
 ******************************************************************/

export const convertToTimeString = (time: number) => {
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

export const convertToFloat = (timeString: string, indicator: string) => {
  const [h, m] = timeString.split(indicator).map((digit) => Number(digit));
  const decimalPlace = Number(m / 60);
  return h + decimalPlace;
};
