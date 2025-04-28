import { FormValues } from './types';
// Removed unused import of Omit from '@mui/material'
import { TaskUpdateDto } from '../../../type/task';
import dayjs, { Dayjs } from 'dayjs';

export const prepareTaskDto = (values: FormValues): Omit<TaskUpdateDto, 'id'> => {
  return {
    name: values.name,
    description: values.description || undefined,
    priority: values.priority,
    tagId: values.tagId,
    status: values.status,
    executorId: values.executorId,
    startExecutionAt: values.startExecutionAt ? values.startExecutionAt.toISOString() : undefined,
    endExecutionAt: values.endExecutionAt ? values.endExecutionAt.toISOString() : undefined,
  };
};

export const validateForm = (formValues: FormValues): Partial<FormValues> => {
  const newErrors: Partial<FormValues> = {};
  if (!formValues.name.trim()) newErrors.name = 'Task name is required';
  if (!formValues.priority) newErrors.priority = 'Priority is required';
  if (!formValues.status) newErrors.status = 'Status is required';
  return newErrors;
};