import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const baseEndPoint = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseEndPoint
});

export const axiosPrivate: AxiosInstance = axios.create({
    baseURL: baseEndPoint,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

let isLoading = false;

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        isLoading = false;
        return response.data;
    },
    async (error: AxiosError) => {
        isLoading = false;
        
        if (error.response && error.response.status === 401) {
            // Token expired or not available
            try {
                const refreshToken = localStorage.getItem("@refreshToken");

                if (refreshToken) {
                    // Log for debugging
                    console.log('Attempting to refresh token...');

                    // Call /auth/refresh to get a new access token
                    const refreshResponse = await axiosInstance.post('/auth/refresh', { refreshToken });

                    // Log for debugging
                    console.log('Refresh successful:', refreshResponse.data);

                    const newAccessToken = refreshResponse.data.access_token;

                    // Update the current request with the new access token
                    const config: AxiosRequestConfig = error.config || {};
                    config.headers = config.headers || {};
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Log for debugging
                    console.log('Updated Config:', config);

                    return axiosInstance(config);
                }
            } catch (refreshError) {
                // Handle refresh error, e.g., redirect to login
                console.error('Token refresh failed:', refreshError);
                throw refreshError;
            }
        }
        
        throw error;
    }
);

axiosInstance.interceptors.request.use((config) => {
    isLoading = true;
    const token = localStorage.getItem("@accessToken") || localStorage.getItem("@refreshToken");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const HttpService = {
    get: async (url: string): Promise<any> => {
        try {
            return await axiosInstance.get(url);
        } catch (error) {
            console.error('HTTP GET Error:', error);
            throw error;
        }
    },
    post: async (url: string, data: any): Promise<any> => {
        try {
            return await axiosInstance.post(url, data);
        } catch (error) {
            console.error('HTTP POST Error:', error);
            throw error;
        }
    },
    put: async (url: string, data: any): Promise<any> => {
        try {
            return await axiosInstance.put(url, data);
        } catch (error) {
            console.error('HTTP PUT Error:', error);
            throw error;
        }
    },
    patch: async (url: string, data: any): Promise<any> => {
        try {
            return await axiosInstance.patch(url, data);
        } catch (error) {
            console.error('HTTP PATCH Error:', error);
            throw error;
        }
    },
    delete: async (url: string): Promise<void> => {
        try {
            await axiosInstance.delete(url);
        } catch (error) {
            console.error('HTTP DELETE Error:', error);
            throw error;
        }
    },
    isLoading: () => isLoading,
};
