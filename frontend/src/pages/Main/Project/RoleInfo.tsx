import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { 
  useGetRolesQuery, 
  useAssignRoleMutation, 
  useRemoveRoleMutation 
} from '../../../api/roleAndUserApi';
import DeleteIcon from '@mui/icons-material/Delete';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { ApiErrorResponse } from '../../../type/global';
import { UserRole } from '../../../type/auth_role';

const RoleInfo: React.FC = () => {
  const currentProjectId = useSelector((state: RootState) => state.user.currentProjectId);
  const { enqueueSnackbar } = useSnackbar();
  
  const { 
    data: roles, 
    isLoading, 
    isError,
    isFetching,
    error: rolesError
  } = useGetRolesQuery(currentProjectId, {
    skip: !currentProjectId,
    refetchOnMountOrArgChange: true
  });
  
  const [assignRole, { isLoading: isAssigning, error: assignError }] = useAssignRoleMutation();
  const [removeRole, { isLoading: isRemoving, error: removeError }] = useRemoveRoleMutation();

  // Effect to handle errors from role fetching
  useEffect(() => {
    if (isError && rolesError) {
      const err = rolesError as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Error loading roles', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [isError, rolesError, enqueueSnackbar]);

  // Effect to handle errors from role assignment
  useEffect(() => {
    if (assignError) {
      const err = assignError as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Failed to assign role', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [assignError, enqueueSnackbar]);

  useEffect(() => {
    if (removeError) {
      const err = removeError as ApiErrorResponse;
      enqueueSnackbar(err.data.message || 'Failed to remove role', { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [removeError, enqueueSnackbar]);

  const handleAssignRole = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProjectId) {
      enqueueSnackbar('Please select a project first', { variant: 'warning' });
      return;
    }
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const userId = parseInt(formData.get('userId') as string);
    const role = formData.get('role') as UserRole;
    
    try {
      await assignRole({ 
        userId, 
        role
      }).unwrap();
      (e.target as HTMLFormElement).reset();
      enqueueSnackbar('Role assigned successfully', { variant: 'success' });
    } catch (error) {
      // Error is already handled by the effect above
    }
  }, [assignRole, currentProjectId, enqueueSnackbar]);

  const handleRemoveRole = useCallback(async (userId: number) => {
    if (!currentProjectId) {
      enqueueSnackbar('Please select a project first', { variant: 'warning' });
      return;
    }
    
    try {
      await removeRole({ 
        userId, 
        projectId: currentProjectId 
      }).unwrap();
      enqueueSnackbar('Role removed successfully', { variant: 'success' });
    } catch (error) {
      // Error is already handled by the effect above
    }
  }, [removeRole, currentProjectId, enqueueSnackbar]);

  if (!currentProjectId) {
    return <Alert severity="warning">Please select a project first</Alert>;
  }

  if (isLoading) return <CircularProgress color="primary" />;
  if (isError) return <Alert severity="error">Error loading roles.</Alert>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
          Role Management (Project ID: {currentProjectId})
        </Typography>
        
        <Box mt={3}>
          {roles?.data?.length ? (
            roles.data.map((role) => (
              <Box key={`${role.userId}`} mb={2}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {role.userLogin[0].toUpperCase()}
                    </Avatar>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {role.userLogin}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      User ID: {role.userId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Role: {role.role}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveRole(role.userId)}
                      disabled={isRemoving || isFetching}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No roles assigned for this project
            </Typography>
          )}
        </Box>

        <Typography variant="h5" mt={4} gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Assign New Role
        </Typography>

        <form onSubmit={handleAssignRole}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="userId"
                label="User ID"
                type="number"
                required
                fullWidth
                variant="outlined"
                margin="normal"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Select 
                name="role" 
                fullWidth 
                required 
                defaultValue=""
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Select Role
                </MenuItem>
                {['ADMIN', 'MANAGER', 'EXECUTOR', 'VIEWER'].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isAssigning || isFetching}
                sx={{ mt: 2, borderRadius: '8px', fontWeight: 600 }}
              >
                {isAssigning ? <CircularProgress size={24} /> : 'Assign Role'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleInfo;