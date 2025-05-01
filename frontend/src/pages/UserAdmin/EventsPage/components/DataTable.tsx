import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useContext } from "react";
import { AdminContext } from "../../../../contexts/AdminContext";
import { Events } from "../../../../interfaces";
import { getEvents } from '../../../../services/events_api';
import { getUser } from "../../../../services/users.api";
import { MdMarkChatUnread, MdMarkChatRead } from 'react-icons/md';
import { useQuery } from "@tanstack/react-query";
import DiagnosisDetailModal from "../../../../components/DiagnosisDetailModal";

const DataTableComponent: React.FC = () => {
    const [data, setData] = useState<Events[]>([]);
    const [filteredData, setFilteredData] = useState<Events[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");
    const { userId } = useContext(AdminContext);

    const {
        data: user,
    } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,
    });

    const fetchData = async () => {
        try {
            const data = await getEvents();
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
            selector: (row: Events) => row.id ?? 0,
            sortable: true,
            cell: (row: Events) => {
                const icon = row.is_read === true
                    ? <MdMarkChatRead className="h-5 w-5 text-green-500 mr-2" />
                    : row.is_read === false
                        ? <MdMarkChatUnread className="h-5 w-5 text-red-500 mr-2" />
                        : null;

                return (
                    <span data-label="Id" className="flex items-center">
                        {icon}
                        {row.id ?? 0}
                    </span>
                );
            }
        },
        {
            name: "Evento",
            selector: (row: Events) => row.events,
            sortable: true,
            cell: (row: Events) => <span data-label="Evento">{row.events}</span>
        },
        {
            name: "Oservaciones",
            selector: (row: Events) => row.observation,
            sortable: true,
            cell: (row: Events) => <span data-label="Oservaciones">{row.observation}</span>
        },
        {
            name: "Aprobado",
            selector: (row: Events) => row.aprobbed,
            sortable: true,
            cell: (row: Events) => {
                if (row.aprobbed === null) {
                    return <span data-label="aprovado"></span>;
                } else if (row.aprobbed === true) {
                    return <span data-label="aprovado">Aprobado</span>;
                } else {
                    return <span data-label="aprovado">Desaprobado</span>;
                }
            }
        },
        {
            name: "Fecha de Creación",
            selector: (row: Events) => {
                const dat = new Date(row.created_at);
                return !isNaN(dat.getTime())
                    ? dat.toISOString().split("T")[0]
                    : "Fecha no válida";
            },
            sortable: true,
        },
        {
            name: "Acciones",
            cell: (row: Events) => (
                <td className="p-4 flex justify-start">
                    <DiagnosisDetailModal
                        title=""
                        style={"hover:text-chileanFire-500"}
                        content={"Ver Evento"}
                        id={row.id}
                        user={user}
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