'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';
import { APP_NAME } from '@/utils/constants';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        background: 'linear-gradient(135deg, #E3F2FD 0%, #F4F6F8 50%, #E8EAF6 100%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {APP_NAME}
          </Typography>
          {title && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle || title}
            </Typography>
          )}
        </Box>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'divider' }}>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
