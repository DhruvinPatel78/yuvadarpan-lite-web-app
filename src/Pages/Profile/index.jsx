import { Box, Button, CircularProgress, Grid, IconButton, Modal, Tabs, Tab, styled } from "@mui/material";
import Header from "../../Component/Header";
import React from "react";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ImageBackdrop, ImageButton, ImageSrc } from "../../Component/constant";
import moment from "moment/moment";
import ContainerPage from "../../Component/Container";
import { UseRedux } from "../../Component/useRedux";
import CustomTabPanel from "./CustomTabPanel";
import YuvaPrintTemplate, { getLookupName } from "./PrintTemplates";
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
  { id: 3, title: "Other Info" },
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
  const { city, state: stateList, surname, country, region, district, samaj } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const dispatch = useDispatch();
  const photoUrl = data?.profile?.url || PLACEHOLDER_PHOTO;
  const labels = data?.labels || {};
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
    if (isPublicView) return;
    getNativeList()
      .then((list) => setNativeList(list || []))
      .catch(() => {});
  }, [isPublicView]);

  const fullName = [
    data?.firstName,
    data?.fatherName,
    getLookupName(surname, data?.lastName, labels.lastName),
  ]
    .filter(Boolean)
    .join(" ");
  const shareUrl = `${window.location.origin}/yuva/${getYuvaShareId(
    data?.id || id
  )}`;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(isPublicView ? "/" : "/admin/yuvalist");
  };

  const copyShareLink = async () => {
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

  const handleShare = async () => {
    const mobileShare =
      typeof navigator.share === "function" &&
      /iPhone|iPad|Android/i.test(navigator.userAgent);
    try {
      if (mobileShare) {
        await navigator.share({
          title: fullName || "Yuva Profile",
          url: shareUrl,
        });
        return;
      }
      await copyShareLink();
    } catch (e) {
      if (e?.name === "AbortError") return;
      await copyShareLink();
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
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            className="!border-[#572a2a] !text-[#572a2a]"
            onClick={handleBack}
          >
            Back
          </Button>
          <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            className="!border-[#572a2a] !text-[#572a2a]"
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            className="bg-primary text-white"
            onClick={handlePrint}
          >
            Print
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
              <div className={"w-full flex flex-col gap-4"}>
                <div
                  className={"flex flex-row gap-4 justify-between items-center"}
                >
                  <div className={"flex flex-row gap-2 items-center"}>
                    <IconButton size={"small"}>
                      <PublicOutlinedIcon />
                    </IconButton>
                    <span className={"font-semibold"}>Personal Info</span>
                  </div>
                  {isPublicView ? null : (
                  <IconButton size={"small"}>
                    <ModeEditOutlineOutlinedIcon />
                  </IconButton>
                  )}
                </div>
                <div className={"flex flex-col gap-2 px-2"}>
                  <span className={"flex flex-row gap-2 items-center"}>
                    <IconButton size={"small"}>
                      <PersonOutlineOutlinedIcon />
                    </IconButton>
                    {data?.firstName + data?.fatherName}
                  </span>
                  <span className={"flex flex-row gap-2 items-center"}>
                    <IconButton size={"small"}>
                      <PhoneOutlinedIcon />
                    </IconButton>
                    {data?.contactInfo?.phone}
                  </span>
                  <span className={"flex flex-row gap-2 items-center"}>
                    <IconButton size={"small"}>
                      <LocationOnOutlinedIcon />
                    </IconButton>
                    {data?.contactInfo?.relation}
                  </span>
                </div>
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
                aria-label="basic tabs example"
              >
                {profileTabs?.map((item, index) => {
                  return <StyledTab label={item.title} {...a11yProps(index)} />;
                })}
              </StyledTabs>
              <CustomTabPanel value={tabValue} index={0} className={"w-full"}>
                <Grid container spacing={2} className={"w-full"}>
                  <Grid item xs={4} className={"w-full"}>
                    <div className={"flex flex-col gap-2"}>
                      <span className={"font-semibold"}>Name:</span>
                      <span className={"font-semibold"}>Father Name:</span>
                      <span className={"font-semibold"}>Mother Name:</span>
                      <span className={"font-semibold"}>Height:</span>
                      <span className={"font-semibold"}>Weight:</span>
                      <span className={"font-semibold"}>DOB:</span>
                      <span className={"font-semibold"}>Family ID:</span>
                      <span className={"font-semibold"}>City:</span>
                      <span className={"font-semibold"}>State:</span>
                      <span className={"font-semibold"}>Firm:</span>
                      <span className={"font-semibold"}>Firm Address:</span>
                    </div>
                  </Grid>
                  <Grid item xs={8} className={"w-full"}>
                    <div className={"flex flex-col gap-2"}>
                      <span>{data.firstName}</span>
                      <span>{data.fatherName}</span>
                      <span>{data.motherName}</span>
                      <span>{data.height}</span>
                      <span>{data.weight}</span>
                      <span>
                        {moment(data?.dob).format("DD/MM/YYYY hh:mm A")}
                      </span>
                      <span>{data.familyId}</span>
                      <span>{getLookupName(city, data?.city, labels.city)}</span>
                      <span>{getLookupName(stateList, data?.state, labels.state)}</span>
                      <span>{data.firm}</span>
                      <span>{data.firmAddress}</span>
                    </div>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1} className={"w-full"}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <div className={"flex flex-col gap-2"}>
                      <span className={"font-semibold"}>Name:</span>
                      <span className={"font-semibold"}>Native:</span>
                      <span className={"font-semibold"}>City:</span>
                    </div>
                    {/*<div className={"text-base font-semibold"}>*/}
                    {/*  Name:{" "}*/}
                    {/*  <span className={"font-normal"}>*/}
                    {/*  {data?.mamaInfo?.name}*/}
                    {/*</span>*/}
                    {/*</div>*/}
                  </Grid>
                  <Grid item xs={8}>
                    <div className={"flex flex-col gap-2"}>
                      <span>{data?.mamaInfo?.name}</span>
                      <span> {data?.mamaInfo?.native}</span>
                      <span> {data?.mamaInfo?.city}</span>
                    </div>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2} className={"w-full"}>
                <Grid spacing={2} container>
                  <Grid item xs={4}>
                    <div className={"flex flex-col gap-2"}>
                      <span className={"font-semibold"}>Education:</span>
                      <span className={"font-semibold"}>Blood Group:</span>
                    </div>
                  </Grid>
                  <Grid item xs={8}>
                    <div className={"flex flex-col gap-2"}>
                      <span>{data?.education}</span>
                      <span>{data?.bloodGroup}</span>
                    </div>
                  </Grid>
                </Grid>
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
