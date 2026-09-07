import { Box, Button, CircularProgress, Grid, IconButton, Modal, Tabs, Tab, styled } from "@mui/material";
import Header from "../../Component/Header";
import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ImageBackdrop, ImageButton, ImageSrc } from "../../Component/constant";
import moment from "moment/moment";
import ContainerPage from "../../Component/Container";
import { UseRedux } from "../../Component/useRedux";
import CustomTabPanel from "./CustomTabPanel";
import YuvaPrintTemplate, {
  extraOtherFields,
  getLookupName,
  hasValue,
} from "./PrintTemplates";
import { useDispatch } from "react-redux";
import {
  getAllCityData,
  getAllCountryData,
  getAllDistrictData,
  getAllRegionData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
} from "../../util/getAPICall";
import { getNativeList, getPublicYuva } from "../../util/yuvaAdminApi";
import { canEditYuvaRecord } from "../../util/util";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    // maxWidth: 40,
    width: "100%",
    backgroundColor: "#542b2b",
  },
});
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    // fontWeight: theme.typography.fontWeightBold,
    fontWeight: 600,
    fontSize: 16,
    // fontSize: theme.typography.pxToRem(15),
    // marginRight: theme.spacing(1),
    // color: "black",
    "&.Mui-selected": {
      color: "#542b2b",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#542b2b",
    },
  })
);
const profileTabs = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Mama Info" },
  { id: 3, title: "Contact Info" },
  { id: 4, title: "Other Info" },
];

const PLACEHOLDER_PHOTO =
  "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg";

