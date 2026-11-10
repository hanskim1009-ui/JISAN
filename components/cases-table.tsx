"use client"

import { useState } from "react"
import Link from "next/link"
import type { CaseField, CaseItem } from "@/lib/content"
import { lawyers } from "@/lib/lawyers"
import type { Lang } from "@/lib/langs"
import { L, makeT, type Dict } from "@/lib/i18n/fmt"

const TABS: ("전체" | CaseField)[] = ["전체", "형사", "가사", "기업", "의료", "부동산", "민사"]

/**
 * 업무사례 짧은 표. 메인·센터에서 몇 건만 보여 줄 때 씁니다 (전체 목록은 components/cases-browser.tsx).
 * 분야 탭은 사례가 두 분야 이상 있을 때만 보입니다.
 */
export function CasesTable({ items, tabs = true, lang = "ko", dict }: { items: CaseItem[]; tabs?: boolean; lang?: Lang; dict?: Dict }) {
  const t = makeT(dict)
  const name = (slug: string) => {
    const l = lawyers.find((x) => x.slug === slug)
    return l ? t(l.name) : ""
  }
  const [tab, setTab] = useState<(typeof TABS)[number]>("전체")
  const shown = tab === "전체" ? items : items.filter((c) => c.field === tab)
  const fieldsHere = new Set(items.map((c) => c.field))
  const showTabs = tabs && fieldsHere.size > 1

  return (
    <div className="min-w-0">
      {showTabs && (
        <div className="mb-1 flex gap-5 text-sm" role="tablist" aria-label={t("분야")}>
          {TABS.filter((x) => x === "전체" || fieldsHere.has(x)).map((tab0) => (
            <button
              key={tab0}
              type="button"
              role="tab"
              aria-selected={tab === tab0}
              onClick={() => setTab(tab0)}
              className={`py-1 ${tab === tab0 ? "border-b-2 border-jisan-ink font-semibold text-jisan-ink" : "text-[#4A505A] hover:text-jisan-ink"}`}
            >
              {t(tab0)}
            </button>
          ))}
        </div>
      )}
      <ul className="border-t border-jisan-ink text-[0.9375rem]">
        {shown.map((c) => (
          <li key={c.id} className="border-b border-[#E4E6E9]">
            <Link href={`${L(lang, "/cases")}/${c.id}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-0.5 py-3 md:grid-cols-[11rem_1fr_auto_4.5rem]">
              <span className="col-span-2 text-[0.8125rem] text-[#4A505A] md:col-span-1 md:text-[0.9375rem]">{c.caseType}</span>
              <span className="text-jisan-ink underline-offset-4 group-hover:underline">{c.situation}</span>
              <span className="text-right font-bold text-brand-accent md:whitespace-nowrap">{c.result}</span>
              <span className="hidden text-right text-[#8A9099] md:block">{c.lawyers.map(name).join(", ")}</span>
            </Link>
          </li>
        ))}
        {shown.length === 0 && <li className="py-6 text-sm text-[#8A9099]">{t("이 분야의 업무사례는 아직 정리 중입니다.")}</li>}
      </ul>
    </div>
  )
}
