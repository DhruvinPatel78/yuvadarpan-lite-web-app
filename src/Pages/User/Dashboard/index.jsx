import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import {
  Badge,
  Collapse,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { formatYuvaDob, toCamelCase } from "../../../util/util";
import moment from "moment";
import { UseRedux } from "../../../Component/useRedux";
import ProfileCard from "../../../Component/Common/profileCard";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { endLoading, startLoading } from "../../../store/authSlice";
import { getYuvaList as fetchYuvaList } from "../../../util/yuvaApi";
import {
  getAllCityData,
  getAllDistrictData,
  getAllRegionData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
} from "../../../util/getAPICall";
import {
  getSelectedData,
  handleListById,
  listHandler,
  useFilteredIds,
} from "../../../Component/constant";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

const Home = () => {
  const { surname, city, state, region, district, samaj } = UseRedux();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [yuvaList, setYuvaList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listPage, setListPage] = useState(1);
  const loadingMoreLock = useRef(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSurname, setSelectedSurname] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState([]);
  const [regionListByState, setRegionListByState] = useState(region);
  const [districtListByRegion, setDistrictListByRegion] = useState(district);
  const [cityListByDistrict, setCityListByDistrict] = useState(city);
  const [samajListByParent, setSamajListByParent] = useState(samaj);
  const [appliedFilters, setAppliedFilters] = useState({
    surnameIds: [],
    stateIds: [],
    regionIds: [],
    districtIds: [],
    cityIds: [],
    samajIds: [],
  });

  const filteredSurnameIds = useFilteredIds(selectedSurname, "id");
  const filteredStateIds = useFilteredIds(selectedState, "id");
  const filteredRegionIds = useFilteredIds(selectedRegion, "id");
  const filteredDistrictIds = useFilteredIds(selectedDistrict, "id");
  const filteredCityIds = useFilteredIds(selectedCity, "id");
  const filteredSamajIds = useFilteredIds(selectedSamaj, "id");

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
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (appliedFilters.surnameIds.length) {
        params.lastName = appliedFilters.surnameIds;
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
        setTimeout(() => {
          dispatch(endLoading());
        }, 400);
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
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

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
    appliedFilters.surnameIds.length,
    appliedFilters.stateIds.length,
    appliedFilters.regionIds.length,
    appliedFilters.districtIds.length,
    appliedFilters.cityIds.length,
    appliedFilters.samajIds.length,
  ].filter(Boolean).length;

  useEffect(() => {
    loadYuvas({ pageNum: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, appliedFilters]);

  const handleLoadMore = useCallback(() => {
    loadYuvas({ pageNum: listPage + 1, append: true });
  }, [listPage, hasMore, loadingMore, debouncedSearch, appliedFilters]);

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
    setAppliedFilters({
      surnameIds: filteredSurnameIds,
      stateIds: filteredStateIds,
      regionIds: filteredRegionIds,
      districtIds: filteredDistrictIds,
      cityIds: filteredCityIds,
      samajIds: filteredSamajIds,
    });
  };

  const handleReset = () => {
    setSelectedSurname([]);
    setSelectedState([]);
    setSelectedRegion([]);
    setSelectedDistrict([]);
    setSelectedCity([]);
    setSelectedSamaj([]);
    setRegionListByState(region);
    setDistrictListByRegion(district);
    setCityListByDistrict(city);
    setSamajListByParent(samaj);
    setAppliedFilters({
      surnameIds: [],
      stateIds: [],
      regionIds: [],
      districtIds: [],
      cityIds: [],
      samajIds: [],
    });
  };

  return (
    <div>
      <Header />
      <Container maxWidth="xl" className={"p-4"}>
        <div className="flex items-stretch gap-3 mb-3">
          <TextField
            fullWidth
            placeholder="Search by name, father, mobile, family ID, email"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#572a2a" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "12px",
                "& fieldset": { borderColor: "#572a2a" },
                "&:hover fieldset": { borderColor: "#572a2a" },
                "&.Mui-focused fieldset": { borderColor: "#572a2a" },
              },
            }}
          />
          <Badge
            badgeContent={appliedFilterCount}
            color="error"
            overlap="circular"
          >
            <IconButton
              aria-label="Filter"
              onClick={() => setIsFilterOpen((open) => !open)}
              className={`h-14 w-14 rounded-xl border-2 border-solid ${
                isFilterOpen
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              }`}
              sx={{
                borderColor: "#572a2a",
                color: isFilterOpen ? "#fff" : "#572a2a",
                backgroundColor: isFilterOpen ? "#572a2a" : "#fff",
                "&:hover": {
                  backgroundColor: isFilterOpen ? "#572a2a" : "#f7efef",
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        </div>
        <Collapse in={isFilterOpen}>
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
            <Grid spacing={2} container>
              <CustomAutoComplete
                list={listHandler(surname)}
                multiple={true}
                label={"Surname"}
                placeholder={"Select Your Last Name"}
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
                list={listHandler(state)}
                multiple={true}
                label={"State"}
                placeholder={"Select Your State"}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                name="state"
                value={selectedState}
                onChange={async (e, selected) => {
                  if (selected) {
                    const data = await handleListById("region", selected);
                    setRegionListByState(data);
                    setSelectedState((pre) =>
                      getSelectedData(pre, selected, e)
                    );
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
                xs={12}
                sm={6}
                md={4}
                lg={3}
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
                    setSelectedRegion((pre) =>
                      getSelectedData(pre, selected, e)
                    );
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
                xs={12}
                sm={6}
                md={4}
                lg={3}
                name="district"
                value={selectedDistrict}
                onChange={async (e, selected) => {
                  if (selected) {
                    const data = await handleListById("city", selected);
                    setCityListByDistrict(data);
                    setSelectedDistrict((pre) =>
                      getSelectedData(pre, selected, e)
                    );
                    const districtIds = selected
                      .filter((item) => item.name !== "All")
                      .map((item) => item.id);
                    const matchingSamaj = districtIds.length
                      ? samaj.filter((item) =>
                          districtIds.includes(item.district_id)
                        )
                      : samaj;
                    setSamajListByParent(
                      matchingSamaj.length ? matchingSamaj : samaj
                    );
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
                xs={12}
                sm={6}
                md={4}
                lg={3}
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
                    setSamajListByParent(
                      matchingSamaj.length ? matchingSamaj : samaj
                    );
                    setSelectedSamaj([]);
                  }
                }}
              />
              <CustomAutoComplete
                list={listHandler(samajListByParent)}
                multiple={true}
                label={"Samaj"}
                placeholder={"Select Your Samaj"}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                name="samaj"
                value={selectedSamaj}
                onChange={(e, selected) => {
                  if (selected) {
                    setSelectedSamaj((pre) =>
                      getSelectedData(pre, selected, e)
                    );
                  }
                }}
              />
              <Grid
                item
                xs={12}
                className={"flex justify-center items-center gap-4"}
              >
                <button
                  className={"bg-primary text-white p-2 px-4 rounded font-bold"}
                  onClick={handleApplyFilters}
                >
                  Submit
                </button>
                {(selectedState?.length > 0 ||
                  selectedRegion?.length > 0 ||
                  selectedDistrict?.length > 0 ||
                  selectedCity?.length > 0 ||
                  selectedSurname?.length > 0 ||
                  selectedSamaj?.length > 0 ||
                  appliedFilterCount > 0) && (
                  <button
                    className={
                      "bg-primary text-white p-2 px-4 rounded font-bold cursor-pointer"
                    }
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                )}
              </Grid>
            </Grid>
          </div>
        </Collapse>
        <Grid container spacing={2}>
          {yuvaList?.map((data) => (
            <Grid item key={data?.id} xs={12} sm={6} md={4} lg={3}>
              <ProfileCard
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
                onClick={() =>
                  navigate(`/admin/yuvalist/${data?.id}`, {
                    state: { ...data },
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
        {yuvaList.length === 0 ? (
          <div className="flex justify-center items-center mt-10 text-primary font-semibold">
            No yuva found.
          </div>
        ) : hasMore ? (
          <div ref={loadMoreRef} className="h-10 w-full" />
        ) : null}
      </Container>
    </div>
  );
};

export default Home;
