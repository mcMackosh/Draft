import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useRegistrationMutation, useVerifyMutation } from '../../api/authApi';
import { setUser, clearUser } from '../../redux/userSlice';
import { saveTokens } from '../../utils/authUtils';
import { useSnackbar } from 'notistack';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { RootState } from '../../redux/store'; // Імпортуємо RootState
import { ApiErrorResponse } from '../../type/global';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const user = useSelector((state: RootState) => state.user.user); // Отримуємо користувача з Redux
  const isUserRegisteredButNotVerified = user && !user.isVerified; // Перевіряємо статус верифікації

  const [register, { isLoading: isRegistering }] = useRegistrationMutation();
  const [verify, { isLoading: isVerifying }] = useVerifyMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(clearUser());
      const response = await register({ login, email, password }).unwrap();
      if (response.success) {
        dispatch(setUser(response.data));
        enqueueSnackbar('Registration successful! Please check your email for the verification code.', {
          variant: 'success',
        });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const apiError = err as ApiErrorResponse;
      enqueueSnackbar(apiError.data.message || 'Registration failed. Please try again.', {
        variant: 'error',
      });
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verify({ email: user ? user.email : "" , code: verificationCode }).unwrap();
      if (response.success) {
        saveTokens(response.data.access_token);
        dispatch(setUser(response.data.user));
        navigate('/projects');
        enqueueSnackbar('Verification successful! Welcome!', {
          variant: 'success',
        });
      }
    } catch (err) {
      console.error('Verification failed:', err);
      const apiError = err as ApiErrorResponse;
      enqueueSnackbar(apiError.data.message || 'Verification failed. Please try again.', {
        variant: 'error',
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
          {isUserRegisteredButNotVerified ? 'Verify Email' : 'Register'}
        </Typography>
        {!isUserRegisteredButNotVerified ? (
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="login"
              label="Login"
              name="login"
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isRegistering}
              sx={{ mt: 3, mb: 2 }}
            >
              {isRegistering ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Verification Code"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isVerifying}
              sx={{ mt: 3, mb: 2 }}
            >
              {isVerifying ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </form>
        )}
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          Already have an account?{' '}
          <MuiLink
            component={Link}
            to="/login"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Login
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegistrationForm;