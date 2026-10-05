import React, { useEffect, useRef, useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { FormModal, Button } from "../../../Component/UI";
import { exportYuvaList } from "../../../util/yuvaAdminApi";

const FORMATS = [
  { id: "csv", label: "CSV" },
  { id: "pdf", label: "PDF" },
];

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "gu", label: "ગુજરાતી" },
];

const readExportError = async (error) => {
  if (error?.code === "ERR_CANCELED") {
    return "";
  }
  const data = error?.response?.data;
  if (data instanceof Blob) {
    try {
      const json = JSON.parse(await data.text());
      return json.message || "Could not export the list.";
    } catch (e) {
      return "Could not export the list.";
    }
  }
  return error?.response?.data?.message || "Could not export the list.";
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const filenameFrom = (disposition, format) => {
  const match = /filename="?([^";]+)"?/i.exec(disposition || "");
  return match?.[1] || `yuva-list.${format}`;
};

function ChoiceGroup({ label, value, options, onChange }) {
  return (
    <div>
      <p className="text-xs font-WorkSemiBold text-primary mb-1.5">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`h-11 rounded-lg border text-sm font-WorkSemiBold transition-colors ${
                selected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-primary border-line hover:border-primary hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ExportYuvaModal({ open, onClose }) {
  const [format, setFormat] = useState("csv");
  const [exportLanguage, setExportLanguage] = useState("gu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setFormat("csv");
    setExportLanguage("gu");
    setError("");
    setLoading(false);
  }, [open]);

  const handleClose = () => {
    abortRef.current?.abort();
    onClose();
  };

  const handleExport = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    try {
      const response = await exportYuvaList(
        { format, language: exportLanguage },
        { signal: controller.signal }
      );
      downloadBlob(
        response.data,
        filenameFrom(response.headers?.["content-disposition"], format)
      );
      onClose();
    } catch (exportError) {
      const message = await readExportError(exportError);
      if (message) {
        setError(message);
      }
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  };

  return (
    <FormModal open={open} onClose={handleClose} title="Export Yuva List" maxWidth="480px">
      <p className="text-sm text-mutedText mb-4">
        Download the directory as CSV or PDF. Address is not included.
      </p>
      <div className="flex flex-col gap-4">
        <ChoiceGroup label="Format" value={format} options={FORMATS} onChange={setFormat} />
        <div>
          <p className="text-xs font-WorkSemiBold text-primary mb-1.5">Language</p>
          <div className="flex flex-col gap-2">
            {LANGUAGES.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 h-11 px-3 rounded-lg border border-line bg-white text-sm text-primary cursor-pointer"
              >
                <input
                  type="radio"
                  name="yuva-export-language"
                  value={option.id}
                  checked={exportLanguage === option.id}
                  onChange={() => setExportLanguage(option.id)}
                  className="h-4 w-4 accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <div className="flex flex-col-reverse md:flex-row md:justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={handleClose} className="max-md:w-full">
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            loading={loading}
            icon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
            className="max-md:w-full"
          >
            Export
          </Button>
        </div>
      </div>
    </FormModal>
  );
}
