import React from 'react';
import AppRoutes from './routes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'tr'}>
      <div className="App">
        <AppRoutes />
      </div>
    </LocalizationProvider>
  );
};

export default App;