/**
 * 계산기·자가진단 목록 (/tools 목록 페이지, 사이트맵, 메뉴가 함께 씀).
 * 제목·설명 원문은 content/tools/i18n/ko/common.json 의 tools (외국어는 같은 모양의 {언어}/common.json).
 * i18nKey: 외국어판이 있을 수 있는 도구의 사전 이름(content/tools/i18n/{언어}/{i18nKey}.json).
 *   그 언어 사전이 다 갖춰졌을 때만 /{언어}/tools 목록과 페이지에 나옵니다 (lib/tools/i18n.ts toolLangs).
 */
import common from "@/content/tools/i18n/ko/common.json"

export type ToolId = keyof typeof common.tools
export type ToolGroup = "형사" | "가사·상속" | "민사·기한"
export type ToolEntry = { id: ToolId; href: string; title: string; desc: string; group: ToolGroup; i18nKey?: string }

export const TOOL_GROUPS: ToolGroup[] = ["형사", "가사·상속", "민사·기한"]

/** 묶음 → 사전 common.groups 의 키 */
export const GROUP_KEY: Record<ToolGroup, keyof typeof common.groups> = { 형사: "criminal", "가사·상속": "family", "민사·기한": "civil" }

const entry = (id: ToolId, group: ToolGroup, i18nKey?: string): ToolEntry => ({ id, group, href: `/tools/${id}`, ...common.tools[id], ...(i18nKey ? { i18nKey } : {}) })

export const TOOLS: ToolEntry[] = [
  entry("prosecution", "형사"),
  entry("sentencing", "형사"),
  entry("drunk-driving", "형사", "drunk-driving"),
  entry("police-summons", "형사", "police-summons"),
  entry("child-support", "가사·상속", "child-support"),
  entry("inheritance", "가사·상속", "inheritance"),
  entry("reserved-share", "가사·상속", "reserved-share"),
  entry("interest", "민사·기한", "interest"),
  entry("court-fees", "민사·기한", "court-fees"),
  entry("deadline", "민사·기한", "deadline"),
  entry("interest-cap", "민사·기한", "interest-cap"),
]

export const toolById = (id: ToolId) => TOOLS.find((t) => t.id === id)
