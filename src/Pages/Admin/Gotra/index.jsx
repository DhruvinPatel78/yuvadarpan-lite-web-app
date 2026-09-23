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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import BilingualInput from "../../../Component/Common/bilingualInput";
import MasterLangWrap from "../../../Component/Common/masterLangWrap";
import {
  Button as ActionButton,
  FormModal,
  MasterFilterBar,
  PageHeader,
} from "../../../Component/UI";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isLocationMasterReadOnly } from "../../../util/util";
import {
  getGotraList,
  addGotra,
  updateGotra,
  deleteGotra,
} from "../../../util/gotraApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { fillMasterName, toNameEnGuPayload } from "../../../util/bhasha";
import { useFilterCopy } from "../../../i18n/useFilterCopy";

export default function Gotra() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, auth } = UseRedux();
  const copy = useFilterCopy();
  const canManage = !isLocationMasterReadOnly(auth?.user?.role);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [gotraData, setGotraData] = useState(null);
  const [gotraModalData, setGotraModalData] = useState(null);
  const [gotraAddEditModel, setGotraAddEditModel] = useState(false);
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const skipSearchEffect = useRef(true);
  const filterCount = Number(Boolean(selectedSearchByText.trim()));

  const gotraListColumn = [
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
                setGotraModalData(record?.row);
                setGotraAddEditModel(true);
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

  const userActionHandler = async (gotraInfo, action, field) => {
    try {
      await updateGotra(gotraInfo?.id, { ...gotraInfo, [field]: action });
      handleGotraList();
    } catch (e) {
      // keep list as-is if the update fails
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
            if (gotraModalData) {
              await updateGotra(gotraModalData.id, {
                ...rest,
                updatedAt: new Date(),
              });
            } else {
              await addGotra({ ...rest });
            }
          },
          refresh: () => handleGotraList(),
          syncMasters: ["gotra"],
          close: () => {
            resetForm();
            gotraAddEditModalClose();
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
    resetForm,
    handleBlur,
    touched,
    setFieldValue,
    isSubmitting,
  } = formik;

  const gotraAddEditModalClose = () => {
    setGotraAddEditModel(false);
    setGotraModalData(null);
    fillMasterName(setFieldValue, {});
    resetForm();
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteGotra(Array.isArray(id) ? id : [id]),
      refresh: () => handleGotraList(),
      syncMasters: ["gotra"],
    });
  };

  const hasError = Object.keys(errors)?.length || 0;

  const handleGotraList = async (isRest = false) => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      if (!isRest && selectedSearchByText.trim()) {
        params.name = selectedSearchByText.trim();
      }
      const data = await getGotraList(params);
      setGotraData(data);
    } catch (e) {
      // keep previous list if fetch fails
    }
  };

  useEffect(() => {
    handleGotraList();
  }, [page, rowsPerPage]);

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
      handleGotraList();
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
      <Header />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-3"}
      >
        <PageHeader
          className="w-full"
          title="Gotra"
          leading={
            <ActionButton
              type="button"
              variant="secondary"
              className="!min-w-[44px] !px-3"
              icon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate("/admin/surname")}
            >
              Back
            </ActionButton>
          }
          actions={
            canManage ? (
              <ActionButton
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setGotraModalData(null);
                  resetForm();
                  setGotraAddEditModel(true);
                }}
              >
                Add Gotra
              </ActionButton>
            ) : null
          }
        />
        <MasterFilterBar
          searchPlaceholder={copy.searchGotra}
          searchValue={selectedSearchByText}
          onSearchChange={(e) => setSelectedSearchByText(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => handleGotraList()}
          hideFilterBadge={true}
        />
        <div className={"hidden md:block w-full min-w-0"}>
          <CustomTable
            columns={gotraListColumn}
            data={gotraData}
            name={"gotra"}
            pageSize={rowsPerPage}
            setPageSize={setRowsPerPage}
            type={"gotraList"}
            className={"mx-0 w-full"}
            page={page}
            setPage={setPage}
            onDeleteSelected={canManage ? deleteAPI : undefined}
            deleteEntity="gotra"
          />
        </div>
        <MasterMobileCards
          rows={gotraData?.data || []}
          emptyText="No gotras"
          selectedIds={selectedIds}
          onToggleSelect={toggleCardSelection}
          canSelect={canManage}
          activeDisabled={!canManage}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onEdit={
            canManage
              ? (row) => {
                  setGotraModalData(row);
                  setGotraAddEditModel(true);
                  fillMasterName(setFieldValue, row);
                }
              : undefined
          }
          onDelete={canManage ? (row) => setDeleteTarget(row) : undefined}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={gotraData?.total || 0}
          onDeleteSelected={canManage ? deleteAPI : undefined}
          deleteEntity="gotra"
        />
      </ContainerPage>
      {gotraAddEditModel ? (
        <FormModal
          open={gotraAddEditModel}
          onClose={() => gotraAddEditModalClose()}
          title="Gotra"
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
                      id="gotra"
                      label="Gotra"
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
                    {gotraModalData ? "UPDATE" : "ADD"}
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
        entity="gotra"
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
