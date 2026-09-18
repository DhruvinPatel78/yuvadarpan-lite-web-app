import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

export const ENTITY_PATHS = {
  user: (id) => `/admin/userlist/${id}`,
  yuva: (id) => `/admin/yuvalist/${id}`,
  country: (id) => `/admin/country/${id}`,
  state: (id) => `/admin/state/${id}`,
  region: (id) => `/admin/region/${id}`,
  district: (id) => `/admin/district/${id}`,
  city: (id) => `/admin/city/${id}`,
};

export const entityNavState = (log) => {
  if (!log?.snapshot) return undefined;
  if (["country", "state", "region", "district", "city"].includes(log.entityType)) {
    return { ...log.snapshot, backTo: "/admin/logs" };
  }
  return log.snapshot;
};

export const formatLogTime = (value) => {
  if (!value) return "—";
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY hh:mm A") : String(value);
};

const IdLink = ({ to, state, children }) => {
  if (!to) {
    return <span className="font-semibold break-all">{children}</span>;
  }
  return (
    <Link
      to={to}
      state={state}
      className="font-semibold text-primary underline underline-offset-2 break-all"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </Link>
  );
};

export const withoutMiddleName = (name, middleName) => {
  const text = String(name || "").trim();
  if (!text) return "";
  const parts = text.split(/\s+/);
  if (parts.length < 3) return text;
  const middle = String(middleName || "").trim().toLowerCase();
  return parts
    .filter((part, index) => {
      if (index === 0 || index === parts.length - 1) return true;
      if (middle && part.toLowerCase() === middle) return false;
      return part.length > 1;
    })
    .join(" ");
};

export function ActorId({ log }) {
  const name = withoutMiddleName(log?.actorName) || log?.actorId;
  if (!name) return "—";
  return (
    <IdLink to={log.actorId ? ENTITY_PATHS.user(log.actorId) : null}>
      {name}
    </IdLink>
  );
}

export const recordName = (log) => {
  if (log?.entityLabel) {
    return withoutMiddleName(log.entityLabel, log?.snapshot?.middleName);
  }
  const snap = log?.snapshot || {};
  const person = [snap.firstName, snap.fatherName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return person || snap.name || snap.label || log?.entityId || "—";
};

export function EntityId({ log, children }) {
  if (!log?.entityId && !log?.entityLabel) return "—";
  const path = ENTITY_PATHS[log.entityType];
  return (
    <IdLink to={path && log.entityId ? path(log.entityId) : null} state={entityNavState(log)}>
      {children || recordName(log)}
    </IdLink>
  );
}

export function LogSummary({ log }) {
  if (!log) return "—";
  const when = formatLogTime(log.createdAt);
  const actor = <ActorId log={log} />;
  const entity = <EntityId log={log} />;
  if (log.action === "approve") {
    return (
      <>
        {actor} approved {entity} request.
      </>
    );
  }
  if (log.action === "reject") {
    return (
      <>
        {actor} rejected {entity} request.
      </>
    );
  }
  if (log.action === "create") {
    if (log.entityType === "samaj") {
      return (
        <>
          {actor} added new {entity} samaj.
        </>
      );
    }
    if (["user", "yuva"].includes(log.entityType)) {
      return (
        <>
          {actor} added new {entity}.
        </>
      );
    }
    return (
      <>
        {actor} added new {entity} {log.entityType}.
      </>
    );
  }
  if (log.action === "delete") {
    return (
      <>
        {actor} deleted {entity} at {when}.
      </>
    );
  }
  return (
    <>
      {actor} updated {entity} at {when}.
    </>
  );
}

