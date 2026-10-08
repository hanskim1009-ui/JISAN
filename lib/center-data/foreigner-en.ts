import type { Center } from "@/lib/centers"

/**
 * Foreigner Center, English (/en/foreigner). lib/center-data/foreigner.ts 를 옮긴 것
 * 법률 내용(조문·기간·요건)은 게시 전 담당 변호사 검수가 필요합니다.
 */
export const foreignerEn: Center = {
  "slug": "foreigner-en",
  "lang": "en",
  "basePath": "/en/foreigner",
  "alternates": {
    "ko": "/foreigner",
    "en": "/en/foreigner",
    "zh": "/zh/foreigner"
  },
  "name": "Foreigner Center",
  "summary": "Refused stay extensions and status changes, departure, deportation and detention orders, immigration violation reviews, criminal cases involving foreigners, unpaid wages and workplace changes, international divorce, deposit and fraud losses",
  "tone": "warm",
  "seo": {
    "title": "Visa Lawyer Korea | Visa Refusal, Deportation, Foreigner Criminal Cases | Jisan Law Foreigner Center",
    "description": "Refused visa extension or change of status, cancelled stay permit, departure and deportation orders, immigration detention, police questioning of foreigners, unpaid wages, workplace changes and international divorce. We start by counting your deadlines and challenge decisions through administrative appeals and lawsuits. Consultations in English and Chinese. 24-hour phone line 02-6951-4097.",
    "keywords": [
      "visa lawyer Korea",
      "visa extension refused Korea",
      "deportation lawyer Korea",
      "departure order lawsuit Korea",
      "immigration detention Korea",
      "foreigner criminal lawyer Korea",
      "unpaid wages foreign worker Korea",
      "international divorce Korea"
    ]
  },
  "hero": {
    "title": "Legal trouble in Korea?\nWe handle it with your visa status in mind",
    "sub": "Refused stay extensions, departure and deportation orders, police questioning, unpaid wages, divorce and deposit disputes. We look at how one case can affect your stay in Korea, and you can consult with us in English or Chinese."
  },
  "stageTitle": "What is your situation right now?",
  "stages": [
    {
      "label": "My visa extension or change of status was refused",
      "hint": "First, check the departure deadline on the notice →",
      "href": "#process"
    },
    {
      "label": "I received a departure order or deportation order",
      "hint": "The deadline to object is short. Call now →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "My family member is held in an immigration detention center",
      "hint": "Call now →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "The police asked me to come in for questioning",
      "hint": "Requesting an interpreter and preparing →",
      "href": "#process"
    },
    {
      "label": "My foreign family member was arrested",
      "hint": "Call now →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "I have not been paid my wages or severance pay",
      "hint": "You can claim them regardless of your visa status →",
      "href": "#process"
    }
  ],
  "intro": {
    "title": "Criminal cases and visa issues must be looked at together",
    "body": [
      "For foreigners living in Korea, a legal problem often does not end with the problem itself. A single fine can count against you when you apply to extend your stay. The moment you quit your job, you need to work out how much time is left on your stay. During a divorce lawsuit, the first worry is what happens to your status of stay. The Jisan Law Foreigner Center does not look at the case and your stay separately. We advise on both together.",
      "This is especially true for criminal cases. If you are sentenced to imprisonment without labor or a heavier sentence (금고 이상의 형) and then released, you may become subject to deportation. Even a fine can be grounds for cancelling your stay permit if the violation is serious (Immigration Act Articles 46 and 89). Cases that end in a suspended indictment (기소유예) or a decision not to refer the case to prosecutors (불송치) still remain in investigation history records (수사경력자료), and these can be checked when needed for a foreigner's stay or naturalization permit (Act on the Lapse of Criminal Sentences, Article 6). That is why you need to consider what each possible outcome means for your stay from the investigation stage onward.",
      "Deadlines in foreigner cases are also short. If your extension of stay is refused, the notice will in principle state a departure deadline within 14 days of its issue date. An objection to a deportation order must be filed within 7 days of receiving the order. Filing an administrative appeal or an administrative lawsuit does not suspend the decision, so if a departure deadline applies, you must also apply for a stay of execution (집행정지).",
      "Partner Miso Kim consults in English and Managing Partner Hansol Kim in Chinese, including at night and on weekends. For other languages, we can arrange an interpreter if needed. Rather than simple application paperwork, we take on disputed cases such as refusals, cancellations and deportation, handling objections, administrative appeals and administrative lawsuits, as well as the related criminal, labor and family cases. Our consultation phone line is open 24 hours, including weekends and public holidays."
    ]
  },
  "situations": {
    "title": "Why people come to us",
    "items": [
      "I applied to extend my stay, but received a refusal notice with a departure deadline",
      "After being fined for drunk driving, I was told to report to the immigration office",
      "My husband was caught in an immigration crackdown and is in a detention center. I don't know how to get him out",
      "The police want to question me, but my Korean is limited. Can I ask for an interpreter?",
      "My company has not paid me for three months. I'm worried that reporting it will cause problems with my visa",
      "I work under the Employment Permit System, and my employer will not agree to let me change workplaces",
      "I want to divorce my Korean spouse. Do I have to leave Korea right after the divorce?",
      "My lease has ended, but the landlord will not return my deposit and avoids my calls"
    ]
  },
  "areasTitle": "Foreigner Center Practice Areas",
  "areas": [
    {
      "name": "Refusal of Stay Extension or Change of Status",
      "law": "Immigration Act Articles 24 and 25; Enforcement Decree Article 33; Administrative Litigation Act Article 20",
      "desc": "If your extension of stay or change of status of stay is refused, the notice will state a departure deadline. We check the reasons for refusal and decide whether to reapply or to challenge the decision through an administrative appeal or administrative lawsuit. If a departure deadline applies, we also apply for a stay of execution."
    },
    {
      "name": "Cancellation of Stay Permit or Permanent Residency",
      "law": "Immigration Act Articles 89 and 89-2",
      "desc": "A stay permit or permanent residency can be cancelled for reasons such as false documents, breach of permit conditions or violations of law. If you are given a chance to appear and state your opinion, we start preparing evidence from that point. If a cancellation decision is issued, we challenge it through an administrative appeal and an administrative lawsuit."
    },
    {
      "name": "Departure, Deportation and Detention Orders",
      "law": "Immigration Act Articles 46, 51, 55, 60, 63, 65 and 68",
      "desc": "A departure order (출국명령서), a deportation order (강제퇴거명령서) and a detention order (보호명령서) each have different ways and deadlines to challenge them. You can file an objection to a deportation order within 7 days of receiving it. If you are held in an immigration detention center (외국인보호소), you can request a review by the Immigration Detention Committee (외국인보호위원회) and apply for temporary release from detention (보호일시해제). We also handle lawsuits to cancel these orders and stays of execution."
    },
    {
      "name": "Entry Ban and Visa Refusal",
      "law": "Immigration Act Articles 7, 8 and 11",
      "desc": "When a family member abroad is refused a visa (사증) or is stopped from entering at the airport, we find out the reason. Court precedent indicates that it is difficult for the foreign national themselves to challenge a visa refusal in court, so we look at the procedures available to family members in Korea and the documents to add when reapplying."
    },
    {
      "name": "Immigration Violation Review and Illegal Employment",
      "law": "Immigration Act Articles 48, 94, 95, 101, 102 and 105",
      "desc": "We help foreigners who are investigated and reviewed by the immigration office for overstaying, working without permission or changing workplaces without permission, and companies investigated for hiring foreigners who are not allowed to work. We prepare you for questioning in person and respond to the process that can lead to a notice to pay an immigration fine (범칙금 통고처분), a departure order or a criminal referral, as well as restrictions on hiring."
    },
    {
      "name": "Refusal of Naturalization or Permanent Residency (F-5)",
      "law": "Nationality Act Articles 5 and 6; Enforcement Decree of the Immigration Act, Appended Table 1-3",
      "desc": "If your application for naturalization or permanent residency is refused for not meeting requirements such as good conduct or the ability to support yourself, we find out the specific reasons for refusal. We gather evidence to explain the issues that caused the problem, such as a past fine, and weigh whether reapplying or an administrative lawsuit is the better option."
    },
    {
      "name": "Marriage Migrant (F-6) Stay",
      "law": "Immigration Act Articles 25 and 25-2; Enforcement Decree Appended Table 1-2",
      "desc": "If you are separated from your Korean spouse, in the middle of a divorce lawsuit, or your spouse will not cooperate with the documents for your extension, we work out how you can keep your stay. We show, in both the divorce proceedings and the immigration review, that the Korean spouse is mainly responsible for the breakdown of the marriage."
    },
    {
      "name": "Questioning and Arrest of Foreign Suspects",
      "law": "Criminal Procedure Act Articles 180 and 243-2; Police Investigation Rules Article 91",
      "desc": "Foreigners have the right to be questioned with an interpreter in a language they understand, and if arrested, they can ask for their consulate to be notified. We help you practice before questioning, sit in on questioning, visit a detained person, and attend the pre-detention hearing (영장실질심사). We also check together that the interpreted record of your statement (조서) matches what you actually said."
    },
    {
      "name": "Criminal Penalties and Your Stay",
      "law": "Immigration Act Article 46(1)(13), Articles 89 and 89-2",
      "desc": "Cases that often involve foreigners, such as drunk driving, assault, drugs and providing bank accounts for voice phishing, lead to both criminal punishment and an immigration review. Reducing the outcome to a suspended indictment or a fine directly affects your stay, so we prepare for both issues together from the investigation stage."
    },
    {
      "name": "Criminal Complaints by Foreign Victims",
      "law": "Criminal Procedure Act Article 223; Enforcement Decree of the Immigration Act Article 92-2",
      "desc": "Many people hesitate to report assault, sexual crimes or fraud because they are worried about their visa status. There is a rule under which public officials may be exempt from their duty to notify immigration authorities when helping victims comes first, such as in a criminal investigation. We help with writing the criminal complaint (고소장), sitting in on your statement, settlement and compensation orders (배상명령)."
    },
    {
      "name": "Unpaid Wages, Severance Pay and Workplace Injury",
      "law": "Labor Standards Act Articles 36 and 107; Employee Retirement Benefit Security Act Article 9; Industrial Accident Compensation Insurance Act Article 6",
      "desc": "Foreign workers can receive pay for the work they did, severance pay and industrial accident insurance benefits regardless of their status of stay. We file petitions with the Labor Office (노동청 진정), bring civil lawsuits and provisional attachments (가압류), and file industrial accident claims. If your departure date is close, we plan the order of steps around that date."
    },
    {
      "name": "EPS (E-9) Workplace Change and Dismissal",
      "law": "Act on the Employment of Foreign Workers Article 25; Labor Standards Act Articles 23 and 28",
      "desc": "If unpaid wages or unfair treatment make it hard to keep working, in some cases you can apply to change workplaces without your employer's consent. We check the application deadline and the number of changes allowed, and if you were unfairly dismissed, we also consider an application for remedy to the Labor Relations Commission."
    },
    {
      "name": "International Divorce, Custody and Inheritance",
      "law": "Act on Private International Law Articles 56, 59, 66, 76 and 77",
      "desc": "When spouses have different nationalities, the first question is which country's court will handle the divorce and which country's law applies. We confirm the jurisdiction of Korean courts and the governing law, and handle divorce, custody and child support, and inheritance of property left in Korea."
    },
    {
      "name": "Deposits, Contracts and Fraud",
      "law": "Housing Lease Protection Act Articles 3 and 3-3; Immigration Act Article 88-2",
      "desc": "Once a foreigner completes alien registration and reports any change of residence, this has the same effect as a Korean move-in report (전입신고), so the deposit can be protected. We handle deposit refunds, orders for registration of lease rights (임차권등기명령), contract disputes, and civil and criminal proceedings for fraud victims."
    }
  ],
  "table": {
    "title": "How to Challenge Each Immigration Decision, and the Deadlines",
    "nav": "Deadlines by decision",
    "columns": [
      "Decision or situation",
      "How to challenge it",
      "Deadline",
      "Legal basis"
    ],
    "rows": [
      [
        "Refusal of extension of stay or change of status of stay",
        "Reapply, administrative appeal or administrative lawsuit (with an application for a stay of execution if needed)",
        "90 days from the day you learned of the decision. The departure deadline on the notice is set within 14 days of the issue date",
        "Enforcement Decree of the Immigration Act Article 33; Administrative Appeals Act Article 27; Administrative Litigation Act Article 20"
      ],
      [
        "Cancellation or change of stay permit",
        "Appear and state your opinion; after the decision, administrative appeal or administrative lawsuit",
        "Notice to appear must be given at least 7 days before the hearing date. After the decision, 90 days from the day you learned of it",
        "Immigration Act Article 89"
      ],
      [
        "Cancellation of permanent residency (F-5)",
        "State your opinion, apply for a general status of stay, administrative appeal or administrative lawsuit",
        "90 days from the day you learned of the decision",
        "Immigration Act Article 89-2"
      ],
      [
        "Departure order (출국명령)",
        "Administrative appeal or administrative lawsuit, with a stay of execution",
        "The departure deadline is set within 30 days of the issue date. Lawsuits: 90 days from the day you learned of the decision",
        "Immigration Act Article 68; Enforcement Rules Article 65"
      ],
      [
        "Deportation order (강제퇴거명령)",
        "Objection to the Minister of Justice; administrative lawsuit with a stay of execution",
        "Objection: 7 days from the day you received the order. Lawsuit: 90 days from the day you learned of it",
        "Immigration Act Article 60; Administrative Litigation Act Article 20"
      ],
      [
        "Detention in an immigration detention center (외국인보호소)",
        "Request for review by the Immigration Detention Committee; application for temporary release from detention",
        "The Committee decides within 3 weeks of receiving the documents (can be extended once by up to 2 weeks)",
        "Immigration Act Articles 55 and 65; Enforcement Decree Articles 70 and 79-2"
      ],
      [
        "Immigration violation review (notice to pay an immigration fine, 범칙금 통고처분)",
        "Pay the fine or dispute the violation; any later departure or deportation order is challenged through its own procedure",
        "If not paid within 15 days of receiving the notice, the case is referred for prosecution",
        "Immigration Act Articles 102 and 105, Article 68(1)(5)"
      ],
      [
        "Exit ban during an investigation or trial (출국정지)",
        "Objection to the Minister of Justice",
        "10 days from the day you received the notice or learned of it",
        "Immigration Act Articles 29 and 4-5"
      ],
      [
        "Refusal of naturalization",
        "Reapply or file an administrative lawsuit",
        "90 days from the day you learned of the decision",
        "Nationality Act Article 4; Administrative Litigation Act Article 20"
      ]
    ],
    "note": "Based on laws in force as of October 2026. Unless there is a justifiable reason, an administrative appeal cannot be filed after 180 days, and an administrative lawsuit after 1 year, from the date of the decision. Filing an appeal or lawsuit does not suspend the decision, so if you have a departure deadline, you must also apply for a stay of execution (Administrative Appeals Act Article 30; Administrative Litigation Act Article 23)."
  },
  "points": {
    "title": "Four things we check first in foreigner cases",
    "items": [
      {
        "title": "We start with the dates on your documents",
        "desc": "We first check the departure deadline on the refusal notice, the date you received the deportation order, and the expiry date of your current period of stay. These dates decide which procedures are available."
      },
      {
        "title": "Criminal outcomes carry over to immigration review",
        "desc": "If you are sentenced to imprisonment without labor or a heavier sentence and then released, you may become subject to deportation. Even a fine counts against you in extension, change of status, permanent residency and naturalization reviews. Even if the case ends in a suspended indictment or a decision not to refer it to prosecutors, investigation history records remain. Reducing the outcome at the investigation stage is also a way to protect your stay."
      },
      {
        "title": "Do not sign documents you do not understand",
        "desc": "Statement records and immigration documents are written in Korean. You can ask for the contents to be read back to you through an interpreter, and you should ask for anything that differs from what you said to be corrected before you sign."
      },
      {
        "title": "The decision stays in effect while you challenge it",
        "desc": "Filing an administrative appeal or lawsuit does not stop the departure deadline. You must apply for a stay of execution before the deadline and get a decision in order to remain in Korea while you challenge it."
      }
    ]
  },
  "processes": [
    {
      "title": "Foreigners questioned in a criminal case",
      "steps": [
        {
          "title": "Consultation and checking your status of stay",
          "desc": "Managing Partner Hansol Kim personally hears the allegations and the details of the request to appear, and checks your status of stay and its expiry date using your passport and residence card (외국인등록증). Consultations are available in English and Chinese."
        },
        {
          "title": "Requesting an interpreter and practicing for questioning",
          "desc": "We tell the investigator in advance which language you need an interpreter for, and we practice questioning with likely questions. We make sure you do not fill in what you cannot remember with guesses."
        },
        {
          "title": "Sitting in on questioning",
          "desc": "We go into the interview room with you, check that the interpreted questions and answers match, and object on the spot to leading or improper questions. Before you sign, we check the statement record again through the interpreter."
        },
        {
          "title": "Written opinions and responding to the decision",
          "desc": "If you dispute the allegations, we submit a written opinion organizing the evidence. If you admit them, we submit evidence of compensation to the victim and of your life in Korea to the police and prosecutor. We also explain how the level of the outcome affects your stay."
        },
        {
          "title": "Connecting to immigration procedures",
          "desc": "Once a decision or judgment is issued, we prepare for requests to appear at the immigration office, extension reviews and deportation procedures. If needed, we continue on to objections and administrative lawsuits."
        }
      ]
    },
    {
      "title": "When you receive a departure order or deportation order",
      "steps": [
        {
          "title": "Checking the type of decision and the dates",
          "desc": "We check whether the document you received is a departure recommendation (출국권고서), a departure order (출국명령서) or a deportation order (강제퇴거명령서), and write down the date you received it and the departure deadline. The available procedures and deadlines differ by type."
        },
        {
          "title": "Objection",
          "desc": "For a deportation order, an objection is submitted to the Minister of Justice through the immigration office within 7 days of receiving the order. If there are special reasons you need to stay in Korea, we also request special permission to stay (체류허가 특례)."
        },
        {
          "title": "Responding to detention",
          "desc": "If you are held in an immigration detention center, we request a review of the detention or apply for temporary release from detention to the Immigration Detention Committee. We prepare the security deposit, a guarantor and proof of housing."
        },
        {
          "title": "Administrative lawsuit and stay of execution",
          "desc": "We file a lawsuit to cancel the decision within 90 days of the day you learned of it, and if departure or removal is imminent, we also apply for a stay of execution. We use evidence to show harm that would be hard to undo, such as family ties, illness or ongoing court cases."
        },
        {
          "title": "Wrapping up based on the outcome",
          "desc": "If the decision stands, we settle money owed to you, property and ongoing cases before you leave, and check in advance anything that could cause problems if you want to enter Korea again."
        }
      ]
    },
    {
      "title": "When your extension or change of status is refused",
      "steps": [
        {
          "title": "Checking the refusal notice",
          "desc": "We check the reasons for refusal and the departure deadline. In principle, the departure deadline is set within 14 days of the notice's issue date. If a change of status was refused, we also check whether you can stay for the remaining period under your existing status."
        },
        {
          "title": "Choosing how to challenge it",
          "desc": "If the refusal was due to missing documents, it may be faster to add them and reapply. If the problem is a discretionary judgment or a factual error, we prepare an administrative appeal or administrative lawsuit."
        },
        {
          "title": "Applying for a stay of execution",
          "desc": "Within the departure deadline, we apply for a stay of execution together with the administrative appeal or lawsuit. We work backward from the deadline so that it does not pass before a decision is made."
        },
        {
          "title": "Organizing arguments and evidence",
          "desc": "We organize your life during your stay, family relationships, employment and tax records, and the circumstances of any criminal record to show that the decision is excessively harsh."
        },
        {
          "title": "After the ruling or judgment",
          "desc": "If the decision is cancelled, your case is reviewed again so you can obtain permission to stay. If your claim is dismissed, we decide together whether an appeal, reapplying or preparing to leave is the better option."
        }
      ]
    }
  ],
  "lawyers": [
    {
      "slug": "kim-miso",
      "note": "Consults in English · Graduate of the Graduate School of Interpretation and Translation (English Interpretation and Translation), Hankuk University of Foreign Studies · Former in-house counsel, Legal Team, Wemade Co., Ltd. · Daehwan Law Firm · Oracle Law Firm"
    },
    {
      "slug": "kim-hansol",
      "note": "Consults in Chinese · Former prosecutor at the Incheon District Prosecutors' Office, Ansan Branch of the Suwon District Prosecutors' Office and Hongseong Branch of the Daejeon District Prosecutors' Office · Graduate of the University of Toronto, Canada"
    }
  ],
  "faqs": [
    {
      "q": "My extension was refused. Do I really have to leave by the date on the notice?",
      "a": "If you do not leave by the departure deadline on the notice, you will be overstaying and may face deportation or punishment. To challenge the refusal, you must file an administrative appeal or administrative lawsuit before the deadline, apply for a stay of execution at the same time, and get a decision. If there is an unavoidable reason such as illness or lack of transportation, you can also apply to postpone the departure deadline (Enforcement Rules of the Immigration Act Article 33)."
    },
    {
      "q": "Can just a fine cause problems with my stay?",
      "a": "A fine is not included in 'imprisonment without labor or a heavier sentence' (Immigration Act Article 46(1)(13)), which is a ground for deportation. However, a fine can still be counted against you in reviews for extension of stay, change of status of stay, permanent residency and naturalization. If the violation is serious, your stay permit can even be cancelled (Immigration Act Article 89(1)(5)). The assessment of the same fine can vary depending on how the case happened and how you have lived since, so you should work to reduce the outcome from the investigation stage."
    },
    {
      "q": "I am staying in Korea illegally. Can I still report that I was not paid?",
      "a": "Court precedent holds that a foreigner without work authorization who actually worked has the right to wages, severance pay and industrial accident insurance benefits. When a labor inspector investigating unpaid wages finds that helping the victim comes first, the duty to notify immigration authorities can be waived (Enforcement Decree of the Immigration Act Article 92-2; Enforcement Rules Article 70-2). However, the waiver depends on the judgment of the official in charge, so get advice before you report."
    },
    {
      "q": "Can I ask for an interpreter during police questioning?",
      "a": "Yes. When the police question a foreigner, they must provide interpretation in a language the person understands (Police Investigation Rules Article 91(1)). Even if you can handle everyday conversation, legal terms used during questioning may be misunderstood, so it is safer to ask for an interpreter. The statement record is written in Korean, so ask for it to be read back to you through the interpreter before you sign."
    },
    {
      "q": "If I receive a deportation order, can I never come back to Korea?",
      "a": "A person who left Korea after receiving a deportation order may be banned from entering for 5 years (Immigration Act Article 11(1)(6)). The actual length of the entry restriction depends on the reason. If you have received the order, you should first consider together with us whether you can challenge it through an objection within 7 days and an administrative lawsuit, or whether leaving voluntarily is the better option."
    },
    {
      "q": "If I divorce my Korean spouse, does my marriage migrant status end?",
      "a": "Marriage migrant (F-6) status can still be granted if the marriage could not continue because of the spouse's death or disappearance, or for other reasons you are not responsible for (Enforcement Decree of the Immigration Act, Appended Table 1-2). The Supreme Court interprets this as cases where the Korean spouse is mainly responsible for the breakdown of the marriage (Supreme Court Decision 2018Du66869, July 4, 2019). That is why arguing over who is responsible in the divorce lawsuit is directly tied to your stay."
    },
    {
      "q": "Can I get advice in English or Chinese?",
      "a": "Yes. Partner Miso Kim consults in English and Managing Partner Hansol Kim in Chinese, including at night and on weekends. If you need another language, or if family members will join the consultation, let us know in advance and we will arrange the necessary interpretation. Court and investigation documents are written in Korean, so we will explain important documents to you one by one."
    },
    {
      "q": "How are fees decided?",
      "a": "Fees vary depending on the type and stage of the case and the number of procedures needed, so we let you know after the consultation. When several procedures are involved together, such as an objection, an administrative lawsuit and a criminal case, we first decide what you will entrust to us and in what order, and then explain the fees."
    }
  ],
  "form": {
    "caseType": "Foreigner",
    "stageOptions": [
      "Refusal of stay extension or change of status, cancellation of stay permit, entry ban",
      "Departure order, deportation order, detention order",
      "Immigration violation review, police questioning, arrest or other criminal case",
      "Labor issues such as unpaid wages or workplace change",
      "Other, such as divorce, deposits or fraud"
    ]
  },
  "closing": "If you have received a document with a departure deadline, contact us before the deadline passes."
}
