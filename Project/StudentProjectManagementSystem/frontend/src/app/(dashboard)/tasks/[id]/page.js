'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatusChip from '@/components/StatusChip/StatusChip';
import Loader from '@/components/Loader/Loader';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';
import { projectTaskService, projectAllocationService, projectService, userService, statusService, priorityService } from '@/services/api';

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [task, setTask] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [project, setProject] = useState(null);
  const [student, setStudent] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [statusName, setStatusName] = useState('');
  const [priorityName, setPriorityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const taskData = await projectTaskService.getById(id);
        setTask(taskData);

        const [alloc, statusData, priorityData] = await Promise.all([
          taskData.projectAllocationId
            ? projectAllocationService.getById(taskData.projectAllocationId).catch(() => null)
            : null,
          taskData.taskStatusId ? statusService.getById(taskData.taskStatusId).catch(() => null) : null,
          taskData.taskPriorityId
            ? priorityService.getById(taskData.taskPriorityId).catch(() => null)
            : null,
        ]);

        setAllocation(alloc);
        setStatusName(statusData?.statusName || statusData?.taskStatusName || `Status #${taskData.taskStatusId}`);
        setPriorityName(priorityData?.taskPriorityName || `Priority #${taskData.taskPriorityId}`);

        if (alloc) {
          const [proj, std, fac] = await Promise.all([
            alloc.projectId ? projectService.getById(alloc.projectId).catch(() => null) : null,
            alloc.studentId ? userService.getById(alloc.studentId).catch(() => null) : null,
            alloc.facultyId ? userService.getById(alloc.facultyId).catch(() => null) : null,
          ]);
          setProject(proj);
          setStudent(std);
          setFaculty(fac);
        }
      } catch (err) {
        console.error('Failed to load task details:', err);
        setError(err.message || 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await projectTaskService.delete(id);
      showSnackbar('Task deleted successfully');
      router.push('/tasks');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete task', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading task details..." />;
  }

  if (error || !task) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Task not found'}
        </Alert>
        <Button variant="outlined" onClick={() => router.push('/tasks')}>
          Back to Tasks
        </Button>
      </Box>
    );
  }

  const progressVal = Number(task.progressPercentage) || 0;

  return (
    <Box>
      <PageHeader
        title={`Task #${task.taskId}: ${task.taskTitle}`}
        subtitle={`Status: ${statusName} | Priority: ${priorityName}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tasks', href: '/tasks' },
          { label: `Task #${id}`, href: `/tasks/${id}` },
        ]}
      />

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" fontWeight={600}>
                  Task Overview
                </Typography>
                <StatusChip status={statusName} />
                <StatusChip status={priorityName} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => router.push(`/tasks/${id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={2.5}>
              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                  {task.taskDescription || 'No description provided.'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Assigned Score
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {task.assignedScore}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Earned Score
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {task.earnedScore !== null && task.earnedScore !== undefined ? task.earnedScore : '—'}
                </Typography>
              </Grid>

              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  Task Progress ({progressVal.toFixed(0)}%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressVal}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {progressVal.toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Assigned Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(task.taskAssignedDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(task.taskStartDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Due Date
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {formatDate(task.taskDueDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Completed Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(task.taskCompletedDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Next Follow-Up Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(task.nextFollowUpDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Remarks Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Feedback & Remarks
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Faculty Remarks
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: task.facultyRemarks ? 'normal' : 'italic', color: task.facultyRemarks ? 'text.primary' : 'text.secondary' }}>
                  {task.facultyRemarks || 'No faculty remarks.'}
                </Typography>
              </Grid>

              <Grid size={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Student Remarks
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: task.studentRemarks ? 'normal' : 'italic', color: task.studentRemarks ? 'text.primary' : 'text.secondary' }}>
                  {task.studentRemarks || 'No student remarks.'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar: Allocation / Project / Student Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Allocation Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="caption" color="text.secondary">
              Project
            </Typography>
            <Typography
              variant="body1"
              fontWeight={600}
              color="primary"
              sx={{ cursor: allocation ? 'pointer' : 'default', mb: 1.5 }}
              onClick={() => allocation && router.push(`/allocations/${allocation.projectAllocationId}`)}
            >
              {project?.projectTitle || `Allocation #${task.projectAllocationId}`}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Assigned Student
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1.5 }}>
              {student?.fullName || `Student #${allocation?.studentId || '—'}`}
              {student?.userCode && ` (${student.userCode})`}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Faculty Advisor
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 2 }}>
              {faculty?.fullName || `Faculty #${allocation?.facultyId || '—'}`}
            </Typography>

            {allocation && (
              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => router.push(`/allocations/${allocation.projectAllocationId}`)}
              >
                View Full Allocation
              </Button>
            )}
          </Paper>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.push('/tasks')}
          >
            Back to Tasks
          </Button>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Task"
        message={`Are you sure you want to delete task "${task.taskTitle}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
