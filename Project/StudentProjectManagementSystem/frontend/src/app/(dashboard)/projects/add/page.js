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
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import { useData } from '@/hooks/useData';
import { useSnackbar } from '@/hooks/useSnackbar';
import { PROJECT_STATUSES } from '@/utils/constants';
import { validateRequired } from '@/utils/validation';

export default function AddProjectPage() {
	const router = useRouter();
	const { addProject, users } = useData();
	const { showSnackbar } = useSnackbar();
	const faculty = users.filter((u) => u.type === 'Faculty');
	const students = users.filter((u) => u.type === 'Student');

	const [form, setForm] = useState({
		title: '',
		description: '',
		status: 'Planning',
		progress: 0,
		startDate: dayjs(),
		endDate: dayjs().add(6, 'month'),
		advisorId: '',
		studentIds: [],
		department: '',
		budget: '',
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
			department: validateRequired(form.department, 'Department'),
			advisorId: validateRequired(form.advisorId, 'Advisor'),
		};
		setErrors(newErrors);
		if (Object.values(newErrors).some(Boolean)) return;

		addProject({
			...form,
			advisorId: parseInt(form.advisorId, 10),
			studentIds: form.studentIds.map(Number),
			budget: parseFloat(form.budget) || 0,
			progress: Number(form.progress),
			startDate: form.startDate.format('YYYY-MM-DD'),
			endDate: form.endDate.format('YYYY-MM-DD'),
		});
		showSnackbar('Project created successfully');
		router.push('/projects');
	};

	return (
		<Box>
			<PageHeader
				title="Add Project"
				breadcrumbs={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Projects', href: '/projects' },
					{ label: 'Add Project', href: '/projects/add' },
				]}
			/>

			<FormContainer>
				<Grid container spacing={2.5} component="form" onSubmit={handleSubmit}>
					<Grid size={12}>
						<TextField fullWidth label="Project Title" value={form.title} onChange={handleChange('title')} error={!!errors.title} helperText={errors.title} required />
					</Grid>
					<Grid size={12}>
						<TextField fullWidth label="Description" multiline rows={4} value={form.description} onChange={handleChange('description')} error={!!errors.description} helperText={errors.description} required />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<FormControl fullWidth error={!!errors.advisorId}>
							<InputLabel>Advisor</InputLabel>
							<Select value={form.advisorId} label="Advisor" onChange={handleChange('advisorId')}>
								{faculty.map((f) => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField fullWidth label="Department" value={form.department} onChange={handleChange('department')} error={!!errors.department} helperText={errors.department} required />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select value={form.status} label="Status" onChange={handleChange('status')}>
								{PROJECT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField fullWidth label="Budget ($)" type="number" value={form.budget} onChange={handleChange('budget')} />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<DatePicker label="Start Date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} slotProps={{ textField: { fullWidth: true } }} />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<DatePicker label="End Date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} slotProps={{ textField: { fullWidth: true } }} />
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Students</InputLabel>
							<Select multiple value={form.studentIds} label="Students" onChange={handleChange('studentIds')}>
								{students.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Typography variant="body2" gutterBottom>Progress: {form.progress}%</Typography>
						<Slider value={form.progress} onChange={(_, v) => setForm({ ...form, progress: v })} valueLabelDisplay="auto" />
					</Grid>
					<Grid size={12}>
						<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
							<Button variant="outlined" onClick={() => router.push('/projects')}>Cancel</Button>
							<Button type="submit" variant="contained">Create Project</Button>
						</Box>
					</Grid>
				</Grid>
			</FormContainer>
		</Box>
	);
}