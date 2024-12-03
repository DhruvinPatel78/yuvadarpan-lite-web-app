import Header from "../../../../Component/Header";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomInput from "../../../../Component/Common/customInput";
import CustomAutoComplete from "../../../../Component/Common/customAutoComplete";
import CustomRadio from "../../../../Component/Common/customRadio";
import { Form, FormikProvider, useFormik } from "formik";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import * as Yup from "yup";
import axios from "../../../../util/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import CustomSelect from "../../../../Component/Common/customSelect";
import DatePicker from "../../../../Component/Common/DatePicker";
import CustomCheckbox from "../../../../Component/Common/customCheckbox";
import { useDispatch, useSelector } from "react-redux";
import ContainerPage from "../../../../Component/Container";
import { endLoading, startLoading } from "../../../../store/authSlice";

const AddYuva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { country, state, region, district, city, samaj, surname } =
    useSelector((state) => state.location);
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
  const [isEdit, setIsEdit] = useState(false);

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
        console.log(error);
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

  const addYuvaListHandler = (data) => {
    dispatch(startLoading());
    axios
      .post(`/yuvaList/addYuvaList`, data)
      .then((res) => {
        navigate("/admin/yuvalist");
      })
      .finally(() => {
        dispatch(endLoading());
        setNewFieldList([]);
      });
  };
  const updateAPIHandler = (data) => {
    dispatch(startLoading());
    axios
      .patch(`/yuvaList/update/${data?.id}`, {
        ...data,
        updatedAt: new Date(),
      })
      .then((res) => {
        navigate("/admin/yuvalist");
      })
      .finally(() => {
        dispatch(endLoading());
        setNewFieldList([]);
      });
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
    onSubmit: async (values, { resetForm }) => {
      let newValue = { ...values };
      newFieldList?.forEach((item) => {
        if (item?.title && item?.description) {
          newValue.other = {
            ...newValue?.other,
            [item?.title?.toString().replace(/\s+/g, "_")]: item?.description,
          };
        }
      });
      if (location?.state) {
        updateAPIHandler(newValue);
      } else {
        addYuvaListHandler(newValue);
      }
      resetForm();
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      motherName: Yup.string().required("Required"),
      fatherName: Yup.string().required("Required"),
      grandFatherName: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      pob: Yup.string().required("Required"),
      profileName: Yup.string().required("Required"),
      dob: Yup.date().required("Required"),
      height: Yup.string().required("Required"),
      weight: Yup.string().required("Required"),
      firm: Yup.string().required("Required"),
      firmAddress: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      region: Yup.string().required("Required"),
      district: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      native: Yup.string().required("Required"),
      education: Yup.string().required("Required"),
      contactInfo: Yup.object({
        name: Yup.string().required("Required"),
        relation: Yup.string().required("Required"),
        phone: Yup.string()
          .matches(
            "^(\\+\\d{1,3}[- ]?)?\\d{10}$",
            "Phone Number must be correct"
          )
          .required("Required"),
      }),
      mamaInfo: Yup.object({
        name: Yup.string().required("Required"),
        native: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
      }),
      lastName: Yup.string().required("Required"),
      bloodGroup: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
      familyId: Yup.number()
        .typeError("Must be a Number")
        .positive()
        .required("Required"),
      activity: Yup.string().required("Required"),
      abroadStudy: Yup.string().required("Required"),
      email: Yup.string()
        .matches(
          "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          "Invalid email address format"
        )
        .required("Required"),
      martialStatus: Yup.string().required("Required"),
      // handicap: Yup.string().required("Required"),
      // handicapDetails: Yup.string().required("Required"),
      YSKno: Yup.string().required("Required"),
      localSamaj: Yup.string().required("Required"),
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
  } = formik;

  const imageUploadHandler = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    axios
      .post(`/image/upload`, formData, {
        contentType: "multipart/form-data",
      })
      .then((res) => {
        setFieldValue("profile", res?.data?.data);
        setFieldValue("profileName", res?.data?.data?.name);
      })
      .catch((e) => console.log("error API  = = = = >", e));
  };
  const addFieldHandler = () => {
    // setFieldValue(`${newField.title}`,newField.description)
    setNewFieldList((prevState) => [...prevState, newField]);
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
      });
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

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start bg-white"}
      >
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2} className={"px-0 py-2 sm:p-4"}>
              <Grid item xs={12}>
                <div className={"text-xl font-bold text-gray pb-2"}>
                  PERSONAL INFO
                </div>
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
                    label={"FamilyId"}
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
                    label={"dob"}
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
                    label={"E-mail"}
                    placeholder={"Enter Your E-mail"}
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
                    placeholder={"Select Your Country"}
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
                    label={"Martial Status"}
                    placeholder={"Select Your Country"}
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
                  {values?.profileName ? (
                    <Grid item xs={4} className={"flex items-center"}>
                      <span
                        className={
                          "flex items-center underline cursor-pointer flex-row gap-2 w-full justify-between"
                        }
                      >
                        <span
                          className={"ellipsis"}
                          onClick={() => setShowProfileModal(!showProfileModal)}
                        >
                          {values?.profileName}
                        </span>
                        <CloseOutlinedIcon
                          onClick={() => {
                            setFieldValue("profileName", null);
                            setFieldValue("profile", null);
                          }}
                        />
                      </span>
                    </Grid>
                  ) : (
                    <CustomInput
                      type={"file"}
                      label={"Profile"}
                      placeholder={"Enter Your City"}
                      name={"profileName"}
                      xs={12}
                      sm={6}
                      md={4}
                      focused
                      value={values?.profileName}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          imageUploadHandler(file);
                        }
                      }}
                      onBlur={handleBlur}
                      errors={
                        touched?.profileName &&
                        errors?.profileName &&
                        errors?.profileName
                      }
                    />
                  )}
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
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <div className={"text-xl font-bold text-gray pb-2"}>
                  MAMAS INFO
                </div>
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
                      errors?.mamaInfo?.city &&
                      errors?.mamaInfo?.city &&
                      errors?.mamaInfo?.city
                    }
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <div className={"text-xl font-bold text-gray pb-2"}>
                  CONTACT INFO
                </div>
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
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <div
                  className={
                    "text-xl font-bold text-gray pb-2 flex flex-row justify-between items-center"
                  }
                >
                  EDUCATION INFO
                </div>
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
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <div className={"text-xl font-bold text-gray pb-2"}>OTHERS</div>
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
                          xs={5}
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
                          xs={6}
                          value={item?.description}
                          onChange={(e) =>
                            newFieldValueHandler(e, index, "description")
                          }
                        />
                        <Grid
                          item
                          xs={1}
                          className={"flex justify-center items-center"}
                        >
                          <button
                            type={"button"}
                            onClick={() => removeFieldHandler(index)}
                          >
                            <RemoveOutlinedIcon />
                          </button>
                        </Grid>
                      </>
                    );
                  })}
                  <CustomInput
                    type={"text"}
                    label={"Title"}
                    placeholder={"Enter Your Title"}
                    name={"title"}
                    xs={5}
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
                    xs={6}
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
                    xs={1}
                    className={"flex justify-center items-center"}
                  >
                    <button type={"button"} onClick={addFieldHandler}>
                      <AddOutlinedIcon />
                    </button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {loading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <button
                    className={`bg-[#572a2a] text-white sm:w-[200px] w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold transition-all  ${
                      isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                    }}`}
                    type={"submit"}
                    disabled={isSubmitting}
                  >
                    {isEdit ? "Update Yuva" : "Add New Yuva"}
                  </button>
                )}
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </ContainerPage>
      <Modal
        open={showProfileModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          "& .MuiModal-backdrop": {
            backdropFilter: " blur(2px) !important",
            background: "#878b9499 !important",
          },
        }}
        onClose={() => setShowProfileModal(!showProfileModal)}
        className="flex justify-center items-center"
      >
        <Paper
          elevation={10}
          className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none flex flex-col gap-2"
        >
          <div className={"flex flex-row justify-between"}>
            {values?.profile?.name}
            <CloseOutlinedIcon
              className={"cursor-pointer"}
              onClick={() => setShowProfileModal(!showProfileModal)}
            />
          </div>
          <img alt={values?.profile?.name} src={values?.profile?.url} />
        </Paper>
      </Modal>
    </Box>
  );
};

export default AddYuva;
