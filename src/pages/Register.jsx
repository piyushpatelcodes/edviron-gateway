import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer , toast} from "react-toastify";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
        console.log("🚀 ~ handleSubmit ~ formData:", formData)
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Registered successfully!",{
            theme:theme
        });
        setTimeout(()=>{
            window.location.assign("/login")
        },2000)
      } else {
        toast.error(data.message || "Registration failed.",{
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
        <h2 className="text-3xl font-bold mb-2 text-center text-[#4333fd] dark:text-yellow-200">
          Create your account
        </h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
          Get started with Gateway!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              value={formData.name}
              required
              className="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4333fd] dark:focus:ring-yellow-200 border-none outline-none transition"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email address
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              value={formData.email}
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
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                required
                className="mt-1 w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4333fd] dark:focus:ring-yellow-200 border-none outline-none transition"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#4333fd] text-white dark:bg-yellow-300 dark:text-gray-900 font-semibold text-lg mt-2 shadow hover:bg-[#5641f8] dark:hover:bg-yellow-200 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#4333fd] dark:text-yellow-200 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
