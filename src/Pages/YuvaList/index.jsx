// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
// import React, { useState } from "react";
//
// import { Box } from "@mui/material";
// import Header from "../Common/header";
// import "react-pdf/dist/esm/Page/TextLayer.css";
//
// function Index() {
//   const [totalPages, setTotalPages] = useState(0);
//   const [page, setPage] = useState(1);
//
//   const pageChangeHandler = (action, count) => {
//     if (action === "prev") {
//       if (page - count >= 1) {
//         setPage((prev) => prev - count);
//       }
//     } else {
//       if (page + count <= totalPages) {
//         setPage((prev) => prev + count);
//       }
//     }
//   };
//
//   const buttonDisable = (action, count) => {
//     if (action === "prev") {
//       if (page - count < 1) {
//         return true;
//       }
//     } else {
//       if (page + count > totalPages) {
//         return true;
//       }
//     }
//   };
//
//   return (
//     <Box>
//       <Header backBtn={true} btnAction="/dashboard" />
//       <div className={"p-4 pb-0 justify-between flex items-center"}>
//         <p className={"text-lg sm:text-3xl font-bold"}>Yuvalist</p>
//       </div>
//       {/*<PDFViewer document={{ base64: pdf.data }} />*/}
//       <div className={"w-full flex items-center flex-col gap-4 sm:gap-6"}>
//         <Document
//           file={"/yuva.pdf"}
//           onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
//         >
//           <Page
//             pageNumber={page}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//             height={450}
//             style={{ width: "100%" }}
//           />
//         </Document>
//         <p className={"flex sm:hidden text-xl font-bold cursor-default"}>
//           {page} / {totalPages}
//         </p>
//         <Box className={"flex gap-1 sm:gap-4 justify-center items-center"}>
//           <button
//             className={`bg-[#572a2a] h-10 w-20 flex justify-center items-center text-white rounded-lg font-bold ${
//               buttonDisable("prev", 1) ? "cursor-not-allowed" : ""
//             }`}
//             disabled={buttonDisable("prev", 1)}
//             onClick={() => pageChangeHandler("prev", 1)}
//           ></button>
//           <button
//             className={`bg-[#572a2a] h-10 w-20 flex justify-center items-center text-white rounded-lg font-bold ${
//               buttonDisable("prev", 5) ? "cursor-not-allowed" : ""
//             }`}
//             disabled={buttonDisable("prev", 5)}
//             onClick={() => pageChangeHandler("prev", 5)}
//           ></button>
//           <p className={"hidden sm:flex text-xl font-bold cursor-default"}>
//             {page} / {totalPages}
//           </p>
//           <button
//             className={`bg-[#572a2a] h-10 w-20 flex justify-center items-center text-white rounded-lg font-bold ${
//               buttonDisable("next", 1) ? "cursor-not-allowed" : ""
//             }`}
//             disabled={buttonDisable("next", 1)}
//             onClick={() => pageChangeHandler("next", 1)}
//           ></button>
//           <button
//             className={`bg-[#572a2a] h-10 w-20 flex justify-center items-center text-white rounded-lg font-bold ${
//               buttonDisable("next", 5) ? "cursor-not-allowed" : ""
//             }`}
//             disabled={buttonDisable("next", 5)}
//             onClick={() => pageChangeHandler("next", 5)}
//           ></button>
//         </Box>
//       </div>
//     </Box>
//   );
// }
//
// export default Index;

import Header from "../../Component/Header";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  Grid,
  Modal,
  Paper,
  styled,
  Tab,
  Tooltip,
} from "@mui/material";
import CustomTable from "../../Component/Common/customTable";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "../../util/useAxios";
import { ImageBackdrop, ImageButton, ImageSrc } from "../../Component/constant";

