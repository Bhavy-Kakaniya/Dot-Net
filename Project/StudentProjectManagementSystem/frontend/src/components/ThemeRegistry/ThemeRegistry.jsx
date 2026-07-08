'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from '@/utils/theme';
import { AuthProvider } from '@/hooks/useAuth';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import { DataProvider } from '@/hooks/useData';
import AppSnackbar from '@/components/AppSnackbar/AppSnackbar';

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <DataProvider>
            <SnackbarProvider>
              {children}
              <AppSnackbar />
            </SnackbarProvider>
          </DataProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
