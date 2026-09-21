import React, { useEffect, useState } from "react";
import ConfirmModal, { getDeleteDescription } from "./ConfirmModal";
import LinkedRecordsModal from "./LinkedRecordsModal";
import { getLinkedRecords } from "../../util/linkedApi";
import { masterNameText } from "../../util/bhasha";

export default function DeleteConfirmFlow({
  open,
  entity,
  ids = [],
  name,
  onClose,
  onConfirm,
}) {
  const [step, setStep] = useState("idle");
  const [groups, setGroups] = useState([]);

  const idKey = Array.isArray(ids) ? ids.join(",") : String(ids || "");
  const displayName = masterNameText(name) || name;

  useEffect(() => {
    if (!open) {
      setStep("idle");
      setGroups([]);
      return;
    }
    const list = Array.isArray(ids) ? ids.filter(Boolean) : [ids].filter(Boolean);
    if (!entity || !list.length) {
      setStep("confirm");
      return;
    }
    let cancelled = false;
    setStep("loading");
    getLinkedRecords(entity, list)
      .then((data) => {
        if (cancelled) return;
        const mapped = (data?.groups || []).filter((group) => group.total > 0);
        if (mapped.length) {
          setGroups(mapped);
          setStep("linked");
        } else {
          setStep("confirm");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStep("confirm");
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, entity, idKey]);

  const handleClose = () => {
    setStep("idle");
    setGroups([]);
    onClose?.();
  };

  return (
    <>
      <LinkedRecordsModal
        open={open && (step === "loading" || step === "linked")}
        name={displayName}
        groups={groups}
        loading={step === "loading"}
        onClose={handleClose}
        onOkay={() => setStep("confirm")}
      />
      <ConfirmModal
        open={open && step === "confirm"}
        title="Are you sure?"
        description={getDeleteDescription(displayName)}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={handleClose}
        onConfirm={onConfirm}
      />
    </>
  );
}
