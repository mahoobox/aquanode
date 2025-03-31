import { createContext } from "react";

interface AdminContextType {
    userId: number;
}

export const AdminContext = createContext<AdminContextType>({
    userId: 0,
});