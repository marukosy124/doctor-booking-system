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
        <Typography variant="subtitle1">{props.name}</Typography>
        <Typography
          variant="body1"
          alignItems="center"
          component="div"
          display="flex"
        >
          <PinDropRoundedIcon />
          {props.address.district}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: '1rem' }}>
        <Button fullWidth sx={{ borderRadius: 10 }} variant="contained">
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
