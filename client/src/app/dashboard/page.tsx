"use client";

import React from "react";
import Image from "next/image";
import { CalendarPlus, ClipboardList } from "lucide-react";

function Maindashboard() {
  return (
    <div className="min-h-screen pt-16 px-6 flex flex-col items-center text-center bg-gray-100 dark:bg-gray-900 dark:text-white">
      {/* About Section */}
      <h1 className="text-3xl font-bold ">DayPlanner</h1>
      <p className=" mt-2 max-w-md">
        Stay organized and boost productivity with DayPlanner. Easily create events and plan your daily tasks in one place.
      </p>

      {/* Image */}
      <div className="mt-6 flex justify-center">
        <Image
          src="/planner.jpeg" 
          alt="DayPlanner"
          width={300}
          height={200}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 w-full flex flex-col items-center space-y-4">
        <button className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg w-full max-w-xs shadow-md hover:bg-blue-700">
          <CalendarPlus size={20} className="mr-2" /> Create Event
        </button>

        <button className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg w-full max-w-xs shadow-md hover:bg-green-700">
          <ClipboardList size={20} className="mr-2" /> Plan Your Day with Tasks
        </button>
      </div>
    </div>
  );
}

export default Maindashboard;
