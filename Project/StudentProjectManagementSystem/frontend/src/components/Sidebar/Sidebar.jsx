'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { usePathname, useRouter } from 'next/navigation';
import { SIDEBAR_WIDTH, APP_NAME } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

const allMenuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon, allowedRoles: ['Admin', 'Faculty', 'Student'] },
  { title: 'Users', path: '/users', icon: PeopleIcon, allowedRoles: ['Admin'] },
  { title: 'Roles', path: '/roles', icon: SecurityIcon, allowedRoles: ['Admin'] },
  { title: 'User Roles', path: '/user-roles', icon: AssignmentIndIcon, allowedRoles: ['Admin'] },
  { title: 'Projects', path: '/projects', icon: FolderIcon, allowedRoles: ['Admin', 'Faculty', 'Student'] },
  { title: 'Allocations', path: '/allocations', icon: AssignmentTurnedInIcon, allowedRoles: ['Admin', 'Faculty'] },
  { title: 'Tasks', path: '/tasks', icon: TaskIcon, allowedRoles: ['Admin', 'Faculty', 'Student'] },
  { title: 'Profile', path: '/profile', icon: PersonIcon, allowedRoles: ['Admin', 'Faculty', 'Student'] },
];

function SidebarContent({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAdmin, isFaculty, isStudent } = useAuth();

  const currentRole = isAdmin ? 'Admin' : isFaculty ? 'Faculty' : isStudent ? 'Student' : (role || 'Student');

  const visibleMenuItems = allMenuItems.filter((item) => item.allowedRoles.includes(currentRole));

  const handleClick = (path) => {
    router.push(path);
    onNavigate?.();
  };

  const isActive = (path) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const getRoleBadgeColor = () => {
    if (isAdmin) return 'error';
    if (isFaculty) return 'primary';
    return 'success';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SchoolIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">SPMS</Typography>
          <Typography variant="caption" color="text.secondary" display="block">{APP_NAME}</Typography>
        </Box>
        <Chip
          label={currentRole}
          color={getRoleBadgeColor()}
          size="small"
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
        />
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleClick(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? 'inherit' : 'text.secondary' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
