import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add';
import NextLink from 'next/link';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actionLabel,
  actionHref,
  onAction,
  actionIcon: ActionIcon = AddIcon,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast) {
              return (
                <Typography key={crumb.label} color="text.primary" variant="body2" fontWeight={500}>
                  {crumb.label}
                </Typography>
              );
            }
            return (
              <Link
                key={crumb.label}
                component={NextLink}
                href={crumb.href}
                underline="hover"
                color="inherit"
                variant="body2"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {(actionLabel && (actionHref || onAction)) && (
          actionHref ? (
            <Button
              component={NextLink}
              href={actionHref}
              variant="contained"
              startIcon={<ActionIcon />}
            >
              {actionLabel}
            </Button>
          ) : (
            <Button variant="contained" startIcon={<ActionIcon />} onClick={onAction}>
              {actionLabel}
            </Button>
          )
        )}
      </Box>
    </Box>
  );
}
