/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /** 외국인센터 영어·중국어판: /en/foreigner → 센터 slug foreigner-en (lib/centers.ts foreignCenters) */
  async rewrites() {
    return {
      beforeFiles: ["en", "zh"].flatMap((l) => [
        { source: `/${l}/foreigner`, destination: `/foreigner-${l}` },
        { source: `/${l}/foreigner/:path*`, destination: `/foreigner-${l}/:path*` },
      ]),
    }
  },
  async redirects() {
    return ["en", "zh"].flatMap((l) => [
      { source: `/foreigner-${l}`, destination: `/${l}/foreigner`, permanent: true },
      { source: `/foreigner-${l}/:path*`, destination: `/${l}/foreigner/:path*`, permanent: true },
    ])
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // 관리 화면에서 올린 감사일기 사진
        protocol: "https",
        hostname: "lyqysvujgfnolvkqobek.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
    ],
  },
}

export default nextConfig

