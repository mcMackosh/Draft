import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetRolesQuery } from '../../../api/roleAndUserApi';
import { defaultFilters, useTaskFilters } from '../../../hooks/useTaskFilters';
import { useGetTagsQuery } from '../../../api/tagApi';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { TaskFilterRequest } from '../../../type/task';
import { useLazyGetFilteredTasksQuery } from '../../../api/taskApi';

const statusOptions = [
  'New', 'In Progress', 'Pending Review', 'Completed', 'Blocked',
  'On Hold', 'Cancelled', 'Testing', 'Ready for Deployment', 'Reopened'
];

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

export const TaskFilters = () => {
  const theme = useTheme();
  const currentProjectId = useSelector((state: RootState) => state.user.currentProjectId);
  const { data: usersData } = useGetRolesQuery(currentProjectId);
  const { data: tagData } = useGetTagsQuery(currentProjectId ?? 0);
  const [fetchTasks] = useLazyGetFilteredTasksQuery();
  
  const {
    filters,
    appliedFilters,
    updateFilter,
    resetFilters,
    applyFilters
  } = useTaskFilters();

  const handleSelectChange = (field: keyof TaskFilterRequest) => (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value as string[];
  
    if (field === 'TagIds' || field === 'ExecutorIds') {
      updateFilter(field, value.map(val => Number(val)));
    } else if (field === 'Statuses' || field === 'Priorities') {
      updateFilter(field, value);
    }
  };

  const handleInputChange = (field: keyof TaskFilterRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter(field, e.target.value || '');
  };

  const handleDateChange = (field: 'DeadlineDateStart' | 'DeadlineDateEnd') => (date: Date | null) => {
    updateFilter(field, date ? date.toISOString().split('T')[0] : '');
  };

  const handleApply = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) =>
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      )
    ) as TaskFilterRequest;

    applyFilters();
    fetchTasks({ projectId: currentProjectId || 0, filters: appliedFilters });
  };

  const tags = Array.isArray(tagData?.data) ? tagData?.data : [];

  const handleReset = () => {
    resetFilters();
    fetchTasks({ projectId: currentProjectId || 0, filters: defaultFilters });
  };

  const deadlineStartDate = filters.DeadlineDateStart ? new Date(filters.DeadlineDateStart) : null;
  const deadlineEndDate = filters.DeadlineDateEnd ? new Date(filters.DeadlineDateEnd) : null;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        p: 3,
        borderRadius: '16px',
        boxShadow: theme.shadows[2],
        mb: 3
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Task Filters
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          mb: 3
        }}
      >
        <FormControl fullWidth>
          <TextField
            label="Search"
            variant="outlined"
            value={filters.SearchQuery || ''}
            onChange={handleInputChange('SearchQuery')}
            placeholder="Search tasks..."
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="executors-label">Executor</InputLabel>
          <Select
            labelId="executors-label"
            multiple
            value={filters.ExecutorIds?.map(id => id.toString()) || []}
            onChange={handleSelectChange('ExecutorIds')}
            label="Executor"
          >
            {usersData?.data.map(user => (
              <MenuItem key={user.userId} value={user.userId.toString()}>
                {user.userLogin}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="tags-label">Tag</InputLabel>
          <Select
            labelId="tags-label"
            multiple
            value={filters.TagIds?.map(id => id.toString()) || []}
            onChange={handleSelectChange('TagIds')}
            label="Tag"
          >
            {tags?.map(tag => (
              <MenuItem key={tag.id} value={tag.id.toString()}>
                <Box sx={{ width: '100%', color: tag.color, fontWeight: 500 }}>
                  {tag.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="statuses-label">Status</InputLabel>
          <Select
            labelId="statuses-label"
            multiple
            value={filters.Statuses || []}
            onChange={handleSelectChange('Statuses')}
            label="Status"
          >
            {statusOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="priorities-label">Priority</InputLabel>
          <Select
            labelId="priorities-label"
            multiple
            value={filters.Priorities || []}
            onChange={handleSelectChange('Priorities')}
            label="Priority"
          >
            {priorityOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="sort-label">Sort by Deadline</InputLabel>
          <Select
            labelId="sort-label"
            value={filters.SortByDeadline || 'desc'}
            onChange={(e) => updateFilter('SortByDeadline', e.target.value as 'asc' | 'desc')}
            label="Sort by Deadline"
          >
            <MenuItem value="desc">Descending (newest first)</MenuItem>
            <MenuItem value="asc">Ascending (oldest first)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={() => {
            handleReset(); // Скидаємо фільтри
          }}
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.primary.main,
            }
          }}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          onClick={handleApply} 
          sx={{
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};