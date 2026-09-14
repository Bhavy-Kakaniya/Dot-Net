'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import Loader from '@/components/Loader/Loader';
import { SIDEBAR_WIDTH } from '@/utils/constants';

const routePermissions = {
  '/users': ['Admin'],
  '/roles': ['Admin'],
  '/user-roles': ['Admin'],
  '/allocations': ['Admin', 'Faculty'],
};

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, role, isAdmin, isFaculty, isStudent } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole = isAdmin ? 'Admin' : isFaculty ? 'Faculty' : isStudent ? 'Student' : (role || 'Student');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!loading && isAuthenticated) {
      // Check route access rights
      const matchedRoute = Object.keys(routePermissions).find((route) => pathname.startsWith(route));
      if (matchedRoute) {
        const allowedRoles = routePermissions[matchedRoute];
        if (!allowedRoles.includes(currentRole)) {
          router.replace('/dashboard');
        }
      }
    }
  }, [loading, isAuthenticated, pathname, currentRole, router]);

  if (loading) return <Loader fullPage message="Loading dashboard..." />;
  if (!isAuthenticated) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
