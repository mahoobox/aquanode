import { User } from '../interfaces/index';
import { authAxios, axi } from '../hooks/useAxios';

export const getUsers = async () => {
    const response = await authAxios.get('/users/list/');
    return response.data;
};

export const getUser = async (id: number) => {
    const response = await authAxios.get(`/users/detail/${id}/`);
    return response.data;
};



export const registerUser = async (user: User) => {
	const response = await authAxios.post("/users/register/", user);
	return response.data;
};

export const updateUser = async (id: number, user: User) => {
	const response = await authAxios.put(`/users/update/${id}/`, user);
	return response.data;
};

export const loginUser = async (email: string, password: string) => {
    const response = await axi.post('/users/login/', { email, password });
    console.log("Los datos son: ", response.data)
    return response;
};
