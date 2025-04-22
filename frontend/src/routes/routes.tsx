import { ReactNode } from "react";
import {
    Navigate,
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "../pages/404/404";
import Login from "../pages/login/login";
import LayoutAdmin from "../pages/UserAdmin/Layout";
import UsersPage from "../pages/UsersPage/UsersPage";
import RolesPage from "../pages/UserAdmin/RolesPage/RolesPage";
import EventsPage from "../pages/UserAdmin/EventsPage/Events";
import DiagnosisPage from "../pages/UserAdmin/DiagnosisPage/DiagnosisPage";
import { useAuth } from "../services/auth";
import { jwtDecode } from "jwt-decode";
import { Token } from "../interfaces";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isAuth } = useAuth();
    if (!isAuth) {
        return <Navigate to="/inicio" />;
    }
    return <>{children}</>;
};

const PrivateRouteSuperAdmin = ({ children }: { children: ReactNode }) => {

    const { isAuth } = useAuth();
    const role = isAuth
        ? jwtDecode<Token>(useAuth.getState().getToken().access).role
        : "";
    if (!isAuth || role !== "Super Administrador") {
        return <Navigate to="/admin/Users" />;
    }
    return <>{children}</>;
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/inicio" />,
    },
    {
        path: "/inicio",
        element: <Login />,
    },
    {
        path: "/admin",
        element: (
            <PrivateRoute>
                <LayoutAdmin />
            </PrivateRoute>
        ),
        children: [
            {
                path: "usuarios",
                element: (
                    <PrivateRouteSuperAdmin>
                        <UsersPage />
                    </PrivateRouteSuperAdmin>
                ),
            },
            {
                path: "roles",
                element: (
                    <PrivateRouteSuperAdmin>
                        <RolesPage />
                    </PrivateRouteSuperAdmin>
                ),
            },
            {
                path: "eventos",
                element: <EventsPage />,
            },
            {
                path: "diagnosticos",
                element: <DiagnosisPage />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export const Routes = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />

        </QueryClientProvider>
    );
};
