import { Box, Typography } from '@mui/material';
import { Task, TasksByDate } from '../../../type/task';
import { Tag } from '../../../type/tag';

interface UserTasksColumnProps {
  userName: string;
  tasksByDate: TasksByDate[];
  tagData: Tag[];
  onTaskClick: (taskId: number) => void; // Added onTaskClick as a prop
}

export const UserTasksColumn = ({
  userName,
  tasksByDate,
  tagData,
  onTaskClick, // Destructure the onTaskClick prop
}: UserTasksColumnProps) => {
  const getTagById = (tagId: number): Tag | undefined => tagData.find((t: Tag) => t.id === tagId);

  return (
    <Box sx={{ padding: '10px' }}>
      <Box sx={{ padding: '15px', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#303030', borderBottom: '3px solid #FFD700', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ margin: 0, color: '#fff', fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.5rem' }}>
          {userName}
        </Typography>
      </Box>

      {tasksByDate.map((dateGroup: TasksByDate, idx: number) => {
        if (dateGroup.tasks.length === 0) return null;

        return (
          <Box key={idx} sx={{ marginBottom: '20px', borderBottom: '1px solid #424242', paddingBottom: '15px' }}>
            {dateGroup.date && (
              <Typography variant="subtitle1" sx={{ margin: '10px 0 10px 0', color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem' }}>
                {new Date(dateGroup.date).toLocaleDateString()}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dateGroup.tasks.map((task: Task) => {
                const tag = task.tagId ? getTagById(task.tagId) : null;

                return (
                  <Box
                    key={task.id}
                    onClick={() => onTaskClick(task.id)} // Use the onTaskClick handler
                    sx={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#303030',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': { backgroundColor: '#424242', cursor: 'pointer', transform: 'translateY(-2px)', transition: 'transform 0.2s' }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontSize: '1.7rem' }}>
                      {task.name}
                    </Typography>

                    {tag && (
                      <Box sx={{ marginBottom: '8px' }}>
                        <Box component="span" sx={{
                          border: `1px solid ${tag.color}`,
                          padding: '4px 10px',
                          borderRadius: '4px',
                          color: tag.color,
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          display: 'inline-block',
                          backgroundColor: 'transparent',
                        }}>
                          {tag.name}
                        </Box>
                      </Box>
                    )}

                    <Typography variant="body2" sx={{ color: '#BDBDBD', fontSize: '0.95rem', marginBottom: '4px' }}>
                      Status: {task.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#BDBDBD', fontSize: '0.95rem', marginBottom: '4px' }}>
                      Priority: {task.priority}
                    </Typography>
                    {task.endExecutionAt && (
                      <Typography variant="body2" sx={{ color: '#BDBDBD', fontSize: '0.95rem', marginBottom: '4px' }}>
                        Deadline: {new Date(task.endExecutionAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'HIGH': return '#D32F2F';
    case 'MEDIUM': return '#FFA000';
    case 'LOW': return '#388E3C';
    default: return '#0288D1';
  }
}