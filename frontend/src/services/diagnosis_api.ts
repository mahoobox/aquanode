import { Diagosis } from "../interfaces";
import { authAxios } from "../hooks/useAxios";

export const getDiagnosis = async () => {
    const response = await authAxios.get("/diagnosis/diagnosis/");
    return response.data;
};

export const getDiagnosisDetail = async (id: number) => {
    const response = await authAxios.get(`/diagnosis/diagnosisdetail/${id}/`);
    return response.data;
};