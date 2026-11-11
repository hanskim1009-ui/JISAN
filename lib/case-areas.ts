import type { CaseItem } from "@/lib/content"

/**
 * 업무사례 ↔ 센터 업무분야 연결.
 * 업무분야 페이지(/센터/분야)에 그 분야의 업무사례를 보여 주고, 업무사례 상세에서는 관련 분야 안내로 잇습니다.
 * 죄명과 제목으로 가려내며, 분야를 새로 연결하려면 아래 RULES 에 한 줄을 더합니다.
 */
type Rule = { center: string; area: string; test: (c: CaseItem, text: string) => boolean }

/** 죄명으로만 가림 (제목까지 보면 "강제추행으로 신고했다가 무고" 같은 사건이 잘못 걸림) */
const re = (r: RegExp) => (c: CaseItem) => r.test(c.caseType)
const inGroup = (group: string, r?: RegExp) => (c: CaseItem, text: string) => c.group === group && (!r || r.test(text))
const victim = (c: CaseItem) => c.clientRole.startsWith("피해자")

const RULES: Rule[] = [
  // 성범죄센터
  { center: "sex-crime", area: "indecent-assault", test: re(/(?<!준)강제추행|공중밀집장소추행/) },
  { center: "sex-crime", area: "quasi-rape", test: re(/준강간|준강제추행|준유사강간/) },
  { center: "sex-crime", area: "rape", test: re(/(?<![준제])강간|유사강간/) },
  { center: "sex-crime", area: "workplace-coercion", test: re(/업무상위력/) },
  { center: "sex-crime", area: "disabled-victim", test: re(/장애인강간|장애인.*추행/) },
  { center: "sex-crime", area: "family-sexual-assault", test: re(/친족관계/) },
  { center: "sex-crime", area: "false-report", test: (c, t) => /무고/.test(c.caseType) && /추행|강간|성/.test(t) },
  { center: "sex-crime", area: "public-indecency", test: re(/다중이용장소침입|공연음란/) },
  { center: "sex-crime", area: "illegal-filming", test: re(/카메라등이용촬영/) },
  { center: "sex-crime", area: "obscene-messages", test: re(/통신매체이용음란/) },
  { center: "sex-crime", area: "intimate-image-threat", test: re(/촬영물등이용협박/) },
  { center: "sex-crime", area: "minors-prostitution", test: re(/성매매|위계등간음/) },
  { center: "sex-crime", area: "statutory-rape", test: re(/의제강간/) },
  { center: "sex-crime", area: "child-exploitation-material", test: re(/성착취물/) },
  { center: "sex-crime", area: "public-servant-discipline", test: re(/품위유지의무/) },
  { center: "sex-crime", area: "victim-complaint", test: (c) => c.group === "성범죄" && victim(c) },
  // 형사센터
  { center: "economic-crime", area: "fraud-embezzlement", test: (c) => /사기|횡령|배임/.test(c.caseType) && !/컴퓨터등사용사기|점유이탈물/.test(c.caseType) },
  { center: "economic-crime", area: "workplace-embezzlement", test: (c) => /업무상횡령/.test(c.caseType) },
  { center: "economic-crime", area: "theft", test: (c) => /절도|점유이탈물/.test(c.caseType) },
  { center: "economic-crime", area: "property-damage", test: (c) => /재물손괴/.test(c.caseType) },
  { center: "economic-crime", area: "computer-card-fraud", test: (c) => /컴퓨터등사용사기/.test(c.caseType) },
  { center: "gambling", area: "gambling", test: (c, t) => /도박/.test(t) && c.group !== "마약" },
  { center: "crime", area: "assault", test: (c) => c.group !== "성범죄" && /(?<!특수)폭행|(?<!강간)(?<!특수)상해|(?<!특수)협박/.test(c.caseType) && !/촬영물/.test(c.caseType) },
  { center: "crime", area: "special-assault", test: (c) => /특수폭행|특수상해|특수협박/.test(c.caseType) },
  { center: "crime", area: "trespass", test: (c) => /주거침입/.test(c.caseType) },
  { center: "crime", area: "stalking", test: (c) => /스토킹/.test(c.caseType) },
  { center: "crime", area: "child-abuse", test: (c) => /아동학대|아동복지법/.test(c.caseType) },
  { center: "crime", area: "confinement-coercion", test: (c) => /감금/.test(c.caseType) },
  { center: "dui", area: "drunk-driving", test: (c) => /음주운전|위험운전/.test(c.caseType) },
  { center: "dui", area: "hit-and-run", test: (c) => /사고후미조치|도주치상/.test(c.caseType) },
  { center: "dui", area: "breath-test-refusal", test: (c) => /음주측정거부/.test(c.caseType) },
  { center: "crime", area: "defamation", test: (c) => /명예훼손/.test(c.caseType) },
  { center: "crime", area: "illegal-recording", test: (c) => /통신비밀보호법/.test(c.caseType) },
  { center: "crime", area: "obstruction-of-business", test: (c) => /업무방해/.test(c.caseType) },
  { center: "crime", area: "obstruction-of-officials", test: (c) => /공무집행방해/.test(c.caseType) },
  { center: "crime", area: "false-accusation", test: (c) => /무고/.test(c.caseType) },
  { center: "crime", area: "document-forgery", test: (c) => /문서위조|공정증서/.test(c.caseType) },
  { center: "crime", area: "arrest-search", test: (c) => c.resultGroup === "구속 면함" && c.group !== "마약" },
  { center: "crime", area: "complaint", test: (c) => victim(c) && c.group !== "성범죄" },
  // 마약센터
  { center: "drug", area: "use", test: inGroup("마약", /투약|흡연|피우/) },
  { center: "drug", area: "possession", test: inGroup("마약", /매수|소지|수수|건넨|사려|샀|산 /) },
  { center: "drug", area: "cannabis", test: inGroup("마약", /대마/) },
  { center: "drug", area: "methamphetamine", test: inGroup("마약", /필로폰/) },
  { center: "drug", area: "club-drugs", test: inGroup("마약", /엑스터시|케타민|MDMA/) },
  { center: "drug", area: "dealing", test: inGroup("마약", /판매|알선|방조|되판/) },
  { center: "drug", area: "smuggling", test: inGroup("마약", /밀수|들여오다/) },
  { center: "drug", area: "direct-purchase", test: inGroup("마약", /펜터민|러쉬/) },
  { center: "drug", area: "arrest-search", test: (c) => c.group === "마약" && c.resultGroup === "구속 면함" },
  { center: "drug", area: "treatment", test: (c) => c.group === "마약" && c.resultGroup === "기소유예·선고유예" },
  { center: "drug", area: "foreigner-cases", test: inGroup("마약", /외국인/) },
  // 학교폭력센터
  { center: "school-violence", area: "juvenile-criminal-civil", test: (c) => c.clientRole === "보호소년" || /소년보호/.test(c.stage) },
  { center: "school-violence", area: "mutual-fight", test: (c) => /학교폭력/.test(c.caseType) },
]

const textOf = (c: CaseItem) => `${c.caseType} ${c.situation}`

/** 이 업무분야에 해당하는 업무사례 */
export function casesForArea(all: CaseItem[], center: string, area: string): CaseItem[] {
  const rules = RULES.filter((r) => r.center === center && r.area === area)
  if (rules.length === 0) return []
  return all.filter((c) => rules.some((r) => r.test(c, textOf(c))))
}

/** 이 업무사례와 관련된 업무분야 (센터 slug, 분야 slug). 많아도 셋까지 */
export function areasForCase(c: CaseItem): { center: string; area: string }[] {
  const t = textOf(c)
  return RULES.filter((r) => r.test(c, t)).map(({ center, area }) => ({ center, area })).slice(0, 3)
}
