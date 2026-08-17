'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import Loader from '@/components/Loader/Loader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateEmail, validateRequired } from '@/utils/validation';
import { userService, userTypeService } from '@/services/api';

export default function AddUserPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [allUserTypes, setAllUserTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    userCode: '',
    email: '',
    password: '',
    mobileNumber: '',
    userTypeId: '',
    profilePicturePath: '',
  });

  const [errors, setErrors] = useState({});

  // Deduplicate user types by name so duplicates from seeding don't appear
  const userTypes = useMemo(() => {
    const seen = new Set();
    return allUserTypes.filter((ut) => {
      if (seen.has(ut.userTypeName)) return false;
      seen.add(ut.userTypeName);
      return true;
    });
  }, [allUserTypes]);

  useEffect(() => {
    async function loadUserTypes() {
      setLoadingTypes(true);
      try {
        const types = await userTypeService.getAll();
        setAllUserTypes(types || []);
        if (types && types.length > 0) {
          // Deduplicate on the spot for auto-select
          const seen = new Set();
          const unique = types.filter((ut) => {
            if (seen.has(ut.userTypeName)) return false;
            seen.add(ut.userTypeName);
            return true;
          });
          if (unique.length > 0) {
            setForm((prev) => ({ ...prev, userTypeId: unique[0].userTypeId }));
          }
        }
      } catch (err) {
        console.error('Failed to load user types:', err);
        setApiError('Failed to load user types. Make sure backend is running.');
      } finally {
        setLoadingTypes(false);
      }
    }
    loadUserTypes();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {
      fullName: validateRequired(form.fullName, 'Full Name'),
      userCode: validateRequired(form.userCode, 'User Code'),
      email: validateEmail(form.email),
      password: validateRequired(form.password, 'Password'),
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
      await userService.create({
        fullName: form.fullName.trim(),
        userCode: form.userCode.trim(),
        email: form.email.trim(),
        password: form.password,
        mobileNumber: (form.mobileNumber?.trim() || '555-0100').substring(0, 15),
        userTypeId: Number(form.userTypeId),
        profilePicturePath: form.profilePicturePath?.trim() || '/avatars/default.png',
      });

      showSnackbar('User created successfully');
      router.push('/users');
    } catch (err) {
      console.error('Create user error:', err);
      setApiError(err.message || 'Failed to create user');
      showSnackbar(err.message || 'Failed to create user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTypes) {
    return <Loader message="Loading user types..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Add User"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/users' },
          { label: 'Add User', href: '/users/add' },
        ]}
      />

      <FormContainer maxWidth="md">
        {apiError && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit} noValidate>
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
                placeholder="e.g. STU-101 / FAC-201"
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
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.userTypeId} required>
                <InputLabel id="user-type-label">User Type</InputLabel>
                <Select
                  labelId="user-type-label"
                  value={form.userTypeId === '' ? '' : Number(form.userTypeId)}
                  label="User Type"
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, userTypeId: e.target.value }));
                    setErrors((prev) => ({ ...prev, userTypeId: '' }));
                  }}
                >
                  {userTypes.map((t, i) => (
                    <MenuItem key={i} value={t.userTypeId}>
                      {t.userTypeName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.userTypeId && (
                  <FormHelperText>{errors.userTypeId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mobile Number"
                placeholder="+1234567890"
                value={form.mobileNumber}
                onChange={handleChange('mobileNumber')}
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
                  {submitting ? 'Creating User...' : 'Create User'}
                </Button>
              </Box>
            </Grid>
          </Grid>
      </FormContainer>
    </Box>
  );
}
