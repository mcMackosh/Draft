// src/api/authApi.ts
import {
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from '@reduxjs/toolkit/query/react';
import { getAccessToken, saveTokens } from '../../utils/authUtils';
import { LoginResponse } from '../../type/auth_role';
import { navigate } from '../../utils/navigation';

  const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5000/api/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `bearer ${token}`);
      }
      return headers;
    },
  });

  const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
  ) => {
    let result = await baseQuery(args, api, extraOptions);
  
    if (result.error?.status === 401) {
  
      const refreshResult = await baseQuery(
        {
          url: `auth/refresh`,
          method: 'POST',
        },
        api,
        extraOptions
      ) as { data?: LoginResponse, error?: FetchBaseQueryError };
  
      if (refreshResult.error) {
        api.dispatch({ type: 'user/clearUser' });
        return { error: refreshResult.error }; // Повертаємо помилку, якщо оновлення токенів не вдалося
      }
  
      if (refreshResult.data) {
        const { access_token } = refreshResult.data.data;
        saveTokens(access_token);
        console.log('Токени оновлено:', refreshResult);
        
        if (refreshResult.data.message === "Tokens refreshed successfully: without ProjectId") {
          navigate('/projects');
        }
  
        // Повторно відправляємо початковий запит з новим токеном
        result = await baseQuery(args, api, extraOptions);
      }
    }
  
    return result;
  };

  export default baseQueryWithReauth;
