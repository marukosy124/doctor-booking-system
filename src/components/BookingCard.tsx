import {
  Typography,
  CardContent,
  Card,
  CardActions,
  Button,
  CardHeader,
} from '@mui/material';
import { IFormattedDoctor } from '../types/DoctorTypes';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import { LoadingButton } from '@mui/lab';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { IFormattedBooking } from '../types/BookingTypes';

interface BookingCardProps {
  doctor: IFormattedDoctor;
  booking: IFormattedBooking;
  isLoading: boolean;
  onCancel: () => void;
}

const BookingCard: React.FC<BookingCardProps> = (props) => {
  return (
    <Card>
      <CardHeader
        sx={{
          backgroundColor:
            props.booking.status === 'confirmed'
              ? '#d5ebd6'
              : props.booking.status === 'cancelled'
              ? '#ffdede'
              : 'grey.300',
        }}
        avatar={
          props.booking.status === 'cancelled' ? (
            <HighlightOffRoundedIcon color="error" fontSize="large" />
          ) : (
            <CheckCircleOutlineRoundedIcon
              color={
                props.booking.status === 'confirmed' ? 'success' : 'inherit'
              }
              fontSize="large"
            />
          )
        }
        title={props.doctor.name}
        subheader={`Your booking name: ${props.booking.name}`}
      />
      <CardContent>
        <Typography variant="body1" component="div" display="flex" pb={1}>
          <AccessTimeFilledOutlinedIcon sx={{ paddingRight: 1 }} />
          {props.booking.date} {props.booking.start}-{props.booking.end}
        </Typography>
        <Typography variant="body1" component="div" display="flex" pb={1}>
          <MapsHomeWorkIcon sx={{ paddingRight: 1 }} />
          {props.doctor.fullAddress}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {props.booking.status === 'confirmed' ? (
          <LoadingButton
            loading={props.isLoading}
            size="small"
            color="error"
            variant="outlined"
            sx={{ m: 1 }}
            onClick={props.onCancel}
          >
            Cancel Booking
          </LoadingButton>
        ) : (
          <Button size="small" variant="outlined" sx={{ m: 1 }} disabled>
            {props.booking.status}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BookingCard;
