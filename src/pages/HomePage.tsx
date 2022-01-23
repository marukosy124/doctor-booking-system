import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useQuery } from 'react-query';
import { getDoctors } from '../api';
import { IFormattedDoctor } from '../types/DoctorTypes';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import DoctorCard from '../components/DoctorCard';
import { ChangeEvent, useState, KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { queryClient } from '../config/reactQuery';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<IFormattedDoctor>();

  const { data: doctors, isLoading } = useQuery('doctors', getDoctors, {
    initialData: queryClient.getQueryData('doctors'),
    onError: () => setIsError(true),
  });

  const handleOnEnterPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      navigate(`/doctors?q=${searchQuery}`);
    }
  };

  return (
    <>
      <Container sx={{ p: 2, mx: 'auto' }} maxWidth={false}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" py={5}>
          Find your doctor and make a booking
        </Typography>
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

        <Typography variant="h6" fontWeight="bold" py="2rem">
          Available Doctors
        </Typography>
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
              {doctors && doctors.length > 0 ? (
                <Carousel
                  responsive={responsive}
                  removeArrowOnDeviceType={['mobile']}
                >
                  {doctors?.map((doctor) => (
                    <DoctorCard
                      doctor={doctor}
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                    />
                  ))}
                </Carousel>
              ) : (
                <Typography variant="subtitle1" textAlign="center">
                  No doctors available
                </Typography>
              )}
            </>
          )}
        </Box>
      </Container>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => {
            setSelectedDoctor(undefined);
          }}
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

export default HomePage;
