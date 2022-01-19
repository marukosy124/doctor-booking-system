import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useQuery } from 'react-query';
import { getDoctors } from '../api';
import { IDoctor } from '../types/DoctorTypes';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import DoctorCard from '../components/DoctorCard';

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
  const { data: doctors } = useQuery('doctors', getDoctors, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Container sx={{ p: 2, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" py={5}>
        Find your doctor and make a booking
      </Typography>
      <TextField
        fullWidth
        placeholder="Search Doctor"
        InputProps={{
          endAdornment: (
            <IconButton color="primary" size="large">
              <SearchRoundedIcon />
            </IconButton>
          ),
        }}
      />

      <Typography variant="h6" fontWeight="bold" py="2rem">
        Available Doctors
      </Typography>
      {doctors && doctors.length > 0 ? (
        <Carousel responsive={responsive} removeArrowOnDeviceType={['mobile']}>
          {doctors?.map((doctor: IDoctor) => (
            <DoctorCard {...doctor} />
          ))}
        </Carousel>
      ) : (
        <Box justifyContent="center" height={300} alignItems="center">
          <Typography variant="subtitle1" textAlign="center">
            No doctors available
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
