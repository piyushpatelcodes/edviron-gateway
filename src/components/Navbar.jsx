import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border-b border-white/30 dark:border-gray-700/30 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-xl text-primary"
        >
          <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg">
            G
          </span>
          Gateway
        </Link>
        {/* Nav links */}

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-gray-700 dark:text-gray-200  font-medium hover:bg-gray-700 p-2 rounded-lg"
          >
            Dashboard
          </Link>
          <Link
            to="/create-payment"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-700 p-2 rounded-lg"
          >
            Create Payment<sup className="text-pink-300"> Beta</sup>
          </Link>
          <Link
            to="httpS://github.com/piyushpatelcodes"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-700 p-2 rounded-lg"
          >
            Support
          </Link>

          <FaLinkedin className="translate-x-4" size={20} />
          <a
            href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=piyushpatelcodes"
            target="_blank"
            class="flex flex-col justify-center items-center px-2 py-[7px] text-center no-underline text-white w-[200px] h-[32px] rounded-[16px] bg-[#0A66C2] font-sans"
          >
            Follow Dev on LinkedIn
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full w-9 h-9 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <img
              src="https://randomuser.me/api/portraits/women/3.jpg"
              alt="profile"
              className="rounded-full w-7 h-7 object-cover"
            />
          </button>
          <button
            onClick={() => window.location.assign("/login")}
            className="cursor-pointer px-4 py-1.5 rounded-md bg-primary text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
