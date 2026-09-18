import React, { useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Tooltip } from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import { getRoleList, updateRole, deleteRole } from "../../../util/roleApi";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { Navigate } from "react-router-dom";
import { isLocationMasterReadOnly } from "../../../util/util";
import { MasterFilterBar, PageHeader } from "../../../Component/UI";
import { endLoading, startLoading } from "../../../store/authSlice";
import { useDispatch } from "react-redux";

export default function Index() {
  const { auth } = UseRedux();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [roleData, setRoleData] = useState(null);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCount = Number(Boolean(selectedSearchByText.trim()));

  const roleListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex w-full gap-2"}>
          <p className={"text-sm text-left"}>
            {record.value.replace("_", " ")}
          </p>
        </div>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <CustomSwitch
            checked={record?.row?.active}
            onClick={(e) =>
              userActionHandler(record?.row, !record?.row?.active, "active")
            }
          />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setDeleteTarget(record?.row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const userActionHandler = async (roleInfo, action, field) => {
    try {
      await updateRole(roleInfo?.id, { ...roleInfo, [field]: action });
      handleRoleList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const deleteAPI = async (id) => {
    try {
      await deleteRole(Array.isArray(id) ? id : [id]);
      handleRoleList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleRoleList = async (isRest = false) => {
    dispatch(startLoading());
    try {
      const text =
        selectedSearchByText && !isRest
          ? {
              name: selectedSearchByText,
            }
          : {};
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...text,
      };
      const data = await getRoleList(params);
      setRoleData(data);
    } catch (e) {
      // Optionally handle error with notification
    } finally {
      dispatch(endLoading());
    }
  };

  useEffect(() => {
    handleRoleList();
  }, []);

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      handleRoleList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [selectedSearchByText]);

  const toggleCardSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (isLocationMasterReadOnly(auth?.user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <PageHeader className="w-full" title="Roles" />
        <MasterFilterBar
          searchPlaceholder="Search role"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => setSelectedSearchByText(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => handleRoleList()}
        />
        <div className={"hidden md:block w-full min-w-0"}>
        <CustomTable
          columns={roleListColumn}
          data={roleData}
          name={"role"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"nativeList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
          pagination={false}
          onDeleteSelected={deleteAPI}
          deleteEntity="role"
        />
        </div>
        <MasterMobileCards
          rows={roleData?.data || []}
          emptyText="No roles"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={true}
          getTitle={(row) => String(row.name || "").replace(/_/g, " ")}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onDelete={(row) => setDeleteTarget(row)}
          showPagination={false}
          onDeleteSelected={deleteAPI}
          deleteEntity="role"
        />
      </ContainerPage>
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="role"
        ids={deleteTarget ? [deleteTarget.id] : []}
        name={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deleteAPI(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
