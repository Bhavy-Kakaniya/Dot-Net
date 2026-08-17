'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import Loader from '@/components/Loader/Loader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateRequired } from '@/utils/validation';
import { roleService } from '@/services/api';

export default function EditRolePage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    roleName: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    async function loadRole() {
      setLoading(true);
      setApiError(null);
      try {
        const role = await roleService.getById(id);
        setForm({
          roleName: role.roleName || '',
          description: role.description || '',
        });
      } catch (err) {
        console.error('Failed to load role:', err);
        setApiError(err.message || 'Failed to load role details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRole();
    }
  }, [id]);

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
      await roleService.update(id, {
        roleName: form.roleName.trim(),
        description: form.description?.trim() || null,
      });

      showSnackbar('Role updated successfully');
      router.push('/roles');
    } catch (err) {
      console.error('Update role error:', err);
      setApiError(err.message || 'Failed to update role');
      showSnackbar(err.message || 'Failed to update role', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading role details..." />;
  }

  return (
    <Box>
      <PageHeader
        title={`Edit Role #${id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Roles', href: '/roles' },
          { label: form.roleName || `Role #${id}`, href: `/roles` },
          { label: 'Edit', href: `/roles/${id}/edit` },
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
                {submitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
