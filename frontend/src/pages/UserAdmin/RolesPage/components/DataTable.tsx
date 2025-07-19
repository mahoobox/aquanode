import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Role } from "../../../../interfaces";
import { toast } from "react-hot-toast";
import RolesModal from "./RolesModal";
import AlertDelete from "../../../../components/AlertDelete.tsx";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getRoles, deleteRole } from "../../../../services/roles.api";
import { NewError } from "../../../../interfaces/index.ts";

const DataTableComponent: React.FC = () => {
  const [shouldDelete, setShouldDelete] = useState(false);
  const [id, setId] = useState<string>("");
  const [data, setData] = useState<Role[]>([]);
  const [filteredData, setFilteredData] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  

  const queryClient = useQueryClient();
  
	const deleteMutation = useMutation({
		mutationFn: () => deleteRole(Number(id)),
		onSuccess: () => {
			toast.success("Rol eliminado con éxito.");
			queryClient.setQueryData(["roles"], (oldData: Role[] | undefined) =>
				oldData ? oldData.filter((role) => role.id !== Number(id)) : oldData
			);
		},
		onError: (error: NewError) => {
			toast.error(error.response?.data?.detail || "Error al eliminar el rol.");
		},
	});

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

  const handleDelete = (id: string) => {
    setId(id);
    setShouldDelete(!shouldDelete);
  };

  useEffect(() => {
    if (shouldDelete) {
			deleteMutation.mutateAsync();
			setShouldDelete(false);
		}
    fetchData();
  }, [shouldDelete, deleteMutation]);

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
      selector: (row: Role) => row.id ?? 0,
      sortable: true,
      cell: (row: Role) => <span data-label="Id">{row.id ?? 0}</span>
    },
    {
      name: "Nombre",
      selector: (row: Role) => row.name,
      sortable: true,
      cell: (row: Role) => <span data-label="Nombre">{row.name}</span>
    },
    {
      name: "Fecha de Creación",
      selector: (row: Role) => {
        const dat = new Date(row.created_at);
        return !isNaN(dat.getTime())
          ? dat.toISOString().split("T")[0]
          : "Fecha no válida";
      },
      sortable: true,
    },
    {
      name: "Fecha de Actualización",
      selector: (row: Role) => {
        const dat = new Date(row.updated_at);
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
          <RolesModal
            title={""}
            id={row.id}
            style={"hover:text-chileanFire-500"}
            content={"Editar Rol"}
          />
          <AlertDelete
            title={"Rol"}
            onDelete={handleDelete}
            id={row && row.id ? row.id.toString() : ""}
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