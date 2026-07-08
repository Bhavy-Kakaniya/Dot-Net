'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import Loader from '@/components/Loader/Loader';
import { useData } from '@/hooks/useData';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ROLE_PERMISSIONS } from '@/utils/constants';
import { validateRequired } from '@/utils/validation';

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const { getRoleById, updateRole } = useData();
  const { showSnackbar } = useSnackbar();
  const roleId = parseInt(params.id, 10);
  const existing = getRoleById(roleId);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existing) setForm({ ...existing });
  }, [existing]);

  if (!form) return <Loader message="Loading role..." />;

  const togglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateRequired(form.name, 'Role name'),
      description: validateRequired(form.description, 'Description'),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    updateRole(roleId, form);
    showSnackbar('Role updated successfully');
    router.push('/roles');
  };

  return (
    <Box>
      <PageHeader
        title="Edit Role"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Roles', href: '/roles' },
          { label: form.name, href: `/roles/${roleId}/edit` },
        ]}
      />

      <FormContainer>
        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={12}>
            <TextField fullWidth label="Role Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={!!errors.name} helperText={errors.name} required />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={!!errors.description} helperText={errors.description} required />
          </Grid>
          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>Permissions</Typography>
            <FormGroup>
              <Grid container>
                {ROLE_PERMISSIONS.map((perm) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={perm}>
                    <FormControlLabel
                      control={<Checkbox checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)} />}
                      label={perm}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => router.push('/roles')}>Cancel</Button>
              <Button type="submit" variant="contained">Save Changes</Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
