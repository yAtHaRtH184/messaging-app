import { createSlice } from '@reduxjs/toolkit';

const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState: {
    rooms:       [],
    currentRoom: null,
    messages:    [],
    page:        0,
    hasMore:     true,
    typingUsers: [],
  },
  reducers: {
    setRooms:        (state, action) => { state.rooms       = action.payload; },
    setCurrentRoom:  (state, action) => {
      state.currentRoom = action.payload;
      state.messages    = [];
      state.page        = 0;
      state.hasMore     = true;
    },
    addMessage:      (state, action) => { state.messages.push(action.payload); },
    setMessages:     (state, action) => { state.messages = action.payload; },
    prependMessages: (state, action) => { state.messages = [...action.payload, ...state.messages]; },
    clearMessages:   (state)         => { state.messages = []; state.page = 0; state.hasMore = true; },
    incrementPage:   (state)         => { state.page += 1; },
    setHasMore:      (state, action) => { state.hasMore = action.payload; },
    addTypingUser:   (state, action) => {
      if (!state.typingUsers.includes(action.payload))
        state.typingUsers.push(action.payload);
    },
    removeTypingUser:(state, action) => {
      state.typingUsers = state.typingUsers.filter(u => u !== action.payload);
    },
  },
});

export const {
  setRooms, setCurrentRoom, addMessage, setMessages, prependMessages,
  clearMessages, incrementPage, setHasMore, addTypingUser, removeTypingUser,
} = chatroomSlice.actions;
export default chatroomSlice.reducer;
