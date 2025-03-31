import { useState, MouseEvent } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import TooltipHelper from "../../../../components/TooltipHelper";
import { useForm } from "react-hook-form";
import ButtonProcess from "../../../../components/ButtonProcess";
import { Role } from "../../../../interfaces";
import { NewError } from "../../../../interfaces";
import { registerRole, updateRole, getRole } from "../../../../services/roles.api";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RolesModalProps {
	title: string;
	style: string;
	content: string;
	id?: number;
}

const RolesModal = ({ title, style, content, id }: RolesModalProps) => {
	const [animation, setAnimation] = useState(false);
	const [showModal, setShowModal] = useState(false);

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

	const getRoleMutation = useMutation({
		mutationFn: () => getRole(id as number),
		onSuccess: (data) => {
			setValue("name", data.name);
		},
		onError: (error: NewError) => {
			toast.error(error.response?.data?.detail || "Error al obtener el rol");
		},
	});

	const dataRole = {
		name: getValues("name")?.trim() || "",
	};

	const queryClient = useQueryClient();

	const registerMutation = useMutation({
		mutationFn: () => registerRole(dataRole),
		onSuccess: (data) => {
			setAnimation(false);
			toast.success("Rol creado con éxito");
			queryClient.setQueryData(["roles"], (oldData: Role[] | undefined) =>
				oldData ? [...oldData, data] : oldData
			);
			setShowModal(false);
			onReset();
		},
		onError: (error: NewError) => {
			setAnimation(false);
			toast.error(error.response?.data?.detail || "Error al crear el rol");
		},
	});

	const updateMutation = useMutation({
		mutationFn: () => updateRole(id as number, dataRole),
		onSuccess: (data) => {
			setAnimation(false);
			toast.success("Rol actualizado con éxito");
			queryClient.setQueryData(["roles"], (oldData: Role[] | undefined) => {
				if (oldData) {
					const newData = oldData.map((role) => (role.id === id ? data : role));
					return newData;
				}
				return oldData;
			});
			queryClient.invalidateQueries({ queryKey: ["role", id] });
			setShowModal(false);
			onReset();
		},
		onError: (error: NewError) => {
			setAnimation(false);
			toast.error(error.response?.data?.detail || "Error al actualizar el rol");
		},
	});

	const onSubmit = handleSubmit(async () => {
		setAnimation(true);
		if (id) {
			await updateMutation.mutateAsync();
		} else {
			await registerMutation.mutateAsync();
		}
	});

	const handleShowModal = (event: MouseEvent) => {
		event.preventDefault();
		setShowModal(true);
		if (id) {
			getRoleMutation.mutate();
		}
	};

	const handleCloseModal = (event: MouseEvent) => {
		event.preventDefault();
		setShowModal(false);
		onReset();
	};

	return (
		<>
			<button
				onClick={handleShowModal}
				className={`flex justify-between rounded-lg px-2 py-1 text-base font-semibold text-chileanFire-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chileanFire-600 sm:text-lg tracking-wider ${style}`}
			>
				<PencilIcon className="w-auto h-6 sm:h-7 mr-3" aria-hidden="true" />
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
									<div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-1 lg:gap-1">
										<div className="sm:col-span-4 sm:col-start-1">
											<div className="flex">
												<label
													htmlFor="name"
													className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
												>
													* Nombre
												</label>
												<TooltipHelper
													message={"Digite el nombre del rol que desea crear"}
												/>
											</div>
											<div className="mt-2">
												<input
													type="text"
													id="name"
													{...register("name", {
														required: true,
														maxLength: 80,
														minLength: 3,
														pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/i,
													})}
													className={`text-sm block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-slateGray-300 sm:text-base sm:leading-6 ${
														errors.name ? "border-2 border-red-500" : ""
													}`}
												/>
											</div>
											<span
												className={`absolute text-sm text-red-500 ${
													errors.name ? "visible" : "invisible"
												}`}
											>
												Verifique este campo obligatorio
											</span>
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
										)) || (
											<button
												onClick={(e) => e.preventDefault}
												className="btn-primary"
											>
												Guardar
											</button>
										)}
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};

export default RolesModal;
