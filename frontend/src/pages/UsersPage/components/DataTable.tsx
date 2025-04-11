import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { User } from "../../../interfaces";
import UsersModal from "./UsersModal";
import { getUsers } from "../../../services/users.api";

const DataTableComponent: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const fetchData = async () => {
    try {
      const data = await getUsers();
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
      selector: (row: User) => row.id ?? 0,
      sortable: true,
      cell: (row: User) => <span data-label="Id">{row.id ??0}</span>
    },
    {
      name: "Nombre",
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row: User) => <span data-label="Nombre">{row.name}</span>
    },
    {
      name: "Correo Electronico",
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row: User) => <span data-label="Correo">{row.email}</span>
    },
    {
      name: "Rol",
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row: User) => <span data-label="Rol">{row.role}</span>
    },
    {
      name: "Fecha de Actualización",
      selector: () => {
        const dat = new Date();
        return !isNaN(dat.getTime())
          ? dat.toISOString().split("T")[0]
          : "Fecha no válida";
      },
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: User) => (
        <td className="p-4 flex justify-start">
          <UsersModal
            title={""}
            id={row.id}
            style={"hover:text-chileanFire-500"}
            content={"Editar Usuario"}
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