import Header from "../../../../Component/Header";
import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomInput from "../../../../Component/Common/customInput";
import CustomAutoComplete from "../../../../Component/Common/customAutoComplete";
import CustomSelect from "../../../../Component/Common/customSelect";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ContainerPage from "../../../../Component/Container";
import { endLoading, startLoading } from "../../../../store/authSlice";
import { UseRedux } from "../../../../Component/useRedux";
import { addBulkYuva, updateYuva } from "../../../../util/yuvaAdminApi";
import axios from "../../../../util/useAxios";
import { Button as ActionButton, Card, FormModal, PageHeader } from "../../../../Component/UI";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../../Component/Common/notification";
import LoadableImage from "../../../../Component/Common/LoadableImage";
import YuvaDetailsCard from "./YuvaDetailsCard";
import {
  bulkAddValidationSchema,
  buildBulkPayload,
  buildYuvaPhotoName,
  createYuva,
  familyInitialValues,
  relationList,
  yuvaHasContent,
} from "./formConfig";

const FormSection = ({ title, description, children }) => (
  <Card className="w-full">
    <div className="flex items-start justify-between gap-3 mb-5 pb-3 border-b border-line">
      <div className="min-w-0">
        <h2 className="text-base font-WorkSemiBold text-primary leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-mutedText mt-0.5">{description}</p>
        ) : null}
      </div>
    </div>
    {children}
  </Card>
);

const GroupTitle = ({ children }) => (
  <Grid item xs={12}>
    <p className="text-sm font-WorkSemiBold text-primary pt-3 mt-1 border-t border-line">
      {children}
    </p>
  </Grid>
);

