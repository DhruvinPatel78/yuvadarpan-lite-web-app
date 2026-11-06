import { getCountryInfo } from "../../../util/countryApi";
import {
  getStateInfo,
  getStatesByCountry,
  addState,
  updateState,
  deleteState,
} from "../../../util/stateApi";
import {
  getRegionInfo,
  getRegionsByState,
  addRegion,
  updateRegion,
  deleteRegion,
} from "../../../util/regionApi";
import {
  getVibhagInfo,
  getVibhagsByRegion,
  addVibhag,
  updateVibhag,
  deleteVibhag,
} from "../../../util/vibhagApi";
import {
  getDistrictInfo,
  getDistrictsByRegion,
  addDistrict,
  updateDistrict,
  deleteDistrict,
} from "../../../util/districtApi";
import {
  getCityInfo,
  getCitiesByDistrict,
  addCity,
  updateCity,
  deleteCity,
} from "../../../util/cityApi";
import {
  getSamajByCity,
  addSamaj,
  updateSamaj,
  deleteSamaj,
} from "../../../util/samajApi";
import LocationDetails from "./index";

export const locationDetailsConfig = {
  country: {
    entityLabel: "Country",
    listPath: "/admin/country",
    listTitle: "State List",
    fetchParent: getCountryInfo,
    fetchChildren: getStatesByCountry,
    countField: "regionCount",
    countHeader: "Regions",
    childViewPath: (id) => `/admin/state/${id}`,
    childLabel: "State",
    addButtonLabel: "Add State",
    addChild: addState,
    getChildPayload: (parent, parentId) => ({
      country_id: parentId,
    }),
    updateChild: updateState,
    deleteChild: deleteState,
    deleteEntity: "state",
  },
  state: {
    entityLabel: "State",
    listPath: "/admin/state",
    listTitle: "Region List",
    fetchParent: getStateInfo,
    fetchChildren: getRegionsByState,
    countField: "vibhagCount",
    countHeader: "Vibhags",
    childViewPath: (id) => `/admin/region/${id}`,
    childLabel: "Region",
    addButtonLabel: "Add Region",
    addChild: addRegion,
    getChildPayload: (parent, parentId) => ({
      country_id: parent?.country_id,
      state_id: parentId,
    }),
    updateChild: updateRegion,
    deleteChild: deleteRegion,
    deleteEntity: "region",
  },
  region: {
    entityLabel: "Region",
    listPath: "/admin/region",
    listTitle: "Vibhag List",
    fetchParent: getRegionInfo,
    fetchChildren: getVibhagsByRegion,
    countField: "districtCount",
    countHeader: "Districts",
    childViewPath: (id) => `/admin/vibhag/${id}`,
    childLabel: "Vibhag",
    addButtonLabel: "Add Vibhag",
    addChild: addVibhag,
    getChildPayload: (parent, parentId) => ({
      country_id: parent?.country_id,
      state_id: parent?.state_id,
      region_id: parentId,
    }),
    updateChild: updateVibhag,
    deleteChild: deleteVibhag,
    deleteEntity: "vibhag",
  },
  vibhag: {
    entityLabel: "Vibhag",
    listPath: "/admin/vibhag",
    listTitle: "District List",
    fetchParent: getVibhagInfo,
    fetchChildren: getDistrictsByRegion,
    countField: "cityCount",
    countHeader: "Cities",
    childViewPath: (id) => `/admin/district/${id}`,
    childLabel: "District",
    addButtonLabel: "Add District",
    addChild: addDistrict,
    getChildPayload: (parent, parentId) => ({
      country_id: parent?.country_id,
      state_id: parent?.state_id,
      region_id: parent?.region_id,
      vibhag_id: parentId,
    }),
    updateChild: updateDistrict,
    deleteChild: deleteDistrict,
    deleteEntity: "district",
  },
  district: {
    entityLabel: "District",
    listPath: "/admin/district",
    listTitle: "City List",
    fetchParent: getDistrictInfo,
    fetchChildren: getCitiesByDistrict,
    countField: "samajCount",
    countHeader: "Samaj",
    childViewPath: (id) => `/admin/city/${id}`,
    childLabel: "City",
    addButtonLabel: "Add City",
    addChild: addCity,
    getChildPayload: (parent, parentId) => ({
      country_id: parent?.country_id,
      state_id: parent?.state_id,
      region_id: parent?.region_id,
      vibhag_id: parent?.vibhag_id,
      district_id: parentId,
    }),
    updateChild: updateCity,
    deleteChild: deleteCity,
    deleteEntity: "city",
  },
  city: {
    entityLabel: "City",
    listPath: "/admin/city",
    listTitle: "Samaj List",
    fetchParent: getCityInfo,
    fetchChildren: getSamajByCity,
    countField: null,
    countHeader: null,
    childViewPath: null,
    childLabel: "Samaj",
    addButtonLabel: "Add Samaj",
    hasSamajFields: true,
    addChild: addSamaj,
    getChildPayload: (parent, parentId) => ({
      country_id: parent?.country_id,
      state_id: parent?.state_id,
      region_id: parent?.region_id,
      vibhag_id: parent?.vibhag_id,
      district_id: parent?.district_id,
      city_id: parentId,
    }),
    updateChild: updateSamaj,
    deleteChild: deleteSamaj,
    deleteEntity: "samaj",
  },
};

export const CountryDetails = () => (
  <LocationDetails config={locationDetailsConfig.country} />
);
export const StateDetails = () => (
  <LocationDetails config={locationDetailsConfig.state} />
);
export const RegionDetails = () => (
  <LocationDetails config={locationDetailsConfig.region} />
);
export const VibhagDetails = () => (
  <LocationDetails config={locationDetailsConfig.vibhag} />
);
export const DistrictDetails = () => (
  <LocationDetails config={locationDetailsConfig.district} />
);
export const CityDetails = () => (
  <LocationDetails config={locationDetailsConfig.city} />
);
