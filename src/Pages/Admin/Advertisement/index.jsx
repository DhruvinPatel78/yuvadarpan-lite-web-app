import React, { useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  Checkbox,
  CircularProgress,
  Grid,
  TablePagination,
} from "@mui/material";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomInput from "../../../Component/Common/customInput";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import PhotoCropModal from "../../../Component/Common/PhotoCropModal";
import LoadableImage from "../../../Component/Common/LoadableImage";
import AdvertisementSortableTable from "./AdvertisementSortableTable";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import ContainerPage from "../../../Component/Container";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Button as ActionButton,
  Card,
  FormModal,
  MasterFilterBar,
  PageHeader,
  Button,
} from "../../../Component/UI";
import { useDispatch } from "react-redux";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import { UseRedux } from "../../../Component/useRedux";
import { isAdmin } from "../../../util/util";
import {
  AD_DISPLAY_PAGES,
  addAdvertisement,
  deleteAdvertisement,
  formatDisplayOn,
  getAdvertisementList,
  reorderAdvertisement,
  updateAdvertisement,
  uploadAdvertisementImage,
} from "../../../util/advertisementApi";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { Navigate } from "react-router-dom";
import { startLoading, endLoading } from "../../../store/authSlice";
import { readFileAsDataUrl } from "../../../util/cropImage";

