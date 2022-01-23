import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
import { ChangeEvent, useState, KeyboardEvent, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

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

  const [maxSlidesLength, setMaxSlidesLength] = useState(6);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<IFormattedDoctor>();

  const { data: doctors, isLoading } = useQuery('doctors', getDoctors, {
    onSuccess: (data: IFormattedDoctor[]) =>
      setMaxSlidesLength(data.length >= 6 ? 6 : data.length),
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
                  {doctors?.slice(0, maxSlidesLength).map((doctor, index) => (
                    <Fragment key={index}>
                      {index < maxSlidesLength - 1 ? (
                        <DoctorCard
                          doctor={doctor}
                          onClick={() => setSelectedDoctor(doctor)}
                        />
                      ) : (
                        <Card
                          sx={{
                            height: 300,
                            m: '1rem',
                          }}
                        >
                          <CardContent
                            sx={{
                              margin: 'auto',
                            }}
                          >
                            <Typography variant="h6" mb={1}>
                              Cannot find your doctor?
                            </Typography>
                            <Link to="/doctors" style={{ width: '100%' }}>
                              <Button
                                fullWidth
                                sx={{ borderRadius: 10 }}
                                variant="outlined"
                              >
                                See All
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      )}
                    </Fragment>
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
