import { createSlice } from '@reduxjs/toolkit';
import { registerUser } from './authAction';
import { stat } from 'fs';

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials:(state,action)=>{
      const {user,accessToken} = action.payload
      state.user = user
      state.token = accessToken
    },
    logout:(state,action)=>{
      state.user = null
      state.token = null
    }
  },
  extraReducers: builder => {
    builder.addCase(registerUser.pending, (state => {
      state.loading = true;
      state.error = null;
    }));
    
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true; // registration successful
    });

    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = null;
    });
  }
});

export const {setCredentials,logout} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user

export const selectCurrentToken = (state) => state.auth.token
