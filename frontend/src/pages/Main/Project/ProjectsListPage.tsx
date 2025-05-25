import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserProjectsQuery } from '../../../api/projectApi';
import { ProjectDto } from '../../../type/project';
import CreateProjectModal from './CreateProjectModal';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Alert,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { data: projectsResponse, isLoading, isError } = useGetUserProjectsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = projectsResponse?.data || [];
  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress color="primary" />
    </Box>
  );
  
  if (isError) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading projects. Please try again later.
      </Alert>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h1" component="h1">
          My Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{ borderRadius: 2 }}
        >
          Create New Project
        </Button>
      </Box>

      <CreateProjectModal 
        open={isModalOpen} 
        onClose={handleCloseModal}
      />

      {projects.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
          sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 4 }}
        >
          <FolderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Projects Found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            You don't have any projects yet. Create your first project to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
          >
            Create Project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project: ProjectDto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FolderIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" component="h3" noWrap>
                      {project.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description || 'No description provided'}
                  </Typography>
                  
                  <Box mt={3} display="flex" justifyContent="space-between">
                    <Tooltip title="Created date">
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption">
                          {format(new Date(project.createdAt), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    </Tooltip>
                    
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectsListPage;