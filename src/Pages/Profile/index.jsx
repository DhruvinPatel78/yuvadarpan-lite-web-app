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
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
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
        <Box sx={{ p: 3 }}>
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
const ProfilePage = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto h-full"
        }
      >
        <div className={"relative w-full"}>
          <div className={"max-h-[360px] h-full overflow-hidden z-[1]"}>
            <img
              src={"https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg"}
              alt={""}
              className={"w-full mt-[-20%]"}
            />
          </div>
          <div
            className={
              "absolute left-[30px] bottom-0 right-0 z-[2] h-[180px] flex flex-row gap-4 items-center"
            }
          >
            <div
              className={
                "w-[180px] h-[180px] rounded-[3px] mt-[28px] overflow-hidden shadow-[0px_0px_0px_5px_#fff]"
              }
            >
              <img
                src={"https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg"}
                alt={""}
                className={"w-full h-full object-cover"}
              />
            </div>
            <div className={"w-full flex flex-row justify-between"}>
              <span className={"text-white text-3xl font-semibold"}>
                XYS DEUA
              </span>
              <IconButton>
                <CameraAltIcon className={"text-white"} />
              </IconButton>
            </div>
          </div>
        </div>
        <div className={"w-full h-full"}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4} className={"mt-8"}>
              <div
                className={"w-full bg-white p-4 shadow-md flex flex-col gap-4"}
              >
                <div
                  className={"flex flex-row gap-4 justify-between items-center"}
                >
                  <div className={"flex flex-row gap-2 items-center"}>
                    <IconButton>
                      <PublicOutlinedIcon />
                    </IconButton>
                    <span className={"font-semibold"}>Contact Info</span>
                  </div>
                  <IconButton>
                    <ModeEditOutlineOutlinedIcon />
                  </IconButton>
                </div>
                <div className={"flex flex-col gap-2 px-2"}>
                  <span className={"flex flex-row gap-2"}>
                    <PersonOutlineOutlinedIcon />
                    NAME
                  </span>
                  <span className={"flex flex-row gap-2"}>
                    <PhoneOutlinedIcon />
                    123456789
                  </span>
                  <span className={"flex flex-row gap-2"}>
                    <LocationOnOutlinedIcon />
                    India
                  </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={8} className={"flex flex-col gap-4"}>
              <div className={"w-full bg-white px-4 pt-4 shadow-md"}>
                <StyledTabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <StyledTab label="Item One" {...a11yProps(0)} />
                  <StyledTab label="Item Two" {...a11yProps(1)} />
                  <StyledTab label="Item Three" {...a11yProps(2)} />
                </StyledTabs>
              </div>
              <div className={"w-full bg-white shadow-md"}>
                <CustomTabPanel value={tabValue} index={0}>
                  Item One
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                  Item Two
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                  Item Three
                </CustomTabPanel>
              </div>
            </Grid>
          </Grid>
        </div>
        {/*<Grid container spacing={2} className={"p-8"}>*/}
        {/*  <Grid item xs={4}>*/}
        {/*    <ImageButton*/}
        {/*      focusRipple*/}
        {/*      style={{*/}
        {/*        width: "400px",*/}
        {/*        height: "400px",*/}
        {/*        borderRadius: "1rem",*/}
        {/*        border: "1px dashed #542b2b",*/}
        {/*        display: "flex",*/}
        {/*        justifyContent: "center",*/}
        {/*        alignItems: "center",*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <ImageSrc*/}
        {/*        style={{*/}
        {/*          backgroundImage: `url(https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg)`,*/}
        {/*        }}*/}
        {/*        className={"m-2 w-[380px] h-[380px] rounded-[16px]"}*/}
        {/*      />*/}
        {/*      <ImageBackdrop className="MuiImageBackdrop-root rounded-[16px] w-[398px]" />*/}
        {/*    </ImageButton>*/}
        {/*  </Grid>*/}
        {/*  <Grid item xs={8}>*/}
        {/*    <div className={"flex flex-col gap-4"}>*/}
        {/*      <div className={"flex flex-col gap-2"}>*/}
        {/*        <span className={"text-[20px] font-bold"}>*/}
        {/*          Personal Information*/}
        {/*        </span>*/}
        {/*        <Grid container spacing={2}>*/}
        {/*          <Grid item xs={6}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Name: <span className={"font-normal"}>BBT</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              DOB:{" "}*/}
        {/*              <span className={"font-normal"}>*/}
        {/*                {moment().format("DD/MM/YYYY hh:mm A")}*/}
        {/*              </span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              City: <span className={"font-normal"}>LML</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Firm: <span className={"font-normal"}>CRVV</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Height: <span className={"font-normal"}>5.6</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*          <Grid item xs={6}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Family ID: <span className={"font-normal"}>123456</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Mother Name: <span className={"font-normal"}>MCT</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              State: <span className={"font-normal"}>CML</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Firm Address: <span className={"font-normal"}>CRVV</span>*/}
        {/*            </div>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Weight: <span className={"font-normal"}>56 kg</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*        </Grid>*/}
        {/*      </div>*/}
        {/*      <div className={"flex flex-col gap-2"}>*/}
        {/*        <span className={"text-[20px] font-bold"}>*/}
        {/*          Mama Information*/}
        {/*        </span>*/}
        {/*        <Grid container spacing={2}>*/}
        {/*          <Grid item xs={4}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Name: <span className={"font-normal"}>BBT</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*          <Grid item xs={4}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Native: <span className={"font-normal"}>BBT</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*          <Grid item xs={4}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              City: <span className={"font-normal"}>BBT</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*        </Grid>*/}
        {/*      </div>*/}
        {/*      <div className={"flex flex-col gap-2"}>*/}
        {/*        <span className={"text-[20px] font-bold"}>*/}
        {/*          Contact Information*/}
        {/*        </span>*/}
        {/*        <Grid container spacing={2}>*/}
        {/*          <Grid item xs={4}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Name: <span className={"font-normal"}>BBT</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*          <Grid item xs={4}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Phone Number:{" "}*/}
        {/*              <span className={"font-normal"}>123456789</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*          <Grid item xs={4}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Relation: <span className={"font-normal"}>DGH</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*        </Grid>*/}
        {/*      </div>*/}
        {/*      <div className={"flex flex-col gap-2"}>*/}
        {/*        <span className={"text-[20px] font-bold"}>*/}
        {/*          Other Information*/}
        {/*        </span>*/}
        {/*        <Grid container spacing={2}>*/}
        {/*          <Grid item xs={6}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Education: <span className={"font-normal"}>GGG</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*          <Grid item xs={6}>*/}
        {/*            <div className={"text-base font-bold"}>*/}
        {/*              Blood Group: <span className={"font-normal"}>O +</span>*/}
        {/*            </div>*/}
        {/*          </Grid>*/}
        {/*        </Grid>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}
      </div>
    </Box>
  );
};
export default ProfilePage;
