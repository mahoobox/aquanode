import { useState, MouseEvent } from "react";
import {
    TrashIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface AlertDeleteProps {
    title: string;
    id: string;
    onDelete: (id: string) => void;
}

const AlertDelete = ({ title, id, onDelete }: AlertDeleteProps) => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(false);
        onDelete(id);
    };

    const handleShowModal = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(!showModal);
    };

    return (
        <>
            <button
                className="text-indigo-700 hover:text-indigo-500 ml-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus:ring-opacity-50 rounded"
                onClick={handleShowModal}
            >
                <TrashIcon className="w-auto h-6 mr-3" aria-hidden="true" />
            </button>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-4xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                                {/*body*/}
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-full">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 sm:mx-0 sm:h-20 sm:w-20">
                                            <ExclamationTriangleIcon
                                                className="h-12 w-12 text-purple-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <div className="text-base sm:text-xl font-semibold leading-6 text-matisse-950">
                                                Eliminar {title}
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-base sm:text-lg text-matisse-950">
                                                    Está seguro que desea eliminar el {title}?{" "}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="rounded-md border-solid border-2 border-indigo-600 px-5 py-1 mx-10 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-purple-400  hover:text-matisse-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-600 sm:text-lg tracking-wider"
                                        type="button"
                                        onClick={handleShowModal}
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-matisse-50 shadow-sm  hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:text-base tracking-wider"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
};

export default AlertDelete;
