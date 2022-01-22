import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Theme,
  Typography,
  Alert,
} from '@mui/material';
import { IFormattedDoctor } from '../types/DoctorTypes';
import { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { addDays, format, getDay } from 'date-fns';
import { IBooking } from '../types/BookingTypes';
import { useMutation, useQuery } from 'react-query';
import { createBooking, getBookings } from '../api';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { convertToFloat, convertToTimeString } from '../utils/helpers';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { AxiosError } from 'axios';

const CHOOSABLE_DAYS_LENGTH = 10;

interface BookingModalProps {
  doctor: IFormattedDoctor;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = (props) => {
  const navigate = useNavigate();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [minDate, setMinDate] = useState<Date>(new Date());
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>('');
  const [inavailableDates, setInavailableDates] = useState<string[]>([]);
  const [inavailableTimes, setInavailableTimes] = useState<string[]>([]);
  const [possibleTimes, setPossibleTimes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [name, setName] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { isFetching, isFetched } = useQuery('bookings', getBookings, {
    refetchOnWindowFocus: false,
    onSuccess: (data: IBooking[]) => {
      const confirmedBookings = data.filter(
        (booking) =>
          booking.status === 'confirmed' && booking.doctorId === props.doctor.id
      );
      setBookings(confirmedBookings);
    },
  });

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
      dates.push({ date: formattedDate, day: getDay(day) });
    }

    // get all inavailable days (of the week) according to doctor's opening hrs
    const inavailableDays = props.doctor.opening_hours
      .filter((hr) => hr.isClosed)
      .map((filteredDay) => filteredDay.day);

    // get and set all inavailable days within the possible dates
    dates = dates.filter((d) => inavailableDays.includes(d.day));
    setInavailableDates(dates.map((d) => d.date));
  };

  const computeTimes = () => {
    if (date) {
      // formate the date to enhance data comparison
      const formattedDate = format(date, 'yyyy-MM-dd');

      // convert current time to float
      const currentTime = convertToFloat(format(new Date(), 'HH:mm'), ':');

      // get day of the week of the selected date
      const dayOfSelectedDate = date.getDay();

      const startTime = props.doctor.opening_hours.find(
        (hour) => hour.day === dayOfSelectedDate
      )?.start;

      const endTime = props.doctor.opening_hours.find(
        (hour) => hour.day === dayOfSelectedDate
      )?.end;

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

      // set min date as tomorrow if user tries to select today's time slot after today's end time
      if (
        new Date() >=
        new Date(
          `${format(new Date(), 'yyyy-MM-dd')} ${
            possibleTimesString[possibleTimesString.length - 1]
          }`
        )
      ) {
        setMinDate(addDays(new Date(), 1));
      } else {
        setMinDate(new Date());
      }
      // set possible and inavailable times
      setPossibleTimes(possibleTimesString);
      setInavailableTimes(crashedTimes);
    }
  };

  // compute when modal is open
  useEffect(() => {
    if (props.doctor && isFetched) {
      computeDates();
      computeTimes();
    }
  }, [props.doctor, isFetched]);

  // re-compute when date change
  useEffect(() => {
    if (date) {
      computeDates();
      computeTimes();
    }
  }, [date]);

  const { mutate, isSuccess, isLoading } = useMutation(createBooking, {
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
    },
    onError: (error: AxiosError) => {
      setError(error.response?.data);
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
      mutate(bookingRequest);
    }
  };

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xl" onClose={props.onClose} open>
      <DialogTitle>
        Make a Booking
        <IconButton
          onClick={props.onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: Theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex' }}>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
            minWidth: fullScreen ? '100%' : 780,
            minHeight: 300,
            justifyContent: 'center',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {isFetching ? (
            <CircularProgress sx={{ m: 'auto' }} />
          ) : (
            <>
              {isSuccess ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <CheckCircleOutlineRoundedIcon
                    color="primary"
                    fontSize="large"
                    sx={{ fontSize: 100 }}
                  />
                  <Typography variant="h6" my={2} textAlign="center">
                    Your booking has been registered successfully
                  </Typography>
                </Box>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Typography
                    variant="h6"
                    alignItems="center"
                    component="div"
                    display="flex"
                  >
                    <PersonRoundedIcon sx={{ paddingRight: 1 }} />
                    {props.doctor.name}
                  </Typography>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-around"
                  >
                    <Grid item xs={12} md={5} justifyContent="center">
                      <CalendarPicker
                        minDate={minDate}
                        maxDate={addDays(new Date(), CHOOSABLE_DAYS_LENGTH)}
                        date={date}
                        onChange={(newDate) => setDate(newDate)}
                        views={['day']}
                        shouldDisableDate={(date) =>
                          inavailableDates.includes(format(date, 'yyyy-MM-dd'))
                        }
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Grid container flexDirection="column">
                        <TextField
                          required
                          error={isEmpty}
                          label="Your Name"
                          variant="standard"
                          sx={{ mb: 5 }}
                          fullWidth
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                        />
                        <Typography variant="subtitle1" pb={2}>
                          {date && format(date, 'EEEE, do MMMM yyyy')}
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel>Booking Time</InputLabel>
                          <Select
                            value={time}
                            placeholder="Select a Booking Time"
                            label="Booking Time"
                            onChange={(e) => setTime(e.target.value)}
                            disabled={isLoading}
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
                      </Grid>
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          fullWidth
          loading={isLoading}
          variant="contained"
          sx={{ m: 2, borderRadius: 10 }}
          onClick={isSuccess ? () => navigate('/bookings') : handleSubmit}
        >
          {isSuccess ? 'Check Your Bookings' : 'Confirm'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;