import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import yuvaPDF from "../../../Component/Common/yuva.pdf";
import Header from "../../../Component/Header";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import { getYuvaPDF, getCityList } from "../../../util/yuvaApi";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfPaginationBtn = ({ children, disabled, onClick }) => {
  return (
    <button
      className={`p-2 rounded-full ${
        disabled ? `bg-[#542b2b8a] cursor-not-allowed` : `bg-primary`
      } text-white`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function NewUser() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [city, setCity] = useState("");
  const [cityList, setCityList] = useState([]);
  const [cityListEn, setCityListEn] = useState([]);
  const [cityListGuj, setCityListGuj] = useState([]);
  const [pdf, setPdf] = useState();

  const dispatch = useDispatch();
  const getAPIData = async () => {
    dispatch(startLoading());
    try {
      const pdfData = await getYuvaPDF();
      setPdf(pdfData);
      const cityData = await getCityList();
      setCityList(cityData);
      setCityListEn(cityData.map((city) => city.label?.en));
      setCityListGuj(cityData.map((city) => city.label?.gu));
    } catch (error) {
      // Optionally handle error with notification
    } finally {
      setTimeout(() => dispatch(endLoading()), 2000);
    }
  };
  useEffect(() => {
    getAPIData();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevTwisePage = () => setPageNumber((prevPage) => prevPage - 2);
  const goToPrevPage = () => setPageNumber((prevPage) => prevPage - 1);
  const goToNextTwisePage = () => setPageNumber((prevPage) => prevPage + 2);
  const goToNextPage = () => setPageNumber((prevPage) => prevPage + 1);

  const handleCityChange = (event) => {
    setCity(event.target.value);
    cityList.forEach((city) => {
      if (
        city?.label?.en === event.target.value ||
        city?.label?.gu === event.target.value
      ) {
        setPageNumber((prevPage) => city?.pageStart);
      }
    });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <Header />
      <div>
        <div className={"flex justify-center p-4 relative z-[1]"}>
          <CustomAutoComplete
            label={"City"}
            list={cityListEn}
            value={city}
            onSelect={handleCityChange}
            className={"sm:w-84 w-96"}
            placeholder={"Select City"}
            name={"city"}
            xs={12}
            sm={6}
            md={4}
          />
        </div>
        <div className={"flex flex-col items-center"}>
          <Document file={yuvaPDF} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} className={"h-[630px]"} />
          </Document>
          <div
            className={
              "flex w-full max-w-[600px] justify-between p-4 items-center"
            }
          >
            <PdfPaginationBtn
              disabled={pageNumber <= 2}
              onClick={goToPrevTwisePage}
            >
              <KeyboardDoubleArrowLeftIcon />
            </PdfPaginationBtn>
            <PdfPaginationBtn
              disabled={pageNumber === 1}
              onClick={goToPrevPage}
            >
              <KeyboardArrowLeftIcon />
            </PdfPaginationBtn>
            <p className={"flex items-center text-primary font-bold "}>
              Page {pageNumber} of {numPages}
            </p>
            <PdfPaginationBtn
              disabled={pageNumber === numPages}
              onClick={goToNextPage}
            >
              <KeyboardArrowRightIcon />
            </PdfPaginationBtn>
            <PdfPaginationBtn
              disabled={pageNumber >= numPages - 1}
              onClick={goToNextTwisePage}
            >
              <KeyboardDoubleArrowRightIcon />
            </PdfPaginationBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
