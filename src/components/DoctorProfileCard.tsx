import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useMediaQuery,
} from '@mui/material';
import { IFormattedDoctor } from '../types/DoctorTypes';
import DoctorIcon from '../images/doctor.png';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import CommentIcon from '@mui/icons-material/Comment';
import { customTheme } from '../theme/theme';
import { memo } from 'react';

interface DoctorProfileCardProps {
  doctor: IFormattedDoctor;
  onClick: () => void;
}

const DoctorProfileCard: React.FC<DoctorProfileCardProps> = (props) => {
  const fullWidth = useMediaQuery(customTheme.breakpoints.down('md'));

  return (
    <Card sx={{ my: 4 }}>
      <CardContent>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: 'column', md: 'row' }}
        >
          <Grid item>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <img
                  alt={props.doctor.name}
                  src={DoctorIcon}
                  width={100}
                  height={100}
                  style={{ margin: '0.5rem 1rem 0.5rem 0' }}
                />
              </Grid>
              <Grid item>
                <Grid container flexDirection="column" justifyContent="center">
                  <Typography variant="h6" mb={1}>
                    {props.doctor.name}
                  </Typography>
                  <Typography variant="body1" component="div" display="flex">
                    <MapsHomeWorkIcon sx={{ paddingRight: 1 }} />
                    {props.doctor.fullAddress}
                  </Typography>
                  <Typography variant="body1" component="div" display="flex">
                    <CommentIcon sx={{ paddingRight: 1 }} />
                    {props.doctor.description
                      ? props.doctor.description
                      : 'No Description'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            m={{ xs: 'auto', md: 'auto 0' }}
            width={fullWidth ? '100%' : 'auto'}
          >
            <Button
              fullWidth={fullWidth}
              size="large"
              sx={{ mt: 2, borderRadius: 10 }}
              variant="contained"
              onClick={props.onClick}
            >
              Check Availability
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default memo(DoctorProfileCard);
