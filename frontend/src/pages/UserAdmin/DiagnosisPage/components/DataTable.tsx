import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Diagosis } from "../../../../interfaces";
import { getDiagnosis } from '../../../../services/diagnosis_api';
import DiagnosisDetailsModal from "./ModalDiagnosis";

const DataTableComponent: React.FC = () => {
    const [data, setData] = useState<Diagosis[]>([]);
    const [filteredData, setFilteredData] = useState<Diagosis[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");


    const fetchData = async () => {
        try {
            const data = await getDiagnosis();
            setData(data);
            setFilteredData(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);

        const filtered = data.filter((item) =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(event.target.value.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const columns = [
        {
            name: "#",
            selector: (row: Diagosis) => row.id ?? 0,
            sortable: true,
        },
        {
            name: "Resultado",
            sortable: false,
            cell: (row: Diagosis) => (
                <div data-label="Resultado">
                    {Object.entries(row.model_result ?? {}).map(([clave, valor]) => (
                        <div key={clave}>
                            {typeof valor === "number" ? `${clave}: ${valor.toFixed(2)}` : `${clave}: N/A`}
                        </div>
                    ))}
                </div>
            )
        },
        {
            name: "Usuario",
            selector: (row: Diagosis) => row.user,
            sortable: true,
        },
        {
            name: "Fecha de Creación",
            selector: (row: Diagosis) => {
                const dat = new Date(row.created_at);
                return !isNaN(dat.getTime())
                    ? dat.toISOString().split("T")[0]
                    : "Fecha no válida";
            },
            sortable: true,
        },
        {
            name: "Acciones",
            cell: (row: Diagosis) => (
                <td className="p-4 flex justify-start">
                    <DiagnosisDetailsModal
                        title=""
                        style={"hover:text-chileanFire-500"}
                        content={"Ver Diagnóstico"}
                        id={row.id}
                    />
                </td>
            ),
        },
    ];

    const localization = {
        pagination: {
            rowsPerPageText: "Filas por página",
            rangeSeparatorText: "de",
        },

        noDataComponent: "No hay registros para mostrar",
    };

    return (
        <>
            <input
                type="text"
                placeholder="Buscar..."
                value={searchText}
                onChange={handleSearch}
                style={{
                    marginBottom: "20px",
                    padding: "8px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "2px solid #ccc",
                    width: "300px",
                }}
            />
            <DataTable
                columns={columns}
                data={filteredData}
                progressPending={loading}
                pagination
                paginationComponentOptions={{
                    ...localization.pagination,
                }}
                noDataComponent={localization.noDataComponent}
                customStyles={{
                    headCells: {
                        style: {
                            fontSize: "16px",
                            fontWeight: "bold",
                            backgroundColor: "#f4f4f4",
                        },
                    },
                    cells: {
                        style: {
                            fontSize: "14px",
                            padding: "10px",
                        },
                    },
                }}
            />
        </>
    );
};

export default DataTableComponent;