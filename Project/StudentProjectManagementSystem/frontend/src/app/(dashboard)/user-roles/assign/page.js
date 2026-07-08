'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import { useData } from '@/hooks/useData';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useAuth } from '@/hooks/useAuth';

export default function AssignRolePage() {
  const router = useRouter();
  const { users, roles, userRoles, assignRole } = useData();
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [form, setForm] = useState({ userId: '', roleId: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.userId || !form.roleId) {
      setError('Please select both a user and a role');
      return;
    }

    const exists = userRoles.some(
      (ur) => ur.userId === parseInt(form.userId, 10) && ur.roleId === parseInt(form.roleId, 10)
    );
    if (exists) {
      setError('This role is already assigned to the selected user');
      return;
    }

    assignRole({
      userId: parseInt(form.userId, 10),
      roleId: parseInt(form.roleId, 10),
      assignedBy: user?.name || 'Admin',
    });
    showSnackbar('Role assigned successfully');
    router.push('/user-roles');
  };

  return (
    <Box>
      <PageHeader
        title="Assign Role"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'User Roles', href: '/user-roles' },
          { label: 'Assign Role', href: '/user-roles/assign' },
        ]}
      />

      <FormContainer maxWidth={600}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select a user and role to create a new assignment.
        </Typography>
        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={12}>
            <FormControl fullWidth required>
              <InputLabel>User</InputLabel>
              <Select
                value={form.userId}
                label="User"
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={form.roleId}
                label="Role"
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              >
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => router.push('/user-roles')}>Cancel</Button>
              <Button type="submit" variant="contained">Assign Role</Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
