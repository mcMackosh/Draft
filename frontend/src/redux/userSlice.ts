import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { UserDTO } from '../type/auth_role'; // Імпортуємо UserDTO
import { authApi } from '../api/authApi'; // Імпортуємо authApi
import Cookies from 'js-cookie'; // Для роботи з cookies

// Початковий стан слайсу
interface UserState {
  user: UserDTO | null;
  currentProjectId: number | null;
}

// Початковий стан
const initialState: UserState = {
  user: null,
  currentProjectId: null
};

// Створення слайсу
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDTO>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.currentProjectId = null;

    },
    setCurrentProjectId: (state, action: PayloadAction<number | null>) => {
      state.currentProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { user } = action.payload.data;
        state.user = user;
      }
    );
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.currentProjectId = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.refresh.matchFulfilled,
      (state, action) => {
        const { user } = action.payload.data;
        state.user = user;
      }
    );
  },
});

export const { setUser, clearUser, setCurrentProjectId } = userSlice.actions;
export default userSlice.reducer;