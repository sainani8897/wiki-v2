import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = process.env.API_URL;

export const registerUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios.post(
        `${backendURL}/login`,
        { email, password },
        config
      );
    } catch (error) {
    // return custom error message from backend if present
      
    }
  }
);