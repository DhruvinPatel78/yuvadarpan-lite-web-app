import { ButtonBase, styled } from "@mui/material";
import axios from "../util/useAxios";
import { masterNameText } from "../util/bhasha";
import { bilingualLabel, bilingualOptions, tForm } from "../i18n/yuvaForm";
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
  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];
  return rows.map((item) => ({
    ...item,
    label: masterNameText(item) || item.label || "",
    value: item.id,
  }));
};

export const allOptions = {
  label: tForm("en", "all"),
  value: "all",
  name: bilingualLabel("all"),
  id: "all",
};

export const isAllOption = (item) => {
  if (item == null || item === "") return false;
  const value = String(item.value ?? item.id ?? "").toLowerCase();
  if (value === "all") return true;
  const en = masterNameText(item, "en").toLowerCase();
  const gu = masterNameText(item, "gu");
  return en === "all" || gu === tForm("gu", "all");
};

export const listHandler = (data) => {
  const options = setLabelValueInList(data);
  return options.length > 0 ? [allOptions, ...options] : [];
};

export const masterKeys = (item) => {
  if (item == null || item === "") return [];
  if (typeof item !== "object") return [String(item)];
  return [
    item.uuid,
    item.id,
    item.value,
    item._id,
    item.mongoId,
    masterNameText(item),
    item.label,
  ]
    .filter((value) => value != null && String(value).trim() !== "")
    .map(String);
};

export const pickMasterId = (item) => {
  if (item == null || item === "") return "";
  if (typeof item !== "object") return String(item);
  return String(item.uuid || item.id || item.value || item._id || "").trim();
};

export const masterLabelOf = (list, id, lang = "en") => {
  if (id == null || id === "") return "";
  const key = String(id);
  const found = (Array.isArray(list) ? list : []).find((row) =>
    masterKeys(row).includes(key)
  );
  return masterNameText(found, lang);
};

export const resolveMasterId = (value, list = []) => {
  if (value == null || value === "") return "";
  const key = pickMasterId(value);
  const rows = Array.isArray(list) ? list : [];
  const found = rows.find((row) => masterKeys(row).includes(key));
  return found ? pickMasterId(found) : key;
};

export const toMasterOptions = (data) =>
  setLabelValueInList(data).filter((item) => item?.active !== false);

const collectParentIds = (parents, parentList = []) => {
  const selected = (Array.isArray(parents) ? parents : parents ? [parents] : []).filter(
    (item) => item && item !== "" && !isAllOption(item)
  );
  const ids = new Set();
  const pool = Array.isArray(parentList) ? parentList : [];
  selected.forEach((item) => {
    const keys = masterKeys(item);
    keys.forEach((key) => ids.add(key));
    pool.forEach((row) => {
      const rowKeys = masterKeys(row);
      if (keys.some((key) => rowKeys.includes(key))) {
        rowKeys.forEach((key) => ids.add(key));
      }
    });
  });
  return ids;
};

export const filterMastersByParents = (
  list,
  parentField,
  parents,
  { requireParent = false, parentList = [] } = {}
) => {
  const selected = (Array.isArray(parents) ? parents : parents ? [parents] : []).filter(
    (item) => item && item !== "" && !isAllOption(item)
  );
  const options = toMasterOptions(list);
  if (!selected.length) return requireParent ? [] : options;
  const parentIds = collectParentIds(selected, parentList);
  return options.filter((row) => parentIds.has(String(row?.[parentField] || "")));
};

export const optionsByParent = (list, parentField, parentId, parentList) => {
  const resolved = resolveMasterId(parentId, parentList);
  if (!resolved) return [];
  const matchedParent = (Array.isArray(parentList) ? parentList : []).find(
    (row) => masterKeys(row).includes(resolved)
  );
  return filterMastersByParents(
    list,
    parentField,
    matchedParent ? [matchedParent] : [{ id: resolved }],
    { requireParent: true, parentList }
  );
};

export const filterFieldCols = (count) =>
  Number(count) % 2 === 0
    ? { xs: 12, sm: 6, md: 6, lg: 6 }
    : { xs: 12, sm: 4, md: 4, lg: 4 };

const gotraKeys = (gotra) =>
  [
    masterNameText(gotra, "en"),
    masterNameText(gotra, "gu"),
    gotra?.label,
    gotra?.id,
    gotra?.value,
    gotra?._id,
  ]
    .filter((item) => item != null && String(item).trim() !== "")
    .map((item) => String(item).trim().toLowerCase());

export const surnameMatchesGotra = (row, gotra) => {
  if (!gotra) return true;
  const raw = String(row?.gotra || "").trim().toLowerCase();
  return Boolean(raw) && gotraKeys(gotra).includes(raw);
};

