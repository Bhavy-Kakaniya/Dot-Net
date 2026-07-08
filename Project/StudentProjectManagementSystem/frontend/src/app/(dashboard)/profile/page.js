'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import StatusChip from '@/components/StatusChip/StatusChip';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/hooks/useSnackbar';
import { getInitials, formatDate } from '@/utils/formatters';

export default function ProfilePage() {
	const { user } = useAuth();
	const { showSnackbar } = useSnackbar();
	const [form, setForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
		phone: '+1 555-0100',
		department: user?.department || '',
		bio: 'System administrator responsible for managing student projects and user accounts.',
		notifications: 'all',
	});

	const handleChange = (field) => (e) => {
		setForm((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleSave = () => {
		showSnackbar('Profile updated successfully');
	};

	return (
		<Box>
			<PageHeader
				title="Profile"
				subtitle="Manage your account settings and preferences"
				breadcrumbs={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Profile', href: '/profile' },
				]}
			/>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 4 }}>
					<FormContainer maxWidth="100%">
						<Box sx={{ textAlign: 'center' }}>
							<Avatar sx={{ width: 96, height: 96, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 32 }}>{getInitials(form.name)}</Avatar>
							<Typography variant="h6" fontWeight={600}>{form.name}</Typography>
							<Typography variant="body2" color="text.secondary" gutterBottom>{form.email}</Typography>
							<StatusChip status="Active" />
							<Divider sx={{ my: 3 }} />
							<Box sx={{ textAlign: 'left' }}>
								<Typography variant="body2" color="text.secondary">Department</Typography>
								<Typography variant="body1" sx={{ mb: 2 }}>{form.department}</Typography>
								<Typography variant="body2" color="text.secondary">Role</Typography>
								<Typography variant="body1" sx={{ mb: 2 }}>{user?.type}</Typography>
								<Typography variant="body2" color="text.secondary">Member Since</Typography>
								<Typography variant="body1">{formatDate('2022-01-01')}</Typography>
							</Box>
						</Box>
					</FormContainer>
				</Grid>

				<Grid size={{ xs: 12, md: 8 }}>
					<FormContainer maxWidth="100%">
						<Typography variant="h6" fontWeight={600} gutterBottom>Edit Profile</Typography>
						<Grid container spacing={2.5}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Full Name" value={form.name} onChange={handleChange('name')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Email" value={form.email} onChange={handleChange('email')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Department" value={form.department} onChange={handleChange('department')} />
							</Grid>
							<Grid size={12}>
								<TextField fullWidth label="Bio" multiline rows={3} value={form.bio} onChange={handleChange('bio')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth>
									<InputLabel>Notification Preference</InputLabel>
									<Select value={form.notifications} label="Notification Preference" onChange={handleChange('notifications')}>
										<MenuItem value="all">All Notifications</MenuItem>
										<MenuItem value="important">Important Only</MenuItem>
										<MenuItem value="none">None</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={12}>
								<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
									<Button variant="outlined">Cancel</Button>
									<Button variant="contained" onClick={handleSave}>Save Changes</Button>
								</Box>
							</Grid>
						</Grid>
					</FormContainer>
				</Grid>
			</Grid>
		</Box>
	);
}
