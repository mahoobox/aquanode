import { useState, MouseEvent, useEffect } from "react";
import { NewError, User } from "../interfaces";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { saveUpdateOffline, syncPendingUpdates } from "../services/indexedDB";
import {
    EyeIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getUser, getUsers } from "../services/users.api";
import { toast } from "react-hot-toast";
import { useAuth } from '../services/auth';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TooltipHelper from "../components/TooltipHelper";
import ButtonProcess from "../components/ButtonProcess";
import { getEvent, UpdateEventRead, UpdateEvent } from '../services/events_api';
import { Event } from "../interfaces";
import { Token } from "../interfaces";

interface DiagnosisDetailModalProps {
    title: string;
    style: string;
    content: string;
    user: User;
    id?: number;
}

const DiagnosisDetailModal = ({ title, style, content, user, id }: DiagnosisDetailModalProps) => {
    const [animation, setAnimation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const [isAaprobbed, setIsAaprobbed] = useState<Boolean>();
    const { isAuth } = useAuth();

    useEffect(() => {
        const handleOnline = () => {
            syncPendingUpdates(UpdateEvent);
        };
        const fetchVideoUrl = async () => {
            try {
                const data = await getEvent(id);
                const firstItem = data[0];
                if (firstItem && firstItem.url) {
                    const videoUrl = firstItem.url;
                    const videoId = videoUrl.split('/')[5];
                    const iframeUrl = `https://drive.google.com/file/d/${videoId}/preview`;
                    setIframeUrl(iframeUrl);
                } else {
                    console.log("No se encontró la URL para el video.");
                }
            } catch (error) {
                console.error('Error al obtener la url:', error);
            }
        };
        fetchVideoUrl();
        window.addEventListener("online", handleOnline);
        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, [id])

    const userId: number = isAuth
        ? jwtDecode<Token>(useAuth.getState().getToken().access).user_id
        : 0;

    const {
        data: users,

    } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });

    const handleShowModal = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(!showModal);
        if (id) {
            getEventMutation.mutateAsync();
        }
        const fetchRead = async () => {
            const dataread = await UpdateEventRead(id);
            return dataread
        }
        fetchRead();
        onReset();
    };

    const handleCloseModal = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(!showModal);
        onReset();
    };

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

    const getEventMutation = useMutation({
        mutationFn: () => getEvent(id as number),
        onSuccess: (data) => {
            const firstItem = data[0];
            const createdAt = new Date(firstItem.created_at)

            function formatDate(date) {
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true
                };
                return date.toLocaleString('es-ES', options);
            }

            const formattedDate = formatDate(createdAt);
            setValue("events", firstItem.events);
            setValue("url", firstItem.url);
            setValue("observation", firstItem.observation);
            setValue("user_id", firstItem.user);
            setValue("created_at", formattedDate);
            setIsAaprobbed(firstItem.aprobbed)
        },

        onError: (error: NewError) => {
            toast.error(
                error.response?.data?.detail || "Error al obtener la información"
            );
        },
    });
    const queryClient = useQueryClient();

    const dataEvent = {
        observation: getValues("observation")?.trim() || "",
        aprobbed: getValues("aprobbed")?.trim() === "Aprobado" ? true : false,
        user_id: user.id
    }

    const updateMutation = useMutation({
        mutationFn: () => UpdateEvent(id as number, dataEvent),
        onSuccess: (data) => {
            queryClient.setQueryData(["observation"], (oldData: Event[] | undefined) => {
                if (oldData) {
                    const newData = oldData.map((observation) => (id === id ? data : observation));
                    return newData;
                }
                return oldData;
            });
            queryClient.invalidateQueries({ queryKey: ["observation", id] });
            toast.success("Información actualizada con éxito");
            setShowModal(false);
            onReset();
        },
        onError: async (error: NewError) => {
            setAnimation(false);
            toast.error(
                error.response?.data?.detail ||
                "Error al actualizar. Se guardó localmente para sincronizar luego."
            );

            // Guardar en IndexedDB si falla la actualización
            await saveUpdateOffline({
                id: id as number,
                data: dataEvent,
            });
        },
    });

    const onSubmit = handleSubmit(async () => {
        setAnimation(true);
        if (id) {
            await updateMutation.mutateAsync();
        }
    });



    return (
        <>
            <div className="group flex relative">
                <button
                    onClick={handleShowModal}
                    className={`flex justify-between rounded-lg px-2 py-1 text-base font-semibold text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-lg tracking-wider ${style}`}
                >
                    <EyeIcon className="w-auto h-6 sm:h-7 mr-3" aria-hidden="true" />
                    {title}
                </button>
            </div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={handleCloseModal}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-7xl h-[45rem]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-bold text-matisse-950">
                                        {content}

                                    </h3>
                                </div>
                                {/*body*/}
                                <div className="relative px-6 py-2 flex-auto text-matisse-950">
                                    Fecha de Creación:   <input
                                        type="text"
                                        readOnly
                                        className="w-full"
                                        {...register("created_at", {
                                        })}
                                    />
                                </div>
                                <form
                                    onSubmit={onSubmit}
                                    className="relative px-6 py-2 flex-auto text-matisse-950"
                                >
                                    <div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
                                        <div className="sm:col-span-12 sm:col-start-1">
                                            <div className="flex">
                                                <label
                                                    htmlFor="events"
                                                    className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                >
                                                    * Mensaje
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    id="events"
                                                    {...register("events", {

                                                    })}
                                                    readOnly
                                                    className={`text-sm block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset ring-slateGray-300 sm:text-base sm:leading-6 ${errors.name ? "border-2 border-red-500" : ""
                                                        }`}
                                                />
                                            </div>
                                            {errors.events && (
                                                <span className="text-sm text-red-500">
                                                    {errors.name.message as string}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
                                        <div className="sm:col-span-12 sm:col-start-1">
                                            <div className="video-player">
                                                <div className="responsive-iframe">
                                                    <iframe
                                                        src={iframeUrl}
                                                        allowFullScreen
                                                        allow="autoplay"
                                                        frameBorder="0"
                                                        title="Google Drive Video Player"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
                                        <div className="sm:col-span-12 sm:col-start-1">
                                            <div className="mt-2">
                                                <div className="sm:col-span-2 sm:col-start-1">
                                                    <div className="flex">
                                                        <label
                                                            htmlFor="observation"
                                                            className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                        >
                                                            * Observación.
                                                        </label>
                                                        <TooltipHelper
                                                            message={
                                                                "Escriba la Observación encontrada."
                                                            }
                                                        />
                                                    </div>
                                                    <textarea
                                                        id="observation"
                                                        rows={5}
                                                        maxLength={5000}
                                                        placeholder="Observación"
                                                        {...register("observation", {
                                                            required: true,
                                                            maxLength: 5000,
                                                            pattern: /^[\w\s\-.,!?áéíóúÁÉÍÓÚñÑ]+$/i,
                                                        })}
                                                        className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            {/* Mensajes de error específicos */}
                                            {errors.password && (
                                                <span className="text-sm text-red-500">
                                                    {errors.password.message as string}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
                                        <div className="sm:col-span-2 w-full">
                                            <select
                                                id="aprobbed"
                                                required
                                                {...register("aprobbed", {
                                                })}
                                                className="text-sm w-full bg-slateGray-100 rounded-md border-0 p-1.5  shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6 hover:cursor-text"
                                            >

                                                <option>
                                                    {isAaprobbed === null ? (
                                                        <span data-label="seleccionar">Seleccione una opción:</span>
                                                    ) : isAaprobbed == true ? (
                                                        <span data-label="aprobado">Aprobado</span>
                                                    ) : (
                                                        <span data-label="desaprobado">Desaprobado</span>
                                                    )}
                                                </option>
                                                <option>Aprobado</option>
                                                <option>Desaprobado</option>
                                            </select>
                                        </div>
                                    </div>
                                    {user.role === "Super Administrador" && getEventMutation.data?.[0]?.user && (

                                        <div className="mt-2">
                                            <div className="sm:col-span-2 sm:col-start-1">
                                                <div className="flex">
                                                    <label
                                                        className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                    >
                                                        * Usuario que aprueba.
                                                    </label>

                                                </div>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        {...register("user_id")}
                                                        readOnly
                                                        className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    )}
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

export default DiagnosisDetailModal;