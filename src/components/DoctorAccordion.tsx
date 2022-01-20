import {
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Day, IDoctorWithFullAddress } from '../types/DoctorTypes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoctorIcon from '../images/doctor.png';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { addDays, format, getDay } from 'date-fns';
import { IBooking } from '../types/BookingTypes';

const CHOOSABLE_DAYS_LENGTH = 10;

interface DoctorAccordionProps {
  doctor: IDoctorWithFullAddress;
  isExpand: boolean;
  bookings: IBooking[];
}

const DoctorAccordion: React.FC<DoctorAccordionProps> = (props) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>('');
  const [isExpand, setIsExpand] = useState<boolean>(props.isExpand);
  const [inavailableDates, setInavailableDates] = useState<string[]>([]);
  const [inavailableTimes, setInavailableTimes] = useState<string[]>([]);
  const [possibleTimes, setPossibleTimes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  /*******************************************************************
   * notice that opening hours time are string in 24-hr format already
   * while booking time is floating number
   ******************************************************************/
  // convert floating time to 24-hr formatted string
  const convertToTimeString = (time: number, type: string) => {
    const factor = type === 'booking' ? 60 : 100;
    let h = String(Math.floor(time));
    let m = String((time - Math.floor(time)) * factor);
    if (Math.floor(time) < 10) {
      h = `0${h}`;
    }
    if (m === '0') {
      m = '00';
    }
    return `${h}:${m}`;
  };

  useEffect(() => {
    /*******************************************************************
     * notice that day of the week is converted to number
     ******************************************************************/

    // generate all possible dates with its day of the week
    let dates: Array<{ date: string; day: number }> = [];
    for (
      let day = new Date();
      day <= addDays(new Date(), CHOOSABLE_DAYS_LENGTH);
      day.setDate(day.getDate() + 1)
    ) {
      // convert to string to ensure it is static forever
      const formattedDate = format(day, 'yyyy-MM-dd');
      if (formattedDate) dates.push({ date: formattedDate, day: getDay(day) });
    }

    // get all inavailable days (of the week) according to doctor's opening hrs
    const inavailableDays = props.doctor.opening_hours
      .filter((hr) => hr.isClosed)
      .map((filteredDay) => Number(Day[filteredDay.day]));

    // get and set all inavailable days within the possible dates
    dates = dates.filter((d) => inavailableDays.includes(d.day));
    setInavailableDates(dates.map((d) => d.date));
  }, [props.doctor]);

  useEffect(() => {
    const filteredBookings = props.bookings.filter(
      (booking) => booking.doctorId === props.doctor.id
    );
    setBookings(filteredBookings);
  }, [props.bookings]);

  useEffect(() => {
    if (date) {
      // formate the date to enhance data comparison
      const formattedDate = format(date, 'yyyy-MM-dd');

      // get day of the week of the selected date
      const dayOfSelectedDate = date.getDay();

      // get start time and end time of the selected date (converted to number for computation)
      const startTime = Number(
        props.doctor.opening_hours.find(
          (hr) => Number(Day[hr.day]) === dayOfSelectedDate
        )?.start
      );
      const endTime = Number(
        props.doctor.opening_hours.find(
          (hr) => Number(Day[hr.day]) === dayOfSelectedDate
        )?.end
      );

      // get all inavailable start time according to all bookings of this doctor
      const inavailableStartTimes = bookings
        .filter((booking) => booking.date === formattedDate)
        .map((filteredBooking) =>
          convertToTimeString(filteredBooking.start, 'booking')
        );

      // generate all possible times
      let possibleTimes = [];
      if (startTime && endTime) {
        for (let t = startTime; t <= endTime; t++) {
          possibleTimes.push(convertToTimeString(t, 'openingHours'));
        }
      }

      // get and set the first available time within the possible times
      const firstAvailableTime = possibleTimes.filter(
        (t) => !inavailableStartTimes.includes(t)
      )[0];
      setTime(firstAvailableTime ?? '');

      // set possible and inavailable times
      setPossibleTimes(possibleTimes);
      setInavailableTimes(inavailableStartTimes);
    }
  }, [date]);

  return (
    <Accordion
      sx={{ mb: '2rem' }}
      expanded={isExpand}
      onChange={(event: React.SyntheticEvent, expanded: boolean) =>
        setIsExpand(expanded)
      }
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <img
          src={DoctorIcon}
          width={100}
          height={100}
          style={{ margin: '0.5rem 1rem 0.5rem 0' }}
        />
        <Grid container flexDirection="column" justifyContent="center">
          <Typography variant="h6" mb={1}>
            {props.doctor.name}
          </Typography>
          <Typography variant="body1" component="div" display="flex">
            <MapsHomeWorkIcon sx={{ paddingRight: 1 }} />
            {props.doctor.fullAddress}
          </Typography>
          {props.doctor.description && (
            <Typography variant="body1" component="div" display="flex">
              <CommentIcon sx={{ paddingRight: 1 }} />
              {props.doctor.description}
            </Typography>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: 'grey.100' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container alignItems="center" justifyContent="space-around">
            <Grid item xs={12} md={5} justifyContent="center">
              <CalendarPicker
                minDate={new Date()}
                maxDate={addDays(new Date(), CHOOSABLE_DAYS_LENGTH)}
                date={date}
                onChange={(newDate) => setDate(newDate)}
                views={['day']}
                shouldDisableDate={(date) =>
                  inavailableDates.includes(format(date, 'yyyy-MM-dd'))
                }
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container flexDirection="column">
                <TextField
                  label="Your Name"
                  variant="standard"
                  sx={{ mb: 5 }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Booking Time</InputLabel>
                  <Select
                    value={time}
                    placeholder="Select a Booking Time"
                    label="Booking Time"
                    onChange={(value) => console.log(value)}
                  >
                    {possibleTimes.map((time) => (
                      <MenuItem
                        value={time}
                        key={time}
                        disabled={inavailableTimes.includes(time)}
                      >
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" sx={{ my: 5, borderRadius: 10 }}>
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </AccordionDetails>
    </Accordion>
  );
};

export default DoctorAccordion;