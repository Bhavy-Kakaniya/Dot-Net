import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function FormContainer({ children, maxWidth = 800 }) {
  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4 }, maxWidth, mx: 'auto' }}>
      <Box component="form" noValidate autoComplete="off">
        {children}
      </Box>
    </Paper>
  );
}
