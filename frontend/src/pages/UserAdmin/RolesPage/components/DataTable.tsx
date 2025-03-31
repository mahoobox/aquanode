import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Role } from "../../../../interfaces";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { getRoles, deleteRole } from "../../../../services/roles.api";

const DataTableComponent: React.FC = () => {
  const [data, setData] = useState<Role[]>([]);
  const [filteredData, setFilteredData] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const fetchData = async () => {
    try {
      const data = await getRoles();
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
      selector: (row: Role) => row.id,
      sortable: true,
      cell: (row: Role) => <span data-label="Id">{row.id ?? 0 }</span>
    },
    {
      name: "Nombre",
      selector: (row: Role) => row.name,
      sortable: true,
      cell: (row: Role) => <span data-label="Nombre">{row.name}</span>
    },
    {
      name: "Fecha de creación",
      selector: (row: Role) => {
        const dat = new Date();
        return !isNaN(dat.getTime())
          ? dat.toISOString().split("T")[0]
          : "Fecha no válida";
      },
      sortable: true,
    },
    {
      name: "Fecha de Actualización",
      selector: (row: Role) => {
        const dat = new Date();
        return !isNaN(dat.getTime())
          ? dat.toISOString().split("T")[0]
          : "Fecha no válida";
      },
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: Role) => (
        <td className="p-4 flex justify-start">
          <button
            className={`flex justify-between rounded-lg px-2 py-1 text-sm font-semibold text-apple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-600 sm:text-lg tracking-wider `}
          >
            <DocumentIcon
              style={{ width: "20px", height: "20px", alignItems: "center", color: "rgb(49 115 34 / var(--tw-text-opacity))" }}  
            />
          </button>
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