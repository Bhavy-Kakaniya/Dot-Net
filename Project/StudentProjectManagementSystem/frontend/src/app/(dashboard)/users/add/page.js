'use client';

import { useState } from 'react';
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
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import { useData } from '@/hooks/useData';
import { useSnackbar } from '@/hooks/useSnackbar';
import { USER_TYPES, USER_STATUSES } from '@/utils/constants';
import { validateEmail, validateRequired } from '@/utils/validation';

export default function AddUserPage() {
  const router = useRouter();
  const { addUser } = useData();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Student',
    department: '',
    status: 'Active',
    enrolledDate: dayjs(),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {
      name: validateRequired(form.name, 'Name'),
      email: validateEmail(form.email),
      department: validateRequired(form.department, 'Department'),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addUser({
      ...form,
      enrolledDate: form.enrolledDate.format('YYYY-MM-DD'),
      avatar: '',
    });
    showSnackbar('User created successfully');
    router.push('/users');
  };

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

      <FormContainer>
        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Full Name" value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Email" type="email" value={form.email} onChange={handleChange('email')} error={!!errors.email} helperText={errors.email} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Department" value={form.department} onChange={handleChange('department')} error={!!errors.department} helperText={errors.department} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={handleChange('type')}>
                {USER_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleChange('status')}>
                {USER_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Enrolled Date"
              value={form.enrolledDate}
              onChange={(val) => setForm((prev) => ({ ...prev, enrolledDate: val }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={12}>
            <FormControl>
              <FormLabel>User Category</FormLabel>
              <RadioGroup row value={form.type} onChange={handleChange('type')}>
                {USER_TYPES.map((t) => (
                  <FormControlLabel key={t} value={t} control={<Radio />} label={t} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => router.push('/users')}>Cancel</Button>
              <Button type="submit" variant="contained">Create User</Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
