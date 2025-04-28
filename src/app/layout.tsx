import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar/page";
import { Roboto } from "next/font/google";
import Topbar from "@/components/layout/topbar/page";
import Footer from "@/components/layout/footer/page";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={roboto.className}>
      <head>
        <title>Bartex Gorzkowice telefon 44 6818 043 Piotr Bartnik Materiały Budowlane</title>

        {/* Skrypt autoblocker.js */}
        <script
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          defer
        ></script>

        {/* Skrypt Usercentrics loader.js */}
        <script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="pxHnWAYp8hC6ur"
          data-language="pl"   {/* <<< DODANE */}
          async
        ></script>

      </head>
      <body>
        <Topbar />
        <div className="xl:w-[1200px] mx-auto">
          <Navbar />
          {children}
        </div>

        <div className="xl:w-[1200px] mx-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
