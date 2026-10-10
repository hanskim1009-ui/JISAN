/**
 * 경찰 출석요구 체크리스트 (/tools/police-summons).
 * 상황(1단계)에 따라 2~4단계 항목이 달라집니다.
 *
 * 근거 (국가법령정보센터 현행 원문, 2026. 10. 10. 확인)
 * - 형사소송법 [시행 2026. 10. 2.] 제30조, 제200조, 제200조의2, 제200조의5, 제218조, 제218조의2, 제221조, 제221조의2,
 *   제238조, 제243조의2, 제244조, 제244조의3, 제244조의4, 제244조의5, 제244조의6, 제245조의5~제245조의7, 제245조의12
 * - 검사와 사법경찰관의 상호협력과 일반적 수사준칙에 관한 규정(수사준칙) [시행 2026. 10. 2.]
 *   제13조, 제14조, 제19조, 제21조~제25조, 제42조, 제53조, 제69조
 * - 경찰수사규칙 [시행 2026. 10. 2.] 제11조, 제12조, 제34조, 제87조, 제97조
 * 중대범죄수사청 등 다른 수사기관의 조사에는 별도 규정이 적용될 수 있습니다.
 */

export type Role = "unknown" | "suspect" | "witness" | "victim"
export type DaysLeft = "soon" | "week" | "later" | "unset"
export type Via = "call" | "letter"

export type Situation = {
  role: Role
  days: DaysLeft
  via: Via
  /** 체포될까 걱정됨 (피의자·모름일 때만 물음) */
  arrest: boolean
  /** 변호인과 함께 갈 계획 */
  counsel: boolean
  /** 휴대전화를 가져오거나 내라는 말을 들음 */
  phone: boolean
}

export const DEFAULT_SITUATION: Situation = {
  role: "unknown",
  days: "week",
  via: "call",
  arrest: false,
  counsel: false,
  phone: false,
}

type Text = string | ((s: Situation) => string)

export type Item = {
  id: string
  step: 2 | 3 | 4
  title: Text
  desc: Text
  /** 근거 조문 (짧게) */
  basis?: string
  /** 이 상황에서 보일지. 없으면 항상 */
  when?: (s: Situation) => boolean
  /** 이 상황에서 먼저 챙길 항목으로 표시 */
  urgent?: (s: Situation) => boolean
}

export const STEPS = [
  { n: 1, title: "지금 상황" },
  { n: 2, title: "출석 전 확인할 것" },
  { n: 3, title: "조사 당일" },
  { n: 4, title: "조사 후" },
] as const

/** 1단계 질문 */
export const QUESTIONS = {
  role: {
    label: "어떤 신분으로 부르는지 아시나요?",
    help: "피의자는 범죄 혐의를 받아 수사받는 사람, 참고인은 혐의 없이 본 일·들은 일을 진술하러 가는 사람입니다.",
    options: [
      { value: "unknown", label: "잘 모르겠음" },
      { value: "suspect", label: "피의자" },
      { value: "witness", label: "참고인" },
      { value: "victim", label: "피해자·고소인" },
    ],
  },
  days: {
    label: "출석일까지 남은 날",
    options: [
      { value: "soon", label: "오늘·내일" },
      { value: "week", label: "2~7일" },
      { value: "later", label: "8일 이상" },
      { value: "unset", label: "아직 날짜를 안 정함" },
    ],
  },
  via: {
    label: "어떻게 연락을 받았나요?",
    options: [
      { value: "call", label: "전화·문자" },
      { value: "letter", label: "출석요구서(우편 등)" },
    ],
  },
  arrest: {
    label: "체포될까 걱정되나요?",
    help: "출석 요구에 여러 번 응하지 못했거나, 사안이 무겁다고 들었다면 '걱정됨'을 고르세요.",
    options: [
      { value: "no", label: "아니요" },
      { value: "yes", label: "걱정됨" },
    ],
  },
  counsel: {
    label: "변호인과 함께 갈 계획인가요?",
    options: [
      { value: "no", label: "아니요·아직 모름" },
      { value: "yes", label: "예" },
    ],
  },
  phone: {
    label: "휴대전화를 가져오라거나 내라는 말을 들었나요?",
    options: [
      { value: "no", label: "아니요" },
      { value: "yes", label: "예" },
    ],
  },
} as const

