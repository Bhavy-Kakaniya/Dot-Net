'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateRequired } from '@/utils/validation';
import { roleService } from '@/services/api';

export default function AddRolePage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    roleName: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const newErrors = {
      roleName: validateRequired(form.roleName, 'Role Name'),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await roleService.create({
        roleName: form.roleName.trim(),
        description: form.description?.trim() || null,
      });

      showSnackbar('Role created successfully');
      router.push('/roles');
    } catch (err) {
      console.error('Create role error:', err);
      setApiError(err.message || 'Failed to create role');
      showSnackbar(err.message || 'Failed to create role', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Add Role"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Roles', href: '/roles' },
          { label: 'Add Role', href: '/roles/add' },
        ]}
      />

      <FormContainer maxWidth="sm">
        {apiError && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Role Name"
              placeholder="e.g. Project Reviewer"
              value={form.roleName}
              onChange={handleChange('roleName')}
              error={!!errors.roleName}
              helperText={errors.roleName}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Describe the duties and scope of this role..."
              value={form.description}
              onChange={handleChange('description')}
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/roles')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? 'Creating Role...' : 'Create Role'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
