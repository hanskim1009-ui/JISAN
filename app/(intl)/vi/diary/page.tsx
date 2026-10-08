import { DiaryPage, diaryMetadata } from "@/components/site-pages/diary-page"

export const metadata = diaryMetadata("vi")
export const revalidate = 300

export default function Page() {
  return <DiaryPage lang="vi" />
}
