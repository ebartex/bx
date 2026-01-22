import "./globals.css";
import Navbar from "@/components/layout/navbar/page";
import { Poppins } from "next/font/google";
import Topbar from "@/components/layout/topbar/page";
import Footer from "@/components/layout/footer/page";


import YearAmbientTopbar from "@/components/layout/topbar/YearAmbientTopbar";
import { SidebarProvider } from "@/components/ui/sidebar";


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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={poppins.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();`,
          }}
        />
      </head>

      <body className="bg-background text-foreground">
  
        <Topbar />
        <div className="bg-background border-b">
          <Navbar />
        </div>

        <div className="xl:w-[1200px] mx-auto">
          <SidebarProvider>{children}</SidebarProvider>
        </div>

        <div className="xl:w-[1200px] mx-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
