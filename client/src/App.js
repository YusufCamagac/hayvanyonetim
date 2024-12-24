import React from 'react';
import AppRoutes from './routes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/tr';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'tr'}>
      <div className="flex flex-col min-h-screen bg-background">
        <AppRoutes />
      </div>
    </LocalizationProvider>
  );
};

export default App;