const isSuspectSide = (s: Situation) => s.role === "suspect" || s.role === "unknown"
const isNonSuspect = (s: Situation) => s.role === "witness" || s.role === "victim"

export const ITEMS: Item[] = [
  // ── 2. 출석 전 확인할 것 ──
  {
    id: "verify-caller",
    step: 2,
    title: "진짜 경찰서 연락인지 확인하기",
    desc: "낯선 번호였다면 해당 경찰서 대표번호로 다시 걸어 부서와 수사관 이름이 맞는지 확인합니다. 돈을 보내라거나 앱 설치, 계좌·비밀번호를 요구하면 수사기관의 연락이 아닙니다.",
    when: (s) => s.via === "call",
    urgent: (s) => s.via === "call",
  },
  {
    id: "case-info",
    step: 2,
    title: "사건번호와 담당 수사관 받아 적기",
    desc: "사건번호, 담당 부서, 수사관 이름과 연락처, 출석 일시와 장소를 한 곳에 적어 둡니다.",
  },
  {
    id: "ask-role",
    step: 2,
    title: "내가 피의자인지 참고인인지 물어보기",
    desc: "피의자와 피의자 아닌 사람에게 보내는 출석요구서 서식이 따로 있습니다. 신분에 따라 준비할 것이 달라지니 먼저 확인하세요.",
    basis: "경찰수사규칙 제34조",
    when: (s) => s.role === "unknown",
    urgent: () => true,
  },
  {
    id: "ask-charge",
    step: 2,
    title: "무슨 사건인지, 어떤 혐의인지 물어보기",
    desc: (s) =>
      s.via === "call"
        ? "출석요구는 원래 피의사실의 요지 등 출석 이유를 구체적으로 적은 출석요구서로 해야 하고, 급할 때만 전화·문자로 할 수 있습니다. 전화로 받았다면 어떤 혐의인지, 누가 고소했는지 물어보세요."
        : "출석요구서에는 피의사실의 요지 등 출석 이유가 구체적으로 적혀야 합니다. 적힌 내용을 다시 읽고 모르는 부분은 수사관에게 물어보세요.",
    basis: "수사준칙 제19조 제3항",
    when: isSuspectSide,
  },
  {
    id: "ask-topic",
    step: 2,
    title: "무엇을 묻고 싶은지 물어보기",
    desc: (s) =>
      s.role === "victim"
        ? "어떤 부분을 더 확인하려는지, 가져올 자료가 있는지 물어보면 준비하기 쉽습니다."
        : "어떤 사건인지, 누가 피의자인지, 내가 본 일·들은 일 가운데 어느 부분을 묻는지 물어봅니다.",
    when: isNonSuspect,
  },
  {
    id: "complaint-copy",
    step: 2,
    title: "고소 사건이면 고소장 열람·복사 신청 검토하기",
    desc: "피의자는 필요한 사유를 밝히고 고소장 가운데 내 혐의사실 부분을 열람·복사해 달라고 신청할 수 있습니다. 무엇을 문제 삼는지 알면 준비가 빨라집니다.",
    basis: "수사준칙 제69조 제3항",
    when: (s) => s.role === "suspect",
  },
  {
    id: "phone-brief",
    step: 2,
    title: "전화로 사건 내용을 길게 설명하지 않기",
    desc: "통화 내용도 수사보고서로 남을 수 있습니다. 자세한 이야기는 출석해서 하겠다고 하고 일정만 정해도 됩니다.",
    when: isSuspectSide,
  },
  {
    id: "reschedule-now",
    step: 2,
    title: "준비가 안 됐다면 오늘 바로 연기 요청하기",
    desc: "피의자가 출석 일시를 미뤄 달라고 하면 특별한 사정이 없는 한 조정하도록 정해져 있습니다. 날짜가 지나기 전에 먼저 연락해 사유와 가능한 날짜 두세 개를 말하고, 바뀐 날짜는 문자로 확인받아 두세요. 참고인 등 피의자 아닌 사람도 같습니다.",
    basis: "수사준칙 제19조 제1항 제3호, 제6항",
    when: (s) => s.days === "soon",
    urgent: () => true,
  },
  {
    id: "reschedule",
    step: 2,
    title: "날짜가 맞지 않으면 연기 요청하기",
    desc: "출석요구는 생업에 지장이 없도록 시간 여유를 두고 해야 하고, 연기 요청이 있으면 특별한 사정이 없는 한 조정해야 합니다. 바뀐 날짜는 문자로 한 번 더 확인받아 두세요.",
    basis: "수사준칙 제19조 제1항 제3호, 제6항",
    when: (s) => s.days === "week" || s.days === "later",
  },
  {
    id: "schedule-agree",
    step: 2,
    title: "조사 일시와 장소를 협의해서 정하기",
    desc: (s) =>
      `수사관은 조사 일시·장소를 협의해야 하고${s.counsel ? ", 변호인이 있으면 변호인과도 협의해야 합니다" : ""}. 일정이 정해지면 문자로 확인받아 두세요.`,
    basis: "수사준칙 제19조 제2항, 제6항",
    when: (s) => s.days === "unset" || s.counsel,
  },
  {
    id: "alt-method",
    step: 2,
    title: "꼭 출석해야 하는지, 다른 방법은 없는지 물어보기",
    desc: "간단한 사실 확인이면 우편·전자우편·전화 진술처럼 출석을 대신할 방법을 먼저 고려하게 돼 있습니다. 치료 등으로 경찰서에 나가기 매우 어렵다면 경찰서 밖에서 조사할 수도 있습니다.",
    basis: "수사준칙 제19조 제1항 제1호, 제5항",
  },
  {
    id: "no-show",
    step: 2,
    title: "연락 없이 출석하지 않는 일 만들지 않기",
    desc: "피의자가 정당한 이유 없이 출석요구에 응하지 않거나 응하지 않을 우려가 있으면 체포영장이 청구될 수 있습니다. 못 가게 되면 반드시 먼저 연락하고 새 날짜를 정하세요.",
    basis: "형사소송법 제200조의2 제1항",
    when: isSuspectSide,
    urgent: (s) => s.arrest,
  },
  {
    id: "witness-voluntary",
    step: 2,
    title: "참고인 출석은 강제가 아니라는 점 알아 두기",
    desc: "피의자 아닌 사람의 출석·진술은 스스로 정할 수 있습니다. 다만 수사에 꼭 필요한 사실을 안다고 명백히 인정되는 사람이 출석이나 진술을 거부하면, 검사가 첫 공판기일 전에 판사에게 증인신문을 청구할 수 있습니다.",
    basis: "형사소송법 제221조 제1항, 제221조의2",
    when: (s) => s.role === "witness",
  },
  {
    id: "arrest-family",
    step: 2,
    title: "가족에게 상황과 변호인 연락처 알려 두기",
    desc: "체포되면 경찰은 피의사실의 요지, 체포 이유, 변호인을 선임할 수 있다는 것을 알려야 합니다. 배우자·직계친족·형제자매도 따로 변호인을 선임할 수 있고, 체포한 때부터 48시간 안에 구속영장을 청구하지 않으면 풀어줘야 합니다.",
    basis: "형사소송법 제200조의5, 제30조 제2항, 제200조의2 제5항 등",
    when: (s) => isSuspectSide(s) && s.arrest,
    urgent: () => true,
  },
  {
    id: "counsel-right",
    step: 2,
    title: "변호인과 함께 조사받을 수 있다는 점 알아 두기",
    desc: "피의자나 변호인, 법정대리인, 배우자, 직계친족, 형제자매가 신청하면 경찰은 정당한 사유가 없는 한 변호인을 신문에 참여하게 해야 합니다.",
    basis: "형사소송법 제243조의2 제1항",
    when: (s) => isSuspectSide(s) && !s.counsel,
  },
  {
    id: "counsel-right-nonsuspect",
    step: 2,
    title: "참고인·피해자 조사에도 변호인이 함께할 수 있다는 점 알아 두기",
    desc: "변호인이 옆자리에서 조언하고 메모할 수 있게 하는 원칙은 참고인·피해자 같은 사건관계인을 조사하거나 면담할 때도 적용됩니다.",
    basis: "수사준칙 제13조 제3항",
    when: (s) => isNonSuspect(s) && !s.counsel,
  },
  {
    id: "counsel-papers",
    step: 2,
    title: "변호인 선임서와 참여 신청서를 조사 전에 내기",
    desc: "변호인이 신문에 참여하려면 조사 전에 변호인 선임서와 변호인 참여 신청서를 내야 합니다. 보통 변호인이 직접 내고 수사관과 일정을 맞춥니다.",
    basis: "경찰수사규칙 제12조 제2항",
    when: (s) => s.counsel && s.role !== "witness" && s.role !== "victim",
  },
  {
    id: "silence-right",
    step: 2,
    title: "진술거부권을 이해하고 어디까지 말할지 정하기",
    desc: "모든 질문에, 또는 일부 질문에만 진술하지 않을 수 있고 그 때문에 불이익을 받지 않습니다. 다만 거부하지 않고 한 진술은 법정에서 유죄의 증거가 될 수 있습니다. 사건에 따라 설명하는 편이 나을 때도 있으니 미리 정해 두세요.",
    basis: "형사소송법 제244조의3 제1항",
    when: isSuspectSide,
  },
  {
    id: "timeline",
    step: 2,
    title: "기억나는 일을 날짜 순서대로 한 장에 적기",
    desc: "날짜와 시각, 장소, 같이 있던 사람, 오간 돈을 중심으로 씁니다. 기억이 분명하지 않은 부분은 따로 표시해 둡니다.",
  },
  {
    id: "evidence",
    step: 2,
    title: "메시지·통화기록·송금 내역·사진 지우지 않고 모으기",
    desc: "유리한 부분만 잘라 낸 캡처보다 대화방 전체를 내보내기로 저장해 두는 편이 낫습니다. 가게나 주차장 CCTV는 시간이 지나면 덮어써지니 필요하면 빨리 보관을 부탁하세요.",
  },
  {
    id: "no-contact",
    step: 2,
    title: "상대방이나 관련된 사람과 말 맞추지 않기",
    desc: "증거를 없애려 한 것으로 비칠 수 있습니다. 휴대전화를 바꾸거나 대화방을 나가는 것도 같은 이유로 피합니다.",
    when: isSuspectSide,
  },
  {
    id: "phone-submit",
    step: 2,
    title: (s) => (s.phone ? "휴대전화를 내라고 하면 범위부터 정하기" : "휴대전화 제출 요청에 대비하기"),
    desc: "영장 없이 내라고 하면 임의제출 요청이라 낼지 스스로 정할 수 있습니다. 다만 스스로 낸 물건은 영장 없이 압수될 수 있으니, 낸다면 어떤 기간·어떤 자료를 내는지 서류에 분명히 남기고 변호인과 먼저 상의하세요.",
    basis: "형사소송법 제218조",
    when: (s) => s.phone || isSuspectSide(s),
    urgent: (s) => s.phone,
  },
  {
    id: "phone-forensic",
    step: 2,
    title: "휴대전화를 냈다면 포렌식(분석) 참여 뜻 밝히기",
    desc: "자료를 복제·탐색·출력하는 전 과정에 본인과 변호인이 참여할 수 있고, 참여해서 낸 의견은 조서에 적어야 합니다. 참여 여부를 묻는 서류에는 참여 희망에 표시하세요.",
    basis: "수사준칙 제42조 제4항·제5항",
    when: (s) => s.phone,
  },
  {
    id: "victim-trusted",
    step: 2,
    title: "불안하면 믿을 수 있는 사람과 함께 가겠다고 신청하기",
    desc: "피해자는 가족 등 심리적 안정과 의사소통에 도움이 되는 사람을 조사에 동석시켜 달라고 신청할 수 있습니다.",
    basis: "형사소송법 제221조 제3항, 수사준칙 제24조",
    when: (s) => s.role === "victim",
  },

  // ── 3. 조사 당일 ──
  {
    id: "bring",
    step: 3,
    title: "준비물 챙기기",
    desc: "신분증, 출석요구서나 받은 문자, 날짜순으로 정리한 메모, 낼 자료의 사본을 챙깁니다. 원본은 직접 보관하세요.",
  },
  {
    id: "arrival-time",
    step: 3,
    title: "도착 시각과 조사 시작·끝 시각 적어 두기",
    desc: "경찰은 조사장소에 도착한 시각, 조사를 시작하고 마친 시각을 조서나 별도 서면에 기록해야 합니다. 내 메모와 다른지 나중에 대조합니다.",
    basis: "형사소송법 제244조의4, 수사준칙 제26조",
  },
  {
    id: "rights-notice",
    step: 3,
    title: "진술거부권과 변호인 조력권 고지 듣고 답하기",
    desc: "신문 전에 이 권리를 알려야 하고, 권리를 쓸지 묻는 질문과 내 답은 조서에 적힙니다. 내 답이 그대로 적혔는지 확인하세요.",
    basis: "형사소송법 제244조의3",
    when: isSuspectSide,
  },
  {
    id: "role-change",
    step: 3,
    title: "질문이 내 책임을 묻는 쪽으로 바뀌면 신분 다시 묻기",
    desc: "참고인으로 불렀어도 조사 중 혐의가 드러나 수사가 시작되면 피의자가 될 수 있습니다. 그때는 진술거부권과 변호인 조력권을 고지받아야 하고, 변호인과 상의하겠다고 잠시 멈춰도 됩니다.",
    when: (s) => s.role === "witness" || s.role === "unknown",
  },
  {
    id: "counsel-seat",
    step: 3,
    title: "변호인은 옆자리에서 조언·메모할 수 있음",
    desc: "변호인은 실질적으로 도울 수 있는 자리에 앉아 조언하고 메모할 수 있습니다. 부당한 신문 방법에는 승인 없이 이의를 제기할 수 있고, 그 내용은 조서에 적힙니다.",
    basis: "수사준칙 제13조 제1항, 제14조 제3항·제4항",
    when: (s) => s.counsel,
  },
  {
    id: "recording",
    step: 3,
    title: "필요하면 진술 녹음을 요청하기",
    desc: "피의자나 변호인이 요청하면 경찰은 조사·면담 등 이름과 관계없이 피의자의 진술을 녹음해야 합니다. 녹음이 끝나면 원본을 봉인하고, 요청하면 들어 볼 수 있습니다.",
    basis: "형사소송법 제244조의6",
    when: isSuspectSide,
  },
  {
    id: "trusted-suspect",
    step: 3,
    title: "장애·나이·국적 때문에 의사소통이 어렵다면 동석 신청하기",
    desc: "이런 사정이 있으면 가족 등 신뢰관계에 있는 사람을 신문에 동석시켜 달라고 신청할 수 있습니다.",
    basis: "형사소송법 제244조의5",
    when: isSuspectSide,
  },
  {
    id: "time-limits",
    step: 3,
    title: "조사 시간 제한과 휴식 요청 알아 두기",
    desc: "오후 9시부터 오전 6시 사이에는 원칙적으로 조사하지 않습니다. 대기·휴식·식사를 합한 총조사시간은 12시간, 실제 조사시간은 8시간을 넘지 않게 해야 하고, 오래 걸리면 2시간마다 10분 이상 쉬게 해야 합니다. 힘들면 휴식을 요청하세요.",
    basis: "수사준칙 제21조~제23조",
  },
  {
    id: "dont-guess",
    step: 3,
    title: "기억나지 않는 것은 기억나지 않는다고 말하기",
    desc: "직접 본 것과 남에게 들은 것, 짐작한 것을 나눠 말합니다. 날짜와 금액을 추측으로 채우지 마세요.",
  },
  {
    id: "submit-materials",
    step: 3,
    title: "조사가 끝나기 전에 낼 자료·의견 내기",
    desc: "경찰은 조사를 마치기 전에 자료나 의견을 낼 뜻이 있는지 확인해야 하고, 낸 자료와 의견은 수사기록에 편철합니다.",
    basis: "수사준칙 제25조",
  },
  {
    id: "read-record",
    step: 3,
    title: "조서를 끝까지 읽고 다르게 적힌 곳 고쳐 달라고 하기",
    desc: "조서는 열람하거나 읽어 들은 뒤 서명합니다. 말한 대로 적히지 않았거나 사실과 다른 부분은 더하거나 빼거나 바꿔 달라고 할 수 있고, 경찰은 그 내용을 조서에 추가로 적어야 합니다. 날짜·금액·이름, '알고 있었다' 같은 표현을 특히 보세요.",
    basis: "형사소송법 제244조 제2항",
  },
  {
    id: "read-time",
    step: 3,
    title: "시간에 쫓겨 서명하지 않기",
    desc: "이미 작성된 조서를 읽는 절차는 자정 전까지 할 수 있고, 서면으로 요청해 조서를 읽는 시간은 총조사시간 12시간 제한의 예외입니다. 고친 내용이 반영된 것을 확인한 뒤 서명하세요.",
    basis: "수사준칙 제21조 제1항 단서, 제22조 제1항 제1호",
  },

  // ── 4. 조사 후 ──
  {
    id: "memo-after",
    step: 4,
    title: "받은 질문과 내 답을 바로 적기",
    desc: "기억이 생생할 때 적어 둡니다. 답하지 못했거나 애매하게 넘긴 질문은 따로 표시합니다.",
  },
  {
    id: "copy-record",
    step: 4,
    title: "내 진술이 적힌 조서 열람·복사 신청하기",
    desc: "수사 중인 사건에서 본인 진술이 적힌 부분과 본인이 낸 서류는 열람·복사를 신청할 수 있습니다. 경찰관서장은 신청을 받은 날부터 10일 안에 공개 여부를 정하고, 조사 당일 본인 조서를 신청하면 지체 없이 검토해야 합니다.",
    basis: "수사준칙 제69조 제1항, 경찰수사규칙 제87조",
  },
  {
    id: "opinion",
    step: 4,
    title: "더 설명할 것은 송치 여부가 정해지기 전에 내기",
    desc: "조사에서 충분히 말하지 못한 부분이나 나중에 찾은 자료는 의견서와 함께 냅니다. 고소·고발 사건은 경찰이 수리한 날부터 3개월 안에 송치 여부를 정해야 하니 늦지 않게 준비하세요.",
    basis: "형사소송법 제238조",
    when: isSuspectSide,
  },
  {
    id: "result-notice",
    step: 4,
    title: "수사 결과 통지 문자·서면 보관하기",
    desc: "경찰이 송치·불송치 등 결정을 하면 고소인 등과 피의자에게 알려야 하고, 사건을 송치하거나 기록을 보낸 날부터 7일 안에 통지합니다. 사건번호와 사건이 간 곳이 적혀 있으니 지우지 마세요.",
    basis: "수사준칙 제53조 제1항, 경찰수사규칙 제97조 제1항",
    when: (s) => s.role !== "witness",
  },
  {
    id: "after-referral",
    step: 4,
    title: "송치되면 공소청 검사의 판단을 기다리며 준비하기",
    desc: "경찰이 혐의가 있다고 보면 사건을 공소청 검사에게 송치합니다. 검사가 기소 여부를 정하기 전까지 의견서와 합의서 등을 낼 수 있습니다.",
    basis: "형사소송법 제245조의5 제1항 제1호",
    when: (s) => s.role === "suspect",
  },
  {
    id: "keep-after-nonreferral",
    step: 4,
    title: "불송치가 돼도 자료는 버리지 않기",
    desc: "불송치 결정이 나도 고소인이 이의신청을 하면 사건은 검사에게 송치됩니다. 그때 낼 의견을 위해 자료를 보관해 두세요.",
    basis: "형사소송법 제245조의7",
    when: (s) => s.role === "suspect",
  },
  {
    id: "victim-progress",
    step: 4,
    title: "수사 진행상황 통지 받기",
    desc: "고소인·피해자 등에게는 수사를 시작한 날부터 7일 안에, 그 뒤 3개월이 지난 날, 그 뒤로는 1개월마다 진행상황을 알려야 합니다. 원하는 통지 방법이 있으면 수사관에게 말해 두세요.",
    basis: "경찰수사규칙 제11조",
    when: (s) => s.role === "victim",
  },
  {
    id: "victim-objection",
    step: 4,
    title: "불송치 통지를 받으면 3개월 안에 이의신청 검토하기",
    desc: "경찰은 불송치하면 7일 안에 이유와 결정서, 이의신청 안내를 서면으로 보내야 합니다. 통지를 받은 날부터 3개월 안에 이의신청하면 사건은 검사에게 송치되고, 이의신청을 위해 수사 기록 열람·등사를 신청할 수도 있습니다.",
    basis: "형사소송법 제245조의6, 제245조의7, 제245조의12",
    when: (s) => s.role === "victim",
  },
  {
    id: "phone-return",
    step: 4,
    title: "휴대전화 자료 목록과 삭제·반환 확인서 받기",
    desc: "분석이 끝나면 압수한 전자정보 목록을 받아야 하고, 목록에 없는 정보는 삭제·폐기하거나 돌려준 뒤 확인서를 줘야 합니다. 압수를 계속할 필요가 없거나 계속 써야 하는 기기는 돌려 달라고(환부·가환부) 청구할 수 있습니다.",
    basis: "수사준칙 제42조 제1항·제2항, 형사소송법 제218조의2",
    when: (s) => s.phone,
  },
]

