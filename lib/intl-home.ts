/**
 * 영문(/en)·중문(/zh) 메인 페이지 문구.
 * 한국어 메인의 문구를 옮긴 것이고, 사무소 사실(영어·중국어 상담 가능, 외국인센터, 담당 변호사)은 사용자 확인을 받은 것만 씁니다.
 * 광고 규정: 승소율·결과 보장·'전문'·'최고' 같은 표현은 외국어로도 쓰지 않습니다.
 */
import type { ForeignLang } from "@/lib/langs"
import { extraLangs } from "@/lib/i18n/extra-langs"

export type IntlLang = ForeignLang

export type IntlField = { name: string; desc: string; items: string[]; lawyers: string[] }

export type IntlHome = {
  htmlLang: string
  locale: string
  seoTitle: string
  seoDesc: string
  nav: { about: string; lawyers: string; practice: string; foreigner: string; offices: string; contact: string }
  firm: string
  kicker: string
  heroTitle: [string, string]
  heroSub: string
  langNote: string
  consult: string
  menuOpen: string
  menuClose: string
  foreigner: { kicker: string; title: string; lead: string; groups: { title: string; items: string[] }[]; cta: string; lawyersNote: string }
  lawyers: { title: string; desc: string }
  practice: { title: string; desc: string; inCharge: string; fields: IntlField[] }
  about: { kicker: string; title: [string, string]; letter: string[]; sign: string }
  steps: { title: string; desc: string; items: { title: string; body: string }[] }
  faq: { title: string; items: { q: string; a: string }[] }
  offices: { title: string; desc: string; map: string; phone: string; note: string }
  contact: { title: string; desc: string; caseTypes: string[]; stages: string[] }
  footer: { bizNo: string; adLawyer: string; privacy: string; disclaimer: string; korean: string }
}

