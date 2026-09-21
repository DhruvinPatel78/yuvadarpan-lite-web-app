import Header from "../../../Component/Header";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getYuvaList as fetchYuvaList, deleteYuva } from "../../../util/yuvaAdminApi";
import {
  getSelectedData,
  gotraOptionList,
  filterFieldCols,
  lastNameIdsForGotraFilter,
  listHandler,
  surnamesForGotra,
  useFilteredIds,
  yuvaFilterList,
  masterLabelOf,
} from "../../../Component/constant";
import ContainerPage from "../../../Component/Container";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import LoadableImage from "../../../Component/Common/LoadableImage";
import { UseRedux } from "../../../Component/useRedux";
import { formatYuvaDob, canEditYuvaRecord } from "../../../util/util";
import { PageHeader, FilterActions, MasterFilterBar, Button as ActionButton, AppModal } from "../../../Component/UI";
import {
  getAllCityData,
  getAllCountryData,
  getAllDistrictData,
  getAllGotraData,
  getAllNativeData,
  getAllRegionData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
} from "../../../util/getAPICall";
import { endLoading, startLoading } from "../../../store/authSlice";
import { completeModalMutation } from "../../../util/completeModalMutation";
import { masterNameText, pickYuvaLangText } from "../../../util/bhasha";

const MOBILE_PAGE_SIZE = 20;

