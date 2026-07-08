import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'primary.main', trend }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Typography
                variant="caption"
                sx={{ color: trend.positive ? 'success.main' : 'error.main', display: 'block', mt: 0.5 }}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Avatar sx={{ bgcolor: `${color}15`, color, width: 48, height: 48 }}>
              <Icon />
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
