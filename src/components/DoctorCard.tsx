import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { IFormattedDoctor } from '../types/DoctorTypes';
import DoctorIcon from '../images/doctor.png';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import { memo } from 'react';

interface DoctorCardProps {
  doctor: IFormattedDoctor;
  onClick: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = (props) => {
  return (
    <Card
      sx={{
        height: 300,
        m: '1rem',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          alt={props.doctor.name}
          src={DoctorIcon}
          width={100}
          height={100}
          style={{ margin: '1rem' }}
        />
        <Typography variant="h6" mb={1}>
          {props.doctor.name}
        </Typography>
        <Typography
          variant="body1"
          alignItems="center"
          component="div"
          display="flex"
        >
          <PinDropRoundedIcon sx={{ paddingRight: 1 }} />
          {props.doctor.address.district}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: '1rem' }}>
        <Button
          fullWidth
          sx={{ borderRadius: 10 }}
          variant="contained"
          onClick={props.onClick}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default memo(DoctorCard);
