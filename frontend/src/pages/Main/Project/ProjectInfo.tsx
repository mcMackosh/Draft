import React, { useCallback, useEffect, useState } from 'react';
import { 
  useGetProjectQuery, 
  useUpdateProjectMutation, 
  useDeleteProjectMutation 
} from '../../../api/projectApi';
import { UpdateProjectDto } from '../../../type/project';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { 
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ApiErrorResponse } from '../../../type/global';

interface ProjectInfoProps {
  projectId: number;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProjectDto>({
    name: '',
    description: '',
  });

  const { 
    data: projectResponse, 
    isLoading, 
    isError,
    error: projectError
  } = useGetProjectQuery(projectId);

  const [updateProject, { 
    isLoading: isUpdating, 
    error: updateError 
  }] = useUpdateProjectMutation();

  const [deleteProject, { 
    isLoading: isDeleting, 
    error: deleteError 
  }] = useDeleteProjectMutation();

  useEffect(() => {
    if (isError && projectError) {
      const err = projectError as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Error loading project', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [isError, projectError, enqueueSnackbar]);

  useEffect(() => {
    if (updateError) {
      const err = updateError as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Failed to update project', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [updateError, enqueueSnackbar]);

  useEffect(() => {
    if (deleteError) {
      const err = deleteError as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Failed to delete project', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [deleteError, enqueueSnackbar]);

  useEffect(() => {
    if (projectResponse?.data) {
      setFormData({
        name: projectResponse.data.name,
        description: projectResponse.data.description || '',
      });
    }
  }, [projectResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = useCallback(async () => {
    try {
      await updateProject({ 
        id: projectId, 
        data: formData 
      }).unwrap();
      setIsEditing(false);
      enqueueSnackbar('Project updated successfully', { variant: 'success' });
    } catch (error) {
      const err = error as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Error loading roles', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [updateProject, projectId, formData, enqueueSnackbar]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId).unwrap();
        enqueueSnackbar('Project deleted successfully', { variant: 'success' });
        navigate('/projects');
      } catch (error) {
      }
    }
  }, [deleteProject, projectId, navigate, enqueueSnackbar]);

  if (isLoading) return <CircularProgress color="primary" />;
  if (isError) return <Alert severity="error">Error loading project information</Alert>;
  if (!projectResponse?.data) return null;

  const project = projectResponse.data;

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
              Edit Project
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Project Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={!formData.name || isUpdating}
                    sx={{ borderRadius: '8px', fontWeight: 600 }}
                  >
                    {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                    sx={{ borderRadius: '8px', fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                {project.name}
              </Typography>
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" paragraph>
              {project.description || 'No description provided'}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Last updated: {new Date(project.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;