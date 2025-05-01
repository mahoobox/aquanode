import axios, { AxiosRequestHeaders } from 'axios';
import { useAuth } from '../services/auth';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../interfaces/index';
import CryptoJS from "crypto-js";

const baseURL = "http://192.168.101.200:8000/api";
const pass_secret = "CewPTOb;k/X<A>^U'^:keV9?t1*vHZL)";

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

export const encryptPassword = (password: string): string => {
	const iv = CryptoJS.lib.WordArray.random(16);

	const key = CryptoJS.SHA256(pass_secret);

	const encrypted = CryptoJS.AES.encrypt(password, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});

	const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
	const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

	const encryptedString = `${ivBase64}::${encryptedBase64}`;

	return encryptedString;
};


