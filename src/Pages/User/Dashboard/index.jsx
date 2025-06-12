import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Button, Container, Grid } from "@mui/material";
import axios from "../../../util/useAxios";
import { toCamelCase } from "../../../util/util";
import moment from "moment";
import { UseRedux } from "../../../Component/useRedux";
import ProfileCard from "../../../Component/Common/profileCard";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";

const Home = () => {
  const { surname, city } = UseRedux();
  const [yuvaList, setYuvaList] = useState([]);
  const [dataVisibleCount, setDataVisibleCount] = useState(5);
  const [dataIncrement] = useState(5);
  const [visibleItems, setVisibleItems] = useState([]);
  const [noMorePost, setNoMorePost] = useState(false);
  const dispatch = useDispatch();

  const getYuvaList = async () => {
    dispatch(startLoading());
    try {
      await axios.get(`/yuvaList/get-all-list`).then((res) => {
        setYuvaList(res?.data);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        dispatch(endLoading());
      }, 2000);
    }
  };

  useEffect(() => {
    getYuvaList();
  }, []);

  useEffect(() => {
    setVisibleItems(yuvaList?.filter((item, index) => index <= 5));
  }, [yuvaList]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    let tempCount = dataVisibleCount + dataIncrement;
    if (tempCount >= yuvaList.length) {
      setNoMorePost(true);
      tempCount = yuvaList.length;
    } else {
      setNoMorePost(false);
    }
    setDataVisibleCount(tempCount);
    setVisibleItems(yuvaList.filter((data, index) => index < tempCount));
  };

  return (
    <div>
      <Header />
      <Container maxWidth="xl" className={"p-4"}>
        <Grid container spacing={2}>
          {visibleItems?.map((data) => (
            <Grid item key={data?.id} xs={12} sm={6} md={4} lg={3}>
              <ProfileCard
                imgSrc={data?.profile?.url}
                name={toCamelCase(data?.firstName)}
                location={toCamelCase(
                  city.find((i) => i?.id === data?.city)?.name
                )}
                age={moment().diff(data?.dob, "years")}
                father={`${toCamelCase(data?.fatherName)} ${toCamelCase(
                  data?.grandFatherName
                )}`}
                mother={toCamelCase(data?.motherName)}
                firm={toCamelCase(data?.firm)}
                surname={toCamelCase(
                  surname.find((i) => i?.id === data?.lastName)?.name
                )}
              />
            </Grid>
          ))}
        </Grid>
        {noMorePost ? null : (
          <div className={"justify-center flex items-center mt-6"}>
            <Button
              variant="contained"
              className={`text-white bg-primary ${
                !noMorePost
                  ? "cursor-pointer opacity-100"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={(e) => handleLoadMore(e)}
            >
              Load More
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
