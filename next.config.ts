// next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 // reactStrictMode: true, // Włączenie trybu "strict" dla React (opcjonalnie)
  images: {
    domains: [
      'eerpe.ebartex.pl',
      'www.imgstatic.ebartex.pl',
      'imgstatic.ebartex.pl',
      'erp.ebartex.pl'
    ], // Poprawiona konfiguracja domen bez protokołu i ukośników
  },
};

export default nextConfig;
