import Header from "../../../../Component/Header";
import {
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomInput from "../../../../Component/Common/customInput";
import CustomAutoComplete from "../../../../Component/Common/customAutoComplete";
import CustomRadio from "../../../../Component/Common/customRadio";
import { Form, FormikProvider, useFormik } from "formik";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button as ActionButton, Card, FormModal, IconBtn, PageHeader } from "../../../../Component/UI";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import * as Yup from "yup";
import axios from "../../../../util/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import CustomSelect from "../../../../Component/Common/customSelect";
import DatePicker from "../../../../Component/Common/DatePicker";
import CustomCheckbox from "../../../../Component/Common/customCheckbox";
import { useDispatch } from "react-redux";
import ContainerPage from "../../../../Component/Container";
import { endLoading, startLoading } from "../../../../store/authSlice";
import { UseRedux } from "../../../../Component/useRedux";
import { addYuva, updateYuva } from "../../../../util/yuvaAdminApi";
import {
  canEditYuvaRecord,
  isAdmin,
  isLocationMasterReadOnly,
  isSamajManager,
} from "../../../../util/util";
import dayjs from "dayjs";

const slugPart = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9]/g, "") || "na";

const buildYuvaPhotoName = (yuva) =>
  `yuva_${slugPart(yuva?.firstName)}_${slugPart(yuva?.fatherName)}_${slugPart(
    yuva?.grandFatherName
  )}_${slugPart(yuva?.familyId)}_${
    yuva?.dob && dayjs(yuva.dob).isValid()
      ? dayjs(yuva.dob).format("DDMMYYYY")
      : "na"
  }`;

const otherObjectToFields = (other) => {
  if (!other || typeof other !== "object" || Array.isArray(other)) {
    return [];
  }
  return Object.entries(other)
    .filter(([, value]) => String(value ?? "").trim() !== "")
    .map(([title, description]) => ({
      title: String(title).replace(/_/g, " "),
      description: String(description ?? ""),
    }));
};

const FormSection = ({ title, children, action = null }) => (
  <Card className="w-full">
    <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-line">
      <h2 className="text-base font-WorkSemiBold text-primary leading-tight">
        {title}
      </h2>
      {action}
    </div>
    {children}
  </Card>
);

const fieldsToOtherObject = (list = [], draft) => {
  const rows = [...list];
  const draftTitle = String(draft?.title || "").trim();
  const draftDescription = String(draft?.description || "").trim();
  if (draftTitle && draftDescription) {
    rows.push({ title: draftTitle, description: draftDescription });
  }
  return rows.reduce((acc, item) => {
    const title = String(item?.title || "").trim();
    const description = String(item?.description || "").trim();
    if (title && description) {
      acc[title.replace(/\s+/g, "_")] = description;
    }
    return acc;
  }, {});
};

