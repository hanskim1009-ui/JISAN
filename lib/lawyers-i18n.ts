import type { Lang } from "@/lib/langs"
import { extraContent } from "@/lib/i18n/extra-content"

/**
 * 영어·중국어 페이지용 변호사 정보 (외국인센터, 영문·중문 메인).
 * 이름은 로마자(이름-성 순서). 한자 이름을 받으면 중국어 name을 바꿉니다.
 * 내용은 lib/lawyers.ts 의 한국어 경력을 그대로 옮긴 것만 씁니다(지어내지 않음).
 */
export type LawyerI18n = { name: string; title: string; field: string; line: string; bio: string; career: string[] }

type Entry = Record<"en" | "zh", LawyerI18n>

const MP = { en: "Managing Partner", zh: "代表律师" }
const P = { en: "Partner", zh: "合伙人律师" }
const A = { en: "Attorney", zh: "律师" }

const data: Record<string, Entry> = {
  "kim-hansol": {
    en: {
      name: "Hansol Kim",
      title: MP.en,
      field: "Criminal",
      line: "Former prosecutor (Incheon, Ansan, Hongseong)",
      bio: "Hansol Kim served as a prosecutor at the Incheon District Prosecutors' Office, the Ansan Branch of the Suwon District Prosecutors' Office, and the Hongseong Branch of the Daejeon District Prosecutors' Office. He now focuses on criminal cases, handling everything from preparation before police questioning to accompanying clients at interviews, written opinions and trial. He graduated from the University of Toronto (Life Sciences, High Distinction) and Sungkyunkwan University Law School.",
      career: [
        "Managing Partner, Jisan Law",
        "Former Managing Partner, Ongang Law Firm",
        "Former Prosecutor, Incheon District Prosecutors' Office (medical crimes)",
        "Former Prosecutor, Suwon District Prosecutors' Office, Ansan Branch",
        "Former Prosecutor, Daejeon District Prosecutors' Office, Hongseong Branch",
        "University of Toronto, Life Sciences (High Distinction)",
        "Sungkyunkwan University Law School",
      ],
    },
    zh: {
      name: "Hansol Kim",
      title: MP.zh,
      field: "刑事",
      line: "前检察官（仁川、安山、洪城）",
      bio: "Hansol Kim 律师曾在仁川地方检察厅、水原地方检察厅安山支厅、大田地方检察厅洪城支厅担任检察官。现主要办理刑事案件，从警方调查前的准备、陪同接受调查，到提交律师意见书和出庭辩护，均亲自负责。毕业于加拿大多伦多大学（生命科学，最优等）和成均馆大学法学专门研究生院。",
      career: [
        "现任 Jisan 法律事务所 代表律师",
        "前 Ongang 律师事务所 代表律师",
        "前 仁川地方检察厅 检察官（医疗专案）",
        "前 水原地方检察厅安山支厅 检察官",
        "前 大田地方检察厅洪城支厅 检察官",
        "加拿大多伦多大学 生命科学（最优等）",
        "成均馆大学 法学专门研究生院",
      ],
    },
  },
  "kim-miso": {
    en: {
      name: "Miso Kim",
      title: P.en,
      field: "Family",
      line: "Former in-house counsel at Wemade; English interpretation and translation graduate",
      bio: "Miso Kim has worked from advising multinational companies to litigating civil and criminal cases. She was in-house counsel on the legal team of Wemade Co., Ltd., and an associate at Daehwan Law Firm and Oracle Law Firm. She studied English interpretation and translation at Hankuk University of Foreign Studies before graduating from Sungkyunkwan University Law School.",
      career: [
        "Partner, Jisan Law",
        "Former Associate, Daehwan Law Firm",
        "Former In-house Counsel, Legal Team, Wemade Co., Ltd.",
        "Former Associate, Oracle Law Firm",
        "Member, Korean Women Lawyers Association",
        "Director, Korean Medical Lawyers Association",
        "Member, Gwangjin-gu Election Broadcasting Debate Committee",
        "Sungkyunkwan University Law School",
        "Hankuk University of Foreign Studies, English Interpretation and Translation",
      ],
    },
    zh: {
      name: "Miso Kim",
      title: P.zh,
      field: "家事",
      line: "前 Wemade 公司内部律师；英语口笔译专业毕业",
      bio: "Miso Kim 律师的执业范围从跨国企业法律顾问到民事、刑事诉讼。曾任 Wemade 株式会社法务组公司内部律师，以及 Daehwan、Oracle 律师事务所律师。本科就读于韩国外国语大学英语口笔译专业，后毕业于成均馆大学法学专门研究生院。",
      career: [
        "现任 Jisan 法律事务所 合伙人律师",
        "前 Daehwan 律师事务所 律师",
        "前 Wemade 株式会社 法务组 公司内部律师",
        "前 Oracle 律师事务所 律师",
        "韩国女律师协会 正会员",
        "韩国医疗律师协会 理事",
        "首尔广津区选举广播辩论委员会 委员",
        "成均馆大学 法学专门研究生院",
        "韩国外国语大学 英语口笔译专业",
      ],
    },
  },
  "koo-bonwoo": {
    en: {
      name: "Bonwoo Koo",
      title: MP.en,
      field: "Corporate & Finance",
      line: "Former IBK Industrial Bank, Hana Securities, Smilegate Investment",
      bio: "Bonwoo Koo worked at IBK Industrial Bank of Korea, Hana Securities, Smilegate Investment (compliance officer), Sigong Law Firm and Ihan Law Firm. He focuses on management disputes at listed companies, investment agreements and capital markets cases.",
      career: [],
    },
    zh: {
      name: "Bonwoo Koo",
      title: MP.zh,
      field: "企业·金融",
      line: "前 IBK企业银行、韩亚证券、Smilegate Investment",
      bio: "Bonwoo Koo 律师曾任职于 IBK 企业银行、韩亚证券、Smilegate Investment（合规负责人）以及 Sigong、Ihan 律师事务所，主要办理上市公司经营权纠纷、投资合同和资本市场案件。",
      career: [],
    },
  },
  "park-jongjin": {
    en: {
      name: "Jongjin Park",
      title: P.en,
      field: "Civil & Corporate Advisory",
      line: "Former partner, Hyosung Law Firm",
      bio: "Jongjin Park was a partner at Hyosung Law Firm and Deol Law Office, and advises companies including Dongwha Pharmaceutical. He handles corporate advisory work and civil cases.",
      career: [],
    },
    zh: {
      name: "Jongjin Park",
      title: P.zh,
      field: "民事·企业顾问",
      line: "前 Hyosung 律师事务所 合伙人律师",
      bio: "Jongjin Park 律师曾任 Hyosung 律师事务所和 Deol 法律事务所合伙人律师，现担任东和药品等企业的法律顾问，办理企业顾问和民事案件。",
      career: [],
    },
  },
  "kang-hyunwoo": {
    en: {
      name: "Hyunwoo Kang",
      title: P.en,
      field: "Medical & Corporate Advisory",
      line: "Adviser to the Korean Hospital Association and hospitals",
      bio: "Hyunwoo Kang worked at Gonggan Law Firm and has advised the Korean Hospital Association, Gyeonggi Provincial Medical Center and many hospitals. He handles hospital operations, medical disputes and corporate advisory work.",
      career: [],
    },
    zh: {
      name: "Hyunwoo Kang",
      title: P.zh,
      field: "医疗·企业顾问",
      line: "大韩医院协会及多家医院法律顾问",
      bio: "Hyunwoo Kang 律师曾任职于 Gonggan 律师事务所，担任大韩医院协会、京畿道医疗院及多家医院的法律顾问，办理医院运营、医疗纠纷和企业顾问业务。",
      career: [],
    },
  },
  "kim-chunghyeon": {
    en: { name: "Chunghyeon Kim", title: A.en, field: "Criminal & Civil", line: "", bio: "", career: [] },
    zh: { name: "Chunghyeon Kim", title: A.zh, field: "刑事·民事", line: "", bio: "", career: [] },
  },
  "park-hanmin": {
    en: {
      name: "Hanmin Park",
      title: P.en,
      field: "Real Estate & Construction",
      line: "Former legal team, Namkwang, Kukdong and Kumkwang construction companies",
      bio: "Hanmin Park worked on the legal teams of Namkwang Engineering & Construction, Kukdong Engineering & Construction and Kumkwang Enterprise, and at Sehan Law Firm and Beopseung Law Firm, after serving as a military judge advocate. He handles redevelopment, design changes, subcontracting and construction defect cases.",
      career: [],
    },
    zh: {
      name: "Hanmin Park",
      title: P.zh,
      field: "房地产·建设",
      line: "前 南光土建、极东建设、金光企业 法务组",
      bio: "Hanmin Park 律师曾任职于南光土建、极东建设、金光企业法务组以及 Sehan、Beopseung 律师事务所，并担任过军法务官。主要办理重建·再开发、设计变更、分包和工程瑕疵案件。",
      career: [],
    },
  },
}

export function lawyerI18n(slug: string, lang: Lang | undefined): LawyerI18n | undefined {
  if (!lang || lang === "ko") return undefined
  if (lang === "en" || lang === "zh") return data[slug]?.[lang]
  return (extraContent[lang].lawyers as Record<string, LawyerI18n>)[slug]
}
