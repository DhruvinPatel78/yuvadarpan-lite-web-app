import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import { Container } from "@mui/material";
import moment from "moment";
import { Navigate, useNavigate } from "react-router-dom";
import { UseRedux } from "../../../Component/useRedux";
import ProfileCard from "../../../Component/Common/profileCard";
import { formatYuvaDob, isRegularUser, toCamelCase } from "../../../util/util";
import {
  getShortlistedYuvas,
  removeYuvaFromShortlist,
} from "../../../util/shortlistApi";
import { Button, PageHeader } from "../../../Component/UI";

const PAGE_SIZE = 12;

const Shortlisted = () => {
  const { surname, city, auth } = UseRedux();
  const navigate = useNavigate();
  const canShortlist = isRegularUser(auth?.user?.role);
  const [yuvaList, setYuvaList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [listPage, setListPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreLock = useRef(false);
  const loadMoreRef = useRef(null);

  const loadList = async ({ pageNum = 1, append = false } = {}) => {
    if (append) {
      if (loadingMoreLock.current || loadingMore || !hasMore) {
        return;
      }
      loadingMoreLock.current = true;
      setLoadingMore(true);
    }
    try {
      const data = await getShortlistedYuvas({
        page: pageNum,
        limit: PAGE_SIZE,
      });
      const rows = data?.data || [];
      setYuvaList((prev) => (append ? [...prev, ...rows] : rows));
      setListPage(pageNum);
      setHasMore(pageNum * PAGE_SIZE < (data?.total || 0));
    } catch (e) {
      if (!append) {
        setYuvaList([]);
        setHasMore(false);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
        loadingMoreLock.current = false;
      }
    }
  };

  useEffect(() => {
    if (!canShortlist) return;
    loadList({ pageNum: 1, append: false });
  }, [canShortlist]);

  const handleLoadMore = useCallback(() => {
    loadList({ pageNum: listPage + 1, append: true });
  }, [listPage, hasMore, loadingMore]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, yuvaList.length]);

  const handleRemove = async (yuva) => {
    if (!canShortlist) return;
    const yuvaId = String(yuva?.id || yuva?._id || "");
    if (!yuvaId) return;
    setYuvaList((prev) => prev.filter((item) => String(item.id) !== yuvaId));
    try {
      await removeYuvaFromShortlist(yuvaId);
    } catch (e) {
      loadList({ pageNum: 1, append: false });
    }
  };

  if (!canShortlist) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Header />
      <Container maxWidth="xl" className="p-3 sm:p-4 pb-6">
        <PageHeader
          title="Your Shortlisted"
          description="Yuva profiles you saved from the directory."
          actions={
            <Button variant="secondary" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          }
        />
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {yuvaList.map((data) => (
            <ProfileCard
              key={data?.id}
              imgSrc={data?.profile?.url}
              name={toCamelCase(data?.firstName)}
              location={toCamelCase(
                city.find((i) => i?.id === data?.city)?.name
              )}
              age={moment().diff(data?.dob, "years")}
              dob={formatYuvaDob(data?.dob)}
              father={`${toCamelCase(data?.fatherName)} ${toCamelCase(
                data?.grandFatherName
              )}`}
              mother={toCamelCase(data?.motherName)}
              firm={toCamelCase(data?.firm)}
              surname={toCamelCase(
                surname.find((i) => i?.id === data?.lastName)?.name
              )}
              shortlisted
              onToggleShortlist={() => handleRemove(data)}
              onClick={() =>
                navigate(`/admin/yuvalist/${data?.id}`, {
                  state: { ...data },
                })
              }
            />
          ))}
        </div>
        {yuvaList.length === 0 ? (
          <p className="mt-12 text-center text-sm text-mutedText">
            No shortlisted yuva yet.
            <span className="block mt-1">
              Open the directory and tap the bookmark to save a profile here.
            </span>
          </p>
        ) : hasMore ? (
          <div ref={loadMoreRef} className="h-10 w-full" />
        ) : null}
      </Container>
    </div>
  );
};

export default Shortlisted;
