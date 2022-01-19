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
import { getDoctorById, getDoctors } from '../api';
import { IDoctor } from '../types/DoctorTypes';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const queryString = searchParams.get('q') ?? '';

  const [searchQuery, setSearchQuery] = useState<string>(queryString);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);

  const [
    { isFetching: isDoctorsFetching, refetch: refetchDoctors },
    { isFetching: isDoctorFetching, refetch: refetchDoctor },
  ] = useQueries([
    {
      queryKey: ['doctors'],
      queryFn: getDoctors,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !Boolean(id),
      onSuccess: (data: IDoctor[]) => {
        let filteredDoctors = [...data];
        if (queryString) {
          filteredDoctors = filteredDoctors.filter(
            (doctor) =>
              doctor.name.toLowerCase().includes(queryString.toLowerCase()) ||
              doctor.description
                .toLowerCase()
                .includes(queryString.toLowerCase())
          );
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
        setDoctors([data]);
        setSearchQuery(data.name);
      },
    },
  ]);

  useEffect(() => {
    if (id) {
      refetchDoctor();
    } else {
      refetchDoctors();
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
        >
          {isDoctorFetching || isDoctorsFetching ? (
            <CircularProgress />
          ) : (
            <>
              {doctors.length > 0 ? (
                <>
                  {doctors.map((doctor) => (
                    <DoctorCard {...doctor} />
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
