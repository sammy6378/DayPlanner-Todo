"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, User, Bell, LogOut, UserCircle } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-800 text-white relative">
      {/* Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white focus:outline-none"
      >
        <Menu size={28} />
      </button>

      {/* Side Navigation Drawer */}
      {menuOpen && (
        <div className="absolute top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white self-end mb-4"
          >
            ✖
          </button>
          <Link href="/" className="py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
          <Link href="/about" className="py-2 px-4 hover:bg-gray-700 rounded">About</Link>
          <Link href="/contact" className="py-2 px-4 hover:bg-gray-700 rounded">Contact</Link>
        </div>
      )}

      {/* User Icon with Dropdown */}
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
          <User size={28} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded shadow-lg py-2">
            <Link href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-200">
              <UserCircle size={20} className="mr-2" /> Account
            </Link>
            <Link href="/notifications" className="flex items-center px-4 py-2 hover:bg-gray-200">
              <Bell size={20} className="mr-2" /> Notifications
            </Link>
            <button className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-200">
              <LogOut size={20} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
