import {
  Box,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Typography,
  styled,
} from "@mui/material";
import Header from "../../Component/Header";
import React from "react";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useLocation } from "react-router-dom";
import { ImageBackdrop, ImageButton, ImageSrc } from "../../Component/constant";
import moment from "moment/moment";
import ContainerPage from "../../Component/Container";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
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
const ProfilePage = () => {
  const { state: data } = useLocation();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage
        className={"flex-col justify-center flex items-start h-full"}
      >
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
                onClick={() =>
                  window.open(
                    "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                    "_blank"
                  )
                }
              >
                <ImageSrc
                  style={{
                    backgroundImage:
                      // `url(${userData?.profile?.url})` ||
                      `url(https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg)`,
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
                  <IconButton size={"small"}>
                    <ModeEditOutlineOutlinedIcon />
                  </IconButton>
                </div>
                <div className={"flex flex-col gap-2 px-2"}>
                  <span className={"flex flex-row gap-2 items-center"}>
                    <IconButton size={"small"}>
                      <PersonOutlineOutlinedIcon />
                    </IconButton>
                    {data?.firstName + data?.middleName}
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
                      <span>{data.middleName}</span>
                      <span>{data.motherName}</span>
                      <span>{data.height}</span>
                      <span>{data.weight}</span>
                      <span>
                        {moment(data?.dob).format("DD/MM/YYYY hh:mm A")}
                      </span>
                      <span>{data.familyId}</span>
                      <span>{data.city}</span>
                      <span>{data.state}</span>
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
    </Box>
  );
};
export default ProfilePage;
