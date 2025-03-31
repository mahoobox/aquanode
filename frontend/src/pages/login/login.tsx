import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ButtonProcess from "../../components/ButtonProcess";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/users.api";
import { KeyRound } from 'lucide-react';
import { toast } from "react-hot-toast";
import { useAuth } from "../../services/auth";
import { NewError } from "../../interfaces";

const Login = () => {
	const [animation, setAnimation] = useState<boolean>(false);
	const navigate = useNavigate();
	const setToken = useAuth((state) => state.setToken);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
	} = useForm();

	const onReset = () => {
		reset();
	};

	const loginMutation = useMutation({
		mutationFn: () => loginUser(getValues("email"), getValues("password")),
		onSuccess: (response) => {
			setToken(response.data.access, response.data.refresh);
			toast.success("Conexión Exitosa");
			setAnimation(false);
			navigate("/admin");
			onReset();
		},
		onError: (error: NewError) => {
			toast.error(error.response?.data?.detail || "Error al iniciar sesión");
			setAnimation(false);
		},
	});

	const onSubmit = handleSubmit(async () => {
		setAnimation(true);
		await loginMutation.mutateAsync();
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-10 backdrop-blur-sm bg-opacity-90">
				<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
					<KeyRound className="h-8 w-8 text-white" />
				</div>
				<h2 className="text-2xl sm:text-4xl font-semibold text-center">
					Bienvenido
				</h2>
				<form onSubmit={onSubmit}>
					<div className="mt-4">
						<label className="block mb-2 text-sm sm:text-lg">
							Correo electrónico
						</label>
						<input
							type="email"
							{...register("email", {
								required: true,
								pattern: /^\S+@\S+$/i,
							})}
							className={`w-full px-4 py-2 text-sm sm:text-base bg-slateGray-100 border border-slateGray-200 rounded-lg focus:border-primary focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-20 ${errors.email ? "border-2 border-red-500" : ""
								}`}
						/>
					</div>
					<span
						className={`absolute text-sm text-red-500 ${errors.email ? "visible" : "invisible"
							}`}
					>
						Verifique este campo, es obligatorio
					</span>
					<div className="mt-4">
						<label className="block mb-2 text-sm sm:text-lg">
							Contraseña
						</label>
						<input
							type="password"
							{...register("password", {
								required: true,
								// pattern:
								//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/,
							})}
							className={`w-full px-4 py-2 text-sm sm:text-base bg-slateGray-100 border border-slateGray-200 rounded-lg focus:border-primary focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-20 ${errors.password ? "border-2 border-red-500" : ""
								}`}
						/>
					</div>
					<span
						className={`absolute text-sm text-red-500 ${errors.password ? "visible" : "invisible"
							}`}
					>
						Verifique este campo, es obligatorio
					</span>
					<div className="flex justify-end mt-4">
						<a className="text-md hover:underline" href="">
							¿Ha olvidado su contraseña?
						</a>
					</div>
					<div className="mt-8">
						{(animation && (
							<ButtonProcess
								text={"Ingresando..."}
								width={"w-full justify-center"}
							/>
						)) || <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								<span className="absolute left-0 inset-y-0 flex items-center pl-3">
									<KeyRound className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" aria-hidden="true" />
								</span>
								Ingresar
							</button>}
					</div>
				</form>
			</div >
		</div >
	);
};

export default Login;