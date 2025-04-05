import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar/page";
import {Roboto} from 'next/font/google';
import Topbar from "@/components/layout/topbar/page";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap"
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={roboto.className}>
      <body >
      <Topbar />
        <div className="xl:w-[1200px] mx-auto">
          <Navbar />
        {children}
        </div>
      </body>
    </html>
  );
}
