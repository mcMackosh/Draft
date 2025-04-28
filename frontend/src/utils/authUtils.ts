// src/utils/authUtils.ts
// export const saveTokens = (accessToken: string, refreshToken: string) => {
//   localStorage.setItem('access_token', accessToken);

//   const cookieOptions = `path=/; secure; samesite=strict`;
//   document.cookie = `refresh_token=${refreshToken}; ${cookieOptions}`;
// };

export const saveTokens = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  const pastDate = new Date(0).toUTCString();
  const cookieOptions = `path=/; expires=${pastDate}; secure; samesite=strict`;
  document.cookie = `refresh_token=; ${cookieOptions}`;
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  const match = document.cookie.match('(^| )refresh_token=([^;]+)');
  return match ? match[2] : null;
};