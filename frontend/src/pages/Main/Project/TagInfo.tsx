import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from '../../../api/tagApi';
import { Tag, CreateTagDto, UpdateTagDto } from '../../../type/tag';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ApiErrorResponse } from '../../../type/global';

const TagInfo: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const currentProjectId = useSelector((state: RootState) => state.user.currentProjectId);
  
  const { 
    data: tagsResponse, 
    isLoading, 
    isError,
    isFetching,
    error: tagsError
  } = useGetTagsQuery(currentProjectId ?? 0, {
    skip: !currentProjectId,
    refetchOnMountOrArgChange: true
  });

  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const [newTag, setNewTag] = useState<CreateTagDto>({ name: '', color: '#FFD700' });
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagData, setEditTagData] = useState<UpdateTagDto>({ name: '', color: '#FFD700' });

  const tags = (tagsResponse?.data && Array.isArray(tagsResponse.data)) 
    ? tagsResponse.data 
    : [];

  const handleCreateTag = useCallback(async () => {
    if (!currentProjectId || !newTag.name) return;
    
    try {
      await createTag({
        ...newTag
      }).unwrap();
      setNewTag({ name: '', color: '#FFD700' });
      enqueueSnackbar('Tag created successfully', { variant: 'success' });
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      enqueueSnackbar(
        apiError.data?.message || 'Failed to create tag',
        { variant: 'error' }
      );
    }
  }, [createTag, currentProjectId, newTag, enqueueSnackbar]);

  const handleUpdateTag = useCallback(async () => {
    if (!editingTag || !currentProjectId || !editTagData.name) return;
    
    try {
      await updateTag({ 
        tagId: editingTag.id, 
        tagDto: editTagData 
      }).unwrap();
      setEditingTag(null);
      enqueueSnackbar('Tag updated successfully', { variant: 'success' });
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      enqueueSnackbar(
        apiError.data?.message || 'Failed to update tag',
        { variant: 'error' }
      );
    }
  }, [updateTag, editingTag, editTagData, currentProjectId, enqueueSnackbar]);

  const handleDeleteTag = useCallback(async (tagId: number) => {
    if (!currentProjectId) return;
    
    try {
      await deleteTag(tagId).unwrap();
      enqueueSnackbar('Tag deleted successfully', { variant: 'success' });
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      enqueueSnackbar(
        apiError.data?.message || 'Failed to delete tag',
        { variant: 'error' }
      );
    }
  }, [deleteTag, currentProjectId, enqueueSnackbar]);

  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagData({ name: tag.name, color: tag.color });
  };

  const cancelEditing = () => {
    setEditingTag(null);
  };

  if (!currentProjectId) {
    return <Alert severity="warning">Please select a project first</Alert>;
  }

  if (isLoading) return <CircularProgress color="primary" />;
  if (isError) {
    const error = tagsError as ApiErrorResponse;
    return (
      <Alert severity="error">
        {error.data?.message || 'Error loading tags'}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
          Tags Management (Project ID: {currentProjectId})
        </Typography>

        {/* Create Tag Form */}
        <Box mt={3} mb={4}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Create New Tag
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tag Name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                variant="outlined"
                disabled={isFetching}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Tag Color"
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ColorLensIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                disabled={isFetching}
              />
            </Grid>
            <Grid item xs={4} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCreateTag}
                disabled={!newTag.name || isCreating || isFetching}
                sx={{ height: '56px' }}
              >
                {isCreating ? <CircularProgress size={24} /> : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Edit Tag Form */}
        {editingTag && (
          <Box mb={4} p={2} sx={{ backgroundColor: 'background.paper', borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Edit Tag: {editingTag.name}
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tag Name"
                  value={editTagData.name}
                  onChange={(e) => setEditTagData({ ...editTagData, name: e.target.value })}
                  variant="outlined"
                  disabled={isFetching}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Tag Color"
                  type="color"
                  value={editTagData.color}
                  onChange={(e) => setEditTagData({ ...editTagData, color: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ColorLensIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  disabled={isFetching}
                />
              </Grid>
              <Grid item xs={2} sm={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateTag}
                  disabled={!editTagData.name || isUpdating || isFetching}
                  sx={{ height: '56px' }}
                >
                  {isUpdating ? <CircularProgress size={24} /> : <CheckIcon />}
                </Button>
              </Grid>
              <Grid item xs={2} sm={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={cancelEditing}
                  disabled={isFetching}
                  sx={{ height: '56px' }}
                >
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tags List */}
        <Box mt={3}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Existing Tags ({tags.length})
          </Typography>
          {tags.length === 0 ? (
            <Alert severity="info">No tags created yet</Alert>
          ) : (
            <Grid container spacing={2}>
              {tags.map((tag: Tag) => (
                <Grid item xs={12} key={tag.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: 'background.paper',
                      borderRadius: '8px',
                      border: `2px solid ${tag.color}`,
                      boxShadow: `0 0 8px ${tag.color}33`,
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Chip
                        label={tag.name}
                        sx={{
                          backgroundColor: tag.color,
                          color: getContrastTextColor(tag.color),
                          fontWeight: 600,
                          fontSize: '1rem',
                          px: 2,
                          py: 1,
                          mr: 2,
                        }}
                      />
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: tag.color,
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => startEditing(tag)}
                        disabled={isFetching}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteTag(tag.id)}
                        disabled={isDeleting || isFetching}
                      >
                        {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};


function getContrastTextColor(hexColor: string): string {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export default TagInfo;