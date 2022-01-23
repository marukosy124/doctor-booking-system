import {
  Typography,
  Grid,
  Container,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getBookings, getDoctors, updateBooking } from '../api';
import {
  IBooking,
  IFormattedBooking,
  ISnackbarStatus,
} from '../types/BookingTypes';
import { convertToTimeString } from '../utils/helpers';
import BookingCard from '../components/BookingCard';
import { queryClient } from '../config/reactQuery';

const BookingsPage = () => {
  const [userBookings, setUserBookings] = useState<IFormattedBooking[]>([]);
  const [snackbarStatus, setSnackbarStatus] = useState<ISnackbarStatus>({
    isOpen: false,
    message: '',
    status: undefined,
  });

  const { data: doctors, isLoading: isDoctorsLoading } = useQuery(
    'doctors',
    getDoctors,
    {
      refetchOnWindowFocus: false,
      retry: false,
      initialData: () => queryClient.getQueryData('doctors'),
    }
  );

  const { isLoading: isBookingsLoading, isFetching } = useQuery(
    'bookings',
    getBookings,
    {
      refetchOnWindowFocus: false,
      retry: false,
      initialData: () => queryClient.getQueryData('bookings'),
      onSuccess: async (data: IBooking[]) => {
        const bookingIds = localStorage.getItem('bookings');
        if (bookingIds) {
          const bookingIdsArray = JSON.parse(bookingIds);
          const bookingHistory = data.filter((booking) =>
            bookingIdsArray.includes(booking.id)
          );
          const filteredUserBookings = bookingHistory
            .map((booking) => ({
              ...booking,
              start: convertToTimeString(booking.start),
              end: convertToTimeString(booking.start + 1),
              status: isFinished(booking.date, booking.start)
                ? 'finished'
                : booking.status,
            }))
            .reverse();
          setUserBookings(filteredUserBookings);
        }
      },
    }
  );

  const isFinished = (date: string, start: number) => {
    const startTime = convertToTimeString(start);
    const dateObject = new Date(`${date} ${startTime}`);
    if (new Date() > dateObject) {
      return true;
    } else {
      return false;
    }
  };

  const { mutateAsync, isLoading: isUpdating } = useMutation(updateBooking, {
    onSuccess: (data) => {
      // update bookings locally instead of refetching all bookings
      let updatedBookingIndex = userBookings.findIndex(
        (booking) => booking.id === data.id
      )!;
      const newBookings = [...userBookings];
      newBookings[updatedBookingIndex] = {
        ...data,
        start: convertToTimeString(data.start),
        end: convertToTimeString(data.start + 1),
      };
      setUserBookings(newBookings);
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
      <Typography variant="h5" pb={4}>
        Your Bookings
      </Typography>
      {isDoctorsLoading || isBookingsLoading || isUpdating || isFetching ? (
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
          {userBookings.length > 0 ? (
            <Grid container spacing={3}>
              <>
                {userBookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
                    <BookingCard
                      doctor={findDoctorByBooking(booking)}
                      booking={booking}
                      isLoading={isUpdating}
                      onCancel={() =>
                        mutateAsync({
                          bookingId: booking.id,
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
        key="test"
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
