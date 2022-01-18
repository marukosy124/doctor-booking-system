import {
  AppBar,
  Box,
  Button,
  ButtonProps,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  SwipeableDrawer,
  Toolbar,
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import { Link } from 'react-router-dom';

const menuItems = [
  { title: 'Home', icon: <HomeRoundedIcon />, route: '/' },
  { title: 'Doctors', icon: <MedicationRoundedIcon />, route: '/doctors' },
  {
    title: 'Bookings',
    icon: <EventAvailableRoundedIcon />,
    route: '/bookings',
  },
];

// custom style for menu button
const TextButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.common.black,
  backgroundColor: 'transparent',
  textTransform: 'capitalize',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
  marginRight: 2,
  fontSize: 'subtitle1.fontSize',
}));

const Navbar: React.FC = () => {
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
        {/* menu button in mobile */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        {/* menu drawer in mobile */}
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
                  <ListItem button>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
        </SwipeableDrawer>
        {/* menu buttons in desktop */}
        {menuItems.map((item, index) => (
          <Link to={item.route} key={index}>
            <TextButton
              sx={{
                display: { xs: 'none', md: 'block' },
                fontWeight: item.title === 'Home' ? 'bold' : 'normal',
              }}
            >
              {item.title}
            </TextButton>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
