import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const theme = localStorage?.getItem("theme") || "light"
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
  
        const data = await res.json();
     
        if (res.ok) {
            document.cookie = `token=${data.access_token}; path=/; secure; samesite=strict; max-age=86400`;
          toast.success("Signed In successfully!",{
            theme:theme
          });
          setTimeout(()=>{
              window.location.assign("/dashboard")
          },2000)
        } else {
          toast.error(data.error || "Account Not Found.",{
            theme:theme
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.",{
            theme:theme
        });
      }
    };


  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#f7f9f6] to-[#dce6fa] dark:from-gray-900 dark:to-gray-950 py-12 px-4">
     <ToastContainer />
      <div className="w-full max-w-md bg-white/70 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-[#4333fd] dark:text-yellow-200">Sign in to Gateway</h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">Welcome back! Please enter your details</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4333fd] dark:focus:ring-yellow-200 border-none outline-none transition"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4333fd] dark:focus:ring-yellow-200 border-none outline-none transition"
                placeholder="••••••••"
              />
              <button type="button"
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-xs">
              <input type="checkbox" className="rounded accent-[#4333fd]" />
              <span className="text-gray-500 dark:text-gray-300">Remember me</span>
            </label>
            <Link to="#" className="text-sm text-[#4333fd] dark:text-yellow-200 hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#4333fd] text-white dark:bg-yellow-300 dark:text-gray-900 font-semibold text-lg mt-2 shadow hover:bg-[#5641f8] dark:hover:bg-yellow-200 transition"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-[#4333fd] dark:text-yellow-200 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
