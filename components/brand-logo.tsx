/**
 * 지산 로고 (public/images/logo.png를 SVG로 따라 그린 것)
 * 회색 조각 둘 + 물결 모양 세로 띠 둘. 크게 키워 쓰거나 남색 바탕 위에 올릴 때 씁니다.
 * 원본 파일(AI·SVG)을 받으면 아래 경로만 바꾸면 됩니다.
 */
export const LOGO_PIECES = [
  "M105,22 L168,22 C162,45 158,70 158,97 L93,97 C93,70 98,45 105,22 Z",
  "M60,243 L180,243 C180,270 175,295 170,318 L48,318 C53,295 58,270 60,243 Z",
]
export const LOGO_BAR =
  "M185,22 L262,22 C250,60 245,80 245,95 C245,130 272,190 272,240 C272,270 268,295 265,318 L188,318 C192,295 198,270 198,240 C198,190 175,130 175,95 C175,70 180,45 185,22 Z"

type Variant = "color" | "reverse" | "tone"

const FILLS: Record<Variant, { piece: string; pieceOpacity?: number; bar: string }> = {
  /** 흰 바탕: 원래 색 */
  color: { piece: "#B3B3B3", bar: "#0E4A73" },
  /** 남색 바탕: 흰 띠 + 반투명 조각 */
  reverse: { piece: "#FFFFFF", pieceOpacity: 0.45, bar: "#FFFFFF" },
  /** 바탕 무늬용: 글자색(currentColor) 한 가지 */
  tone: { piece: "currentColor", pieceOpacity: 0.55, bar: "currentColor" },
}

export function LogoSvg({ variant = "color", className }: { variant?: Variant; className?: string }) {
  const f = FILLS[variant]
  return (
    <svg viewBox="44 18 337 304" className={className} aria-hidden focusable="false">
      {LOGO_PIECES.map((d) => (
        <path key={d} d={d} fill={f.piece} fillOpacity={f.pieceOpacity} />
      ))}
      <path d={LOGO_BAR} fill={f.bar} />
      <path d={LOGO_BAR} fill={f.bar} transform="translate(105 0)" />
    </svg>
  )
}

/** 섹션 제목 앞에 붙이는 물결 띠 하나 (글자색을 따름) */
export function WaveBar({ className }: { className?: string }) {
  return (
    <svg viewBox="171 18 106 304" className={className} aria-hidden focusable="false">
      <path d={LOGO_BAR} fill="currentColor" />
    </svg>
  )
}
