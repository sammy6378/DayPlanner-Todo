"use client"

import { useEffect, useState } from "react";
import {UAParser} from "ua-parser-js";

import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
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
      <div className="h-screen flex items-center justify-center text-red-500 text-lg">
        Please open this app on a mobile or tablet device.
      </div>
    );
  }

  return <Component {...pageProps} />;
}
