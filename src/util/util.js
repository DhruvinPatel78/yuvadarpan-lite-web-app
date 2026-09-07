import moment from "moment";

export const toCamelCase = (str = "") => {
  let result = str;
  if (result.length) {
    result = result[0].toUpperCase() + result.slice(1, result.length);
  }

  return result;
};

export const normalizeRole = (role) => {
  const raw =
    typeof role === "object" && role
      ? role.name || role.value || role.role || ""
      : role;
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

export const isAdmin = (role) => normalizeRole(role) === "ADMIN";

export const isRegularUser = (role) => normalizeRole(role) === "USER";

export const isSamajManager = (role) =>
  normalizeRole(role) === "SAMAJ_MANAGER";

export const isCityManager = (role) => normalizeRole(role) === "CITY_MANAGER";

export const isDistrictManager = (role) =>
  normalizeRole(role) === "DISTRICT_MANAGER";

export const isRegionManager = (role) =>
  normalizeRole(role) === "REGION_MANAGER";

export const isStateManager = (role) =>
  normalizeRole(role) === "STATE_MANAGER";

export const isCountryManager = (role) =>
  normalizeRole(role) === "COUNTRY_MANAGER";

export const formatYuvaDob = (value) => {
  if (value == null || value === "") return "";
  const raw =
    typeof value === "object" && value.$date ? value.$date : value;
  const parsed = moment(raw);
  if (parsed.isValid()) {
    const hasTime =
      parsed.hours() !== 0 || parsed.minutes() !== 0 || parsed.seconds() !== 0;
    return parsed.format(hasTime ? "DD/MM/YYYY, hh:mm A" : "DD/MM/YYYY");
  }
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 8) {
    const compact = moment(digits, "DDMMYYYY", true);
    if (compact.isValid()) return compact.format("DD/MM/YYYY");
  }
  return "";
};

export const isLocationMasterReadOnly = (role) =>
  isSamajManager(role) ||
  isCityManager(role) ||
  isDistrictManager(role) ||
  isRegionManager(role) ||
  isStateManager(role) ||
  isCountryManager(role);

export const hideLocationRowActions = (role) =>
  isCityManager(role) ||
  isDistrictManager(role) ||
  isRegionManager(role) ||
  isStateManager(role) ||
  isCountryManager(role);

const asEntityId = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "object") {
    return String(value.id || value._id || value.value || "");
  }
  return String(value);
};

const sameEntityId = (a, b) => {
  const left = asEntityId(a);
  const right = asEntityId(b);
  return Boolean(left) && left === right;
};

const findEntityById = (list, id) => {
  const target = asEntityId(id);
  if (!target) return null;
  return (
    (list || []).find(
      (item) => sameEntityId(item?.id, target) || sameEntityId(item?._id, target)
    ) || null
  );
};

const collectEntityIds = (...values) => {
  const ids = new Set();
  values.forEach((value) => {
    const id = asEntityId(value);
    if (id) ids.add(id);
  });
  return ids;
};

const scopeHasId = (scopeIds, ...values) =>
  values.some((value) => {
    const id = asEntityId(value);
    return Boolean(id) && scopeIds.has(id);
  });

const entityInScope = (list, scopeIds, parentKey, matchId) =>
  (list || []).some(
    (item) =>
      scopeHasId(scopeIds, item?.[parentKey]) &&
      (sameEntityId(item?.id, matchId) || sameEntityId(item?._id, matchId))
  );

