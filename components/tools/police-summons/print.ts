import type { Lang } from "@/lib/langs"
import { HREFLANG } from "@/lib/langs"
import { L } from "@/lib/i18n/fmt"
import { STEP_NUMS, itemText, situationSummary, type Item, type PoliceSummonsText, type Situation } from "@/lib/tools/police-summons"
import { dateText, fmt } from "@/lib/tools/i18n-format"
import { siteConfig } from "@/lib/site-config"

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** 인쇄용 문서 (사이트 머리·꼬리 없이 체크리스트만) */
export function printHtml(lang: Lang, t: PoliceSummonsText, brand: string, s: Situation, items: Item[], done: Set<string>, today = new Date()) {
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  const date = dateText(lang, iso, false)
  const sections = STEP_NUMS.slice(1)
    .map((n) => {
      const rows = items
        .filter((i) => i.step === n)
        .map((i) => {
          const x = itemText(t, i, s)
          return `<li><span class="box">${done.has(i.id) ? "☑" : "☐"}</span><div><b>${esc(x.title)}</b><p>${esc(x.desc)}</p>${x.basis ? `<small>${esc(x.basis)}</small>` : ""}</div></li>`
        })
        .join("")
      return `<h2>${n}. ${esc(t.steps[String(n) as "2" | "3" | "4"])}</h2><ul>${rows}</ul>`
    })
    .join("")
  return `<!doctype html><html lang="${HREFLANG[lang]}"><head><meta charset="utf-8"><title>${esc(t.print.title)}</title><style>
@page{margin:16mm 14mm}
body{font-family:"Pretendard","Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:#111;font-size:10.5pt;line-height:1.5;margin:0}
h1{font-size:16pt;margin:0 0 4px}
.meta{color:#555;font-size:9pt;margin:0 0 4px}
h2{font-size:12pt;margin:18px 0 6px;border-bottom:1px solid #999;padding-bottom:3px}
ul{list-style:none;margin:0;padding:0}
li{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #e3e3e3;break-inside:avoid}
.box{font-size:13pt;line-height:1.1}
p{margin:2px 0 0}
small{color:#666;font-size:8.5pt}
.foot{margin-top:16px;color:#555;font-size:8.5pt}
</style></head><body>
<h1>${esc(t.print.title)}</h1>
<p class="meta">${esc(situationSummary(t, s))}</p>
<p class="meta">${esc(fmt(t.print.date, { date }))} · ${esc(brand)} ${esc(siteConfig.siteUrl)}${L(lang, "/tools/police-summons")}</p>
${sections}
<p class="foot">${esc(t.print.foot)}</p>
</body></html>`
}

/** 숨긴 iframe 에 인쇄용 문서를 넣고 인쇄 창을 띄움 */
export function printChecklist(lang: Lang, t: PoliceSummonsText, brand: string, s: Situation, items: Item[], done: Set<string>) {
  const frame = document.createElement("iframe")
  frame.setAttribute("aria-hidden", "true")
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0"
  document.body.appendChild(frame)
  const win = frame.contentWindow
  const doc = win?.document
  if (!win || !doc) {
    frame.remove()
    window.print()
    return
  }
  doc.open()
  doc.write(printHtml(lang, t, brand, s, items, done))
  doc.close()
  const cleanup = () => setTimeout(() => frame.remove(), 1000)
  win.addEventListener("afterprint", cleanup)
  // 글꼴·레이아웃이 잡힌 뒤 인쇄
  setTimeout(() => {
    try {
      win.focus()
      win.print()
    } catch {
      window.print()
    }
    // afterprint 가 안 오는 브라우저 대비
    setTimeout(() => frame.remove(), 60000)
  }, 100)
}
