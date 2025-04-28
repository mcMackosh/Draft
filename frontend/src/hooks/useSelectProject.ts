import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRefreshMutation } from '../api/authApi';
import { setCurrentProjectId } from '../redux/userSlice';
import { saveTokens } from '../utils/authUtils';


export const useSelectProject = () => {
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  const selectProject = async (projectId: number) => {
    try {
      dispatch(setCurrentProjectId(projectId));
      const response = await refresh(projectId).unwrap();
      const { access_token, refresh_token } = response.data;
      saveTokens(access_token);
    } catch (error) {
      console.error('Error refreshing tokens', error);
    }
  };

  return { selectProject };
};