const resolveManagerLocationScope = (user, lists = {}) => {
  const samajDoc = findEntityById(lists.samaj, user?.localSamaj);
  const cityDoc =
    findEntityById(lists.city, user?.city) ||
    findEntityById(lists.city, samajDoc?.city_id);
  const districtDoc =
    findEntityById(lists.district, user?.district) ||
    findEntityById(lists.district, samajDoc?.district_id) ||
    findEntityById(lists.district, cityDoc?.district_id);
  const regionDoc =
    findEntityById(lists.region, user?.region) ||
    findEntityById(lists.region, samajDoc?.region_id) ||
    findEntityById(lists.region, districtDoc?.region_id) ||
    findEntityById(lists.region, cityDoc?.region_id);
  const stateDoc =
    findEntityById(lists.state, user?.state) ||
    findEntityById(lists.state, samajDoc?.state_id) ||
    findEntityById(lists.state, regionDoc?.state_id) ||
    findEntityById(lists.state, districtDoc?.state_id) ||
    findEntityById(lists.state, cityDoc?.state_id);
  const countryDoc =
    findEntityById(lists.country, user?.country) ||
    findEntityById(lists.country, samajDoc?.country_id) ||
    findEntityById(lists.country, stateDoc?.country_id) ||
    findEntityById(lists.country, regionDoc?.country_id);

  return {
    samajIds: collectEntityIds(user?.localSamaj, samajDoc?.id, samajDoc?._id),
    cityIds: collectEntityIds(
      user?.city,
      samajDoc?.city_id,
      cityDoc?.id,
      cityDoc?._id
    ),
    districtIds: collectEntityIds(
      user?.district,
      samajDoc?.district_id,
      cityDoc?.district_id,
      districtDoc?.id,
      districtDoc?._id
    ),
    regionIds: collectEntityIds(
      user?.region,
      samajDoc?.region_id,
      districtDoc?.region_id,
      cityDoc?.region_id,
      regionDoc?.id,
      regionDoc?._id
    ),
    stateIds: collectEntityIds(
      user?.state,
      samajDoc?.state_id,
      regionDoc?.state_id,
      districtDoc?.state_id,
      cityDoc?.state_id,
      stateDoc?.id,
      stateDoc?._id
    ),
    countryIds: collectEntityIds(
      user?.country,
      samajDoc?.country_id,
      stateDoc?.country_id,
      regionDoc?.country_id,
      countryDoc?.id,
      countryDoc?._id
    ),
  };
};

export const canEditYuvaRecord = (user, yuva, lists = {}) => {
  const role = normalizeRole(user?.role);
  if (role === "ADMIN") return true;
  if (!isLocationMasterReadOnly(role) || !yuva) return false;

  const scope = resolveManagerLocationScope(user, lists);
  const yuvaSamaj = findEntityById(lists.samaj, yuva.localSamaj);
  const yuvaCity =
    findEntityById(lists.city, yuva.city) ||
    findEntityById(lists.city, yuvaSamaj?.city_id);

  if (role === "SAMAJ_MANAGER") {
    return scopeHasId(scope.samajIds, yuva.localSamaj, yuvaSamaj?.id, yuvaSamaj?._id);
  }
  if (role === "CITY_MANAGER") {
    return (
      scopeHasId(
        scope.cityIds,
        yuva.city,
        yuvaSamaj?.city_id,
        yuvaCity?.id,
        yuvaCity?._id
      ) || entityInScope(lists.samaj, scope.cityIds, "city_id", yuva.localSamaj)
    );
  }
  if (role === "DISTRICT_MANAGER") {
    return (
      scopeHasId(
        scope.districtIds,
        yuva.district,
        yuvaSamaj?.district_id,
        yuvaCity?.district_id
      ) ||
      entityInScope(lists.city, scope.districtIds, "district_id", yuva.city) ||
      entityInScope(lists.samaj, scope.districtIds, "district_id", yuva.localSamaj)
    );
  }
  if (role === "REGION_MANAGER") {
    return (
      scopeHasId(
        scope.regionIds,
        yuva.region,
        yuvaSamaj?.region_id,
        yuvaCity?.region_id
      ) ||
      entityInScope(lists.district, scope.regionIds, "region_id", yuva.district) ||
      entityInScope(lists.city, scope.regionIds, "region_id", yuva.city) ||
      entityInScope(lists.samaj, scope.regionIds, "region_id", yuva.localSamaj)
    );
  }
  if (role === "STATE_MANAGER") {
    return (
      scopeHasId(
        scope.stateIds,
        yuva.state,
        yuvaSamaj?.state_id,
        yuvaCity?.state_id
      ) ||
      entityInScope(lists.region, scope.stateIds, "state_id", yuva.region) ||
      entityInScope(lists.district, scope.stateIds, "state_id", yuva.district) ||
      entityInScope(lists.city, scope.stateIds, "state_id", yuva.city) ||
      entityInScope(lists.samaj, scope.stateIds, "state_id", yuva.localSamaj)
    );
  }
  if (role === "COUNTRY_MANAGER") {
    return (
      scopeHasId(
        scope.countryIds,
        yuva.country,
        yuvaSamaj?.country_id,
        yuvaCity?.country_id
      ) ||
      entityInScope(lists.region, scope.countryIds, "country_id", yuva.region) ||
      entityInScope(lists.state, scope.countryIds, "country_id", yuva.state) ||
      entityInScope(lists.district, scope.countryIds, "country_id", yuva.district) ||
      entityInScope(lists.city, scope.countryIds, "country_id", yuva.city) ||
      entityInScope(lists.samaj, scope.countryIds, "country_id", yuva.localSamaj)
    );
  }
  return false;
};
