/** 외국어판이 있는 언어 (lib/langs.ts 와 같게) */
const FOREIGN_LANGS = ["en", "zh", "vi", "ru", "mn"]
/** 외국어판 센터: /en/foreigner → slug foreigner-en, /en/crime → crime-en, /en/family → family-en */
const INTL_CENTERS = ["foreigner", "crime", "family"]

import { readFileSync } from "node:fs"

/** 형사센터·기업센터에서 새 센터로 옮긴 업무분야·안내 글 (content/center-pages/moved.json: [옛 주소, 새 주소]) */
const MOVED = JSON.parse(readFileSync(new URL("./content/center-pages/moved.json", import.meta.url), "utf8"))

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
    const moved = MOVED.map(([source, destination]) => ({ source, destination, permanent: true }))
    return [...moved, ...FOREIGN_LANGS.flatMap((l) =>
      INTL_CENTERS.flatMap((c) => [
        { source: `/${c}-${l}`, destination: `/${l}/${c}`, permanent: true },
        { source: `/${c}-${l}/:path*`, destination: `/${l}/${c}/:path*`, permanent: true },
      ]),
    )]
  },
  images: {
    // 단체 사진처럼 큰 사진은 85로 (기본 75는 화질이 떨어져 보임)
    qualities: [75, 85],
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

