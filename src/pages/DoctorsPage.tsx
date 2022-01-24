import {
  Container,
  IconButton,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState, ChangeEvent, useEffect, KeyboardEvent } from 'react';
import { useQuery } from 'react-query';
import { getDoctors } from '../api';
import { IFormattedDoctor } from '../types/DoctorTypes';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import DoctorProfileCard from '../components/DoctorProfileCard';
import BookingModal from '../components/BookingModal';

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get('q') ?? '';

  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(queryString);
  const [doctors, setDoctors] = useState<IFormattedDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<IFormattedDoctor>();

  // get all doctors
  const { data, isLoading } = useQuery('doctors', getDoctors, {
    onError: () => setIsError(true),
  });

  // set raw (/cached) doctor data into doctors state for filtering
  useEffect(() => {
    if (data) {
      setDoctors(data);
    }
  }, [data]);

  // re-filter when query string changes
  useEffect(() => {
    async function getFilteredDoctors() {
      const filteredDoctors = await new Promise<IFormattedDoctor[]>(
        (resolve) => {
          if (data) {
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
            resolve(filteredDoctors);
          } else {
            resolve([]);
          }
        }
      );
      setDoctors(filteredDoctors);
    }
    getFilteredDoctors();
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
          display={isLoading || doctors?.length === 0 ? 'flex' : 'block'}
          justifyContent="center"
          height={400}
          alignItems="center"
        >
          {isLoading ? (
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

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isError}
        onClose={() => setIsError(false)}
        autoHideDuration={3000}
      >
        <Alert severity="error">
          Something went wrong. Unable to fetch doctors.
        </Alert>
      </Snackbar>
    </>
  );
};

export default DoctorsPage;