const en: IntlHome = {
  htmlLang: "en",
  locale: "en_US",
  seoTitle: "Jisan Law | Lawyers in Korea for Foreign Residents, Criminal, Family and Business Matters",
  seoDesc:
    "Jisan Law is a Korean law office handling criminal, family, corporate, medical, real estate and civil cases, with a Foreigner Center for visa, immigration and other issues. Consultations in English, 24/7 including nights and weekends.",
  nav: { about: "About", lawyers: "Lawyers", practice: "Practice areas", foreigner: "Foreigner Center", offices: "Offices", contact: "Contact" },
  firm: "JISAN LAW",
  kicker: "Korean lawyers for foreign residents",
  heroTitle: ["Legal trouble in Korea?", "Talk to us in English"],
  heroSub:
    "Visa and immigration problems, police investigations, unpaid wages, divorce. Nothing needs to be decided yet. We first explain where you stand and what can be done, in English, 24/7.",
  langNote: "Consultations in English with Partner Miso Kim. Nights and weekends too.",
  consult: "Request a consultation",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  foreigner: {
    kicker: "Foreigner Center",
    title: "For foreign residents in Korea and their families",
    lead: "Visa and residence problems, police investigations, unpaid wages, divorce from a Korean spouse. Our Foreigner Center brings together the legal issues foreigners face in Korea, and explains Korean procedures in English.",
    groups: [
      { title: "Visa & immigration", items: ["Extension or change of status refused", "Departure orders and deportation", "Immigration detention", "Entry bans and visa refusals"] },
      { title: "Criminal cases", items: ["Questioning by the police", "Arrest and detention", "How a conviction affects your visa", "Filing a complaint as a victim"] },
      { title: "Work & daily life", items: ["Unpaid wages and severance", "Industrial accidents", "Changing workplaces (E-9)", "Housing deposits and contracts"] },
      { title: "Family", items: ["International divorce", "Custody and child support", "Inheritance of property in Korea"] },
    ],
    cta: "Visit the Foreigner Center",
    lawyersNote: "Lead lawyers: Miso Kim · Hansol Kim",
  },
  lawyers: {
    title: "Lawyers",
    desc: "You don't have to wonder who will handle your case. The lawyer you consult stays with you to the end.",
  },
  practice: {
    title: "Practice areas",
    desc: "What is your problem?",
    inCharge: "Lawyers in charge",
    fields: [
      {
        name: "Criminal",
        desc: "From police questioning to trial, we plan how to respond at each stage, based on your situation.",
        items: ["Accompanying you at police questioning; arrest and detention", "Sex crimes and drug offenses", "Fraud, embezzlement, capital markets offenses", "School violence; DUI and traffic offenses"],
        lawyers: ["kim-hansol", "kim-chunghyeon", "koo-bonwoo"],
      },
      {
        name: "Family",
        desc: "We sort out divorce, inheritance and child custody with your life after the case in mind.",
        items: ["Divorce and division of property", "Claims against a spouse's affair partner", "Custody and child support", "Inheritance and statutory reserved shares"],
        lawyers: ["kim-miso"],
      },
      {
        name: "Corporate",
        desc: "We review investment agreements, shareholder disputes and control issues before the law becomes an obstacle to your business.",
        items: ["Investment and shareholders' agreements", "Shareholders' and board meetings", "Disputes over management control", "Retainer advice, labor and serious accidents"],
        lawyers: ["koo-bonwoo", "kang-hyunwoo", "park-jongjin"],
      },
      {
        name: "Medical",
        desc: "We handle what hospitals and medical professionals face: malpractice, government audits and administrative sanctions, and medical law investigations.",
        items: ["Medical malpractice (criminal and civil)", "On-site audits, recovery orders, sanctions", "Investigations into unlicensed clinics and kickbacks", "Opening and running a hospital"],
        lawyers: ["kim-hansol", "kang-hyunwoo"],
      },
      {
        name: "Real Estate",
        desc: "We handle disputes over buildings and land: construction payments and defects, redevelopment, pre-sales and compensation.",
        items: ["Construction payments and defects", "Redevelopment and reconstruction", "Pre-sale contracts and housing cooperatives", "Land expropriation and compensation"],
        lawyers: ["park-hanmin"],
      },
      {
        name: "Civil",
        desc: "We recover money you are owed, such as loans, deposits and damages, and handle debt rehabilitation and bankruptcy.",
        items: ["Recovery of loans and investments", "Lease deposits and evictions", "Damages claims", "Individual rehabilitation and bankruptcy"],
        lawyers: ["park-jongjin", "kang-hyunwoo", "kim-chunghyeon", "park-hanmin"],
      },
    ],
  },
  about: {
    kicker: "About us",
    title: ["For you, this may be", "the only case you ever have"],
    letter: [
      "For a lawyer it may be a matter seen every week, but for most clients it is the first and only time.",
      "So we never ask you to decide on hiring us right away. We first tell you what can be done and what is difficult, and once we take your case, the lawyer in charge stays in direct contact with you.",
    ],
    sign: "The lawyers of Jisan Law",
  },
  steps: {
    title: "How consultation works",
    desc: "Please feel free to contact us.",
    items: [
      { title: "Get in touch", body: "Leave a message by phone, KakaoTalk or the form on this page. In English is fine, 24/7 including nights and weekends." },
      { title: "Review the facts", body: "The lawyer in charge reviews the documents you have, such as a police summons, a notice from the immigration office, a contract or messages." },
      { title: "Explain your options", body: "We first explain what can be done, what is difficult and what comes next. You decide whether to hire us after that." },
      { title: "Handle the case", body: "Once you hire us, the lawyer in charge personally handles questioning, written submissions and court hearings." },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "Can I consult in English?", a: "Yes. Partner Miso Kim consults with you in English. Korean documents and procedures are explained to you in English." },
      { q: "Can a fine or a criminal case affect my visa?", a: "It can. Depending on the offense and the sentence, a criminal case can lead to a refused visa extension, a departure order or deportation. It is safer to consider the immigration side from the start of the investigation, not after the sentence." },
      { q: "I received a departure or deportation order. How much time do I have?", a: "Deadlines can be very short. An objection to a deportation order, for example, must be filed within 7 days of receiving it. Check the date on the notice and contact us right away." },
      { q: "I don't have a Korean phone number. How can I reach you?", a: "In the form, you can leave an international number or a messenger ID instead. You can also call us from abroad at +82-2-6951-4097." },
      { q: "Do I have to hire you after a consultation?", a: "No. You can simply get a consultation. Decide whether to hire us after hearing what we recommend." },
      { q: "Can I call at night or on the weekend?", a: "Yes. We take calls 24 hours a day, including weekends and holidays, in English too. For urgent matters such as an arrest or questioning the next day, calling is faster than the form." },
      { q: "Will what I tell you stay confidential?", a: "Yes. Under Korean law, lawyers must keep confidential what they learn in their work. This applies even if you only have a consultation." },
    ],
  },
  offices: {
    title: "Offices",
    desc: "Visit whichever of our offices is closest to you.",
    map: "View map",
    phone: "Phone",
    note: "Open 24 hours a day, including weekends and holidays. English consultations are available at night too.",
  },
  contact: {
    title: "Request a consultation",
    desc: "Tell us briefly what happened. The lawyer in charge will review it and contact you.",
    caseTypes: ["Visa / immigration", "Criminal", "Labor / unpaid wages", "Family / divorce", "Housing / contracts", "Corporate", "Medical", "Real estate", "Other"],
    stages: ["Just want advice first", "Preparing a complaint or lawsuit", "Investigation or lawsuit in progress", "Received a notice or order", "Other"],
  },
  footer: { bizNo: "Business registration no.", adLawyer: "Lawyer responsible for advertising", privacy: "Privacy policy", disclaimer: "Disclaimer", korean: "한국어" },
}

