/**
 * 개발·미리보기에서만 예시 글을 보여 줍니다.
 * Vercel 미리보기(VERCEL_ENV=preview)와 로컬 개발에서는 업무사례·칼럼·유튜브·감사일기 칸이
 * 예시 글로 채워지고, 실제 운영(production)에서는 절대 보이지 않습니다.
 * 실제 글이 하나라도 생기면 그 종류는 예시 대신 실제 글만 보입니다.
 */
export const SHOW_SAMPLES =
  process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development" || process.env.SHOW_SAMPLES === "1"
