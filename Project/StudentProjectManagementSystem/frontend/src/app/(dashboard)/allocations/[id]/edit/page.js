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
import Alert from '@mui/material/Alert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import Loader from '@/components/Loader/Loader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { validateRequired } from '@/utils/validation';
import { projectAllocationService, projectService, userService, userTypeService } from '@/services/api';

export default function EditAllocationPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const [form, setForm] = useState({
    projectId: '',
    studentId: '',
    facultyId: '',
    projectStartDate: dayjs(),
    projectEndDate: dayjs().add(6, 'month'),
    overallGrade: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      setApiError(null);
      try {
        const [allocation, projectsData, usersData, userTypesData] = await Promise.all([
          projectAllocationService.getById(id),
          projectService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
          userTypeService.getAll().catch(() => []),
        ]);

        setInitialData(allocation);
        setProjects(projectsData || []);

        const studentTypeId = (userTypesData || []).find((ut) => ut.userTypeName?.toLowerCase() === 'student')?.userTypeId;
        const facultyTypeId = (userTypesData || []).find((ut) => ut.userTypeName?.toLowerCase() === 'faculty')?.userTypeId;

        const allUsers = usersData || [];
        const studentList = studentTypeId
          ? allUsers.filter((u) => u.userTypeId === studentTypeId && !u.isDeleted)
          : allUsers.filter((u) => !u.isDeleted);

        const facultyList = facultyTypeId
          ? allUsers.filter((u) => u.userTypeId === facultyTypeId && !u.isDeleted)
          : allUsers.filter((u) => !u.isDeleted);

        setStudents(studentList.length > 0 ? studentList : allUsers);
        setFaculty(facultyList.length > 0 ? facultyList : allUsers);

        setForm({
          projectId: allocation.projectId || '',
          studentId: allocation.studentId || '',
          facultyId: allocation.facultyId || '',
          projectStartDate: allocation.projectStartDate ? dayjs(allocation.projectStartDate) : dayjs(),
          projectEndDate: allocation.projectEndDate ? dayjs(allocation.projectEndDate) : dayjs().add(6, 'month'),
          overallGrade: allocation.overallGrade || '',
        });
      } catch (err) {
        console.error('Failed to load allocation data:', err);
        setApiError(err.message || 'Failed to load allocation data');
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
      projectId: validateRequired(form.projectId, 'Project'),
      studentId: validateRequired(form.studentId, 'Student'),
      facultyId: validateRequired(form.facultyId, 'Faculty'),
      projectStartDate: !form.projectStartDate ? 'Start date is required' : '',
      projectEndDate: !form.projectEndDate ? 'End date is required' : '',
    };

    if (form.projectStartDate && form.projectEndDate && form.projectEndDate.isBefore(form.projectStartDate)) {
      newErrors.projectEndDate = 'End date cannot be earlier than start date';
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const payload = {
        projectId: Number(form.projectId),
        studentId: Number(form.studentId),
        facultyId: Number(form.facultyId),
        assignedDate: initialData?.assignedDate || new Date().toISOString(),
        projectStartDate: form.projectStartDate.toISOString(),
        projectEndDate: form.projectEndDate.toISOString(),
        totalTasksGiven: initialData?.totalTasksGiven ?? 0,
        totalCompletedTasks: initialData?.totalCompletedTasks ?? 0,
        progressPercentage: initialData?.progressPercentage ?? 0,
        overallGrade: form.overallGrade?.trim() ? form.overallGrade.trim().substring(0, 1).toUpperCase() : null,
      };

      await projectAllocationService.update(id, payload);
      showSnackbar('Project allocation updated successfully');
      router.push('/allocations');
    } catch (err) {
      console.error('Update allocation error:', err);
      setApiError(err.message || 'Failed to update project allocation');
      showSnackbar(err.message || 'Failed to update project allocation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return <Loader message="Loading allocation details..." />;
  }

  return (
    <Box>
      <PageHeader
        title={`Edit Allocation #${id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Allocations', href: '/allocations' },
          { label: `Allocation #${id}`, href: `/allocations/${id}` },
          { label: 'Edit', href: `/allocations/${id}/edit` },
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
            <FormControl fullWidth error={!!errors.projectId} required>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={form.projectId}
                label="Select Project"
                onChange={handleChange('projectId')}
              >
                {projects.map((p, i) => (
                  <MenuItem key={i} value={p.projectId}>
                    {p.projectTitle} (ID: #{p.projectId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.studentId} required>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={form.studentId}
                label="Select Student"
                onChange={handleChange('studentId')}
              >
                {students.map((s, i) => (
                  <MenuItem key={i} value={s.userId}>
                    {s.fullName} {s.userCode ? `(${s.userCode})` : ''} - {s.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.facultyId} required>
              <InputLabel>Select Faculty / Advisor</InputLabel>
              <Select
                value={form.facultyId}
                label="Select Faculty / Advisor"
                onChange={handleChange('facultyId')}
              >
                {faculty.map((f, i) => (
                  <MenuItem key={i} value={f.userId}>
                    {f.fullName} {f.userCode ? `(${f.userCode})` : ''} - {f.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Project Start Date *"
              value={form.projectStartDate}
              onChange={(val) => {
                setForm((prev) => ({ ...prev, projectStartDate: val }));
                setErrors((prev) => ({ ...prev, projectStartDate: '' }));
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.projectStartDate,
                  helperText: errors.projectStartDate,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Project End Date *"
              value={form.projectEndDate}
              onChange={(val) => {
                setForm((prev) => ({ ...prev, projectEndDate: val }));
                setErrors((prev) => ({ ...prev, projectEndDate: '' }));
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.projectEndDate,
                  helperText: errors.projectEndDate,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Overall Grade (Optional)</InputLabel>
              <Select
                value={form.overallGrade}
                label="Overall Grade (Optional)"
                onChange={handleChange('overallGrade')}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="A">Grade A</MenuItem>
                <MenuItem value="B">Grade B</MenuItem>
                <MenuItem value="C">Grade C</MenuItem>
                <MenuItem value="D">Grade D</MenuItem>
                <MenuItem value="F">Grade F</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/allocations')}
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
