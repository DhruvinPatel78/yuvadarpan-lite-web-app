import { Box, CircularProgress, Grid, IconButton, Modal } from "@mui/material";
import Header from "../../Component/Header";
import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
import { AppTabs, AppTab, Card, IconBtn } from "../../Component/UI";
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
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
  return String(value).replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
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
  <Grid container spacing={2.5} className={"w-full"}>
    {(fields || []).map((field, index) => (
      <Grid item xs={12} sm={6} key={`${field.label}-${index}`}>
        <div className={"flex flex-col gap-1 min-w-0"}>
          <span
            className={"text-[11px] font-medium tracking-wide text-gray-400"}
          >
            {field.label}
          </span>
          <span
            className={
              "text-[15px] sm:text-base font-semibold break-words text-primary"
            }
          >
            {hasValue(field.value) ? field.value : "-"}
          </span>
        </div>
      </Grid>
    ))}
  </Grid>
);

const SidebarRow = ({ icon, children }) => (
  <div className="flex items-start gap-3 min-w-0">
    <span className="w-8 h-8 rounded-lg bg-muted border border-line flex items-center justify-center shrink-0 text-primary">
      {icon}
    </span>
    <span className="text-sm text-primary break-words pt-1.5">{children}</span>
  </div>
);

const MobileSection = ({ title, children }) => (
  <section className="py-4 first:pt-0 last:pb-0">
    <h2 className="text-sm font-WorkSemiBold text-primary tracking-wide mb-3 pb-2 border-b border-line">
      {title}
    </h2>
    {children}
  </section>
);

