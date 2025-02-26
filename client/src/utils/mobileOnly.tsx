"use client";

import { UAParser } from "ua-parser-js";
import { useState, useEffect } from "react";

export default function MobileOnly({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null initially

  useEffect(() => {
    // Check if we already have the device type stored in localStorage
    const savedDevice = localStorage.getItem('isMobile');
    if (savedDevice !== null) {
      setIsMobile(JSON.parse(savedDevice));
    } else {
      // If not, detect device type using UAParser
      const parser = new UAParser().setUA(navigator.userAgent);
      const deviceType = parser.getDevice().type;
      const isDeviceMobile = deviceType === "mobile" || deviceType === "tablet";
      setIsMobile(isDeviceMobile);
      // Store the result in localStorage for future checks
      localStorage.setItem('isMobile', JSON.stringify(isDeviceMobile));
    }
  }, []);

  // Prevent rendering until mobile check is completed
  if (isMobile === null) {
    return null; // Optionally, you can return a loading state here
  }

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-red-500 text-lg">
        Please open this app on a mobile or tablet device.
      </div>
    );
  }

  return <>{children}</>;
}
