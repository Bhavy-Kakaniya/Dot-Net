'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatusChip from '@/components/StatusChip/StatusChip';
import Loader from '@/components/Loader/Loader';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';
import {
  projectService,
  projectAllocationService,
  userService,
  projectTaskService,
  statusService,
  priorityService,
} from '@/services/api';

export default function ProjectDetailsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const { showSnackbar } = useSnackbar();

  const [project, setProject] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [usersMap, setUsersMap] = useState({});
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
        const [
          proj,
          allAllocations,
          allUsers,
          allTasks,
          statusesData,
          prioritiesData,
        ] = await Promise.all([
          projectService.getById(projectId),
          projectAllocationService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
          projectTaskService.getAll().catch(() => []),
          statusService.getAll().catch(() => []),
          priorityService.getAll().catch(() => []),
        ]);

        setProject(proj);

        const uMap = {};
        (allUsers || []).forEach((u) => {
          uMap[u.userId] = u.fullName || u.email;
        });
        setUsersMap(uMap);

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

        const projAllocations = (allAllocations || []).filter(
          (a) => Number(a.projectId) === Number(projectId)
        );
        setAllocations(projAllocations);

        const allocationIds = new Set(projAllocations.map((a) => a.projectAllocationId));
        const projTasks = (allTasks || []).filter((t) =>
          allocationIds.has(t.projectAllocationId)
        );
        setTasks(projTasks);
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleDelete = async () => {
    try {
      await projectService.delete(projectId);
      showSnackbar('Project deleted successfully');
      router.push('/projects');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete project', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading project details..." />;
  }

  if (error || !project) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Project not found'}
        </Alert>
        <Button variant="outlined" onClick={() => router.push('/projects')}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  const avgProgress =
    allocations.length > 0
      ? allocations.reduce((sum, a) => sum + (Number(a.progressPercentage) || 0), 0) /
        allocations.length
      : 0;

  return (
    <Box>
      <PageHeader
        title={project.projectTitle}
        subtitle={`Project ID: #${project.projectId} | ${allocations.length} Active Allocation(s)`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: project.projectTitle, href: `/projects/${projectId}` },
        ]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Project Overview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => router.push(`/projects/${projectId}/edit`)}
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

            <Typography variant="caption" color="text.secondary">
              Project Title
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {project.projectTitle}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Average Progress ({avgProgress.toFixed(0)}%)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={avgProgress}
                sx={{ flex: 1, height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" fontWeight={600}>
                {avgProgress.toFixed(0)}%
              </Typography>
            </Box>
          </Paper>

          {/* Project Allocations List */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Allocated Students & Faculty ({allocations.length})
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                onClick={() => router.push('/allocations/add')}
              >
                Allocate Student
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {allocations.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No students allocated to this project yet.
              </Typography>
            ) : (
              <List disablePadding>
                {allocations.map((a, idx) => (
                  <ListItem
                    key={a.projectAllocationId}
                    divider={idx < allocations.length - 1}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderRadius: 1,
                    }}
                    onClick={() => router.push(`/allocations/${a.projectAllocationId}`)}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Student: {usersMap[a.studentId] || `Student #${a.studentId}`} | Faculty: {usersMap[a.facultyId] || `Faculty #${a.facultyId}`}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Dates: {formatDate(a.projectStartDate)} - {formatDate(a.projectEndDate)} | Progress: {Number(a.progressPercentage || 0).toFixed(0)}% {a.overallGrade ? `| Grade: ${a.overallGrade}` : ''}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Project Tasks List */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Project Tasks ({tasks.length})
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                onClick={() => router.push('/tasks/add')}
              >
                Add Task
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No tasks assigned to this project yet.
              </Typography>
            ) : (
              <List disablePadding>
                {tasks.map((t, idx) => (
                  <ListItem
                    key={t.taskId}
                    divider={idx < tasks.length - 1}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => router.push(`/tasks/${t.taskId}`)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="subtitle2">{t.taskTitle}</Typography>
                          <StatusChip status={statusesMap[t.taskStatusId] || 'Status'} />
                        </Box>
                      }
                      secondary={`Due: ${formatDate(t.taskDueDate)} | Score: ${t.earnedScore ?? '—'} / ${t.assignedScore}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Total Allocations</Typography>
              <Typography variant="body1" fontWeight={600}>{allocations.length}</Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Total Tasks</Typography>
              <Typography variant="body1" fontWeight={600}>{tasks.length}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Average Completion</Typography>
              <Typography variant="body1" fontWeight={600}>{avgProgress.toFixed(0)}%</Typography>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push('/projects')}
            >
              Back to Projects
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.projectTitle}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}