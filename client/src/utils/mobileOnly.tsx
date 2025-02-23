"use client";

import { UAParser } from "ua-parser-js";
import { useState, useEffect } from "react";

export default function MobileOnly({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const parser = new UAParser().setUA(navigator.userAgent);
    const deviceType = parser.getDevice().type;

    if (deviceType === "mobile" || deviceType === "tablet") {
      setIsMobile(true);
    }
  }, []);

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-red-500 text-lg">
        Please open this app on a mobile or tablet device.
      </div>
    );
  }

  return <>{children}</>; // ✅ Ensure children are returned on mobile/tablet
}
