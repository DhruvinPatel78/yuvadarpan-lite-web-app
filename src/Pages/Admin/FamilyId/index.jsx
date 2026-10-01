import React, { useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import AddIcon from "@mui/icons-material/Add";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import {
  Button as ActionButton,
  FormModal,
  IconBtn,
  MasterFilterBar,
  PageHeader,
} from "../../../Component/UI";
import { useDispatch } from "react-redux";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly } from "../../../util/util";
import {
  getFamilyIdList,
  addFamilyId,
  updateFamilyId,
  deleteFamilyId,
} from "../../../util/familyIdApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { useFilterCopy } from "../../../i18n/useFilterCopy";

export default function Index() {
  const dispatch = useDispatch();
  const { loading, auth } = UseRedux();
  const copy = useFilterCopy();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [familyIdData, setFamilyIdData] = useState(null);
  const [familyIdModalData, setFamilyIdModalData] = useState(null);
  const [familyIdAddEditModel, setFamilyIdAddEditModel] = useState(false);
  const [pendingFamilyIds, setPendingFamilyIds] = useState([]);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCount = Number(Boolean(selectedSearchByText.trim()));

  const handleFamilyIdList = async (isRest = false) => {
    try {
      const text =
        selectedSearchByText && !isRest
          ? {
              familyId: selectedSearchByText,
            }
          : {};
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...text,
      };
      const data = await getFamilyIdList(params);
      setFamilyIdData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  useEffect(() => {
    handleFamilyIdList();
  }, [page, rowsPerPage]);

  const userActionHandler = async (row, action, field) => {
    try {
      await updateFamilyId(row?.id, { ...row, [field]: action });
      handleFamilyIdList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const formik = useFormik({
    initialValues: {
      familyId: "",
    },
    onSubmit: async (values, { resetForm, setFieldError }) => {
      if (familyIdModalData) {
        const nextId = String(values.familyId || "").trim();
        if (!nextId) {
          setFieldError("familyId", "Required");
          return;
        }
        try {
          await completeModalMutation(dispatch, {
            mutate: () =>
              updateFamilyId(familyIdModalData.id, {
                familyId: nextId,
                updatedAt: new Date(),
              }),
            refresh: () => handleFamilyIdList(),
            syncMasters: ["familyId"],
            close: () => {
              resetForm();
              familyIdAddEditModalClose();
            },
          });
        } catch (e) {
          // keep modal open if save fails
        }
        return;
      }

      const draft = String(values.familyId || "").trim();
      const familyIds = [...pendingFamilyIds];
      if (
        draft &&
        !familyIds.some((item) => item.toLowerCase() === draft.toLowerCase())
      ) {
        familyIds.push(draft);
      }
      if (!familyIds.length) {
        setFieldError("familyId", "Add at least one Family ID");
        return;
      }

      try {
        await completeModalMutation(dispatch, {
          mutate: () =>
            familyIds.length === 1
              ? addFamilyId({ familyId: familyIds[0] })
              : addFamilyId({ familyIds }),
          refresh: () => handleFamilyIdList(),
          syncMasters: ["familyId"],
          close: () => {
            resetForm();
            familyIdAddEditModalClose();
          },
        });
      } catch (e) {
        // keep modal open if save fails
      }
    },
  });

  const {
    errors,
    values,
    resetForm,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
    setFieldError,
    isSubmitting,
  } = formik;

  const familyIdAddEditModalClose = () => {
    setFamilyIdAddEditModel(false);
    setFamilyIdModalData(null);
    setPendingFamilyIds([]);
    resetForm();
  };

  const openAddModal = () => {
    setFamilyIdModalData(null);
    setPendingFamilyIds([]);
    resetForm();
    setFamilyIdAddEditModel(true);
  };

  const openEditModal = (row) => {
    setFamilyIdModalData(row);
    setPendingFamilyIds([]);
    setFieldValue("familyId", row?.familyId || "");
    setFamilyIdAddEditModel(true);
  };

  const addPendingFamilyId = () => {
    const nextId = String(values.familyId || "").trim();
    if (!nextId) {
      setFieldError("familyId", "Required");
      return;
    }
    const exists = pendingFamilyIds.some(
      (item) => item.toLowerCase() === nextId.toLowerCase()
    );
    if (exists) {
      setFieldError("familyId", "Already added");
      return;
    }
    setPendingFamilyIds((prev) => [...prev, nextId]);
    setFieldValue("familyId", "");
    setFieldError("familyId", undefined);
  };

  const removePendingFamilyId = (index) => {
    setPendingFamilyIds((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteFamilyId(Array.isArray(id) ? id : [id]),
      refresh: () => handleFamilyIdList(),
      syncMasters: ["familyId"],
    });
  };

  const hasError = Object.keys(errors)?.length || 0;

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      if (page !== 0) {
        setPage(0);
        return;
      }
      handleFamilyIdList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [selectedSearchByText]);

  const toggleCardSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const familyIdListColumn = [
    {
      field: "familyId",
      headerName: "Family ID",
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
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
            disabled={!canManage}
            onClick={() => {
              if (!canManage) return;
              userActionHandler(record?.row, !record?.row?.active, "active");
            }}
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
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => openEditModal(record?.row)}
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setDeleteTarget(record?.row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ].filter((column) => canManage || column.field !== "action");

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <PageHeader
          className="w-full"
          title="Family ID"
          actions={
            canManage ? (
              <ActionButton
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={openAddModal}
              >
                Add Family ID
              </ActionButton>
            ) : null
          }
        />
        <MasterFilterBar
          searchPlaceholder={copy.searchFamilyId || "Search family ID"}
          searchValue={selectedSearchByText}
          onSearchChange={(e) => setSelectedSearchByText(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => handleFamilyIdList()}
        />
        <div className={"hidden md:block w-full min-w-0"}>
          <CustomTable
            columns={familyIdListColumn}
            data={familyIdData}
            name={"familyId"}
            pageSize={rowsPerPage}
            setPageSize={setRowsPerPage}
            type={"familyIdList"}
            className={"mx-0 w-full"}
            page={page}
            setPage={setPage}
            onDeleteSelected={canManage ? deleteAPI : undefined}
            deleteEntity="familyId"
          />
        </div>
        <MasterMobileCards
          rows={familyIdData?.data || []}
          emptyText="No family IDs"
          getTitle={(row) => row?.familyId || "-"}
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canManage}
          activeDisabled={!canManage}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onEdit={canManage ? openEditModal : undefined}
          onDelete={canManage ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={familyIdData?.total || 0}
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="familyId"
        />
      </ContainerPage>
      {familyIdAddEditModel ? (
        <FormModal
          open={familyIdAddEditModel}
          onClose={() => familyIdAddEditModalClose()}
          title={familyIdModalData ? "Edit Family ID" : "Add Family ID"}
        >
          <FormikProvider value={formik}>
            <Form
              className={"gap-4 flex flex-col w-full pt-1 overflow-visible"}
            >
              <Grid container className={"w-full"} spacing={2}>
                <Grid item xs={12}>
                  <div className="flex items-start gap-2 w-full">
                    <FormControl className={"w-full"}>
                      <TextField
                        name="familyId"
                        label="Family ID"
                        variant="outlined"
                        value={values.familyId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={(event) => {
                          if (!familyIdModalData && event.key === "Enter") {
                            event.preventDefault();
                            addPendingFamilyId();
                          }
                        }}
                        error={Boolean(touched?.familyId && errors?.familyId)}
                        helperText={
                          touched?.familyId && errors?.familyId
                            ? errors.familyId
                            : undefined
                        }
                        fullWidth
                      />
                    </FormControl>
                    {!familyIdModalData ? (
                      <IconBtn
                        type="button"
                        aria-label="Add family ID"
                        className="!h-14 !w-14 !min-w-14 md:!h-14 md:!w-14 !rounded-lg shrink-0"
                        onClick={addPendingFamilyId}
                      >
                        <AddOutlinedIcon />
                      </IconBtn>
                    ) : null}
                  </div>
                </Grid>
                {!familyIdModalData && pendingFamilyIds.length > 0 ? (
                  <Grid item xs={12}>
                    <div className="flex flex-col gap-2 w-full">
                      {pendingFamilyIds.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2"
                        >
                          <span className="text-sm text-primary font-medium">
                            {item}
                          </span>
                          <IconButton
                            type="button"
                            aria-label={`Remove ${item}`}
                            size="small"
                            onClick={() => removePendingFamilyId(index)}
                          >
                            <RemoveOutlinedIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </Grid>
                ) : null}
                <Grid
                  item
                  xs={12}
                  className={"flex justify-center items-center"}
                >
                  <ActionButton
                    type={"submit"}
                    fullWidth
                    disabled={hasError}
                    loading={loading || isSubmitting}
                  >
                    {familyIdModalData ? "UPDATE" : "ADD"}
                  </ActionButton>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </FormModal>
      ) : null}
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="familyId"
        ids={deleteTarget ? [deleteTarget.id] : []}
        name={deleteTarget?.familyId}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deleteAPI(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
