import React, { useEffect, useRef, useState } from "react";
import Header from "../../../Component/Header";
import { Box, MenuItem, TextField, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomTable from "../../../Component/Common/customTable";
import MasterMobileCards from "../../../Component/Common/MasterMobileCards";
import ContainerPage from "../../../Component/Container";
import { Navigate, useNavigate } from "react-router-dom";
import { UseRedux } from "../../../Component/useRedux";
import { isAdmin } from "../../../util/util";
import { MasterFilterBar, PageHeader, Button as ActionButton } from "../../../Component/UI";
import { clearActivityLogs, getActivityLogs } from "../../../util/logsApi";
import ConfirmModal from "../../../Component/Common/ConfirmModal";
import { formatLogTime, LogSummary, recordName } from "./LogSummary";

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "create", label: "Added" },
  { value: "update", label: "Updated" },
  { value: "delete", label: "Deleted" },
  { value: "approve", label: "Approved" },
  { value: "reject", label: "Rejected" },
];

const ENTITY_OPTIONS = [
  { value: "", label: "All records" },
  { value: "user", label: "User" },
  { value: "yuva", label: "Yuva" },
  { value: "samaj", label: "Samaj" },
  { value: "city", label: "City" },
  { value: "district", label: "District" },
  { value: "region", label: "Region" },
  { value: "state", label: "State" },
  { value: "country", label: "Country" },
];

const selectSx = {
  minWidth: 140,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    minHeight: 44,
  },
};

export default function Logs() {
  const { auth } = UseRedux();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [logs, setLogs] = useState(null);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [clearOpen, setClearOpen] = useState(false);
  const skipSearchEffect = useRef(true);
  const filterCount = Number(Boolean(search.trim())) + Number(Boolean(action)) + Number(Boolean(entityType));

  const handleLogList = async () => {
    try {
      const data = await getActivityLogs({
        page: page + 1,
        limit: rowsPerPage,
        search: search.trim() || undefined,
        action: action || undefined,
        entityType: entityType || undefined,
      });
      setLogs(data);
    } catch (e) {
      setLogs({ data: [], total: 0 });
    }
  };

  const handleClearLogs = async () => {
    await clearActivityLogs();
    setClearOpen(false);
    setPage(0);
    setLogs({ data: [], total: 0, page: 1, totalPages: 0 });
    await handleLogList();
  };

  useEffect(() => {
    handleLogList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, action, entityType]);

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      if (page === 0) {
        handleLogList();
      } else {
        setPage(0);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const columns = [
    {
      field: "createdAt",
      headerName: "Time",
      minWidth: 170,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => formatLogTime(record?.row?.createdAt),
    },
    {
      field: "summary",
      headerName: "Activity",
      flex: 1,
      minWidth: 320,
      headerClassName: "bg-primary text-white outline-none align-left",
      cellClassName: "items-center flex outline-none align-left",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className="text-sm leading-snug py-1 w-full text-left">
          <LogSummary log={record?.row} />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 110,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      renderCell: (record) => String(record?.row?.action || "").replace(/^\w/, (c) => c.toUpperCase()),
    },
    {
      field: "entityLabel",
      headerName: "Record",
      minWidth: 180,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "items-center flex outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <button
          type="button"
          className="font-semibold text-primary underline underline-offset-2"
          onClick={() => navigate(`/admin/logs/${record?.row?.id}`)}
        >
          View
        </button>
      ),
    },
    {
      field: "actionView",
      headerName: "View",
      width: 80,
      headerClassName: "bg-primary text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      filterable: false,
      renderCell: (record) => (
        <Tooltip title="View details">
          <VisibilityIcon
            className="text-primary cursor-pointer"
            onClick={() => navigate(`/admin/logs/${record?.row?.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  if (!isAdmin(auth?.user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className="flex-col justify-center flex items-start gap-3">
        <PageHeader
          className="w-full"
          title="Logs"
          description="Manager and admin actions across users, yuva, and locations."
          actions={
            <ActionButton
              variant="danger"
              className="max-md:w-full"
              disabled={!logs?.total}
              onClick={() => setClearOpen(true)}
            >
              Clear logs
            </ActionButton>
          }
        />
        <MasterFilterBar
          searchPlaceholder="Search actor, record, or activity"
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
                value={action}
                onChange={(e) => {
                  setPage(0);
                  setAction(e.target.value);
                }}
                sx={selectSx}
              >
                {ACTION_OPTIONS.map((option) => (
                  <MenuItem key={option.value || "all-actions"} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                value={entityType}
                onChange={(e) => {
                  setPage(0);
                  setEntityType(e.target.value);
                }}
                sx={selectSx}
              >
                {ENTITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value || "all-entities"} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          }
        />
        <div className="hidden md:block w-full min-w-0">
          <CustomTable
            columns={columns}
            data={logs}
            pageSize={rowsPerPage}
            setPageSize={setRowsPerPage}
            className="mx-0 w-full"
            page={page}
            setPage={setPage}
            checkboxSelection={false}
          />
        </div>
        <MasterMobileCards
          rows={logs?.data || []}
          emptyText="No logs"
          canSelect={false}
          showActive={false}
          getTitle={(row) => formatLogTime(row.createdAt)}
          getDetails={(row) => [
            `${row.actorName || "Staff"}`,
            `${String(row.action || "").replace(/^\w/, (c) => c.toUpperCase())} ${row.entityType || ""}`.trim(),
            recordName(row),
          ]}
          onView={(row) => navigate(`/admin/logs/${row.id}`)}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={logs?.total || 0}
        />
      </ContainerPage>
      <ConfirmModal
        open={clearOpen}
        title="Clear all logs?"
        description="This will permanently delete every log. This action cannot be undone."
        confirmText="Clear logs"
        cancelText="Cancel"
        onClose={() => setClearOpen(false)}
        onConfirm={handleClearLogs}
      />
    </Box>
  );
}
