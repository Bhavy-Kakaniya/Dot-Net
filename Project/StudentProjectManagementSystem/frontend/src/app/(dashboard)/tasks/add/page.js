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
import { TASK_STATUSES, TASK_PRIORITIES } from '@/utils/constants';
import { validateRequired } from '@/utils/validation';

export default function AddTaskPage() {
  const router = useRouter();
  const { addTask, projects, users } = useData();
  const { showSnackbar } = useSnackbar();
  const students = users.filter((u) => u.type === 'Student' || u.type === 'Faculty');

  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: dayjs().add(2, 'week'),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      title: validateRequired(form.title, 'Title'),
      description: validateRequired(form.description, 'Description'),
      projectId: validateRequired(form.projectId, 'Project'),
      assigneeId: validateRequired(form.assigneeId, 'Assignee'),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    addTask({
      ...form,
      projectId: parseInt(form.projectId, 10),
      assigneeId: parseInt(form.assigneeId, 10),
      dueDate: form.dueDate.format('YYYY-MM-DD'),
    });
    showSnackbar('Task created successfully');
    router.push('/tasks');
  };

  return (
    <Box>
      <PageHeader
        title="Add Task"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tasks', href: '/tasks' },
          { label: 'Add Task', href: '/tasks/add' },
        ]}
      />

      <FormContainer>
        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={12}>
            <TextField fullWidth label="Task Title" value={form.title} onChange={handleChange('title')} error={!!errors.title} helperText={errors.title} required />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={handleChange('description')} error={!!errors.description} helperText={errors.description} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.projectId}>
              <InputLabel>Project</InputLabel>
              <Select value={form.projectId} label="Project" onChange={handleChange('projectId')}>
                {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.assigneeId}>
              <InputLabel>Assignee</InputLabel>
              <Select value={form.assigneeId} label="Assignee" onChange={handleChange('assigneeId')}>
                {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={handleChange('status')}>
                {TASK_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker label="Due Date" value={form.dueDate} onChange={(v) => setForm({ ...form, dueDate: v })} slotProps={{ textField: { fullWidth: true } }} />
          </Grid>
          <Grid size={12}>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <RadioGroup row value={form.priority} onChange={handleChange('priority')}>
                {TASK_PRIORITIES.map((p) => (
                  <FormControlLabel key={p} value={p} control={<Radio />} label={p} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => router.push('/tasks')}>Cancel</Button>
              <Button type="submit" variant="contained">Create Task</Button>
            </Box>
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
}
