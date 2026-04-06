import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('chatToken');
const user  = JSON.parse(localStorage.getItem('chatUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token:           token || null,
    user:            user  || null,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token           = token;
      state.user            = user;
      state.isAuthenticated = true;
      localStorage.setItem('chatToken', token);
      localStorage.setItem('chatUser', JSON.stringify(user));
    },
    logout: (state) => {
      state.token           = null;
      state.user            = null;
      state.isAuthenticated = false;
      localStorage.removeItem('chatToken');
      localStorage.removeItem('chatUser');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
