import { ButtonBase, styled } from "@mui/material";
import axios from "../util/useAxios";

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

export const rolesList = (isAllOption = true) => {
  return isAllOption
    ? [
        allOptions,
        {
          label: "Admin",
          value: "ADMIN",
          id: "ADMIN",
        },
        {
          label: "Samaj Manager",
          value: "SAMAJ_MANAGER",
          id: "SAMAJ_MANAGER",
        },
        {
          label: "Region Manager",
          value: "REGION_MANAGER",
          id: "REGION_MANAGER",
        },
        {
          label: "User",
          value: "USER",
          id: "USER",
        },
      ]
    : [
        {
          label: "Admin",
          value: "ADMIN",
          id: "ADMIN",
        },
        {
          label: "Samaj Manager",
          value: "SAMAJ_MANAGER",
          id: "SAMAJ_MANAGER",
        },
        {
          label: "Region Manager",
          value: "REGION_MANAGER",
          id: "REGION_MANAGER",
        },
        {
          label: "User",
          value: "USER",
          id: "USER",
        },
      ];
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
    label: "Family Id",
  },
  {
    value: "firmName",
    label: "Firm Name",
  },
  {
    value: "gender",
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
