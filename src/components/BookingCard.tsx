import {
  Typography,
  CardContent,
  Card,
  CardActions,
  Button,
  CardHeader,
} from '@mui/material';
import { IDoctorWithFullAddress } from '../types/DoctorTypes';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import CommentIcon from '@mui/icons-material/Comment';
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import { LoadingButton } from '@mui/lab';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { IFormattedBooking } from '../types/BookingTypes';

interface BookingCardProps {
  doctor: IDoctorWithFullAddress;
  booking: IFormattedBooking;
  isLoading: boolean;
  onCancel: () => void;
}

const BookingCard: React.FC<BookingCardProps> = (props) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        sx={{
          backgroundColor:
            props.booking.status === 'confirmed' ? '#d5ebd6' : '#ffdede',
        }}
        avatar={
          props.booking.status === 'confirmed' ? (
            <CheckCircleOutlineOutlinedIcon color="success" fontSize="large" />
          ) : (
            <CancelOutlinedIcon color="error" fontSize="large" />
          )
        }
        title={props.doctor.name}
        subheader={`Registered name: ${props.booking.name}`}
      />
      <CardContent>
        <Typography variant="body1" component="div" display="flex" pb={1}>
          <AccessTimeFilledOutlinedIcon sx={{ paddingRight: 1 }} />
          {props.booking.date} {props.booking.start} ~ {props.booking.end}
        </Typography>
        <Typography variant="body1" component="div" display="flex" pb={1}>
          <MapsHomeWorkIcon sx={{ paddingRight: 1 }} />
          {props.doctor.fullAddress}
        </Typography>
        {props.doctor.description && (
          <Typography variant="body1" component="div" display="flex" pb={1}>
            <CommentIcon sx={{ paddingRight: 1 }} />
            {props.doctor.description}
          </Typography>
        )}
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
          <Button
            size="small"
            color="error"
            variant="outlined"
            sx={{ m: 1 }}
            disabled
          >
            Cancelled
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BookingCard;
