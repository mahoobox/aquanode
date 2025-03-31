import { Card } from "@material-tailwind/react";
import DataTableComponent from "./components/DataTable";
import RolesModal from "./components/RolesModal";

const RolesPage = () => {
    return (
        <>
            <div className="sm:flex justify-between mb-12">
                <div className="sm:flex mb-4 sm:mb-0">
                    <h1 className="text-4xl font-bold text-matisse-950 mb-8 sm:mb-0">
                        Modulo de Roles
                    </h1>
                </div>
                <RolesModal
                    title="Crear Rol"
                    style={
                        "border-solid border-2 border-chileanFire-600 shadow-sm hover:scale-105 transform transition-all duration-500 hover:bg-chileanFire-500 hover:text-matisse-50"
                    }
                    content={"Crear Rol"}
                />
            </div>
            <div className="overflow-x-auto">
                <Card className="h-full w-full" placeholder={"Roles"}>
                    <DataTableComponent />
                </Card>
            </div>
        </>
    );
};

export default RolesPage;
