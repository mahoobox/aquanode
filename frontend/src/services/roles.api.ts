import { Role } from "../interfaces";
import { authAxios } from "../hooks/useAxios";


export const registerRole = async (role: Role) => {
    const response = await authAxios.post("/roles/register/", role);
    return response.data;
};

export const getRoles = async () => {
    const response = await authAxios.get("/roles/list/");
    return response.data;
};

export const getRole = async (id: number) => {
    const response = await authAxios.get(`/roles/detail/${id}/`);
    return response.data;
};

export const updateRole = async (id: number, role: Role) => {
    const response = await authAxios.put(`/roles/edit/${id}/`, role);
    return response.data;
};

export const deleteRole = async (id: number) => await authAxios.delete(`/roles/delete/${id}/`);