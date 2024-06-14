import Header from "../../Component/Header";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  Paper,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import CustomInput from "../../Component/Common/customInput";
import CustomAutoComplete from "../../Component/Common/customAutoComplete";
import CustomRadio from "../../Component/Common/customRadio";
import { Form, FormikProvider, useFormik } from "formik";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import * as Yup from "yup";
import axios from "../../util/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import CustomSelect from "../../Component/Common/customSelect";
import DatePicker from "../../Component/Common/DatePicker";

const AddYuva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newFieldList, setNewFieldList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [states, setStates] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [newField, setNewField] = useState({
    title: "",
    description: "",
  });

  const getCountries = () => {
    var config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries",
      headers: {
        "X-CSCAPI-KEY":
          "NEJDZktrYURpTmZmZEZPVmRVRzNmOXlvcE9vSFBDZDZPamdCRUpUUQ==",
      },
    };

    axios(config)
      .then(function (response) {
        setCountries(response.data);
        response.data.map((countryData) => {
          setCountryList((prevCountryList) => [
            ...prevCountryList,
            countryData.name,
          ]);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getStateByContry = () => {
    var config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries/IN/states",
      headers: {
        "X-CSCAPI-KEY":
          "NEJDZktrYURpTmZmZEZPVmRVRzNmOXlvcE9vSFBDZDZPamdCRUpUUQ==",
      },
    };

    axios(config)
      .then(function (response) {
        setStates(response.data);
        response.data.map((stateData) => {
          setStateList((prevStateList) => [...prevStateList, stateData.name]);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCityByState = (state) => {
    var config = {
      method: "get",
      url: `https://api.countrystatecity.in/v1/countries/IN/states/${state}/cities`,
      headers: {
        "X-CSCAPI-KEY":
          "NEJDZktrYURpTmZmZEZPVmRVRzNmOXlvcE9vSFBDZDZPamdCRUpUUQ==",
      },
    };

    axios(config)
      .then(function (response) {
        setCities(response.data);
        response.data.map((cityData) => {
          setCityList((prevCityList) => [...prevCityList, cityData.name]);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addYuvaListHandler = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/yuvaList/addYuvaList`, data)
      .then((res) => {
        navigate("/yuvalist");
      })
      .finally(() => {
        setLoading(false);
        setNewFieldList([]);
      });
  };
  const updateAPIHandler = (data) => {
    setLoading(true);
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/yuvaList/update/${data?.id}`, {
        ...data,
        updatedAt: new Date(),
      })
      .then((res) => {
        navigate("/yuvalist");
      })
      .finally(() => {
        setLoading(false);
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
      dob: "",
      pob: "",
      email: "",
      firm: "",
      country: "",
      firmAddress: "",
      state: "",
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
      profile: null,
      // profile: {
      //   name: "",
      //   url: "",
      // },
      activity: "",
      abroadStudy: "no",
      martialStatus: "",
    },
    onSubmit: async (values, { resetForm }) => {
      let newValue = { ...values };
      newFieldList?.map((item) => {
        if (item?.title && item?.description) {
          newValue[item?.title] = item?.description;
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
      // fatherName: Yup.string().required("Required"),
      motherName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      // mamasName: Yup.string().required("Required"),
      // profile: Yup.string().required("Required"),
      // contactPersonName: Yup.string().required("Required"),
      // education: Yup.string().required("Required"),
      // relation: Yup.string().required("Required"),
      // bloodGroup: Yup.string().required("Required"),
      height: Yup.string().required("Required"),
      weight: Yup.string().required("Required"),
      firm: Yup.string().required("Required"),
      firmAddress: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      native: Yup.string().required("Required"),
      contactInfo: Yup.object({
        name: Yup.string().required("Required"),
        relation: Yup.string().required("Required"),
        phone: Yup.number().typeError("Must be a number").required("Required"),
      }),
      // profile: Yup.object({
      //   name: Yup.string().required("Required"),
      // }),
      // mamasCity: Yup.string().required("Required"),
      // mamasNative: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
      dob: Yup.date().required("Required"),
      familyId: Yup.number()
        .typeError("Must be a number")
        .positive()
        .required("Required"),

      // contactPersonPhone: Yup.number()
      //   .typeError("Must be a number")
      //   .required("Required"),
      activity: Yup.string().required("Required"),
      abroadStudy: Yup.string().required("Required"),
      email: Yup.string().required("Required"),
      martialStatus: Yup.string().required("Required"),
    }),
  });
  const { errors, values, setValues, setFieldValue, resetForm } = formik;

  const fieldValueChangeHandler = (e) => {
    console.log("name : ", e, e.target.name, "value : ", e.target.value);
    // if (e.target.name === "country") {
    //   console.log("co");
    //   countries.map((countryData) => {
    //     console.log(countryData);
    //   });
    //   // setStateSelected(e.target.value)
    // } else
    if (e.target.name === "state") {
      states.map((stateData) => {
        if (stateData.name === e.target.value) {
          getCityByState(stateData.iso2);
        }
      });
    } else if (e.target.name === "City") {
      console.log("c");
      // setCitySelected(e.target.value)
    }
    setFieldValue(e.target.name, e.target.value);
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
      setValues({ ...values, ...location?.state?.data });
    }
  }, [location]);

  useEffect(() => {
    // getCountries();
    getStateByContry();
    // getCityByState();
  }, []);

  const hasError = Object.keys(errors).length;

  console.log("value : >>", values);
  console.log("state : >>", stateList);

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-4 sm:px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto bg-white"
        }
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
                    onChange={fieldValueChangeHandler}
                    errors={errors?.firstName}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Father Name"}
                    placeholder={"Enter Your Father Name"}
                    name={"middleName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.middleName}
                    errors={errors?.middleName}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Grand Father Name"}
                    placeholder={"Enter Your Grand Father Name"}
                    name={"middleName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.middleName}
                    errors={errors?.middleName}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Last Name"}
                    placeholder={"Enter Your Last Name"}
                    name={"lastName"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.lastName}
                    errors={errors?.lastName}
                    onChange={fieldValueChangeHandler}
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
                    errors={errors?.motherName}
                    onChange={fieldValueChangeHandler}
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
                    errors={errors?.familyId}
                    onChange={fieldValueChangeHandler}
                  />
                  <DatePicker
                    name={"dob"}
                    xs={12}
                    sm={6}
                    md={4}
                    label={"Date and Time of Birth"}
                    value={moment(values?.dob).format("YYYY-MM-DD")}
                    errors={errors?.dob}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Birth Place"}
                    placeholder={"Enter Your Birth Place"}
                    name={"pob"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.email}
                    errors={errors?.email}
                    onChange={fieldValueChangeHandler}
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
                    errors={errors?.email}
                    onChange={fieldValueChangeHandler}
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
                    errors={errors?.firm}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomAutoComplete
                    list={countryList}
                    label={"Country"}
                    placeholder={"Select Your Country"}
                    name={"country"}
                    defaultValue={"India"}
                    disabled={true}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.country}
                    errors={errors?.country}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomAutoComplete
                    list={stateList}
                    label={"State"}
                    placeholder={"Select Your State"}
                    name={"state"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.state}
                    errors={errors?.state}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomAutoComplete
                    list={cityList}
                    label={"City"}
                    placeholder={"Select Your Country"}
                    name={"city"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.city}
                    errors={errors?.city}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Native"}
                    placeholder={"Enter Your Native"}
                    name={"native"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.native}
                    errors={errors?.native}
                    onChange={fieldValueChangeHandler}
                  />
                  {values?.profile?.name ? (
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
                          {values?.profile?.name}
                        </span>
                        <CloseOutlinedIcon
                          onClick={() => {
                            setFieldValue("profile", null);
                            // setFieldValue("profileUrl", "");
                          }}
                        />
                      </span>
                    </Grid>
                  ) : (
                    <CustomInput
                      type={"file"}
                      label={"Profile"}
                      placeholder={"Enter Your City"}
                      name={"profile"}
                      xs={12}
                      sm={6}
                      md={4}
                      focused
                      value={values?.profile?.name}
                      // errors={errors?.profile?.name}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // const url = URL.createObjectURL(file);
                          // const reader = new FileReader();
                          const reader = new FileReader();
                          reader.onloadend = (result) => {
                            console.log("result", result);
                          };
                          reader.readAsDataURL(file);
                          // reader.onloadend = () => {
                          // setFieldValue("profileUrl", url);
                          // setFieldValue("profile", {
                          //   name: file?.name,
                          //   url: url,
                          // });
                          setFieldValue("profile", JSON.stringify(file));
                          // setFieldValue("profile", {
                          //   name: file.name,
                          //   lastModified: file.lastModified,
                          //   lastModifiedDate: new Date(file.lastModified),
                          //   size: file.size,
                          //   type: file.type,
                          //   webkitRelativePath: file.webkitRelativePath,
                          // });
                          // };
                          // reader.readAsDataURL(file);
                        }
                      }}
                    />
                  )}
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
                    errors={errors?.firmAddress}
                    onChange={fieldValueChangeHandler}
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
                    value={values?.firmAddress}
                    errors={errors?.firmAddress}
                    onChange={fieldValueChangeHandler}
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
                    errors={errors?.height}
                    onChange={fieldValueChangeHandler}
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
                    errors={errors?.weight}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomSelect
                    list={[
                      "Job Seeker",
                      "Job/Service",
                      "Business",
                      "Study",
                      "Farming",
                    ]}
                    label={"Activity"}
                    placeholder={"Enter Your Activity"}
                    name={"activity"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.activity}
                    errors={errors?.activity}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomSelect
                    list={["Single", "Engaged", "Divorce", "Married"]}
                    label={"Martial Status"}
                    placeholder={"Select Your Country"}
                    name={"martialStatus"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.martialStatus}
                    errors={errors?.martialStatus}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomRadio
                    list={[
                      { label: "Yes", value: "yes" },
                      { label: "NO", value: "no" },
                    ]}
                    label={"Abroad Study"}
                    name={"abroadStudy"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.abroadStudy}
                    errors={errors?.abroadStudy}
                    className={"flex flex-row"}
                    onChange={fieldValueChangeHandler}
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
                    // errors={errors?.mamasName}
                    // onChange={fieldValueChangeHandler}
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
                    // errors={errors?.mamasCity}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        native: e.target.value,
                      })
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
                    // errors={errors?.mamasCity}
                    onChange={(e) =>
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        city: e.target.value,
                      })
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
                    errors={errors?.contactInfo?.name}
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
                    errors={errors?.contactInfo?.phone}
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
                    errors={errors?.contactInfo?.relation}
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
                  OTHER INFO
                </div>
                <Grid container spacing={2}>
                  <CustomInput
                    type={"text"}
                    label={"Education"}
                    placeholder={"Enter Your Enducation"}
                    name={"education"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.education}
                    required={false}
                    // errors={errors?.education}
                    onChange={fieldValueChangeHandler}
                  />
                  <CustomSelect
                    list={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                    label={"Blood Group"}
                    placeholder={"Enter Your Blood Group"}
                    name={"bloodGroup"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.bloodGroup}
                    required={false}
                    // errors={errors?.bloodGroup}
                    onChange={fieldValueChangeHandler}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <div className={"text-xl font-bold text-gray pb-2"}>OTHERS</div>
                <Grid container spacing={2}>
                  {newFieldList?.map((item, index) => {
                    return (
                      <>
                        <CustomInput
                          type={"text"}
                          label={"Title"}
                          placeholder={"Enter Your Title"}
                          name={item?.title}
                          xs={4}
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
                          xs={4}
                          value={item?.description}
                          onChange={(e) =>
                            newFieldValueHandler(e, index, "description")
                          }
                        />
                        <Grid item xs={4} className={"flex justify-start"}>
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
                    onChange={(e) =>
                      setNewField((pre) => ({
                        ...pre,
                        description: e.target.value,
                      }))
                    }
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
                    className={`bg-[#572a2a] text-white sm:w-[200px] w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold transition-all ${
                      hasError ? "opacity-50" : "opacity-100"
                    }}`}
                    type={"submit"}
                    disabled={hasError}
                  >
                    Add New Yuva
                  </button>
                )}
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </div>
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
          {/*<img alt={values?.profile?.name} src={values?.profile?.url} />*/}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AddYuva;
