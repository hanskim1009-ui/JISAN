import { siteConfig } from "@/lib/site-config"

/**
 * 센터 사이트 설정
 * 여기에 센터를 추가하면 jisanlaw.com/{slug} 에 센터 전용 사이트가 생깁니다.
 * 센터 사이트에는 그 센터의 메뉴·사례·변호사만 보이고, 다른 분야는 보이지 않습니다.
 *
 * 처벌 기준·FAQ 등 법률 내용은 게시 전 담당 변호사 검수가 필요합니다.
 * 광고 규정: '전문', 승소율·석방률, 결과 보장 표현은 쓰지 않습니다.
 */

/** dark: 형사·성범죄·마약 / warm: 이혼·상간 등 가사 */
export type CenterTone = "dark" | "warm"

export type CenterStage = {
  label: string
  hint: string
  /** 페이지 안 이동(#process) 또는 tel: 링크 */
  href: string
  /** 체포·구속 등 급한 단계: 강조 표시하고 전화로 연결 */
  urgent?: boolean
}

export type CenterArea = { name: string; law?: string; desc: string; href?: string }

export type CenterPenalty = { crime: string; penalty: string; extra: string }

export type CenterProcess = { title: string; steps: { title: string; desc: string }[] }

export type Center = {
  slug: string
  name: string
  /** 메인 사이트 카드에 쓰는 한 줄 설명 */
  summary: string
  tone: CenterTone
  seo: { title: string; description: string; keywords: string[] }
  hero: { title: string; sub: string }
  stageTitle: string
  stages: CenterStage[]
  areasTitle: string
  areas: CenterArea[]
  penalties?: CenterPenalty[]
  processes: CenterProcess[]
  /** 담당 변호사 (lib/lawyers.ts의 slug) + 센터에서 보여 줄 경력 한 줄 */
  lawyers: { slug: string; note: string }[]
  faqs: { q: string; a: string }[]
  form: { caseType: string; stageOptions: string[] }
  closing: string
}

const urgentCall: Pick<CenterStage, "href" | "hint" | "urgent"> = {
  href: siteConfig.phoneHref,
  hint: "바로 전화 →",
  urgent: true,
}

const suspectProcess: CenterProcess = {
  title: "피의자 변호 절차",
  steps: [
    { title: "1:1 심층 상담", desc: "대표변호사가 직접 상담해 사실관계를 파악하고 골든타임을 확보합니다." },
    { title: "방향 설정·증거 수집", desc: "혐의 인정 여부를 정하고 CCTV, 디지털 포렌식 등 유리한 증거를 확보합니다." },
    { title: "조사 연습", desc: "예상 질문을 뽑아 모의 조사를 진행해 실언을 막습니다." },
    { title: "조사 동석", desc: "조사에 함께 들어가 심리적 안정을 돕고 부당한 유도 신문을 차단합니다." },
    { title: "변호인 의견서 제출", desc: "수사 단계별 맞춤 의견서로 수사기관을 법리적으로 설득합니다." },
  ],
}

const victimProcess: CenterProcess = {
  title: "고소 대리(피해자) 절차",
  steps: [
    { title: "피해 사실·증거 분석", desc: "범죄 성립 요건을 검토하고 핵심 증거를 골라 전략을 세웁니다." },
    { title: "고소장 작성·접수", desc: "수사기관이 수사하기 쉽도록 범죄 사실을 명확히 정리해 제출합니다." },
    { title: "고소인 조사 연습", desc: "예상되는 반박 질문에 대비해 일관된 진술을 준비합니다." },
    { title: "고소인 조사 동석", desc: "조사에 함께 가서 진술을 돕고 수사 진행 상황을 점검합니다." },
    { title: "엄벌 탄원·피해 회복", desc: "엄벌을 위한 의견서를 제출하고 합의와 피해 회복을 돕습니다." },
  ],
}

const confidentialityFaq = {
  q: "상담 내용이 외부에 알려지지 않나요?",
  a: "변호사는 법률상 비밀유지 의무가 있습니다. 상담 사실과 내용은 의뢰인의 동의 없이 외부에 알리지 않습니다.",
}

const criminalStageOptions = ["출석 요구를 받음", "조사 후 결과 대기", "체포·구속", "재판 중", "고소 예정(피해자)"]

