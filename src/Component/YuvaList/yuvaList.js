import React from "react";

import PDFViewer from "pdf-viewer-reactjs";
function YuvaList() {
  return (
    <PDFViewer
      document={{
        url: "https://pentasyllabic-exter.000webhostapp.com/yuva/PDF.pdf",
      }}
    />
  );
}

export default YuvaList;
