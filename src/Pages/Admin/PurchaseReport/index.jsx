import React, { useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import { Box, MenuItem, TextField } from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import ContainerPage from "../../../Component/Container";
import { Navigate, useNavigate } from "react-router-dom";
import { UseRedux } from "../../../Component/useRedux";
import { isAdmin } from "../../../util/util";
import { MasterFilterBar, PageHeader } from "../../../Component/UI";
import { getPurchaseReport } from "../../../util/paymentApi";
import moment from "moment";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CREATED", label: "Created" },
];

const selectSx = {
  minWidth: 140,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    minHeight: 44,
  },
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY hh:mm A") : String(value);
};

const statusLabel = (status) => {
  const value = String(status || "").toUpperCase();
  if (!value) return "—";
  return value.charAt(0) + value.slice(1).toLowerCase();
};

export default function PurchaseReport() {
  const { auth } = UseRedux();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [report, setReport] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("COMPLETED");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const skipSearchEffect = useRef(true);
  const filterCount =
    Number(Boolean(search.trim())) +
    Number(Boolean(status)) +
    Number(Boolean(from)) +
    Number(Boolean(to));

  const handleReportList = async () => {
    try {
      const data = await getPurchaseReport({
        page: page + 1,
        limit: rowsPerPage,
        search: search.trim() || undefined,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setReport(data);
    } catch (e) {
      setReport({ data: [], total: 0, summary: { completedCount: 0, completedAmountInr: 0 } });
    }
  };

  useEffect(() => {
    handleReportList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, status, from, to]);

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      if (page === 0) {
        handleReportList();
      } else {
        setPage(0);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const columns = [
    {
      field: "purchasedAt",
      headerName: "Date & time",
      minWidth: 170,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) =>
        formatDateTime(record?.row?.purchasedAt || record?.row?.createdAt),
    },
    {
      field: "userName",
      headerName: "User",
      flex: 1,
      minWidth: 180,
      headerClassName: "bg-primary text-white outline-none align-left",
      cellClassName: "items-center flex outline-none align-left",
      filterable: false,
      renderCell: (record) => {
        const row = record?.row;
        const name = row?.userName || "—";
        const userId = row?.userId;
        return (
          <div className="text-sm leading-snug py-1 w-full text-left">
            {userId ? (
              <button
                type="button"
                className="font-semibold text-primary underline underline-offset-2 text-left"
                onClick={() => navigate(`/admin/userlist/${userId}`)}
              >
                {name}
              </button>
            ) : (
              <div className="font-semibold text-primary">{name}</div>
            )}
            <div className="text-mutedText text-xs">
              {row?.userEmail || "—"}
            </div>
          </div>
        );
      },
    },
    {
      field: "userMobile",
      headerName: "Mobile",
      minWidth: 120,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => record?.row?.userMobile || "—",
    },
    {
      field: "familyId",
      headerName: "Family ID",
      minWidth: 110,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
    },
    {
      field: "amountInr",
      headerName: "Amount",
      minWidth: 90,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => `₹${record?.row?.amountInr ?? "—"}`,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 110,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => statusLabel(record?.row?.status),
    },
    {
      field: "merchantOrderId",
      headerName: "Order ID",
      minWidth: 180,
      headerClassName: "bg-primary text-white outline-none align-left",
      cellClassName: "items-center flex outline-none align-left",
      filterable: false,
      renderCell: (record) => (
        <span className="text-xs break-all">{record?.row?.merchantOrderId || "—"}</span>
      ),
    },
  ];

  if (!isAdmin(auth?.user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const summary = report?.summary || {};

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className="flex-col justify-center flex items-start gap-3">
        <PageHeader
          className="w-full"
          title="Purchase report"
          description="Family ID access purchases with member details and payment time."
        />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-xs text-mutedText mb-1">Completed purchases</p>
            <p className="text-2xl font-semibold text-primary">
              {summary.completedCount || 0}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-xs text-mutedText mb-1">Completed amount</p>
            <p className="text-2xl font-semibold text-primary">
              ₹{summary.completedAmountInr || 0}
            </p>
          </div>
        </div>
        <MasterFilterBar
          searchPlaceholder="Search name, email, mobile, Family ID, order ID"
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          filterCount={filterCount}
          onFilterClick={() => setIsFilterOpen((open) => !open)}
          isFilterOpen={isFilterOpen}
          extraFilters={
            <div className="flex flex-wrap gap-2 w-full">
              <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(e) => {
                  setPage(0);
                  setStatus(e.target.value);
                }}
                sx={selectSx}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value || "all-status"} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                size="small"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={from}
                onChange={(e) => {
                  setPage(0);
                  setFrom(e.target.value);
                }}
                sx={selectSx}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={to}
                onChange={(e) => {
                  setPage(0);
                  setTo(e.target.value);
                }}
                sx={selectSx}
              />
            </div>
          }
        />
        <div className="hidden md:block w-full min-w-0">
          <CustomTable
            columns={columns}
            data={report}
            pageSize={rowsPerPage}
            setPageSize={setRowsPerPage}
            className="mx-0 w-full"
            page={page}
            setPage={setPage}
            checkboxSelection={false}
          />
        </div>
        <MasterMobileCards
          rows={report?.data || []}
          emptyText="No purchases"
          canSelect={false}
          showActive={false}
          getTitle={(row) => row.userName || row.userEmail || "Purchase"}
          getDetails={(row) => [
            formatDateTime(row.purchasedAt || row.createdAt),
            `Family ID ${row.familyId || "—"} · ₹${row.amountInr ?? "—"}`,
            `${statusLabel(row.status)} · ${row.userMobile || row.userEmail || "—"}`,
          ]}
          onView={(row) => {
            if (row?.userId) navigate(`/admin/userlist/${row.userId}`);
          }}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={report?.total || 0}
        />
      </ContainerPage>
    </Box>
  );
}
