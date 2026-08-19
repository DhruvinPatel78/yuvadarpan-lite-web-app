import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../../Component/Header";
import ContainerPage from "../../../Component/Container";
import CustomTable from "../../../Component/Common/customTable";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomInput from "../../../Component/Common/customInput";
import { endLoading, startLoading } from "../../../store/authSlice";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly, hideLocationRowActions } from "../../../util/util";
import ConfirmModal, {
  getDeleteDescription,
} from "../../../Component/Common/ConfirmModal";

const omitMetaFields = (row) => {
  const {
    id,
    _id,
    regionCount,
    districtCount,
    cityCount,
    samajCount,
    backTo,
    __v,
    ...rest
  } = row || {};
  return rest;
};

export default function LocationDetails({ config }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, auth } = UseRedux();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const hideRowActions = hideLocationRowActions(auth?.user?.role);

  const parentFromState = location.state || null;
  const [parent, setParent] = useState(parentFromState);
  const [allChildren, setAllChildren] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editRow, setEditRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    name: "",
    label: "",
    zipcode: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const backTo = parentFromState?.backTo || config.listPath;

  const loadChildren = async () => {
    try {
      const data = await config.fetchChildren(id);
      setAllChildren(Array.isArray(data) ? data : []);
    } catch (e) {
      setAllChildren([]);
    }
  };

  useEffect(() => {
    const loadParent = async () => {
      if (parentFromState?.name) {
        setParent(parentFromState);
        return;
      }
      try {
        const data = await config.fetchParent(id);
        setParent(Array.isArray(data) ? data[0] : data);
      } catch (e) {
        // Optionally handle error with notification
      }
    };

    loadParent();
    loadChildren().then(() => setPage(0));
  }, [id, parentFromState, config]);

  useEffect(() => {
    const start = page * rowsPerPage;
    setTableData({
      data: allChildren.slice(start, start + rowsPerPage),
      total: allChildren.length,
    });
  }, [allChildren, page, rowsPerPage]);

  const closeFormModal = () => {
    setEditRow(null);
    setFormOpen(false);
    setEditValues({ name: "", label: "", zipcode: "" });
  };

  const handleAdd = () => {
    setEditRow(null);
    setEditValues({ name: "", label: "", zipcode: "" });
    setFormOpen(true);
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setEditValues({
      name: row?.name || "",
      label: row?.label || "",
      zipcode: row?.zipcode || "",
    });
    setFormOpen(true);
  };

  const isFormValid = () => {
    if (!editValues.name?.trim()) return false;
    if (config.hasSamajFields && !editRow) {
      return Boolean(String(editValues.label || "").trim() && String(editValues.zipcode || "").trim());
    }
    return true;
  };

  const handleSave = async () => {
    if (!isFormValid()) return;
    try {
      dispatch(startLoading());
      if (editRow?.id) {
        const payload = {
          ...omitMetaFields(editRow),
          name: editValues.name.trim(),
          updatedAt: new Date(),
        };
        if (config.hasSamajFields) {
          payload.label = editValues.label;
          payload.zipcode = editValues.zipcode;
        }
        await config.updateChild(editRow.id, payload);
      } else {
        const parentId = parent?.id || id;
        const payload = {
          ...(config.getChildPayload?.(parent, parentId) || {}),
          name: editValues.name.trim(),
        };
        if (config.hasSamajFields) {
          payload.label = editValues.label;
          payload.zipcode = editValues.zipcode;
        }
        await config.addChild(payload);
      }
      closeFormModal();
      await loadChildren();
    } catch (e) {
      // Optionally handle error with notification
    } finally {
      dispatch(endLoading());
    }
  };

  const handleDelete = async (rowId) => {
    try {
      const ids = Array.isArray(rowId) ? rowId : [rowId];
      await config.deleteChild(ids);
      await loadChildren();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const handleToggleActive = async (row) => {
    try {
      await config.updateChild(row.id, {
        ...omitMetaFields(row),
        active: !row.active,
      });
      await loadChildren();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    ...(config.countField
      ? [
          {
            field: config.countField,
            headerName: config.countHeader,
            flex: 1,
            headerClassName: "bg-[#572a2a] text-white outline-none",
            cellClassName:
              "items-center justify-center flex px-8 outline-none",
            filterable: false,
            sortable: false,
            renderCell: (record) => record?.row?.[config.countField] ?? 0,
          },
        ]
      : []),
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <CustomSwitch
            checked={record?.row?.active}
            disabled={!canManage}
            onClick={() => {
              if (!canManage) return;
              handleToggleActive(record?.row);
            }}
          />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 140,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-center items-center"}>
          {config.childViewPath ? (
            <Tooltip title={"View"}>
              <VisibilityIcon
                className={"text-primary cursor-pointer"}
                onClick={() =>
                  navigate(config.childViewPath(record?.row?.id), {
                    state: {
                      ...record?.row,
                      backTo: location.pathname,
                    },
                  })
                }
              />
            </Tooltip>
          ) : null}
          {canManage ? (
            <>
              <Tooltip title={"Edit"}>
                <ModeEditIcon
                  className={"text-primary cursor-pointer"}
                  onClick={() => handleEdit(record?.row)}
                />
              </Tooltip>
              <Tooltip title={"Delete"}>
                <DeleteIcon
                  className={"text-primary cursor-pointer"}
                  onClick={() => setDeleteTarget(record?.row)}
                />
              </Tooltip>
            </>
          ) : null}
        </div>
      ),
    },
  ].filter(
    (column) =>
      column.field !== "action" ||
      (!hideRowActions && (canManage || config.childViewPath))
  );

  return (
    <Box>
      <Header backBtn={true} btnAction={backTo} />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <div className={"flex w-full items-center justify-between my-2"}>
          <div className={"flex items-center gap-2"}>
            <Tooltip title="Back">
              <IconButton onClick={() => navigate(backTo)}>
                <ArrowBackIcon className={"text-primary"} />
              </IconButton>
            </Tooltip>
            <p className={"text-3xl font-bold"}>
              {parent?.name
                ? `${parent.name} Details`
                : `${config.entityLabel} Details`}
            </p>
          </div>
          {canManage ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              className={"bg-primary"}
              onClick={handleAdd}
            >
              {config.addButtonLabel}
            </Button>
          ) : null}
        </div>
        <p className={"text-xl font-semibold"}>{config.listTitle}</p>
        <CustomTable
          columns={columns}
          data={tableData}
          name={config.listTitle}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"userList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
          onDeleteSelected={canManage ? handleDelete : undefined}
        />
      </ContainerPage>
      {formOpen ? (
        <Modal
          open={formOpen}
          onClose={closeFormModal}
          sx={{
            "& .MuiModal-backdrop": {
              backdropFilter: "blur(2px) !important",
              background: "#878b9499 !important",
            },
          }}
          className="flex justify-center items-center"
        >
          <Paper
            elevation={10}
            className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none"
          >
            <div className={"flex flex-row justify-between"}>
              <span className={"text-2xl font-bold"}>{config.childLabel}</span>
              <Tooltip title={"Close"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={closeFormModal}
                />
              </Tooltip>
            </div>
            <Grid container className={"w-full pt-4"} spacing={2}>
              <Grid item xs={12}>
                <FormControl className={"w-full flex gap-4"}>
                  <CustomInput
                    name={"name"}
                    label={config.childLabel}
                    value={editValues.name}
                    variant="outlined"
                    onChange={(e) =>
                      setEditValues((pre) => ({ ...pre, name: e.target.value }))
                    }
                  />
                  {config.hasSamajFields ? (
                    <>
                      <CustomInput
                        name={"label"}
                        label="Label"
                        value={editValues.label}
                        variant="outlined"
                        onChange={(e) =>
                          setEditValues((pre) => ({
                            ...pre,
                            label: e.target.value,
                          }))
                        }
                      />
                      <CustomInput
                        name={"zipcode"}
                        label="Zipcode"
                        value={editValues.zipcode}
                        variant="outlined"
                        onChange={(e) =>
                          setEditValues((pre) => ({
                            ...pre,
                            zipcode: e.target.value,
                          }))
                        }
                      />
                    </>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12} className={"flex justify-center items-center"}>
                {loading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <button
                    className={`bg-[#572a2a] text-white w-full p-3 normal-case text-base rounded-lg font-bold ${
                      !isFormValid() ? "opacity-50" : "opacity-100"
                    }`}
                    type={"button"}
                    disabled={!isFormValid()}
                    onClick={handleSave}
                  >
                    {editRow ? "UPDATE" : "ADD"}
                  </button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      ) : null}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete confirmation"
        description={getDeleteDescription(deleteTarget?.name)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await handleDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
