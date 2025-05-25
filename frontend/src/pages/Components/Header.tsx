import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resetStore, RootState } from './../../redux/store';
import { useLogoutMutation } from '../../api/authApi';
import logo from '../../static/logo.png';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearTokens } from '../../utils/authUtils';

export const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user);
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      clearTokens();
      resetStore();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Role color mapping
  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'primary';
      case 'MANAGER': return 'secondary';
      case 'EXECUTOR': return 'success';
      case 'VIEWER': return 'info';
      default: return 'default';
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'background.default', boxShadow: 3 }}>
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '40px', marginRight: '1px' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            DRAFT
          </Typography>
        </Stack>
  
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              alt={user.user?.login}
              src="/static/images/avatar/default.png"
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            />
            <Stack direction="column">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: theme.palette.text.primary
                }}
              >
                {user.user?.login || ''}
              </Typography>
              {user.user?.role && (
                <Chip
                  label={user.user.role}
                  size="small"
                  color={getRoleColor(user.user.role)}
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                />
              )}
            </Stack>
          </Box>
  
          <IconButton
            color="inherit"
            onClick={logoutHandler}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
  
};