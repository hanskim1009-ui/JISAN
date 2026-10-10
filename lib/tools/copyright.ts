/**
 * 계산기·자가진단 페이지 아래의 무단 복제 금지 안내 (ToolShell 이 모든 계산기 페이지에 붙임).
 * {firm} 은 사무소 이름(한국어는 siteConfig.name, 외국어는 nameEn), {year} 는 빌드한 해.
 */
import { siteConfig } from "@/lib/site-config"
import type { Lang } from "@/lib/langs"
import { fmt } from "@/lib/i18n/fmt"

const TEXT: Record<Lang, string> = {
  ko: "© {year} {firm}. 이 페이지의 질문 구성, 판단 기준의 정리, 결과 문구와 데이터는 {firm}에서 만든 저작물이자 데이터베이스입니다. 허락 없이 복제·배포·변형하거나 다른 사이트·서비스에 옮겨 쓰는 것, 자동으로 수집(크롤링)하는 것을 금지합니다. 위반하면 저작권법과 부정경쟁방지 및 영업비밀보호에 관한 법률에 따라 민사·형사상 책임을 물을 수 있습니다.",
  en: "© {year} {firm}. The question structure, the organisation of the criteria, the result wording and the data on this page are works and a database created by {firm}. Copying, distributing or modifying them, reusing them on other websites or services, or collecting them automatically (scraping) without permission is prohibited. Violations may lead to civil and criminal liability under the Korean Copyright Act and the Unfair Competition Prevention and Trade Secret Protection Act.",
  zh: "© {year} {firm}。本页面的问题设计、判断标准的整理、结果文字及数据均为{firm}制作的著作物和数据库。未经许可，禁止复制、传播、修改，禁止转用于其他网站或服务，禁止自动采集（爬取）。违者可依韩国《著作权法》及《防止不正当竞争及保护商业秘密法》追究民事和刑事责任。",
  vi: "© {year} {firm}. Cấu trúc câu hỏi, cách hệ thống hóa tiêu chí, nội dung kết quả và dữ liệu trên trang này là tác phẩm và cơ sở dữ liệu do {firm} xây dựng. Nghiêm cấm sao chép, phát tán, chỉnh sửa, sử dụng lại trên trang web hoặc dịch vụ khác, hoặc thu thập tự động (crawling) khi chưa được cho phép. Hành vi vi phạm có thể bị truy cứu trách nhiệm dân sự và hình sự theo Luật Bản quyền và Luật Phòng chống cạnh tranh không lành mạnh và Bảo vệ bí mật kinh doanh của Hàn Quốc.",
  ru: "© {year} {firm}. Структура вопросов, систематизация критериев, тексты результатов и данные на этой странице являются произведением и базой данных, созданными {firm}. Без разрешения запрещается копировать, распространять, изменять их, использовать на других сайтах и в сервисах, а также собирать их автоматически (парсинг). Нарушение может повлечь гражданскую и уголовную ответственность по Закону Республики Корея об авторском праве и Закону о предотвращении недобросовестной конкуренции и защите коммерческой тайны.",
  mn: "© {year} {firm}. Энэ хуудасны асуултын бүтэц, шалгуурын системчлэл, үр дүнгийн бичвэр болон өгөгдөл нь {firm}-ийн бүтээсэн бүтээл, өгөгдлийн сан юм. Зөвшөөрөлгүйгээр хуулбарлах, түгээх, өөрчлөх, бусад вэбсайт, үйлчилгээнд ашиглах, автоматаар цуглуулах (crawling)-ыг хориглоно. Зөрчсөн тохиолдолд БНСУ-ын Зохиогчийн эрхийн тухай хууль болон Шударга бус өрсөлдөөнөөс урьдчилан сэргийлэх, худалдааны нууцыг хамгаалах тухай хуулийн дагуу иргэний болон эрүүгийн хариуцлага хүлээлгэж болно.",
}

export function toolCopyright(lang: Lang): string {
  return fmt(TEXT[lang] ?? TEXT.en, { year: new Date().getFullYear(), firm: lang === "ko" ? siteConfig.name : siteConfig.nameEn })
}
