import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Tooltip,
  CircularProgress,
  styled
} from '@mui/material';
import { Dashboard, Folder, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useGetUserProjectsQuery } from '../../api/projectApi';
import { RootState } from '../../redux/store';
import { ProjectDto } from '../../type/project';

const StyledSidebar = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
}));

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const [openProjects, setOpenProjects] = useState(true);
  const { data: projectsResponse, isLoading } = useGetUserProjectsQuery();
  const user = useSelector((state: RootState) => state.user.user);
  const currentProjectId = useSelector((state: RootState) => state.user.currentProjectId);

  const projects = projectsResponse?.data || [];

  const toggleProjects = useCallback(() => {
    setOpenProjects(prev => !prev);
  }, []);

  const handleProjectSelect = useCallback((projectId: number) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <StyledSidebar sx={{ position: 'sticky', top: 0 }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title="Active">
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'success.main',
                border: 2,
                borderColor: 'background.paper'
              }} />
            </Tooltip>
          }
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto',
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {user?.login?.substring(0, 2).toUpperCase()}
          </Avatar>
        </Badge>
        <Typography variant="h6" mt={2} noWrap>
          {user?.login}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={toggleProjects}>
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={`Projects (${projects.length})`} />
              {openProjects ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openProjects} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {projects.map((project: ProjectDto) => (
                <ListItem 
                  key={project.id} 
                  disablePadding
                  sx={{
                    backgroundColor: project.id === currentProjectId ? 'action.selected' : 'inherit'
                  }}
                >
                  <ListItemButton 
                    onClick={() => handleProjectSelect(project.id)}
                    sx={{
                      pl: 4,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={project.name} 
                      primaryTypographyProps={{
                        fontWeight: project.id === currentProjectId ? 'bold' : 'normal'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </StyledSidebar>
  );
};

export default SideBar;