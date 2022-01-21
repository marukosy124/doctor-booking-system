import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
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
import { useMutation } from 'react-query';
import { createBooking } from '../api';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { convertToFloat, convertToTimeString } from '../utils/helpers';

const CHOOSABLE_DAYS_LENGTH = 10;

interface DoctorAccordionProps {
  doctor: IDoctorWithFullAddress;
  isExpand: boolean;
  bookings: IBooking[];
}

const DoctorAccordion: React.FC<DoctorAccordionProps> = (props) => {
  const navigate = useNavigate();

  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>('');
  const [isExpand, setIsExpand] = useState<boolean>(props.isExpand);
  const [inavailableDates, setInavailableDates] = useState<string[]>([]);
  const [inavailableTimes, setInavailableTimes] = useState<string[]>([]);
  const [possibleTimes, setPossibleTimes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>(props.bookings);
  const [name, setName] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const computeDates = () => {
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
  };

  const computeBookings = () => {
    const filteredBookings = props.bookings.filter(
      (booking) => booking.doctorId === props.doctor.id
    );
    setBookings(filteredBookings);
  };

  const computeTimes = () => {
    if (date && props.bookings && props.doctor) {
      // formate the date to enhance data comparison
      const formattedDate = format(date, 'yyyy-MM-dd');

      // convert current time to floar
      const currentTime = convertToFloat(format(new Date(), 'HH:mm'), ':');

      // get day of the week of the selected date
      const dayOfSelectedDate = date.getDay();

      const startTime = convertToFloat(
        props.doctor.opening_hours.find(
          (hr) => Number(Day[hr.day]) === dayOfSelectedDate
        )?.start ?? '',
        '.'
      );
      const endTime = convertToFloat(
        props.doctor.opening_hours.find(
          (hr) => Number(Day[hr.day]) === dayOfSelectedDate
        )?.end ?? '',
        '.'
      );

      // get all booked start time of this doctor
      const bookedTimes = bookings
        .filter((booking) => booking.date === formattedDate)
        .map((filteredBooking) => filteredBooking.start);

      // generate all possible times in float
      let possibleTimes = [];
      if (startTime && endTime) {
        for (let t = startTime; t < endTime; t++) {
          possibleTimes.push(t);
        }
      }

      // get all crashed times for disabling time slot
      let crashedTimes: string[] = [];
      const today = format(new Date(), 'yyyy-MM-dd');
      possibleTimes.forEach((time) => {
        const isInavailable =
          bookedTimes.some((bookedTime) => {
            return time >= bookedTime && time < bookedTime + 1;
          }) ||
          (time <= currentTime && formattedDate === today);
        if (isInavailable) {
          crashedTimes.push(convertToTimeString(time));
        }
      });

      // convert all possible times to time string
      const possibleTimesString = possibleTimes.map((time) =>
        convertToTimeString(time)
      );
      // get and set the first available time within the possible times
      const firstAvailableTime = possibleTimesString.filter(
        (t) => !crashedTimes.includes(t)
      )[0];
      setTime(firstAvailableTime ?? '');

      // set possible and inavailable times
      setPossibleTimes(possibleTimesString);
      setInavailableTimes(crashedTimes);
    }
  };

  useEffect(() => {
    if (isExpand) {
      computeDates();
      computeTimes();
      computeBookings();
    }
  }, [isExpand, props.bookings, props.doctor]);

  useEffect(() => {
    if (isExpand) {
      computeDates();
      computeTimes();
    }
  }, [date]);

  const createMutation = useMutation(createBooking, {
    onSuccess: (data) => {
      // store booking in localstorage
      const bookingHistory = localStorage.getItem('bookings');
      if (!bookingHistory) {
        localStorage.setItem('bookings', JSON.stringify([data.id]));
      } else {
        const newBookingHistory = new Set(JSON.parse(bookingHistory));
        newBookingHistory.add(data.id);
        localStorage.setItem(
          'bookings',
          JSON.stringify(Array.from(newBookingHistory))
        );
      }

      navigate(`/bookings`);
    },
    onError: (error: any) => {
      setError(error.response.data);
    },
  });

  const handleSubmit = () => {
    if (!name) {
      setIsEmpty(true);
    } else if (date) {
      setIsEmpty(false);
      const bookingRequest = {
        name: name,
        doctorId: props.doctor.id,
        start: convertToFloat(time, ':'),
        date: format(date, 'yyyy-MM-dd'),
      };
      createMutation.mutate(bookingRequest);
    }
  };

  return (
    <>
      <Accordion
        sx={{ mb: '2rem' }}
        expanded={isExpand}
        onChange={(event: React.SyntheticEvent, expanded: boolean) =>
          setIsExpand(expanded)
        }
        TransitionProps={{ mountOnEnter: true }}
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
                  disabled={createMutation.isLoading}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <Grid container flexDirection="column">
                  <TextField
                    error={isEmpty}
                    helperText="Please input your name"
                    label="Your Name"
                    variant="standard"
                    sx={{ mb: 5 }}
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                    disabled={createMutation.isLoading}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Booking Time</InputLabel>
                    <Select
                      value={time}
                      placeholder="Select a Booking Time"
                      label="Booking Time"
                      onChange={(e) => setTime(e.target.value)}
                      disabled={createMutation.isLoading}
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
                  <LoadingButton
                    loading={createMutation.isLoading}
                    variant="contained"
                    sx={{ my: 5, borderRadius: 10 }}
                    onClick={handleSubmit}
                  >
                    Confirm
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(error)}
        onClose={() => setError('')}
        autoHideDuration={3000}
        key="test"
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
};

export default DoctorAccordion;
