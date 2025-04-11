import { Card } from "@material-tailwind/react";
import DataTableComponent from "./components/DataTable";

const EventsPage = () => {
    return (
        <>
            <div className="flex justify-between mb-10 mr-5">
                <h1 className="text-4xl font-bold text-matisse-950">
                    Módulo de Eventos
                </h1>              
            </div>
            <div className="overflow-x-auto">
                {/* @ts-ignore */}
                <Card className="h-full w-full" placeholder={"Eventos"}>
                    <DataTableComponent />
                </Card>
            </div>
        </>
    );
};

export default EventsPage;