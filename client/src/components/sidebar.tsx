"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Calendar, PlusCircle, List, Settings, LogOut } from 'lucide-react';
import { useTheme } from "next-themes";
import '../app/app.css';

function Sidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
          setActive(true);
        } else {
          setActive(false);
        }
      });
    }
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className={`p-6 h-full transform transition-transform duration-300 ease-in-out flex flex-col justify-between 
    ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div>
        <h2 className={`text-xl font-bold mb-6`}>DayPlanner</h2>
        
        <button className="sidebar-button" onClick={() => router.push('/dashboard/calendar')}>
          <Calendar /> <span>Calendar</span>
        </button>
        
        <button className="sidebar-button" onClick={() => router.push('/add-events')}>
          <PlusCircle /> <span>Add Events</span>
        </button>
        
        <button className="sidebar-button" onClick={() => router.push('/add-tasks')}>
          <List /> <span>Add Tasks</span>
        </button>
        
        <button className="sidebar-button">
          {theme === "light" ? (
            <Moon
              onClick={() => setTheme("dark")}
              className="cursor-pointer text-black dark:text-white hover:text-slate-800"
              fill="black"
            />
          ) : (
            <Sun
              onClick={() => setTheme("light")}
              className="cursor-pointer text-black dark:text-white hover:text-slate-300"
              fill="black"
            />
          )}
          <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button className="sidebar-button" onClick={() => router.push('/settings')}>
          <Settings /> <span>Settings</span>
        </button>
      </div>
      
      <button className="sidebar-button-danger" onClick={() => router.push('/logout')}>
        <LogOut /> <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
