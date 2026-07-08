'use client';

import { useRouter, useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatusChip from '@/components/StatusChip/StatusChip';
import EmptyState from '@/components/EmptyState/EmptyState';
import { useData } from '@/hooks/useData';
import { formatDate } from '@/utils/formatters';

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { getTaskById, getProjectById, getUserById } = useData();
  const taskId = parseInt(params.id, 10);
  const task = getTaskById(taskId);

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        description="The task you are looking for does not exist."
        actionLabel="Back to Tasks"
        onAction={() => router.push('/tasks')}
      />
    );
  }

  const project = getProjectById(task.projectId);
  const assignee = getUserById(task.assigneeId);

  const details = [
    { label: 'Status', value: <StatusChip status={task.status} /> },
    { label: 'Priority', value: <StatusChip status={task.priority} /> },
    { label: 'Project', value: project?.title || '—' },
    { label: 'Assignee', value: assignee?.name || '—' },
    { label: 'Due Date', value: formatDate(task.dueDate) },
    { label: 'Created', value: formatDate(task.createdAt) },
  ];

  return (
    <Box>
      <PageHeader
        title={task.title}
        subtitle={task.description}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tasks', href: '/tasks' },
          { label: task.title, href: `/tasks/${taskId}` },
        ]}
        actionLabel="Edit Task"
        actionHref={`/tasks/${taskId}/edit`}
        actionIcon={EditIcon}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Task Details</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {details.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Box sx={{ mt: 0.5 }}>{typeof item.value === 'string' ? (
                    <Typography variant="body1">{item.value}</Typography>
                  ) : item.value}</Box>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
            <Typography variant="body1">{task.description}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Related Info</Typography>
            <Divider sx={{ mb: 2 }} />
            {project && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Project</Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  {project.title}
                </Typography>
                <StatusChip status={project.status} />
              </Box>
            )}
            {assignee && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">Assignee</Typography>
                <Typography variant="body1">{assignee.name}</Typography>
                <Typography variant="body2" color="text.secondary">{assignee.email}</Typography>
              </Box>
            )}
            <Button variant="outlined" fullWidth onClick={() => router.push('/tasks')}>
              Back to Tasks
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
