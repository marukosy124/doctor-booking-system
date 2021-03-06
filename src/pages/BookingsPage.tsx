import {
  Typography,
  Grid,
  Container,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
  Tab,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getBookings, getDoctors, updateBooking } from '../api';
import {
  IBooking,
  IFormattedBooking,
  ISnackbarStatus,
} from '../types/BookingTypes';
import { convertToTimeString } from '../utils/helpers';
import BookingCard from '../components/BookingCard';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { STATUS } from '../utils/constants';

const BookingsPage = () => {
  const bookingIdsString = localStorage.getItem('bookings');
  const isBookingsUpdatedString = localStorage.getItem('isBookingsUpdated');
  const bookingIds = JSON.parse(bookingIdsString ?? '[]');
  const isBookingsUpdated =
    JSON.parse(isBookingsUpdatedString ?? 'false') === 'true';

  const [snackbarStatus, setSnackbarStatus] = useState<ISnackbarStatus>({
    isOpen: false,
    message: '',
    status: undefined,
  });
  const [currentTab, setCurrentTab] = useState<string>('0');

  // check if the booking has passed current time
  const isFinished = (date: string, start: number) => {
    const startTime = convertToTimeString(start);
    const dateObject = new Date(`${date} ${startTime}`);
    if (new Date() > dateObject) {
      return true;
    } else {
      return false;
    }
  };

  // get all bookings, then filter by stored booking ids in localStorage and do formatting and sorting
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    refetch,
  } = useQuery('bookings', getBookings, {
    enabled: Boolean(bookingIdsString),
    select: useCallback(
      (data: IBooking[]) => {
        // filter out user's bookings
        const bookingHistory = data.filter((booking) =>
          bookingIds.includes(booking.id)
        );
        // format the bookings fto serve the cards
        let filteredUserBookings: IFormattedBooking[] = bookingHistory.map(
          (booking) => ({
            ...booking,
            start: convertToTimeString(booking.start),
            end: convertToTimeString(booking.start + 1),
            status: isFinished(booking.date, booking.start)
              ? 'finished'
              : booking.status,
            fullStartDatetime: new Date(
              `${booking.date} ${convertToTimeString(booking.start)}`
            ),
          })
        );
        // sort the bookings according to the booking time in ascending order
        filteredUserBookings = filteredUserBookings.sort(
          (prevBooking, nextBooking) =>
            prevBooking.fullStartDatetime > nextBooking.fullStartDatetime
              ? 1
              : nextBooking.fullStartDatetime > prevBooking.fullStartDatetime
              ? -1
              : 0
        );
        localStorage.setItem('isBookingsUpdated', JSON.stringify('false'));
        return filteredUserBookings;
      },
      [bookingIds]
    ),
  });

  // only runs the requests when localstorage has stored bookings
  const { data: doctors, isLoading: isDoctorsLoading } = useQuery(
    'doctors',
    getDoctors,
    {
      enabled: Boolean(bookingIdsString),
      onError: () =>
        setSnackbarStatus({
          isOpen: true,
          message: ' Something went wrong. Unable to fetch doctors.',
          status: 'error',
        }),
    }
  );

  // update booking status
  const { mutateAsync, isLoading: isUpdating } = useMutation(updateBooking, {
    onSuccess: async () => {
      await refetch();
      setSnackbarStatus({
        isOpen: true,
        message: 'Your booking has been cancelled',
        status: 'success',
      });
    },
    onError: (error: any) => {
      setSnackbarStatus({
        isOpen: true,
        message: error.response.data,
        status: 'error',
      });
    },
  });

  const findDoctorByBooking = (booking: any) => {
    return doctors?.find((doctor) => doctor.id === booking.doctorId)!;
  };

  return (
    <Container sx={{ p: 2, mx: 'auto' }} maxWidth={false}>
      <Typography variant="h5" pb={2}>
        Your Latest Bookings
      </Typography>
      <TabContext value={currentTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
          <TabList
            onChange={(event: React.SyntheticEvent, newTab: string) =>
              setCurrentTab(newTab)
            }
          >
            {STATUS.map((item, index) => (
              <Tab label={item} key={item} value={String(index)} />
            ))}
          </TabList>
        </Box>
        {STATUS.map((item, index) => (
          <TabPanel value={String(index)} key={item}>
            {isDoctorsLoading ||
            isUpdating ||
            isBookingsLoading ||
            isBookingsUpdated ? (
              <Box
                display="flex"
                justifyContent="center"
                height={400}
                alignItems="center"
                paddingTop={3}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {bookings &&
                bookings.filter((booking) => booking.status === item).length >
                  0 ? (
                  <Grid container spacing={3}>
                    <>
                      {bookings
                        .filter((booking) => booking.status === item)
                        .map((booking) => (
                          <Grid item xs={12} sm={6} md={4} key={booking.id}>
                            <BookingCard
                              doctor={findDoctorByBooking(booking)}
                              booking={booking}
                              isLoading={isUpdating}
                              onCancel={() =>
                                mutateAsync({
                                  id: booking.id,
                                  status: 'cancelled',
                                })
                              }
                            />
                          </Grid>
                        ))}
                    </>
                  </Grid>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    height={400}
                    alignItems="center"
                    paddingTop={3}
                  >
                    <Typography variant="subtitle1" textAlign="center">
                      No bookings
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </TabPanel>
        ))}
      </TabContext>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarStatus.isOpen}
        onClose={() =>
          setSnackbarStatus({
            isOpen: false,
            message: '',
            status: undefined,
          })
        }
        autoHideDuration={3000}
      >
        {snackbarStatus.status && (
          <Alert severity={snackbarStatus.status}>
            {snackbarStatus.message}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default BookingsPage;
