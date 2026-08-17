'use client';

import { useState, useEffect } from 'react';
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
import Loader from '@/components/Loader/Loader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateRequired } from '@/utils/validation';
import { userRoleService, userService, roleService } from '@/services/api';

export default function AssignRolePage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [form, setForm] = useState({ userId: '', roleId: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      setApiError(null);
      try {
        const [usersData, rolesData] = await Promise.all([
          userService.getAll(),
          roleService.getAll(),
        ]);
        setUsers((usersData || []).filter((u) => !u.isDeleted));
        const seenRole = new Set();
        const uniqueRoles = (rolesData || []).filter((r) => {
          if (seenRole.has(r.roleName)) return false;
          seenRole.add(r.roleName);
          return true;
        });
        setRoles(uniqueRoles);
      } catch (err) {
        console.error('Failed to load users or roles:', err);
        setApiError('Failed to load user and role options.');
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const newErrors = {
      userId: validateRequired(form.userId, 'User'),
      roleId: validateRequired(form.roleId, 'Role'),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await userRoleService.create({
        userId: Number(form.userId),
        roleId: Number(form.roleId),
      });

      showSnackbar('Role assigned successfully');
      router.push('/user-roles');
    } catch (err) {
      console.error('Assign role error:', err);
      setApiError(err.message || 'Failed to assign role');
      showSnackbar(err.message || 'Failed to assign role', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <Loader message="Loading users and roles..." />;
  }

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

      <FormContainer maxWidth="sm">
        {apiError && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select a user and a role to create a new role assignment in the system.
        </Typography>

        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={12}>
            <FormControl fullWidth error={!!errors.userId} required>
              <InputLabel>Select User</InputLabel>
              <Select
                value={form.userId}
                label="Select User"
                onChange={handleChange('userId')}
              >
                {users.length === 0 ? (
                  <MenuItem disabled value="">
                    No users available
                  </MenuItem>
                ) : (
                  users.map((u, i) => (
                    <MenuItem key={i} value={u.userId}>
                      {u.fullName} {u.userCode ? `(${u.userCode})` : ''} - {u.email}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth error={!!errors.roleId} required>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={form.roleId}
                label="Select Role"
                onChange={handleChange('roleId')}
              >
                {roles.length === 0 ? (
                  <MenuItem disabled value="">
                    No roles available
                  </MenuItem>
                ) : (
                  roles.map((r, i) => (
                    <MenuItem key={i} value={r.roleId}>
                      {r.roleName}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/user-roles')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? 'Assigning...' : 'Assign Role'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
