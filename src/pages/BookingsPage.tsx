import {
  Typography,
  Grid,
  Container,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getBookingById, getDoctors, updateBooking } from '../api';
import { IFormattedBooking, ISnackbarStatus } from '../types/BookingTypes';
import { convertToTimeString } from '../utils/helpers';
import BookingCard from '../components/BookingCard';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<IFormattedBooking[]>([]);
  const [snackbarStatus, setSnackbarStatus] = useState<ISnackbarStatus>({
    isOpen: false,
    message: '',
    status: undefined,
  });

  const { data: doctors, isFetching } = useQuery('doctors', getDoctors, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isFinished = (date: string, start: number) => {
    const startTime = convertToTimeString(start);
    const dateObject = new Date(`${date} ${startTime}`);
    if (new Date() > dateObject) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    async function getUserBookings() {
      const bookingIds = localStorage.getItem('bookings');
      if (bookingIds) {
        const bookingIdsArray = JSON.parse(bookingIds);
        const bookingHistory = await Promise.all(
          bookingIdsArray.map((id: string) => getBookingById(id))
        );
        setBookings(
          bookingHistory
            .map((booking) => ({
              ...booking,
              start: convertToTimeString(booking.start),
              end: convertToTimeString(booking.start + 1),
              status: isFinished(booking.date, booking.start)
                ? 'finished'
                : booking.status,
            }))
            .reverse()
        );
      }
    }

    getUserBookings();
  }, []);

  const { mutateAsync, isLoading } = useMutation(updateBooking, {
    onSuccess: (data) => {
      // update bookings locally instead of refetching all bookings
      let updatedBookingIndex = bookings.findIndex(
        (booking) => booking.id === data.id
      )!;
      const newBookings = [...bookings];
      newBookings[updatedBookingIndex] = {
        ...data,
        start: convertToTimeString(data.start),
        end: convertToTimeString(data.start + 1),
      };
      setBookings(newBookings);
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
      {isFetching || isLoading ? (
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
          {bookings.length > 0 ? (
            <Grid container spacing={3}>
              <>
                {bookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
                    <BookingCard
                      doctor={findDoctorByBooking(booking)}
                      booking={booking}
                      isLoading={isLoading}
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
