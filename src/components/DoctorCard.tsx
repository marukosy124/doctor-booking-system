import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { IDoctor } from '../types/DoctorTypes';
import DoctorIcon from '../images/doctor.png';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import { Link } from 'react-router-dom';

type PropsType = IDoctor;

const DoctorCard: React.FC<PropsType> = (props) => {
  return (
    <Card
      sx={{
        maxWidth: 400,
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
          src={DoctorIcon}
          width={100}
          height={100}
          style={{ margin: '1rem' }}
        />
        <Typography variant="h6" mb={1}>
          {props.name}
        </Typography>
        <Typography
          variant="body1"
          alignItems="center"
          component="div"
          display="flex"
        >
          <PinDropRoundedIcon sx={{ paddingRight: 1 }} />
          {props.address.district}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: '1rem' }}>
        <Link to={`/doctors?id=${props.id}`} style={{ width: '100%' }}>
          <Button fullWidth sx={{ borderRadius: 10 }} variant="contained">
            Book Now
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
