"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Calendar, PlusCircle, List, Settings, LogOut } from 'lucide-react';
import '../app/app.css';
import { useTheme } from "next-themes";

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
    <>
    <div className={`p-6  transform transition-transform duration-300 ease-in-out flex flex-col justify-between 
    ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div>
        <h2 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>DayPlanner</h2>
        
        <button className="sidebar-button" onClick={() => router.push('/dashboard/calendar')}>
          <Calendar /> <span>Calendar</span>
        </button>
        
        <button className="sidebar-button" onClick={() => router.push('/add-events')}>
          <PlusCircle /> <span>Add Events</span>
        </button>
        
        <button className="sidebar-button" onClick={() => router.push('/add-tasks')}>
          <List /> <span>Add Tasks</span>
        </button>
        
        <button className="sidebar-button" >
          {theme === "light" ? (
            <Moon
              onClick={() => setTheme("dark")}
              className="cursor-pointer text-black dark:text-white hover:text-slate-800 max-200px:w-[15px] max-200px:h-[15px]"
              fill="black"
            />
          ) : (
            <Sun
              onClick={() => setTheme("light")}
              className="cursor-pointer hover:text-slate-300 dark:text-white text-black max-200px:w-[15px] max-200px:h-[15px]"
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
    </>
  );
}

export default Sidebar;
