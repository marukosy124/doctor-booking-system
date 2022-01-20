import {
  Container,
  IconButton,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState, ChangeEvent, useEffect, KeyboardEvent } from 'react';
import { useQueries } from 'react-query';
import { getBookings, getDoctorById, getDoctors } from '../api';
import { IDoctor, IDoctorWithFullAddress } from '../types/DoctorTypes';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import DoctorAccordion from '../components/DoctorAccordion';
import { IBooking } from '../types/BookingTypes';

const DoctorsPage: React.FC = (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const queryString = searchParams.get('q') ?? '';

  const [searchQuery, setSearchQuery] = useState<string>(queryString);
  const [doctors, setDoctors] = useState<IDoctorWithFullAddress[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  const [
    { isFetching: isDoctorsFetching, refetch: refetchDoctors },
    { isFetching: isDoctorFetching, refetch: refetchDoctor },
    { isFetching: isBookingsFetching, refetch: refetchBookings },
  ] = useQueries([
    {
      queryKey: ['doctors'],
      queryFn: getDoctors,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !Boolean(id),
      onSuccess: (data: IDoctor[]) => {
        let filteredDoctors = [...data].map((doctor) => ({
          ...doctor,
          fullAddress: doctor.address.line_1.concat(
            ', ',
            doctor.address.line_2,
            ', ',
            doctor.address.district
          ),
        }));
        if (queryString) {
          const qs = queryString.toLowerCase();
          filteredDoctors = filteredDoctors.filter((doctor) => {
            return (
              doctor.name.toLowerCase().includes(qs) ||
              doctor.description.toLowerCase().includes(qs) ||
              doctor.fullAddress.toLowerCase().includes(qs)
            );
          });
        }
        setDoctors(filteredDoctors);
      },
    },
    {
      queryKey: [`doctor-${id}`],
      queryFn: () => getDoctorById(id),
      refetchOnWindowFocus: false,
      enabled: Boolean(id),
      onSuccess: (data: IDoctor) => {
        setDoctors([
          {
            ...data,
            fullAddress: data.address.line_1.concat(
              ', ',
              data.address.line_2,
              ', ',
              data.address.district
            ),
          },
        ]);
        setSearchQuery(data.name);
      },
    },
    {
      queryKey: ['bookings'],
      queryFn: getBookings,
      refetchOnWindowFocus: false,
      onSuccess: (data: IBooking[]) => {
        const confirmedBookings = [...data].filter(
          (booking) => booking.status === 'confirmed'
        );
        setBookings(confirmedBookings);
      },
    },
  ]);

  useEffect(() => {
    if (id) {
      refetchDoctor();
    } else {
      refetchDoctors();
      setSearchQuery(queryString);
    }
  }, [id, queryString]);

  const handleOnEnterPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      navigate(`/doctors?q=${searchQuery}`);
    }
  };

  return (
    <>
      <Container sx={{ p: 2, mx: 'auto' }}>
        <TextField
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          onKeyPress={handleOnEnterPress}
          fullWidth
          placeholder="Search Doctor"
          InputProps={{
            endAdornment: (
              <Link to={`/doctors?q=${searchQuery}`}>
                <IconButton color="primary" size="large">
                  <SearchRoundedIcon />
                </IconButton>
              </Link>
            ),
          }}
        />

        <Box
          display={
            isDoctorFetching || isDoctorsFetching || doctors?.length === 0
              ? 'flex'
              : 'block'
          }
          justifyContent="center"
          height={400}
          alignItems="center"
          paddingTop={3}
        >
          {isDoctorFetching || isDoctorsFetching ? (
            <CircularProgress />
          ) : (
            <>
              {doctors.length > 0 ? (
                <>
                  {doctors.map((doctor) => (
                    <DoctorAccordion
                      key={doctor.id}
                      doctor={doctor}
                      isExpand={id === doctor.id}
                      bookings={bookings}
                    />
                  ))}
                </>
              ) : (
                <Typography variant="subtitle1" textAlign="center">
                  No results
                </Typography>
              )}
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default DoctorsPage;
