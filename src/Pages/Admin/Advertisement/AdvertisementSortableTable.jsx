import React, { useRef, useState } from "react";
import { Checkbox, TablePagination, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import { formatDisplayOn } from "../../../util/advertisementApi";

const moveItem = (list, fromIndex, toIndex) => {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

export default function AdvertisementSortableTable({
  rows = [],
  total = 0,
  page = 0,
  rowsPerPage = 10,
  setPage,
  setRowsPerPage,
  selectedIds = [],
  onSelectionChange,
  onActiveChange,
  onEdit,
  onDelete,
  onReorder,
  reordering = false,
}) {
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const allSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
      return;
    }
    onSelectionChange?.(rows.map((row) => row.id));
  };

  const toggleOne = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((item) => item !== id));
      return;
    }
    onSelectionChange?.([...selectedIds, id]);
  };

  const handleDrop = async (toIndex) => {
    const fromIndex = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragOverIndex(null);
    if (fromIndex == null || fromIndex === toIndex) {
      return;
    }
    const nextRows = moveItem(rows, fromIndex, toIndex);
    await onReorder?.(nextRows, fromIndex, toIndex);
  };

  return (
    <div className="hidden md:block w-full min-w-0 bg-white rounded-xl border border-line overflow-hidden shadow-card">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="w-12 px-2 py-3 text-left font-semibold text-sm">
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={
                    selectedIds.length > 0 && selectedIds.length < rows.length
                  }
                  onChange={toggleAll}
                  sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                />
              </th>
              <th className="w-14 px-2 py-3 text-center font-semibold text-sm">
                #
              </th>
              <th className="px-3 py-3 text-left font-semibold text-sm">
                Advertisement Name
              </th>
              <th className="px-3 py-3 text-left font-semibold text-sm w-[100px]">
                Image
              </th>
              <th className="px-3 py-3 text-left font-semibold text-sm">
                Website Link
              </th>
              <th className="px-3 py-3 text-left font-semibold text-sm">
                Display On
              </th>
              <th className="px-3 py-3 text-center font-semibold text-sm w-[90px]">
                Active
              </th>
              <th className="px-3 py-3 text-center font-semibold text-sm w-[100px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-mutedText text-sm"
                >
                  No advertisements
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const isDragging = dragIndexRef.current === index;
                const isOver = dragOverIndex === index;
                return (
                  <tr
                    key={row.id}
                    draggable={!reordering}
                    onDragStart={(event) => {
                      dragIndexRef.current = index;
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(row.id));
                      setDragOverIndex(index);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      if (dragOverIndex !== index) {
                        setDragOverIndex(index);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === index) {
                        setDragOverIndex(null);
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDrop(index);
                    }}
                    onDragEnd={() => {
                      dragIndexRef.current = null;
                      setDragOverIndex(null);
                    }}
                    className={`border-b border-line transition-colors ${
                      isOver ? "bg-[#f4ebe4]" : "bg-white hover:bg-[#faf7f4]"
                    } ${isDragging ? "opacity-60" : ""} ${
                      reordering ? "cursor-wait" : "cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <td className="px-2 py-2.5">
                      <Checkbox
                        size="small"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleOne(row.id)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center justify-center gap-1 text-primary">
                        <Tooltip title="Drag to change priority">
                          <DragIndicatorIcon
                            className="text-primary cursor-grab"
                            sx={{ fontSize: 20 }}
                          />
                        </Tooltip>
                        <span className="text-sm font-medium w-5 text-center">
                          {row.priority ?? index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-primary font-medium">
                      {row.name || "-"}
                    </td>
                    <td className="px-3 py-2.5">
                      {row?.image?.url ? (
                        <img
                          src={row.image.url}
                          alt={row.name || "ad"}
                          className="h-10 w-16 object-cover rounded"
                          draggable={false}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-sm">
                      {row.websiteLink ? (
                        <a
                          href={row.websiteLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline truncate max-w-[220px] inline-block"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {row.websiteLink}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-primary">
                      {formatDisplayOn(row.displayOn)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <CustomSwitch
                        checked={row.active}
                        onClick={(event) => {
                          event?.stopPropagation?.();
                          onActiveChange?.(row, !row.active);
                        }}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-3 justify-center items-center">
                        <Tooltip title="Edit">
                          <ModeEditIcon
                            className="text-primary cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              onEdit?.(row);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <DeleteIcon
                            className="text-primary cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDelete?.(row);
                            }}
                          />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_event, nextPage) => setPage?.(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage?.(parseInt(event.target.value, 10) || 10);
          setPage?.(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
}
