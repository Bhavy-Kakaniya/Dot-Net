'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/PageHeader/PageHeader';
import Loader from '@/components/Loader/Loader';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import StatusChip from '@/components/StatusChip/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';
import { projectAllocationService, projectService, userService, projectTaskService, statusService, priorityService } from '@/services/api';

export default function AllocationDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [allocation, setAllocation] = useState(null);
  const [project, setProject] = useState(null);
  const [student, setStudent] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusesMap, setStatusesMap] = useState({});
  const [prioritiesMap, setPrioritiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const alloc = await projectAllocationService.getById(id);
        setAllocation(alloc);

        const [proj, std, fac, allTasks, statusesData, prioritiesData] = await Promise.all([
          alloc.projectId ? projectService.getById(alloc.projectId).catch(() => null) : null,
          alloc.studentId ? userService.getById(alloc.studentId).catch(() => null) : null,
          alloc.facultyId ? userService.getById(alloc.facultyId).catch(() => null) : null,
          projectTaskService.getAll().catch(() => []),
          statusService.getAll().catch(() => []),
          priorityService.getAll().catch(() => []),
        ]);

        setProject(proj);
        setStudent(std);
        setFaculty(fac);

        const sMap = {};
        (statusesData || []).forEach((s) => {
          sMap[s.taskStatusId] = s.statusName || s.taskStatusName;
        });
        setStatusesMap(sMap);

        const prMap = {};
        (prioritiesData || []).forEach((p) => {
          prMap[p.taskPriorityId] = p.taskPriorityName;
        });
        setPrioritiesMap(prMap);

        const allocTasks = (allTasks || []).filter(
          (t) => Number(t.projectAllocationId) === Number(id)
        );
        setTasks(allocTasks);
      } catch (err) {
        console.error('Failed to load allocation detail:', err);
        setError(err.message || 'Failed to load allocation details');
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
      await projectAllocationService.delete(id);
      showSnackbar('Allocation deleted successfully');
      router.push('/allocations');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete allocation', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading allocation details..." />;
  }

  if (error || !allocation) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Allocation not found'}
        </Alert>
        <Button variant="outlined" onClick={() => router.push('/allocations')}>
          Back to Allocations
        </Button>
      </Box>
    );
  }

  const progressVal = Number(allocation.progressPercentage) || 0;

  return (
    <Box>
      <PageHeader
        title={`Allocation #${allocation.projectAllocationId}: ${project?.projectTitle || `Project #${allocation.projectId}`}`}
        subtitle={`Student: ${student?.fullName || `ID #${allocation.studentId}`} | Faculty: ${faculty?.fullName || `ID #${allocation.facultyId}`}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Allocations', href: '/allocations' },
          { label: `Allocation #${id}`, href: `/allocations/${id}` },
        ]}
      />

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Allocation Overview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => router.push(`/allocations/${id}/edit`)}
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

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Project Title
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {project?.projectTitle || `Project #${allocation.projectId}`}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Assigned Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(allocation.assignedDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Project Start Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(allocation.projectStartDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Project End Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(allocation.projectEndDate)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Overall Grade
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {allocation.overallGrade ? (
                    <Chip label={`Grade ${allocation.overallGrade}`} color="primary" size="small" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">Not graded yet</Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Tasks Completed / Total
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {allocation.totalCompletedTasks || 0} / {allocation.totalTasksGiven || 0} tasks
                </Typography>
              </Grid>

              <Grid size={12}>
                <Typography variant="caption" color="text.secondary">
                  Project Progress ({progressVal.toFixed(0)}%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressVal}
                    sx={{ flex: 1, height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {progressVal.toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Allocation Tasks List */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Associated Tasks ({tasks.length})
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                onClick={() => router.push('/tasks/add')}
              >
                Add Task
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No tasks created for this allocation yet.
              </Typography>
            ) : (
              <List disablePadding>
                {tasks.map((t, idx) => {
                  const statusName = statusesMap[t.taskStatusId] || `Status #${t.taskStatusId}`;
                  const priorityName = prioritiesMap[t.taskPriorityId] || `Priority #${t.taskPriorityId}`;
                  return (
                    <ListItem
                      key={t.taskId || idx}
                      divider={idx < tasks.length - 1}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        borderRadius: 1,
                      }}
                      onClick={() => router.push(`/tasks/${t.taskId}`)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {t.taskTitle}
                            </Typography>
                            <StatusChip status={statusName} />
                            <Chip label={priorityName} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Due: {formatDate(t.taskDueDate)} | Score: {t.earnedScore ?? '—'} / {t.assignedScore} | Progress: {t.progressPercentage || 0}%
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Sidebar Cards (Student & Faculty Details) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Student Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {student?.fullName || `Student #${allocation.studentId}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {student?.email || '—'}
            </Typography>
            {student?.userCode && (
              <Typography variant="body2" color="text.secondary">
                Student Code: {student.userCode}
              </Typography>
            )}
            {student?.mobileNumber && (
              <Typography variant="body2" color="text.secondary">
                Mobile: {student.mobileNumber}
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Faculty / Advisor Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {faculty?.fullName || `Faculty #${allocation.facultyId}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {faculty?.email || '—'}
            </Typography>
            {faculty?.userCode && (
              <Typography variant="body2" color="text.secondary">
                Faculty Code: {faculty.userCode}
              </Typography>
            )}
            {faculty?.mobileNumber && (
              <Typography variant="body2" color="text.secondary">
                Mobile: {faculty.mobileNumber}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Allocation"
        message={`Are you sure you want to delete allocation #${id}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
