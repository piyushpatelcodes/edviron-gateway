import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdPayment,
  MdSettings,
  MdSupport,
  MdLogout,
  MdOutlineRequestPage,
  MdSend,
  MdLink,
  MdShoppingCart,
  MdLayers,
  MdEmail,
  MdAccountBalance,
  MdCheckCircle,
} from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import { FiActivity } from "react-icons/fi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { getTokenFromCookie, parseJwt } from "../utils/getToken";
import useTheme from "../utils/useTheme";
import RecentHistoryTable from "../components/RecentHistoryTable";

const navLinks = [
  { label: "Dashboard", icon: <MdDashboard size={20} /> },
  { label: "Create payments", icon: <MdAccountBalance size={20} /> },
  { label: "Support", icon: <MdSupport size={20} /> },
  { label: "Invoicing", icon: <FaRegMoneyBillAlt size={20} /> },
  { label: "Activities", icon: <FiActivity size={20} /> },
  { label: "Pay & get paid", icon: <MdPayment size={20} /> },
  { label: "Setting", icon: <MdSettings size={20} /> },
];


export default function Dashboard() {

  const { dark, toggleTheme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({
    sub: "",
    name: "",
    email: "",
  });

  // Copy to clipboard helper


  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    async function getData() {
      const token = getTokenFromCookie();
      if (!token) return;
      const payload = parseJwt(token);
      if (payload && payload.email) {
        setUserInfo({
          sub: payload.sub,
          name: payload.name,
          email: payload.email,
        });
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/transactions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();
        console.log("🚀 ~ getData ~ data:", data.data);
        setTransactions(data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    getData();
  }, [dark]);

  const statusStats = transactions.reduce(
  (acc, t) => {
    // Count each status
    acc.counts[t.status] = (acc.counts[t.status] || 0) + 1;

    // Sum amount depending on status
    // For success: transaction_amount
    // For pending and fail: order_amount (based on your code)
    if (t.status === "success") {
      acc.amounts.success += Number(t.transaction_amount) || 0;
    } else if (t.status === "pending") {
      acc.amounts.pending += Number(t.order_amount) || 0;
    } else if (t.status === "fail") {
      acc.amounts.fail += Number(t.order_amount) || 0;
    }
    return acc;
  },
  {
    counts: { success: 0, pending: 0, fail: 0 },
    amounts: { success: 0, pending: 0, fail: 0 },
  }
);


  return (
    <div className={dark ? "dark" : ""}>
      <div className="bg-[#f7f9f6] dark:bg-gray-900 min-h-screen mt-15 flex">
        {/* Sidebar */}
        <aside
          className={`bg-[#4333fd] text-white flex flex-col py-8 px-4 rounded-tr-3xl rounded-br-3xl min-h-screen
            transition-width duration-300 ease-in-out
            ${collapsed ? "w-16" : "w-64"}`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 cursor-pointer self-end text-yellow-400 hover:text-yellow-200"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
          </button>

          {/* Logo */}
          <div
            className={`flex items-center mb-10 gap-2 px-2 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="text-3xl font-bold text-yellow-200">G</span>
            <span className="text-3xl font-bold text-yellow-400">
              {collapsed ? null : "O"}
            </span>
            {!collapsed && (
              <span className="font-semibold text-lg tracking-wide ml-2">
                Gateway
              </span>
            )}
          </div>

          {/* Nav Links */}
          <ul className="flex flex-col gap-2 flex-1">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  className={`flex cursor-pointer items-center w-full gap-3 py-2 px-3 rounded-lg transition
          ${
            idx === 0
              ? "bg-white/90 !text-[#4333fd] font-semibold"
              : "hover:bg-white/10"
          }
          ${collapsed ? "justify-center px-0" : ""}
        `}
                >
                  <span className="flex-shrink-0">
                    {/* Keep icon size fixed */}
                    {React.cloneElement(link.icon, { size: 24 })}
                  </span>
                  {!collapsed && <span>{link.label}</span>}
                </button>
              </li>
            ))}
          </ul>

          {/* Logout button */}
          <button className="flex items-center gap-3 p-2 mt-auto rounded-lg hover:bg-white/10 transition">
            <MdLogout size={20} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen py-4 pl-4 pr-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-200">
              <span>Total Balance</span>
              <span className="font-semibold text-[#4333fd] dark:text-yellow-200 text-lg">
                $135,700
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                // onClick={() => setDark((d) => !d)}
                onClick={toggleTheme}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-gray-700 mr-2 shadow"
                title="Toggle dark mode"
              >
                {!dark ? (
                 <FiSun />
                ) : (
                  <svg
                    height={18}
                    width={18}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              {/* Avatar/Username */}
              <span className="flex items-center gap-2">
                <img
                  src="https://randomuser.me/api/portraits/women/3.jpg"
                  className="h-8 w-8 rounded-full object-cover border"
                  alt="avatar"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {userInfo.name}
                </span>
              </span>
            </div>
          </div>

          {/* Content */}
          <section className="space-y-4">
            <div className="grid grid-cols-8 gap-4">
              <div className="col-span-5 bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col space-y-4">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-100">
                     Status Stats
                  </span>
                  <div className="flex gap-16 mt-4 mb-4 items-center">
                    <span className="flex flex-col items-center gap-1">
                      <span className="rounded-full bg-[#e2e6f8] px-6 py-1 text-[#4333fd] font-bold">
                        {statusStats?.counts?.success || 0}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Successful Transactions
                      </span>
                    </span>
                    <span className="flex flex-col items-center gap-1">
                      <span className="rounded-full bg-[#f8d97d] px-6 py-1 text-[#bb7b04] font-bold">
                        {statusStats?.counts?.pending || 0}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Pending Transactions
                      </span>
                    </span>
                    <span className="flex flex-col items-center gap-1">
                      <span className="rounded-full bg-[#f8e2e2] px-6 py-1 text-[#fd3333] font-bold">
                        
                        {statusStats?.counts?.fail || 0}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Failed Transactions
                      </span>
                    </span>
                  
                  </div>
                </div>
                {/* Gateaway balance */}
                <div className="flex justify-between gap-3 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl flex-1 p-4">
                    <div className="font-semibold text-gray-700 dark:text-gray-100">
                      Gateway Blance
                    </div>
                    <div className="text-2xl font-bold mt-2">$125</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl flex-1 p-4 flex flex-col justify-center items-center text-sm font-medium">
                    <span>+ Add Fund</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl flex-1 p-4">
                    <div className="font-semibold text-gray-600 dark:text-gray-200">
                      Money In
                    </div>
                    <div className="text-2xl font-bold mt-2">$125</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl flex-1 p-4">
                    <div className="font-semibold text-gray-600 dark:text-gray-200">
                      Money Out
                    </div>
                    <div className="text-2xl font-bold mt-2">$125</div>
                  </div>
                </div>
              </div>
              {/* Invoice Details */}
              <div className="custom-scrollbar col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
                <div className="font-semibold text-gray-700 dark:text-gray-100 mb-3">
                  Invoice Details
                </div>
                <div
                  className="flex flex-col gap-2 max-h-[calc(5*3.5rem)] overflow-x-hidden custom-scrollbar"
                  style={{ maxHeight: "calc(5 * 3.5rem)" }}
                >
                  {transactions.map((inv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 
                           transform transition-transform duration-200 hover:scale-[102%] hover:shadow-md hover:shadow-gray-200 dark:hover:shadow-blue-500/50"
                    >
                      <div>
                        <div className="font-medium text-xs text-gray-700 dark:text-gray-200">
                          {inv.student_name}
                        </div>
                        <div className="text-[11px] ">
                          <span className="text-sky-500">{inv.student_id}</span>{" "}
                          |{" "}
                          <span className="text-blue-500">
                            {inv.school_name}
                          </span>{" "}
                          |{" "}
                          <span className="text-cyan-500">
                            {inv.student_email}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`px-3 py-1 text-xs rounded-md font-bold min-w-[52px] ${
                          inv.status === "success"
                            ? "bg-green-100 text-green-600"
                            : inv?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {inv.status === "success"
                          ? `₹${inv.transaction_amount} Paid`
                          : inv.status === "pending"
                          ? `₹${inv.order_amount} Pending`
                          : `₹${inv.order_amount} Failed`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
                <div className="font-normal text-gray-600 dark:text-gray-300 text-sm">
                  My Wallet (Successful trnxs Amount)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#4333fd] dark:text-yellow-300">
                    Rs. {statusStats.amounts.success}
                  </span>
                  <span className="text-xs text-gray-400">till date</span>
                </div>
                <div className="h-9 mt-1 flex items-end">
                  {/* Simple trend line mimic */}
                  <svg width="100" height="24">
                    <polyline
                      points="0,22 25,7 50,17 75,3 100,13"
                      fill="none"
                      stroke="#36d399"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
                <div className="font-normal text-gray-600 dark:text-gray-300 text-sm">
                  Pending Amount
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#4333fd] dark:text-yellow-300">
                    Rs. {statusStats.amounts.pending}
                  </span>
                  <span className="text-xs text-gray-400">till date</span>
                </div>
                <div className="h-9 mt-1 flex items-end">
                  <svg width="100" height="24">
                    <polyline
                      points="0,21 22,13 43,20 61,8 89,5 100,9"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
                <div className="font-normal text-gray-600 dark:text-gray-300 text-sm">
                  Failed Transactions Amount
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#4333fd] dark:text-yellow-300">
                    Rs. {statusStats.amounts.fail}
                  </span>
                  <span className="text-xs text-gray-400">till date</span>
                </div>
                <div className="h-9 mt-1 flex items-end">
                  <svg width="100" height="24">
                    <polyline
                      points="0,22 22,18 43,10 61,19 89,5 100,17"
                      fill="none"
                      stroke="#c7a0f7"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>
       
            {/* Recent History */}
        <RecentHistoryTable transactions={transactions} />
          </section>
        </main>
      </div>
    </div>
  );
}
