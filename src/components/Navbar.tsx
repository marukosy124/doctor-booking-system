import {
  AppBar,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
  Theme,
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const menuItems = [
  { title: 'Home', icon: <HomeRoundedIcon />, route: '/' },
  { title: 'Doctors', icon: <MedicationRoundedIcon />, route: '/doctors' },
  {
    title: 'Bookings',
    icon: <EventAvailableRoundedIcon />,
    route: '/bookings',
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.h5.fontSize,
    backgroundImage: 'linear-gradient(to right, #48c6ef 0%, #6f86d6 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  textButton: {
    color: theme.palette.common.black,
    backgroundColor: 'transparent',
    '&:hover': {
      color: theme.palette.primary.light,
      backgroundColor: 'transparent',
    },
    fontSize: theme.typography.subtitle1.fontSize,
  },
}));

const Navbar: React.FC = (props) => {
  const classes = useStyles(props);
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  return (
    <AppBar
      position="static"
      sx={{ background: 'transparent', boxShadow: 'none' }}
    >
      <Toolbar>
        {/* navbar in mobile */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}
          size="large"
          edge="start"
          color="default"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Link to="/">
          <Typography
            variant="h5"
            fontWeight="bold"
            mr={2}
            className={classes.title}
          >
            FindDoctor
          </Typography>
        </Link>
        <SwipeableDrawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {menuItems.map((item, index) => (
                <Link to={item.route} key={index}>
                  <ListItemButton selected={location.pathname === item.route}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Box>
        </SwipeableDrawer>

        {/* navbar in desktop */}
        {menuItems.slice(1).map((item, index) => (
          <Link to={item.route} key={index}>
            <Button
              className={classes.textButton}
              disableRipple
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              {item.title}
            </Button>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
