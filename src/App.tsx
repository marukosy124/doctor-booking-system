import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingsPage from './pages/BookingsPage';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';
import { QueryClientProvider } from 'react-query';
import { customQueryClient } from './config/reactQuery';

const App = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <QueryClientProvider client={customQueryClient}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
