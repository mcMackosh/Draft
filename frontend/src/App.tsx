import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {RootState } from './redux/store';
import { setUser, clearUser, setCurrentProjectId } from './redux/userSlice';
import LoginForm from './pages/Auth/LoginForm';
import ProjectPage from './pages/Main/Project/ProjectPage';
import RegistrationForm from './pages/Auth/RegistrationForm';
import { clearTokens } from './utils/authUtils';
import { useGetUserQuery } from './api/authApi';
import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import SideBar from './pages/Components/SideBar';
import ProjectsListPage from './pages/Main/Project/ProjectsListPage';
import { Header } from './pages/Components/Header';
import { Footer } from './pages/Components/Footer';
import { setNavigator } from './utils/navigation';



const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { data: userData, error, isLoading } = useGetUserQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData.data));
      if (userData?.data?.currentProjectId) {
        dispatch(setCurrentProjectId(userData.data.currentProjectId));
      }
      setLoading(false);
    } else if (error) {
      clearTokens();
      dispatch(clearUser());
      setLoading(false);
    }
  }, [userData, error, dispatch]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex">
      {user.user ?
        <>
        <SideBar/>
        <Routes>
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes> 
        </>
        :
        <Routes>
         <Route path="/login" element={<LoginForm />} />
         <Route path="/registration" element={<RegistrationForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      }
    </Box>
  );
};

const AppWrapper = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      <Header />
      <App />
      <Footer/>
    </SnackbarProvider>
  );
};

// Огортаємо BrowserRouter на вищому рівні
const Root = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default Root;