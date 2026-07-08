'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/formatters';
import GlobalSearch from '@/components/GlobalSearch/GlobalSearch';
import { SIDEBAR_WIDTH } from '@/utils/constants';

const notifications = [
  { id: 1, text: 'New task assigned to you', time: '5 min ago' },
  { id: 2, text: 'Project deadline approaching', time: '1 hour ago' },
  { id: 3, text: 'User registration pending approval', time: '2 hours ago' },
];

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 64, sm: 70 } }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1, maxWidth: 480, display: { xs: 'none', sm: 'block' } }}>
          <GlobalSearch />
        </Box>

        <Box sx={{ flex: 1, display: { xs: 'block', sm: 'none' } }} />

        <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
            {getInitials(user?.name)}
          </Avatar>
        </IconButton>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ display: { xs: 'none', lg: 'flex' } }}
        >
          Logout
        </Button>
      </Toolbar>

      <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.map((n) => (
          <MenuItem key={n.id} onClick={() => setNotifAnchor(null)} sx={{ py: 1.5, maxWidth: 320 }}>
            <Box>
              <Typography variant="body2">{n.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {n.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setProfileAnchor(null);
            router.push('/profile');
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => setProfileAnchor(null)}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setProfileAnchor(null);
            handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