const YuvaList = () => {
  const navigate = useNavigate();
  const [yuvaList, setYuvaList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getYuvaList = async () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/yuvaList/list`).then((res) => {
      const data = res.data?.map((item) => ({ ...item, id: item?._id }));
      setYuvaList(data);
    });
  };
  useEffect(() => {
    getYuvaList();
  }, []);
  const deleteAPI = async (id) => {
    // axios
    //     .get(`${process.env.REACT_APP_BASE_URL}/yuvaList/list/${id}`)
    //     .then((res) => {
    //     });
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/yuvaList/${id}`)
      .then((res) => {
        const data = res.data?.map((item) => ({ ...item, id: item?._id }));
        setYuvaList(data);
      });
  };

  const yuvaListColumn = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 90,
      headerClassName:
        "bg-[#572a2a] text-white items-center flex justify-center outline-none",
      cellClassName: "items-center flex justify-center outline-none",
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"w-full text-wrap px-2"}>
          <p className={"text-sm"}>
            {record.row.firstName} {record.row.middleName} {record.row.lastName}{" "}
          </p>
        </div>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-6 outline-none",
      filterable: false,
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 150,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      headerAlign: "center",
      cellClassName: "items-center flex p-0 justify-center outline-none",
      filterable: false,
      renderCell: (record) => (
        <p className={"w-full text-sm px-2"}>
          {moment(record.row.dob).format("DD/MM/YYYY hh:mm A")}
        </p>
      ),
    },
    {
      field: "firm",
      headerName: "Firm",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
    },
    {
      field: "native",
      headerName: "Native",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-2 outline-none",
      filterable: false,
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"View"}>
            <VisibilityIcon
              className={"text-primary cursor-pointer"}
              onClick={() => setUserData(record.row)}
            />
          </Tooltip>
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() =>
                navigate("/yuvalist/add", { state: { data: record?.row } })
              }
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => deleteAPI(record?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  // const toBase64 = file => new Promise((resolve, reject) => {
  //   if(!file) return reject(new Error("No file found."));
  //   const reader = new FileReader();
  //   const newFile=URL.createObjectURL(file)
  //   reader.readAsDataURL(newFile);
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = reject;
  // });
  const getProfileUrl = (file) => {
    if (file) {
      // return URL.createObjectURL(file)
      // await toBase64(file)
      // return URL.revokeObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = (result) => {
        console.log("result", result);
      };
      reader.readAsDataURL({ File: { ...file } });
    }
  };

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto"
        }
      >
        <div className={"p-4 pb-0 flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>Yuvalist</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => navigate("/yuvalist/add")}
          >
            Yuva
          </Button>
        </div>
        <CustomTable
          columns={yuvaListColumn}
          className={"mx-0 w-full"}
          data={yuvaList}
          name={"YuvaList"}
          pageSize={10}
          type={"pendingList"}
        />
      </div>
      {userData ? (
        <Modal
          open={Boolean(userData)}
          onClose={() => setUserData(null)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            "& .MuiModal-backdrop": {
              backdropFilter: " blur(2px) !important",
              background: "#878b9499 !important",
            },
          }}
          className="flex justify-center items-center"
        >
          <Paper
            elevation={10}
            className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none"
          >
            <Grid container>
              <Grid item xs={3} className={"flex justify-center items-center"}>
                <ImageButton
                  focusRipple
                  style={{
                    width: "110px",
                    borderRadius: "150px",
                    border: "1px dashed #542b2b",
                  }}
                  onClick={() =>
                    window.open(
                      userData?.profile?.url ||
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
              </Grid>
              {/*<input type="radio" id="age1" name="age" value="30" onChange={(e)=>console.log(e.target.value)} />*/}
              <Grid item xs={8} className={"px-2 flex flex-col justify-center"}>
                <div className={"text-base font-bold"}>
                  Name:{" "}
                  <span className={"font-normal"}>
                    {userData?.firstName} {userData?.lastName}{" "}
                  </span>
                </div>
                <div className={"text-base font-bold"}>
                  DOB:{" "}
                  <span className={"font-normal"}>
                    {moment(userData?.dob).format("DD/MM/YYYY hh:mm A")}
                  </span>
                </div>
                <div className={"text-base font-bold"}>
                  Family ID:{" "}
                  <span className={"font-normal"}>{userData?.familyId}</span>
                </div>
              </Grid>
              <Grid item xs={1} className={"flex justify-center"}>
                <CloseIcon
                  className={"text-primary cursor-pointer"}
                  onClick={() => setUserData(null)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box className={"my-4"}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        className={"text-primary"}
                        textColor="text-primary"
                        indicatorColor="inherit"
                        TabIndicatorProps={{
                          style: {
                            backgroundColor: "#542b2b",
                          },
                        }}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                      >
                        <Tab
                          label="Personal Info"
                          value="1"
                          className={`font-bold ${
                            value === "1" ? "text-primary" : "text-gray"
                          }`}
                        />
                        <Tab
                          label="Mama Info"
                          value="2"
                          className={`font-bold ${
                            value === "2" ? "text-primary" : "text-gray"
                          }`}
                        />
                        <Tab
                          label="Contact Info"
                          value="4"
                          className={`font-bold ${
                            value === "4" ? "text-primary" : "text-gray"
                          }`}
                        />
                        <Tab
                          label="Other Info"
                          value="3"
                          className={`font-bold ${
                            value === "3" ? "text-primary" : "text-gray"
                          }`}
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <Grid spacing={2} container>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Father Name:{" "}
                            <span className={"font-normal"}>
                              {userData?.middleName}
                            </span>
                          </div>
                          <div className={"text-base font-bold"}>
                            Height:{" "}
                            <span className={"font-normal"}>
                              {userData?.height}
                            </span>
                          </div>
                          {/*<div className={"text-base font-bold"}>*/}
                          {/*  Firm:{" "}*/}
                          {/*  <span className={"font-normal"}>*/}
                          {/*    Mahesh Wood Industries*/}
                          {/*  </span>*/}
                          {/*</div>*/}
                          <div className={"text-base font-bold"}>
                            City:{" "}
                            <span className={"font-normal"}>
                              {userData?.city}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Mother Name:{" "}
                            <span className={"font-normal"}>
                              {userData?.motherName}
                            </span>
                          </div>
                          <div className={"text-base font-bold"}>
                            Weight:{" "}
                            <span className={"font-normal"}>
                              {userData?.weight}
                            </span>
                          </div>
                          <div className={"text-base font-bold"}>
                            State:{" "}
                            <span className={"font-normal"}>
                              {userData?.state}
                            </span>
                          </div>
                          {/*<div className={"text-base font-bold"}>*/}
                          {/*  City:{" "}*/}
                          {/*  <span className={"font-normal"}>*/}
                          {/*    Bardoli*/}
                          {/*  </span>*/}
                          {/*</div>*/}
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Firm:{" "}
                            <span className={"font-normal"}>
                              {userData?.firm}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold ellipsis"}>
                            Firm Address:{" "}
                            <span className={"font-normal"}>
                              {userData?.firmAddress}
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <div className={"text-base font-bold"}>
                            Name:{" "}
                            <span className={"font-normal"}>
                              {userData?.mamaInfo?.name}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid spacing={1} container>
                            <Grid item xs={12}>
                              <div className={"text-base font-bold"}>
                                Address:-
                              </div>
                            </Grid>
                            <Grid item xs={6}>
                              <div className={"text-base font-bold"}>
                                Native:
                                <span className={"font-normal"}>
                                  {userData?.mamaInfo?.native}
                                </span>
                              </div>
                            </Grid>
                            <Grid item xs={6}>
                              <div className={"text-base font-bold"}>
                                City:{" "}
                                <span className={"font-normal"}>
                                  {userData?.mamaInfo?.city}
                                </span>
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="3">
                      <Grid spacing={2} container>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Education:{" "}
                            <span className={"font-normal"}>
                              {userData?.education}
                            </span>
                          </div>
                          {/*<div className={"text-base font-bold"}>*/}
                          {/*  Height:{" "}*/}
                          {/*  <span className={"font-normal"}>*/}
                          {/*    {userData?.height}*/}
                          {/*  </span>*/}
                          {/*</div>*/}
                        </Grid>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Blood Group:{" "}
                            <span className={"font-normal"}>
                              {userData?.bloodGroup}
                            </span>
                          </div>
                          {/*<div className={"text-base font-bold"}>*/}
                          {/*  Weight:{" "}*/}
                          {/*  <span className={"font-normal"}>*/}
                          {/*    {userData?.weight}*/}
                          {/*  </span>*/}
                          {/*</div>*/}
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="4">
                      <Grid spacing={2} container>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Name:{" "}
                            <span className={"font-normal"}>
                              {userData?.contactInfo?.name}
                            </span>
                          </div>
                          <div className={"text-base font-bold"}>
                            Relation:{" "}
                            <span className={"font-normal"}>
                              {userData?.contactInfo?.relation}
                            </span>
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={"text-base font-bold"}>
                            Number:{" "}
                            <span className={"font-normal"}>
                              {userData?.contactInfo?.phone}
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </TabContext>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      ) : null}
    </Box>
  );
};

export default YuvaList;
