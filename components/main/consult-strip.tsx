import { ConsultForm } from "@/components/consult-form"

/** 첫 화면 바로 아래 상담 띠: 이름·연락처·분야만 */
export function ConsultStrip() {
  return (
    <section id="consult" className="scroll-mt-24 bg-jisan-stone border-b border-[#E4E6E9] px-5 md:px-12 lg:px-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-4 lg:gap-8 items-start py-6">
        <div>
          <h2 className="text-base font-bold text-jisan-ink">연락처만 남기셔도 됩니다.</h2>
          <p className="text-[13px] text-[#4A505A]">상담했다고 선임을 권하지 않습니다.</p>
        </div>
        <ConsultForm idPrefix="strip" layout="strip" source="메인 상담 띠" />
      </div>
    </section>
  )
}
