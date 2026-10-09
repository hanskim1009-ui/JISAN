/** 외국어판이 있는 언어 (lib/langs.ts 와 같게) */
const FOREIGN_LANGS = ["en", "zh", "vi", "ru", "mn"]
/** 외국어판 센터: /en/foreigner → slug foreigner-en, /en/crime → crime-en, /en/family → family-en */
const INTL_CENTERS = ["foreigner", "crime", "family"]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /** 외국인센터 외국어판: /en/foreigner → 센터 slug foreigner-en (lib/centers.ts foreignCenters) */
  async rewrites() {
    return {
      beforeFiles: FOREIGN_LANGS.flatMap((l) =>
        INTL_CENTERS.flatMap((c) => [
          { source: `/${l}/${c}`, destination: `/${c}-${l}` },
          { source: `/${l}/${c}/:path*`, destination: `/${c}-${l}/:path*` },
        ]),
      ),
    }
  },
  async redirects() {
    return FOREIGN_LANGS.flatMap((l) =>
      INTL_CENTERS.flatMap((c) => [
        { source: `/${c}-${l}`, destination: `/${l}/${c}`, permanent: true },
        { source: `/${c}-${l}/:path*`, destination: `/${l}/${c}/:path*`, permanent: true },
      ]),
    )
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

