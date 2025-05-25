import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormValues, ShouldDisableFieldFn } from './types';
import { statusOptions, priorityOptions } from './types';
import { Dayjs } from 'dayjs';

interface TaskFormFieldsProps {
  formValues: FormValues;
  errors: Partial<FormValues>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: { target: { name: any; value: any } }) => void;
  handleDateChange: (name: keyof FormValues) => (date: Dayjs | null) => void;
  shouldDisableField: ShouldDisableFieldFn;
  usersData?: any;
  tagData?: any;
  isLoading: boolean;
}

export const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  formValues,
  errors,
  handleChange,
  handleSelectChange,
  handleDateChange,
  shouldDisableField,
  usersData,
  tagData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          margin="normal"
          required
          disabled={shouldDisableField('name')}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          disabled={shouldDisableField('description')}
        />

        <FormControl fullWidth margin="normal" required error={!!errors.priority}>
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={formValues.priority}
            label="Priority"
            onChange={handleSelectChange}
            disabled={shouldDisableField('priority')}
          >
            {priorityOptions.map(priority => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formValues.status}
            label="Status"
            onChange={handleSelectChange}
            disabled={shouldDisableField('status')}
          >
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Executor</InputLabel>
          <Select
            name="executorId"
            value={formValues.executorId ?? ''}
            label="Executor"
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : Number(e.target.value);
              handleSelectChange({ target: { name: 'executorId', value } });
            }}
            disabled={shouldDisableField('executorId')}
          >
            <MenuItem value="">
              <em>Без виконавця</em>
            </MenuItem>
            {usersData?.data.map((user: any) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.userLogin}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Tag</InputLabel>
          <Select
            name="tagId"
            value={formValues.tagId || ''}
            label="Tag"
            onChange={handleSelectChange}
            disabled={shouldDisableField('tagId')}
          >
            {tagData?.data?.map((tag: any) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <DateTimePicker
            label="Start Execution At"
            value={formValues.startExecutionAt}
            onChange={handleDateChange('startExecutionAt')}
            slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
            disabled={shouldDisableField('startExecutionAt')}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <DateTimePicker
            label="End Execution At"
            value={formValues.endExecutionAt}
            onChange={handleDateChange('endExecutionAt')}
            minDateTime={formValues.startExecutionAt || undefined}
            slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
            disabled={shouldDisableField('endExecutionAt')}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};