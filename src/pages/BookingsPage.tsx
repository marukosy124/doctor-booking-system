import {
  Typography,
  Grid,
  Container,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { IDoctor, IDoctorWithFullAddress } from '../types/DoctorTypes';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getBookingById, getDoctors, updateBooking } from '../api';
import BookingAccordion from '../components/BookingCard';
import { IFormattedBooking, ISnackbarStatus } from '../types/BookingTypes';
import { convertToTimeString } from '../utils/helpers';

const BookingsPage = () => {
  const [doctors, setDoctors] = useState<IDoctorWithFullAddress[]>([]);
  const [bookings, setBookings] = useState<IFormattedBooking[]>([]);
  const [snackbarStatus, setSnackbarStatus] = useState<ISnackbarStatus>({
    isOpen: false,
    message: '',
    status: undefined,
  });

  const { isFetching } = useQuery('doctors', getDoctors, {
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data: IDoctor[]) => {
      let formattedDoctors = [...data].map((doctor) => ({
        ...doctor,
        fullAddress: doctor.address.line_1.concat(
          ', ',
          doctor.address.line_2,
          ', ',
          doctor.address.district
        ),
      }));
      setDoctors(formattedDoctors);
    },
  });

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
    return doctors.find((doctor) => doctor.id === booking.doctorId)!;
  };

  return (
    <Container sx={{ p: 2, mx: 'auto' }}>
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
        <Grid container>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <BookingAccordion
                doctor={findDoctorByBooking(booking)}
                booking={booking}
                isLoading={isLoading}
                onCancel={() =>
                  mutateAsync({ bookingId: booking.id, status: 'cancelled' })
                }
              />
            </Grid>
          ))}
        </Grid>
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