export const textOf = (t: Text, s: Situation) => (typeof t === "function" ? t(s) : t)

/** 이 상황에서 보이는 항목 (단계 순서 유지) */
export function itemsFor(s: Situation): Item[] {
  return ITEMS.filter((i) => !i.when || i.when(s))
}

/** 화면·인쇄에 쓰는 상황 요약 */
export function situationSummary(s: Situation): string {
  const pick = <K extends keyof typeof QUESTIONS>(k: K, v: string) =>
    (QUESTIONS[k].options as readonly { value: string; label: string }[]).find((o) => o.value === v)?.label ?? ""
  const parts = [
    `신분: ${pick("role", s.role)}`,
    `출석일까지: ${pick("days", s.days)}`,
    `연락: ${pick("via", s.via)}`,
    ...(isSuspectSide(s) ? [`체포 걱정: ${s.arrest ? "있음" : "없음"}`] : []),
    `변호인 동행: ${s.counsel ? "예" : "아니요·미정"}`,
    `휴대전화 제출 요구: ${s.phone ? "예" : "아니요"}`,
  ]
  return parts.join(" · ")
}

/** 저장값 → 상황 (모르는 값은 기본값) */
export function parseSituation(v: unknown): Situation {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>
  const oneOf = <T extends string>(x: unknown, list: readonly T[], d: T): T => (list.includes(x as T) ? (x as T) : d)
  return {
    role: oneOf(o.role, ["unknown", "suspect", "witness", "victim"] as const, DEFAULT_SITUATION.role),
    days: oneOf(o.days, ["soon", "week", "later", "unset"] as const, DEFAULT_SITUATION.days),
    via: oneOf(o.via, ["call", "letter"] as const, DEFAULT_SITUATION.via),
    arrest: o.arrest === true,
    counsel: o.counsel === true,
    phone: o.phone === true,
  }
}
