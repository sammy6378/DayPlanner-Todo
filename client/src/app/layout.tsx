
import { Metadata } from "next";
import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import MobileOnly from "@/utils/mobileOnly";

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
      <body className="bg-gray-900 text-white">
        <MobileOnly> 
          <main>{children}</main>
        </MobileOnly>
      </body>
    </html>
  );
}