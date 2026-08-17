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
import { projectService } from '@/services/api';

export default function EditProjectPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    projectTitle: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setApiError(null);
      try {
        const project = await projectService.getById(id);
        setForm({
          projectTitle: project.projectTitle || '',
        });
      } catch (err) {
        console.error('Failed to load project:', err);
        setApiError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProject();
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
      projectTitle: validateRequired(form.projectTitle, 'Project Title'),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await projectService.update(id, {
        projectTitle: form.projectTitle.trim(),
      });
      showSnackbar('Project updated successfully');
      router.push('/projects');
    } catch (err) {
      console.error('Update project error:', err);
      setApiError(err.message || 'Failed to update project');
      showSnackbar(err.message || 'Failed to update project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading project details..." />;
  }

  return (
    <Box>
      <PageHeader
        title={`Edit Project #${id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: form.projectTitle || `Project #${id}`, href: `/projects/${id}` },
          { label: 'Edit', href: `/projects/${id}/edit` },
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
              label="Project Title"
              value={form.projectTitle}
              onChange={handleChange('projectTitle')}
              error={!!errors.projectTitle}
              helperText={errors.projectTitle}
              required
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/projects')}
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
