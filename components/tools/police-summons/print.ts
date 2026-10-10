import { STEPS, situationSummary, textOf, type Item, type Situation } from "@/lib/tools/police-summons"
import { siteConfig } from "@/lib/site-config"

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** 인쇄용 문서 (사이트 머리·꼬리 없이 체크리스트만) */
function printHtml(s: Situation, items: Item[], done: Set<string>) {
  const today = new Date()
  const date = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`
  const sections = STEPS.slice(1)
    .map((st) => {
      const rows = items
        .filter((i) => i.step === st.n)
        .map(
          (i) => `<li><span class="box">${done.has(i.id) ? "☑" : "☐"}</span><div><b>${esc(textOf(i.title, s))}</b><p>${esc(textOf(i.desc, s))}</p>${
            i.basis ? `<small>${esc(i.basis)}</small>` : ""
          }</div></li>`,
        )
        .join("")
      return `<h2>${st.n}. ${esc(st.title)}</h2><ul>${rows}</ul>`
    })
    .join("")
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>경찰 출석요구 체크리스트</title><style>
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
<h1>경찰 출석요구 체크리스트</h1>
<p class="meta">${esc(situationSummary(s))}</p>
<p class="meta">출력일 ${date} · ${esc(siteConfig.name)} ${esc(siteConfig.siteUrl)}/tools/police-summons</p>
${sections}
<p class="foot">일반적인 절차를 정리한 참고용 목록입니다. 사건마다 사정이 다르니 구체적인 대응은 변호사와 상의하세요. 근거: 형사소송법, 검사와 사법경찰관의 상호협력과 일반적 수사준칙에 관한 규정(수사준칙), 경찰수사규칙 (2026. 10. 2. 시행 기준).</p>
</body></html>`
}

/** 숨긴 iframe 에 인쇄용 문서를 넣고 인쇄 창을 띄움 */
export function printChecklist(s: Situation, items: Item[], done: Set<string>) {
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
  doc.write(printHtml(s, items, done))
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
