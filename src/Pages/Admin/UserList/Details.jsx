import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box } from "@mui/material";
import ContainerPage from "../../../Component/Container";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { UseRedux } from "../../../Component/useRedux";
import { Card, PageHeader } from "../../../Component/UI";
import LoadableImage from "../../../Component/Common/LoadableImage";
import { getUserInfo } from "../../../util/userApi";
import {
  getAllCountryData,
  getAllRegionData,
  getAllSamajData,
  getAllSurnameData,
} from "../../../util/getAPICall";
import { useDispatch } from "react-redux";

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mutedText">
        {label}
      </p>
      <p className="text-sm text-primary mt-0.5 break-words">{value || "-"}</p>
    </div>
  );
}

const lookupName = (list, id) =>
  list?.find(
    (item) =>
      String(item?.id) === String(id) ||
      String(item?._id) === String(id) ||
      String(item?.value) === String(id),
  )?.name || id || "-";

const formatRole = (role) =>
  String(role || "-")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatUserDate = (value) => {
  if (!value) return "-";
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY hh:mm A") : String(value);
};

export default function UserDetails() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const snapshot = location.state && !location.state.backTo ? location.state : null;
  const [user, setUser] = useState(snapshot || null);
  const [missing, setMissing] = useState(false);
  const { surname, region, samaj, country } = UseRedux();

  useEffect(() => {
    if (!surname?.length) dispatch(getAllSurnameData);
    if (!region?.length) dispatch(getAllRegionData);
    if (!samaj?.length) dispatch(getAllSamajData);
    if (!country?.length) dispatch(getAllCountryData);
  }, [surname?.length, region?.length, samaj?.length, country?.length, dispatch]);

  useEffect(() => {
    if (!id) return;
    getUserInfo(id)
      .then((data) => {
        setUser(data);
        setMissing(false);
      })
      .catch(() => {
        if (!snapshot) setMissing(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Box>
      <Header backBtn={true} btnAction="/admin/userlist" />
      <ContainerPage className="flex-col justify-center flex items-start gap-3">
        <PageHeader className="w-full" title="User details" />
        {missing ? (
          <Card className="w-full">
            <p className="text-sm text-primary">This user was not found or has been deleted.</p>
          </Card>
        ) : (
          <Card className="w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <LoadableImage
                src=""
                alt=""
                className="w-24 h-24 rounded-full pointer-events-none"
              />
              <div className="text-center sm:text-left min-w-0">
                <h2 className="text-lg font-semibold text-primary leading-snug break-words">
                  {[user?.firstName, user?.middleName].filter(Boolean).join(" ")}{" "}
                  {lookupName(surname, user?.lastName)}
                </h2>
                <p className="text-sm text-mutedText mt-1">{formatRole(user?.role)}</p>
                <span className="inline-block mt-2 text-[11px] font-semibold tracking-wide bg-muted text-primary px-2.5 py-1 rounded-full">
                  Family ID {user?.familyId || "-"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6 pt-5 border-t border-line">
              <DetailItem
                label="Date of birth"
                value={
                  user?.dob && moment(user.dob).isValid()
                    ? moment(user.dob).format("DD/MM/YYYY")
                    : "-"
                }
              />
              <DetailItem label="Email" value={user?.email} />
              <DetailItem label="Mobile" value={user?.mobile} />
              <DetailItem label="Gender" value={user?.gender} />
              <DetailItem label="Language" value={user?.language} />
              <DetailItem label="Region" value={lookupName(region, user?.region)} />
              <DetailItem label="Local samaj" value={lookupName(samaj, user?.localSamaj)} />
              <DetailItem label="Country" value={lookupName(country, user?.country)} />
              <DetailItem label="Allowed" value={user?.allowed ? "Yes" : "No"} />
              <DetailItem label="Active" value={user?.active ? "Yes" : "No"} />
              <DetailItem label="Created at" value={formatUserDate(user?.createdAt)} />
              <DetailItem label="Updated at" value={formatUserDate(user?.updatedAt)} />
            </div>
          </Card>
        )}
      </ContainerPage>
    </Box>
  );
}
