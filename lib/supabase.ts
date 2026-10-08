/**
 * 홈페이지용 Supabase (관리자 글쓰기 · 상담 신청 저장)
 *
 * URL과 공개 키(anon)는 브라우저에 노출돼도 되는 값입니다. 실제 권한은 데이터베이스의 행 보안 정책(RLS)이 막습니다.
 * - 누구나: 게시된 글 읽기, 상담 신청 넣기
 * - 관리자(초대받은 이메일로 가입): 글 쓰기·검토 요청, 상담 신청 보기
 * - 승인자: 글 게시·반려, 관리자 초대
 * 환경 변수 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 있으면 그 값을 씁니다.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lyqysvujgfnolvkqobek.supabase.co"
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cXlzdnVqZ2Zub2x2a3FvYmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MjMwNzEsImV4cCI6MjEwNjk5OTA3MX0.H3w30AOhkdrtNI8bU38q9vSlVCdiMgOi-newOB1bN2w"

export const POST_IMAGE_BUCKET = "post-images"

export const restHeaders = (token?: string) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token ?? SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
})
