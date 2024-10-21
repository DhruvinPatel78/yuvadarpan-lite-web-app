import React from "react";
import Header from "../../../Component/Header";
import { Card, Container, Grid } from "@mui/material";

const row = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
export default function Index() {
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
          {row.map((data) => {
            return (
              <Grid item className="flex justify-center items-center">
                <Card
                  className="flex flex-col justify-between items-center rounded-[50px] font-bold max-h-[calc(100vh - 428px)] w-[350px] cursor-pointer text-2xl hover:transition-all"
                  style={{ boxShadow: "0px 4px 35px 0px rgb(0 0 0 / 0.25)" }}
                  variant="outlined"
                  // onClick={action}
                >
                  <Card
                    className={
                      "flex justify-center items-center rounded-[50px] bg-primary w-full pt-6 pb-4"
                    }
                    variant="outlined"
                  >
                    <img
                      alt={"/profile1.png"}
                      src={"/profile1.png"}
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
                      Dhruvin Rangani
                    </div>
                    <div
                      className={
                        "sm:text-base md:text-lg lg:text-xl text-lg font-medium text-center text-[#6D6666]"
                      }
                    >
                      Bardoli - DGR
                    </div>
                    <div
                      className={
                        "sm:text-base md:text-lg lg:text-xl text-lg font-medium text-center text-[#6D6666] pb-1"
                      }
                    >
                      24 Years
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
                      Fathre - Maheshbhai Kanjibhai
                    </div>
                    <div
                      className={
                        "sm:text-sm md:text-base lg:text-lg text-base font-medium text-[#6D6666]"
                      }
                    >
                      Mother - Pushpaben
                    </div>
                    <div
                      className={
                        "sm:text-sm md:text-base lg:text-lg text-base font-medium text-[#6D6666]"
                      }
                    >
                      Firm - Mahesh Wood Industries
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
          className={"grid grid-cols-1 gap-2 sm:hidden flex"}
        >
          {row.map((data) => {
            return (
              <Grid item className="flex justify-center items-center">
                <Card
                  className="flex items-center rounded-[30px] font-bold max-h-[calc(100vh - 428px)] w-[400px] cursor-pointer text-2xl hover:transition-all gap-2"
                  style={{ boxShadow: "0px 4px 35px 0px rgb(0 0 0 / 0.25)" }}
                  variant="outlined"
                  // onClick={action}
                >
                  <div className={"pl-2"}>
                    <img
                      alt={"/profile1.png"}
                      src={"/profile1.png"}
                      height={50}
                      width={"150px"}
                    />
                  </div>
                  <div className={"py-2 w-full"}>
                    <div
                      className={
                        "text-lg text-primary font-semibold flex items-center gap-2"
                      }
                    >
                      <label>Dhruvin Rangani </label>
                      <span className={"text-sm text-[#6D6666] font-medium"}>
                        ( 24-Yr )
                      </span>
                    </div>
                    <div className={"text-sm font-medium"}>Bardoli - DGR</div>
                    <div className="py-1 flex items-center self-center w-11/12">
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
                        <span>Maheshbhai Kanjibhai </span>
                      </div>
                      <div
                        className={"flex text-sm font-medium text-[#6D6666]"}
                      >
                        <p className={"font-semibold text-primary"}>Mother</p>
                        &nbsp;&#8211;&nbsp;
                        <span>Pushpaben</span>
                      </div>
                      <div
                        className={"flex text-sm font-medium text-[#6D6666]"}
                      >
                        <p className={"font-semibold text-primary"}>Firm</p>
                        &nbsp;&#8211;&nbsp;
                        <span>Mahesh Wood Industries</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
