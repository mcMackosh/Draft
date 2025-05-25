import React, { useState } from 'react';
import { useCreateProjectMutation } from '../../../api/projectApi';
import { Box, TextField, Button, Typography, CircularProgress, Modal } from '@mui/material';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleCreateProject = async () => {
    if (!name.trim() || !description.trim()) return;
    try {
      await createProject({ name, description }).unwrap();
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Box width="100%" maxWidth={600} p={4} boxShadow={3} borderRadius={4} bgcolor="background.paper">
          <Typography variant="h3" gutterBottom>Create New Project</Typography>

          <TextField
            label="Project Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Project Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* {isError && (
            <Typography color="error" mt={2}>{error?.data?.message || 'Failed to create project.'}</Typography>
          )} */}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProject}
              disabled={isLoading || !name.trim() || !description.trim()}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Project'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;