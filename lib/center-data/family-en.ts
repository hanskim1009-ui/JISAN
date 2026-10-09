import type { Center } from "@/lib/centers"

/**
 * family center (en, /en/family). scratchpad 번역 원문(형사센터 / 이혼·상간·상속센터 합본)을 옮긴 것
 * 법률 내용(조문·기간·요건)은 게시 전 담당 변호사 검수가 필요합니다.
 */
export const familyEn: Center = {
  "slug": "family-en",
  "lang": "en",
  "basePath": "/en/family",
  "alternates": {
    "ko": "/divorce",
    "en": "/en/family",
    "zh": "/zh/family",
    "vi": "/vi/family"
  },
  "name": "Family Law Center",
  "summary": "Divorce, property division and custody; claims against a spouse's affair partner and defending against such claims; renouncing or accepting an inheritance with limited liability, dividing an estate, and forced heirship shares",
  "tone": "warm",
  "seo": {
    "title": "Divorce, Affair and Inheritance Lawyers in Korea | Property Division, Custody, Compensation, Renunciation, Forced Heirship | Jisan Law Family Law Center",
    "description": "Jisan Law's Family Law Center helps with divorce by agreement and divorce lawsuits in Korea, property division, custody and child support, a spouse's affair and claims against the affair partner, responding to an affair lawsuit, renouncing an inheritance or accepting it with limited liability, estate division and forced heirship shares. 24-hour phone line: 02-6951-4097.",
    "keywords": [
      "divorce lawyer Korea",
      "international divorce Korea",
      "property division Korea",
      "child custody Korea",
      "affair lawsuit Korea",
      "affair partner compensation Korea",
      "renounce inheritance Korea",
      "limited acceptance of inheritance Korea",
      "inheritance lawyer Korea",
      "forced heirship share Korea"
    ]
  },
  "hero": {
    "title": "Family legal problems—\nyou don't have to carry them alone",
    "sub": "Divorce and property division, raising your children, a spouse's affair, and inheritance after a family member passes away. Jisan Law's Family Law Center stays with you through family matters handled by Korean courts, from the first consultation to after the judgment."
  },
  "stageTitle": "What situation are you in right now?",
  "stages": [
    {
      "label": "I've decided to divorce but don't know where to start",
      "hint": "First, let's see whether agreement or a lawsuit is the right path →",
      "href": "#process"
    },
    {
      "label": "I received a divorce complaint from my spouse",
      "hint": "Your answer is due within 30 days of receiving it →",
      "href": "#consult"
    },
    {
      "label": "I found out my spouse is having an affair",
      "hint": "Let's start by organizing the evidence together →",
      "href": "#consult"
    },
    {
      "label": "I've been sued by my partner's spouse over an affair",
      "hint": "Your answer is due in 30 days →",
      "href": "#process"
    },
    {
      "label": "My parent passed away and I don't know if there are debts",
      "hint": "Check assets and debts first, within 3 months →",
      "href": "#process"
    },
    {
      "label": "My siblings and I can't agree on dividing the estate",
      "hint": "Before signing anything, look at special benefits and contribution shares →",
      "href": "#consult"
    },
    {
      "label": "My spouse keeps verbally abusing or assaulting me",
      "hint": "Call now →",
      "href": "tel:02-6951-4097",
      "urgent": true
    }
  ],
  "intro": {
    "title": "Family matters—you don't have to face them alone",
    "body": [
      "Problems with the people closest to you are hard to talk about with anyone. Even so, rather than leading with emotional arguments, you need to check the issues that must be settled: the grounds for divorce, how the assets were built up, and where the children will be raised. Jisan Law's Family Law Center does not push anyone toward divorce. We first listen to where you stand now and what you most want to protect, and then set a direction.",
      "Whether you have just learned of your spouse's affair or have been sued by your partner's spouse, the outcome often depends less on how strong your feelings are and more on what material you put before the court and how. After a family member dies, each procedure has a deadline, such as the 3 months for renouncing an inheritance (상속포기) or accepting it with limited liability (한정승인), so the first task is deciding what to do in what order.",
      "Divorce ties together property, children and emotions in several knots. If it can end by agreement, we put the terms clearly in writing to reduce the chance of another dispute. If a lawsuit is needed, we prove the legal grounds for divorce with evidence. Consultations are available at our main office in Seoul and our branch offices in Incheon, Hongseong and Songpa, and 02-6951-4097 is answered 24 hours a day, including weekends and public holidays."
    ]
  },
  "situations": {
    "title": "Are you carrying worries like these alone?",
    "items": [
      "I have no idea where to begin",
      "All our assets are in my spouse's name, and I don't know if I can get anything",
      "I worry every day about whether I can keep my child",
      "There are signs of an affair, but the evidence is scattered everywhere",
      "One day, out of nowhere, I received a lawsuit from the court over an affair",
      "I didn't know the person I was seeing was married, but I've been asked to pay compensation",
      "My father passed away and I have no idea how much debt he had",
      "I cared for my parents for over 10 years, but my siblings want to split everything equally",
      "One of my siblings is out of contact, so we can't sign a division agreement"
    ]
  },
  "areasTitle": "Family Law Center practice areas",
  "areas": [
    {
      "name": "Divorce by Agreement",
      "law": "Civil Act Articles 834 and 836-2",
      "desc": "A procedure in which spouses agree on the divorce and on parental authority and custody of their children, and obtain confirmation from the family court. The court does not confirm property division or compensation for emotional distress (위자료), so we write a careful agreement to prevent future disputes."
    },
    {
      "name": "Judicial Divorce and Emotional Distress Compensation",
      "law": "Civil Act Articles 840 and 843",
      "desc": "If your spouse will not agree to a divorce, we prove the legal grounds for divorce and resolve it by judgment. We also claim compensation for emotional distress from the spouse responsible for the breakdown of the marriage."
    },
    {
      "name": "Property Division (Real Estate, Severance Pay, Pensions)",
      "law": "Civil Act Article 839-2",
      "desc": "Assets built up together during the marriage are divided regardless of whose name they are in. We list everything from real estate, deposits and shares to severance pay and pensions, and calculate each share based on contribution, including a homemaker's housework and childcare."
    },
    {
      "name": "Parental Authority, Custody and Visitation",
      "law": "Civil Act Articles 837, 837-2 and 909",
      "desc": "The court decides the person with parental authority (친권자) and the custodial parent (양육자) based on the child's welfare. We organize records of who has cared for the child and how the child will be raised after the divorce to prepare for the family investigation (가사조사), and we also set how visitation (면접교섭) will work."
    },
    {
      "name": "Child Support Claims and Enforcement",
      "law": "Family Litigation Act Articles 63-2 and 64",
      "desc": "We claim child support based on the Child Support Guidelines (양육비 산정기준표), and if circumstances change we seek an increase or decrease. If the set child support is not paid, we collect it through a performance order (이행명령) and a direct payment order (직접지급명령)."
    },
    {
      "name": "Ending a De Facto Marriage",
      "law": "Civil Act Article 839-2 applied by analogy (case law)",
      "desc": "Even without a marriage report, if a de facto marriage (사실혼) is recognized, you can claim property division and compensation for emotional distress. We first prove the de facto marriage with materials such as a wedding ceremony, a meeting between the families, and sharing of living costs."
    },
    {
      "name": "Claims Against an Affair Partner",
      "law": "Civil Act Articles 750 and 751",
      "desc": "We claim damages for emotional harm from the person who engaged in infidelity with your spouse. We organize how the affair happened, how long it lasted and how much it harmed the marriage, and then set the amount and scope of the claim."
    },
    {
      "name": "Organizing and Preserving Evidence of Infidelity",
      "law": "Civil Procedure Act Article 375",
      "desc": "We arrange KakaoTalk messages, photos, payment records and movements in time order to find the points to prove. For material that will soon be deleted, such as CCTV footage at lodging facilities, we apply to the court for preservation of evidence (증거보전) even before a lawsuit."
    },
    {
      "name": "Defending an Affair Lawsuit (Defendant)",
      "law": "Civil Procedure Act Article 256",
      "desc": "An answer must be filed within 30 days of receiving the copy of the complaint. We examine whether there was infidelity, whether you knew the person was married, and whether the marriage had already broken down at the time, and ask for the claim to be dismissed or reduced."
    },
    {
      "name": "Reducing Compensation and Reviewing Reimbursement Claims",
      "law": "Civil Act Article 760",
      "desc": "Even if liability is found, we dispute the amount based on the length and circumstances of the relationship and the state of the marriage at the time. We also look at whether, after paying compensation, you can seek reimbursement (구상) of a share from the spouse who took part in the affair."
    },
    {
      "name": "Certified Letters and Settlement Agreements",
      "law": "",
      "desc": "If you want to resolve the matter without a lawsuit, it can be settled with a certified letter (내용증명) and an agreement. The agreement clearly states the amount, payment deadline, a ban on further contact, confidentiality, a penalty for breach, and whether any further claims may be made."
    },
    {
      "name": "Together with a Divorce Lawsuit",
      "law": "Family Litigation Act Article 2 (Category Da cases)",
      "desc": "If you divorce, you can bring claims against both your spouse and the affair partner at once in the family court. If you only claim against the affair partner without divorcing, the lawsuit is filed in a civil court."
    },
    {
      "name": "Renouncing an Inheritance and Limited Acceptance",
      "law": "Civil Act Articles 1019, 1026, 1028 and 1041",
      "desc": "When the deceased's debts exceed the assets, or the amount is unknown, you must file with the family court within 3 months of learning that the inheritance has begun. We decide which family members renounce and which accept with limited liability so the debts do not pass to relatives further down the line, and if the deadline has passed we check whether special limited acceptance (특별한정승인) is possible."
    },
    {
      "name": "Estate Division",
      "law": "Civil Act Articles 1013 and 1015; Family Litigation Act Articles 2 and 50",
      "desc": "Every heir must take part in an estate division agreement, and it has no effect if even one is left out. If there is a minor heir or a sibling who cannot be reached, a special representative (특별대리인) or an administrator of an absentee's property (부재자재산관리인) must be appointed first. If no agreement is reached, the estate is divided through family court mediation and a ruling."
    },
    {
      "name": "Forced Heirship Share Claims",
      "law": "Civil Act Articles 1112 to 1118",
      "desc": "If gifts during life or a will left the assets concentrated on one person, children and spouses can claim half of their statutory inheritance share, and parents one third, as a forced heirship share (유류분). Siblings no longer have a forced heirship share. Whether you are claiming or being claimed against, we start by checking when the gifts were made and the limitation period."
    },
    {
      "name": "Wills: Drafting, Probate and Invalidity",
      "law": "Civil Act Articles 1060, 1065 to 1072 and 1091",
      "desc": "A will is valid only if it follows a form set by law, such as handwritten, recorded or notarized. For those who want to leave a will, we advise on the form and wording. For those who found a will, we guide them through the court inspection of the will (검인). For those who doubt a will, we explain lawsuits to confirm a will is invalid, which challenge defects in form and the testator's mental capacity."
    },
    {
      "name": "Contribution Shares and Special Benefits",
      "law": "Civil Act Articles 1008 and 1008-2",
      "desc": "An heir who cared for a parent for a long time or helped grow the assets can claim a contribution share (기여분), and if an heir received wedding funds or a home in advance, others can claim it as a special benefit (특별수익), so that the actual shares are recalculated. From March 2026, a gift received as compensation for such contribution is not treated as a special benefit to that extent."
    },
    {
      "name": "Investigating the Estate and Recovering an Inheritance",
      "law": "Civil Act Articles 999, 1004 and 1004-2",
      "desc": "We check the assets through the Safe Inheritance One-Stop Service (안심상속 원스톱서비스, a government service that searches a deceased person's assets and debts in a single application) and financial transaction inquiries, and trace money withdrawn around the time of death and property registrations transferred in secret. We also consider a claim for recovery of inheritance against a false heir, a claim for disqualification from inheritance or a declaration of loss of inheritance rights, and, if needed, a criminal complaint."
    }
  ],
  "table": {
    "title": "Grounds for Judicial Divorce (Civil Act Article 840)",
    "nav": "Grounds for divorce",
    "columns": [
      "Item",
      "Grounds set by law",
      "Examples"
    ],
    "rows": [
      [
        "Item 1",
        "When the spouse has committed an unchaste act",
        "Even without sexual intercourse, an act that breaks the spouses' duty of fidelity may qualify. If you consented in advance or forgave it later, you cannot file on this ground."
      ],
      [
        "Item 2",
        "When the spouse has maliciously deserted the other",
        "Leaving home without a valid reason and cutting off living expenses, or otherwise abandoning the duties to live together, support and cooperate"
      ],
      [
        "Item 3",
        "When one has been treated extremely unfairly by the spouse or the spouse's lineal ascendants",
        "Assault, abuse or serious insults from the spouse or the spouse's parents"
      ],
      [
        "Item 4",
        "When one's own lineal ascendant has been treated extremely unfairly by the spouse",
        "When your spouse verbally abused or assaulted your parents"
      ],
      [
        "Item 5",
        "When it has been unknown for 3 years or more whether the spouse is alive or dead",
        "When it has not been possible to confirm whether the spouse is even alive for more than 3 years"
      ],
      [
        "Item 6",
        "When there is any other serious reason making it difficult to continue the marriage",
        "Long separation, an irreparable breakdown due to incompatibility, gambling or wasteful spending, continual verbal abuse, and so on"
      ]
    ],
    "note": "A divorce on the ground in Item 1 cannot be claimed once 6 months have passed since you learned of the infidelity, or 2 years since it occurred (Civil Act Article 841). The ground in Item 6 is also limited to 6 months from learning of it and 2 years from when it occurred (Civil Act Article 842), but if the ground is still continuing, these periods do not apply. Where it is disputed whether something like incompatibility falls under Item 6, we judge it after reviewing the specific circumstances in a consultation."
  },
  "points": {
    "title": "Principles Jisan Law's Family Law Center follows",
    "items": [
      {
        "title": "We listen to your story before reaching conclusions",
        "desc": "Every family's circumstances are different, even in divorce. If you are still deciding whether to divorce at all, we start by sorting through that question with you. There is no need to rush your decision."
      },
      {
        "title": "We look at how assets were built, not whose name they are in",
        "desc": "In property division, what matters is not whose name an asset is in but how it was accumulated during the marriage and who contributed how much. If account transfers or property sales happen first, they become harder to challenge, so we start by tracing the flow of assets."
      },
      {
        "title": "We gather evidence only by lawful means",
        "desc": "Secretly installing a location-tracking app or recording conversations between other people can be punished under the Location Information Act and the Protection of Communications Secrets Act, and secretly recorded conversations cannot be used as evidence in court. Entering the other person's home or room can also be trespassing. We check the method before anything is collected."
      },
      {
        "title": "Three months pass quickly",
        "desc": "Between the funeral, reporting the death and checking assets, a month can go by in no time. Results from the Safe Inheritance One-Stop Service can take close to 20 days depending on the institution, so if you are considering renouncing the inheritance or limited acceptance, apply for it when you report the death and count backward from the deadline."
      }
    ]
  },
  "processes": [],
  "lawyers": [
    {
      "slug": "kim-hansol",
      "note": "Former prosecutor at the Incheon District Prosecutors' Office, the Ansan Branch of the Suwon District Prosecutors' Office and the Hongseong Branch of the Daejeon District Prosecutors' Office"
    },
    {
      "slug": "kim-miso",
      "note": "Formerly at Daehwan Law Firm, in-house counsel on the legal team of Wemade Co., Ltd., and Oracle Law Firm"
    }
  ],
  "faqs": [
    {
      "q": "Can I divorce just because of incompatibility?",
      "a": "Incompatibility by itself is not automatically a ground for judicial divorce. But if it has broken the marriage down so badly that it is hard to repair, you can divorce on the ground of 'any other serious reason making it difficult to continue the marriage' under Civil Act Article 840, Item 6. If both of you agree, you can simply proceed with a divorce by agreement (협의이혼)."
    },
    {
      "q": "Can a homemaker receive property division?",
      "a": "Yes. Property division (재산분할) is decided not by whose name the assets are in but by each spouse's contribution to building and keeping the assets during the marriage, and housework and childcare count as contributions. The division ratio differs case by case depending on the length of the marriage, how the assets were built and whether both spouses worked."
    },
    {
      "q": "How much child support can I receive, and until when?",
      "a": "Child support (양육비) is set with reference to the Seoul Family Court's Child Support Guidelines, which reflect the parents' incomes and the children's ages and number, and in principle it is paid until the child becomes an adult. It may be increased for special circumstances such as the child's illness or education costs, and if circumstances change later, you can ask for an increase or decrease."
    },
    {
      "q": "Can I claim compensation only from the affair partner without divorcing?",
      "a": "Yes. A claim for compensation against the affair partner is a right separate from divorce, so you can make it while staying married. In that case, you file a damages lawsuit in a civil court. However, because the harm to the marriage is assessed as smaller than when it ends in divorce, the amount awarded may be lower."
    },
    {
      "q": "What happens if I ignore an affair lawsuit filed against me?",
      "a": "If you do not file an answer within 30 days of receiving the copy of the complaint, the court can treat you as having admitted the plaintiff's claims and rule without a hearing (Civil Procedure Act Articles 256 and 257). The full amount claimed may be awarded, so respond before the deadline. It is also wise not to contact the plaintiff or the plaintiff's spouse directly to explain yourself."
    },
    {
      "q": "Which is better: renouncing an inheritance or limited acceptance?",
      "a": "If the debts clearly exceed the assets and there is almost nothing to inherit, renunciation is simpler. If you do not know whether the assets or the debts are larger, or you are worried that renouncing will pass the debts to relatives further down the line, consider limited acceptance. With limited acceptance you only have to pay the debts up to the value of the inherited assets, but after it is accepted by the court you must carry out the liquidation process yourself, including public notice and distribution."
    },
    {
      "q": "I found out about the debts after 3 months. Is there nothing I can do?",
      "a": "If you did not know, without gross negligence, that the debts exceeded the assets, you can make a limited acceptance within 3 months of learning that fact (Civil Act Article 1019(3)). The date you first received a complaint or a payment demand is often treated as that day, so keep the envelope and the date of receipt. In this case, only limited acceptance is available, not renunciation."
    },
    {
      "q": "Can siblings claim a forced heirship share?",
      "a": "Not anymore. On April 25, 2024, the Constitutional Court ruled that the forced heirship provision for siblings was unconstitutional, and Civil Act Article 1112, Item 4 was deleted. Forced heirship shares are now recognized only for children and spouses (half of the statutory share) and parents (one third)."
    }
  ],
  "form": {
    "caseType": "Family",
    "stageOptions": [
      "I'm considering or preparing for a divorce",
      "I've filed or received a divorce complaint",
      "I want to bring a claim against my spouse's affair partner",
      "I've received an affair lawsuit or a certified letter",
      "I'm looking into renouncing an inheritance or limited acceptance",
      "It's about estate division, forced heirship shares or a will"
    ]
  },
  "closing": "If you don't know where to begin, start by telling us your story."
}
