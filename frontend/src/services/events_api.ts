import { Event } from "../interfaces";
import { authAxios } from "../hooks/useAxios";

export const getDiagnosis = async () => {
    const response = await authAxios.get("/diagnosis/notifications/");
    return response.data;
};

export const getEvents = async () => {
    const response = await authAxios.get("/diagnosis/events/");
    return response.data;
};

export const getEvent = async (id: number) => {
    const response = await authAxios.get(`/diagnosis/detail/${id}/`);
    return response.data;
};

export const UpdateEventRead = async (id: number) => {
    const response = await authAxios.patch(`/diagnosis/mark_as_read/${id}/`);
    return response.data;
};

export const UpdateEvent = async (id: number, event: Event) => {
    const response = await authAxios.patch(`/diagnosis/update/${id}/`,event);
    return response.data;
};
