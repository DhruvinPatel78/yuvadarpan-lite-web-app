import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Checkbox, CircularProgress, Grid, Paper, Tooltip, useMediaQuery } from "@mui/material";
import { Button as ActionButton, FilterActions, FormModal, MasterFilterBar, PageHeader } from "../../../Component/UI";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import CustomTable from "../../../Component/Common/customTable";
import Header from "../../../Component/Header";
import CustomTextFieldInfo from "../../../Component/Common/customTextFieldInfo";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContainerPage from "../../../Component/Container";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";
import {
  getSelectedData,
  gotraOptionList,
  handleListById,
  filterFieldCols,
  lastNameIdsForGotraFilter,
  listHandler,
  requestFilterList,
  surnamesForGotra,
  useFilteredIds,
  masterLabelOf,
} from "../../../Component/constant";
import { UseRedux } from "../../../Component/useRedux";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import {
  getUserRequests,
  approveRejectUser,
  approveRejectMany,
} from "../../../util/requestApi";
import { getAllGotraData } from "../../../util/getAPICall";
import { langText } from "../../../util/bhasha";

const MOBILE_PAGE_SIZE = 20;

export default function Index() {
  const { notification, setNotification } = NotificationData();
  const { samaj, region, state, surname, auth, gotra: gotraList } = UseRedux();
  const isSamajManager = String(auth?.user?.role || "").toUpperCase() === "SAMAJ_MANAGER";
  const isCityManager = String(auth?.user?.role || "").toUpperCase() === "CITY_MANAGER";
  const isDistrictManager = String(auth?.user?.role || "").toUpperCase() === "DISTRICT_MANAGER";
  const isRegionManager = String(auth?.user?.role || "").toUpperCase() === "REGION_MANAGER";
  const isStateManager = String(auth?.user?.role || "").toUpperCase() === "STATE_MANAGER";
  const isCountryManager = String(auth?.user?.role || "").toUpperCase() === "COUNTRY_MANAGER";
  const hideLocationFilters = isSamajManager || isCityManager || isDistrictManager || isRegionManager || isStateManager || isCountryManager;
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [mobilePage, setMobilePage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMobile = useMediaQuery("(max-width:767.95px)");
  const loadingMoreLock = useRef(false);
  const loadMoreRef = useRef(null);
  const [selectedGotra, setSelectedGotra] = useState([]);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState([]);
  const [selectedSearchBy, setSelectedSearchBy] = useState({
    label: "",
    id: "",
  });
  const [selectedSearchByText, setSelectedSearchByText] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [regionListByState, setRegionListByState] = useState(region);
  const [samajListByRegion, setSamajListByRegion] = useState(samaj);
  const dispatch = useDispatch();

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setSelectedUser(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };

  const userActionHandler = async (userInfo, action) => {
    dispatch(startLoading());
    try {
      await approveRejectUser(userInfo.id, action);
      if (isMobile) {
        setUserList((prev) => ({
          ...prev,
          data: (prev?.data || []).filter((item) => item.id !== userInfo.id),
          total: Math.max(0, (prev?.total || 1) - 1),
        }));
      } else {
        handleRequestList();
      }
      setNotification({ type: "success", message: "Updated." });
    } catch (e) {
      setNotification({
        type: "error",
        message: e?.message || "Failed to update user.",
      });
    } finally {
      dispatch(endLoading());
    }
  };

  const gotraOptions = useMemo(() => gotraOptionList(gotraList), [gotraList]);
  const surnameFilterList = useMemo(
    () => listHandler(surnamesForGotra(surname, selectedGotra)),
    [surname, selectedGotra]
  );
  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredStateIds = useFilteredIds(selectedState, "id");
  const filteredRegionIds = useFilteredIds(selectedRegion, "id");
  const filteredSamajIds = useFilteredIds(selectedSamaj, "id");
  const filterCols = filterFieldCols(3);

  const handleRequestList = async (isRest = false, options = {}) => {
    const append = Boolean(options.append);
    const limit = isMobile ? MOBILE_PAGE_SIZE : rowsPerPage;
    const pageNum = append ? options.pageNum : isMobile ? 1 : page + 1;
    const text = selectedSearchByText
      ? { [selectedSearchBy.id]: isRest ? "" : selectedSearchByText }
      : {};
    if (append) {
      setLoadingMore(true);
    } else {
      dispatch(startLoading());
      if (isMobile) {
        setMobilePage(1);
      }
    }
    try {
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
        state: isRest ? [] : filteredStateIds,
        region: isRest ? [] : filteredRegionIds,
        samaj: isRest ? [] : filteredSamajIds,
        ...text,
      };
      const data = await getUserRequests(params);
      setUserList((prev) => {
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
    } catch (error) {
      // Optionally handle error with notification
    } finally {
      if (append) {
        setLoadingMore(false);
        loadingMoreLock.current = false;
      } else {
        dispatch(endLoading());
      }
    }
  };

  useEffect(() => {
    handleRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, isMobile]);

  useEffect(() => {
    dispatch(getAllGotraData);
  }, [dispatch]);

  const loadMoreRequests = () => {
    if (!isMobile || loadingMoreLock.current || loadingMore || !hasMore) {
      return;
    }
    if (!(userList?.data?.length)) {
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
          loadMoreRequests();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, hasMore, mobilePage, loadingMore]);

  const handleReset = () => {
    setSelectedSearchByText("");
    setSelectedSearchBy({
      label: "",
      id: "",
    });
    setSelectedGotra([]);
    setSelectedSurname([]);
    setSelectedState([]);
    setSelectedRegion([]);
    setSelectedSamaj([]);
    setRegionListByState(region);
    setSamajListByRegion(samaj);
    handleRequestList(true);
  };
  const handleSelectedUser = (ids) => {
    setSelectedUsers([...ids]);
  };
  const handleRequestAll = async (action) => {
    dispatch(startLoading());
    try {
      await approveRejectMany(selectedUsers, action);
      if (isMobile) {
        setUserList((prev) => ({
          ...prev,
          data: (prev?.data || []).filter(
            (item) => !selectedUsers.includes(item.id)
          ),
          total: Math.max(0, (prev?.total || 0) - selectedUsers.length),
        }));
        setSelectedUsers([]);
      } else {
        handleRequestList();
      }
      setNotification({ type: "success", message: "Updated." });
    } catch (e) {
      setNotification({
        type: "error",
        message: e?.message || "Failed to update users.",
      });
    } finally {
      dispatch(endLoading());
    }
  };
  const pendingUsersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 100,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{masterLabelOf(surname, record?.row?.lastName)}</>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 150,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => <>{langText(record?.row?.gender) || "-"}</>,
    },
    {
      field: "region",
      headerName: "Region",
      width: 150,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{masterLabelOf(region, record?.row?.region)}</>
      ),
    },
    {
      field: "localSamaj",
      headerName: "Local Samaj",
      width: 150,
      flex: 2,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <>{masterLabelOf(samaj, record?.row?.localSamaj)}</>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 156,
      minWidth: 156,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-2 justify-center items-center shrink-0 px-1"}>
          <Tooltip title={"Details"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() => requestInfoModalOpen(record.row)}
            />
          </Tooltip>
          <Tooltip title={"Accept"}>
            <CheckIcon
              className={"text-[#34c375] cursor-pointer"}
              onClick={() => userActionHandler(record.row, true)}
            />
          </Tooltip>
          <Tooltip title={"Reject"}>
            <CloseIcon
              className={"text-[#ff0000] cursor-pointer"}
              onClick={() => userActionHandler(record.row, false)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const requests = userList?.data || [];
  const lookupName = (list, id) => masterLabelOf(list, id) || "-";

  const toggleCardSelection = (id) => {
    setSelectedUsers((prev) =>
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
          title="Pending Requests"
          actions={
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Tooltip title={"Accept all selected"}>
              <ActionButton
                className="w-full"
                onClick={() => handleRequestAll("accept")}
                icon={<PlaylistAddCheckIcon sx={{ fontSize: 18 }} />}
              >
                Accept{" "}
                {selectedUsers?.length > 0 ? `(${selectedUsers?.length})` : ""}
              </ActionButton>
            </Tooltip>
            <Tooltip title={"Reject all selected"}>
              <ActionButton
                variant="secondary"
                className="w-full"
                onClick={() => handleRequestAll("reject")}
                icon={<PlaylistRemoveIcon sx={{ fontSize: 18 }} />}
              >
                Reject{" "}
                {selectedUsers?.length > 0 ? `(${selectedUsers?.length})` : ""}
              </ActionButton>
            </Tooltip>
          </div>
          }
        />
        <MasterFilterBar
          searchPlaceholder="Search"
          searchValue={selectedSearchByText}
          onSearchChange={(e) => {
            setSelectedSearchByText(e.target.value);
            if (e.target.value === "") {
              handleRequestList(true);
            }
          }}
          searchDisabled={!selectedSearchBy.id}
          filterCount={
            Number(Boolean(selectedSearchByText.trim())) +
            Number(Boolean(selectedSearchBy.id)) +
            Number(Boolean(selectedGotra?.length > 0)) +
            Number(Boolean(selectedSurname?.length > 0)) +
            Number(Boolean(selectedState?.length > 0)) +
            Number(Boolean(selectedRegion?.length > 0)) +
            Number(Boolean(selectedSamaj?.length > 0))
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
                placeholder={"Select Your Last Name"}
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
              {hideLocationFilters ? null : (
                <>
              <CustomAutoComplete
                list={listHandler(state)}
                multiple={true}
                label={"State"}
                placeholder={"Select Your State"}
                {...filterCols}
                name="state"
                value={selectedState}
                onChange={async (e, state) => {
                  if (state) {
                    const Data = await handleListById("region", state);
                    setRegionListByState(Data);
                    setSelectedState((pre) => getSelectedData(pre, state, e));
                  }
                }}
              />
              <CustomAutoComplete
                list={listHandler(regionListByState)}
                multiple={true}
                label={"Region"}
                placeholder={"Select Your Region"}
                {...filterCols}
                name="region"
                value={selectedRegion}
                onChange={async (e, region) => {
                  if (region) {
                    const data = await handleListById("samaj", region);
                    setSamajListByRegion(data);
                    setSelectedRegion((pre) => getSelectedData(pre, region, e));
                  }
                }}
              />
              <CustomAutoComplete
                list={listHandler(samajListByRegion)}
                multiple={true}
                label={"Samaj"}
                placeholder={"Select Your Samaj"}
                {...filterCols}
                name="samaj"
                value={selectedSamaj}
                onChange={(e, samaj) => {
                  if (samaj) {
                    setSelectedSamaj((pre) => getSelectedData(pre, samaj, e));
                  }
                }}
              />
                </>
              )}
              <CustomAutoComplete
                list={requestFilterList}
                label={"Search By"}
                placeholder={"Select Your Search By"}
                {...filterCols}
                name="search"
                value={selectedSearchBy.label}
                onChange={(e, search) => {
                  setSelectedSearchBy({
                    label: search.label,
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
                  onSubmit={() => handleRequestList()}
                  onReset={handleReset}
                  showReset={Boolean(
                    selectedSearchByText ||
                      selectedSearchBy.name ||
                      selectedGotra?.length > 0 ||
                      selectedState?.length > 0 ||
                      selectedRegion?.length > 0 ||
                      selectedSurname?.length > 0 ||
                      selectedSamaj?.length > 0
                  )}
                />
              </Grid>
            </Grid>
          }
        />
        <div className={"hidden md:block w-full min-w-0"}>
          <CustomTable
            columns={pendingUsersTableHeader}
            data={userList}
            name={"pendingUser"}
            pageSize={rowsPerPage}
            type={"pendingList"}
            className={"mx-0 w-full"}
            setPageSize={setRowsPerPage}
            page={page}
            setPage={setPage}
            onRowSelectionModelChange={(ids) => handleSelectedUser(ids)}
            bulkActions={[
              {
                label: "Accept Selected",
                icon: <PlaylistAddCheckIcon />,
                onClick: () => handleRequestAll("accept"),
              },
              {
                label: "Reject Selected",
                icon: <PlaylistRemoveIcon />,
                variant: "outlined",
                onClick: () => handleRequestAll("reject"),
              },
            ]}
          />
        </div>
        <div className={"md:hidden w-full flex flex-col gap-3"}>
          {requests.length ? (
            requests.map((row) => {
              const fullName = [row.firstName, row.middleName]
                .filter(Boolean)
                .join(" ");
              const lastName = lookupName(surname, row.lastName);
              const isSelected = selectedUsers.includes(row.id);
              return (
                <Paper
                  key={row.id}
                  elevation={2}
                  className={"rounded-xl overflow-hidden !border-2 !border-solid !border-[#d7d0c8]"}
                >
                  <div className={"p-3"}>
                    <div className={"flex items-start justify-between gap-2"}>
                      <p className={"font-bold text-primary text-base leading-tight min-w-0 pr-1 break-words"}>
                        {fullName} {lastName}
                      </p>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleCardSelection(row.id)}
                        className={"!text-primary !p-2 !-m-2 shrink-0"}
                      />
                    </div>
                    <p className={"text-sm text-gray-600 mt-1"}>
                      Family ID: {row.familyId || "-"}
                    </p>
                    <p className={"text-sm text-gray-600 break-all"}>
                      {row.email || "-"}
                    </p>
                    <p className={"text-sm text-gray-600 capitalize break-words"}>
                      {langText(row.gender) || "-"} · {lookupName(region, row.region)} ·{" "}
                      {lookupName(samaj, row.localSamaj)}
                    </p>
                  </div>
                  <div className={"flex border-t border-[#ead9d9]"}>
                    <button
                      type="button"
                      className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-primary border-r border-[#ead9d9]"}
                      onClick={() => requestInfoModalOpen(row)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-[#34c375] border-r border-[#ead9d9]"}
                      onClick={() => userActionHandler(row, true)}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className={"flex-1 min-h-[44px] py-2.5 px-1 text-sm font-semibold text-[#ff0000]"}
                      onClick={() => userActionHandler(row, false)}
                    >
                      Reject
                    </button>
                  </div>
                </Paper>
              );
            })
          ) : (
            <Paper className={"p-8 text-center rounded-xl"}>
              <p className="text-sm font-semibold text-primary">No pending requests</p>
              <p className="text-sm text-mutedText mt-1">New requests will appear here.</p>
            </Paper>
          )}
          {hasMore && requests.length ? (
            <div ref={loadMoreRef} className={"flex justify-center py-3"}>
              {loadingMore ? <CircularProgress size={24} className={"!text-primary"} /> : null}
            </div>
          ) : null}
        </div>
      </ContainerPage>
      <FormModal
        open={requestInfoModel}
        onClose={requestInfoModalClose}
        title="View Detail"
        maxWidth="720px"
      >
          <Grid container spacing={2}>
            <CustomTextFieldInfo
              grid={12}
              label={"Family Id"}
              value={selectedUser?.familyId}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"First Name"}
              value={selectedUser?.firstName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Middle Name"}
              value={selectedUser?.middleName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Last Name"}
              value={lookupName(surname, selectedUser?.lastName)}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"E-mail"}
              value={selectedUser?.email}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Mobile"}
              value={selectedUser?.mobile}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Region"}
              value={lookupName(region, selectedUser?.region)}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Local Samaj"}
              value={lookupName(samaj, selectedUser?.localSamaj)}
            />
          </Grid>
      </FormModal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
