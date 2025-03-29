import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['eerpe.ebartex.pl', 'https://www.imgstatic.ebartex.pl', 'https://imgstatic.ebartex.pl', 'www.imgstatic.ebartex.pl', 'erp.ebartex.pl'], // Corrected domain without protocol or trailing slashes
  },
};

export default nextConfig;
