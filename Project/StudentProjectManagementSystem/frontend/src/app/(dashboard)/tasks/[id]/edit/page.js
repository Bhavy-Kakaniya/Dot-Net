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
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import Loader from '@/components/Loader/Loader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateRequired } from '@/utils/validation';
import {
  projectTaskService,
  projectAllocationService,
  projectService,
  userService,
  statusService,
  priorityService,
} from '@/services/api';

export default function EditTaskPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [allocations, setAllocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [form, setForm] = useState({
    taskTitle: '',
    taskDescription: '',
    projectAllocationId: '',
    taskStatusId: '',
    taskPriorityId: '',
    assignedScore: 100,
    earnedScore: '',
    progressPercentage: 0,
    taskStartDate: null,
    taskDueDate: null,
    taskCompletedDate: null,
    nextFollowUpDate: null,
    facultyRemarks: '',
    studentRemarks: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      setApiError(null);
      try {
        const [
          taskData,
          allocationsData,
          projectsData,
          usersData,
          statusesData,
          prioritiesData,
        ] = await Promise.all([
          projectTaskService.getById(id),
          projectAllocationService.getAll().catch(() => []),
          projectService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
          statusService.getAll().catch(() => []),
          priorityService.getAll().catch(() => []),
        ]);

        const pMap = {};
        (projectsData || []).forEach((p) => {
          pMap[p.projectId] = p.projectTitle;
        });

        const uMap = {};
        (usersData || []).forEach((u) => {
          uMap[u.userId] = u.fullName || u.email;
        });

        const formattedAllocations = (allocationsData || []).map((a) => ({
          id: a.projectAllocationId,
          label: `Allocation #${a.projectAllocationId}: ${pMap[a.projectId] || `Project #${a.projectId}`} — ${uMap[a.studentId] || `Student #${a.studentId}`}`,
        }));

        setAllocations(formattedAllocations);

        const seenStatus = new Set();
        const uniqueStatuses = (statusesData || []).filter((s) => {
          const name = s.statusName || s.taskStatusName;
          if (seenStatus.has(name)) return false;
          seenStatus.add(name);
          return true;
        });
        setStatuses(uniqueStatuses);

        const seenPriority = new Set();
        const uniquePriorities = (prioritiesData || []).filter((p) => {
          if (seenPriority.has(p.taskPriorityName)) return false;
          seenPriority.add(p.taskPriorityName);
          return true;
        });
        setPriorities(uniquePriorities);

        setForm({
          taskTitle: taskData.taskTitle || '',
          taskDescription: taskData.taskDescription || '',
          projectAllocationId: taskData.projectAllocationId || '',
          taskStatusId: taskData.taskStatusId || '',
          taskPriorityId: taskData.taskPriorityId || '',
          assignedScore: taskData.assignedScore ?? 100,
          earnedScore: taskData.earnedScore !== null && taskData.earnedScore !== undefined ? taskData.earnedScore : '',
          progressPercentage: taskData.progressPercentage ?? 0,
          taskStartDate: taskData.taskStartDate ? dayjs(taskData.taskStartDate) : null,
          taskDueDate: taskData.taskDueDate ? dayjs(taskData.taskDueDate) : null,
          taskCompletedDate: taskData.taskCompletedDate ? dayjs(taskData.taskCompletedDate) : null,
          nextFollowUpDate: taskData.nextFollowUpDate ? dayjs(taskData.nextFollowUpDate) : null,
          facultyRemarks: taskData.facultyRemarks || '',
          studentRemarks: taskData.studentRemarks || '',
        });
      } catch (err) {
        console.error('Failed to load task edit data:', err);
        setApiError(err.message || 'Failed to load task details');
      } finally {
        setLoadingData(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const newErrors = {
      taskTitle: validateRequired(form.taskTitle, 'Task Title'),
      projectAllocationId: validateRequired(form.projectAllocationId, 'Project Allocation'),
      taskStatusId: validateRequired(form.taskStatusId, 'Status'),
      taskPriorityId: validateRequired(form.taskPriorityId, 'Priority'),
      assignedScore: form.assignedScore === '' || form.assignedScore < 0 ? 'Assigned score must be >= 0' : '',
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const payload = {
        projectAllocationId: Number(form.projectAllocationId),
        taskTitle: form.taskTitle.trim(),
        taskDescription: form.taskDescription?.trim() || null,
        taskStatusId: Number(form.taskStatusId),
        taskPriorityId: Number(form.taskPriorityId),
        assignedScore: Number(form.assignedScore),
        earnedScore: form.earnedScore !== '' && form.earnedScore !== null ? Number(form.earnedScore) : null,
        progressPercentage: Number(form.progressPercentage) || 0,
        taskStartDate: form.taskStartDate ? form.taskStartDate.toISOString() : null,
        taskDueDate: form.taskDueDate ? form.taskDueDate.toISOString() : null,
        taskCompletedDate: form.taskCompletedDate ? form.taskCompletedDate.toISOString() : null,
        nextFollowUpDate: form.nextFollowUpDate ? form.nextFollowUpDate.toISOString() : null,
        facultyRemarks: form.facultyRemarks?.trim() || null,
        studentRemarks: form.studentRemarks?.trim() || null,
      };

      await projectTaskService.update(id, payload);
      showSnackbar('Task updated successfully');
      router.push('/tasks');
    } catch (err) {
      console.error('Update task error:', err);
      setApiError(err.message || 'Failed to update task');
      showSnackbar(err.message || 'Failed to update task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <Loader message="Loading task details..." />;
  }

  return (
    <Box>
      <PageHeader
        title={`Edit Task #${id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tasks', href: '/tasks' },
          { label: `Task #${id}`, href: `/tasks/${id}` },
          { label: 'Edit', href: `/tasks/${id}/edit` },
        ]}
      />

      <FormContainer maxWidth="md">
        {apiError && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Task Title"
              value={form.taskTitle}
              onChange={handleChange('taskTitle')}
              error={!!errors.taskTitle}
              helperText={errors.taskTitle}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Task Description"
              multiline
              rows={3}
              value={form.taskDescription}
              onChange={handleChange('taskDescription')}
            />
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth error={!!errors.projectAllocationId} required>
              <InputLabel>Select Project Allocation</InputLabel>
              <Select
                value={form.projectAllocationId}
                label="Select Project Allocation"
                onChange={handleChange('projectAllocationId')}
              >
                {allocations.map((a, i) => (
                  <MenuItem key={i} value={a.id}>
                    {a.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.taskStatusId} required>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.taskStatusId}
                label="Status"
                onChange={handleChange('taskStatusId')}
              >
                {statuses.map((s, i) => (
                  <MenuItem key={i} value={s.taskStatusId}>
                    {s.statusName || s.taskStatusName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.taskPriorityId} required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={form.taskPriorityId}
                label="Priority"
                onChange={handleChange('taskPriorityId')}
              >
                {priorities.map((p, i) => (
                  <MenuItem key={i} value={p.taskPriorityId}>
                    {p.taskPriorityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Assigned Score *"
              type="number"
              value={form.assignedScore}
              onChange={handleChange('assignedScore')}
              error={!!errors.assignedScore}
              helperText={errors.assignedScore}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Earned Score (Optional)"
              type="number"
              value={form.earnedScore}
              onChange={handleChange('earnedScore')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Start Date"
              value={form.taskStartDate}
              onChange={(val) => setForm((prev) => ({ ...prev, taskStartDate: val }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Due Date"
              value={form.taskDueDate}
              onChange={(val) => setForm((prev) => ({ ...prev, taskDueDate: val }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Completed Date"
              value={form.taskCompletedDate}
              onChange={(val) => setForm((prev) => ({ ...prev, taskCompletedDate: val }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Next Follow-Up Date"
              value={form.nextFollowUpDate}
              onChange={(val) => setForm((prev) => ({ ...prev, nextFollowUpDate: val }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" gutterBottom>
              Progress: {form.progressPercentage}%
            </Typography>
            <Slider
              value={Number(form.progressPercentage) || 0}
              onChange={(_, val) => setForm((prev) => ({ ...prev, progressPercentage: val }))}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Faculty Remarks"
              multiline
              rows={2}
              value={form.facultyRemarks}
              onChange={handleChange('facultyRemarks')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Student Remarks"
              multiline
              rows={2}
              value={form.studentRemarks}
              onChange={handleChange('studentRemarks')}
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/tasks')}
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
