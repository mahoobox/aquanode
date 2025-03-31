import axios, { AxiosRequestHeaders } from 'axios';
import { useAuth } from '../services/auth';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../interfaces/index';

const baseURL = 'http://127.0.0.1:8000/api';

function logout() {
    useAuth.getState().logout();
    window.location.href = '/';
}

export const authAxios = axios.create({
    baseURL,
    withCredentials: true,
});

export const axi = axios.create({
    baseURL,
});

authAxios.interceptors.request.use(async (config) => {
    const token: string = useAuth.getState().getToken().access;
    config.headers = {
        Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;

    const decodedToken: Token = jwtDecode(token);

    const expirationTime = new Date(decodedToken.exp * 1000);
    const currentTime = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (expirationTime.getTime() - currentTime.getTime() < fiveMinutes) {              
        try {
            const ressponse = await axi.post('/users/refresh/', { refresh: useAuth.getState().getToken().refresh });
            useAuth.getState().setToken(ressponse.data.access, ressponse.data.refresh);            
        } catch (error) {       
            logout();
        }
    }
    return config;
}
);

