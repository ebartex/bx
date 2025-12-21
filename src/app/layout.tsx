import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar/page";
import { Poppins } from "next/font/google";
import Topbar from "@/components/layout/topbar/page";
import Footer from "@/components/layout/footer/page";
import ChristmasTopbar from "@/components/layout/topbar/ChristmasTopbar";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Bartex Gorzkowice telefon 44 6818 043 Piotr Bartnik Materiały Budowlane",
  description:
    "Bartex Gorzkowice materiały budowlane, chemia budowlana, narzędzia, farby, lakiery, kleje, izolacje, systemy dociepleń, artykuły hydrauliczne i elektryczne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={poppins.className}>
      <body className="bg-stone-100">
        {/* Google Tag Manager - bez inline script w <head> */}
        <GoogleTagManager gtmId="GTM-53LWG4GN" />

        {/* Adsense - jako next/script, też bez wpychania ręcznie do <head> */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6585756983159019"
          crossOrigin="anonymous"
        />

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53LWG4GN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ChristmasTopbar />
        <Topbar />

        <div className="bg-white">
          <Navbar />
        </div>

        <div className="xl:w-[1200px] mx-auto">{children}</div>

        <div className="xl:w-[1200px] mx-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
