import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar/page";
import { Roboto } from "next/font/google";
import Topbar from "@/components/layout/topbar/page";
import Footer from "@/components/layout/footer/page";
import Head from "next/head";

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
      <Head>
      
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-53LWG4GN');
            `,
          }}
        />
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53LWG4GN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        
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
