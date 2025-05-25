import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { UserRole } from '../../../type/auth_role';
import { ApiErrorResponse } from '../../../type/global';
import dayjs, { Dayjs } from 'dayjs';
import { 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation, 
  useGetTaskByIdQuery, 
  useUpdateFragmentTaskMutation 
} from '../../../api/taskApi';
import { useGetTagsQuery } from '../../../api/tagApi';
import { useGetRolesQuery } from '../../../api/roleAndUserApi';
import { FormValues, TaskFormHandlers } from './types';
import { initialValues } from './types';
import { prepareTaskDto, validateForm } from './utils';

export const useTaskFormHandlers = (
  taskId: number | undefined, 
  projectId: number, 
  onClose: () => void
): [FormValues, React.Dispatch<React.SetStateAction<FormValues>>, Partial<FormValues>, TaskFormHandlers] => {
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const userRole = useSelector((state: RootState) => state.user.user?.role);

  // API hooks with proper error typing
  const { 
    data: taskResponse, 
    isFetching: isTaskLoading, 
    error: taskError 
  } = useGetTaskByIdQuery(taskId ?? 0, {
    skip: !taskId,
    refetchOnMountOrArgChange: true,
  });
  
  const { 
    data: usersResponse, 
    error: usersError 
  } = useGetRolesQuery(projectId, { skip: !projectId });
  
  const { 
    data: tagsResponse, 
    error: tagsError 
  } = useGetTagsQuery(projectId, { skip: !projectId });
  
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [updateFragmentTask] = useUpdateFragmentTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Error handling with proper type checking
  const handleApiError = useCallback((error: unknown) => {
    const apiError = error as ApiErrorResponse;
    const errorMessage = apiError?.data?.message || 'Operation failed';
    enqueueSnackbar(errorMessage, { variant: 'error' });
    return errorMessage;
  }, [enqueueSnackbar]);

  useEffect(() => {
    const error = taskError || usersError || tagsError;
    if (error) {
      handleApiError(error);
      onClose();
    }
  }, [taskError, usersError, tagsError, handleApiError, onClose]);

  // Initialize form values with proper null checks
  useEffect(() => {
    if (taskResponse?.data && taskId && !isTaskLoading) {
      const taskData = taskResponse.data;
      setFormValues({
        name: taskData.name,
        description: taskData.description || '',
        priority: taskData.priority,
        tagId: taskData.tagId || undefined,
        status: taskData.status || 'New',
        executorId: taskData.executorId || undefined,
        startExecutionAt: taskData.startExecutionAt ? dayjs(taskData.startExecutionAt) : null,
        endExecutionAt: taskData.endExecutionAt ? dayjs(taskData.endExecutionAt) : null,
      });
    } else if (!taskId) {
      setFormValues(initialValues);
    }
  }, [taskResponse, taskId, isTaskLoading]);

  const validate = useCallback((): boolean => {
    const newErrors = validateForm(formValues);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValues]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((name: keyof FormValues) => (date: Dayjs | null) => {
    setFormValues(prev => ({ ...prev, [name]: date }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validate() || !projectId) return;

    try {
      const baseTaskDto = prepareTaskDto(formValues);
      const fullTaskDto = { ...baseTaskDto, projectId };

      if (taskId) {
        const operation = userRole === UserRole.EXECUTOR ? updateFragmentTask : updateTask;
        await operation({ 
          taskId, 
          taskDto: { ...fullTaskDto, id: taskId } 
        }).unwrap();
        enqueueSnackbar('Task updated successfully', { variant: 'success' });
      } else {
        await createTask(fullTaskDto).unwrap();
        enqueueSnackbar('Task created successfully', { variant: 'success' });
      }
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  }, [
    validate, 
    projectId, 
    formValues, 
    taskId, 
    userRole, 
    updateFragmentTask, 
    updateTask, 
    createTask, 
    onClose, 
    enqueueSnackbar, 
    handleApiError
  ]);

  const handleDelete = useCallback(async () => {
    if (!taskId) return;

    try {
      await deleteTask({ taskId, projectId }).unwrap();
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  }, [taskId, projectId, deleteTask, onClose, enqueueSnackbar, handleApiError]);

  const shouldDisableField = useCallback((fieldName: keyof FormValues): boolean => {
    if (userRole === UserRole.VIEWER) return true;
    if (userRole === UserRole.EXECUTOR) {
      const editableFields: (keyof FormValues)[] = ['status', 'priority', 'tagId', 'executorId'];
      return !editableFields.includes(fieldName);
    }
    return false;
  }, [userRole]);

  const shouldHideButton = useCallback((buttonType: 'delete' | 'submit' | 'cancel'): boolean => {
    if (userRole === UserRole.VIEWER) return true;
    if (userRole === UserRole.EXECUTOR && buttonType === 'delete') return true;
    return false;
  }, [userRole]);

  return [
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
  ];
};