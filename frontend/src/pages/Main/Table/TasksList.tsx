import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetRolesQuery } from '../../../api/roleAndUserApi';
import { useGetTagsQuery } from '../../../api/tagApi';
import { Box, Button } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CreateUpdateTaskModal } from '../Task/TaskModel';
import { Task, UserWithTasks, TasksByDate } from '../../../type/task';
import { useLocation, useNavigate } from 'react-router-dom';
import { UnassignedTaskList } from './UnnassignedTaskList';
import { UserTasksColumn } from './TasksColumn';
import { Role } from '../../../type/auth_role';
import { useGetFilteredTasksQuery } from '../../../api/taskApi';
import { useTaskFilters } from '../../../hooks/useTaskFilters';

export const TasksList = () => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const currentProjectId = useSelector((state: RootState) => state.user.currentProjectId);
  const { filters } = useTaskFilters();
  const { data: tasksResponse, isLoading, error } = useGetFilteredTasksQuery(
    { projectId: currentProjectId ?? 0, filters },
    { skip: !currentProjectId }
  );
  const { data: usersResponse } = useGetRolesQuery(currentProjectId ?? 0, { skip: !currentProjectId });
  const { data: tagsResponse } = useGetTagsQuery(currentProjectId ?? 0, { skip: !currentProjectId });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>();
  const taskIdFromUrl = searchParams.get('taskId');

  const tasks = tasksResponse?.data || [];
  const usersData = usersResponse?.data || [];
  const tagData = tagsResponse?.data || [];

  const handleClose = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('taskId');
    navigate({ pathname, search: newSearchParams.toString() });
    setIsModalOpen(false);
    setSelectedTaskId(undefined);
  }, [navigate, pathname, searchParams]);

  useEffect(() => {
    if (taskIdFromUrl) {
      setSelectedTaskId(Number(taskIdFromUrl));
      setIsModalOpen(true);
    }
  }, [taskIdFromUrl]);

  if (!currentProjectId) {
    return <div>No project selected</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks</div>;
  }

  const handleTaskClick = (taskId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('taskId', taskId.toString());
    navigate({ pathname, search: newSearchParams.toString() });
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const userTasksMap = new Map<number, UserWithTasks>();
  tasks.forEach((userTask: UserWithTasks) => {
    if (userTask.id !== undefined) {
      userTasksMap.set(userTask.id, userTask);
    }
  });

  // Create array of users with their tasks
  let usersWithTasks = usersData.map((user: Role) => {
    const userTasks = userTasksMap.get(user.userId) || {
      id: user.userId,
      tasksByDate: [] as TasksByDate[],
    };
    return {
      ...user,
      ...userTasks,
    };
  });

  // Sort users by task count (descending)
  usersWithTasks = usersWithTasks.sort((a, b) => {
    const aTaskCount = a.tasksByDate.reduce((acc, group) => acc + group.tasks.length, 0);
    const bTaskCount = b.tasksByDate.reduce((acc, group) => acc + group.tasks.length, 0);
    return bTaskCount - aTaskCount;
  });

  const unassignedTasks: Task[] = tasks
    .flatMap((userTask: UserWithTasks) => userTask.tasksByDate)
    .flatMap((group: TasksByDate) => group.tasks)
    .filter((task: Task) => !task.executorId);

  const totalSlides = usersWithTasks.length;
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(totalSlides, 3),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(totalSlides, 2) } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box sx={{ 
      padding: '20px', 
      maxWidth: '100%', 
      backgroundColor: '#1e1e1e', 
      borderRadius: '16px', 
      boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)' 
    }}>
      <Button 
        variant="contained"
        onClick={() => {
          setSelectedTaskId(undefined);
          setIsModalOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Create Task
      </Button>

      <UnassignedTaskList 
        unassignedTasks={unassignedTasks} 
        setIsModalOpen={setIsModalOpen} 
        setSelectedTaskId={setSelectedTaskId} 
      />

      {usersWithTasks.length > 0 ? (
        <Slider {...settings}>
          {usersWithTasks.map((user) => (
            <UserTasksColumn
              key={user.userId}
              userName={user.userLogin || 'Unknown User'}
              tasksByDate={user.tasksByDate}
              tagData={tagData}
              onTaskClick={handleTaskClick}
            />
          ))}
        </Slider>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          No tasks assigned to users
        </Box>
      )}

      {currentProjectId && (
        <CreateUpdateTaskModal
          open={isModalOpen}
          onClose={handleClose}
          taskId={selectedTaskId}
          projectId={currentProjectId}
        />
      )}
    </Box>
  );
};