const BulkAddYuva = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, country, surname } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const photoInputRef = useRef(null);
  const [createdYuvas, setCreatedYuvas] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [lastNameList, setLastNameList] = useState([]);
  const [selectedLastName, setSelectedLastName] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [regionList, setRegionList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [districtList, setDistrictList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [samajList, setSamajList] = useState([]);
  const [selectedSamaj, setSelectedSamaj] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [nativeList, setNativeList] = useState([]);
  const [selectedNative, setSelectedNative] = useState(null);
  const [selectedMamaLastName, setSelectedMamaLastName] = useState(null);
  const [selectedMamaNative, setSelectedMamaNative] = useState(null);
  const [selectedContactLastName, setSelectedContactLastName] = useState(null);
  const [isLocation, setIsLocation] = useState({
    country: false,
    state: false,
    region: false,
    district: false,
    city: false,
  });

  const setLableValueInList = (data = []) => {
    const source = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
    return source.map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
  };

  const formatLabelValue = (res, field) => {
    const list = setLableValueInList(res.data);
    switch (field) {
      case "surname":
        setLastNameList(list);
        break;
      case "country":
        setCountryList(list);
        break;
      case "state":
        setStateList(list);
        break;
      case "region":
        setRegionList(list);
        break;
      case "district":
        setDistrictList(list);
        break;
      case "city":
        setCityList(list);
        break;
      case "native":
        setNativeList(list);
        break;
      default:
        return null;
    }
  };

  const getList = (field) => {
    axios
      .get(`/${field}/get-all-list`)
      .then((res) => formatLabelValue(res, field))
      .catch((error) => console.error(error));
  };

  const getListById = (field, id) => {
    axios
      .get(`/${field}/list/${id}`)
      .then((res) => formatLabelValue(res, field))
      .catch((error) => console.log(error));
  };

  const getSamajList = (cityId) => {
    if (!cityId) {
      setSamajList([]);
      return;
    }
    axios
      .get(`/samaj/list/${cityId}`)
      .then((res) => {
        setSamajList(setLableValueInList(res.data));
      })
      .catch((error) => {
        console.error(error);
        setSamajList([]);
      });
  };

  const formik = useFormik({
    initialValues: {
      ...familyInitialValues,
      yuvas: [createYuva()],
    },
    validationSchema: bulkAddValidationSchema,
    onSubmit: async (values) => {
      const payload = buildBulkPayload(values);
      if (!payload.length) {
        setNotification({
          type: "error",
          message: "Add at least one Yuva.",
        });
        return;
      }
      dispatch(startLoading());
      try {
        const result = await addBulkYuva({ yuvas: payload });
        const created = Array.isArray(result?.data) ? result.data : [];
        if (!created.length) {
          navigate("/admin/yuvalist");
          return;
        }
        setCreatedYuvas(created);
        setPhotoIndex(0);
      } catch (e) {
        if (e?.response?.status === 403) {
          navigate("/admin/yuvalist", { replace: true });
          return;
        }
        setNotification({
          type: "error",
          message:
            e?.response?.data?.message || "Could not save Yuva.",
        });
      } finally {
        dispatch(endLoading());
      }
    },
  });

  const {
    errors,
    values,
    setFieldValue,
    touched,
    handleChange,
    handleBlur,
    setFieldTouched,
    submitCount,
    isSubmitting,
  } = formik;

  const showErr = (isTouched, error) =>
    (isTouched || submitCount > 0) && error ? error : "";

  const resetLocationBelow = (level) => {
    const reset = {
      country: {
        state: true,
        region: true,
        district: true,
        city: true,
        samaj: true,
      },
      state: { region: true, district: true, city: true, samaj: true },
      region: { district: true, city: true, samaj: true },
      district: { city: true, samaj: true },
    }[level];
    if (reset?.state) {
      setSelectedState(null);
      setStateList([]);
      setFieldValue("state", "");
    }
    if (reset?.region) {
      setSelectedRegion(null);
      setRegionList([]);
      setFieldValue("region", "");
    }
    if (reset?.district) {
      setSelectedDistrict(null);
      setDistrictList([]);
      setFieldValue("district", "");
    }
    if (reset?.city) {
      setSelectedCity(null);
      setCityList([]);
      setFieldValue("city", "");
    }
    if (reset?.samaj) {
      setSelectedSamaj(null);
      setSamajList([]);
      setFieldValue("localSamaj", "");
    }
  };

  useEffect(() => {
    getList("native");
    getList("surname");
    getList("country");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (surname?.length) {
      setLastNameList(setLableValueInList(surname));
    }
  }, [surname]);

  useEffect(() => {
    if (country?.length) {
      setCountryList(setLableValueInList(country));
    }
  }, [country]);

  useEffect(() => {
    if (submitCount > 0 && Object.keys(errors).length) {
      const firstError = document.querySelector(".text-error");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitCount, errors]);

  const goToYuvaList = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setCreatedYuvas([]);
    setPhotoIndex(0);
    setSelectedPhoto(null);
    setPhotoPreview("");
    navigate("/admin/yuvalist");
  };

  const resetPhotoPick = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setSelectedPhoto(null);
    setPhotoPreview("");
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const goToNextPhoto = () => {
    if (photoIndex >= createdYuvas.length - 1) {
      goToYuvaList();
      return;
    }
    resetPhotoPick();
    setPhotoIndex((index) => index + 1);
  };

  const handleCreatedPhotoSelect = (file) => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadCreatedYuvaPhoto = async () => {
    const createdYuva = createdYuvas[photoIndex];
    if (!selectedPhoto || !createdYuva) {
      return;
    }
    dispatch(startLoading());
    try {
      const formData = new FormData();
      formData.append("image", selectedPhoto);
      formData.append("filename", buildYuvaPhotoName(createdYuva));
      const res = await axios.post(`/image/upload`, formData, {
        contentType: "multipart/form-data",
      });
      await updateYuva(createdYuva.id, {
        ...createdYuva,
        profile: res?.data?.data,
      });
      goToNextPhoto();
    } catch (e) {
      setNotification({
        type: "error",
        message: e?.response?.data?.message || "Could not upload image.",
      });
    } finally {
      dispatch(endLoading());
    }
  };

  const scrollToYuvaCard = (index) => {
    window.setTimeout(() => {
      document.getElementById(`yuva-card-${index}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };
  const goToSingleAdd = () => navigate("/admin/yuvalist/add");
  const filledCount = (values.yuvas || []).filter(yuvaHasContent).length;
  const yuvaArrayError =
    typeof errors?.yuvas === "string" ? errors.yuvas : "";
  const currentYuva = createdYuvas[photoIndex] || {};
  const currentLastName =
    lastNameList.find(
      (item) => String(item.id) === String(currentYuva.lastName)
    )?.name || selectedLastName || "";
  const currentYuvaName = [currentYuva.firstName, currentLastName]
    .filter(Boolean)
    .join(" ")
    .trim() || "This Yuva";
  const isLastPhoto = photoIndex >= createdYuvas.length - 1;

  const renderActionButtons = () => (
    <div className="flex flex-col-reverse md:flex-row md:items-center gap-2 w-full md:w-auto">
      <ActionButton
        type="button"
        variant="secondary"
        className="max-md:w-full"
        onClick={goToSingleAdd}
      >
        Single Add
      </ActionButton>
      <ActionButton
        type="submit"
        className="max-md:w-full"
        icon={<CheckIcon sx={{ fontSize: 18 }} />}
        disabled={isSubmitting}
        loading={loading}
      >
        Save Yuva
      </ActionButton>
    </div>
  );

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className="flex-col justify-center flex items-start pb-6">
        <FormikProvider value={formik}>
          <Form className="w-full" noValidate>
            <PageHeader
              className="w-full"
              title="Bulk Add Yuva"
              description="Family information is shared across all Yuva. Empty Yuva forms are ignored."
              actions={renderActionButtons()}
            />
            <div className="w-full flex flex-col gap-4 md:gap-5">
              <FormSection
                title="Family information"
                description="These details apply to every Yuva you add below."
              >
                <Grid container spacing={2}>
                  <CustomInput
                    type="text"
                    label="Father Name"
                    placeholder="Enter Your Father Name"
                    name="fatherName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.fatherName}
                    errors={showErr(touched?.fatherName, errors?.fatherName)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Grand Father Name"
                    placeholder="Enter Your Grand Father Name"
                    name="grandFatherName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.grandFatherName}
                    errors={showErr(
                      touched?.grandFatherName,
                      errors?.grandFatherName
                    )}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label="Last Name"
                    placeholder="Select Your Last Name"
                    name="lastName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedLastName}
                    errors={showErr(touched.lastName, errors.lastName)}
                    onChange={(e, lastName) => {
                      setFieldValue(
                        "lastName",
                        lastName?.id || lastName?.value || lastName?._id || ""
                      );
                      setSelectedLastName(lastName || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Mother Name"
                    placeholder="Enter Your Mother Name"
                    name="motherName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.motherName}
                    errors={showErr(touched?.motherName, errors?.motherName)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Family ID"
                    placeholder="Enter Your Family ID"
                    name="familyId"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.familyId}
                    errors={showErr(touched?.familyId, errors?.familyId)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={nativeList}
                    label="Native"
                    placeholder="Select Your Native"
                    name="native"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedNative}
                    errors={showErr(touched.native, errors.native)}
                    onChange={(e, native) => {
                      setFieldValue("native", native?.id || "");
                      setSelectedNative(native?.name || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Firm"
                    placeholder="Enter Your Firm"
                    name="firm"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.firm}
                    errors={showErr(touched?.firm, errors?.firm)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <GroupTitle>Location</GroupTitle>
                  <CustomAutoComplete
                    list={countryList}
                    label="Country"
                    placeholder="Select Your Country"
                    name="country"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedCountry}
                    errors={showErr(touched?.country, errors?.country)}
                    onChange={(e, countryItem) => {
                      if (!countryItem) return;
                      setFieldValue("country", countryItem.id);
                      setSelectedCountry(countryItem.name);
                      resetLocationBelow("country");
                      setIsLocation({
                        country: true,
                        state: false,
                        region: false,
                        district: false,
                        city: false,
                      });
                      getListById("state", countryItem.id);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={stateList}
                    label="State"
                    placeholder="Select Your State"
                    name="state"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedState}
                    errors={showErr(touched?.state, errors?.state)}
                    onChange={(e, stateItem) => {
                      if (!stateItem) return;
                      setFieldValue("state", stateItem.id);
                      setSelectedState(stateItem.name);
                      resetLocationBelow("state");
                      setIsLocation((pre) => ({
                        ...pre,
                        state: true,
                        region: false,
                        district: false,
                        city: false,
                      }));
                      getListById("region", stateItem.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.country}
                  />
                  <CustomAutoComplete
                    list={regionList}
                    label="Region"
                    placeholder="Select Your Region"
                    name="region"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedRegion}
                    errors={showErr(touched?.region, errors?.region)}
                    onChange={(e, regionItem) => {
                      if (!regionItem) return;
                      setFieldValue("region", regionItem.id);
                      setSelectedRegion(regionItem.name);
                      resetLocationBelow("region");
                      setIsLocation((pre) => ({
                        ...pre,
                        region: true,
                        district: false,
                        city: false,
                      }));
                      getListById("district", regionItem.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.state}
                  />
                  <CustomAutoComplete
                    list={districtList}
                    label="District"
                    placeholder="Select Your District"
                    name="district"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedDistrict}
                    errors={showErr(touched?.district, errors?.district)}
                    onChange={(e, districtItem) => {
                      if (!districtItem) return;
                      setFieldValue("district", districtItem.id);
                      setSelectedDistrict(districtItem.name);
                      resetLocationBelow("district");
                      setIsLocation((pre) => ({
                        ...pre,
                        district: true,
                        city: false,
                      }));
                      getListById("city", districtItem.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.region}
                  />
                  <CustomAutoComplete
                    list={cityList}
                    label="City"
                    placeholder="Select Your City"
                    name="city"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedCity}
                    errors={showErr(touched?.city, errors?.city)}
                    onChange={(e, cityItem) => {
                      if (!cityItem) return;
                      setFieldValue("city", cityItem.id);
                      setSelectedCity(cityItem.name);
                      setIsLocation((pre) => ({ ...pre, city: true }));
                      setFieldValue("localSamaj", "");
                      setSelectedSamaj(null);
                      getSamajList(cityItem.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.district}
                  />
                  <CustomAutoComplete
                    list={samajList}
                    label="Local Samaj"
                    placeholder="Select Your Samaj"
                    name="localSamaj"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedSamaj}
                    errors={showErr(touched?.localSamaj, errors?.localSamaj)}
                    disabled={!isLocation.city}
                    onChange={(e, localSamaj) => {
                      if (!localSamaj) return;
                      setFieldValue("localSamaj", localSamaj.id);
                      setSelectedSamaj(localSamaj.name);
                    }}
                    onBlur={handleBlur}
                  />
                  <GroupTitle>Address</GroupTitle>
                  <CustomInput
                    type="text"
                    label="Address"
                    placeholder="Enter Your Address"
                    name="address"
                    multiline
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.address}
                    errors={showErr(touched?.address, errors?.address)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Firm Address"
                    placeholder="Enter Your Firm Address"
                    name="firmAddress"
                    multiline
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.firmAddress}
                    errors={showErr(touched?.firmAddress, errors?.firmAddress)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <GroupTitle>Mama info</GroupTitle>
                  <CustomInput
                    type="text"
                    label="Mama Name"
                    placeholder="Enter Your Name"
                    name="mamaInfo.name"
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.mamaInfo?.name}
                    required={false}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        name: e.target.value,
                      })
                    }
                    onBlur={handleBlur}
                    errors={showErr(
                      touched?.mamaInfo?.name,
                      errors?.mamaInfo?.name
                    )}
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label="Mama Last Name"
                    placeholder="Select Your Last Name"
                    name="mamaInfo.lastName"
                    xs={12}
                    sm={6}
                    md={6}
                    value={selectedMamaLastName}
                    errors={showErr(
                      touched?.mamaInfo?.lastName,
                      errors?.mamaInfo?.lastName
                    )}
                    onChange={(e, lastName) => {
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        lastName:
                          lastName?.id || lastName?.value || lastName?._id || "",
                      });
                      setSelectedMamaLastName(lastName || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={nativeList}
                    label="Mama Native"
                    placeholder="Select Your Native"
                    name="mamaInfo.native"
                    xs={12}
                    sm={6}
                    md={6}
                    value={selectedMamaNative}
                    errors={showErr(
                      touched?.mamaInfo?.native,
                      errors?.mamaInfo?.native
                    )}
                    onChange={(e, native) => {
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        native: native?.id || "",
                      });
                      setSelectedMamaNative(native?.name || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Mama City"
                    placeholder="Enter Your City"
                    name="mamaInfo.city"
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.mamaInfo?.city}
                    required={false}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        city: e.target.value,
                      })
                    }
                    onBlur={handleBlur}
                    errors={showErr(
                      touched?.mamaInfo?.city,
                      errors?.mamaInfo?.city
                    )}
                  />
                  <GroupTitle>Contact info</GroupTitle>
                  <CustomInput
                    type="text"
                    label="Contact Person Name"
                    placeholder="Enter Your Contact Person Name"
                    name="contactInfo.name"
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.contactInfo?.name}
                    errors={showErr(
                      touched?.contactInfo?.name,
                      errors?.contactInfo?.name
                    )}
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setFieldValue("contactInfo.name", e.target.value)
                    }
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label="Contact Person Last Name"
                    placeholder="Select Your Last Name"
                    name="contactInfo.lastName"
                    xs={12}
                    sm={6}
                    md={6}
                    value={
                      lastNameList.find(
                        (item) =>
                          String(item.id) ===
                            String(values?.contactInfo?.lastName) ||
                          String(item.value) ===
                            String(values?.contactInfo?.lastName)
                      ) || selectedContactLastName
                    }
                    errors={showErr(
                      touched?.contactInfo?.lastName,
                      errors?.contactInfo?.lastName
                    )}
                    onChange={(e, lastName) => {
                      setFieldValue(
                        "contactInfo.lastName",
                        lastName?.id || lastName?.value || lastName?._id || ""
                      );
                      setSelectedContactLastName(lastName || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type="text"
                    label="Contact Person Phone"
                    placeholder="Enter Your Contact Person Phone"
                    name="contactInfo.phone"
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.contactInfo?.phone}
                    errors={showErr(
                      touched?.contactInfo?.phone,
                      errors?.contactInfo?.phone
                    )}
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setFieldValue("contactInfo.phone", e?.target?.value)
                    }
                  />
                  <CustomSelect
                    list={relationList}
                    label="Relation"
                    placeholder="Enter Your Relation"
                    name="contactInfo.relation"
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.contactInfo?.relation}
                    errors={showErr(
                      touched?.contactInfo?.relation,
                      errors?.contactInfo?.relation
                    )}
                    onBlur={() =>
                      setFieldTouched("contactInfo.relation", true, false)
                    }
                    onChange={(e) =>
                      setFieldValue(
                        "contactInfo.relation",
                        e?.target?.value || ""
                      )
                    }
                  />
                </Grid>
              </FormSection>

              <FieldArray name="yuvas">
                {({ push, remove }) => (
                  <>
                    {(values.yuvas || []).map((yuva, index) => (
                      <YuvaDetailsCard
                        key={yuva.key || index}
                        index={index}
                        yuva={yuva}
                        errors={errors?.yuvas}
                        touched={touched?.yuvas}
                        submitCount={submitCount}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        canRemove={(values.yuvas || []).length > 1}
                        onRemove={() => remove(index)}
                      />
                    ))}
                    {yuvaArrayError ? (
                      <p className="text-error text-sm">{yuvaArrayError}</p>
                    ) : null}
                    <div className="w-full rounded-xl border border-dashed border-primary/30 bg-[#faf7f4] p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-WorkSemiBold text-primary">
                          Add more people
                        </p>
                        <p className="text-sm text-mutedText mt-0.5">
                          Create one blank form or add five at once.
                        </p>
                      </div>
                      <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                        <ActionButton
                          type="button"
                          variant="ghost"
                          className="max-md:w-full"
                          onClick={() => {
                            const nextIndex = (values.yuvas || []).length;
                            for (let i = 0; i < 5; i += 1) {
                              push(createYuva());
                            }
                            scrollToYuvaCard(nextIndex);
                          }}
                        >
                          Add 5 Yuva
                        </ActionButton>
                        <ActionButton
                          type="button"
                          variant="secondary"
                          className="max-md:w-full"
                          icon={<AddIcon sx={{ fontSize: 18 }} />}
                          onClick={() => {
                            const nextIndex = (values.yuvas || []).length;
                            push(createYuva());
                            scrollToYuvaCard(nextIndex);
                          }}
                        >
                          Add Another Yuva
                        </ActionButton>
                      </div>
                    </div>
                  </>
                )}
              </FieldArray>

              <div className="w-full bg-white rounded-xl border border-line shadow-card p-4 sm:px-6 sticky bottom-3 z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-sm text-mutedText">
                  {filledCount} filled · {values.yuvas?.length || 0} total forms
                </p>
                {renderActionButtons()}
              </div>
            </div>
          </Form>
        </FormikProvider>
      </ContainerPage>
      <FormModal
        open={createdYuvas.length > 0}
        onClose={goToYuvaList}
        title="Upload profile photo"
        maxWidth="520px"
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-mutedText">
            Photo for
          </p>
          <h3 className="text-xl font-WorkSemiBold text-primary mt-1 break-words">
            {currentYuvaName}
          </h3>
          {currentYuva.fatherName ? (
            <p className="text-sm text-mutedText mt-1">
              Father: {currentYuva.fatherName}
            </p>
          ) : null}
          {createdYuvas.length > 1 ? (
            <p className="inline-flex mt-3 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              Yuva {photoIndex + 1} of {createdYuvas.length}
            </p>
          ) : null}
        </div>

        <label
          htmlFor="created-yuva-upload"
          className="relative w-fit mx-auto mt-5 block cursor-pointer group"
        >
          {loading ? (
            <div className="w-[160px] h-[160px] rounded-full border border-line flex items-center justify-center">
              <CircularProgress className="text-primary" />
            </div>
          ) : (
            <>
              <LoadableImage
                src={photoPreview}
                alt={currentYuvaName}
                className="w-[160px] h-[160px] rounded-full border border-primary group-hover:border-primary"
                eager
                spinnerSize={32}
              />
              <span className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-card">
                <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
              </span>
            </>
          )}
        </label>
        <input
          ref={photoInputRef}
          type="file"
          id="created-yuva-upload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleCreatedPhotoSelect(file);
            }
          }}
        />
        <p className="text-sm text-center text-mutedText mt-3">
          Click the photo to choose an image for {currentYuvaName}.
        </p>
        <p className="text-xs text-center break-all text-primary/80 mt-1">
          {buildYuvaPhotoName(currentYuva)}
        </p>
        {createdYuvas.length > 1 ? (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {createdYuvas.map((yuva, index) => (
              <span
                key={yuva.id || index}
                className={`h-1.5 rounded-full ${
                  index === photoIndex
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-primary/20"
                }`}
              />
            ))}
          </div>
        ) : null}
        <div className="flex flex-col-reverse md:flex-row gap-3 mt-5">
          <ActionButton variant="secondary" fullWidth onClick={goToNextPhoto}>
            {isLastPhoto ? "Skip for now" : "Skip this Yuva"}
          </ActionButton>
          <ActionButton
            fullWidth
            onClick={uploadCreatedYuvaPhoto}
            disabled={!selectedPhoto || loading}
            loading={loading}
          >
            Upload Photo
          </ActionButton>
        </div>
      </FormModal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
};

export default BulkAddYuva;
