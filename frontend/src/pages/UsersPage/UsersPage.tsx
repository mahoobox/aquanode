import { Card } from "@material-tailwind/react";
import DataTableComponent from "./components/DataTable";
import UsersModal from "./components/UsersModal";

const UsersPage = () => {
    return (
        <>
            <div className="flex justify-between mb-10 mr-5">
                <h1 className="text-4xl font-bold text-matisse-950">
                    Módulo de Usuarios
                </h1>
                <UsersModal
                    title="Crear Usuario"
                    style={
                        "border-solid border-2 border-chileanFire-600 shadow-sm hover:scale-105 transform transition-all duration-500 hover:bg-chileanFire-500 hover:text-matisse-50"
                    }
                    content={"Crear Usuario"}
                />
            </div>
            <div className="overflow-x-auto">
                <Card className="h-full w-full" placeholder={"Encuestas"}>
                    <DataTableComponent />
                </Card>
            </div>
        </>
    );
};

export default UsersPage;