const AdditionalInfoFields = ({ additionalFields }) =>
  additionalFields.length ? (
    <div className="mt-5 w-full">
      <p className="text-base font-bold text-primary mb-3 pt-2 border-t border-line">
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
              <div className={"flex flex-col gap-1 min-w-0"}>
                <span
                  className={
                    "text-[11px] font-medium tracking-wide text-gray-400"
                  }
                >
                  Title
                </span>
                <span
                  className={
                    "text-[15px] sm:text-base font-semibold break-words text-primary"
                  }
                >
                  {item.title}
                </span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={"flex flex-col gap-1 min-w-0"}>
                <span
                  className={
                    "text-[11px] font-medium tracking-wide text-gray-400"
                  }
                >
                  Description
                </span>
                <span
                  className={
                    "text-[15px] sm:text-base font-semibold break-words text-primary"
                  }
                >
                  {item.description}
                </span>
              </div>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  ) : null;

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
  const {
    city,
    state: stateList,
    surname,
    country,
    region,
    district,
    samaj,
    auth,
  } = UseRedux();
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
  const showEmail = String(data?.gender).toLowerCase() !== "female";
  const activityLabel = titleCase(data?.activity);
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
    { label: "YSK No.", value: data?.YSKno },
    { label: "Marital Status", value: titleCase(data?.martialStatus) },
    { label: "Height (ft)", value: data?.height },
    { label: "Weight (kg)", value: data?.weight },
    { label: "Activity", value: activityLabel },
    { label: "Firm", value: data?.firm },
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
    { label: "Firm Address", value: data?.firmAddress },
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
          className={"flex-col justify-center flex items-start h-full pb-6"}
        >
          <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-5">
            {isPublicView ? (
              <button
                type="button"
                aria-label="Home"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 min-h-[44px] md:min-h-0"
                onClick={handleHome}
              >
                <HomeOutlinedIcon fontSize="small" />
                <span>Back to home</span>
              </button>
            ) : (
              <button
                type="button"
                aria-label="Back"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 min-h-[44px] md:min-h-0"
                onClick={handleBack}
              >
                <ArrowBackIcon fontSize="small" />
                Back to directory
              </button>
            )}
            <div className="flex gap-2 flex-wrap justify-end shrink-0">
              {canEdit ? (
                <IconBtn
                  aria-label="Edit"
                  onClick={() =>
                    navigate(`/admin/yuvalist/${data?.id}/edit`, {
                      state: { data },
                    })
                  }
                >
                  <ModeEditOutlineOutlinedIcon />
                </IconBtn>
              ) : null}
              <IconBtn aria-label="Share" onClick={handleShare}>
                <ShareIcon />
              </IconBtn>
              <IconBtn aria-label="Print" onClick={handlePrint}>
                <PrintIcon />
              </IconBtn>
            </div>
          </div>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4} lg={4}>
              <Card className="md:sticky md:top-24">
                <div className="flex flex-col items-center w-full">
                  <button
                    type="button"
                    onClick={() => setPhotoOpen(true)}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-muted shrink-0 border border-line"
                  >
                    <img
                      src={photoUrl}
                      alt={fullName || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {data?.familyId ? (
                    <span className="mt-3 px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-primary text-center">
                      Family ID {data.familyId}
                    </span>
                  ) : null}
                  <h1 className="mt-3 text-lg sm:text-xl font-semibold text-primary text-center leading-snug break-words px-1">
                    {fullName || "-"}
                  </h1>
                  {activityLabel !== "-" ? (
                    <p className="mt-1 text-sm text-mutedText text-center">
                      {activityLabel}
                    </p>
                  ) : null}
                  <div className="w-full mt-4 pt-4 border-t border-line flex flex-col gap-3">
                    <SidebarRow icon={<PhoneOutlinedIcon fontSize="small" />}>
                      {[
                        data?.contactInfo?.name,
                        data?.contactInfo?.relation
                          ? `(${titleCase(data.contactInfo.relation)})`
                          : "",
                        data?.contactInfo?.phone,
                      ]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </SidebarRow>
                    {showEmail ? (
                      <SidebarRow icon={<EmailOutlinedIcon fontSize="small" />}>
                        {data?.email || "-"}
                      </SidebarRow>
                    ) : null}
                    <SidebarRow
                      icon={<LocationOnOutlinedIcon fontSize="small" />}
                    >
                      {locationLabel || "-"}
                    </SidebarRow>
                    <SidebarRow icon={<WorkOutlineIcon fontSize="small" />}>
                      {data?.firm || "-"}
                    </SidebarRow>
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <Card className="flex flex-col gap-3 sm:gap-4 items-start min-w-0">
                <div className="hidden md:flex md:flex-col md:gap-4 md:items-start w-full min-w-0">
                  <AppTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="yuva details tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                  >
                    {profileTabs?.map((item, index) => {
                      return (
                        <AppTab
                          key={item.id}
                          label={item.title}
                          {...a11yProps(index)}
                        />
                      );
                    })}
                  </AppTabs>
                  <CustomTabPanel
                    value={tabValue}
                    index={0}
                    className={"w-full"}
                  >
                    <DetailFields fields={personalFields} />
                  </CustomTabPanel>
                  <CustomTabPanel
                    value={tabValue}
                    index={1}
                    className={"w-full"}
                  >
                    <DetailFields fields={mamaFields} />
                  </CustomTabPanel>
                  <CustomTabPanel
                    value={tabValue}
                    index={2}
                    className={"w-full"}
                  >
                    <DetailFields fields={contactFields} />
                  </CustomTabPanel>
                  <CustomTabPanel
                    value={tabValue}
                    index={3}
                    className={"w-full"}
                  >
                    <DetailFields fields={otherFields} />
                    <AdditionalInfoFields additionalFields={additionalFields} />
                  </CustomTabPanel>
                </div>
                <div className="md:hidden w-full">
                  <MobileSection title="Personal Info">
                    <DetailFields fields={personalFields} />
                  </MobileSection>
                  <MobileSection title="Mama Info">
                    <DetailFields fields={mamaFields} />
                  </MobileSection>
                  <MobileSection title="Contact Info">
                    <DetailFields fields={contactFields} />
                  </MobileSection>
                  <MobileSection title="Other Info">
                    <DetailFields fields={otherFields} />
                    <AdditionalInfoFields additionalFields={additionalFields} />
                  </MobileSection>
                </div>
              </Card>
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
            className="!absolute top-4 right-4 !text-white !min-w-[44px] !min-h-[44px] md:!min-w-0 md:!min-h-0"
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
