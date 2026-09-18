import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Badge,
  Collapse,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import { formatYuvaDob, isRegularUser, toCamelCase } from "../../../util/util";
import moment from "moment";
import { UseRedux } from "../../../Component/useRedux";
import ProfileCard from "../../../Component/Common/profileCard";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { endLoading, startLoading } from "../../../store/authSlice";
import { getYuvaList as fetchYuvaList } from "../../../util/yuvaApi";
import {
  addYuvaToShortlist,
  getShortlistIds,
  removeYuvaFromShortlist,
} from "../../../util/shortlistApi";
import { getNativeList } from "../../../util/yuvaAdminApi";
import { getGotraAllList } from "../../../util/gotraApi";
import CustomInput from "../../../Component/Common/customInput";
import {
  getAllCityData,
  getAllDistrictData,
  getAllRegionData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
} from "../../../util/getAPICall";
import {
  filterFieldCols,
  getSelectedData,
  gotraOptionList,
  handleListById,
  lastNameIdsForGotraFilter,
  listHandler,
  surnamesForGotra,
  useFilteredIds,
} from "../../../Component/constant";
import { Button, Card } from "../../../Component/UI";
import {
  bloodGroupList,
  educationList,
  maritalStatusList,
} from "../../Admin/YuvaList/BulkAddYuva/formConfig";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;
const searchFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    minHeight: 44,
    "& fieldset": { borderColor: "#d7d7e2" },
    "&:hover fieldset": { borderColor: "#c8c8d4" },
    "&.Mui-focused fieldset": { borderColor: "#542b2b" },
  },
};

const asFilterOptions = (values, labelFor) =>
  (Array.isArray(values) ? values : []).map((value) => {
    const label = labelFor ? labelFor(value) : value;
    return { id: value, name: label, label, value };
  });

const GENDER_OPTIONS = [
  { id: "male", name: "Male", label: "Male", value: "male" },
  { id: "female", name: "Female", label: "Female", value: "female" },
];
const BLOOD_GROUP_OPTIONS = asFilterOptions(bloodGroupList);
const MARITAL_STATUS_OPTIONS = asFilterOptions(maritalStatusList, toCamelCase);
const EDUCATION_OPTIONS = asFilterOptions(educationList);

const emptyAppliedFilters = {
  gotra: [],
  lastNameIds: [],
  stateIds: [],
  regionIds: [],
  districtIds: [],
  cityIds: [],
  samajIds: [],
  nativeIds: [],
  genders: [],
  bloodGroups: [],
  maritalStatuses: [],
  educations: [],
  minAge: "",
  maxAge: "",
};

const sanitizeAgeInput = (raw) => {
  if (raw === "") {
    return "";
  }
  const age = Number(raw);
  if (!Number.isFinite(age) || age < 0) {
    return null;
  }
  return String(Math.min(120, Math.floor(age)));
};

