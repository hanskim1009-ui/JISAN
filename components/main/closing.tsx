import { siteConfig } from "@/lib/site-config"

/** 메인 마지막 문장: 결과를 약속하지 않고 상담에서 하는 일을 말합니다 */
export function Closing() {
  return (
    <section className="bg-jisan-ink text-white px-5 md:px-12 lg:px-14 py-14 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl md:text-[1.875rem] font-bold leading-[1.45] tracking-tight text-balance">
            어디서부터 물어봐야 할지 모르겠다면,
            <br className="hidden sm:block" /> 그것부터 물어보세요.
          </h2>
          <p className="mt-3 text-[15px] text-white/70">{siteConfig.address}</p>
        </div>
        <a href={siteConfig.phoneHref} className="md:text-right">
          <span className="block text-3xl font-extrabold tabular-nums tracking-tight">{siteConfig.phone}</span>
          <span className="text-[13px] text-white/65">24시간 · 주말·공휴일 포함</span>
        </a>
      </div>
    </section>
  )
}