const zh: IntlHome = {
  htmlLang: "zh-Hans",
  locale: "zh_CN",
  seoTitle: "Jisan 法律事务所 | 韩国律师：外国人签证与出入境、刑事、家事、企业",
  seoDesc: "Jisan 法律事务所办理刑事、家事、企业、医疗、房地产、民事案件，并设有外国人中心，处理签证、出入境等在韩外国人的法律问题。可用中文咨询，晚上和周末也可以，24小时接听。",
  nav: { about: "事务所介绍", lawyers: "律师", practice: "业务领域", foreigner: "外国人中心", offices: "办公室", contact: "联系我们" },
  firm: "JISAN LAW",
  kicker: "为在韩外国人提供法律服务",
  heroTitle: ["在韩国遇到法律问题？", "可以用中文咨询"],
  heroSub: "签证·出入境、警方调查、拖欠工资、离婚……现在还什么都没决定也没关系。我们会先说明您目前的处境和可以做的事。中文咨询24小时都可以。",
  langNote: "中文咨询由代表律师 Hansol Kim 亲自负责。晚上和周末也可以。",
  consult: "申请咨询",
  menuOpen: "打开菜单",
  menuClose: "关闭菜单",
  foreigner: {
    kicker: "外国人中心",
    title: "为在韩外国人及其家人",
    lead: "签证和居留问题、警方调查、拖欠工资、与韩国配偶离婚……外国人中心集中处理外国人在韩国遇到的法律问题，并用中文说明韩国的程序。",
    groups: [
      { title: "签证·出入境", items: ["居留期间延长或居留资格变更不许可", "出境命令和强制驱逐", "外国人保护所收容", "禁止入境和签证被拒"] },
      { title: "刑事案件", items: ["接受警方调查", "逮捕和羁押", "刑事处罚对签证的影响", "作为受害人提起告诉"] },
      { title: "劳动·生活", items: ["拖欠工资和退休金", "工伤", "变更工作单位（E-9）", "租房押金和合同"] },
      { title: "家事", items: ["涉外离婚", "抚养权和抚养费", "继承在韩国的财产"] },
    ],
    cta: "进入外国人中心",
    lawyersNote: "负责律师：Miso Kim · Hansol Kim",
  },
  lawyers: { title: "律师介绍", desc: "不必担心谁来负责您的案件。接受您咨询的律师会一直陪您到最后。" },
  practice: {
    title: "业务领域",
    desc: "您遇到了什么问题？",
    inCharge: "负责律师",
    fields: [
      {
        name: "刑事",
        desc: "从警方调查到法院审判，根据您的情况，准备每个阶段的应对方向。",
        items: ["陪同接受警方调查，逮捕·羁押", "性犯罪 · 毒品", "诈骗·侵占·资本市场法", "校园暴力，酒驾·交通"],
        lawyers: ["kim-hansol", "kim-chunghyeon", "koo-bonwoo"],
      },
      {
        name: "家事",
        desc: "处理离婚、继承、抚养问题时，连离婚之后的生活也一并考虑。",
        items: ["离婚，财产分割", "对配偶出轨对象的诉讼", "抚养权·抚养费", "继承，特留分"],
        lawyers: ["kim-miso"],
      },
      {
        name: "企业",
        desc: "在事业被法律问题卡住之前，一起审查投资合同、股东纠纷和经营权问题。",
        items: ["投资合同，股东间协议", "股东大会·董事会", "经营权纠纷", "常年法律顾问，劳动·重大灾害"],
        lawyers: ["koo-bonwoo", "kang-hyunwoo", "park-jongjin"],
      },
      {
        name: "医疗",
        desc: "医疗事故、现场调查与行政处分、违反医疗法的调查等，医院和医务人员遇到的问题由我们共同处理。",
        items: ["医疗事故（刑事·民事）", "现场调查·追缴·行政处分", "挂名诊所·回扣调查", "医院开设·运营咨询"],
        lawyers: ["kim-hansol", "kang-hyunwoo"],
      },
      {
        name: "房地产",
        desc: "办理工程款与瑕疵、重建·再开发、预售和补偿金等围绕建筑和土地的纠纷。",
        items: ["工程款，瑕疵", "重建·再开发", "预售·地区住宅组合", "土地征收·补偿金"],
        lawyers: ["park-hanmin"],
      },
      {
        name: "民事",
        desc: "追回借款、押金、损害赔偿等应得的钱，并办理个人回生和破产。",
        items: ["返还借款·投资款", "租赁押金，腾房", "损害赔偿", "个人回生·破产"],
        lawyers: ["park-jongjin", "kang-hyunwoo", "kim-chunghyeon", "park-hanmin"],
      },
    ],
  },
  about: {
    kicker: "事务所介绍",
    title: ["对委托人来说，", "这是只有一次的案件"],
    letter: [
      "对律师来说也许是每周都会遇到的事，但对大多数委托人来说，这是第一次，也是唯一的一次。",
      "所以我们不会要求您当场决定是否委托。我们会先告诉您能做什么、什么比较困难；接受委托后，由负责律师直接与您联系。",
    ],
    sign: "Jisan 法律事务所 全体律师",
  },
  steps: {
    title: "咨询流程",
    desc: "请放心与我们联系。",
    items: [
      { title: "联系我们", body: "可通过电话、KakaoTalk 或本页的表格留言，可以用中文，晚上和周末也可以，24小时接听。" },
      { title: "确认事实", body: "负责律师会查看您手中的资料，例如警方传唤通知、出入境管理机构的通知、合同或聊天记录。" },
      { title: "说明应对方向", body: "我们先说明能做什么、什么比较困难以及接下来的程序。是否委托，听完后再决定即可。" },
      { title: "办理案件", body: "委托后，由负责律师亲自陪同调查、撰写书面材料并出庭。" },
    ],
  },
  faq: {
    title: "常见问题",
    items: [
      { q: "可以用中文咨询吗？", a: "可以。中文咨询由代表律师 Hansol Kim 亲自负责，韩文文件和程序也会用中文向您说明。" },
      { q: "罚金或刑事案件会影响签证吗？", a: "有可能。根据罪名和判决结果，刑事案件可能导致居留期间延长不许可、出境命令或强制驱逐出境。因此，最好从调查阶段开始就一并考虑出入境问题，而不是等判决之后。" },
      { q: "收到了出境命令或强制驱逐出境命令，还有多少时间？", a: "期限可能非常短。例如，对强制驱逐出境命令提出异议，须在收到命令之日起7日内提出。请先确认通知书上的日期，并尽快与我们联系。" },
      { q: "没有韩国手机号码，怎么联系？", a: "可以在表格中留下国际电话号码或微信等即时通讯账号。也可以从海外拨打 +82-2-6951-4097。" },
      { q: "咨询后一定要委托吗？", a: "不需要。只咨询也可以。听完我们的建议后，再决定是否委托。" },
      { q: "晚上或周末可以打电话吗？", a: "可以。24小时接听，周末和节假日也不例外，也可以用中文咨询。被逮捕或第二天就要接受调查等紧急情况，打电话比填表更快。" },
      { q: "咨询内容会被泄露吗？", a: "不会。根据韩国法律，律师对执业中知悉的秘密负有保密义务。即使只咨询不委托，也同样适用。" },
    ],
  },
  offices: { title: "办公室", desc: "请前往离您最近的办公室。", map: "查看地图", phone: "电话", note: "24小时接听，周末和节假日也不例外。晚上也可以用中文咨询。" },
  contact: {
    title: "申请咨询",
    desc: "请简单写下发生了什么，负责律师确认后会与您联系。",
    caseTypes: ["签证·出入境", "刑事", "劳动·拖欠工资", "家事·离婚", "租房·合同", "企业", "医疗", "房地产", "其他"],
    stages: ["想先咨询一下", "准备告诉或起诉", "调查或诉讼进行中", "收到了通知或命令", "其他"],
  },
  footer: { bizNo: "韩国营业者登记号", adLawyer: "广告责任律师", privacy: "隐私政策", disclaimer: "免责声明", korean: "한국어" },
}

export const intlHome: Record<IntlLang, IntlHome> = {
  en,
  zh,
  vi: extraLangs.vi.intlHome as IntlHome,
  ru: extraLangs.ru.intlHome as IntlHome,
  mn: extraLangs.mn.intlHome as IntlHome,
}
