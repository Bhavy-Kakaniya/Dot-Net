'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatusChip from '@/components/StatusChip/StatusChip';
import Loader from '@/components/Loader/Loader';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import { getInitials } from '@/utils/formatters';
import { userService, userTypeService, userRoleService, roleService } from '@/services/api';

export default function ViewUserPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [userTypeName, setUserTypeName] = useState('');
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      setError(null);
      try {
        const [userData, userTypesData, userRolesData, rolesData] = await Promise.all([
          userService.getById(userId),
          userTypeService.getAll().catch(() => []),
          userRoleService.getAll().catch(() => []),
          roleService.getAll().catch(() => []),
        ]);

        setUser(userData);

        const type = (userTypesData || []).find((t) => t.userTypeId === userData.userTypeId);
        setUserTypeName(type?.userTypeName || `Type #${userData.userTypeId}`);

        const rMap = {};
        (rolesData || []).forEach((r) => {
          rMap[r.roleId] = r.roleName;
        });

        const userRolesList = (userRolesData || [])
          .filter((ur) => Number(ur.userId) === Number(userId))
          .map((ur) => rMap[ur.roleId] || `Role #${ur.roleId}`);

        setAssignedRoles(userRolesList);
      } catch (err) {
        console.error('Failed to load user:', err);
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const handleDelete = async () => {
    try {
      await userService.delete(userId);
      showSnackbar('User deleted successfully');
      router.push('/users');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading user details..." />;
  }

  if (error || !user) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'User not found'}
        </Alert>
        <Button variant="outlined" onClick={() => router.push('/users')}>
          Back to Users
        </Button>
      </Box>
    );
  }

  const details = [
    { label: 'Full Name', value: user.fullName },
    { label: 'User Code', value: user.userCode },
    { label: 'Email', value: user.email },
    { label: 'Mobile Number', value: user.mobileNumber || '—' },
    { label: 'User Type', value: userTypeName },
    { label: 'Status', value: <StatusChip status={user.isActive ? 'Active' : 'Inactive'} /> },
  ];

  return (
    <Box>
      <PageHeader
        title={user.fullName}
        subtitle="User details and role assignments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/users' },
          { label: user.fullName, href: `/users/${userId}` },
        ]}
        actionLabel="Edit User"
        actionHref={`/users/${userId}/edit`}
        actionIcon={EditIcon}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user.profilePicturePath || ''}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 28 }}
            >
              {getInitials(user.fullName)}
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              {user.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              <StatusChip status={user.isActive ? 'Active' : 'Inactive'} />
              <Chip label={userTypeName} size="small" variant="outlined" />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete User
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              User Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {details.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {typeof item.value === 'string' ? (
                      <Typography variant="body1">{item.value}</Typography>
                    ) : (
                      item.value
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Assigned Roles
            </Typography>
            {assignedRoles.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {assignedRoles.map((r, idx) => (
                  <Chip key={idx} label={r} color="primary" variant="outlined" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No roles assigned to this user yet.
              </Typography>
            )}

            <Box sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={() => router.push('/users')}>
                Back to Users
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${user.fullName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
