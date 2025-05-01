import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
	LogOut,
	Home,
	Menu,
} from 'lucide-react';
import { MdMarkChatUnread, MdMarkChatRead } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import {
	HomeIcon,
	UsersIcon,
	ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Events } from '../../interfaces';
import { getUser } from "../../services/users.api";
import { getNotiEvents } from '../../services/events_api';
import { useAuth } from "../../services/auth";
import { Token } from "../../interfaces";
import ModulesPage from './ModulesPage/ModulesPage';
import { AdminContext } from '../../contexts/AdminContext';
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import DiagnosisDetailModal from '../../components/DiagnosisDetailModal';

const LayutAdmin = () => {
	const [notifications, setNotifications] = useState<Events[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const dropdownRef = useRef(null);
	const [unreadCount, setUnreadCount] = useState<number>(0)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

	const limitedNotifications = notifications.slice(0, 5);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const data = await getNotiEvents();
				setNotifications(data);
				setUnreadCount(data.filter((notif: any) => !notif.is_read).length);
			} catch (error) {
				console.error('Error al obtener las notificaciones:', error);
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		fetchNotifications();
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};

	}, []);


	const handleNotificationClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};


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
							<div className="hidden md:ml-8 md:flex md:space-x-8">
								<a
									onClick={() => {
										navigate("/admin");
									}}
									className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
								>
									<HomeIcon className="w-auto h-5" aria-hidden="true" />
									Inicio
								</a>
								{user.role === "Super Administrador" ? (
									<>
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
										<a
											onClick={() => {
												navigate("/admin/diagnosticos");
											}}
											className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
										>
											<ClipboardDocumentIcon className="w-auto h-5" aria-hidden="true" />
											Diagnósticos
										</a>
									</>
								) : null}
								<a
									onClick={() => {
										navigate("/admin/eventos");
									}}
									className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
								>
									<ClipboardDocumentIcon className="w-auto h-5" aria-hidden="true" />
									Eventos
								</a>
							</div>
						</div>
						{/* Mobile menu button */}
						<div className="md:hidden flex items-center">
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
							>
								<Menu className="h-6 w-6" />
							</button>
						</div>
						<div className="flex items-center">
							<div className="relative">
								<div
									style={{ cursor: 'pointer' }}
									onClick={handleNotificationClick}
								>
									<FaBell size={25} color="#007bff" />
									{unreadCount > 0 && (
										<div
											className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
											style={{ transform: 'translate(50%, -50%)' }}
										>
											{unreadCount}
										</div>
									)}
								</div>
								{isDropdownOpen && (
									<div ref={dropdownRef} className="absolute top-10 right-0 bg-white shadow-lg rounded-lg w-64 p-4 border border-gray-300 z-10">
										<h3 className="font-semibold text-lg mb-2">Notificaciones</h3>
										{limitedNotifications.length > 0 ? (
											limitedNotifications.map((notif: any) => (
												<div
													key={notif.id}
													className={`flex items-center text-sm mb-2 p-2 border-b ${notif.is_read ? 'text-gray-500' : 'text-black'}`}
												>
													{notif.is_read ? (
														<MdMarkChatRead size={20} className="mr-2 text-green-500" />
													) : (
														<MdMarkChatUnread size={20} className="mr-2 text-red-500" />
													)}
													<p ref={dropdownRef} className="flex-1">{notif.events}</p>  <DiagnosisDetailModal
														title=""
														style={"hover:text-chileanFire-500"}
														content={"Ver Evento"}
														id={notif.id}
														user={user}
													/>
												</div>
											))
										) : (
											<p className="text-gray-500 text-xs">No hay notificaciones</p>
										)}
										<div
											onClick={() => {
												navigate("/admin/eventos");
											}}
											className="mt-4 text-center cursor-pointer"
										>
											Ver más
										</div>
									</div>
								)}
							</div>
							<div className="hidden md:flex items-center">
								<div className="ml-8 relative flex items-center">
									<div className="flex-shrink-0">
										<img
											className="h-8 w-8 rounded-full"
											src={`${import.meta.env.VITE_IMAGE_URL}${avatar}`}
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
				</div>
				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden">
						<div className="pt-2 pb-3 space-y-1">
							<a
								onClick={() => {
									navigate("/admin");
								}}
								className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
							>
								<HomeIcon className="w-auto h-5" aria-hidden="true" />
								Inicio
							</a>
							{user.role === "Super Administrador" ? (
								<>
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
									<a
										onClick={() => {
											navigate("/admin/diagnosticos");
										}}
										className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
									>
										<ClipboardDocumentIcon className="w-auto h-5" aria-hidden="true" />
										Diagnósticos
									</a>
								</>
							) : null}
							<a
								onClick={() => {
									navigate("/admin/eventos");
								}}
								className="flex items-center gap-2 hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out rounded-xl p-2 cursor-pointer"
							>
								<ClipboardDocumentIcon className="w-auto h-5" aria-hidden="true" />
								Eventos
							</a>
						</div>
						<div className="pt-4 pb-3 border-t border-gray-200">
							<div className="flex items-center px-4">
								<div className="flex-shrink-0">
									<img
										className="h-8 w-8 rounded-full"
										src={`${import.meta.env.VITE_IMAGE_URL}${avatar}`}
										alt="avatar"
									/>
								</div>
								<div className="ml-3">
									<div className="text-base font-medium text-gray-800">{user?.name || 'User'}</div>
									<div className="text-sm font-medium text-gray-500">{user?.email || 'acuicultura25@gmail.com'}</div>
								</div>
							</div>
							<div className="mt-3 space-y-1">
								<button
									onClick={LogOutTwo}
									className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				)}
			</nav >
			<main className="p-12">
				{location.pathname === "/admin" ? (
					<ModulesPage />
				) : (
					<AdminContext.Provider value={{ userId }}>
						<Outlet />
					</AdminContext.Provider>
				)}

			</main>
		</div >
	);
};

export default LayutAdmin;