import React from "react";
import Header from "../../../Component/Header";
import { CircularProgress, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <button
          className={
            "bg-[#572a2a] text-white p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
          }
          onClick={() => navigate("/pdf")}
        >
          PDF
        </button>
      </Container>
    </>
  );
}
