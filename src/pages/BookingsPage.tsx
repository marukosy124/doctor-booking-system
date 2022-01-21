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
  Container,
  CircularProgress,
} from '@mui/material';
import { Day, IDoctor, IDoctorWithFullAddress } from '../types/DoctorTypes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoctorIcon from '../images/doctor.png';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { addDays, format, getDay } from 'date-fns';
import { IBooking, ISnackbarStatus } from '../types/BookingTypes';
import { useMutation, useQueries } from 'react-query';
import { createBooking, getBookings, getDoctors } from '../api';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import BookingAccordion from '../components/BookingAccordion';
import { id } from 'date-fns/locale';

const BookingsPage = () => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<IDoctorWithFullAddress[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  const queries = useQueries([
    {
      queryKey: ['doctors'],
      queryFn: getDoctors,
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
    },
    {
      queryKey: ['bookings'],
      queryFn: getBookings,
      refetchOnWindowFocus: false,
      onSuccess: (data: IBooking[]) => {
        setBookings(data);
      },
    },
  ]);

  const isFetching = queries.some((query) => query.isFetching);

  return (
    <Container sx={{ p: 2, mx: 'auto' }}>
      {isFetching ? (
        <CircularProgress />
      ) : (
        <BookingAccordion doctor={doctors[0]} isExpand booking={bookings[0]} />
      )}
    </Container>
  );
};

export default BookingsPage;
