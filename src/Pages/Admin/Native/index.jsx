import React, { useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  FormControl,
  Grid,
  Tooltip,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import BilingualInput from "../../../Component/Common/bilingualInput";
import MasterLangWrap from "../../../Component/Common/masterLangWrap";
import { Button as ActionButton, FormModal, MasterFilterBar, PageHeader } from "../../../Component/UI";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly } from "../../../util/util";
import {
  getNativeList,
  addNative,
  updateNative,
  deleteNative,
} from "../../../util/nativeApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { fillMasterName, toNameEnGuPayload } from "../../../util/bhasha";

export default function Index() {
  const dispatch = useDispatch();
  const { loading, auth } = UseRedux();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [nativeData, setNativeData] = useState(null);
  const [nativeModalData, setNativeModalData] = useState(null);
  const [nativeAddEditModel, setNativeAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCount = Number(Boolean(selectedSearchByText.trim()));

  useEffect(() => {
    handleNativeList();
  }, [page, rowsPerPage]);

  const nativeListColumn = [
    {
      field: "name",
      headerName: "Name",
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
              onClick={() => {
                setNativeModalData(record?.row);
                setNativeAddEditModel(!nativeAddEditModel);
                fillMasterName(setFieldValue, record?.row);
              }}
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

  const userActionHandler = async (nativeInfo, action, field) => {
    try {
      await updateNative(nativeInfo?.id, { ...nativeInfo, [field]: action });
      handleNativeList();
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      nameGu: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const { confirmPassword, ...rest } = toNameEnGuPayload(values);
        await completeModalMutation(dispatch, {
          mutate: async () => {
            if (nativeModalData) {
              await updateNative(nativeModalData.id, {
                ...rest,
                updatedAt: new Date(),
              });
            } else {
              await addNative({ ...rest });
            }
          },
          refresh: () => handleNativeList(),
          close: () => {
            resetForm();
            nativeAddEditModalClose();
          },
        });
      } catch (e) {
        // keep modal open if save fails
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
    }),
  });
  const {
    errors,
    values,
    resetForm,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
    isSubmitting,
  } = formik;

  const nativeAddEditModalClose = () => {
    setNativeAddEditModel(!nativeAddEditModel);
    setNativeModalData(null);
    fillMasterName(setFieldValue, {});
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteNative(Array.isArray(id) ? id : [id]),
      refresh: () => handleNativeList(),
    });
  };

  const hasError = Object.keys(errors)?.length || 0;

  const handleNativeList = async (isRest = false) => {
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
      const data = await getNativeList(params);
      setNativeData(data);
    } catch (e) {
      // Optionally handle error with notification
    }
  };

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
      handleNativeList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [selectedSearchByText]);

  const toggleCardSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <PageHeader
          className="w-full"
          title="Native"
          actions={
            canManage ? (
              <ActionButton
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setNativeAddEditModel(!nativeAddEditModel);
                }}
              >
                Add Native
              </ActionButton>
            ) : null
          }
        />
        <MasterFilterBar
          searchPlaceholder="Search native"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => setSelectedSearchByText(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => handleNativeList()}
        />
        <div className={"hidden md:block w-full min-w-0"}>
        <CustomTable
          columns={nativeListColumn}
          data={nativeData}
          name={"native"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          type={"nativeList"}
          className={"mx-0 w-full"}
          page={page}
          setPage={setPage}
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="native"
        />
        </div>
        <MasterMobileCards
          rows={nativeData?.data || []}
          emptyText="No natives"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canManage}
          activeDisabled={!canManage}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onEdit={
            canManage
              ? (row) => {
                  setNativeModalData(row);
                  setNativeAddEditModel(true);
                  fillMasterName(setFieldValue, row);
                }
              : undefined
          }
          onDelete={canManage ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={nativeData?.total || 0}
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="native"
        />
      </ContainerPage>
      {nativeAddEditModel ? (
        <FormModal
          open={nativeAddEditModel}
          onClose={() => nativeAddEditModalClose()}
          title="Native"
        >
            <MasterLangWrap>
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full pt-1 overflow-visible"
                }
              >
                <Grid container className={"w-full"} spacing={2}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full"}>
                      <BilingualInput
                        enName={"name"}
                        id="native"
                        label="Native"
                        variant="outlined"
                        onBlur={handleBlur}
                        errors={touched?.name && errors?.name && errors?.name}
                      />
                    </FormControl>
                  </Grid>
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
                      {nativeModalData ? "UPDATE" : "ADD"}
                    </ActionButton>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
            </MasterLangWrap>
        </FormModal>
      ) : null}
      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        entity="native"
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
