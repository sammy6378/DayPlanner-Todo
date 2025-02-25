"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Calendar, PlusCircle, List, Settings, LogOut } from 'lucide-react';
import '../app/app.css';


function Sidebar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-6 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">DayPlanner</h2>
        
        <button className="sidebar-button " onClick={() => router.push('/dashboard/calendar')}>
          <Calendar /> <span>Calendar</span>
        </button>
        
        <button className="sidebar-button" onClick={() => router.push('/add-events')}>
          <PlusCircle /> <span>Add Events</span>
        </button>
        
        <button className="sidebar-button " onClick={() => router.push('/add-tasks')}>
          <List /> <span>Add Tasks</span>
        </button>
        
        <button className="sidebar-button " onClick={toggleTheme}>
          {darkMode ? <Sun /> : <Moon />} 
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button className="sidebar-button " onClick={() => router.push('/settings')}>
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