const selectedGotras = (gotra) =>
  (Array.isArray(gotra) ? gotra : gotra ? [gotra] : []).filter(
    (item) => item && !isAllOption(item)
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

export const getSelectedData = (_pre, data) => {
  const rows = Array.isArray(data) ? data : [];
  const allIndex = rows.findIndex(isAllOption);
  if (allIndex === -1) {
    return rows;
  }
  if (rows.length === 1 || allIndex === rows.length - 1) {
    return [allOptions];
  }
  return rows.filter((item) => !isAllOption(item));
};

export const handleListById = async (field, data) => {
  let selectedIds = [];
  let selectedStateData = [];
  data.forEach((data) => {
    if (isAllOption(data)) {
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
        ?.filter((data) => !isAllOption(data))
        ?.map((item) => item?.value),
    },
  });
  return response.data;
};

const roleOptions = [
  "ADMIN",
  "COUNTRY_MANAGER",
  "STATE_MANAGER",
  "REGION_MANAGER",
  "DISTRICT_MANAGER",
  "CITY_MANAGER",
  "SAMAJ_MANAGER",
  "USER",
].map((value) => ({
  id: value,
  value,
  name: bilingualLabel(`role.${value}`),
  label: tForm("en", `role.${value}`),
}));

export const rolesList = (includeAll = true) => {
  return includeAll ? [allOptions, ...roleOptions] : roleOptions;
};

const searchFieldOption = (id, key) => ({
  id,
  value: id,
  name: bilingualLabel(key),
  label: tForm("en", key),
});

export const requestFilterList = [
  searchFieldOption("familyId", "familyId"),
  searchFieldOption("firstName", "firstName"),
  searchFieldOption("mobile", "mobile"),
  searchFieldOption("email", "email"),
  searchFieldOption("gender", "gender"),
];

export const yuvaFilterList = [
  searchFieldOption("familyId", "familyId"),
  searchFieldOption("firstName", "firstName"),
  searchFieldOption("fatherName", "fatherName"),
  searchFieldOption("grandFatherName", "grandFatherName"),
  searchFieldOption("firmName", "firmName"),
  searchFieldOption("gender", "gender"),
];

export { bilingualOptions };

const SEARCH_FIELD_ALIASES = {
  firstname: "firstName",
  name: "firstName",
  "નામ": "firstName",
  familyid: "familyId",
  mobile: "mobile",
  phone: "mobile",
  "મોબાઇલ": "mobile",
  email: "email",
  "ઇમેઇલ": "email",
  gender: "gender",
  "લિંગ": "gender",
  fathername: "fatherName",
  grandfathername: "grandFatherName",
  firmname: "firmName",
  firm: "firmName",
};

export const resolveSearchField = (selected) => {
  if (selected == null || selected === "") {
    return "";
  }
  const raw =
    typeof selected === "object"
      ? String(selected.id || selected.value || "").trim()
      : String(selected).trim();
  if (!raw) {
    return "";
  }
  return SEARCH_FIELD_ALIASES[raw] || SEARCH_FIELD_ALIASES[raw.toLowerCase()] || raw;
};

export const searchTextParams = (selected, text) => {
  const field = resolveSearchField(selected);
  const value = String(text || "").trim();
  if (!field || !value) {
    return {};
  }
  return { [field]: value };
};

export const searchByFromOption = (search) => {
  if (!search) {
    return { name: "", id: "" };
  }
  return {
    name: search,
    id: resolveSearchField(search),
  };
};

export const getListById = async (field, id) => {
  const response = await axios.get(`/${field}/list/${id}`);
  return response.data.map((data) => ({
    ...data,
    label: masterNameText(data),
    value: data.id,
  }));
};

export const useFilteredIds = (selectedItems, key = "id") => {
  return useMemo(() => {
    const ids = [];
    (Array.isArray(selectedItems) ? selectedItems : []).forEach((item) => {
      if (item == null || item === "" || isAllOption(item)) {
        return;
      }
      if (typeof item !== "object") {
        const raw = String(item).trim();
        if (raw && raw.toLowerCase() !== "all") {
          ids.push(raw);
        }
        return;
      }
      const preferred = pickMasterId(item) || item[key];
      [preferred, item.uuid, item.id, item.value, item._id].forEach((value) => {
        if (value == null) {
          return;
        }
        const raw = String(value).trim();
        if (raw && raw.toLowerCase() !== "all") {
          ids.push(raw);
        }
      });
    });
    return [...new Set(ids)];
  }, [selectedItems, key]);
};
