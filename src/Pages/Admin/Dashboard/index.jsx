import React, { useEffect, useState } from "react";
import { Grid, Container } from "@mui/material";
import CustomCard from "../../../Component/Card";
import Header from "../../../Component/Header";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/useAxios";
import { useSelector } from "react-redux";

export default function Index() {
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingListOpen, setPendingListOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pendingListModalOpen = () => {
    setPendingListOpen(true);
  };

  const pendingListModalClose = () => {
    setPendingListOpen(false);
  };

  useEffect(() => {
    // axios.get(`${process.env.REACT_APP_BASE_URL}/yuva/list`).then((res) => {
    //   console.log("res =>", res);
    // });
  }, []);

  const sendOtpHandler = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/sendOtp`, {
        email: "patel.dhruvinpatel@gmail.com",
      })
      .then((res) => {
        console.log("REs - - - - - - >");
      })
      .catch((e) => console.log("e - - - - "));
  };
  const dashBoardList =
    user.role === "ADMIN"
      ? [
          {
            id: 1,
            title: "New Requests",
            href: "/admin/request",
          },
          {
            id: 2,
            title: "User List",
            href: "/admin/userlist",
          },
          {
            id: 3,
            title: "Yuva List",
            href: "admin/yuvalist",
          },
          {
            id: 4,
            title: "Country",
            href: "admin/country",
          },
          {
            id: 5,
            title: "State",
            href: "admin/state",
          },
          {
            id: 6,
            title: "Region",
            href: "/admin/region",
          },
          {
            id: 7,
            title: "District",
            href: "/admin/district",
          },
          {
            id: 8,
            title: "City",
            href: "/admin/city",
          },
          {
            id: 1,
            title: "Samaj",
            href: "/admin/samaj",
          },
        ]
      : [
          {
            id: 1,
            title: "New Requests",
            href: "/admin/request",
          },
          {
            id: 2,
            title: "User List",
            href: "/admin/userlist",
          },
          {
            id: 3,
            title: "Yuva List",
            href: "admin/yuvalist",
          },
        ];
  return (
    <div>
      <Header />
      <Container maxWidth="xl">
        <Grid container spacing={2} className="p-4">
          {dashBoardList?.map((item, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={`list-${index + item?.id}`}>
                <CustomCard
                  title={item?.title}
                  action={() => navigate(item?.href)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
