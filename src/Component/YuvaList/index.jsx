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
