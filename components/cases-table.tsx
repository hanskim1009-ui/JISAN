"use client"

import { useState } from "react"
import Link from "next/link"
import type { CaseField, CaseItem } from "@/lib/content"
import { lawyers } from "@/lib/lawyers"
import type { Lang } from "@/lib/langs"
import { L, makeT, type Dict } from "@/lib/i18n/fmt"

const TABS: ("전체" | CaseField)[] = ["전체", "형사", "가사", "기업", "의료", "부동산", "민사"]

/** 업무사례 표 (분야 탭). 메인·업무사례 페이지·센터에서 함께 씁니다 */
export function CasesTable({ items, tabs = true, lang = "ko", dict }: { items: CaseItem[]; tabs?: boolean; lang?: Lang; dict?: Dict }) {
  const t = makeT(dict)
  const name = (slug: string) => {
    const l = lawyers.find((x) => x.slug === slug)
    return l ? t(l.name) : ""
  }
  const [tab, setTab] = useState<(typeof TABS)[number]>("전체")
  const shown = tab === "전체" ? items : items.filter((c) => c.field === tab)

  return (
    <div className="min-w-0">
      {tabs && (
        <div className="mb-1 flex gap-5 text-sm" role="tablist" aria-label={t("분야")}>
          {TABS.map((tab0) => (
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-jisan-ink text-xs text-[#8A9099]">
              <th className="py-2 pr-3 font-medium">{t("시기")}</th>
              <th className="py-2 pr-3 font-medium">{t("분야")}</th>
              <th className="py-2 pr-3 font-medium">{t("의뢰인의 상황")}</th>
              <th className="py-2 pr-3 font-medium">{t("결과")}</th>
              <th className="py-2 font-medium">{t("담당")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c.id} className="border-b border-[#E4E6E9] align-top">
                <td className="py-3 pr-3 text-[#8A9099] tabular-nums whitespace-nowrap">{c.decidedOn}</td>
                <td className="py-3 pr-3 whitespace-nowrap">{t(c.field)}</td>
                <td className="py-3 pr-3">
                  <Link href={`${L(lang, "/cases")}/${c.id}`} className="text-jisan-ink hover:underline underline-offset-4">
                    {c.situation}
                  </Link>
                </td>
                <td className="py-3 pr-3 font-bold text-brand-accent whitespace-nowrap">{c.result}</td>
                <td className="py-3 whitespace-nowrap">{c.lawyers.map(name).join(", ")}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-sm text-[#8A9099]">
                  {t("이 분야의 업무사례는 아직 정리 중입니다.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
