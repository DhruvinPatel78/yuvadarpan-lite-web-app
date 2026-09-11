import Header from "../../../Component/Header";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Tab,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmFlow from "../../../Component/Common/DeleteConfirmFlow";
import AddIcon from "@mui/icons-material/Add";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { getYuvaList as fetchYuvaList, deleteYuva, getNativeList as fetchNativeList } from "../../../util/yuvaAdminApi";
import {
  getSelectedData,
  ImageBackdrop,
  ImageButton,
  ImageSrc,
  listHandler,
  useFilteredIds,
  yuvaFilterList,
} from "../../../Component/constant";
import ContainerPage from "../../../Component/Container";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";
import CustomAccordion from "../../../Component/Common/CustomAccordion";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import { UseRedux } from "../../../Component/useRedux";
import { formatYuvaDob, canEditYuvaRecord } from "../../../util/util";
import { PageHeader, FilterActions, Button as ActionButton, AppModal } from "../../../Component/UI";

const MOBILE_PAGE_SIZE = 20;

function YuvaDetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mutedText">
        {label}
      </p>
      <p className="text-sm text-primary mt-0.5 break-words">{value || "-"}</p>
    </div>
  );
}

const YuvaList = () => {
  const navigate = useNavigate();
  const [yuvaList, setYuvaList] = useState(null);
  const [userData, setUserData] = useState(null);
  const [value, setValue] = React.useState("1");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [mobilePage, setMobilePage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedYuvas, setSelectedYuvas] = useState([]);
  const isMobile = useMediaQuery("(max-width:767.95px)");
  const loadingMoreLock = useRef(false);
  const loadMoreRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const { surname, city, state, region, district, samaj, country, auth } = UseRedux();
  const isSamajManager =
    String(auth?.user?.role || "").toUpperCase() === "SAMAJ_MANAGER";
  const isCityManager =
    String(auth?.user?.role || "").toUpperCase() === "CITY_MANAGER";
  const isDistrictManager =
    String(auth?.user?.role || "").toUpperCase() === "DISTRICT_MANAGER";
  const isRegionManager =
    String(auth?.user?.role || "").toUpperCase() === "REGION_MANAGER";
  const isStateManager =
    String(auth?.user?.role || "").toUpperCase() === "STATE_MANAGER";
  const isCountryManager =
    String(auth?.user?.role || "").toUpperCase() === "COUNTRY_MANAGER";
  const hasOwnListToggle =
    isSamajManager ||
    isCityManager ||
    isDistrictManager ||
    isRegionManager ||
    isStateManager ||
    isCountryManager;
  const [ownUserList, setOwnUserList] = useState(false);
  const canAct = !hasOwnListToggle || ownUserList;
  const locationLists = { samaj, city, district, region, state, country };
  const canEditRow = (yuva) =>
    (hasOwnListToggle && ownUserList) ||
    canEditYuvaRecord(auth?.user, yuva, locationLists);
  const [nativeList, setNativeList] = useState([]);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedNative, setSelectedNative] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    name: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    getNativeList();
  }, []);

  const getNativeList = async () => {
    try {
      const data = await fetchNativeList();
      setNativeList(
        data.map((d) => ({ ...d, label: d.name, value: d.id }))
      );
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const yuvaListColumn = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 90,
      headerClassName:
        "bg-primary text-white items-center flex justify-center outline-none",
      cellClassName: "items-center flex justify-center outline-none",
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"w-full text-wrap px-2"}>
          <p className={"text-sm"}>
            {record.row.firstName} {record.row.middleName}{" "}
            {surname?.find((item) => item?.id === record?.row?.lastName)?.name}{" "}
          </p>
        </div>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-6 outline-none",
      filterable: false,
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 150,
      headerClassName: "bg-primary text-white outline-none",
      headerAlign: "center",
      cellClassName: "items-center flex p-0 justify-center outline-none",
      filterable: false,
      renderCell: (record) => (
        <p className={"w-full text-sm px-2"}>
          {moment(record.row.dob).format("DD/MM/YYYY hh:mm A")}
        </p>
      ),
    },
    {
      field: "firm",
      headerName: "Firm",
      width: 100,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 100,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{city?.find((item) => item?.id === record?.row?.city)?.name}</>
      ),
    },
    {
      field: "native",
      headerName: "Native",
      width: 100,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{nativeList.find((item) => item?.id === record?.row?.native)?.name}</>
      ),
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"View"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setUserData(record.row)}
            />
          </Tooltip>
          {canEditRow(record?.row) ? (
            <>
              <Tooltip title={"Edit"}>
                <ModeEditIcon
                  className={"text-primary cursor-pointer"}
                  onClick={() =>
                    navigate(`/admin/yuvalist/${record?.row.id}/edit`, {
                      state: { data: record?.row },
                    })
                  }
                />
              </Tooltip>
              <Tooltip title={"Delete"}>
                <DeleteIcon
                  className={"text-primary cursor-pointer"}
                  onClick={() =>
                    setDeleteTarget({
                      id: record?.id || record?.row?.id,
                      name: [record?.row?.firstName, record?.row?.fatherName]
                        .filter(Boolean)
                        .join(" "),
                    })
                  }
                />
              </Tooltip>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredNativeIds = useFilteredIds(selectedNative, "id");

  const handleRequestList = async (isRest = false, options = {}) => {
    const append = Boolean(options.append);
    const limit = isMobile ? MOBILE_PAGE_SIZE : rowsPerPage;
    const pageNum = append ? options.pageNum : isMobile ? 1 : page + 1;
    try {
      const searchField = selectedSearchBy.id;
      const searchValue = isRest ? "" : selectedSearchByText;
      const nameSearchFields = [
        "",
        "firstName",
        "fatherName",
        "grandFatherName",
        "name",
      ];
      const text =
        searchValue && nameSearchFields.includes(searchField || "")
          ? { search: searchValue }
          : searchValue && searchField
            ? { [searchField]: searchValue }
            : {};
      if (append) {
        setLoadingMore(true);
      } else if (isMobile) {
        setMobilePage(1);
      }
      const params = {
        page: pageNum,
        limit,
        lastName: isRest ? [] : filteredSurnameIds,
        native: isRest ? [] : filteredNativeIds,
        ...text,
      };
      if (isSamajManager) {
        params.ownSamaj = ownUserList;
      }
      if (isCityManager) {
        params.ownCity = ownUserList;
      }
      if (isDistrictManager) {
        params.ownDistrict = ownUserList;
      }
      if (isRegionManager) {
        params.ownRegion = ownUserList;
      }
      if (isStateManager) {
        params.ownState = ownUserList;
      }
      if (isCountryManager) {
        params.ownCountry = ownUserList;
      }
      const data = await fetchYuvaList(params);
      setYuvaList((prev) => {
        if (!append) {
          return data;
        }
        const existingIds = new Set((prev?.data || []).map((item) => item.id));
        const incoming = (data?.data || []).filter(
          (item) => !existingIds.has(item.id)
        );
        return {
          ...data,
          data: [...(prev?.data || []), ...incoming],
        };
      });
      setHasMore(
        (data?.data?.length || 0) === limit &&
          pageNum * limit < (data?.total || 0)
      );
    } catch (e) {
      // Optionally handle error with notification
    } finally {
      if (append) {
        setLoadingMore(false);
        loadingMoreLock.current = false;
      }
    }
  };

  useEffect(() => {
    handleRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, ownUserList, isMobile]);

  const loadMoreYuvas = () => {
    if (!isMobile || loadingMoreLock.current || loadingMore || !hasMore) {
      return;
    }
    if (!(yuvaList?.data?.length)) {
      return;
    }
    loadingMoreLock.current = true;
    const nextPage = mobilePage + 1;
    setMobilePage(nextPage);
    handleRequestList(false, { append: true, pageNum: nextPage });
  };

  useEffect(() => {
    if (!isMobile) {
      return undefined;
    }
    const target = loadMoreRef.current;
    if (!target) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreYuvas();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, hasMore, mobilePage, loadingMore]);

  const deleteAPI = async (id) => {
    try {
      const ids = Array.isArray(id) ? id : [id];
      await deleteYuva(ids);
      if (isMobile) {
        setYuvaList((prev) => ({
          ...prev,
          data: (prev?.data || []).filter((item) => !ids.includes(item.id)),
          total: Math.max(0, (prev?.total || 0) - ids.length),
        }));
        setSelectedYuvas([]);
      } else {
        handleRequestList();
      }
    } catch (e) {
      // Optionally handle error with notification
    }
  };

  const yuvas = yuvaList?.data || [];
  const lookupName = (list, id) =>
    list?.find((item) => item?.id === id)?.name || "-";

  const toggleCardSelection = (id) => {
    setSelectedYuvas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedSearchBy({
      label: "",
      id: "",
    });
    setSelectedSurname([]);
    setSelectedNative([]);
    handleRequestList(true);
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start gap-4"}
      >
        <PageHeader
          className="w-full"
          title="Yuvalist"
          actions={
          <div className={"flex flex-row items-center gap-3"}>
            {hasOwnListToggle ? (
              <FormControlLabel
                labelPlacement="start"
                className={"!mr-0"}
                control={
                  <CustomSwitch
                    checked={ownUserList}
                    onChange={(e) => {
                      setOwnUserList(e.target.checked);
                      setPage(0);
                    }}
                  />
                }
                label={
                  <span className={"font-semibold text-primary"}>
                    Your Yuva
                  </span>
                }
              />
            ) : null}
            <Button
              className={"text-primary flex items-center justify-center"}
              onClick={() => navigate("/admin/userDashboard")}
            >
              View User Dashboard
            </Button>
            {canAct ? (
              <ActionButton
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => navigate("/admin/yuvalist/add")}
              >
                Yuva
              </ActionButton>
            ) : null}
          </div>
          }
        />
        <CustomAccordion>
          <Grid spacing={2} container>
            <CustomAutoComplete
              list={listHandler(surname)}
              multiple={true}
              label={"Surname"}
              placeholder={"Select Your Surname"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSurname}
              name="surname"
              onChange={(e, lastName) => {
                if (lastName) {
                  setSelectedSurname((pre) =>
                    getSelectedData(pre, lastName, e)
                  );
                }
              }}
            />
            <CustomAutoComplete
              list={listHandler(region)}
              multiple={true}
              label={"Native"}
              placeholder={"Select Your Native"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="native"
              value={selectedNative}
              onChange={(e, native) => {
                if (native) {
                  setSelectedNative((pre) => getSelectedData(pre, native, e));
                }
              }}
            />
            <CustomAutoComplete
              list={yuvaFilterList}
              label={"Search By"}
              placeholder={"Select Your Search By"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              name="search"
              value={selectedSearchBy.name}
              onChange={(e, search) => {
                setSelectedSearchBy({
                  name: search.label,
                  id: search.value,
                });
              }}
            />
            <CustomInput
              type={"text"}
              placeholder={"Search by first, father or grandfather name"}
              name={"firstName"}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              value={selectedSearchByText}
              onChange={(e) => {
                setSelectedSearchByText(e.target.value);
                if (e.target.value === "") {
                  handleRequestList(true);
                }
              }}
            />

            <Grid
              item
              xs={12}
              className={"flex justify-center items-center gap-4"}
            >
              <FilterActions
                onSubmit={() => {
                  if (isMobile) {
                    handleRequestList();
                    return;
                  }
                  if (page !== 0) {
                    setPage(0);
                  } else {
                    handleRequestList();
                  }
                }}
                onReset={handleReset}
                showReset={Boolean(
                  selectedSearchByText ||
                    selectedSearchBy.name ||
                    selectedNative?.length > 0 ||
                    selectedSurname?.length > 0
                )}
              />
            </Grid>
          </Grid>
        </CustomAccordion>
        {canAct && selectedYuvas.length > 0 ? (
          <div
            className={
              "md:hidden w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-muted border border-line rounded-lg"
            }
          >
            <span className={"text-primary font-semibold"}>
              {selectedYuvas.length} selected
            </span>
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              className={"!bg-primary !text-white"}
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete Selected
            </Button>
          </div>
        ) : null}
        <div className={"hidden md:block w-full"}>
          <CustomTable
            columns={yuvaListColumn}
            className={"mx-0 w-full"}
            data={yuvaList}
            name={"YuvaList"}
            pageSize={rowsPerPage}
            type={"pendingList"}
            setPage={setPage}
            page={page}
            setPageSize={setRowsPerPage}
            checkboxSelection={canAct}
            onDeleteSelected={canAct ? deleteAPI : undefined}
            deleteEntity="yuva"
          />
        </div>
        <div className={"md:hidden w-full flex flex-col gap-3"}>
          {yuvas.length ? (
            yuvas.map((row) => {
              const fullName = [
                row.firstName,
                row.middleName,
                surname?.find((item) => item?.id === row.lastName)?.name,
              ]
                .filter(Boolean)
                .join(" ");
              const isSelected = selectedYuvas.includes(row.id);
              return (
                <Paper
                  key={row.id}
                  elevation={2}
                  className={"rounded-xl overflow-hidden border border-[#ead9d9]"}
                >
                  <div className={"p-3"}>
                    <div className={"flex items-center justify-between gap-2"}>
                      <p className={"font-bold text-primary text-base leading-tight min-w-0 pr-1"}>
                        {fullName}
                      </p>
                      {canAct ? (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleCardSelection(row.id)}
                          className={"!text-primary !p-0 !m-0 shrink-0"}
                        />
                      ) : null}
                    </div>
                    <p className={"text-sm text-gray-600 mt-1"}>
                      Family ID: {row.familyId || "-"}
                    </p>
                    <p className={"text-sm text-gray-600 capitalize"}>
                      {row.gender || "-"}
                      {row.firm ? ` · ${row.firm}` : ""}
                      {lookupName(nativeList, row.native) !== "-"
                        ? ` · ${lookupName(nativeList, row.native)}`
                        : ""}
                    </p>
                    <p className={"text-sm text-gray-600"}>
                      City: {lookupName(city, row.city)}
                      {" · "}
                      DOB: {formatYuvaDob(row.dob) || "-"}
                    </p>
                  </div>
                  <div className={"flex border-t border-[#ead9d9]"}>
                    <button
                      type="button"
                      className={`flex-1 py-2.5 text-sm font-semibold text-primary ${
                        canEditRow(row) ? "border-r border-[#ead9d9]" : ""
                      }`}
                      onClick={() => setUserData(row)}
                    >
                      View
                    </button>
                    {canEditRow(row) ? (
                      <>
                        <button
                          type="button"
                          className={"flex-1 py-2.5 text-sm font-semibold text-primary border-r border-[#ead9d9]"}
                          onClick={() =>
                            navigate(`/admin/yuvalist/${row.id}/edit`, {
                              state: { data: row },
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={"flex-1 py-2.5 text-sm font-semibold text-[#ff0000]"}
                          onClick={() =>
                            setDeleteTarget({
                              id: row.id,
                              name: [row.firstName, row.fatherName]
                                .filter(Boolean)
                                .join(" "),
                            })
                          }
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                  </div>
                </Paper>
              );
            })
          ) : (
            <Paper className={"p-6 text-center text-gray-500 rounded-xl"}>
              No yuva records
            </Paper>
          )}
          {hasMore && yuvas.length ? (
            <div ref={loadMoreRef} className={"flex justify-center py-3"}>
              {loadingMore ? (
                <CircularProgress size={24} className={"!text-primary"} />
              ) : null}
            </div>
          ) : null}
        </div>
      </ContainerPage>
      <AppModal
        open={Boolean(userData)}
        onClose={() => setUserData(null)}
        maxWidth="600px"
        className="p-6 pt-7 max-h-[90vh] overflow-auto"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setUserData(null)}
          className="absolute top-4 right-4 text-primary p-1 rounded-md hover:bg-muted"
        >
          <CloseIcon fontSize="small" />
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pr-6">
          <ImageButton
            focusRipple
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "150px",
            }}
            onClick={() =>
              window.open(
                userData?.profile?.url ||
                  "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                "_blank"
              )
            }
          >
            <ImageSrc
              style={{
                backgroundImage:
                  `url(${userData?.profile?.url})` ||
                  `url(https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg)`,
              }}
            />
            <ImageBackdrop className="MuiImageBackdrop-root" />
          </ImageButton>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-primary leading-snug">
              {userData?.firstName}{" "}
              {surname.find((item) => item?.id === userData?.lastName)?.name}{" "}
            </h2>
            <p className="text-sm text-mutedText mt-1">
              {moment(userData?.dob).format("DD/MM/YYYY hh:mm A")}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold tracking-wide bg-muted text-primary px-2.5 py-1 rounded-full">
              Family ID {userData?.familyId}
            </span>
            <div className="flex mt-3 gap-2 w-full">
              <button
                className="bg-primary text-white h-10 px-4 rounded-lg w-full text-sm font-semibold"
                onClick={() =>
                  navigate(`/admin/yuvalist/${userData?.id}`, {
                    state: { ...userData },
                  })
                }
              >
                View Details
              </button>
              {canEditRow(userData) ? (
                <button
                  className="border border-primary text-primary h-10 px-3 rounded-lg"
                  onClick={() =>
                    navigate(`/admin/yuvalist/${userData?.id}/edit`, {
                      state: { data: userData },
                    })
                  }
                >
                  <ModeEditIcon />
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <Box className="mt-5 pt-2 border-t border-line">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                className={"text-primary"}
                textColor="text-primary"
                indicatorColor="inherit"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#542b2b",
                  },
                }}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
              >
                <Tab
                  label="Personal Info"
                  value="1"
                  className={`font-bold ${
                    value === "1" ? "text-primary" : "text-gray"
                  }`}
                />
                <Tab
                  label="Mama Info"
                  value="2"
                  className={`font-bold ${
                    value === "2" ? "text-primary" : "text-gray"
                  }`}
                />
                <Tab
                  label="Contact Info"
                  value="4"
                  className={`font-bold ${
                    value === "4" ? "text-primary" : "text-gray"
                  }`}
                />
                <Tab
                  label="Other Info"
                  value="3"
                  className={`font-bold ${
                    value === "3" ? "text-primary" : "text-gray"
                  }`}
                />
              </TabList>
            </Box>
            <TabPanel value="1" className="!px-0 !pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <YuvaDetailItem label="Father name" value={userData?.fatherName} />
                <YuvaDetailItem label="Mother name" value={userData?.motherName} />
                <YuvaDetailItem label="Height" value={userData?.height} />
                <YuvaDetailItem label="Weight" value={userData?.weight} />
                <YuvaDetailItem
                  label="City"
                  value={city.find((item) => item?.id === userData?.city)?.name}
                />
                <YuvaDetailItem
                  label="State"
                  value={
                    state?.find((item) => item?.id === userData?.state)?.name
                  }
                />
                <YuvaDetailItem label="Firm" value={userData?.firm} />
                <YuvaDetailItem
                  label="Firm address"
                  value={userData?.firmAddress}
                />
              </div>
            </TabPanel>
            <TabPanel value="2" className="!px-0 !pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <YuvaDetailItem label="Name" value={userData?.mamaInfo?.name} />
                <YuvaDetailItem
                  label="Native"
                  value={userData?.mamaInfo?.native}
                />
                <YuvaDetailItem label="City" value={userData?.mamaInfo?.city} />
              </div>
            </TabPanel>
            <TabPanel value="3" className="!px-0 !pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <YuvaDetailItem label="Education" value={userData?.education} />
                <YuvaDetailItem
                  label="Blood group"
                  value={userData?.bloodGroup}
                />
              </div>
            </TabPanel>
            <TabPanel value="4" className="!px-0 !pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <YuvaDetailItem
                  label="Name"
                  value={userData?.contactInfo?.name}
                />
                <YuvaDetailItem
                  label="Relation"
                  value={userData?.contactInfo?.relation}
                />
                <YuvaDetailItem
                  label="Number"
                  value={userData?.contactInfo?.phone}
                />
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </AppModal>
      <DeleteConfirmFlow
        open={Boolean(deleteTarget) || bulkDeleteOpen}
        entity="yuva"
        ids={deleteTarget ? [deleteTarget.id] : selectedYuvas}
        name={
          deleteTarget?.name ||
          `${selectedYuvas.length} selected item${
            selectedYuvas.length === 1 ? "" : "s"
          }`
        }
        onClose={() => {
          setDeleteTarget(null);
          setBulkDeleteOpen(false);
        }}
        onConfirm={async () => {
          await deleteAPI(deleteTarget ? deleteTarget.id : selectedYuvas);
          setDeleteTarget(null);
          setBulkDeleteOpen(false);
        }}
      />
    </Box>
  );
};

export default YuvaList;
