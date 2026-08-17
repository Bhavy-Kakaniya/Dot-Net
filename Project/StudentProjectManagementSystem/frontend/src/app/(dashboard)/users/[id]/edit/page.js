'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import Loader from '@/components/Loader/Loader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateEmail, validateRequired } from '@/utils/validation';
import { userService, userTypeService } from '@/services/api';

export default function EditUserPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    userCode: '',
    email: '',
    mobileNumber: '',
    userTypeId: '',
    isActive: true,
    profilePicturePath: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setApiError(null);
      try {
        const [userData, types] = await Promise.all([
          userService.getById(id),
          userTypeService.getAll().catch(() => []),
        ]);

        const seen = new Set();
        const unique = (types || []).filter((ut) => {
          if (seen.has(ut.userTypeName)) return false;
          seen.add(ut.userTypeName);
          return true;
        });
        setUserTypes(unique);
        setForm({
          fullName: userData.fullName || '',
          userCode: userData.userCode || '',
          email: userData.email || '',
          mobileNumber: userData.mobileNumber || '',
          userTypeId: userData.userTypeId || '',
          isActive: userData.isActive ?? true,
          profilePicturePath: userData.profilePicturePath || '',
        });
      } catch (err) {
        console.error('Failed to load user:', err);
        setApiError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {
      fullName: validateRequired(form.fullName, 'Full Name'),
      userCode: validateRequired(form.userCode, 'User Code'),
      email: validateEmail(form.email),
      userTypeId: validateRequired(form.userTypeId, 'User Type'),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await userService.update(id, {
        fullName: form.fullName.trim(),
        userCode: form.userCode.trim(),
        email: form.email.trim(),
        mobileNumber: (form.mobileNumber?.trim() || '555-0100').substring(0, 15),
        userTypeId: Number(form.userTypeId),
        isActive: Boolean(form.isActive),
        profilePicturePath: form.profilePicturePath?.trim() || '/avatars/default.png',
      });

      showSnackbar('User updated successfully');
      router.push('/users');
    } catch (err) {
      console.error('Update user error:', err);
      setApiError(err.message || 'Failed to update user');
      showSnackbar(err.message || 'Failed to update user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading user details..." />;
  }

  return (
    <Box>
      <PageHeader
        title={`Edit User #${id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/users' },
          { label: form.fullName || `User #${id}`, href: `/users/${id}` },
          { label: 'Edit', href: `/users/${id}/edit` },
        ]}
      />

      <FormContainer maxWidth="md">
        {apiError && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={form.fullName}
              onChange={handleChange('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="User Code (Roll No / Employee ID)"
              value={form.userCode}
              onChange={handleChange('userCode')}
              error={!!errors.userCode}
              helperText={errors.userCode}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.userTypeId} required>
              <InputLabel>User Type</InputLabel>
              <Select
                value={form.userTypeId}
                label="User Type"
                onChange={handleChange('userTypeId')}
              >
                {userTypes.map((t, i) => (
                  <MenuItem key={i} value={t.userTypeId}>
                    {t.userTypeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={form.mobileNumber}
              onChange={handleChange('mobileNumber')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
              }
              label={form.isActive ? 'Active User' : 'Inactive User'}
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/users')}
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
