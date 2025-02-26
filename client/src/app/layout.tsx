
import { Metadata } from "next";
import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import MobileOnly from "@/utils/mobileOnly";
import ThemeProvider from "@/utils/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--josefin",
});

export const metadata: Metadata = {
  title: "DayPlanner",
  description:
    "DayPlanner is a simple app to help you plan your day and stay productive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <html className={`${poppins.variable} ${josefin.variable}`} suppressHydrationWarning>
    <head>
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    </head>
       <body
        className={`dark:bg-gradient-to-b dark:from-gray-900 dark:to-black bg-white duration-300 bg-no-repeat min-h-screen w-full dark:text-white text-black transition-all`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MobileOnly> 
          <main>{children}</main>
        </MobileOnly>
        </ThemeProvider>
      </body>
    </html>
  );
}