import { create } from "zustand";
import Cookies from "js-cookie";

type State = {
    isAuth: boolean;
};

type Actions = {
    getToken: () => { access: string; refresh: string }
    setToken: (access: string, refresh: string) => void;
    logout: () => void;
};

export const useAuth = create<State & Actions>(
    (set) => ({
        isAuth: !!Cookies.get('access') && !!Cookies.get('refresh'),
        getToken: () => {
            const access = Cookies.get('access') || '';
            const refresh = Cookies.get('refresh') || '';
            return { access, refresh };
        },
        setToken: (access: string, refresh: string) => {
            Cookies.set('access', access, { secure: true, sameSite: 'strict' });
            Cookies.set('refresh', refresh, { secure: true, sameSite: 'strict' });
            set({ isAuth: true });
        },
        logout: () => {
            Cookies.remove('access', { secure: true, sameSite: 'strict' });
            Cookies.remove('refresh', { secure: true, sameSite: 'strict' });
            set({ isAuth: false });
        },
    })
);