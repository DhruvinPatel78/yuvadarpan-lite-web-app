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
import { Box, Tooltip } from "@mui/material";
import CustomTable from "../../Component/Common/customTable";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

const YuvaList = () => {
  const [yuvaList, setYuvaList] = useState([]);

  useEffect(() => {
    setYuvaList([
      {
        id: 1,
        firstName: "ABC",
        middleName: "XYZ",
        lastName: "ZZZZZ",
        dob: moment(),
        gender: "M",
        firm: "Mahesh Wood",
        city: "Bardoli",
        native: "Rampar Sarva",
      },
    ]);
  }, []);

  const yuvaListColumn = [
    {
      field: "id",
      headerName: "Family Id",
      width: 90,
      headerClassName:
        "bg-[#572a2a] text-white items-center flex justify-center",
      cellClassName: "items-center flex justify-center",
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex",
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
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-6",
      filterable: false,
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 150,
      headerClassName: "bg-[#572a2a] text-white",
      headerAlign: "center",
      cellClassName: "items-center flex p-0 justify-center",
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
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-2",
      filterable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-2",
      filterable: false,
    },
    {
      field: "native",
      headerName: "Native",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-2",
      filterable: false,
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"View"}>
            <VisibilityIcon className={"text-primary"} />
          </Tooltip>
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary"}
              // onClick={() => userInfoModalOpen(record.row)}
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary"}
              // onClick={() => userInfoModalOpen(record.row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto"
        }
      >
        <p className={"text-3xl font-bold"}>Yuvalist</p>
        <CustomTable
          columns={yuvaListColumn}
          className={"mx-0 w-full"}
          data={yuvaList}
          name={"YuvaList"}
          pageSize={10}
          type={"pendingList"}
        />
      </div>
    </Box>
  );
};

export default YuvaList;
