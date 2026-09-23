import Header from "../../../../Component/Header";
import {
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
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
import LoadableImage from "../../../../Component/Common/LoadableImage";
import BilingualInput from "../../../../Component/Common/bilingualInput";
import LanguageSwitcher from "../../../../Component/LanguageSwitcher";
import {
  FormLanguageProvider,
  useFormLanguage,
} from "../../../../context/FormLanguageContext";
import { labeledOptions } from "../../../../i18n/yuvaForm";
import { flattenYuvaForm, masterNameText, toEnGuPayload, langText } from "../../../../util/bhasha";

const slugPart = (value) =>
  langText(value)
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

const otherObjectToFields = (other, otherGu = {}) => {
  if (!other || typeof other !== "object" || Array.isArray(other)) {
    return [];
  }
  return Object.entries(other)
    .filter(([, value]) => String(value ?? "").trim() !== "")
    .map(([title, description]) => ({
      title: String(title).replace(/_/g, " "),
      description: String(description ?? ""),
      titleGu: "",
      descriptionGu: String(
        otherGu?.[title] ?? otherGu?.[String(title).replace(/_/g, " ")] ?? ""
      ),
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

const higherEducation = [
  "Diploma",
  "Graduate",
  "Post Graduate",
  "PHD",
  "OTHER",
];

const fieldsToOtherGuObject = (list = [], draft) => {
  const rows = [...list];
  const draftTitle = String(draft?.title || "").trim();
  const draftDescriptionGu = String(
    draft?.descriptionGu || draft?.description || ""
  ).trim();
  if (draftTitle && draftDescriptionGu) {
    rows.push({
      title: draftTitle,
      descriptionGu: draftDescriptionGu,
    });
  }
  return rows.reduce((acc, item) => {
    const title = String(item?.title || "").trim();
    const descriptionGu = String(
      item?.descriptionGu || item?.description || ""
    ).trim();
    if (title && descriptionGu) {
      acc[title.replace(/\s+/g, "_")] = descriptionGu;
    }
    return acc;
  }, {});
};

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
  const { language, t } = useFormLanguage();
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
  const [selectedMamaLastName, setSelectedMamaLastName] = useState(null);
  const [selectedMamaNative, setSelectedMamaNative] = useState(null);
  const [selectedContactLastName, setSelectedContactLastName] = useState(null);
  const [newField, setNewField] = useState({
    title: "",
    description: "",
    titleGu: "",
    descriptionGu: "",
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
      .catch(function (error) {
        console.error(error);
        setSamajList([]);
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
    const source = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
    return source.map((item) => ({
      ...item,
      label: masterNameText(item, language) || item.label,
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
            setSelectedLastName(masterNameText(data));
          }
          if (location?.state?.data?.mamaInfo?.lastName === data.id) {
            setSelectedMamaLastName(masterNameText(data));
          }
          if (location?.state?.data?.contactInfo?.lastName === data.id) {
            setSelectedContactLastName(masterNameText(data));
          }
        });
        break;
      case "native":
        if (location?.state?.data?.native) {
          axios
            .get(`/${field}/getInfo/${location?.state?.data?.native}`)
            .then((res) => {
              const native = Array.isArray(res.data) ? res.data[0] : res.data;
              if (native?.name) setSelectedNative(masterNameText(native));
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        if (location?.state?.data?.mamaInfo?.native) {
          axios
            .get(`/${field}/getInfo/${location?.state?.data?.mamaInfo?.native}`)
            .then((res) => {
              const native = Array.isArray(res.data) ? res.data[0] : res.data;
              if (native?.name) setSelectedMamaNative(masterNameText(native));
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        break;

      case "country":
        country.forEach((data) => {
          if (location?.state?.data?.country === data.id) {
            // setFieldValue("country", data.name);
            setSelectedCountry(masterNameText(data));
            setIsLocation((pre) => ({ ...pre, country: true }));
          }
        });
        break;
      case "state":
        state.forEach((data) => {
          if (location?.state?.data?.state === data.id) {
            // setFieldValue("state", data.name);
            setSelectedState(masterNameText(data));
            setIsLocation((pre) => ({ ...pre, state: true }));
            getListById("state", location?.state?.data?.country);
          }
        });
        break;
      case "region":
        region.forEach((data) => {
          if (location?.state?.data?.region === data.id) {
            // setFieldValue("region", data.name);
            setSelectedRegion(masterNameText(data));
            setIsLocation((pre) => ({ ...pre, region: true }));
            getListById("region", location?.state?.data?.state);
          }
        });
        break;
      case "district":
        district.forEach((data) => {
          if (location?.state?.data?.district === data.id) {
            // setFieldValue("district", data.name);
            setSelectedDistrict(masterNameText(data));
            setIsLocation((pre) => ({ ...pre, district: true }));
            getListById("district", location?.state?.data?.region);
          }
        });
        break;
      case "city":
        city.forEach((data) => {
          if (location?.state?.data?.city === data.id) {
            // setFieldValue("city", data.name);
            setSelectedCity(masterNameText(data));
            setIsLocation((pre) => ({ ...pre, city: true }));
            getListById("city", location?.state?.data?.district);
          }
        });
        break;
      case "samaj":
        getSamajList(location?.state?.data?.city);
        samaj.forEach((data) => {
          if (location?.state?.data?.localSamaj === data.id) {
            setSelectedSamaj(masterNameText(data));
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
      const { profile, profileName, email, ...payload } = data;
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
      const { email, ...rest } = data;
      await updateYuva(data?.id, {
        ...rest,
        updatedAt: new Date(),
      });
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
  const requiredText = (labelKey, english) =>
    language === "gu" ? `${t(labelKey)} જરૂરી છે` : english;
  const validationSchema = useMemo(
    () =>
      Yup.object({
        firstName: Yup.string().required(requiredText("firstName", "First Name Is Required")),
        motherName: Yup.string().required(requiredText("motherName", "Mother Name Is Required")),
        fatherName: Yup.string().required(requiredText("fatherName", "Father Name Is Required")),
        grandFatherName: Yup.string().required(
          requiredText("grandFatherName", "Grand Father Name Is Required")
        ),
        gender: Yup.string().required(requiredText("gender", "Gender Is Required")),
        pob: Yup.string(),
        ...(location?.state
          ? {
              profileName: Yup.string().required(
                requiredText("profilePhoto", "Profile Photo Is Required")
              ),
            }
          : {}),
        dob: Yup.mixed()
          .nullable()
          .test(
            "dob",
            requiredText("dob", "Date Of Birth Is Required"),
            (value) => Boolean(value) && dayjs(value).isValid()
          ),
        height: Yup.string().required(requiredText("height", "Height Is Required")),
        weight: Yup.string().required(requiredText("weight", "Weight Is Required")),
        firm: Yup.string().required(requiredText("firm", "Firm Is Required")),
        firmAddress: Yup.string().required(
          requiredText("firmAddress", "Firm Address Is Required")
        ),
        address: Yup.string().required(requiredText("address", "Address Is Required")),
        state: Yup.string().required(requiredText("state", "State Is Required")),
        region: Yup.string().required(requiredText("region", "Region Is Required")),
        district: Yup.string().required(requiredText("district", "District Is Required")),
        city: Yup.string().required(requiredText("city", "City Is Required")),
        native: Yup.string().required(requiredText("native", "Native Is Required")),
        education: Yup.object({
          education: Yup.string().required(
            requiredText("highestEducation", "Education Is Required")
          ),
          fieldOfStudy: Yup.string().when("education", {
            is: (value) => higherEducation.includes(value),
            then: (schema) =>
              schema.required(requiredText("fieldOfStudy", "Field of Study Is Required")),
            otherwise: (schema) => schema.notRequired(),
          }),
        }),
        contactInfo: Yup.object({
          name: Yup.string().required(requiredText("contactName", "Contact Name Is Required")),
          lastName: Yup.string()
            .transform((value) =>
              value && typeof value === "object"
                ? String(value.id ?? value.value ?? value._id ?? "")
                : value == null
                  ? ""
                  : String(value)
            )
            .required(requiredText("contactLastName", "Contact Last Name Is Required")),
          relation: Yup.string().required(
            requiredText("relation", "Contact Relation Is Required")
          ),
          phone: Yup.string()
            .transform((value) => String(value ?? "").replace(/\D/g, ""))
            .required(requiredText("contactPhone", "Contact Phone Number Is Required"))
            .matches(/^[0-9]{10}$/, t("err.phone")),
        }),
        mamaInfo: Yup.object({
          name: Yup.string().required(requiredText("mamaName", "Mama Name Is Required")),
          lastName: Yup.string().required(
            requiredText("mamaLastName", "Mama Last Name Is Required")
          ),
          native: Yup.string().required(requiredText("mamaNative", "Mama Native Is Required")),
          city: Yup.string().required(requiredText("mamaCity", "Mama City Is Required")),
        }),
        lastName: Yup.string().required(requiredText("lastName", "Last Name Is Required")),
        bloodGroup: Yup.string().required(requiredText("bloodGroup", "Blood Group Is Required")),
        country: Yup.string().required(requiredText("country", "Country Is Required")),
        familyId: Yup.number()
          .typeError(t("err.number"))
          .positive(t("err.positive"))
          .required(requiredText("familyId", "Family ID IsRequired")),
        activity: Yup.string().required(requiredText("activity", "Activity Is Required")),
        abroadStudy: Yup.string().required(
          language === "gu" ? "વિદેશ અભ્યાસ જરૂરી છે" : "AbroadStudy Required"
        ),
        martialStatus: Yup.string().required(
          requiredText("maritalStatus", "Martial Status Is Required")
        ),
        handicapDetails: Yup.string().when("handicap", {
          is: true,
          then: (schema) =>
            schema.required(requiredText("handicapDetails", "Handicap Details Is Required")),
          otherwise: (schema) => schema.notRequired(),
        }),
        YSKno: Yup.string(),
        localSamaj: Yup.string().required(requiredText("localSamaj", "Local Samaj Required")),
      }),
    // requiredText follows the selected form language
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, location?.state]
  );
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
      firm: "",
      country: "",
      firmAddress: "",
      address: "",
      state: "",
      region: "",
      district: "",
      city: "",
      native: "",
      education: {
        education: "",
        fieldOfStudy: "",
      },
      bloodGroup: "",
      height: "",
      weight: "",
      contactInfo: {
        name: "",
        lastName: "",
        phone: "",
        relation: "",
      },
      mamaInfo: {
        name: "",
        lastName: "",
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
      const newValue = toEnGuPayload(values, {
        other: fieldsToOtherObject(newFieldList, newField),
        otherGu: fieldsToOtherGuObject(newFieldList, newField),
      });
      if (location?.state) {
        updateAPIHandler({ ...newValue, id: values.id });
      } else {
        addYuvaListHandler(newValue);
      }
    },
    validationSchema,
  });
  useEffect(() => {
    formik.validateForm();
    // Refresh messages already on screen when the form language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
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
    submitCount,
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
    const title = String(newField?.title || newField?.titleGu || "").trim();
    const description = String(
      newField?.description || newField?.descriptionGu || ""
    ).trim();
    if (!title || !description) {
      return;
    }
    setNewFieldList((prevState) => [
      ...prevState,
      {
        title,
        description,
        titleGu: newField?.titleGu || "",
        descriptionGu: newField?.descriptionGu || "",
      },
    ]);
    setNewField({ title: "", description: "", titleGu: "", descriptionGu: "" });
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
      const { gu: _ignoredGu, ...record } = location.state.data || {};
      const flat = flattenYuvaForm(record);
      setValues({
        ...values,
        ...flat,
        profileName: location?.state?.data?.profile?.name,
        other: flat.other || {},
        education:
          location?.state?.data?.education &&
          typeof location?.state?.data?.education === "object"
            ? location.state.data.education
            : {
                education: location?.state?.data?.education || "",
                fieldOfStudy: location?.state?.data?.fieldOfStudy || "",
              },
      });
      setNewFieldList(
        otherObjectToFields(flat.other, flat.otherGu)
      );
      setNewField({ title: "", description: "", titleGu: "", descriptionGu: "" });
      selectArr.forEach((data) => {
        selectedValueSetName(data);
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    getList("native");
    getList("surname");
    getList("country");
    selectArr.forEach((data) => {
      addLabelValueInList(data);
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!nativeList.length) return;
    const matchName = (id) => {
      if (!id) return "";
      const key = String(id);
      const found = nativeList.find(
        (item) =>
          String(item?.id) === key ||
          String(item?.value) === key ||
          String(item?._id) === key ||
          String(item?.uuid) === key
      );
      return found?.label || masterNameText(found, language) || "";
    };
    const nativeName = matchName(location?.state?.data?.native || values?.native);
    const mamaName = matchName(
      location?.state?.data?.mamaInfo?.native || values?.mamaInfo?.native
    );
    if (nativeName) setSelectedNative(nativeName);
    if (mamaName) setSelectedMamaNative(mamaName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativeList]);

  useEffect(() => {
    if (surname?.length) {
      addLabelValueInList("surname");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surname]);

  useEffect(() => {
    if (country?.length) {
      addLabelValueInList("country");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

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

  const maritalOptions = labeledOptions(language, "marital", [
    "single",
    "engaged",
    "married",
    "divorce",
    "seprated",
    "widow",
    "widower",
  ]);
  const activityOptions = labeledOptions(language, "activity", [
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
  ]);
  const educationOptions = [
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
    "OTHER",
  ];
  const relationOptions = labeledOptions(language, "relation", [
    "Grandfather",
    "Grandmother",
    "Father",
    "Mother",
    "Uncle",
    "Aunty",
    "Brother",
    "Sister",
    "Fai",
    "Fuva",
    "Mama",
    "Mami",
    "Masa",
    "Masi",
    "Guardian",
  ]);

  return (
    <Box className={language === "gu" ? "form-lang-gu" : ""}>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start pb-6"}
      >
        <PageHeader
          className="w-full"
          title={isEdit ? t("editYuva") : t("addYuva")}
          description={isEdit ? t("editYuvaDesc") : t("addYuvaDesc")}
        />
        <FormikProvider value={formik}>
          <Form>
            <div className="w-full flex flex-col gap-4 md:gap-5">
              {isEdit ? (
                <Card className="w-full">
                  <h2 className="text-base font-WorkSemiBold text-primary mb-5 pb-3 border-b border-line">
                    {t("photo")}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
                    {loading ? (
                      <CircularProgress
                        className={
                          "w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full border border-primary cursor-pointer text-primary"
                        }
                      />
                    ) : (
                      <label
                        htmlFor="upload-button"
                        className="relative shrink-0 cursor-pointer group"
                      >
                        <LoadableImage
                          src={values?.profile?.url}
                          alt={values?.profile?.name || "profile"}
                          className={`w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full border ${
                            touched?.profileName && errors?.profileName
                              ? "border-red-600"
                              : "border-line"
                          } group-hover:border-primary`}
                          eager
                          spinnerSize={32}
                        />
                        <span className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-card">
                          <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
                        </span>
                      </label>
                    )}
                    <div className="text-center sm:text-left min-w-0">
                      <p className="text-sm font-semibold text-primary">
                        {t("profilePhoto")}
                      </p>
                      <p className="text-sm text-mutedText mt-1">
                        {t("photoHint")}
                      </p>
                      <label
                        htmlFor="upload-button"
                        className="inline-flex mt-3 text-sm font-semibold text-primary underline underline-offset-4 cursor-pointer"
                      >
                        {t("changePhoto")}
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
              <FormSection title={t("personalInfo")}>
                <Grid container spacing={2}>
                  <BilingualInput
                    type={"text"}
                    label={t("firstName")}
                    placeholder={t("firstNamePh")}
                    enName={"firstName"}
                    xs={12}
                    sm={6}
                    md={4}
                    errors={
                      touched?.firstName &&
                      errors?.firstName &&
                      errors?.firstName
                    }
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("fatherName")}
                    placeholder={t("fatherNamePh")}
                    enName={"fatherName"}
                    xs={12}
                    sm={6}
                    md={4}
                    errors={
                      touched?.fatherName &&
                      errors?.fatherName &&
                      errors?.fatherName
                    }
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("grandFatherName")}
                    placeholder={t("grandFatherNamePh")}
                    enName={"grandFatherName"}
                    xs={12}
                    sm={6}
                    md={4}
                    errors={
                      touched?.grandFatherName &&
                      errors?.grandFatherName &&
                      errors?.grandFatherName
                    }
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label={t("lastName")}
                    placeholder={t("lastNamePh")}
                    name="lastName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.lastName}
                    errors={
                      touched.lastName && errors.lastName && errors.lastName
                    }
                    onChange={(e, lastName) => {
                      setFieldValue("lastName", lastName?.id || lastName?.value || "");
                      setSelectedLastName(lastName);
                    }}
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("motherName")}
                    placeholder={t("motherNamePh")}
                    enName={"motherName"}
                    xs={12}
                    sm={6}
                    md={4}
                    errors={
                      touched?.motherName &&
                      errors?.motherName &&
                      errors?.motherName
                    }
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"text"}
                    label={t("familyId")}
                    placeholder={t("familyIdPh")}
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
                      { label: t("male"), value: "male" },
                      { label: t("female"), value: "female" },
                    ]}
                    label={t("gender")}
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
                    placeholder={t("dobPh")}
                    label={t("dob")}
                    value={values?.dob}
                    errors={
                      (touched?.dob || submitCount > 0) &&
                      errors?.dob &&
                      errors?.dob
                    }
                    onBlur={() => setFieldTouched("dob", true)}
                    onChange={(e) => {
                      setFieldValue("dob", e);
                      setFieldTouched("dob", true);
                    }}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("pob")}
                    placeholder={t("pobPh")}
                    enName={"pob"}
                    xs={12}
                    sm={6}
                    md={4}
                    required={false}
                    errors={touched?.pob && errors?.pob && errors?.pob}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={nativeList}
                    label={t("native")}
                    placeholder={t("nativePh")}
                    name="native"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.native}
                    errors={touched.native && errors.native && errors.native}
                    onChange={(e, native) => {
                      setFieldValue(
                        "native",
                        native?.id || native?.value || native?._id || native?.uuid || ""
                      );
                      setSelectedNative(native || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("firm")}
                    placeholder={t("firmPh")}
                    enName={"firm"}
                    xs={12}
                    sm={6}
                    md={4}
                    errors={touched?.firm && errors?.firm && errors?.firm}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={countryList}
                    label={t("country")}
                    placeholder={t("countryPh")}
                    name={"country"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.country}
                    errors={
                      touched?.country && errors?.country && errors?.country
                    }
                    onSelect={handleChange}
                    onChange={(e, country) => {
                      setFieldValue("country", country?.id || "");
                      setSelectedCountry(country || null);
                      setIsLocation((pre) => ({ ...pre, country: Boolean(country?.id) }));
                      if (country?.id) getListById("state", country.id);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={stateList}
                    label={t("state")}
                    placeholder={t("statePh")}
                    name={"state"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.state}
                    errors={touched?.state && errors?.state && errors?.state}
                    onChange={(e, state) => {
                      setFieldValue("state", state?.id || "");
                      setSelectedState(state || null);
                      setIsLocation((pre) => ({ ...pre, state: Boolean(state?.id) }));
                      if (state?.id) getListById("region", state.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.country}
                  />
                  <CustomAutoComplete
                    list={regionList}
                    label={t("region")}
                    placeholder={t("regionPh")}
                    name={"region"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.region}
                    errors={touched?.region && errors?.region && errors?.region}
                    onChange={(e, region) => {
                      setFieldValue("region", region?.id || "");
                      setSelectedRegion(region || null);
                      setIsLocation((pre) => ({ ...pre, region: Boolean(region?.id) }));
                      if (region?.id) getListById("district", region.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.state}
                  />
                  <CustomAutoComplete
                    list={districtList}
                    label={t("district")}
                    placeholder={t("districtPh")}
                    name={"district"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.district}
                    errors={
                      touched?.district && errors?.district && errors?.district
                    }
                    onChange={(e, district) => {
                      setFieldValue("district", district?.id || "");
                      setSelectedDistrict(district || null);
                      setIsLocation((pre) => ({ ...pre, district: Boolean(district?.id) }));
                      if (district?.id) getListById("city", district.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.region}
                  />
                  <CustomAutoComplete
                    list={cityList}
                    label={t("city")}
                    placeholder={t("cityPh")}
                    name={"city"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.city}
                    errors={touched?.city && errors?.city && errors?.city}
                    onChange={(e, city) => {
                      setFieldValue("city", city?.id || "");
                      setSelectedCity(city || null);
                      setIsLocation((pre) => ({ ...pre, city: Boolean(city?.id) }));
                      setFieldValue("localSamaj", "");
                      setSelectedSamaj(null);
                      if (city?.id) getSamajList(city.id);
                    }}
                    onBlur={handleBlur}
                    disabled={!isLocation.district}
                  />
                  <CustomAutoComplete
                    list={samajList}
                    label={t("localSamaj")}
                    placeholder={t("localSamajPh")}
                    name={"localSamaj"}
                    xs={12}
                    sm={6}
                    md={4}
                    value={values.localSamaj}
                    errors={
                      touched?.localSamaj &&
                      errors?.localSamaj &&
                      errors?.localSamaj
                    }
                    disabled={!isLocation.city}
                    onChange={(e, localSamaj) => {
                      setFieldValue("localSamaj", localSamaj?.id || "");
                      setSelectedSamaj(localSamaj || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("address")}
                    placeholder={t("addressPh")}
                    enName={"address"}
                    multiline={true}
                    xs={12}
                    sm={6}
                    md={6}
                    errors={
                      touched?.address && errors?.address && errors?.address
                    }
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("firmAddress")}
                    placeholder={t("firmAddressPh")}
                    enName={"firmAddress"}
                    multiline={true}
                    xs={12}
                    sm={6}
                    md={6}
                    errors={
                      touched?.firmAddress &&
                      errors?.firmAddress &&
                      errors?.firmAddress
                    }
                    onBlur={handleBlur}
                  />
                  <CustomSelect
                    list={maritalOptions}
                    label={t("maritalStatus")}
                    placeholder={t("maritalStatusPh")}
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
                    label={t("height")}
                    placeholder={t("heightPh")}
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
                    label={t("weight")}
                    placeholder={t("weightPh")}
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
                    list={activityOptions}
                    label={t("activity")}
                    placeholder={t("activityPh")}
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
                    label={t("bloodGroup")}
                    placeholder={t("bloodGroupPh")}
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
                    label={t("yskNo")}
                    placeholder={t("yskNoPh")}
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
              <FormSection title={t("mamaInfo")}>
                <Grid container spacing={2}>
                  <BilingualInput
                    type={"text"}
                    label={t("mamaName")}
                    placeholder={t("mamaNamePh")}
                    enName={"mamaInfo.name"}
                    xs={12}
                    sm={6}
                    md={4}
                    required={false}
                    onBlur={handleBlur}
                    errors={
                      touched?.mamaInfo?.name &&
                      errors?.mamaInfo?.name &&
                      errors?.mamaInfo?.name
                    }
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label={t("mamaLastName")}
                    placeholder={t("mamaLastNamePh")}
                    name="lastName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.mamaInfo?.lastName}
                    errors={
                      touched?.mamaInfo?.lastName &&
                      errors?.mamaInfo?.lastName &&
                      errors?.mamaInfo?.lastName
                    }
                    onChange={(e, lastName) => {
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        lastName: lastName?.id || lastName?.value || "",
                      });
                      setSelectedMamaLastName(lastName || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={nativeList}
                    label={t("mamaNative")}
                    placeholder={t("mamaNativePh")}
                    name="mamaInfo.native"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.mamaInfo?.native}
                    errors={
                      touched?.mamaInfo?.native &&
                      errors?.mamaInfo?.native &&
                      errors?.mamaInfo?.native
                    }
                    onChange={(e, native) => {
                      setFieldValue("mamaInfo", {
                        ...values?.mamaInfo,
                        native:
                          native?.id ||
                          native?.value ||
                          native?._id ||
                          native?.uuid ||
                          "",
                      });
                      setSelectedMamaNative(native || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("mamaCity")}
                    placeholder={t("mamaCityPh")}
                    enName={"mamaInfo.city"}
                    xs={12}
                    sm={6}
                    md={4}
                    required={false}
                    errors={
                      touched?.mamaInfo?.city &&
                      errors?.mamaInfo?.city &&
                      errors?.mamaInfo?.city
                    }
                    onBlur={handleBlur}
                  />
                </Grid>
              </FormSection>
              <FormSection title={t("contactInfo")}>
                <Grid container spacing={2}>
                  <BilingualInput
                    type={"text"}
                    label={t("contactName")}
                    placeholder={t("contactNamePh")}
                    enName={"contactInfo.name"}
                    xs={12}
                    sm={6}
                    md={4}
                    required
                    errors={
                      (touched?.contactInfo?.name || submitCount > 0) &&
                      errors?.contactInfo?.name &&
                      errors?.contactInfo?.name
                    }
                    onBlur={handleBlur}
                  />
                  <CustomAutoComplete
                    list={lastNameList}
                    label={t("contactLastName")}
                    placeholder={t("contactLastNamePh")}
                    name="contactInfo.lastName"
                    xs={12}
                    sm={6}
                    md={4}
                    value={values?.contactInfo?.lastName}
                    errors={
                      (touched?.contactInfo?.lastName || submitCount > 0) &&
                      errors?.contactInfo?.lastName &&
                      errors?.contactInfo?.lastName
                    }
                    onChange={(e, lastName) => {
                      setFieldValue(
                        "contactInfo.lastName",
                        lastName?.id || lastName?.value || ""
                      );
                      setSelectedContactLastName(lastName || null);
                    }}
                    onBlur={handleBlur}
                  />
                  <CustomInput
                    type={"tel"}
                    label={t("contactPhone")}
                    placeholder={t("contactPhonePh")}
                    name={"contactInfo.phone"}
                    xs={12}
                    sm={6}
                    md={4}
                    required
                    value={values?.contactInfo?.phone}
                    errors={
                      (touched?.contactInfo?.phone || submitCount > 0) &&
                      errors?.contactInfo?.phone &&
                      errors?.contactInfo?.phone
                    }
                    onBlur={handleBlur}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
                    onChange={(e) => {
                      const next = String(e?.target?.value || "")
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setFieldValue("contactInfo.phone", next);
                    }}
                  />
                  <CustomSelect
                    list={relationOptions}
                    label={t("relation")}
                    placeholder={t("relationPh")}
                    name={"contactInfo.relation"}
                    xs={12}
                    sm={6}
                    md={4}
                    required
                    value={values?.contactInfo?.relation}
                    errors={
                      (touched?.contactInfo?.relation || submitCount > 0) &&
                      !values?.contactInfo?.relation &&
                      errors?.contactInfo?.relation
                    }
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
              <FormSection title={t("education")}>
                <Grid container spacing={2}>
                  <CustomSelect
                    list={educationOptions}
                    label={t("highestEducation")}
                    placeholder={t("highestEducationPh")}
                    name={"education.education"}
                    xs={12}
                    sm={6}
                    md={4}
                    required
                    value={values?.education?.education}
                    errors={
                      (touched?.education?.education || submitCount > 0) &&
                      errors?.education?.education &&
                      errors?.education?.education
                    }
                    onBlur={() =>
                      setFieldTouched("education.education", true, false)
                    }
                    onChange={(e) => {
                      const education = e.target.value;
                      setFieldValue("education.education", education);
                      if (!higherEducation.includes(education)) {
                        setFieldValue("education.fieldOfStudy", "");
                      }
                    }}
                  />
                  {higherEducation.includes(values?.education?.education) ? (
                    <CustomInput
                      type={"text"}
                      label={t("fieldOfStudy")}
                      placeholder={t("fieldOfStudyPh")}
                      name={"education.fieldOfStudy"}
                      xs={12}
                      sm={6}
                      md={4}
                      required
                      value={values?.education?.fieldOfStudy}
                      errors={
                        (touched?.education?.fieldOfStudy || submitCount > 0) &&
                        errors?.education?.fieldOfStudy &&
                        errors?.education?.fieldOfStudy
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : null}
                </Grid>
              </FormSection>
              <FormSection title={t("handicapInfo")}>
                <Grid container spacing={2}>
                  <CustomCheckbox
                    label={t("handicap")}
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
                      if (!e.target.checked) {
                        setFieldValue("handicapDetails", "");
                      }
                    }}
                    onBlur={handleBlur}
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("handicapDetails")}
                    placeholder={t("handicapDetailsPh")}
                    enName={"handicapDetails"}
                    multiline={true}
                    xs={12}
                    sm={12}
                    md={12}
                    required={Boolean(values?.handicap)}
                    errors={
                      touched?.handicapDetails &&
                      errors?.handicapDetails &&
                      errors?.handicapDetails
                    }
                    onBlur={handleBlur}
                    disabled={!values.handicap}
                  />
                </Grid>
              </FormSection>
              <FormSection title={t("otherInfo")}>
                <Grid container spacing={2}>
                  {newFieldList?.map((item, index) => {
                    return (
                      <>
                        <BilingualInput
                          type={"text"}
                          label={t("title")}
                          placeholder={t("titlePh")}
                          enName={`other-title-${index}`}
                          standalone
                          enValue={item?.title}
                          guValue={item?.titleGu}
                          xs={12}
                          sm={5}
                          onValuesChange={({ en, gu }) => {
                            const clone = [...newFieldList];
                            clone[index] = {
                              ...clone[index],
                              title: en,
                              titleGu: gu,
                            };
                            setNewFieldList(clone);
                          }}
                        />
                        <BilingualInput
                          type={"text"}
                          label={t("description")}
                          placeholder={t("descriptionPh")}
                          enName={`other-description-${index}`}
                          standalone
                          enValue={item?.description}
                          guValue={item?.descriptionGu}
                          xs={12}
                          sm={6}
                          onValuesChange={({ en, gu }) => {
                            const clone = [...newFieldList];
                            clone[index] = {
                              ...clone[index],
                              description: en,
                              descriptionGu: gu,
                            };
                            setNewFieldList(clone);
                          }}
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
                  <BilingualInput
                    type={"text"}
                    label={t("title")}
                    placeholder={t("titlePh")}
                    enName={"other-title-draft"}
                    standalone
                    enValue={newField?.title}
                    guValue={newField?.titleGu}
                    xs={12}
                    sm={5}
                    required={false}
                    onValuesChange={({ en, gu }) =>
                      setNewField((pre) => ({
                        ...pre,
                        title: en,
                        titleGu: gu,
                      }))
                    }
                  />
                  <BilingualInput
                    type={"text"}
                    label={t("description")}
                    placeholder={t("descriptionPh")}
                    enName={"other-description-draft"}
                    standalone
                    enValue={newField?.description}
                    guValue={newField?.descriptionGu}
                    xs={12}
                    sm={6}
                    required={false}
                    onValuesChange={({ en, gu }) =>
                      setNewField((pre) => ({
                        ...pre,
                        description: en,
                        descriptionGu: gu,
                      }))
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
                      aria-label="Add field"
                      onClick={addFieldHandler}
                    >
                      <AddOutlinedIcon />
                    </IconBtn>
                  </Grid>
                </Grid>
              </FormSection>
              <div className="flex flex-col-reverse md:flex-row justify-start gap-2 md:gap-3 pt-1">
                <ActionButton
                  type="button"
                  variant="secondary"
                  className="w-full md:w-auto"
                  onClick={() => navigate("/admin/yuvalist")}
                >
                  {t("cancel")}
                </ActionButton>
                <ActionButton
                  type={"submit"}
                  className="w-full md:w-[200px]"
                  disabled={isSubmitting}
                  loading={loading}
                >
                  {isEdit ? t("updateYuva") : t("addNewYuva")}
                </ActionButton>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </ContainerPage>
      <LanguageSwitcher />
      <FormModal
        open={showProfileModal}
        onClose={goToYuvaList}
        title={t("createdTitle")}
        maxWidth="520px"
      >
          <p className={"text-sm text-gray-600 mb-4"}>
            {t("createdHint")}
          </p>
          <label htmlFor="created-yuva-upload" className="w-fit mx-auto block">
            {loading ? (
              <CircularProgress className="text-primary" />
            ) : (
              <LoadableImage
                src={photoPreview}
                alt="profile"
                className="w-[160px] h-[160px] rounded-full border border-primary cursor-pointer"
                eager
                spinnerSize={32}
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
              {t("skip")}
            </ActionButton>
            <ActionButton
              fullWidth
              onClick={uploadCreatedYuvaPhoto}
              disabled={!selectedPhoto || loading}
              loading={loading}
            >
              {t("uploadPhoto")}
            </ActionButton>
          </div>
      </FormModal>
    </Box>
  );
};

const AddYuvaPage = () => {
  return (
    <FormLanguageProvider defaultLanguage="en">
      <AddYuva />
    </FormLanguageProvider>
  );
};

export default AddYuvaPage;