export const centers: Center[] = [
  {
    slug: "crime",
    name: "형사센터",
    summary: "경찰조사 동석, 체포·구속 대응, 형사재판, 고소 대리",
    tone: "dark",
    seo: {
      title: "형사변호사 | 수사 초기부터 재판까지 | 지산 형사센터",
      description:
        "경찰 출석 요구, 체포·구속, 형사재판까지 담당 변호사가 직접 대응합니다. 조사 연습, 조사 동석, 변호인 의견서, 고소 대리. 주말·공휴일 24시간 상담. 서울 서초.",
      keywords: ["형사변호사", "서초 형사변호사", "경찰조사 변호사", "구속영장 변호사", "고소대리"],
    },
    hero: {
      title: "수사 초기부터 재판까지,\n변호사가 직접 갑니다.",
      sub: "사무장이나 어쏘 변호사 뒤에 숨지 않습니다. 상담, 조사 연습, 조사 동석, 의견서, 재판까지 담당 변호사가 모든 과정을 직접 수행합니다.",
    },
    stageTitle: "지금 어느 단계인가요?",
    stages: [
      { label: "경찰 출석 요구를 받았어요", hint: "조사 전 준비 →", href: "#process" },
      { label: "조사를 받고 결과를 기다려요", hint: "의견서 제출 →", href: "#process" },
      { label: "가족이 체포·구속됐어요", ...urgentCall },
      { label: "재판을 앞두고 있어요", hint: "공판 대응 →", href: "#consult" },
      { label: "피해를 입어 고소하려고 해요", hint: "고소 대리 →", href: "#process" },
    ],
    areasTitle: "주요 업무",
    areas: [
      {
        name: "체포·구속 대응",
        desc: "체포 후 48시간 안에 구속영장 청구 여부가 정해집니다. 즉시 유치장 접견과 증거 수집으로 시간을 확보하고, 신속한 의견서로 방어권을 지킵니다.",
      },
      {
        name: "성범죄",
        desc: "성범죄의 사실인정은 '성인지 감수성' 법리에 따라 일반 사건과 결이 다릅니다. 수사·기소·공판 전 과정을 이해한 대응으로 방어합니다.",
        href: "/sex-crime",
      },
      {
        name: "마약",
        desc: "긴급체포 직후 구속영장 단계부터 대응합니다. 투약·매매·수수 등 혐의별로 석방과 처분을 준비합니다.",
      },
      {
        name: "음주·교통",
        desc: "양형 기준이 정형화된 음주운전·교통사고 사건에서도 실제로 인정되는 감경 사유를 찾아 주장합니다.",
      },
      {
        name: "사기·횡령·배임",
        desc: "피해 금액과 피해 회복 여부가 처분을 크게 좌우합니다. 투자사기·자본시장법 사건의 고소 대리와 피의자 변호를 모두 맡습니다.",
      },
      {
        name: "폭행·상해",
        desc: "쌍방 폭행, 정당방위 주장, 합의 시점 판단까지 사건 초기에 방향을 정합니다.",
      },
    ],
    processes: [suspectProcess, victimProcess],
    lawyers: [
      { slug: "kim-hansol", note: "전) 인천지방검찰청 · 수원지방검찰청 안산지청 · 대전지방검찰청 홍성지청 검사" },
      { slug: "koo-bonwoo", note: "자본시장법 위반, 투자사기, 횡령·배임 등 경제 형사 사건" },
    ],
    faqs: [
      {
        q: "경찰에서 출석 요구를 받았습니다. 바로 가야 하나요?",
        a: "출석 일시는 수사관과 협의해 조정할 수 있습니다. 서두르기보다 혐의 내용을 확인하고 변호인과 진술 방향을 정한 뒤 출석하는 것이 안전합니다. 피의자 조사에는 변호인이 참여할 수 있습니다.",
      },
      {
        q: "가족이 체포됐습니다. 지금 무엇을 해야 하나요?",
        a: "체포 후 48시간 안에 구속영장 청구 여부가 정해집니다. 변호인은 체포 직후부터 접견할 수 있으니 바로 연락 주세요. 주말·공휴일에도 24시간 상담합니다.",
      },
      {
        q: "조사에 변호사가 같이 들어갈 수 있나요?",
        a: "네. 피의자신문에는 변호인이 참여할 수 있습니다(형사소송법 제243조의2). 고소인 조사에도 동석해 진술을 돕습니다.",
      },
      {
        q: "피해자와 합의하면 처벌받지 않나요?",
        a: "죄명에 따라 다릅니다. 반의사불벌죄는 피해자가 처벌을 원하지 않으면 처벌할 수 없지만, 그 밖의 범죄에서는 합의가 처분과 양형에 유리하게 반영되는 데 그칩니다. 합의 시점과 방법도 결과에 영향을 줍니다.",
      },
      confidentialityFaq,
      {
        q: "주말이나 밤에도 상담할 수 있나요?",
        a: "주말·공휴일을 포함해 24시간 전화 상담이 가능합니다. 카카오톡이나 상담 신청을 남겨 주시면 확인 후 연락드립니다.",
      },
    ],
    form: { caseType: "형사", stageOptions: criminalStageOptions },
    closing: "조사 일정이 잡혔다면, 출석 전에 연락하세요.",
  },
  {
    slug: "sex-crime",
    name: "성범죄센터",
    summary: "강제추행, 카메라등이용촬영, 통신매체이용음란, 아청법",
    tone: "dark",
    seo: {
      title: "성범죄변호사 | 수사 초기 대응 | 지산 성범죄센터",
      description:
        "강제추행, 카메라등이용촬영, 통신매체이용음란 등 성범죄 사건을 첫 조사 전부터 담당 변호사가 직접 대응합니다. 처벌 기준, 신상정보 등록, 대응 절차 안내. 24시간 상담.",
      keywords: ["성범죄변호사", "강제추행변호사", "카메라촬영 변호사", "통신매체이용음란", "성범죄 경찰조사"],
    },
    hero: {
      title: "성범죄 사건은 첫 조사 전에\n방향을 정해야 합니다.",
      sub: "진술 하나가 처분을 바꿉니다. 조사 일정이 잡혔다면 출석 전에 변호사와 사실관계부터 정리하세요.",
    },
    stageTitle: "지금 어느 단계인가요?",
    stages: [
      { label: "출석 요구를 받았어요", hint: "조사 전 준비 →", href: "#process" },
      { label: "조사를 받고 결과를 기다려요", hint: "의견서·합의 →", href: "#process" },
      { label: "체포·구속됐어요", ...urgentCall },
      { label: "재판을 앞두고 있어요", hint: "공판 대응 →", href: "#consult" },
      { label: "피해를 입었어요", hint: "고소 대리 →", href: "#process" },
    ],
    areasTitle: "세부 사건",
    areas: [
      { name: "강제추행", law: "형법 제298조", desc: "직장·지인 관계, 대중교통, 술자리 등. 신체 접촉 여부와 고의가 쟁점입니다." },
      { name: "카메라등이용촬영", law: "성폭력처벌법 제14조", desc: "촬영, 소지·시청, 유포. 디지털 포렌식 결과에 대한 대응이 중요합니다." },
      { name: "통신매체이용음란", law: "성폭력처벌법 제13조", desc: "메시지·SNS로 성적 수치심을 일으키는 말이나 영상을 보낸 경우입니다." },
      { name: "준강간·준강제추행", law: "형법 제299조", desc: "음주 등으로 항거불능 상태였는지, 그 상태를 알았는지가 쟁점입니다." },
      { name: "아동·청소년 대상 성범죄", law: "청소년성보호법", desc: "처벌이 무겁고 신상정보 공개·고지 대상이 될 수 있어 초기 대응이 특히 중요합니다." },
      { name: "성매매", law: "성매매처벌법", desc: "구매·알선. 초범은 교육 조건부 기소유예 등 처분 가능성을 검토합니다." },
    ],
    penalties: [
      { crime: "강제추행", penalty: "10년 이하 징역 또는 1,500만원 이하 벌금", extra: "신상정보 등록, 취업제한, 이수명령" },
      { crime: "카메라등이용촬영", penalty: "7년 이하 징역 또는 5,000만원 이하 벌금", extra: "신상정보 등록, 취업제한, 촬영물 몰수" },
      { crime: "통신매체이용음란", penalty: "2년 이하 징역 또는 2,000만원 이하 벌금", extra: "선고 형에 따라 신상정보 등록" },
    ],
    processes: [suspectProcess, victimProcess],
    lawyers: [{ slug: "kim-hansol", note: "전) 인천지방검찰청 · 수원지방검찰청 안산지청 · 대전지방검찰청 홍성지청 검사" }],
    faqs: [
      {
        q: "경찰 출석 요구를 받았는데 바로 가야 하나요?",
        a: "출석 일시는 수사관과 협의해 조정할 수 있습니다. 성범죄는 첫 진술이 사건의 방향을 정하는 경우가 많아, 출석 전에 변호인과 사실관계를 정리하는 것이 안전합니다.",
      },
      {
        q: "합의하면 처벌을 피할 수 있나요?",
        a: "강제추행·카메라촬영 등 대부분의 성범죄는 피해자가 처벌을 원하지 않아도 기소할 수 있습니다. 다만 합의는 기소 여부와 양형에 중요한 사정으로 반영됩니다. 합의는 피해자 측 의사를 존중하는 방식으로, 변호인을 통해 진행하는 것이 안전합니다.",
      },
      {
        q: "신상정보 등록은 어떤 경우에 되나요?",
        a: "등록대상 성범죄로 유죄판결이나 약식명령이 확정되면 신상정보 등록 대상이 됩니다. 죄명과 선고 형에 따라 예외가 있어 처분 단계에서 미리 검토해야 합니다.",
      },
      {
        q: "회사나 가족에게 알려지나요?",
        a: "수사기관이 회사나 가족에게 수사 사실을 따로 알리는 것은 일반적이지 않습니다. 다만 공무원 등 일부 직군은 수사개시 통보 제도가 있어 직업에 따라 미리 확인해야 합니다.",
      },
      {
        q: "기억이 잘 나지 않는데 조사에서 어떻게 말해야 하나요?",
        a: "추측으로 답하면 나중에 진술이 바뀌었을 때 신빙성이 떨어집니다. 기억나는 것과 나지 않는 것을 구분해 진술하는 것이 원칙이며, 출석 전에 변호인과 사실관계를 정리해 두세요.",
      },
      confidentialityFaq,
    ],
    form: { caseType: "성범죄", stageOptions: criminalStageOptions },
    closing: "혼자 조사받으러 가지 마세요.",
  },
]

export function getCenter(slug: string) {
  return centers.find((c) => c.slug === slug)
}
