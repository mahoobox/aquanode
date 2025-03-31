import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import {
	LogOut,
	Home,
	Settings,
	Bell
} from 'lucide-react';
import {
	HomeIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/users.api";
import { useAuth } from "../../services/auth";
import { Token } from "../../interfaces";
import ModulesPage from './ModulesPage/ModulesPage';
import { AdminContext } from '../../contexts/AdminContext';
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const LayutAdmin = () => {
	const { isAuth } = useAuth();
	const navigate = useNavigate();

	const LogOutTwo = () => {
		useAuth.getState().logout();
		navigate("/");
	};
	const userId: number = isAuth
		? jwtDecode<Token>(useAuth.getState().getToken().access).user_id
		: 0;
	const avatar: File | null = isAuth
		? jwtDecode<Token>(useAuth.getState().getToken().access).avatar
		: null;

	const {
		data: user,
		status,
		isError,
	} = useQuery({
		queryKey: ["user", userId],
		queryFn: () => getUser(userId),
		enabled: !!userId,
	});

	if (status === "pending") {
		return <Loader />;
	}

	if (isError) {
		toast.error("Error al cargar el usuario");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			{/* Navigation Bar */}
			<nav className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-lg">
									<Home className="h-6 w-6 text-white" />
								</div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
									Acuicultura
								</h1>
							</div>
							<div className="hidden sm:ml-8 sm:flex sm:space-x-8">
								<a
									onClick={() => {
										navigate("/admin");
									}}
									className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
								>
									<HomeIcon className="w-auto h-5" aria-hidden="true" />
									Inicio
								</a>
								<a
									onClick={() => {
										navigate("/admin/roles");
									}}
									className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
								>
									<UsersIcon className="w-auto h-5" aria-hidden="true" />
									Roles
								</a>
								<a
									onClick={() => {
										navigate("/admin/usuarios");
									}}
									className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
								>
									<UsersIcon className="w-auto h-5" aria-hidden="true" />
									Usuarios
								</a>
								<a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
									Reports
								</a>
							</div>
						</div>
						<div className="flex items-center">
							<button className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
								<span className="sr-only">View notifications</span>
								<Bell className="h-6 w-6" aria-hidden="true" />
								<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white"></span>
							</button>
							<button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
								<span className="sr-only">Settings</span>
								<Settings className="h-6 w-6" aria-hidden="true" />
							</button>
							<div className="ml-3 relative flex items-center">
								<div className="flex-shrink-0">
									<img
										className="h-8 w-8 rounded-full"
										src={`http://127.0.0.1:8000${avatar}`}
										alt="avatar"
									/>
								</div>

								<div className="ml-3">
									<div className="text-base font-medium text-gray-800">{user?.name}</div>
									<div className="text-sm font-medium text-gray-500">{user?.email}</div>
								</div>
								<button
									onClick={LogOutTwo}
									className="ml-4 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									<span className="sr-only">Logout</span>
									<LogOut className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<main className="p-12">
				{location.pathname === "/admin" ? (
					<ModulesPage />
				) : (
					<AdminContext.Provider value={{ userId }}>
						<Outlet />
					</AdminContext.Provider>
				)}

			</main>
		</div>
	);
};

export default LayutAdmin;