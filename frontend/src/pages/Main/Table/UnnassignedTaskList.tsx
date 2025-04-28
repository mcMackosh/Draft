import { Box, Typography } from '@mui/material';
import { Task } from '../../../type/task';

interface UnassignedTaskListProps {
  unassignedTasks: Task[];
  setIsModalOpen: (open: boolean) => void;
  setSelectedTaskId: (id: number | undefined) => void;
}

export const UnassignedTaskList = ({ unassignedTasks, setIsModalOpen, setSelectedTaskId }: UnassignedTaskListProps) => {
  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: '#252525', borderRadius: '8px', borderLeft: '4px solid #FFA500', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ color: '#FFA500', fontWeight: 'bold', mr: 1 }}>
          Unassigned Tasks
        </Typography>
        <Box sx={{ backgroundColor: '#FFA500', color: '#000', borderRadius: '12px', px: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
          {unassignedTasks.length}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '150px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#FFA500', borderRadius: '3px' } }}>
        {unassignedTasks.map((task: Task) => (
          <Box
            key={task.id}
            onClick={() => {
              setSelectedTaskId(task.id);
              setIsModalOpen(true);
            }}
            sx={{
              p: 1.5,
              borderRadius: '6px',
              backgroundColor: '#303030',
              borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
              minWidth: '220px',
              flex: '1 1 auto',
              '&:hover': { backgroundColor: '#383838', cursor: 'pointer', transform: 'translateY(-2px)', transition: 'transform 0.2s' }
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.5 }}>
              {task.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#BDBDBD', backgroundColor: '#252525', px: 1, borderRadius: '4px' }}>
                {task.priority}
              </Typography>
              {task.endExecutionAt && (
                <Typography variant="caption" sx={{ color: '#BDBDBD' }}>
                  {new Date(task.endExecutionAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
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
