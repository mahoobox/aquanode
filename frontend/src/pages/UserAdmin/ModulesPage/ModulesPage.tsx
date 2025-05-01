import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import {
    Users,
} from 'lucide-react';
import {
    UsersIcon,
    ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "../../../services/users.api";
import { useAuth } from '../../../services/auth';
import { getNotiEvents } from '../../../services/events_api';
import { getDiagnosis } from '../../../services/diagnosis_api';
import { getRoles } from '../../../services/roles.api';
import { Token } from "../../../interfaces";
import { PiesChart } from "../../../components/PiesChart";

interface Data {
    [key: string]: {
        percentage: number;
        total: number;
    };
}

const ModulesPage = () => {
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [userCount, setUserCount] = useState<number>(0)
    const [roleCount, setRoleCount] = useState<number>(0)
    const [diagCount, setDiagCount] = useState<number>(0)
    const { isAuth } = useAuth();

    const userId: number = isAuth
        ? jwtDecode<Token>(useAuth.getState().getToken().access).user_id
        : 0;

    const {
        data: user,

    } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });
    const isSuperAdmin = user.role === "Super Administrador";
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotiEvents();
                setUnreadCount(data.filter((notif: any) => notif.id).length);
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
            }
        };
        const fetAllUsers = async () => {
            try {
                const data = await getUsers();
                setUserCount(data.filter((User: any) => User.id).length);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        const fetAllRoles = async () => {
            try {
                const data = await getRoles();
                setRoleCount(data.filter((Role: any) => Role.id).length);
            } catch (error) {
                console.error('Error al obtener los Roles:', error);
            }
        };
        const fetAllDiagnosis = async () => {
            try {
                const data = await getDiagnosis();
                setDiagCount(data.filter((Diag: any) => Diag.id).length);
            } catch (error) {
                console.error('Error al obtener los Roles:', error);
            }
        };
        fetchNotifications();
        if (isSuperAdmin) {
            fetAllUsers();
            fetAllRoles();
            fetAllDiagnosis();
        }
        const checkLoading = setInterval(() => {
            if (unreadCount !== 0 && diagCount !== 0) {
                clearInterval(checkLoading);
            }
        }, 500);

    }, [])

    const dataPies = {
        Eventos: unreadCount,
        Diagnósticos: diagCount,
    };    
    const stats = [
        ...(isSuperAdmin ? [
            { name: 'Roles Registrados', value: roleCount, icon: UsersIcon, positive: true },
            { name: 'Usuarios Registrados', value: userCount, icon: Users, positive: true },
            { name: 'Total Diagnósticos', value: diagCount, icon: ClipboardDocumentIcon, positive: true },
        ] : []),
        { name: 'Total de eventos', value: unreadCount, icon: ClipboardDocumentIcon, positive: false },

    ];


    return (
        <>
            {/* Main Content */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Bienvenid@ de nuevo, {user?.name}! 👋</h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="p-10">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 shadow-lg">
                                                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {user.role === "Super Administrador" ? (
                        <div className="sm:p-4 w-full h-96">
                            {<PiesChart data={dataPies} />}
                        </div>
                    ) : null}

                </div>
            </div>
        </>
    );
}

export default ModulesPage;