const yuvaPersonName = (row) =>
  [
    pickYuvaLangText(row, "firstName"),
    pickYuvaLangText(row, "fatherName"),
  ]
    .filter(Boolean)
    .join(" ");

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
  const dispatch = useDispatch();
  const [yuvaList, setYuvaList] = useState(null);
  const [userData, setUserData] = useState(null);
  const [value, setValue] = React.useState("1");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [mobilePage, setMobilePage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedYuvas, setSelectedYuvas] = useState([]);
  const isMobileMatch = useMediaQuery("(max-width:767.95px)");
  const [isMobile, setIsMobile] = useState(isMobileMatch);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsMobile(isMobileMatch), 150);
    return () => window.clearTimeout(timer);
  }, [isMobileMatch]);
  const loadingMoreLock = useRef(false);
  const loadMoreRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const { surname, city, state, region, district, samaj, country, auth, native: nativeList, gotra: gotraList } = UseRedux();
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
  const locationLists = useMemo(
    () => ({ samaj, city, district, region, state, country }),
    [samaj, city, district, region, state, country]
  );
  const canEditRow = useCallback(
    (yuva) => {
      if (hasOwnListToggle) {
        return Boolean(ownUserList);
      }
      return canEditYuvaRecord(auth?.user, yuva, locationLists);
    },
    [hasOwnListToggle, ownUserList, auth?.user, locationLists]
  );
  const [selectedGotra, setSelectedGotra] = useState([]);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedNative, setSelectedNative] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    name: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(getAllSurnameData);
    dispatch(getAllCountryData);
    dispatch(getAllStateData);
    dispatch(getAllRegionData);
    dispatch(getAllDistrictData);
    dispatch(getAllCityData);
    dispatch(getAllSamajData);
    dispatch(getAllNativeData);
    dispatch(getAllGotraData);
  }, [dispatch]);

  const yuvaListColumn = useMemo(() => [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 100,
      minWidth: 100,
      headerClassName:
        "bg-primary text-white items-center flex justify-center outline-none",
      cellClassName: "items-center flex justify-center outline-none",
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 140,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => {
        const fullName = [
          pickYuvaLangText(record.row, "firstName"),
          record.row.middleName,
          masterLabelOf(surname, record?.row?.lastName),
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <p className={"w-full min-w-0 truncate text-sm px-2"} title={fullName}>
            {fullName}
          </p>
        );
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 90,
      minWidth: 90,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      valueGetter: (params) => pickYuvaLangText(params?.row, "gender"),
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 170,
      minWidth: 170,
      headerClassName: "bg-primary text-white outline-none",
      headerAlign: "center",
      cellClassName: "items-center flex p-0 justify-center outline-none",
      filterable: false,
      renderCell: (record) => (
        <p className={"w-full min-w-0 truncate text-sm px-2"}>
          {moment(record.row.dob).format("DD/MM/YYYY hh:mm A")}
        </p>
      ),
    },
    {
      field: "firm",
      headerName: "Firm",
      minWidth: 120,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => (
        <span className="block w-full min-w-0 truncate" title={pickYuvaLangText(record.row, "firm")}>
          {pickYuvaLangText(record.row, "firm") || ""}
        </span>
      ),
    },
    {
      field: "city",
      headerName: "City",
      minWidth: 110,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => {
        const cityName =
          masterLabelOf(city, record?.row?.city);
        return (
          <span className="block w-full min-w-0 truncate" title={cityName}>
            {cityName}
          </span>
        );
      },
    },
    {
      field: "native",
      headerName: "Native",
      minWidth: 120,
      flex: 1,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
      renderCell: (record) => {
        const nativeName =
          masterLabelOf(nativeList, record?.row?.native);
        return (
          <span className="block w-full min-w-0 truncate" title={nativeName}>
            {nativeName}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: "",
      width: 140,
      minWidth: 140,
      sortable: false,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "outline-none",
      renderCell: (record) => (
        <div className={"flex gap-2 justify-center items-center shrink-0 px-1"}>
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
                      name: yuvaPersonName(record?.row),
                    })
                  }
                />
              </Tooltip>
            </>
          ) : null}
        </div>
      ),
    },
  ], [surname, city, nativeList, canEditRow, navigate]);

  const gotraOptions = useMemo(() => gotraOptionList(gotraList), [gotraList]);
  const surnameFilterList = useMemo(
    () => listHandler(surnamesForGotra(surname, selectedGotra)),
    [surname, selectedGotra]
  );
  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredNativeIds = useFilteredIds(selectedNative, "id");
  const filterCols = filterFieldCols(4);

  const handleRequestList = async (isRest = false, options = {}) => {
    const append = Boolean(options.append);
    const skipLoader = Boolean(options.skipLoader);
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
      if (!append && !skipLoader) {
        dispatch(startLoading());
      }
      const params = {
        page: pageNum,
        limit,
        lastName: isRest
          ? []
          : lastNameIdsForGotraFilter(
              surname,
              selectedGotra,
              filteredSurnameIds
            ),
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
      } else if (!skipLoader) {
        dispatch(endLoading());
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
    if (!yuvaList?.data?.length) {
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
    const ids = Array.isArray(id) ? id : [id];
    await completeModalMutation(dispatch, {
      mutate: () => deleteYuva(ids),
      refresh: async () => {
        if (isMobile) {
          setSelectedYuvas([]);
        }
        await handleRequestList(false, { skipLoader: true });
      },
    });
  };

  const yuvas = yuvaList?.data || [];
  const lookupName = (list, id) => masterLabelOf(list, id) || "-";

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
    setSelectedGotra([]);
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
          <div className={"flex flex-col-reverse md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto"}>
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
              className={"text-primary flex items-center justify-center max-md:!w-full"}
              onClick={() => navigate("/admin/userDashboard")}
            >
              View User Dashboard
            </Button>
            <ActionButton
              variant="secondary"
              className="max-md:w-full"
              icon={<GroupAddIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate("/admin/yuvalist/bulk-add")}
            >
              Bulk Add Yuva
            </ActionButton>
            <ActionButton
              className="max-md:w-full"
              icon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate("/admin/yuvalist/add")}
            >
              Yuva
            </ActionButton>
          </div>
          }
        />
        <MasterFilterBar
          searchPlaceholder={
            isMobile
              ? "Search by name"
              : "Search by first, father or grandfather name"
          }
          searchValue={selectedSearchByText}
          onSearchChange={(e) => {
            setSelectedSearchByText(e.target.value);
            if (e.target.value === "") {
              handleRequestList(true);
            }
          }}
          filterCount={
            Number(Boolean(selectedSearchByText.trim())) +
            Number(Boolean(selectedSearchBy.name || selectedSearchBy.id)) +
            Number(Boolean(selectedGotra?.length > 0)) +
            Number(Boolean(selectedSurname?.length > 0)) +
            Number(Boolean(selectedNative?.length > 0))
          }
          isFilterOpen={isFilterOpen}
          onFilterClick={() => setIsFilterOpen((open) => !open)}
          extraFilters={
            <Grid spacing={2} container>
              <CustomAutoComplete
                list={gotraOptions}
                multiple={true}
                label={"Gotra"}
                placeholder={"Select Your Gotra"}
                {...filterCols}
                value={selectedGotra}
                name="gotra"
                onChange={(e, gotra) => {
                  if (gotra) {
                    setSelectedGotra((pre) => getSelectedData(pre, gotra, e));
                    setSelectedSurname([]);
                  }
                }}
              />
              <CustomAutoComplete
                list={surnameFilterList}
                multiple={true}
                label={"Surname"}
                placeholder={"Select Your Surname"}
                {...filterCols}
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
                list={listHandler(nativeList)}
                multiple={true}
                label={"Native"}
                placeholder={"Select Your Native"}
                {...filterCols}
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
                {...filterCols}
                name="search"
                value={selectedSearchBy.name}
                onChange={(e, search) => {
                  setSelectedSearchBy({
                    name: search.label,
                    id: search.value,
                  });
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
                      selectedGotra?.length > 0 ||
                      selectedNative?.length > 0 ||
                      selectedSurname?.length > 0
                  )}
                />
              </Grid>
            </Grid>
          }
        />
        {canAct && selectedYuvas.length > 0 ? (
          <div
            className={
              "md:hidden w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 bg-white border border-line rounded-lg"
            }
          >
            <span className={"text-primary font-semibold"}>
              {selectedYuvas.length} Selected
            </span>
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              className={"!bg-primary !text-white max-md:!w-full"}
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete Selected
            </Button>
          </div>
        ) : null}
        <div className={"hidden md:block w-full min-w-0"}>
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
                pickYuvaLangText(row, "firstName"),
                row.middleName,
                masterLabelOf(surname, row.lastName),
              ]
                .filter(Boolean)
                .join(" ");
              const isSelected = selectedYuvas.includes(row.id);
              return (
                <Paper
                  key={row.id}
                  elevation={2}
                  className={"rounded-xl overflow-hidden !border-2 !border-solid !border-[#d7d0c8]"}
                >
                  <div className={"p-3"}>
                    <div className={"flex items-start justify-between gap-2"}>
                      <p className={"font-bold text-primary text-base leading-tight min-w-0 pr-1 break-words"}>
                        {fullName}
                      </p>
                      {canAct ? (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleCardSelection(row.id)}
                          className={"!text-primary !p-2 !-m-2 shrink-0"}
                        />
                      ) : null}
                    </div>
                    <p className={"text-sm text-gray-600 mt-1"}>
                      Family ID: {row.familyId || "-"}
                    </p>
                    <p className={"text-sm text-gray-600 capitalize break-words"}>
                      {pickYuvaLangText(row, "gender") || "-"}
                      {pickYuvaLangText(row, "firm")
                        ? ` · ${pickYuvaLangText(row, "firm")}`
                        : ""}
                      {lookupName(nativeList, row.native) !== "-"
                        ? ` · ${lookupName(nativeList, row.native)}`
                        : ""}
                    </p>
                    <p className={"text-sm text-gray-600 break-words"}>
                      City: {lookupName(city, row.city)}
                      {" · "}
                      DOB: {formatYuvaDob(row.dob) || "-"}
                    </p>
                  </div>
                  <div className={"flex border-t border-[#ead9d9]"}>
                    <button
                      type="button"
                      className={`flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary ${
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
                          className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary border-r border-[#ead9d9]"}
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
                          className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-[#ff0000]"}
                          onClick={() =>
                            setDeleteTarget({
                              id: row.id,
                              name: yuvaPersonName(row),
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
            <Paper className={"p-8 text-center rounded-xl"}>
              <p className="text-sm font-semibold text-primary">No yuva records</p>
              <p className="text-sm text-mutedText mt-1">Try a different search or clear filters.</p>
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
        className="p-4 sm:p-6 pt-7 max-h-[min(90dvh,90vh)] overflow-auto"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setUserData(null)}
          className="absolute top-3 right-3 text-primary p-2 rounded-md hover:bg-muted min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1 md:top-4 md:right-4 flex items-center justify-center"
        >
          <CloseIcon fontSize="small" />
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pr-6">
          <button
            type="button"
            className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-line"
            onClick={() => {
              if (userData?.profile?.url) {
                window.open(userData.profile.url, "_blank");
              }
            }}
          >
            <LoadableImage
              src={userData?.profile?.url}
              alt=""
              className="w-full h-full"
              eager
              spinnerSize={24}
            />
          </button>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-primary leading-snug break-words">
              {pickYuvaLangText(userData, "firstName")}{" "}
              {masterLabelOf(surname, userData?.lastName)}{" "}
            </h2>
            <p className="text-sm text-mutedText mt-1">
              {moment(userData?.dob).format("DD/MM/YYYY hh:mm A")}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold tracking-wide bg-muted text-primary px-2.5 py-1 rounded-full">
              Family ID {userData?.familyId}
            </span>
            <div className="flex mt-3 gap-2 w-full flex-col sm:flex-row">
              <button
                className="bg-primary text-white h-11 md:h-10 px-4 rounded-lg w-full text-sm font-semibold"
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
                  className="border border-primary text-primary h-11 md:h-10 px-3 rounded-lg sm:w-auto w-full flex items-center justify-center"
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
          <div className="hidden md:block">
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
                <YuvaDetailItem label="Father name" value={pickYuvaLangText(userData, "fatherName")} />
                <YuvaDetailItem label="Mother name" value={pickYuvaLangText(userData, "motherName")} />
                <YuvaDetailItem label="Height" value={userData?.height} />
                <YuvaDetailItem label="Weight" value={userData?.weight} />
                <YuvaDetailItem
                  label="City"
                  value={lookupName(city, userData?.city)}
                />
                <YuvaDetailItem
                  label="State"
                  value={lookupName(state, userData?.state)}
                />
                <YuvaDetailItem label="Firm" value={pickYuvaLangText(userData, "firm")} />
                <YuvaDetailItem
                  label="Firm address"
                  value={pickYuvaLangText(userData, "firmAddress")}
                />
              </div>
            </TabPanel>
            <TabPanel value="2" className="!px-0 !pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <YuvaDetailItem label="Name" value={pickYuvaLangText(userData, "mamaInfo.name")} />
                <YuvaDetailItem
                  label="Last name"
                  value={lookupName(surname, userData?.mamaInfo?.lastName)}
                />
                <YuvaDetailItem
                  label="Native"
                  value={lookupName(nativeList, userData?.mamaInfo?.native)}
                />
                <YuvaDetailItem label="City" value={pickYuvaLangText(userData, "mamaInfo.city")} />
              </div>
            </TabPanel>
            <TabPanel value="3" className="!px-0 !pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <YuvaDetailItem
                  label="Education"
                  value={
                    userData?.education?.education || userData?.education
                  }
                />
                <YuvaDetailItem
                  label="Field of study"
                  value={
                    userData?.education?.fieldOfStudy || userData?.fieldOfStudy
                  }
                />
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
                  value={pickYuvaLangText(userData, "contactInfo.name")}
                />
                <YuvaDetailItem
                  label="Last name"
                  value={lookupName(surname, userData?.contactInfo?.lastName)}
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
          </div>
          <div className="md:hidden flex flex-col gap-5">
            <div>
              <h3 className="text-sm font-WorkSemiBold text-primary mb-3 pb-2 border-b border-line">
                Personal Info
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                <YuvaDetailItem label="Father name" value={pickYuvaLangText(userData, "fatherName")} />
                <YuvaDetailItem label="Mother name" value={pickYuvaLangText(userData, "motherName")} />
                <YuvaDetailItem label="Height" value={userData?.height} />
                <YuvaDetailItem label="Weight" value={userData?.weight} />
                <YuvaDetailItem
                  label="City"
                  value={lookupName(city, userData?.city)}
                />
                <YuvaDetailItem
                  label="State"
                  value={lookupName(state, userData?.state)}
                />
                <YuvaDetailItem label="Firm" value={pickYuvaLangText(userData, "firm")} />
                <YuvaDetailItem
                  label="Firm address"
                  value={pickYuvaLangText(userData, "firmAddress")}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-WorkSemiBold text-primary mb-3 pb-2 border-b border-line">
                Mama Info
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                <YuvaDetailItem label="Name" value={pickYuvaLangText(userData, "mamaInfo.name")} />
                <YuvaDetailItem
                  label="Last name"
                  value={lookupName(surname, userData?.mamaInfo?.lastName)}
                />
                <YuvaDetailItem
                  label="Native"
                  value={lookupName(nativeList, userData?.mamaInfo?.native)}
                />
                <YuvaDetailItem label="City" value={pickYuvaLangText(userData, "mamaInfo.city")} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-WorkSemiBold text-primary mb-3 pb-2 border-b border-line">
                Contact Info
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                <YuvaDetailItem
                  label="Name"
                  value={pickYuvaLangText(userData, "contactInfo.name")}
                />
                <YuvaDetailItem
                  label="Last name"
                  value={lookupName(surname, userData?.contactInfo?.lastName)}
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
            </div>
            <div>
              <h3 className="text-sm font-WorkSemiBold text-primary mb-3 pb-2 border-b border-line">
                Other Info
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                <YuvaDetailItem
                  label="Education"
                  value={
                    userData?.education?.education || userData?.education
                  }
                />
                <YuvaDetailItem
                  label="Field of study"
                  value={
                    userData?.education?.fieldOfStudy || userData?.fieldOfStudy
                  }
                />
                <YuvaDetailItem
                  label="Blood group"
                  value={userData?.bloodGroup}
                />
              </div>
            </div>
          </div>
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
