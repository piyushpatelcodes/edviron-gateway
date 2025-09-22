import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";
import {toast, ToastContainer} from "react-toastify"
import { formatDate } from "../utils/formatDate";

function RecentHistoryTable({ transactions }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [statusFilter, setStatusFilter] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  

  // Collapsibles
  const [statusCollapsed, setStatusCollapsed] = useState(false);
  const [schoolCollapsed, setSchoolCollapsed] = useState(true);

  // For autocomplete
  const [suggestions, setSuggestions] = useState([]);

  // On mount, parse URL params
  useEffect(() => {
    const sp = Object.fromEntries([...searchParams]);
    if (sp.status) setStatusFilter(sp.status.split(","));
    if (sp.school) setSchoolFilter(sp.school.split(","));
    if (sp.search) setSearchQuery(sp.search);
    if (sp.sortField) setSortField(sp.sortField);
    if (sp.sortOrder) setSortOrder(sp.sortOrder);
    if (sp.dateFrom) setDateFrom(sp.dateFrom);
    if (sp.dateTo) setDateTo(sp.dateTo);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (statusFilter.length > 0) params.status = statusFilter.join(",");
    if (schoolFilter.length > 0) params.school = schoolFilter.join(",");
    if (searchQuery) params.search = searchQuery;
    if (sortField) params.sortField = sortField;
    if (sortOrder) params.sortOrder = sortOrder;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    setSearchParams(params, { replace: true });
  }, [
    statusFilter,
    schoolFilter,
    searchQuery,
    sortField,
    sortOrder,
    dateFrom,
    dateTo,
    setSearchParams,
  ]);

  // Autocomplete suggestions
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = transactions.filter(
      (t) =>
        t.student_name.toLowerCase().includes(q) ||
      String(t.student_id).toLowerCase().includes(q) ||
      t.school_name.toLowerCase().includes(q) ||
      String(t.school_id).toLowerCase().includes(q) ||
        t.student_email.toLowerCase().includes(q) ||
        t.gateway.toLowerCase().includes(q) ||
        t.order_amount == q ||
        String(t.custom_order_id).toLowerCase().includes(q) 
    );
    setSuggestions(matches.slice(0, 10)); 
  }, [searchQuery, transactions]);

  const filtered = useMemo(() => {
    let data = [...transactions];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (inv) =>
          inv.student_name.toLowerCase().includes(q) ||
          inv.school_name.toLowerCase().includes(q) ||
          inv.student_email.toLowerCase().includes(q) ||
          String(inv.custom_order_id).toLowerCase().includes(q) || 
           String(inv.school_id).toLowerCase().includes(q) ||
           String(inv.gateway).toLowerCase().includes(q) ||
           String(inv.order_amount).toLowerCase().includes(q) ||
  String(inv.student_id).toLowerCase().includes(q) 
      );
    }
    if (statusFilter.length > 0) {
      data = data.filter((inv) => statusFilter.includes(inv.status));
    }
    if (schoolFilter.length > 0) {
      data = data.filter((inv) => schoolFilter.includes(inv.school_id));
    }
    if (dateFrom) {
      const df = new Date(dateFrom);
      data = data.filter((inv) => new Date(inv.payment_time) >= df);
    }
    if (dateTo) {
      const dt = new Date(dateTo);
      data = data.filter((inv) => new Date(inv.payment_time) <= dt);
    }
    if (sortField) {
      data.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (!aVal || !bVal) return 0;
        if (typeof aVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    return data;
  }, [
    transactions,
    searchQuery,
    statusFilter,
    schoolFilter,
    dateFrom,
    dateTo,
    sortField,
    sortOrder,
  ]);

  // Toggle helpers
  const toggleStatus = (s) =>
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  const toggleSchool = (sid) =>
    setSchoolFilter((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const theme = localStorage?.getItem("theme") || "light"

 const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast(`${text}  Copied!`, {
      theme: theme,
    });
  } catch (err) {
    console.error("Failed to copy text:", err);
    toast.error("Failed to copy!", { theme });
  }
};


  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <ToastContainer />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold text-gray-700 dark:text-gray-100 text-lg">
          Recent History
        </h2>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student ID, student name, Institute id, email, or order ID..."
            className="w-[200%] pl-4 pr-3 py-2 rounded-full border dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {suggestions.length > 0 && (
            <div className="absolute z-20 w-full bg-white dark:bg-gray-700 shadow rounded mt-1">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
                  onClick={() => setSearchQuery(s.student_name)}
                >
                  {s.student_name} — {s.school_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setFilterDropdownOpen((p) => !p)}
          className="flex cursor-pointer -translate-x-26 gap-1 items-center text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <p className="text-amber-300">{searchParams.size>1 ? "Applied " : ""}</p> Filters <IoIosArrowDown className="ml-1" />
        </button>
        <button
          onClick={() => window.location.assign("/dashboard")}
          className="cursor-pointer flex items-center gap-2 text-sm bg-gray-100 dark:bg-amber-700 px-3 py-2 rounded-lg hover:bg-amber-200 dark:hover:bg-red-600"
        >
          <RiResetLeftFill />
          Reset Filters
        </button>
      </div>

      {/* Filters */}
      {filterDropdownOpen && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 shadow-inner space-y-4">
          {/* Status */}
          <div>
            <button
              className="flex cursor-pointer justify-between w-full text-left font-medium text-gray-600 dark:text-gray-300"
              onClick={() => setStatusCollapsed((p) => !p)}
            >
              Status {statusCollapsed ? "▲" : "▼"}
            </button>
            {!statusCollapsed && (
              <div className="  mt-2 flex gap-2 flex-wrap">
                {["success", "pending", "fail"].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold ${
                      statusFilter.includes(s)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* School */}
          <div>
            <button
              className="flex cursor-pointer justify-between w-full text-left font-medium text-gray-600 dark:text-gray-300"
              onClick={() => setSchoolCollapsed((p) => !p)}
            >
              School {schoolCollapsed ? "▲" : "▼"}
            </button>
            {!schoolCollapsed && (
              <div className="mt-2 flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                {Array.from(
                  new Map(transactions.map((t) => [t.school_id, t.school_name]))
                ).map(([sid, sname]) => (
                  <button
                    key={sid}
                    onClick={() => toggleSchool(sid)}
                    className={`px-3 py-1 cursor-pointer rounded-full text-xs ${
                      schoolFilter.includes(sid)
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {sname}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm  text-gray-600 dark:text-gray-300">
                From:
              </label>
              <input
                type="date"
                value={dateFrom || ""}
                onChange={(e) => setDateFrom(e.target.value)}
                className="ml-2 px-2 py-1 cursor-pointer rounded border dark:border-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                To:
              </label>
              <input
                type="date"
                value={dateTo || ""}
                onChange={(e) => setDateTo(e.target.value)}
                className="ml-2 px-2 py-1 cursor-pointer rounded border dark:border-gray-600 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {[
                { label: "Student Name", field: "student_name" },
                { label: "Institute", field: "school_name" },
                { label: "Email", field: "student_email" },
                { label: "Date", field: "payment_time" },
                { label: "Order ID", field: "custom_order_id" },
                { label: "Method", field: "payment_mode" },
                { label: "Gateway", field: "gateway" },
                { label: "Order ₹", field: "order_amount" },
                { label: "Txn ₹", field: "transaction_amount" },
                { label: "Status", field: "status" },
              ].map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="text-left p-2 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer select-none"
                >
                  {col.label}
                  {sortField === col.field
                    ? sortOrder === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 dark:border-gray-600 
                transform transition-transform duration-300 hover:scale-[101.8%] hover:shadow-lg hover:shadow-gray-300 dark:hover:shadow-gray-700"
              >
                <td onClick={() => handleCopy(t?.student_id)} className="p-2 flex items-center gap-2 relative group">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${
                      idx % 50
                    }.jpg`}
                    alt={t?.student_name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span>{t?.student_name}</span>

                  {/* Tooltip with notch */}
                  <div  className="tooltip-box absolute  -top-11 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block bg-blue-900 text-white text-xs p-2 rounded shadow-md w-max max-w-[180px]">
                    <div>
                      <strong>Student ID:</strong> {t?.student_id}
                      <MdContentCopy />
                    </div>
                  </div>
                </td>
                <td onClick={() => handleCopy(t?.school_id)} className="p-2 relative group">
                  {t?.school_name || "VIT Vellore"}
                  <div  className="tooltip-box absolute  -top-11 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block bg-blue-900 text-white text-xs p-2 rounded shadow-md w-max max-w-[1800px]">
                    <div>
                      <strong>Institute ID:</strong> {t?.school_id}
                      <MdContentCopy />
                    </div>
                  </div>
                </td>
                <td onClick={() => handleCopy(t?.student_email)} className="p-2">{t.student_email}</td>
                <td onClick={() => handleCopy(t?.payment_time)} className="p-2">{formatDate(t?.payment_time)}</td>
                <td onClick={() => handleCopy(t?.custom_order_id)} className="p-2">{t.custom_order_id}</td>
                <td onClick={() => handleCopy(t?.payment_mode)} className="p-2">{t.payment_mode}</td>
                <td onClick={() => handleCopy(t?.gateway)} className="p-2">{t.gateway}</td>
                <td onClick={() => handleCopy(t?.order_amount)} className="p-2">₹{t.order_amount}</td>
                <td onClick={() => handleCopy(t?.order_amount)}className="p-2">₹{t?.order_amount}</td>
                <td onClick={() => handleCopy(t?.status)} className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.status === "success"
                        ? "bg-green-100 text-green-700"
                        : t.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status?.toUpperCase() || "UPI"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentHistoryTable;
