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
import { useQuery } from 'react-query';
import { getDoctors } from '../api';
import { IFormattedDoctor } from '../types/DoctorTypes';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import DoctorProfileCard from '../components/DoctorProfileCard';
import BookingModal from '../components/BookingModal';
import { queryClient } from '../config/reactQuery';

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get('q') ?? '';

  const [searchQuery, setSearchQuery] = useState<string>(queryString);
  const [doctors, setDoctors] = useState<IFormattedDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<IFormattedDoctor>();

  const { isFetching, refetch } = useQuery('doctors', getDoctors, {
    refetchOnWindowFocus: false,
    retry: false,
    initialData: () => queryClient.getQueryData('doctors'),
    onSuccess: (data: IFormattedDoctor[]) => {
      let filteredDoctors = [...data];
      if (queryString) {
        const qs = queryString.toLowerCase();
        filteredDoctors = data.filter((doctor) => {
          return (
            doctor.name.toLowerCase().includes(qs) ||
            doctor.description.toLowerCase().includes(qs) ||
            doctor.fullAddress.toLowerCase().includes(qs)
          );
        });
      }
      setDoctors(filteredDoctors);
    },
  });

  useEffect(() => {
    refetch();
    setSearchQuery(queryString);
  }, [queryString]);

  const handleOnEnterPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      navigate(`/doctors?q=${searchQuery}`);
    }
  };

  return (
    <>
      <Container sx={{ p: 2, mx: 'auto' }} maxWidth={false}>
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
          display={isFetching || doctors?.length === 0 ? 'flex' : 'block'}
          justifyContent="center"
          height={400}
          alignItems="center"
        >
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              {doctors.length > 0 ? (
                <>
                  {doctors.map((doctor, index) => (
                    <DoctorProfileCard
                      key={doctor.id}
                      doctor={doctor}
                      onClick={() => setSelectedDoctor(doctor)}
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

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(undefined)}
        />
      )}
    </>
  );
};

export default DoctorsPage;
