/** 브라우저 쪽 번역: 서버가 골라 준 작은 사전(dict)만 씀 (전체 번역 파일을 브라우저로 보내지 않음) */
export type Dict = Record<string, string>
export type TFn = (ko: string, vars?: Record<string, string | number>) => string

export function fmt(s: string, vars?: Record<string, string | number>) {
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

export const makeT =
  (dict?: Dict): TFn =>
  (ko, vars) =>
    fmt(dict?.[ko] ?? ko, vars)

/** 언어별 주소: L("en", "/about") → "/en/about", L("en", "/") → "/en" (브라우저·서버 공용) */
export function L(lang: string, path: string) {
  if (lang === "ko") return path
  if (path === "/") return `/${lang}`
  if (path.startsWith("/#")) return `/${lang}${path.slice(1)}`
  return `/${lang}${path}`
}