const normalizeWebsiteLink = (value) => {
  const link = String(value || "").trim();
  if (!link) return "";
  if (/^https?:\/\//i.test(link)) return link;
  return `https://${link}`;
};

const moveItem = (list, fromIndex, toIndex) => {
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

export default function Index() {
  const dispatch = useDispatch();
  const { loading, auth } = UseRedux();
  const canManage = isAdmin(auth?.user?.role);
  const photoInputRef = useRef(null);
  const mobileDragIndexRef = useRef(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [listData, setListData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [imageMeta, setImageMeta] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageTouched, setImageTouched] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const [cropFileName, setCropFileName] = useState("advertisement.jpg");
  const [reordering, setReordering] = useState(false);
  const skipSearchEffect = useRef(true);
  const filterCount = Number(Boolean(searchText.trim()));
  const rows = listData?.data || [];

  const handleList = async (isRest = false) => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(searchText && !isRest ? { name: searchText } : {}),
      };
      const data = await getAdvertisementList(params);
      setListData(data);
    } catch (e) {
      // keep previous data
    }
  };

  useEffect(() => {
    handleList();
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
      handleList();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const persistReorder = async (nextPageRows, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const previous = listData;
    setListData((prev) =>
      prev
        ? {
            ...prev,
            data: nextPageRows.map((row, index) => ({
              ...row,
              priority: page * rowsPerPage + index + 1,
            })),
          }
        : prev
    );
    setReordering(true);
    try {
      let orderedIds = nextPageRows.map((row) => row.id);
      const total = Number(previous?.total || nextPageRows.length);
      if (total > nextPageRows.length) {
        const full = await getAdvertisementList({
          page: 1,
          limit: Math.max(total, 1000),
          ...(searchText ? { name: searchText } : {}),
        });
        const fullRows = Array.isArray(full?.data) ? [...full.data] : [];
        const fromGlobal = page * rowsPerPage + fromIndex;
        const toGlobal = page * rowsPerPage + toIndex;
        orderedIds = moveItem(fullRows, fromGlobal, toGlobal).map(
          (row) => row.id
        );
      }
      await reorderAdvertisement({ orderedIds });
      await handleList();
    } catch (e) {
      setListData(previous);
    } finally {
      setReordering(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      websiteLink: "",
      displayOn: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Required"),
      websiteLink: Yup.string().trim(),
      displayOn: Yup.array().min(1, "Select at least one page").required(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!imageMeta?.url) {
          setImageTouched(true);
          return;
        }
        const payload = {
          name: String(values.name || "").trim(),
          websiteLink: normalizeWebsiteLink(values.websiteLink),
          displayOn: (values.displayOn || []).map(
            (item) => item?.value || item
          ),
          image: imageMeta,
        };
        await completeModalMutation(dispatch, {
          mutate: () =>
            modalData
              ? updateAdvertisement(modalData.id, payload)
              : addAdvertisement(payload),
          refresh: () => handleList(),
          close: () => {
            resetForm();
            closeModal();
          },
        });
      } catch (e) {
        // keep modal open
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
    setFieldTouched,
    isSubmitting,
  } = formik;

  const closeCropModal = () => {
    setCropSrc("");
    setCropFileName("advertisement.jpg");
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const openPhotoCrop = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCropFileName(file.name || "advertisement.jpg");
      setCropSrc(dataUrl);
    } catch (e) {
      console.log("photo read failed", e);
    }
  };

  const imageUploadHandler = (file) => {
    dispatch(startLoading());
    const filename = String(values.name || "advertisement")
      .trim()
      .replace(/\s+/g, "_");
    uploadAdvertisementImage(file, filename)
      .then((uploaded) => {
        if (!uploaded?.url) return;
        setImageMeta(uploaded);
        setImagePreview(uploaded.url);
        setImageTouched(true);
      })
      .catch((e) => console.log("ad image upload failed", e))
      .finally(() => {
        dispatch(endLoading());
      });
  };

  const handleCropConfirm = async (file) => {
    closeCropModal();
    imageUploadHandler(file);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
    setImageMeta(null);
    setImagePreview("");
    setImageTouched(false);
    closeCropModal();
    resetForm();
  };

  const openAddModal = () => {
    setModalData(null);
    setImageMeta(null);
    setImagePreview("");
    setImageTouched(false);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (row) => {
    setModalData(row);
    setImageMeta(row?.image || null);
    setImagePreview(row?.image?.url || "");
    setImageTouched(false);
    setFieldValue("name", row?.name || "");
    setFieldValue("websiteLink", row?.websiteLink || "");
    setFieldValue(
      "displayOn",
      AD_DISPLAY_PAGES.filter((item) =>
        (row?.displayOn || []).includes(item.value)
      )
    );
    setModalOpen(true);
  };

  const userActionHandler = async (row, action, field) => {
    try {
      await updateAdvertisement(row?.id, { ...row, [field]: action });
      handleList();
    } catch (e) {
      // ignore
    }
  };

  const deleteAPI = async (id) => {
    await completeModalMutation(dispatch, {
      mutate: () => deleteAdvertisement(Array.isArray(id) ? id : [id]),
      refresh: () => handleList(),
    });
    setSelectedIds([]);
  };

  const toggleCardSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (!canManage) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const hasError = Object.keys(errors)?.length || 0;
  const imageError = imageTouched && !imageMeta?.url;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className="flex-col justify-center flex items-start gap-3">
        <PageHeader
          className="w-full"
          title="Advertisement"
          actions={
            <ActionButton
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={openAddModal}
            >
              Add Advertisement
            </ActionButton>
          }
        />
        <MasterFilterBar
          searchPlaceholder="Search advertisement name"
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => handleList()}
        />
        <p className="text-sm text-mutedText -mt-1">
          Drag rows to change advertisement priority.
        </p>
        {selectedIds.length > 0 ? (
          <div className="hidden md:flex w-full items-center justify-between gap-2 px-3 py-2.5 bg-white border border-line rounded-lg">
            <span className="text-primary font-semibold">
              {selectedIds.length} selected
            </span>
            <Button
              icon={<DeleteIcon sx={{ fontSize: 18 }} />}
              onClick={() =>
                setDeleteTarget({ id: selectedIds, name: "selected" })
              }
            >
              Delete Selected
            </Button>
          </div>
        ) : null}
        <AdvertisementSortableTable
          rows={rows}
          total={listData?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onActiveChange={(row, next) => userActionHandler(row, next, "active")}
          onEdit={openEditModal}
          onDelete={(row) => setDeleteTarget(row)}
          onReorder={persistReorder}
          reordering={reordering}
        />

        <div className="md:hidden w-full flex flex-col gap-3">
          {selectedIds.length > 0 ? (
            <div className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-line rounded-lg">
              <span className="text-primary font-semibold">
                {selectedIds.length} selected
              </span>
              <Button
                icon={<DeleteIcon sx={{ fontSize: 18 }} />}
                onClick={() => setDeleteTarget({ id: selectedIds, name: "selected" })}
              >
                Delete Selected
              </Button>
            </div>
          ) : null}
          {rows.map((row, index) => (
            <Card
              key={row.id}
              padded={false}
              className="overflow-hidden"
              draggable={!reordering}
              onDragStart={() => {
                mobileDragIndexRef.current = index;
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={async () => {
                const fromIndex = mobileDragIndexRef.current;
                mobileDragIndexRef.current = null;
                if (fromIndex == null || fromIndex === index) return;
                await persistReorder(
                  moveItem(rows, fromIndex, index),
                  fromIndex,
                  index
                );
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-line text-primary cursor-grab">
                <DragIndicatorIcon sx={{ fontSize: 20 }} />
                <span className="text-sm font-semibold">
                  Priority {row.priority ?? index + 1}
                </span>
                <div className="ml-auto">
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleCardSelection(row.id)}
                  />
                </div>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {row?.image?.url ? (
                    <img
                      src={row.image.url}
                      alt={row.name || "ad"}
                      className="h-12 w-20 object-cover rounded"
                      draggable={false}
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">
                      {row.name || "-"}
                    </p>
                    <p className="text-xs text-mutedText truncate">
                      {formatDisplayOn(row.displayOn)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <CustomSwitch
                    checked={row.active}
                    onClick={() => userActionHandler(row, !row.active, "active")}
                  />
                  <div className="flex gap-3">
                    <ModeEditIcon
                      className="text-primary cursor-pointer"
                      onClick={() => openEditModal(row)}
                    />
                    <DeleteIcon
                      className="text-primary cursor-pointer"
                      onClick={() => setDeleteTarget(row)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {!rows.length ? (
            <div className="text-center text-mutedText text-sm py-8">
              No advertisements
            </div>
          ) : null}
          <TablePagination
            component="div"
            count={listData?.total || 0}
            page={page}
            onPageChange={(_event, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10) || 10);
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>
      </ContainerPage>

      {modalOpen ? (
        <FormModal
          open={modalOpen}
          onClose={closeModal}
          title={modalData ? "Edit Advertisement" : "Add Advertisement"}
        >
          <FormikProvider value={formik}>
            <Form
              className="gap-4 flex flex-col w-full pt-1 overflow-visible"
              noValidate
            >
              <Grid container className="w-full" spacing={2}>
                <CustomInput
                  xs={12}
                  name="name"
                  label="Advertisement Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched?.name && errors?.name}
                  required
                />
                <Grid item xs={12}>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
                    {loading ? (
                      <CircularProgress className="w-[160px] h-[90px] text-primary" />
                    ) : (
                      <label
                        htmlFor="ad-upload-button"
                        className="relative shrink-0 cursor-pointer group"
                      >
                        {imagePreview ? (
                          <LoadableImage
                            src={imagePreview}
                            alt={imageMeta?.name || "advertisement"}
                            className={`w-[160px] h-[90px] rounded-lg border object-cover ${
                              imageError ? "border-red-600" : "border-line"
                            } group-hover:border-primary`}
                            eager
                            spinnerSize={28}
                          />
                        ) : (
                          <div
                            className={`w-[160px] h-[90px] rounded-lg border flex items-center justify-center bg-[#f7f3ef] ${
                              imageError ? "border-red-600" : "border-line"
                            } group-hover:border-primary`}
                          >
                            <PhotoCameraOutlinedIcon
                              className="text-primary"
                              sx={{ fontSize: 28 }}
                            />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-card">
                          <PhotoCameraOutlinedIcon sx={{ fontSize: 16 }} />
                        </span>
                      </label>
                    )}
                    <div className="text-center sm:text-left min-w-0">
                      <p className="text-sm font-semibold text-primary">
                        Advertisement Image *
                      </p>
                      <p className="text-sm text-mutedText mt-1">
                        Tap to choose a photo, then crop before upload.
                      </p>
                      <label
                        htmlFor="ad-upload-button"
                        className="inline-flex mt-3 text-sm font-semibold text-primary underline underline-offset-4 cursor-pointer"
                      >
                        {imagePreview ? "Change photo" : "Choose photo"}
                      </label>
                    </div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      id="ad-upload-button"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          openPhotoCrop(file);
                        }
                        setImageTouched(true);
                      }}
                      onClick={() => setImageTouched(true)}
                    />
                  </div>
                  {imageError ? (
                    <p className="text-error text-sm transition-all mt-3">
                      Advertisement image is required
                    </p>
                  ) : null}
                </Grid>
                <CustomInput
                  xs={12}
                  name="websiteLink"
                  label="Website Link"
                  value={values.websiteLink}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={touched?.websiteLink && errors?.websiteLink}
                  placeholder="https://example.com"
                />
                <CustomAutoComplete
                  xs={12}
                  list={AD_DISPLAY_PAGES}
                  multiple={true}
                  label="Display On"
                  placeholder="Select pages"
                  name="displayOn"
                  value={values.displayOn}
                  required
                  errors={touched?.displayOn && errors?.displayOn}
                  onBlur={() => setFieldTouched("displayOn", true)}
                  onChange={(_event, selected) => {
                    setFieldValue(
                      "displayOn",
                      Array.isArray(selected) ? selected : []
                    );
                  }}
                />
                <Grid item xs={12} className="flex justify-center items-center">
                  <ActionButton
                    type="submit"
                    fullWidth
                    disabled={hasError || imageError}
                    loading={loading || isSubmitting}
                  >
                    {modalData ? "UPDATE" : "ADD"}
                  </ActionButton>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </FormModal>
      ) : null}

      <PhotoCropModal
        open={Boolean(cropSrc)}
        imageSrc={cropSrc}
        fileName={cropFileName}
        title="Crop advertisement"
        hint="Drag to reposition. Use the slider to zoom."
        cancelLabel="Cancel"
        confirmLabel="Use photo"
        zoomLabel="Zoom"
        aspect={16 / 9}
        onCancel={closeCropModal}
        onConfirm={handleCropConfirm}
      />

      <DeleteConfirmFlow
        open={Boolean(deleteTarget)}
        ids={
          deleteTarget
            ? Array.isArray(deleteTarget.id)
              ? deleteTarget.id
              : [deleteTarget.id]
            : []
        }
        name={
          Array.isArray(deleteTarget?.id)
            ? `${deleteTarget.id.length} advertisements`
            : deleteTarget?.name
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deleteAPI(
            Array.isArray(deleteTarget.id) ? deleteTarget.id : deleteTarget.id
          );
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