const getYuvaShareId = (value) => {
  const raw = decodeURIComponent(String(value || "")).trim();
  const objectId = raw.match(/[a-fA-F0-9]{24}/);
  if (objectId) {
    return objectId[0];
  }
  const compactId = raw.match(/[a-fA-F0-9]{32}/);
  if (compactId) {
    return compactId[0];
  }
  return raw.split(/[\s/?&#]/)[0];
};

const formatLabel = (value) => {
  if (!hasValue(value)) return "-";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const titleCase = (value) => {
  const text = formatLabel(value);
  if (text === "-") return text;
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const lookupValue = (list, id, fallback) => {
  const name = getLookupName(list, id, fallback);
  if (hasValue(name)) return name;
  if (hasValue(id) && !/^[a-f0-9]{24}$/i.test(String(id))) return String(id);
  return "-";
};

const DetailFields = ({ fields }) => (
  <Grid container spacing={2} className={"w-full"}>
    {(fields || []).map((field, index) => (
      <Grid item xs={12} sm={6} key={`${field.label}-${index}`}>
        <div className={"flex flex-col gap-0.5"}>
          <span className={"text-sm font-semibold text-[#572a2a]"}>
            {field.label}
          </span>
          <span className={"text-base break-words text-gray-800"}>
            {hasValue(field.value) ? field.value : "-"}
          </span>
        </div>
      </Grid>
    ))}
  </Grid>
);

const ProfilePage = () => {
  const { id: routeId } = useParams();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const isPublicView = pathname.startsWith("/yuva");
  const id = getYuvaShareId(routeId);
  const [data, setData] = React.useState(state || null);
  const [loadError, setLoadError] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [photoOpen, setPhotoOpen] = React.useState(false);
  const [nativeList, setNativeList] = React.useState([]);
  const { city, state: stateList, surname, country, region, district, samaj, auth } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const dispatch = useDispatch();
  const photoUrl = data?.profile?.url || PLACEHOLDER_PHOTO;
  const labels = data?.labels || {};
  const canEdit = Boolean(
    !isPublicView &&
      canEditYuvaRecord(auth?.user, data, {
        samaj,
        city,
        district,
        region,
        state: stateList,
        country,
      })
  );
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    if (!id) return;
    getPublicYuva(id)
      .then((yuva) => {
        setData(yuva);
        setLoadError("");
      })
      .catch(() => {
        if (!state) {
          setLoadError("Yuva profile not found");
        }
      });
  }, [id]);

  React.useEffect(() => {
    if (isPublicView) return;
    if (!country?.length) dispatch(getAllCountryData);
    if (!stateList?.length) dispatch(getAllStateData);
    if (!region?.length) dispatch(getAllRegionData);
    if (!district?.length) dispatch(getAllDistrictData);
    if (!city?.length) dispatch(getAllCityData);
    if (!samaj?.length) dispatch(getAllSamajData);
    if (!surname?.length) dispatch(getAllSurnameData);
  }, [
    isPublicView,
    country?.length,
    stateList?.length,
    region?.length,
    district?.length,
    city?.length,
    samaj?.length,
    surname?.length,
    dispatch,
  ]);

  React.useEffect(() => {
    getNativeList()
      .then((list) => setNativeList(list || []))
      .catch(() => {});
  }, []);

  const fullName = [
    data?.firstName,
    data?.fatherName,
    getLookupName(surname, data?.lastName, labels.lastName),
  ]
    .filter(Boolean)
    .join(" ");
  const locationLabel = [
    lookupValue(city, data?.city, labels.city),
    lookupValue(stateList, data?.state, labels.state),
  ]
    .filter((item) => item && item !== "-")
    .join(", ");
  const personalFields = [
    { label: "Name", value: data?.firstName },
    { label: "Father Name", value: data?.fatherName },
    { label: "Grand Father Name", value: data?.grandFatherName },
    {
      label: "Last Name",
      value: lookupValue(surname, data?.lastName, labels.lastName),
    },
    { label: "Mother Name", value: data?.motherName },
    { label: "Family ID", value: data?.familyId },
    { label: "Gender", value: titleCase(data?.gender) },
    {
      label: "Date of Birth",
      value: data?.dob ? moment(data.dob).format("DD/MM/YYYY hh:mm A") : "-",
    },
    { label: "Birth Place", value: data?.pob },
    {
      label: "Native",
      value: lookupValue(nativeList, data?.native, labels.native),
    },
    ...(String(data?.gender).toLowerCase() === "female"
      ? []
      : [{ label: "Email", value: data?.email }]),
    { label: "YSK No.", value: data?.YSKno },
    { label: "Marital Status", value: titleCase(data?.martialStatus) },
    { label: "Height (ft)", value: data?.height },
    { label: "Weight (kg)", value: data?.weight },
    { label: "Activity", value: titleCase(data?.activity) },
    { label: "Firm", value: data?.firm },
    { label: "Firm Address", value: data?.firmAddress },
    {
      label: "Country",
      value: lookupValue(country, data?.country, labels.country),
    },
    {
      label: "State",
      value: lookupValue(stateList, data?.state, labels.state),
    },
    {
      label: "Region",
      value: lookupValue(region, data?.region, labels.region),
    },
    {
      label: "District",
      value: lookupValue(district, data?.district, labels.district),
    },
    { label: "City", value: lookupValue(city, data?.city, labels.city) },
    {
      label: "Local Samaj",
      value: lookupValue(samaj, data?.localSamaj, labels.localSamaj),
    },
    { label: "Address", value: data?.address },
  ];
  const mamaFields = [
    { label: "Mama Name", value: data?.mamaInfo?.name },
    { label: "Mama Native", value: data?.mamaInfo?.native },
    { label: "Mama City", value: data?.mamaInfo?.city },
  ];
  const contactFields = [
    { label: "Contact Person Name", value: data?.contactInfo?.name },
    { label: "Contact Person Phone", value: data?.contactInfo?.phone },
    { label: "Relation", value: titleCase(data?.contactInfo?.relation) },
    ...(String(data?.gender).toLowerCase() === "female"
      ? []
      : [{ label: "Email", value: data?.email }]),
    { label: "Address", value: data?.address },
  ];
  const additionalFields = extraOtherFields(data?.other);
  const otherFields = [
    { label: "Highest Education", value: titleCase(data?.education) },
    { label: "Blood Group", value: data?.bloodGroup },
    ...(data?.handicap === true
      ? [
          { label: "Handicap", value: "Yes" },
          { label: "Handicap Details", value: data?.handicapDetails },
        ]
      : []),
  ];
  const shareId = getYuvaShareId(data?.id || data?._id || id);
  const shareUrl = `${window.location.origin}/yuva/${shareId}`;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/admin/yuvalist");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setNotification({ type: "success", message: "Profile link copied" });
    } catch (e) {
      setNotification({ type: "error", message: "Unable to copy link" });
    }
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = fullName ? `Yuva Details - ${fullName}` : "Yuva Details";
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
    window.print();
  };

  if (loadError) {
    return (
      <Box>
        <Header />
        <ContainerPage className="flex justify-center items-center py-20">
          <p className="text-xl font-semibold">{loadError}</p>
        </ContainerPage>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Header />
        <ContainerPage className="flex justify-center items-center py-20">
          <CircularProgress className="text-primary" />
        </ContainerPage>
      </Box>
    );
  }

  return (
    <Box>
      <YuvaPrintTemplate
        data={data}
        lists={{
          city,
          state: stateList,
          surname,
          country,
          region,
          district,
          samaj,
          nativeList,
        }}
      />
      <div className="print-hidden">
      <Header />
      <ContainerPage
        className={"flex-col justify-center flex items-start h-full"}
      >
        <div className="w-full flex justify-between items-center gap-2 mb-3">
          {isPublicView ? (
            <Button
              variant="outlined"
              startIcon={<HomeOutlinedIcon />}
              aria-label="Home"
              className="!border-[#572a2a] !text-[#572a2a] !min-w-10 !w-10 !h-10 !p-0 sm:!min-w-[64px] sm:!w-auto sm:!h-9 sm:!px-4 [&_.MuiButton-startIcon]:m-0 sm:[&_.MuiButton-startIcon]:mr-2"
              onClick={handleHome}
            >
              <span className="hidden sm:inline">Home</span>
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              aria-label="Back"
              className="!border-[#572a2a] !text-[#572a2a] !min-w-10 !w-10 !h-10 !p-0 sm:!min-w-[64px] sm:!w-auto sm:!h-9 sm:!px-4 [&_.MuiButton-startIcon]:m-0 sm:[&_.MuiButton-startIcon]:mr-2"
              onClick={handleBack}
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          <div className="flex gap-2 flex-wrap justify-end">
            {canEdit ? (
              <Button
                variant="outlined"
                startIcon={<ModeEditOutlineOutlinedIcon />}
                aria-label="Edit"
                className="!border-[#572a2a] !text-[#572a2a] !min-w-10 !w-10 !h-10 !p-0 sm:!min-w-[64px] sm:!w-auto sm:!h-9 sm:!px-4 [&_.MuiButton-startIcon]:m-0 sm:[&_.MuiButton-startIcon]:mr-2"
                onClick={() =>
                  navigate(`/admin/yuvalist/${data?.id}/edit`, {
                    state: { data },
                  })
                }
              >
                <span className="hidden sm:inline">Edit</span>
              </Button>
            ) : null}
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              aria-label="Share"
              className="!border-[#572a2a] !text-[#572a2a] !min-w-10 !w-10 !h-10 !p-0 sm:!min-w-[64px] sm:!w-auto sm:!h-9 sm:!px-4 [&_.MuiButton-startIcon]:m-0 sm:[&_.MuiButton-startIcon]:mr-2"
              onClick={handleShare}
            >
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              aria-label="Print"
              className="bg-primary text-white !min-w-10 !w-10 !h-10 !p-0 sm:!min-w-[64px] sm:!w-auto sm:!h-9 sm:!px-4 [&_.MuiButton-startIcon]:m-0 sm:[&_.MuiButton-startIcon]:mr-2"
              onClick={handlePrint}
            >
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <div
              className={
                "bg-white p-4 flex flex-col gap-4 justify-center items-center rounded-md shadow-md"
              }
            >
              <ImageButton
                focusRipple
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "150px",
                  border: "1px dashed #542b2b",
                  marginTop: "20px",
                }}
                onClick={() => setPhotoOpen(true)}
              >
                <ImageSrc
                  style={{
                    backgroundImage: `url(${photoUrl})`,
                  }}
                  className={"m-2"}
                />
                <ImageBackdrop className="MuiImageBackdrop-root" />
              </ImageButton>
              <div className={"w-full flex flex-col gap-2 px-2"}>
                <span className={"flex flex-row gap-2 items-start"}>
                  <IconButton size={"small"}>
                    <PersonOutlineOutlinedIcon />
                  </IconButton>
                  <span className="pt-2 break-words">{fullName || "-"}</span>
                </span>
                <span className={"flex flex-row gap-2 items-start"}>
                  <IconButton size={"small"}>
                    <PhoneOutlinedIcon />
                  </IconButton>
                  <span className="pt-2 break-words">
                    {[
                      data?.contactInfo?.name,
                      data?.contactInfo?.relation
                        ? `(${titleCase(data.contactInfo.relation)})`
                        : "",
                      data?.contactInfo?.phone,
                    ]
                      .filter(Boolean)
                      .join(" ") || "-"}
                  </span>
                </span>
                <span className={"flex flex-row gap-2 items-start"}>
                  <IconButton size={"small"}>
                    <LocationOnOutlinedIcon />
                  </IconButton>
                  <span className="pt-2 break-words">
                    {[data?.firm, locationLabel].filter(Boolean).join(", ") ||
                      "-"}
                  </span>
                </span>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <div
              className={
                "bg-white p-4 flex flex-col gap-4 justify-center items-start rounded-md shadow-md"
              }
            >
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="yuva details tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                {profileTabs?.map((item, index) => {
                  return (
                    <StyledTab
                      key={item.id}
                      label={item.title}
                      {...a11yProps(index)}
                    />
                  );
                })}
              </StyledTabs>
              <CustomTabPanel value={tabValue} index={0} className={"w-full"}>
                <DetailFields fields={personalFields} />
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1} className={"w-full"}>
                <DetailFields fields={mamaFields} />
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2} className={"w-full"}>
                <DetailFields fields={contactFields} />
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={3} className={"w-full"}>
                <DetailFields fields={otherFields} />
                {additionalFields.length ? (
                  <div className="mt-5 w-full">
                    <p className="text-lg font-bold text-[#572a2a] mb-3">
                      Additional Info
                    </p>
                    <div className="w-full flex flex-col gap-4">
                      {additionalFields.map((item, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={`${item.title}-${index}`}
                          className="w-full"
                        >
                          <Grid item xs={12} sm={6}>
                            <div className={"flex flex-col gap-0.5"}>
                              <span className={"text-sm font-semibold text-[#572a2a]"}>
                                Title
                              </span>
                              <span className={"text-base break-words text-gray-800"}>
                                {item.title}
                              </span>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <div className={"flex flex-col gap-0.5"}>
                              <span className={"text-sm font-semibold text-[#572a2a]"}>
                                Description
                              </span>
                              <span className={"text-base break-words text-gray-800"}>
                                {item.description}
                              </span>
                            </div>
                          </Grid>
                        </Grid>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CustomTabPanel>
            </div>
          </Grid>
        </Grid>
      </ContainerPage>
      </div>
      <Modal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        className="flex justify-center items-center"
        sx={{
          "& .MuiModal-backdrop": {
            backgroundColor: "rgba(0,0,0,0.92) !important",
          },
        }}
      >
        <Box className="outline-none relative w-screen h-screen flex items-center justify-center p-4">
          <IconButton
            onClick={() => setPhotoOpen(false)}
            className="!absolute top-4 right-4 !text-white"
          >
            <CloseIcon />
          </IconButton>
          <img
            src={photoUrl}
            alt={`${data?.firstName || "Yuva"} profile`}
            className="max-w-[96vw] max-h-[92vh] object-contain"
          />
        </Box>
      </Modal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
};
export default ProfilePage;
