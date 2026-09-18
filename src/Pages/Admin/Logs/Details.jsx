import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import { Box } from "@mui/material";
import ContainerPage from "../../../Component/Container";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UseRedux } from "../../../Component/useRedux";
import { isAdmin } from "../../../util/util";
import { Card, PageHeader, Button as ActionButton } from "../../../Component/UI";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getActivityLog } from "../../../util/logsApi";
import { ActorId, EntityId, formatLogTime, LogSummary } from "./LogSummary";

const SNAPSHOT_SKIP = new Set([
  "password",
  "confirmPassword",
  "fcmToken",
  "__v",
  "_id",
]);

const labelize = (field) =>
  String(field || "")
    .replace(/[_.]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const displaySnapshotValue = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
};

const flattenSnapshot = (obj, prefix = "") => {
  if (obj == null || typeof obj !== "object" || Array.isArray(obj)) {
    return prefix ? [{ field: prefix, value: obj }] : [];
  }
  return Object.entries(obj).flatMap(([key, value]) => {
    if (SNAPSHOT_SKIP.has(key)) return [];
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      return flattenSnapshot(value, path);
    }
    return [{ field: path, value }];
  });
};

const changeValue = (change, keys) => {
  for (const key of keys) {
    if (change?.[key] !== undefined && change?.[key] !== null && change?.[key] !== "") {
      return change[key];
    }
  }
  return "—";
};

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mutedText">
        {label}
      </p>
      <div className="text-sm text-primary mt-0.5 break-words">{value || "—"}</div>
    </div>
  );
}

export default function LogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = UseRedux();
  const [log, setLog] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getActivityLog(id)
      .then(setLog)
      .catch(() => setMissing(true));
  }, [id]);

  if (!isAdmin(auth?.user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const changes = log?.changes || [];
  const snapshotRows = flattenSnapshot(log?.snapshot || {});

  return (
    <Box>
      <Header backBtn={true} btnAction="/admin/logs" />
      <ContainerPage className="flex-col justify-center flex items-start gap-3">
        <PageHeader
          className="w-full"
          title="Log details"
          description="Who performed the action and what changed."
          leading={
            <ActionButton
              type="button"
              variant="secondary"
              className="!min-w-[44px] !px-3"
              icon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate("/admin/logs")}
            >
              Back
            </ActionButton>
          }
        />
        {missing ? (
          <Card className="w-full">
            <p className="text-sm text-primary">This log was not found.</p>
          </Card>
        ) : (
          <>
            <Card className="w-full">
              <p className="text-sm leading-relaxed text-primary">
                <LogSummary log={log} />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6 pt-5 border-t border-line">
                <DetailItem label="Time" value={formatLogTime(log?.createdAt)} />
                <DetailItem
                  label="Action"
                  value={String(log?.action || "—").replace(/^\w/, (c) => c.toUpperCase())}
                />
                <DetailItem label="Actor" value={<ActorId log={log || {}} />} />
                <DetailItem
                  label="Actor role"
                  value={String(log?.actorRole || "—").replace(/_/g, " ")}
                />
                <DetailItem label="Record type" value={log?.entityType || "—"} />
                <DetailItem label="Record" value={<EntityId log={log || {}} />} />
              </div>
            </Card>
            <Card className="w-full">
              <h2 className="text-base font-semibold text-primary mb-4">Changed fields</h2>
              {changes.length ? (
                <div className="flex flex-col gap-3">
                  {changes.map((change, index) => {
                    const fieldName = change.label || labelize(change.field) || "Field";
                    const fromValue = displaySnapshotValue(
                      changeValue(change, ["from", "oldValue", "previous", "old"]),
                    );
                    const toValue = displaySnapshotValue(
                      changeValue(change, ["to", "newValue", "next", "new"]),
                    );
                    return (
                      <p
                        key={`${change.field || "change"}-${index}`}
                        className="text-sm text-primary break-words"
                      >
                        <span className="font-semibold">{fieldName}</span>
                        {" from "}
                        <span className="font-semibold">{fromValue}</span>
                        {" to "}
                        <span className="font-semibold">{toValue}</span>
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-mutedText">
                  No field-level changes were stored for this action.
                </p>
              )}
            </Card>
            <Card className="w-full">
              <h2 className="text-base font-semibold text-primary mb-4">Record details</h2>
              {snapshotRows.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {snapshotRows.map((row) => (
                    <DetailItem
                      key={row.field}
                      label={labelize(row.field)}
                      value={displaySnapshotValue(row.value)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-mutedText">No record snapshot is available.</p>
              )}
            </Card>
          </>
        )}
      </ContainerPage>
    </Box>
  );
}