const AddYuva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, country, state, region, district, city, samaj, surname, auth } =
    UseRedux();
  const selectArr = [
    "surname",
    "native",
    "country",
    "state",
    "region",
    "district",
    "city",
    "samaj",
  ];
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [createdYuva, setCreatedYuva] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [newFieldList, setNewFieldList] = useState([]);
  const [lastNameList, setLastNameList] = useState(surname);
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
  const [newField, setNewField] = useState({
    title: "",
    description: "",
  });
  const [isLocation, setIsLocation] = useState({
    country: false,
    state: false,
    region: false,
    district: false,
    city: false,
  });
  // const [activityIsStudy, setActivityIsStudy] = useState(false);
  const [isEdit, setIsEdit] = useState(Boolean(location?.state));
  const editYuva = location?.state?.data || null;

  const getSamajList = (regionId) => {
    axios.get(`/samaj/listByRegion/${regionId}`).then((res) => {
      setSamajList(res.data);
    });
  };

  const addLabelValueInList = (field) => {
    switch (field) {
      case "surname":
        setLastNameList(setLableValueInList(surname));
        break;
      case "country":
        setCountryList(setLableValueInList(country));
        break;
      default:
        return null;
    }
  };

  const setLableValueInList = (data) => {
    const list = data.map((data) => ({
      ...data,
      label: data.name,
      value: data.id,
    }));
    return list;
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
      .then((res) => {
        formatLabelValue(res, field);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getListById = (field, id) => {
    axios
      .get(`/${field}/list/${id}`)
      .then((res) => {
        formatLabelValue(res, field);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const selectedValueSetName = (field) => {
    switch (field) {
      case "surname":
        surname.forEach((data) => {
          if (location?.state?.data?.lastName === data.id) {
            // setFieldValue("lastName", data.name);
            setSelectedLastName(data.name);
          }
        });
        break;
      case "native":
        axios
          .get(`/${field}/getInfo/${location?.state?.data?.native}`)
          .then((res) => {
            // setFieldValue("native", res.data[0].name);
            setSelectedNative(res.data[0].name);
          })
          .catch(function (error) {
            console.log(error);
          });
        break;

      case "country":
        country.forEach((data) => {
          if (location?.state?.data?.country === data.id) {
            // setFieldValue("country", data.name);
            setSelectedCountry(data.name);
            setIsLocation((pre) => ({ ...pre, country: true }));
          }
        });
        break;
      case "state":
        state.forEach((data) => {
          if (location?.state?.data?.state === data.id) {
            // setFieldValue("state", data.name);
            setSelectedState(data.name);
            setIsLocation((pre) => ({ ...pre, state: true }));
            getListById("state", location?.state?.data?.country);
          }
        });
        break;
      case "region":
        region.forEach((data) => {
          if (location?.state?.data?.region === data.id) {
            // setFieldValue("region", data.name);
            setSelectedRegion(data.name);
            setIsLocation((pre) => ({ ...pre, region: true }));
            getListById("region", location?.state?.data?.state);
          }
        });
        break;
      case "district":
        district.forEach((data) => {
          if (location?.state?.data?.district === data.id) {
            // setFieldValue("district", data.name);
            setSelectedDistrict(data.name);
            setIsLocation((pre) => ({ ...pre, district: true }));
            getListById("district", location?.state?.data?.region);
          }
        });
        break;
      case "city":
        city.forEach((data) => {
          if (location?.state?.data?.city === data.id) {
            // setFieldValue("city", data.name);
            setSelectedCity(data.name);
            setIsLocation((pre) => ({ ...pre, city: true }));
            getListById("city", location?.state?.data?.district);
          }
        });
        break;
      case "samaj":
        samaj.forEach((data) => {
          if (location?.state?.data?.localSamaj === data.id) {
            // setFieldValue("localSamaj", data.name);
            setSelectedSamaj(data.name);
            getSamajList(location?.state?.data?.region);
          }
        });
        break;
      default:
        return null;
    }
  };

  const goToYuvaList = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setShowProfileModal(false);
    setCreatedYuva(null);
    setSelectedPhoto(null);
    setPhotoPreview("");
    setNewFieldList([]);
    navigate("/admin/yuvalist");
  };

  const addYuvaListHandler = async (data) => {
    dispatch(startLoading());
    try {
      const { profile, profileName, ...payload } = data;
      const created = await addYuva(payload);
      setCreatedYuva(created);
      setShowProfileModal(true);
    } catch (e) {
      // Optionally handle error with notification
    } finally {
      dispatch(endLoading());
    }
  };
  const updateAPIHandler = async (data) => {
    dispatch(startLoading());
    try {
      await updateYuva(data?.id, { ...data, updatedAt: new Date() });
      navigate("/admin/yuvalist");
    } catch (e) {
      if (e?.response?.status === 403) {
        navigate("/admin/yuvalist", { replace: true });
      }
    } finally {
      dispatch(endLoading());
      setNewFieldList([]);
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      fatherName: "",
      grandFatherName: "",
      lastName: "",
      motherName: "",
      familyId: "",
      dob: null,
      gender: "male",
      pob: "",
      email: "",
      firm: "",
      country: "",
      firmAddress: "",
      address: "",
      state: "",
      region: "",
      district: "",
      city: "",
      native: "",
      education: "",
      bloodGroup: "",
      height: "",
      weight: "",
      contactInfo: {
        name: "",
        phone: "",
        relation: "",
      },
      mamaInfo: {
        name: "",
        city: "",
        native: "",
      },
      profile: {
        name: "",
        url: "",
        awsId: "",
      },
      profileName: "",
      activity: "",
      abroadStudy: "no",
      martialStatus: "",
      other: null,
      handicap: false,
      handicapDetails: "",
      YSKno: "",
      localSamaj: "",
    },
    onSubmit: async (values) => {
      const newValue = {
        ...values,
        other: fieldsToOtherObject(newFieldList, newField),
      };
      if (location?.state) {
        updateAPIHandler(newValue);
      } else {
        addYuvaListHandler(newValue);
      }
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name Is Required"),
      motherName: Yup.string().required("Mother Name Is Required"),
      fatherName: Yup.string().required("Father Name Is Required"),
      grandFatherName: Yup.string().required("Grand Father Name Is Required"),
      gender: Yup.string().required("Gender Is Required"),
      pob: Yup.string().required("Birth Place Is Required"),
      ...(location?.state
        ? { profileName: Yup.string().required("Profile Photo Is Required") }
        : {}),
      dob: Yup.date().required("Date Of Birth Is Required"),
      height: Yup.string().required("Height Is Required"),
      weight: Yup.string().required("Weight Is Required"),
      firm: Yup.string().required("Firm Is Required"),
      firmAddress: Yup.string().required("Firm Address Is Required"),
      address: Yup.string().required("Address Is Required"),
      state: Yup.string().required("State Is Required"),
      region: Yup.string().required("Region Is Required"),
      district: Yup.string().required("District Is Required"),
      city: Yup.string().required("City Is Required"),
      native: Yup.string().required("Native Is Required"),
      education: Yup.string().required("Education Is Required"),
      contactInfo: Yup.object({
        name: Yup.string().required("Contact Name Is Required"),
        relation: Yup.string().required("Contact Relation Is Required"),
        phone: Yup.string()
          .matches(
            "^(\\+\\d{1,3}[- ]?)?\\d{10}$",
            "Phone Number must be correct"
          )
          .required("Contact Phone Number Is Required"),
      }),
      mamaInfo: Yup.object({
        name: Yup.string().required("Mama Name Is Required"),
        native: Yup.string().required("Mama Native Is Required"),
        city: Yup.string().required("Mama City Is Required"),
      }),
      lastName: Yup.string().required("Last Name Is Required"),
      bloodGroup: Yup.string().required("Blood Group Is Required"),
      country: Yup.string().required("Country Is Required"),
      familyId: Yup.number()
        .typeError("Must be a Number")
        .positive()
        .required("Family ID IsRequired"),
      activity: Yup.string().required("Activity Is Required"),
      abroadStudy: Yup.string().required("AbroadStudy Required"),
      email: Yup.string()
        .matches(
          "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          "Invalid email address format"
        )
        .required("Email Is Required"),
      martialStatus: Yup.string().required("Martial Status Is Required"),
      // handicap: Yup.string().required("Required"),
      // handicapDetails: Yup.string().required("Required"),
      YSKno: Yup.string().required("YSKno Is Required"),
      localSamaj: Yup.string().required("Local Samaj Required"),
    }),
  });
  const {
    isSubmitting,
    errors,
    values,
    setValues,
    setFieldValue,
    touched,
    handleChange,
    handleBlur,
    setFieldTouched,
  } = formik;

  const imageUploadHandler = (file) => {
    dispatch(startLoading());
    const formData = new FormData();
    formData.append("image", file);
    formData.append("filename", buildYuvaPhotoName(values));
    axios
      .post(`/image/upload`, formData, {
        contentType: "multipart/form-data",
      })
      .then((res) => {
        setFieldValue("profile", res?.data?.data);
        setFieldValue("profileName", res?.data?.data?.name);
      })
      .catch((e) => console.log("error API  = = = = >", e))
      .finally(() => {
        dispatch(endLoading());
      });
  };

  const handleCreatedPhotoSelect = (file) => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadCreatedYuvaPhoto = async () => {
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
      goToYuvaList();
    } catch (e) {
      // Optionally handle error with notification
    } finally {
      dispatch(endLoading());
    }
  };

  const addFieldHandler = () => {
    const title = String(newField?.title || "").trim();
    const description = String(newField?.description || "").trim();
    if (!title || !description) {
      return;
    }
    setNewFieldList((prevState) => [...prevState, { title, description }]);
    setNewField({ title: "", description: "" });
  };
  const removeFieldHandler = (index) => {
    const filterList = newFieldList.filter((item, i) => i !== index);
    setNewFieldList(filterList);
  };
  const newFieldValueHandler = (e, index, label) => {
    const value = e.target.value;
    const clone = [...newFieldList];
    const findIndex = newFieldList.findIndex((item, i) => i === index);
    if (findIndex !== -1) {
      clone[findIndex][label] = value;
    }
    setNewFieldList(clone);
  };

  useEffect(() => {
    if (location?.state) {
      setIsEdit(true);
      setValues({
        ...values,
        ...location?.state?.data,
        profileName: location?.state?.data?.profile?.name,
        other: location?.state?.data?.other || {},
      });
      setNewFieldList(otherObjectToFields(location?.state?.data?.other));
      setNewField({ title: "", description: "" });
      selectArr.forEach((data) => {
        selectedValueSetName(data);
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    getList("native");
    selectArr.forEach((data) => {
      addLabelValueInList(data);
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const role = auth?.user?.role;
    if (isAdmin(role)) return;
    if (!isLocationMasterReadOnly(role)) {
      navigate("/admin/yuvalist", { replace: true });
      return;
    }
    const listsReady =
      isSamajManager(role) || Boolean(samaj?.length || city?.length);
    if (!listsReady) return;
    if (
      !canEditYuvaRecord(auth?.user, editYuva, {
        samaj,
        city,
        district,
        region,
        state,
        country,
      })
    ) {
      navigate("/admin/yuvalist", { replace: true });
    }
  }, [
    isEdit,
    auth?.user,
    editYuva,
    samaj,
    city,
    district,
    region,
    state,
    country,
    navigate,
  ]);

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className={"flex-col justify-center flex items-start pb-6"}>
        <PageHeader
          className="w-full"
          title={isEdit ? "Edit Yuva" : "Add Yuva"}
          description={
            isEdit
              ? "Update this yuva record."
              : "Create a new yuva record."
          }
        />
        <FormikProvider value={formik}>
          <Form>
            <div className="w-full flex flex-col gap-4 md:gap-5">
              {isEdit ? (
              <Card className="w-full">
                <h2 className="text-base font-WorkSemiBold text-primary mb-5 pb-3 border-b border-line">
                  Photo
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
                  {loading ? (
                    <CircularProgress
                      className={
                        "w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full border border-primary cursor-pointer text-primary"
                      }
                    />
                  ) : (
                    <label htmlFor="upload-button" className="relative shrink-0 cursor-pointer group">
                      <img
                        src={
                          values?.profileName
                            ? values?.profile?.url
                            : `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541`
                        }
                        alt={
                          values?.profileName
                            ? values?.profile?.name
                            : `profile`
                        }
                        className={`w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full object-cover border ${
                          touched?.profileName && errors?.profileName
                            ? "border-red-600"
                            : "border-line"
                        } group-hover:border-primary`}
                      />
                      <span className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-card">
                        <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
                      </span>
                    </label>
                  )}
                  <div className="text-center sm:text-left min-w-0">
                    <p className="text-sm font-semibold text-primary">
                      Profile photo
                    </p>
                    <p className="text-sm text-mutedText mt-1">
                      Click the photo to upload a new image.
                    </p>
                    <label
                      htmlFor="upload-button"
                      className="inline-flex mt-3 text-sm font-semibold text-primary underline underline-offset-4 cursor-pointer"
                    >
                      Change photo
                    </label>
                  </div>
                  <input
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    name="profileName"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        imageUploadHandler(file);
                      }
                      setFieldTouched("profileName", true);
                    }}
                    onClick={() => setFieldTouched("profileName", true)}
                  />
                </div>
                {touched?.profileName && errors?.profileName && (
                  <p className={"text-error text-sm transition-all mt-3"}>
                    {errors?.profileName}
                  </p>
                )}
              </Card>
              ) : null}
              <FormSection title="Personal info">
                <Grid container spacing={2}>
                  <CustomInput
                    type={"text"}
                    label={"Name"}
                    placeholder={"Enter Your Name"}
                    name={"firstName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={
                      touched?.firstName &&
                      errors?.firstName &&
                      errors?.firstName
                    }
                  />
                  <CustomInput
                    type={"text"}
                    label={"Father Name"}
                    placeholder={"Enter Your Father Name"}
                    name={"fatherName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.fatherName}
                    errors={
                      touched?.fatherName &&
                      errors?.fatherName &&
                      errors?.fatherName
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Grand Father Name"}
                    placeholder={"Enter Your Grand Father Name"}
                    name={"grandFatherName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.grandFatherName}
                    errors={
                      touched?.grandFatherName &&
                      errors?.grandFatherName &&
                      errors?.grandFatherName
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label={"Last Name"}
                    placeholder={"Select Your Last Name"}
                    name="lastName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedLastName}
                    errors={
                      touched.lastName && errors.lastName && errors.lastName
                    }
                    onChange={(e, lastName) => {
                      setFieldValue("lastName", lastName.id);
                      setSelectedLastName(lastName.name);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Mother Name"}
                    placeholder={"Enter Your Mother Name"}
                    name={"motherName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.motherName}
                    errors={
                      touched?.motherName &&
                      errors?.motherName &&
                      errors?.motherName
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Family ID"}
                    placeholder={"Enter Your Family ID"}
                    name={"familyId"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.familyId}
                    errors={
                      touched?.familyId && errors?.familyId && errors?.familyId
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomRadio
                    list={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    label={"Gender"}
                    name={"gender"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.gender}
                    errors={touched?.gender && errors?.gender && errors?.gender}
                    className={"flex flex-row"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <DatePicker
                    name={"dob"}
                    xs={12}
                    sm={6}
                    md={4}
                    placeholder="Date and Time of Birth"
                    label={"Date of birth"}
                    value={values?.dob}
                    errors={touched?.dob && errors?.dob && errors?.dob}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("dob", e);
                    }}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Birth Place"}
                    placeholder={"Enter Your Birth Place"}
                    name={"pob"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.pob}
                    errors={touched?.pob && errors?.pob && errors?.pob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={nativeList}
                    label={"Native"}
                    placeholder={"Select Your Native"}
                    name="native"
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedNative}
                    errors={touched.native && errors.native && errors.native}
                    onChange={(e, native) => {
                      setFieldValue("native", native.id);
                      setSelectedNative(native.name);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Email"}
                    placeholder={"Enter Your Email"}
                    name={"email"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.email}
                    errors={touched?.email && errors?.email && errors?.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Firm"}
                    placeholder={"Enter Your Firm"}
                    name={"firm"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.firm}
                    errors={touched?.firm && errors?.firm && errors?.firm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={countryList}
                    label={"Country"}
                    placeholder={"Select Your Country"}
                    name={"country"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedCountry}
                    errors={
                      touched?.country && errors?.country && errors?.country
                    }
                    onSelect={handleChange}
                    onChange={(e, country) => {
                      setFieldValue("country", country.id);
                      setSelectedCountry(country.name);
                      setIsLocation((pre) => ({ ...pre, country: true }));
                      getListById("state", country.id);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={stateList}
                    label={"State"}
                    placeholder={"Select Your State"}
                    name={"state"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedState}
                    errors={touched?.state && errors?.state && errors?.state}
                    onChange={(e, state) => {
                      setFieldValue("state", state.id);
                      setSelectedState(state.name);
                      setIsLocation((pre) => ({ ...pre, state: true }));
                      getListById("region", state.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.country}
                  />
                  <CustomAutoComplete
                    list={regionList}
                    label={"Region"}
                    placeholder={"Select Your Region"}
                    name={"region"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedRegion}
                    errors={touched?.region && errors?.region && errors?.region}
                    onChange={(e, region) => {
                      setFieldValue("region", region.id);
                      setSelectedRegion(region.name);
                      setIsLocation((pre) => ({ ...pre, region: true }));
                      getListById("district", region.id);
                      getSamajList(region.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.state}
                  />
                  <CustomAutoComplete
                    list={districtList}
                    label={"District"}
                    placeholder={"Select Your District"}
                    name={"district"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedDistrict}
                    errors={
                      touched?.district && errors?.district && errors?.district
                    }
                    onChange={(e, district) => {
                      setFieldValue("district", district.id);
                      setSelectedDistrict(district.name);
                      setIsLocation((pre) => ({ ...pre, district: true }));
                      getListById("city", district.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.region}
                  />
                  <CustomAutoComplete
                    list={cityList}
                    label={"City"}
                    placeholder={"Select Your City"}
                    name={"city"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedCity}
                    errors={touched?.city && errors?.city && errors?.city}
                    onChange={(e, city) => {
                      setFieldValue("city", city.id);
                      setSelectedCity(city.name);
                      setIsLocation((pre) => ({ ...pre, city: true }));
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.district}
                  />
                  <CustomAutoComplete
                    list={samajList}
                    label={"Local Samaj"}
                    placeholder={"Select Your Samaj"}
                    name={"localSamaj"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={selectedSamaj}
                    errors={
                      touched?.localSamaj &&
                      errors?.localSamaj &&
                      errors?.localSamaj
                    }
                    disabled={!isLocation.city}
                    onChange={(e, localSamaj) => {
                      setFieldValue("localSamaj", localSamaj.id);
                      setSelectedSamaj(localSamaj.name);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Address"}
                    placeholder={"Enter Your Address"}
                    name={"address"}
                    multiline={true}
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.address}
                    errors={
                      touched?.address && errors?.address && errors?.address
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Firm Address"}
                    placeholder={"Enter Your Firm Address"}
                    name={"firmAddress"}
                    multiline={true}
                    xs={12}
                    sm={6}
                    md={6}
                    value={values?.firmAddress}
                    errors={
                      touched?.firmAddress &&
                      errors?.firmAddress &&
                      errors?.firmAddress
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <CustomSelect
                    list={[
                      "divorce",
                      "engaged",
                      "married",
                      "seprated",
                      "single",
                      "widow",
                      "widower",
                    ]}
                    label={"Marital Status"}
                    placeholder={"Select Marital Status"}
                    name={"martialStatus"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.martialStatus}
                    errors={
                      touched?.martialStatus &&
                      errors?.martialStatus &&
                      errors?.martialStatus
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Height (ft)"}
                    placeholder={"Enter Your Height"}
                    name={"height"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.height}
                    errors={touched?.height && errors?.height && errors?.height}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Weight (kg)"}
                    placeholder={"Enter Your Weight"}
                    name={"weight"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.weight}
                    errors={touched?.weight && errors?.weight && errors?.weight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <CustomSelect
                    list={[
                      "abroad",
                      "business",
                      "child",
                      "farming",
                      "house hold",
                      "house wife",
                      "job seeker",
                      "job/service",
                      "retired",
                      "self employed",
                      "study",
                    ]}
                    label={"Activity"}
                    placeholder={"Enter Your Activity"}
                    name={"activity"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.activity}
                    errors={
                      touched?.activity && errors?.activity && errors?.activity
                    }
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("activity", e.target.value);
                      // setActivityIsStudy(e.target.value === "study");
                    }}
                  />
                  {/*{activityIsStudy ? (*/}
                  {/*  <CustomRadio*/}
                  {/*    list={[*/}
                  {/*      { label: "Yes", value: "yes" },*/}
                  {/*      { label: "NO", value: "no" },*/}
                  {/*    ]}*/}
                  {/*    label={"Abroad Study"}*/}
                  {/*    name={"abroadStudy"}*/}
                  {/*    xs={12}*/}
                  {/*    sm={6}*/}
                  {/*    md={4}*/}
                  {/*    value={values?.abroadStudy}*/}
                  {/*    errors={*/}
                  {/*      touched?.abroadStudy &&*/}
                  {/*      errors?.abroadStudy &&*/}
                  {/*      errors?.abroadStudy*/}
                  {/*    }*/}
                  {/*    className={"flex flex-row"}*/}
                  {/*    onChange={handleChange}*/}
                  {/*    onBlur={handleBlur}*/}
                  {/*  />*/}
                  {/*) : null}*/}
                  <CustomSelect
                    list={[
                      "NOT KNOWN",
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ]}
                    label={"Blood Group"}
                    placeholder={"Enter Your Blood Group"}
                    name={"bloodGroup"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.bloodGroup}
                    required={false}
                    errors={
                      touched?.bloodGroup &&
                      errors?.bloodGroup &&
                      errors?.bloodGroup
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <CustomInput
                    type={"text"}
                    label={"YSK No."}
                    placeholder={"Enter Your YSK No."}
                    name={"YSKno"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.YSKno}
                    required={false}
                    onChange={(e) => {
                      setFieldValue("YSKno", e.target.value);
                    }}
                    onBlur={handleBlur}
                    errors={touched?.YSKno && errors?.YSKno && errors?.YSKno}
                  />
                </Grid>
              </FormSection>
              <FormSection title="Mama info">
                <Grid container spacing={2}>
                  <CustomInput
                    type={"text"}
                    label={"Mama Name"}
                    placeholder={"Enter Your Name"}
                    name={"name"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.mamaInfo?.name}
                    required={false}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        name: e.target.value,
                      })
                    }
                    onBlur={handleBlur}
                    errors={
                      touched?.mamaInfo?.name &&
                      errors?.mamaInfo?.name &&
                      errors?.mamaInfo?.name
                    }
                  />
                  <CustomInput
                    type={"text"}
                    label={"Mama Native"}
                    placeholder={"Enter Your Native"}
                    name={"native"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.mamaInfo?.native}
                    required={false}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        native: e.target.value,
                      })
                    }
                    onBlur={handleBlur}
                    errors={
                      touched?.mamaInfo?.native &&
                      errors?.mamaInfo?.native &&
                      errors?.mamaInfo?.native
                    }
                  />
                  <CustomInput
                    type={"text"}
                    label={"Mama City"}
                    placeholder={"Enter Your City"}
                    name={"city"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.mamaInfo.city}
                    required={false}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        city: e.target.value,
                      })
                    }
                    onBlur={handleBlur}
                    errors={
                      touched?.mamaInfo?.city &&
                      errors?.mamaInfo?.city &&
                      errors?.mamaInfo?.city
                    }
                  />
                </Grid>
              </FormSection>
              <FormSection title="Contact info">
                <Grid container spacing={2}>
                  <CustomInput
                    type={"text"}
                    label={"Contact Person Name"}
                    placeholder={"Enter Your Contact Person Name"}
                    name={"name"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.contactInfo?.name}
                    errors={
                      touched?.contactInfo?.name &&
                      errors?.contactInfo?.name &&
                      errors?.contactInfo?.name
                    }
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setFieldValue("contactInfo", {
                        ...values?.contactInfo,
                        name: e.target.value,
                      })
                    }
                  />
                  <CustomInput
                    type={"text"}
                    label={"Contact Person Phone"}
                    placeholder={"Enter Your Contact Person Phone"}
                    name={"phone"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.contactInfo?.phone}
                    errors={
                      touched?.contactInfo?.phone &&
                      errors?.contactInfo?.phone &&
                      errors?.contactInfo?.phone
                    }
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setFieldValue("contactInfo", {
                        ...values?.contactInfo,
                        phone: e?.target?.value,
                      })
                    }
                  />
                  <CustomSelect
                    list={[
                      "Father",
                      "Mother",
                      "Uncle",
                      "Aunty",
                      "Mama",
                      "Mami",
                      "Brother",
                    ]}
                    label={"Relation"}
                    placeholder={"Enter Your Relation"}
                    name={"relation"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.contactInfo?.relation}
                    errors={
                      touched?.contactInfo?.relation &&
                      errors?.contactInfo?.relation &&
                      errors?.contactInfo?.relation
                    }
                    onBlur={handleBlur}
                    onChange={(e) =>
                      setFieldValue("contactInfo", {
                        ...values?.contactInfo,
                        relation: e?.target?.value,
                      })
                    }
                  />
                </Grid>
              </FormSection>
              <FormSection title="Education">
                <Grid container spacing={2}>
                  <CustomSelect
                    list={[
                      "1st std",
                      "2nd std",
                      "3rd std",
                      "4th std",
                      "5th std",
                      "6th std",
                      "7th std",
                      "8th std",
                      "9th std",
                      "10th std (SSC)",
                      "11th std",
                      "12th std (HSC)",
                      "Diploma",
                      "Graduate",
                      "Post Graduate",
                      "PHD",
                    ]}
                    label={"Highest Education"}
                    placeholder={"Select Your Primary Education"}
                    name={"education"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.education}
                    errors={
                      touched?.education &&
                      errors?.education &&
                      errors?.education
                    }
                    onBlur={handleBlur}
                    onChange={(e) => setFieldValue("education", e.target.value)}
                  />
                </Grid>
              </FormSection>
              <FormSection title="Other">
                <Grid container spacing={2}>
                  <CustomCheckbox
                    label={"Handicap"}
                    name={"handicap"}
                    xs={12}
                    sm={12}
                    md={12}
                    value={values?.handicap}
                    errors={
                      touched?.handicap && errors?.handicap && errors?.handicap
                    }
                    className={"flex flex-row"}
                    onChange={(e) => {
                      setFieldValue("handicap", e.target.checked);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Handicap Details"}
                    placeholder={"Enter Handicap Details"}
                    name={"handicapDetails"}
                    multiline={true}
                    xs={12}
                    sm={12}
                    md={12}
                    value={values?.handicapDetails}
                    errors={
                      touched?.handicapDetails &&
                      errors?.handicapDetails &&
                      errors?.handicapDetails
                    }
                    onChange={(e) => {
                      setFieldValue("handicapDetails", e.target.value);
                    }}
                    onBlur={handleBlur}
                    disabled={!values.handicap}
                  />
                  {newFieldList?.map((item, index) => {
                    return (
                      <>
                        <CustomInput
                          type={"text"}
                          label={"Title"}
                          placeholder={"Enter Your Title"}
                          name={item?.title}
                          xs={12}
                          sm={5}
                          value={item?.title}
                          onChange={(e) =>
                            newFieldValueHandler(e, index, "title")
                          }
                        />
                        <CustomInput
                          type={"text"}
                          label={"Description"}
                          placeholder={"Enter Your Description"}
                          name={item?.description}
                          xs={12}
                          sm={6}
                          value={item?.description}
                          onChange={(e) =>
                            newFieldValueHandler(e, index, "description")
                          }
                        />
                        <Grid
                          item
                          xs={12}
                          sm={1}
                          className={"flex justify-center sm:justify-end items-center"}
                        >
                          <IconBtn
                            type="button"
                            aria-label="Remove field"
                            onClick={() => removeFieldHandler(index)}
                          >
                            <RemoveOutlinedIcon />
                          </IconBtn>
                        </Grid>
                      </>
                    );
                  })}
                  <CustomInput
                    type={"text"}
                    label={"Title"}
                    placeholder={"Enter Your Title"}
                    name={"title"}
                    xs={12}
                    sm={5}
                    value={newField?.title}
                    onChange={(e) =>
                      setNewField((pre) => ({
                        ...pre,
                        title: e?.target?.value,
                      }))
                    }
                    required={false}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Description"}
                    placeholder={"Enter Your Description"}
                    name={"description"}
                    xs={12}
                    sm={6}
                    value={newField?.description}
                    onChange={(e) => {
                      setNewField((pre) => ({
                        ...pre,
                        description: e.target.value,
                      }));
                    }}
                    required={false}
                  />
                  <Grid
                    item
                    xs={12}
                    sm={1}
                    className={"flex justify-center sm:justify-end items-center"}
                  >
                    <IconBtn
                      type="button"
                      aria-label="Add field"
                      onClick={addFieldHandler}
                    >
                      <AddOutlinedIcon />
                    </IconBtn>
                  </Grid>
                </Grid>
              </FormSection>
              <div className="flex flex-col-reverse md:flex-row justify-end gap-2 md:gap-3 pt-1">
                <ActionButton
                  type="button"
                  variant="secondary"
                  className="w-full md:w-auto"
                  onClick={() => navigate("/admin/yuvalist")}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type={"submit"}
                  className="w-full md:w-[200px]"
                  disabled={isSubmitting}
                  loading={loading}
                >
                  {isEdit ? "Update Yuva" : "Add New Yuva"}
                </ActionButton>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </ContainerPage>
      <FormModal
        open={showProfileModal}
        onClose={goToYuvaList}
        title="Yuva created successfully"
        maxWidth="520px"
      >
          <p className={"text-sm text-gray-600 mb-4"}>
            Upload a profile photo to finish.
          </p>
          <label htmlFor="created-yuva-upload" className="w-fit mx-auto block">
            {loading ? (
              <CircularProgress className="text-primary" />
            ) : (
              <img
                src={
                  photoPreview ||
                  `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541`
                }
                alt="profile"
                className="w-[160px] h-[160px] rounded-full border border-primary object-cover cursor-pointer"
              />
            )}
          </label>
          <input
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
          <p className={"text-sm text-center break-all text-primary mt-4"}>
            {buildYuvaPhotoName(createdYuva)}
          </p>
          <div className={"flex flex-col-reverse md:flex-row gap-3 mt-4"}>
            <ActionButton
              variant="secondary"
              fullWidth
              onClick={goToYuvaList}
            >
              Skip for now
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
    </Box>
  );
};

export default AddYuva;
