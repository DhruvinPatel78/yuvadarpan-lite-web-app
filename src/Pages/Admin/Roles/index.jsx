import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box, Grid, Tooltip } from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import CustomInput from "../../../Component/Common/customInput";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import { getRoleList, updateRole, deleteRole } from "../../../util/roleApi";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { Navigate } from "react-router-dom";
import { isLocationMasterReadOnly } from "../../../util/util";
import { PageHeader, FilterActions } from "../../../Component/UI";

export default function Index() {
  const { auth } = UseRedux();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [roleData, setRoleData] = useState(null);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

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
    }
  };

  useEffect(() => {
    handleRoleList();
  }, []);

  const handleReset = () => {
    setSelectedSearchByText("");
    handleRoleList(true);
  };

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
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomInput
              type={"text"}
              placeholder={"Enter Search Role"}
              name={"name"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => setSelectedSearchByText(e.target.value)}
            />
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className={"flex justify-start items-center gap-4"}
            >
              <FilterActions
                onSubmit={() => handleRoleList()}
                onReset={handleReset}
                showReset={Boolean(selectedSearchByText)}
              />
            </Grid>
          </Grid>
        </CustomAccordion>
        <div className={"hidden md:block w-full"}>
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
