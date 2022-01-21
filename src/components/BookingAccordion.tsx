import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Day, IDoctorWithFullAddress } from '../types/DoctorTypes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoctorIcon from '../images/doctor.png';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { addDays, format, getDay } from 'date-fns';
import { IBooking, ISnackbarStatus } from '../types/BookingTypes';
import { useMutation } from 'react-query';
import { createBooking } from '../api';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

interface BookingAccordionProps {
  doctor: IDoctorWithFullAddress;
  isExpand: boolean;
  booking: IBooking;
}

const BookingAccordion: React.FC<BookingAccordionProps> = (props) => {
  const [isExpand, setIsExpand] = useState<boolean>(props.isExpand);

  return (
    <Accordion
      sx={{ mb: '2rem' }}
      expanded={isExpand}
      onChange={(event: React.SyntheticEvent, expanded: boolean) =>
        setIsExpand(expanded)
      }
      TransitionProps={{ mountOnEnter: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <img
          src={DoctorIcon}
          width={100}
          height={100}
          style={{ margin: '0.5rem 1rem 0.5rem 0' }}
        />
        <Grid container flexDirection="column" justifyContent="center">
          <Typography variant="h6" mb={1}>
            {props.doctor.name}
          </Typography>
          <Typography variant="body1" component="div" display="flex">
            <MapsHomeWorkIcon sx={{ paddingRight: 1 }} />
            {props.booking.start}
          </Typography>
          <Typography variant="body1" component="div" display="flex">
            <MapsHomeWorkIcon sx={{ paddingRight: 1 }} />
            {props.doctor.fullAddress}
          </Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: 'grey.100' }}>
        {props.doctor.description && (
          <Typography variant="body1" component="div" display="flex">
            <CommentIcon sx={{ paddingRight: 1 }} />
            {props.doctor.description}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default BookingAccordion;
