import { ButtonBase, styled } from "@mui/material";
import axios from "../util/useAxios";
import { useMemo } from "react";

export const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 110,
  borderRadius: "150px",
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.4,
    },
    "& .MuiImageMarked-root": {
      opacity: 1,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

export const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
  borderRadius: "150px",
});

export const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: "#0000006e",
  opacity: 0.15,
  transition: theme.transitions.create("opacity"),
  borderRadius: "150px",
}));

const setLabelValueInList = (data) => {
  return data.map((data) => ({
    ...data,
    label: data.name,
    value: data.id,
  }));
};

export const allOptions = {
  label: "All",
  value: "all",
  name: "All",
  id: "",
};

export const listHandler = (data) => {
  return data?.length > 0 ? [allOptions, ...setLabelValueInList(data)] : [];
};

export const filterFieldCols = (count) =>
  Number(count) % 2 === 0
    ? { xs: 12, sm: 6, md: 6, lg: 6 }
    : { xs: 12, sm: 4, md: 4, lg: 4 };

const gotraKeys = (gotra) =>
  [gotra?.name, gotra?.label, gotra?.id, gotra?.value, gotra?._id]
    .filter(Boolean)
    .map((item) => String(item).trim().toLowerCase());

export const surnameMatchesGotra = (row, gotra) => {
  if (!gotra) return true;
  const raw = String(row?.gotra || "").trim().toLowerCase();
  return Boolean(raw) && gotraKeys(gotra).includes(raw);
};

const selectedGotras = (gotra) =>
  (Array.isArray(gotra) ? gotra : gotra ? [gotra] : []).filter(
    (item) => item && item.name !== "All"
  );

export const surnamesForGotra = (surnameList, gotra) => {
  const rows = Array.isArray(surnameList) ? surnameList : [];
  const picked = selectedGotras(gotra);
  if (!picked.length) return rows;
  return rows.filter((row) =>
    picked.some((item) => surnameMatchesGotra(row, item))
  );
};

export const gotraOptionList = (gotraList) =>
  listHandler(
    (Array.isArray(gotraList) ? gotraList : []).filter(
      (item) => item?.active !== false
    )
  );

export const lastNameIdsForGotraFilter = (
  surnameList,
  gotra,
  selectedSurnameIds = []
) => {
  if (selectedSurnameIds?.length) return selectedSurnameIds;
  const picked = selectedGotras(gotra);
  if (!picked.length) return [];
  const ids = surnamesForGotra(surnameList, picked)
    .map((row) => row.id || row._id)
    .filter(Boolean)
    .map(String);
  return ids.length ? ids : ["__none__"];
};

export const getSelectedData = (pre, data, e) => {
  return (data.map((item) => item.name).includes("All") &&
    data?.length === 1) ||
    (data.map((item) => item.name).includes("All") &&
      data
        .map((item) => item.name)
        ?.findIndex((indexData) => indexData === "All") !== 0)
    ? [allOptions]
    : pre
        .map((item) => item.name)
        ?.find((pData) => pData === e.target.innerText)
    ? [...pre]
    : [...data].filter((item) => item.name !== "All");
};

export const handleListById = async (field, data) => {
  let selectedIds = [];
  let selectedStateData = [];
  data.forEach((data) => {
    if (data.value === "all") {
      selectedIds = [];
      selectedStateData = [];
    } else {
      !selectedIds.includes(data?.id) &&
        selectedIds.push(data?.id) &&
        selectedStateData.push(data);
    }
  });
  const response = await axios.get(`/${field}/get-all-list`, {
    params: {
      data: selectedStateData
        ?.filter((data) => data.label !== "All")
        ?.map((item) => item?.value),
    },
  });
  return response.data;
};

const roleOptions = [
  {
    label: "Admin",
    value: "ADMIN",
    id: "ADMIN",
  },
  {
    label: "Country Manager",
    value: "COUNTRY_MANAGER",
    id: "COUNTRY_MANAGER",
  },
  {
    label: "State Manager",
    value: "STATE_MANAGER",
    id: "STATE_MANAGER",
  },
  {
    label: "Region Manager",
    value: "REGION_MANAGER",
    id: "REGION_MANAGER",
  },
  {
    label: "District Manager",
    value: "DISTRICT_MANAGER",
    id: "DISTRICT_MANAGER",
  },
  {
    label: "City Manager",
    value: "CITY_MANAGER",
    id: "CITY_MANAGER",
  },
  {
    label: "Samaj Manager",
    value: "SAMAJ_MANAGER",
    id: "SAMAJ_MANAGER",
  },
  {
    label: "User",
    value: "USER",
    id: "USER",
  },
];

export const rolesList = (isAllOption = true) => {
  return isAllOption ? [allOptions, ...roleOptions] : roleOptions;
};

export const requestFilterList = [
  {
    value: "familyId",
    id: "familyId",
    label: "Family Id",
  },
  {
    id: "firstName",
    value: "firstName",
    label: "First Name",
  },
  {
    value: "mobile",
    id: "mobile",
    label: "Mobile",
  },
  {
    value: "email",
    id: "email",
    label: "Email",
  },
  {
    value: "gender",
    id: "gender",
    label: "Gender",
  },
];

export const yuvaFilterList = [
  {
    value: "familyId",
    id: "familyId",
    label: "Family Id",
  },
  {
    value: "firstName",
    id: "firstName",
    label: "First Name",
  },
  {
    value: "fatherName",
    id: "fatherName",
    label: "Father Name",
  },
  {
    value: "grandFatherName",
    id: "grandFatherName",
    label: "Grand Father Name",
  },
  {
    value: "firmName",
    id: "firmName",
    label: "Firm Name",
  },
  {
    value: "gender",
    id: "gender",
    label: "Gender",
  },
];

export const getListById = async (field, id) => {
  const response = await axios.get(`/${field}/list/${id}`);
  return response.data.map((data) => ({
    ...data,
    label: data.name,
    value: data.id,
  }));
};

export const useFilteredIds = (selectedItems, key) => {
  return useMemo(
    () =>
      selectedItems
        .filter((item) => item.name !== "All")
        .map((item) => item[key]),
    [selectedItems, key]
  );
};
