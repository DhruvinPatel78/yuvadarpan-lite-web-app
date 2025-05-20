import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Button, Card, Container, Grid, Avatar } from "@mui/material";
import axios from "../../../util/useAxios";
import { useSelector } from "react-redux";
import { toCamelCase } from "../../../util/util";
import moment from "moment";

const Home = () => {
  const { surname, city, region } = useSelector((state) => state.location);
  const [yuvaList, setYuvaList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getYuvaList = async () => {
    axios.get(`/yuvaList/list?page=${page}&limit=${20}`).then((res) => {
      setYuvaList(res?.data?.data);
      if (page !== res?.data?.totalPages) {
        setPage((prev) => prev + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    });
  };

  useEffect(() => {
    getYuvaList(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <Header />
      <Container maxWidth="xl" className={"p-4"}>
        {/*Desktop view*/}
        <Grid
          container
          spacing={2}
          className={
            "grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-2 p-4 sm:flex hidden"
          }
        >
          {yuvaList?.map((data) => {
            return (
              <Grid item className="flex justify-center items-center" key={data?.id}>
                <Card
                  className="flex flex-col justify-between items-center rounded-[50px] font-bold max-h-[calc(100vh - 428px)] w-[350px] cursor-pointer text-2xl hover:transition-all"
                  style={{ boxShadow: "0px 4px 35px 0px rgb(0 0 0 / 0.25)" }}
                  variant="outlined"
                  // onClick={action}
                    key={data?.id}
                >
                  <Card
                    className={
                      "flex justify-center items-center rounded-[50px] bg-primary w-full pt-6 pb-4"
                    }
                    variant="outlined"
                  >
                    <img
                      alt={data?.id + "yuva"}
                      src={data?.profile?.url}
                      className={"sm:size-44 size-40 rounded-full"}
                    />
                  </Card>

                  <div
                    className={"flex flex-col justify-between p-4 gap-1 w-full"}
                  >
                    <div
                      className={
                        "sm:text-lg md:text-xl lg:text-2xl text-xl text-primary text-center font-medium"
                      }
                    >
                      {toCamelCase(data?.firstName)}{" "}
                      {toCamelCase(
                        surname.find((i) => i?.id === data?.lastName)?.name
                      )}
                    </div>
                    <div
                      className={
                        "sm:text-base md:text-lg lg:text-xl text-lg font-medium text-center text-[#6D6666]"
                      }
                    >
                      {toCamelCase(city.find((i) => i?.id === data?.city)?.name)}{" "}
                      -{" "}
                      {toCamelCase(
                        region.find((i) => i?.id === data?.region)?.name
                      )}
                    </div>
                    <div
                      className={
                        "sm:text-base md:text-lg lg:text-xl text-lg font-medium text-center text-[#6D6666] pb-1"
                      }
                    >
                      {moment().diff(data?.dob, "years")} Years
                    </div>
                    <div className="py-1 flex items-center self-center w-11/12">
                      <div className="rounded-full h-[3px] w-[3px] bg-primary"></div>
                      <div className="flex-grow border-t border-primary border-1.5"></div>
                      <div className="rounded-full h-[3px] w-[3px] bg-primary"></div>
                    </div>
                  </div>

                  <div
                    className={"flex flex-col justify-between p-8 pt-0 w-full"}
                  >
                    <div
                      className={
                        "sm:text-sm md:text-base lg:text-lg text-base font-medium text-[#6D6666]"
                      }
                    >
                      Father - {toCamelCase(data?.fatherName)}{" "}
                      {toCamelCase(data?.grandFatherName)}
                    </div>
                    <div
                      className={
                        "sm:text-sm md:text-base lg:text-lg text-base font-medium text-[#6D6666]"
                      }
                    >
                      Mother - {toCamelCase(data?.motherName)}
                    </div>
                    <div
                      className={
                        "sm:text-sm md:text-base lg:text-lg text-base font-medium text-[#6D6666]"
                      }
                    >
                      Firm - {toCamelCase(data?.firm)}
                    </div>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/*Mobile view*/}
        <Grid
          container
          spacing={2}
          className={"grid grid-cols-1 gap-2 sm:hidden"}
        >
          {yuvaList?.map((data) => {
            return (
              <Grid
                item
                className="flex justify-center items-center max-h-[180px]"
                key={data?.id}
              >
                <Card
                  className="flex items-center p-2 rounded-[30px] font-bold max-h-[calc(100vh - 428px)] w-[400px] cursor-pointer text-2xl hover:transition-all gap-2"
                  style={{ boxShadow: "0px 4px 35px 0px rgb(0 0 0 / 0.25)" }}
                  variant="outlined"
                  // onClick={action}
                >
                  <Avatar
                    alt={data?.id + "yuva"}
                    src={data?.profile?.url}
                    className={"rounded-full"}
                    sx={{ width: 100, height: 100 }}
                  />
                  <div className={"w-full"}>
                    <p
                      className={
                        "text-lg text-primary font-semibold flex items-center gap-2"
                      }
                    >
                      {toCamelCase(data?.firstName)}{" "}
                      {toCamelCase(
                        surname.find((i) => i?.id === data?.lastName)?.name
                      )}
                    </p>
                    <p className={"text-sm text-[#6D6666] font-medium"}>
                      ({moment().diff(data?.dob, "years")}-Yr)
                    </p>
                    <div className={"text-sm font-medium"}>
                      {toCamelCase(city.find((i) => i?.id === data?.city)?.name)}{" "}
                      -{" "}
                      {toCamelCase(
                        region.find((i) => i?.id === data?.region)?.name
                      )}
                    </div>
                    <div className="py-1 flex items-center self-center w-full">
                      <div className="rounded-full h-[3px] w-[3px] bg-primary"></div>
                      <div className="flex-grow border-t border-primary border-1.5"></div>
                      <div className="rounded-full h-[3px] w-[3px] bg-primary"></div>
                    </div>
                    <div className={"flex flex-col w-full"}>
                      <div
                        className={
                          "flex text-sm items-center font-medium text-[#6D6666]"
                        }
                      >
                        <p className={"font-semibold text-primary"}>Father</p>
                        &nbsp;&#8211;&nbsp;
                        <span>
                          {toCamelCase(data?.fatherName)}{" "}
                          {toCamelCase(data?.grandFatherName)}
                        </span>
                      </div>
                      <div
                        className={"flex text-sm font-medium text-[#6D6666]"}
                      >
                        <p className={"font-semibold text-primary"}>Mother</p>
                        &nbsp;&#8211;&nbsp;
                        <span>{toCamelCase(data?.motherName)}</span>
                      </div>
                      <div
                        className={"flex text-sm font-medium text-[#6D6666]"}
                      >
                        <p className={"font-semibold text-primary"}>Firm</p>
                        &nbsp;&#8211;&nbsp;
                        <span>{toCamelCase(data?.firm)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <div className={"justify-center flex items-center mt-6"}>
          <Button
            variant="outlined"
            className={`text-primary border border-primary ${
              hasMore
                ? "cursor-pointer opacity-100"
                : "cursor-not-allowed opacity-50"
            }`}
            disabled={!hasMore}
            onClick={() => console.log("CLick")}
          >
            Load More
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
