import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetTaskByIdQuery} from '../../../api/taskApi';
import { useGetTagsQuery } from '../../../api/tagApi';
import { useGetRolesQuery } from '../../../api/roleAndUserApi';
import { TaskFormFields } from './TaskFormFields';
import { useTaskFormHandlers } from './useTaskFormHandlers';
import { CreateUpdateTaskModalProps } from './types';

export const CreateUpdateTaskModal: React.FC<CreateUpdateTaskModalProps> = ({ 
  open, 
  onClose, 
  taskId, 
  projectId 
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const userRole = useSelector((state: RootState) => state.user.user?.role);
  
  const { data: usersData, isFetching: isUsersLoading } = useGetRolesQuery(projectId);
  const { data: tagData, isFetching: isTagsLoading } = useGetTagsQuery(projectId);
  const { isFetching: isTaskLoading } = useGetTaskByIdQuery(taskId ?? 0, {
    skip: !taskId,
    refetchOnMountOrArgChange: true,
  });

  const isLoading = isTaskLoading || isUsersLoading || isTagsLoading;
  
  const [
    formValues, 
    setFormValues, 
    errors, 
    {
      handleChange,
      handleSelectChange,
      handleDateChange,
      handleSubmit,
      handleDelete,
      shouldDisableField,
      shouldHideButton
    }
  ] = useTaskFormHandlers(taskId, projectId, onClose);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{taskId ? 'Update Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <TaskFormFields
          formValues={formValues}
          errors={errors}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleDateChange={handleDateChange}
          shouldDisableField={shouldDisableField}
          usersData={usersData}
          tagData={tagData}
          isLoading={isLoading}
        />
      </DialogContent>
      <DialogActions>
        {taskId && !shouldHideButton('delete') && (
          <Button color="error" onClick={handleDelete} disabled={isLoading}>
            Delete
          </Button>
        )}
        {!shouldHideButton('cancel') && (
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        )}
        {!shouldHideButton('submit') && (
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {taskId ? 'Update' : 'Create'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};