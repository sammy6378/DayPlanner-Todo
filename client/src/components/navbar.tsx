"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, Bell, LogOut, UserCircle } from "lucide-react";
import Sidebar from "./sidebar";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center border-b border-gray-400 shadow-sm p-4 fixed top-0 left-0 w-full z-50 bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-all">
      {/* Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-black dark:text-white focus:outline-none"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Side Navigation Drawer */}
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {/* User Icon with Dropdown */}
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-black dark:text-white focus:outline-none">
          <User size={28} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-100 text-black dark:bg-gray-900 dark:text-white rounded shadow-lg py-2">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
              <UserCircle size={20} className="mr-2" /> Account
            </Link>
            <Link
              href="/notifications"
              className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
              <Bell size={20} className="mr-2" /> Notifications
            </Link>
            <button className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
              <LogOut size={20} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
