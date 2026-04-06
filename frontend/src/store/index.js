import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './authSlice';
import chatroomReducer from './chatroomSlice';

export default configureStore({
  reducer: {
    auth:     authReducer,
    chatroom: chatroomReducer,
  },
});
