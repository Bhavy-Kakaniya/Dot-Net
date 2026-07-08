'use client';

import { useRouter, useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatusChip from '@/components/StatusChip/StatusChip';
import Loader from '@/components/Loader/Loader';
import EmptyState from '@/components/EmptyState/EmptyState';
import { useData } from '@/hooks/useData';
import { getInitials, formatDate } from '@/utils/formatters';

export default function ViewUserPage() {
  const router = useRouter();
  const params = useParams();
  const { getUserById, userRoles, getRoleById } = useData();
  const userId = parseInt(params.id, 10);
  const user = getUserById(userId);

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="The user you are looking for does not exist."
        actionLabel="Back to Users"
        onAction={() => router.push('/users')}
      />
    );
  }

  const assignedRoles = userRoles
    .filter((ur) => ur.userId === userId)
    .map((ur) => getRoleById(ur.roleId))
    .filter(Boolean);

  const details = [
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'Type', value: user.type },
    { label: 'Department', value: user.department },
    { label: 'Status', value: <StatusChip status={user.status} /> },
    { label: 'Enrolled Date', value: formatDate(user.enrolledDate) },
  ];

  return (
    <Box>
      <PageHeader
        title={user.name}
        subtitle="User details and role assignments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/users' },
          { label: user.name, href: `/users/${userId}` },
        ]}
        actionLabel="Edit User"
        actionHref={`/users/${userId}/edit`}
        actionIcon={EditIcon}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 28 }}>
              {getInitials(user.name)}
            </Avatar>
            <Typography variant="h6" fontWeight={600}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>{user.email}</Typography>
            <StatusChip status={user.status} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>User Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {details.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>Assigned Roles</Typography>
            {assignedRoles.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {assignedRoles.map((role) => (
                  <StatusChip key={role.id} status={role.name} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No roles assigned</Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => router.push('/users')}>Back to Users</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
