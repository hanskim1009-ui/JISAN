import { SentencingIntlPage, sentencingIntlMetadata } from "@/components/tools/sentencing/intl-page"

/** 번역 사전(content/tools/i18n/zh/)이 다 갖춰지지 않았으면 404 */
export const dynamic = "force-static"

export function generateMetadata() {
  return sentencingIntlMetadata("zh")
}

export default function Page() {
  return <SentencingIntlPage lang="zh" />
}
