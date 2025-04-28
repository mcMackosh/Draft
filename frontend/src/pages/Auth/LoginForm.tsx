import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import { saveTokens } from '../../utils/authUtils';
import { useSnackbar } from 'notistack'; // Для сповіщень
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { ApiErrorResponse } from '../../type/global';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const { enqueueSnackbar } = useSnackbar(); // Хук для сповіщень

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(clearUser())
      const response = await login({ email, password }).unwrap();
      console.log(response.data.access_token, response.data.refresh_token)
      if (response.success) {
        
        saveTokens(response.data.access_token);
        dispatch(setUser(response.data.user));
        
        navigate('/projects');
      }
    } catch (err) {
      console.error('Login failed:', err);
      const apiError = err as ApiErrorResponse
      enqueueSnackbar(apiError.data.message || 'Login failed. Please try again.', {
        variant: 'error', // Тип сповіщення (помилка)
      });
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.main', // Золотистий колір рамки
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main', // Золотистий колір рамки при наведенні
                },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary', // Колір тексту лейбла
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.main', // Золотистий колір рамки
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main', // Золотистий колір рамки при наведенні
                },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary', // Колір тексту лейбла
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          Don't have an account?{' '}
          <MuiLink
            component={Link}
            to="/registration"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Register
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginForm;