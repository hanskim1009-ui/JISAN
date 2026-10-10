/** 구조화 데이터 (schema.org JSON-LD). 글 속 < 는 이스케이프해서 script 가 끊기지 않게 */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
