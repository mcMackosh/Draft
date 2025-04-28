import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { projectApi } from '../api/projectApi';
import usersReducer from '../redux/userSlice';
import { roleAndUserApi } from '../api/roleAndUserApi';
import { tagApi } from '../api/tagApi';
import { taskApi } from '../api/taskApi';

const appReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [roleAndUserApi.reducerPath]: roleAndUserApi.reducer,
  [tagApi.reducerPath]: tagApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  user: usersReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STATE') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      projectApi.middleware,
      roleAndUserApi.middleware,
      tagApi.middleware,
      taskApi.middleware
    ),
});

export const resetStore = () => {
  store.dispatch({ type: 'RESET_STATE' });
  store.dispatch(authApi.util.resetApiState());
  store.dispatch(projectApi.util.resetApiState());
  store.dispatch(roleAndUserApi.util.resetApiState());
  store.dispatch(tagApi.util.resetApiState());
  store.dispatch(taskApi.util.resetApiState());
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;