const Home = () => {
  const { surname, city, state, region, district, samaj, auth } = UseRedux();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canShortlist = isRegularUser(auth?.user?.role);
  const isMobile = useMediaQuery("(max-width:767.95px)");
  const [yuvaList, setYuvaList] = useState([]);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listPage, setListPage] = useState(1);
  const loadingMoreLock = useRef(false);
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gotraList, setGotraList] = useState([]);
  const [selectedGotra, setSelectedGotra] = useState([]);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState([]);
  const [selectedNative, setSelectedNative] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState([]);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [nativeList, setNativeList] = useState([]);
  const [regionListByState, setRegionListByState] = useState(region);
  const [districtListByRegion, setDistrictListByRegion] = useState(district);
  const [cityListByDistrict, setCityListByDistrict] = useState(city);
  const [samajListByParent, setSamajListByParent] = useState(samaj);
  const [appliedFilters, setAppliedFilters] = useState(emptyAppliedFilters);
  const [shortlistedIds, setShortlistedIds] = useState([]);

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredStateIds = useFilteredIds(selectedState, "id");
  const filteredRegionIds = useFilteredIds(selectedRegion, "id");
  const filteredDistrictIds = useFilteredIds(selectedDistrict, "id");
  const filteredCityIds = useFilteredIds(selectedCity, "id");
  const filteredSamajIds = useFilteredIds(selectedSamaj, "id");
  const filteredNativeIds = useFilteredIds(selectedNative, "id");
  const filteredGenders = useFilteredIds(selectedGender, "id");
  const filteredBloodGroups = useFilteredIds(selectedBloodGroup, "id");
  const filteredMaritalStatuses = useFilteredIds(selectedMaritalStatus, "id");
  const filteredEducations = useFilteredIds(selectedEducation, "id");
  const gotraOptions = useMemo(() => gotraOptionList(gotraList), [gotraList]);
  const surnameFilterList = useMemo(
    () => listHandler(surnamesForGotra(surname, selectedGotra)),
    [surname, selectedGotra]
  );

  const loadYuvas = async ({ pageNum = 1, append = false } = {}) => {
    if (append) {
      if (loadingMoreLock.current || loadingMore || !hasMore) {
        return;
      }
      loadingMoreLock.current = true;
      setLoadingMore(true);
    } else {
      dispatch(startLoading());
    }
    try {
      const params = {
        page: pageNum,
        limit: PAGE_SIZE,
      };
      if (debouncedKeyword) {
        params.search = debouncedKeyword;
      }
      if (appliedFilters.lastNameIds.length) {
        params.lastName = appliedFilters.lastNameIds;
      }
      if (appliedFilters.stateIds.length) {
        params.state = appliedFilters.stateIds;
      }
      if (appliedFilters.regionIds.length) {
        params.region = appliedFilters.regionIds;
      }
      if (appliedFilters.districtIds.length) {
        params.district = appliedFilters.districtIds;
      }
      if (appliedFilters.cityIds.length) {
        params.city = appliedFilters.cityIds;
      }
      if (appliedFilters.samajIds.length) {
        params.samaj = appliedFilters.samajIds;
      }
      if (appliedFilters.nativeIds.length) {
        params.native = appliedFilters.nativeIds;
      }
      if (appliedFilters.genders.length) {
        params.gender = appliedFilters.genders;
      }
      if (appliedFilters.bloodGroups?.length) {
        params.bloodGroup = appliedFilters.bloodGroups;
      }
      if (appliedFilters.maritalStatuses?.length) {
        params.martialStatus = appliedFilters.maritalStatuses;
      }
      if (appliedFilters.educations?.length) {
        params.education = appliedFilters.educations;
      }
      if (appliedFilters.minAge !== "") {
        params.minAge = appliedFilters.minAge;
      }
      if (appliedFilters.maxAge !== "") {
        params.maxAge = appliedFilters.maxAge;
      }
      const data = await fetchYuvaList(params);
      const rows = data?.data || [];
      setYuvaList((prev) => (append ? [...prev, ...rows] : rows));
      setListPage(pageNum);
      setHasMore(pageNum * PAGE_SIZE < (data?.total || 0));
    } catch (e) {
      if (!append) {
        setYuvaList([]);
        setHasMore(false);
      }
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
    dispatch(getAllCityData);
    dispatch(getAllStateData);
    dispatch(getAllRegionData);
    dispatch(getAllDistrictData);
    dispatch(getAllSamajData);
    dispatch(getAllSurnameData);
    getGotraAllList()
      .then((data) => setGotraList(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setGotraList([]));
    getNativeList()
      .then((data) => setNativeList(Array.isArray(data) ? data : []))
      .catch(() => setNativeList([]));
    if (canShortlist) {
      getShortlistIds()
        .then((ids) => setShortlistedIds((ids || []).map(String)))
        .catch(() => setShortlistedIds([]));
    }
  }, [canShortlist]);

  const yuvaRecordId = (yuva) => String(yuva?.id || yuva?._id || "");

  const handleToggleShortlist = async (event, yuva) => {
    event?.stopPropagation?.();
    if (!canShortlist) return;
    const yuvaId = yuvaRecordId(yuva);
    if (!yuvaId) return;
    const already = shortlistedIds.includes(yuvaId);
    setShortlistedIds((prev) =>
      already ? prev.filter((id) => id !== yuvaId) : [...prev, yuvaId]
    );
    try {
      if (already) {
        await removeYuvaFromShortlist(yuvaId);
      } else {
        await addYuvaToShortlist(yuvaId);
      }
    } catch (e) {
      setShortlistedIds((prev) =>
        already ? [...prev, yuvaId] : prev.filter((id) => id !== yuvaId)
      );
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(keywordSearch.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [keywordSearch]);

  useEffect(() => {
    if (selectedState.length === 0) {
      setRegionListByState(region);
    }
    if (selectedRegion.length === 0) {
      setDistrictListByRegion(district);
      setSamajListByParent(samaj);
    }
    if (selectedDistrict.length === 0) {
      setCityListByDistrict(city);
    }
  }, [
    region,
    district,
    city,
    samaj,
    selectedState.length,
    selectedRegion.length,
    selectedDistrict.length,
  ]);

  const loadMoreRef = useRef(null);
  const appliedFilterCount = [
    (appliedFilters.gotra || []).some((item) => item?.name !== "All"),
    appliedFilters.lastNameIds.length,
    appliedFilters.stateIds.length,
    appliedFilters.regionIds.length,
    appliedFilters.districtIds.length,
    appliedFilters.cityIds.length,
    appliedFilters.samajIds.length,
    appliedFilters.nativeIds.length,
    appliedFilters.genders.length,
    appliedFilters.bloodGroups?.length,
    appliedFilters.maritalStatuses?.length,
    appliedFilters.educations?.length,
    appliedFilters.minAge !== "",
    appliedFilters.maxAge !== "",
  ].filter(Boolean).length;

  useEffect(() => {
    loadYuvas({ pageNum: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, appliedFilters]);

  const handleLoadMore = useCallback(() => {
    loadYuvas({ pageNum: listPage + 1, append: true });
  }, [listPage, hasMore, loadingMore, debouncedKeyword, appliedFilters]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, yuvaList.length]);

  const handleApplyFilters = () => {
    let nextMinAge = minAge;
    let nextMaxAge = maxAge;
    if (
      nextMinAge !== "" &&
      nextMaxAge !== "" &&
      Number(nextMinAge) > Number(nextMaxAge)
    ) {
      nextMinAge = maxAge;
      nextMaxAge = minAge;
      setMinAge(nextMinAge);
      setMaxAge(nextMaxAge);
    }
    setAppliedFilters({
      gotra: selectedGotra,
      lastNameIds: lastNameIdsForGotraFilter(
        surname,
        selectedGotra,
        filteredSurnameIds
      ),
      stateIds: filteredStateIds,
      regionIds: filteredRegionIds,
      districtIds: filteredDistrictIds,
      cityIds: filteredCityIds,
      samajIds: filteredSamajIds,
      nativeIds: filteredNativeIds,
      genders: filteredGenders,
      bloodGroups: filteredBloodGroups,
      maritalStatuses: filteredMaritalStatuses,
      educations: filteredEducations,
      minAge: nextMinAge,
      maxAge: nextMaxAge,
    });
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  const handleReset = () => {
    setSelectedGotra([]);
    setSelectedSurname([]);
    setKeywordSearch("");
    setDebouncedKeyword("");
    setSelectedState([]);
    setSelectedRegion([]);
    setSelectedDistrict([]);
    setSelectedCity([]);
    setSelectedSamaj([]);
    setSelectedNative([]);
    setSelectedGender([]);
    setSelectedBloodGroup([]);
    setSelectedMaritalStatus([]);
    setSelectedEducation([]);
    setMinAge("");
    setMaxAge("");
    setRegionListByState(region);
    setDistrictListByRegion(district);
    setCityListByDistrict(city);
    setSamajListByParent(samaj);
    setAppliedFilters(emptyAppliedFilters);
  };

  const fieldSize = { ...filterFieldCols(3), sm: 6, md: 3, lg: 3 };
  const showReset =
    selectedState?.length > 0 ||
    selectedRegion?.length > 0 ||
    selectedDistrict?.length > 0 ||
    selectedCity?.length > 0 ||
    selectedGotra?.length > 0 ||
    selectedSurname?.length > 0 ||
    keywordSearch ||
    selectedSamaj?.length > 0 ||
    selectedNative?.length > 0 ||
    selectedGender?.length > 0 ||
    selectedBloodGroup?.length > 0 ||
    selectedMaritalStatus?.length > 0 ||
    selectedEducation?.length > 0 ||
    minAge !== "" ||
    maxAge !== "" ||
    appliedFilterCount > 0;

  const filterFields = (
    <>
      <CustomAutoComplete
        list={gotraOptions}
        multiple={true}
        label={"Gotra"}
        placeholder={"Select Your Gotra"}
        {...fieldSize}
        name="gotra"
        value={selectedGotra}
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
        {...fieldSize}
        name="surname"
        value={selectedSurname}
        onChange={(e, lastName) => {
          if (lastName) {
            setSelectedSurname((pre) => getSelectedData(pre, lastName, e));
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(state)}
        multiple={true}
        label={"State"}
        placeholder={"Select Your State"}
        {...fieldSize}
        name="state"
        value={selectedState}
        onChange={async (e, selected) => {
          if (selected) {
            const data = await handleListById("region", selected);
            setRegionListByState(data);
            setSelectedState((pre) => getSelectedData(pre, selected, e));
            setSelectedRegion([]);
            setSelectedDistrict([]);
            setSelectedCity([]);
            setSelectedSamaj([]);
            setDistrictListByRegion(district);
            setCityListByDistrict(city);
            setSamajListByParent(samaj);
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(regionListByState)}
        multiple={true}
        label={"Region"}
        placeholder={"Select Your Region"}
        {...fieldSize}
        name="region"
        value={selectedRegion}
        onChange={async (e, selected) => {
          if (selected) {
            const [districtData, samajData] = await Promise.all([
              handleListById("district", selected),
              handleListById("samaj", selected),
            ]);
            setDistrictListByRegion(districtData);
            setSamajListByParent(samajData);
            setSelectedRegion((pre) => getSelectedData(pre, selected, e));
            setSelectedDistrict([]);
            setSelectedCity([]);
            setSelectedSamaj([]);
            setCityListByDistrict(city);
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(districtListByRegion)}
        multiple={true}
        label={"District"}
        placeholder={"Select Your District"}
        {...fieldSize}
        name="district"
        value={selectedDistrict}
        onChange={async (e, selected) => {
          if (selected) {
            const data = await handleListById("city", selected);
            setCityListByDistrict(data);
            setSelectedDistrict((pre) => getSelectedData(pre, selected, e));
            const districtIds = selected
              .filter((item) => item.name !== "All")
              .map((item) => item.id);
            const matchingSamaj = districtIds.length
              ? samaj.filter((item) => districtIds.includes(item.district_id))
              : samaj;
            setSamajListByParent(matchingSamaj.length ? matchingSamaj : samaj);
            setSelectedCity([]);
            setSelectedSamaj([]);
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(cityListByDistrict)}
        multiple={true}
        label={"City"}
        placeholder={"Select Your City"}
        {...fieldSize}
        name="city"
        value={selectedCity}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedCity((pre) => getSelectedData(pre, selected, e));
            const cityIds = selected
              .filter((item) => item.name !== "All")
              .map((item) => item.id);
            const matchingSamaj = cityIds.length
              ? samaj.filter((item) => cityIds.includes(item.city_id))
              : samaj;
            setSamajListByParent(matchingSamaj.length ? matchingSamaj : samaj);
            setSelectedSamaj([]);
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(samajListByParent)}
        multiple={true}
        label={"Samaj"}
        placeholder={"Select Your Samaj"}
        {...fieldSize}
        name="samaj"
        value={selectedSamaj}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedSamaj((pre) => getSelectedData(pre, selected, e));
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(nativeList)}
        multiple={true}
        label={"Native"}
        placeholder={"Select Native"}
        {...fieldSize}
        name="native"
        value={selectedNative}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedNative((pre) => getSelectedData(pre, selected, e));
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(GENDER_OPTIONS)}
        multiple={true}
        label={"Gender"}
        placeholder={"Select Gender"}
        {...fieldSize}
        name="gender"
        value={selectedGender}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedGender((pre) => getSelectedData(pre, selected, e));
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(BLOOD_GROUP_OPTIONS)}
        multiple={true}
        label={"Blood group"}
        placeholder={"Select Blood Group"}
        {...fieldSize}
        name="bloodGroup"
        value={selectedBloodGroup}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedBloodGroup((pre) => getSelectedData(pre, selected, e));
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(MARITAL_STATUS_OPTIONS)}
        multiple={true}
        label={"Marital status"}
        placeholder={"Select Marital Status"}
        {...fieldSize}
        name="martialStatus"
        value={selectedMaritalStatus}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedMaritalStatus((pre) => getSelectedData(pre, selected, e));
          }
        }}
      />
      <CustomAutoComplete
        list={listHandler(EDUCATION_OPTIONS)}
        multiple={true}
        label={"Education"}
        placeholder={"Select Education"}
        {...fieldSize}
        name="education"
        value={selectedEducation}
        onChange={(e, selected) => {
          if (selected) {
            setSelectedEducation((pre) => getSelectedData(pre, selected, e));
          }
        }}
      />
      <CustomInput
        type="number"
        label="Min age"
        placeholder="From"
        name="minAge"
        min={0}
        max={120}
        {...fieldSize}
        value={minAge}
        onChange={(event) => {
          const next = sanitizeAgeInput(event.target.value);
          if (next !== null) {
            setMinAge(next);
          }
        }}
      />
      <CustomInput
        type="number"
        label="Max age"
        placeholder="To"
        name="maxAge"
        min={0}
        max={120}
        {...fieldSize}
        value={maxAge}
        onChange={(event) => {
          const next = sanitizeAgeInput(event.target.value);
          if (next !== null) {
            setMaxAge(next);
          }
        }}
      />
    </>
  );

  const filterActions = (
    <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-end gap-2 md:gap-4">
      <Button
        type="button"
        variant="ghost"
        onClick={handleReset}
        disabled={!showReset}
        className="max-md:w-full"
      >
        Clear
      </Button>
      <Button
        type="button"
        onClick={handleApplyFilters}
        className="max-md:w-full"
        icon={<FilterListIcon sx={{ fontSize: 18 }} />}
      >
        Apply filters
      </Button>
    </div>
  );

  return (
    <div>
      <Header />
      <Container maxWidth="xl" className={"p-3 sm:p-4 pb-6"}>
        {canShortlist ? (
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-lg font-WorkSemiBold text-primary">Yuva directory</p>
            <Button
              variant="secondary"
              onClick={() => navigate("/shortlisted")}
            >
              Your Shortlisted
            </Button>
          </div>
        ) : null}
        <Card padded={false} className="p-2.5 sm:p-3 mb-5" key="directory-filters">
          <div className="flex items-center gap-2 w-full min-w-0">
            <TextField
              className="flex-1 min-w-0"
              placeholder="Search by name, father, mobile, family ID"
              value={keywordSearch}
              onChange={(event) => setKeywordSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9a9aa8" }} />
                  </InputAdornment>
                ),
              }}
              sx={searchFieldSx}
            />
            <Badge
              badgeContent={appliedFilterCount}
              color="error"
              overlap="circular"
            >
              <IconButton
                aria-label="Filter"
                aria-expanded={isFilterOpen}
                onClick={() => setIsFilterOpen((open) => !open)}
                className="!h-11 !w-11 !rounded-lg shrink-0 !border !border-solid !border-line"
                sx={{
                  color: "#542b2b",
                  backgroundColor:
                    isFilterOpen || appliedFilterCount > 0
                      ? "#ececf4"
                      : "#f6f6fa",
                  "&:hover": {
                    backgroundColor: "#e8e8ef",
                  },
                }}
              >
                <TuneIcon />
              </IconButton>
            </Badge>
          </div>
          <Collapse in={isFilterOpen} timeout={280}>
            <div className="border-t border-line mt-3 sm:mt-4 pt-4">
              <Grid spacing={2} container>
                {filterFields}
                <Grid item xs={12} className="!pt-4">
                  {filterActions}
                </Grid>
              </Grid>
            </div>
          </Collapse>
        </Card>
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {yuvaList?.map((data) => (
            <ProfileCard
              key={data?.id}
              imgSrc={data?.profile?.url}
              name={toCamelCase(data?.firstName)}
              location={toCamelCase(
                city.find((i) => i?.id === data?.city)?.name
              )}
              age={moment().diff(data?.dob, "years")}
              dob={formatYuvaDob(data?.dob)}
              father={`${toCamelCase(data?.fatherName)} ${toCamelCase(
                data?.grandFatherName
              )}`}
              mother={toCamelCase(data?.motherName)}
              firm={toCamelCase(data?.firm)}
              surname={toCamelCase(
                surname.find((i) => i?.id === data?.lastName)?.name
              )}
              shortlisted={shortlistedIds.includes(String(data?.id || data?._id))}
              onToggleShortlist={
                canShortlist
                  ? () => handleToggleShortlist(null, data)
                  : undefined
              }
              onClick={() =>
                navigate(
                  canShortlist
                    ? `/yuva/${data?.id || data?._id}`
                    : `/admin/yuvalist/${data?.id || data?._id}`,
                  { state: { ...data } }
                )
              }
            />
          ))}
        </div>
        {yuvaList.length === 0 ? (
          <p className="mt-12 text-center text-sm text-mutedText">
            No yuva found.
            <span className="block mt-1">
              Try a different search or clear your filters.
            </span>
          </p>
        ) : hasMore ? (
          <div ref={loadMoreRef} className="h-10 w-full" />
        ) : null}
      </Container>
    </div>
  );
};

export default Home;
