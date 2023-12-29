import { localStorageService } from '@/utils';
import axiosInstance from '../interceptors/axios';
const AuthService = {
    login: async (credentials) => {
        // Make a request to your authentication API to get a token
        // Store the token securely (e.g., in localStorage or a secure cookie)
    },

    logout: () => {
        // Remove the token from storage
    },

    getAuthToken: () => {
        // Retrieve the stored token
    },

    isAuthenticated: async (): Promise<boolean> => {
        // Check if the user is authenticated (token exists and is valid)
        try {
            const token = localStorageService.get('token') ?? null;
            if (token) {
                const {data:userProfile} = await axiosInstance.get(process.env.API_URL + '/profile');
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },
};

export default AuthService;