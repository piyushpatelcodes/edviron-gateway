import React, { useState, useEffect } from "react";
import { getTokenFromCookie, parseJwt } from "../utils/getToken";
  import { FaInfoCircle } from "react-icons/fa";



export default function CreatePayment() {
  const [orderAmount, setOrderAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [student, setStudent] = useState({ id: "", email: "", name: "" });
  const [status, setStatus] = useState("");
//   const [theme, setTheme] = useState("light");

  // Load theme from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.documentElement.classList.toggle("dark", savedTheme === "dark");
//   }, []);

  useEffect(() => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setOrderId(`ORD-${randomNum}`);
  }, []);

  const token = getTokenFromCookie("token");
  useEffect(() => {
    if (token) {
      try {
        const decoded = parseJwt(token);
        setStudent({
          id: decoded.sub || "",
          email: decoded.email || "",
          name: decoded.name || "",
        });
      } catch (err) {
        console.error("Invalid JWT", err);
      }
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!orderAmount) {
      setStatus("⚠️ Please enter order amount");
      return;
    }

    const payload = { orderAmount, orderId, student };

    try {
      setStatus("⏳ Sending request...");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/payments/create-payment`,{
            method:"POST",
            body: JSON.stringify(payload),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
        }
      );
     if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
      const paymentUrl = data.raw?.collect_request_url;
    
    if (paymentUrl) {
      setStatus(`✅ Redirecting to payment...`);
      window.location.href = paymentUrl; // Redirect user to payment page
    } else {
      setStatus("❌ Payment URL not found in response");
    }
    console.log("🚀 Payment response:", data);
    } catch (error) {
      setStatus(`❌ Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="min-h-screen mt-7 flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Create Payment
        </h1>

        {/* Order Amount */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Order Amount
          </label>
          <input
            type="number"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none 
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            placeholder="Enter amount"
          />
        </div>

        {/* Auto Order ID */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            readOnly
            className="w-full px-4 py-2 border rounded-lg 
                       bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200
                       border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Student Info */}
        {["name", "email", "id"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Student {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              value={student[field]}
              onChange={(e) =>
                setStudent({ ...student, [field]: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              placeholder={`Enter student ${field}`}
            />
          </div>
        ))}

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition"
        >
          Create Payment
        </button>

        {/* Status */}
        {status && (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 break-words">
            {status}
          </p>
        )}
     
<div class="group flex items-center mt-2 gap-2 text-white bg-blue-500 p-4 rounded-md shadow-sm text-sm w-fit">
  <FaInfoCircle size={20} className="animate-bounce cursor-pointer" />

  <span class="opacity-80 text-xs group-hover:opacity-100 transition-opacity duration-300">
    If the page shows an error, just refresh. This is caused by CashFree API fetch failures.
    <p className="text-pink-300"> All of the Data in this form  is automatically Fetched from JWT Token</p>

  </span>
</div>


      </div>
      
    </div>
  );
}
