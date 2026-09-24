import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Slike iz Supabase Storage (admin panel)
      { protocol: "https", hostname: "*.supabase.co" },
      // YouTube thumbnaili
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [{ source: "/kontakt", destination: "/o-meni", permanent: true }];
  },
};

export default nextConfig;
