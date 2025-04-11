import { useState, MouseEvent } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import TooltipHelper from "../../../components/TooltipHelper";
import { useForm } from "react-hook-form";
import ButtonProcess from "../../../components/ButtonProcess";
import { toast } from "react-hot-toast";
import { NewError, User } from "../../../interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, registerUser } from "../../../services/users.api";
import { getRoles, updateRole } from "../../../services/roles.api";

interface UsersModalProps {
	title: string;
	style: string;
	content: string;
	id?: number;
}

const UsersModal = ({ title, style, content, id }: UsersModalProps) => {
	const [animation, setAnimation] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const { data: roles, error } = useQuery({
		queryKey: ["roles"],
		queryFn: getRoles,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		reset,
	} = useForm();

	const onReset = () => {
		reset();
	};

	const getUserMutation = useMutation({
		mutationFn: () => getUser(id as number),
		onSuccess: (data) => {
			setValue("name", data.name);
			setValue("last_name", data.last_name);
			setValue("role", data.role);
			setValue("email", data.email);
		},
		onError: (error: NewError) => {
			toast.error(
				error.response?.data?.detail || "Error al obtener el usuario"
			);
		},
	});

	const dataUser = {
		name: getValues("name")?.trim() || "",
		last_name: getValues("last_name")?.trim() || "",
		role: getValues("role")?.trim() || "",
		email: getValues("email")?.toLowerCase().trim() || "",
		password: getValues("password")?.trim() || "",
	};

	const queryClient = useQueryClient();

	const registerMutation = useMutation({
		mutationFn: () => registerUser(dataUser),
		onSuccess: (data) => {
			setAnimation(false);
			toast.success("Usuario creado con éxito");
			queryClient.setQueryData(["users"], (oldData: User[] | undefined) =>
				oldData ? [...oldData, data] : oldData
			);
			setShowModal(false);
			onReset();
		},
		onError: (error: NewError) => {
			setAnimation(false);
			toast.error(error.response?.data?.detail || "Error al crear el usuario");
		},
	});

	const updateMutation = useMutation({
		mutationFn: () => updateRole(id as number, dataUser),
		onSuccess: (data) => {
			setAnimation(false);
			toast.success("Usuario actualizado con éxito");
			queryClient.setQueryData(["users"], (oldData: User[] | undefined) => {
				if (oldData) {
					const newData = oldData.map((user) => (user.id === id ? data : user));
					return newData;
				}
				return oldData;
			});
			queryClient.invalidateQueries({ queryKey: ["user", id] });
			setShowModal(false);
			onReset();
		},
		onError: (error: NewError) => {
			setAnimation(false);
			toast.error(
				error.response?.data?.detail || "Error al actualizar el usuario"
			);
		},
	});

	const onSubmit = handleSubmit(async () => {
		setAnimation(true);
		if (id) {
			await updateMutation.mutateAsync();
			console.log("update");
		} else {
			await registerMutation.mutateAsync();
		}
	});

	const handleShowModal = (event: MouseEvent) => {
		event.preventDefault();
		setShowModal(!showModal);
		if (id) {
			getUserMutation.mutateAsync();
		}
		onReset();
	};

	const handleCloseModal = (event: MouseEvent) => {
		event.preventDefault();
		setShowModal(!showModal);
		onReset();
	};

	if (error) {
		toast.error(error.message || "Error al obtener los roles.");
	}

	return (
		<>
			<button
				onClick={handleShowModal}
				className={`flex justify-between rounded-lg px-2 py-1 text-base font-semibold text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-lg tracking-wider ${style}`}
			>
				<UserPlusIcon className="w-auto h-6 sm:h-7 mr-3" aria-hidden="true" />
				{title}
			</button>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-4xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
									<h3 className="text-3xl font-bold text-matisse-950">
										{content}
									</h3>
								</div>
								{/*body*/}
								<form
									onSubmit={onSubmit}
									className="relative px-6 py-2 flex-auto text-matisse-950"
								>
									<div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
										<div className="sm:col-span-4 sm:col-start-1">
											<div className="flex">
												<label
													htmlFor="name"
													className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
												>
													* Nombres
												</label>
												<TooltipHelper
													message={
														"Digite los nombres del usuario que desea crear"
													}
												/>
											</div>
											<div className="mt-2">
												<input
													type="text"
													id="name"
													{...register("name", {
														required: {
															value: true,
															message: "El nombre es obligatorio",
														},
														maxLength: {
															value: 80,
															message: "Máximo 80 caracteres",
														},
														minLength: {
															value: 3,
															message: "Mínimo 3 caracteres",
														},
													})}
													className={`text-sm block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-slateGray-300 sm:text-base sm:leading-6 ${errors.name ? "border-2 border-red-500" : ""
														}`}
												/>
											</div>
											{errors.name && (
												<span className="text-sm text-red-500">
													{errors.name.message as string}
												</span>
											)}
										</div>
										<div className="sm:col-span-4">
											<div className="flex">
												<label
													htmlFor="last_name"
													className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
												>
													* Apellidos
												</label>
												<TooltipHelper
													message={
														"Digite los apellidos del usuario que desea crear"
													}
												/>
											</div>
											<div className="mt-2">
												<input
													type="text"
													id="last_name"
													{...register("last_name", {
														required: {
															value: true,
															message: "El apellido es obligatorio",
														},
														maxLength: {
															value: 80,
															message: "Máximo 80 caracteres",
														},
														minLength: {
															value: 3,
															message: "Mínimo 3 caracteres",
														},
													})}
													className={`text-sm block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-slateGray-300 sm:text-base sm:leading-6 ${errors.last_name ? "border-2 border-red-500" : ""
														}`}
												/>
											</div>
											{errors.last_name && (
												<span className="text-sm text-red-500">
													{errors.last_name.message as string}
												</span>
											)}
										</div>
									</div>
									<div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
										<div
											className={`${!id
												? "sm:col-span-4 sm:col-start-1"
												: "sm:col-span-12 sm:col-start-1"
												}`}
										>
											<div className="flex">
												<label
													htmlFor="email"
													className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
												>
													* Correo electrónico
												</label>
												<TooltipHelper
													message={
														"Digite el correo electrónico del usuario que desea crear"
													}
												/>
											</div>
											<div className="mt-2">
												<input
													type="email"
													id="email"
													{...register("email", {
														required: {
															value: true,
															message: "El correo electrónico es obligatorio",
														},
														pattern: {
															value:
																/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
															message: "Correo electrónico inválido",
														},
													})}
													className={`text-sm block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-slateGray-300 sm:text-base sm:leading-6 ${errors.email ? "border-2 border-red-500" : ""
														}`}
												/>
											</div>
											{errors.email && (
												<span className="text-sm text-red-500">
													{errors.email.message as string}
												</span>
											)}
										</div>
										<div className="sm:col-span-2">
											<div className="flex">
												<label
													htmlFor="role"
													className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
												>
													* Rol del Usuario
												</label>
												<TooltipHelper
													message={"Seleccione el rol del usuario"}
												/>
											</div>
											<select
												id="role"
												{...register("role", { required: true })}
												className="text-sm block w-full bg-slateGray-100 rounded-md border-0 p-1.5 pl-2 text-matisse-950 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6 cursor-text"
											>
												<option value="">Seleccione un rol</option>
												{roles?.map((role: { id: any; name: string; }) => (
													<option key={role.id} value={role.name}>
														{role.name}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
										<div className="sm:col-span-12 sm:col-start-1">
											<div className="flex">
												<label
													htmlFor="password"
													className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
												>
													* Contraseña
												</label>
												<TooltipHelper
													message={
														"Debe contener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial."
													}
												/>
											</div>
											<div className="mt-2">
												<input
													type="password"
													id="password"
													{...register("password", {
														required: "La contraseña es obligatoria",
														minLength: {
															value: 8,
															message:
																"La contraseña debe tener al menos 8 caracteres",
														},
														pattern: {
															value:
																/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
															message:
																"Debe incluir una mayúscula, una minúscula, un número y un carácter especial",
														},
													})}
													disabled={id ? true : false}
													className={`text-sm block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-slateGray-300 sm:text-base sm:leading-6 ${errors.password ? "border-2 border-red-500" : ""
														}`}
												/>
											</div>
											{/* Mensajes de error específicos */}
											{errors.password && (
												<span className="text-sm text-red-500">
													{errors.password.message as string}
												</span>
											)}
										</div>
									</div>
									{/*footer*/}
									<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
										<button
											className="btn-second"
											type="button"
											onClick={handleCloseModal}
										>
											Cerrar
										</button>
										{(animation && (
											<ButtonProcess text={"Guardando..."} width={""} />
										)) || <button className="btn-primary">Guardar</button>}
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};

export default UsersModal;
