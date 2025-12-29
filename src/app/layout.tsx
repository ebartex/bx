import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar/page";
import { Poppins } from "next/font/google";
import Topbar from "@/components/layout/topbar/page";
import Footer from "@/components/layout/footer/page";

import NewYearTopbar from "@/components/layout/topbar/NewYearTopbar";


const poppins = Poppins({
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Bartex Gorzkowice telefon 44 6818 043 Piotr Bartnik Materiały Budowlane",
  description: "Bartex Gorzkowice materiały budowlane, chemia budowlana, narzędzia, farby, lakiery, kleje, izolacje, systemy dociepleń, artykuły hydrauliczne i elektryczne.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  
  return (
    <html lang="pl" className={poppins.className}>
      <body className="bg-stone-100">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53LWG4GN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        
        <NewYearTopbar />
        <Topbar />
        <div className="bg-white">
          <Navbar />
        </div>

        <div className="xl:w-[1200px] mx-auto">
    
          {children}

        </div>

        <div className="xl:w-[1200px] mx-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
