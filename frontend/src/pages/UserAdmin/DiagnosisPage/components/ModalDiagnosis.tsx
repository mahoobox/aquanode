import { useState, MouseEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NewError } from "../../../../interfaces";
import {
    EyeIcon,
} from "@heroicons/react/24/outline";
import ButtonProcess from "../../../../components/ButtonProcess";
import { toast } from "react-hot-toast";
import { getDiagnosisDetail } from '../../../../services/diagnosis_api';
import { useMutation } from "@tanstack/react-query";

interface DiagnosisDetailsModalProps {
    title: string;
    style: string;
    content: string;
    id?: number;
}

const DiagnosisDetailsModal = ({ title, style, content, id }: DiagnosisDetailsModalProps) => {
    const [animation, setAnimation] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm();


    const getDiagnosisMutation = useMutation({
        mutationFn: () => getDiagnosisDetail(id as number),
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
            setValue("analyzed_image", firstItem.analyzed_image);
            setValue("ubicacion", firstItem.ubicacion);
            setValue("model_answer", firstItem.model_answer);
            setValue("model_result", firstItem.model_result);
            setValue("user", firstItem.user);
            setValue("created_at", formattedDate);
        },
        onError: (error: NewError) => {
            toast.error(error.response?.data?.detail || "Error al obtener el Diagnóstico");
        },
    });

    const handleShowModal = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(true);
        if (id) {
            getDiagnosisMutation.mutate();
        }
    };


    const handleCloseModal = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(!showModal);
        onReset();
    };

    const onReset = () => {
        reset();
    };

    const onSubmit = handleSubmit(async () => {
        setAnimation(true);
    });

    const modelResult = watch("model_result");
    const imagerUrl = watch("analyzed_image");

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
                                    <div className="flex">
                                        <label
                                            className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                        >
                                            * Fecha de Creación:
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                        {...register("created_at")}
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
                                                    className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                >
                                                    * Ubicación
                                                </label>
                                            </div>
                                            <textarea
                                                {...register("ubicacion")}
                                                rows={2}
                                                maxLength={5000}
                                                placeholder="Ubicación"
                                                readOnly
                                                className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                            ></textarea>
                                            {errors.ubicacion && (
                                                <span className="text-sm text-red-500">
                                                    {errors.ubicacion.message as string}
                                                </span>
                                            )}

                                            <div className="mt-2">
                                                <div className="flex">
                                                    <label
                                                        className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                    >
                                                        * Imagen Analizada.
                                                    </label>
                                                </div>

                                                <img
                                                    className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                                    src={`http://127.0.0.1:8000${imagerUrl}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
                                        <div className="sm:col-span-12 sm:col-start-1">
                                            <div className="mt-2">
                                                <div className="sm:col-span-2 sm:col-start-1">
                                                    <div className="flex">
                                                        <label
                                                            className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                        >
                                                            * Resultado del modelo.
                                                        </label>
                                                    </div>
                                                    <textarea
                                                        value={
                                                            modelResult && typeof modelResult === "object" && !Array.isArray(modelResult)
                                                                ? Object.entries(modelResult)
                                                                    .map(([key, value]) => {
                                                                        const num = typeof value === "number" ? value : parseFloat(String(value));
                                                                        return `${key}: ${num.toFixed(2)}`;
                                                                    })
                                                                    .join("\n")
                                                                : "Sin datos"
                                                        }
                                                        readOnly
                                                        rows={4}
                                                        className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                            {/* Mensajes de error específicos */}
                                            {errors.modelResult && (
                                                <span className="text-sm text-red-500">
                                                    {errors.modelResult.message as string}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-8 grid grid-cols-1 gap-1 lg:grid-cols-8 lg:gap-8">
                                        <div className="sm:col-span-12 sm:col-start-1">
                                            <div className="mt-2">
                                                <div className="sm:col-span-2 sm:col-start-1">
                                                    <div className="flex">
                                                        <label
                                                            className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                        >
                                                            * Respuesta del modelo.
                                                        </label>
                                                    </div>
                                                    <textarea
                                                        {...register("model_answer")}
                                                        rows={10}
                                                        maxLength={5000}
                                                        readOnly
                                                        placeholder="Respuesta del modelo"
                                                        className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            {/* Mensajes de error específicos */}
                                            {errors.model_answer && (
                                                <span className="text-sm text-red-500">
                                                    {errors.model_answer.message as string}
                                                </span>
                                            )}
                                            <div className="mt-2">
                                                <div className="sm:col-span-2 sm:col-start-1">
                                                    <div className="flex">
                                                        <label
                                                            className="block text-sm font-medium leading-6 flex-initial mr-2 sm:text-base"
                                                        >
                                                            * Usuario responsable.
                                                        </label>

                                                    </div>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            {...register("user")}
                                                            required
                                                            className="block w-full rounded-md border-0 p-2 shadow-sm ring-1 ring-inset ring-slateGray-300 focus:ring-1 focus:ring-inset focus:ring-slateGray-600 sm:text-base sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="btn-second block w-full"
                                            type="button"
                                            onClick={handleCloseModal}
                                        >
                                            Cerrar
                                        </button>
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

export default DiagnosisDetailsModal;