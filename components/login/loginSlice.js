import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: 0,
  name: '',
  users: [],
  is_logout: false,
};


export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setIsLogOut: (state, action) => {
      state.is_logout = action.payload;
    },
  },
});

export const { setUserId, setName, setUsers, setIsLogOut } = loginSlice.actions;

export const selectUserId = (state) => state.login.user_id;
export const selectName = (state) => state.login.name;
export const selectUsers = (state) => state.login.users;
export const selectIsLogOut = (state) => state.login.is_logout;


export default loginSlice.reducer;
