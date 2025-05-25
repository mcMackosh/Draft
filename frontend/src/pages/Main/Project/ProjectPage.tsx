import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshMutation } from '../../../api/authApi';
import { useLazyGetProjectQuery } from '../../../api/projectApi';
import { setCurrentProjectId } from '../../../redux/userSlice';
import { saveTokens } from '../../../utils/authUtils';
import ProjectInfo from './ProjectInfo';
import RoleInfo from './RoleInfo';
import TagInfo from './TagInfo';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Grid
} from '@mui/material';
import { TasksList } from '../Table/TasksList';
import { RootState } from '../../../redux/store';
import { TaskFilters } from '../Table/TaskFilters';
import { ApiErrorResponse } from '../../../type/global';
import { useSnackbar } from 'notistack';

const ProjectPage = () => {
  const currentProjectId = useSelector((state: RootState) => state.user.currentProjectId);
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh] = useRefreshMutation();
  const [fetchProject, { data: projectData, isLoading }] = useLazyGetProjectQuery();
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initializeProject = async () => {
      if (!projectId || isNaN(Number(projectId))) {
        navigate('/projects');
        return;
      }
      const id = Number(projectId);
      try {
        const { data: tokens } = await refresh(id).unwrap();
        saveTokens(tokens.access_token);
        dispatch(setCurrentProjectId(id));
        await fetchProject(id).unwrap();
      } catch (err) {
        console.error('Project initialization failed:', err);
        const error = err as ApiErrorResponse;
        enqueueSnackbar(error.data.message || 'Error loading roles', {
          variant: 'error',
          autoHideDuration: 5000,
        });
        setInitializationError('Failed to load project');
        navigate('/projects');
      }
    };
    initializeProject();
    return () => {
      dispatch(setCurrentProjectId(null));
    };
  }, [projectId, dispatch, refresh, navigate, fetchProject]);

  if (initializationError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => navigate('/projects')}>
            Back to projects
          </Button>
        }>
          {initializationError}
        </Alert>
      </Container>
    );
  }

  if (isLoading || !projectData) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ width: '90%' }}>
      <Button
        onClick={() => navigate('/projects')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        ← Back to Projects
      </Button>
      <ProjectInfo projectId={Number(projectId)} />

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8} lg={9}>
          {currentProjectId && (
            <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 1 }}>
              <Typography variant="h5" component="h2" sx={{ color: 'primary.main', mb: 2 }}>
                Tasks
              </Typography>
              <TaskFilters />
              <TasksList />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 1, mb: 3 }}>
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 2 }}>Roles</Typography>
            <RoleInfo />
          </Box>
          <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 1 }}>
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 2 }}>Tags</Typography>
            <TagInfo />
          </Box>
        </Grid>
      </Grid>
    </Container>

  );
};

export default ProjectPage;