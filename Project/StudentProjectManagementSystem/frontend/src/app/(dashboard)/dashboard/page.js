'use client';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import StatusChip from '@/components/StatusChip/StatusChip';
import Loader from '@/components/Loader/Loader';
import { formatDate } from '@/utils/formatters';
import { dashboardService } from '@/services/api';

const CHART_COLORS = ['#1565C0', '#42A5F5', '#90CAF9', '#BBDEFB', '#64B5F6', '#1E88E5'];
const PRIORITY_COLORS = {
  Low: '#4CAF50',
  Medium: '#2196F3',
  High: '#FF9800',
  Critical: '#F44336',
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageProjectProgress: 0,
  });

  const [tasksByStatus, setTasksByStatus] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [facultyWorkload, setFacultyWorkload] = useState([]);
  const [tasksDueSoon, setTasksDueSoon] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [
          sumData,
          statusData,
          priorityData,
          projectsData,
          overdueData,
          studentsData,
          workloadData,
          dueSoonData,
        ] = await Promise.all([
          dashboardService.getSummary().catch(() => ({})),
          dashboardService.getTasksByStatus().catch(() => []),
          dashboardService.getTasksByPriority().catch(() => []),
          dashboardService.getTopProjectsByProgress().catch(() => []),
          dashboardService.getOverdueTasks().catch(() => []),
          dashboardService.getTopStudents().catch(() => []),
          dashboardService.getFacultyWorkload().catch(() => []),
          dashboardService.getTasksDueNext7Days().catch(() => []),
        ]);

        if (sumData) {
          setSummary({
            totalStudents: sumData.totalStudents ?? sumData.TotalStudents ?? 0,
            totalFaculty: sumData.totalFaculty ?? sumData.TotalFaculty ?? 0,
            totalProjects: sumData.totalProjects ?? sumData.TotalProjects ?? 0,
            totalTasks: sumData.totalTasks ?? sumData.TotalTasks ?? 0,
            completedTasks: sumData.completedTasks ?? sumData.CompletedTasks ?? 0,
            pendingTasks: sumData.pendingTasks ?? sumData.PendingTasks ?? 0,
            averageProjectProgress: sumData.averageProjectProgress ?? sumData.AverageProjectProgress ?? 0,
          });
        }

        // Format task by status for recharts
        const formattedStatus = (statusData || []).map((s) => ({
          name: s.taskStatus || s.TaskStatus || 'Unknown',
          count: s.totalTasks ?? s.TotalTasks ?? 0,
        }));
        setTasksByStatus(formattedStatus);

        // Format task by priority for recharts
        const formattedPriority = (priorityData || []).map((p) => ({
          name: p.priority || p.Priority || 'Unknown',
          value: p.totalTasks ?? p.TotalTasks ?? 0,
        }));
        setTasksByPriority(formattedPriority);

        setTopProjects(projectsData || []);
        setOverdueTasks(overdueData || []);
        setTopStudents(studentsData || []);
        setFacultyWorkload(workloadData || []);
        setTasksDueSoon(dueSoonData || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to connect to backend dashboard APIs. Please verify backend is running on port 5093.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard statistics from backend LINQ queries..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Live metrics & LINQ query analytics from ASP.NET Core backend"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Top Statistic Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard
            title="Students"
            value={summary.totalStudents}
            icon={SchoolIcon}
            color="#2E7D32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard
            title="Faculty"
            value={summary.totalFaculty}
            icon={PersonIcon}
            color="#7B1FA2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard
            title="Projects"
            value={summary.totalProjects}
            icon={FolderIcon}
            color="#E65100"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard
            title="Total Tasks"
            value={summary.totalTasks}
            icon={TaskIcon}
            color="#1565C0"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard
            title="Completed Tasks"
            value={summary.completedTasks}
            icon={CheckCircleIcon}
            color="#2E7D32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <DashboardCard
            title="Avg Progress"
            value={`${Number(summary.averageProjectProgress || 0).toFixed(0)}%`}
            icon={TrendingUpIcon}
            color="#00838F"
          />
        </Grid>
      </Grid>

      {/* Overdue Tasks Alert Banner if any */}
      {overdueTasks.length > 0 && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3 }}
          action={
            <Chip
              label={`${overdueTasks.length} Overdue`}
              color="warning"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          }
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Attention: {overdueTasks.length} task(s) are currently past due date and require attention.
          </Typography>
        </Alert>
      )}

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Task Status Overview BarChart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Tasks by Status (Backend LINQ Query)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time distribution of tasks grouped by status
            </Typography>
            <Box sx={{ height: 280, mt: 2 }}>
              {tasksByStatus.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">No task status data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksByStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E8EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1565C0" radius={[6, 6, 0, 0]} name="Total Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Task Priority Distribution PieChart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Tasks by Priority
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Priority level breakdown
            </Typography>
            <Box sx={{ height: 280, mt: 1 }}>
              {tasksByPriority.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">No task priority data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tasksByPriority}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {tasksByPriority.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PRIORITY_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Progress & Top Students Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top Projects Progress */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Top Projects by Progress
              </Typography>
              <Chip label="LINQ Query" size="small" variant="outlined" />
            </Box>
            {topProjects.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No project allocation progress data available.
              </Typography>
            ) : (
              topProjects.slice(0, 5).map((p, idx) => {
                const prog = Number(p.progressPercentage ?? p.ProgressPercentage ?? 0);
                const projTitle = p.project || p.Project || `Project #${idx + 1}`;
                const studentName = p.student || p.Student || '—';
                const facultyName = p.faculty || p.Faculty || '—';
                return (
                  <Box key={idx} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {projTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Student: {studentName} | Faculty: {facultyName}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {prog.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={prog}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                );
              })
            )}
          </Paper>
        </Grid>

        {/* Top Students by Earned Score */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6" fontWeight={600}>
                Top Students (Avg Score)
              </Typography>
              <Chip label="Top 10" size="small" color="success" variant="outlined" />
            </Box>
            {topStudents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No student score records available.
              </Typography>
            ) : (
              <List disablePadding>
                {topStudents.slice(0, 5).map((s, idx) => {
                  const studentName = s.studentName || s.StudentName || 'Unknown';
                  const avgScore = Number(s.averageScore ?? s.AverageScore ?? 0).toFixed(1);
                  return (
                    <ListItem key={idx} divider={idx < 4} sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 34, height: 34, fontSize: 14 }}>
                          {studentName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle2">{studentName}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">Rank #{idx + 1}</Typography>}
                      />
                      <Chip
                        label={`${avgScore} pts`}
                        size="small"
                        color={idx === 0 ? 'success' : 'primary'}
                        variant={idx === 0 ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Due Soon & Faculty Workload Section */}
      <Grid container spacing={3}>
        {/* Tasks Due Within 7 Days */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Tasks Due Next 7 Days
              </Typography>
              <Chip label={`${tasksDueSoon.length} Tasks`} size="small" color="info" />
            </Box>
            {tasksDueSoon.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No tasks due in the next 7 days.
              </Typography>
            ) : (
              <List disablePadding>
                {tasksDueSoon.slice(0, 5).map((t, idx) => (
                  <ListItem
                    key={t.taskId || idx}
                    divider={idx < tasksDueSoon.length - 1}
                    sx={{ px: 0, cursor: 'pointer' }}
                    onClick={() => router.push(`/tasks/${t.taskId}`)}
                  >
                    <ListItemText
                      primary={<Typography variant="subtitle2">{t.taskTitle || t.TaskTitle}</Typography>}
                      secondary={`Student: ${t.student || t.Student} | Due: ${formatDate(t.taskDueDate || t.TaskDueDate)}`}
                    />
                    <StatusChip status={t.status || t.Status || 'In Progress'} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Faculty Workload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Faculty Workload (Projects Assigned)
              </Typography>
              <Chip label="Workload" size="small" color="secondary" />
            </Box>
            {facultyWorkload.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No faculty assignment data available.
              </Typography>
            ) : (
              <List disablePadding>
                {facultyWorkload.slice(0, 5).map((f, idx) => (
                  <ListItem key={idx} divider={idx < facultyWorkload.length - 1} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.light', width: 34, height: 34, fontSize: 14 }}>
                        {(f.facultyName || f.FacultyName || 'F').charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle2">{f.facultyName || f.FacultyName}</Typography>}
                      secondary="Faculty Advisor"
                    />
                    <Chip
                      label={`${f.totalProjects ?? f.TotalProjects ?? 0} Projects`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}