import React from "react";
import { Grid } from "@mui/material";
import CustomCard from "../../../Component/Card";
import Header from "../../../Component/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContainerPage from "../../../Component/Container";

export default function Index() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
            id: 9,
            title: "Samaj",
            href: "/admin/samaj",
          },
          {
            id: 10,
            title: "Surname",
            href: "/admin/surname",
          },
          {
            id: 11,
            title: "Native",
            href: "/admin/native",
          },
          {
            id: 12,
            title: "Roles",
            href: "/admin/role",
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
      <ContainerPage>
        <Grid container spacing={2}>
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
      </ContainerPage>
    </div>
  );
}
