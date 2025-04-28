import { Box, Container, Grid, Typography, Link, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              DRAFT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Project management tool for efficient team collaboration and task tracking.
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Navigation
            </Typography>
            <Box component="nav">
              <Link
                component={RouterLink}
                to="/projects"
                color="text.secondary"
                variant="body2"
                display="block"
                gutterBottom
                sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                Projects
              </Link>
              <Link
                component={RouterLink}
                to="/tasks"
                color="text.secondary"
                variant="body2"
                display="block"
                gutterBottom
                sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                Tasks
              </Link>
              <Link
                component={RouterLink}
                to="/team"
                color="text.secondary"
                variant="body2"
                display="block"
                gutterBottom
                sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                Team
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Legal
            </Typography>
            <Box component="nav">
              <Link
                href="#"
                color="text.secondary"
                variant="body2"
                display="block"
                gutterBottom
                sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                color="text.secondary"
                variant="body2"
                display="block"
                gutterBottom
                sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                Terms of Use
              </Link>
              <Link
                href="#"
                color="text.secondary"
                variant="body2"
                display="block"
                gutterBottom
                sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}
              >
                Cookies
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email: support@draftapp.com
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Phone: +1 (555) 123-4567
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © {currentYear} DRAFT App. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};