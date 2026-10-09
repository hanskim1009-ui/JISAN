import type { Center } from "@/lib/centers"

/**
 * crime center (en, /en/crime). scratchpad 번역 원문(형사센터 합본)을 옮긴 것
 * 법률 내용(조문·기간·요건)은 게시 전 담당 변호사 검수가 필요합니다.
 */
export const crimeEn: Center = {
  "slug": "crime-en",
  "lang": "en",
  "basePath": "/en/crime",
  "alternates": {
    "ko": "/crime",
    "en": "/en/crime",
    "zh": "/zh/crime",
    "vi": "/vi/crime",
    "ru": "/ru/crime",
    "mn": "/mn/crime"
  },
  "name": "Criminal Law Center",
  "summary": "Police questioning, arrest and detention, fraud and embezzlement, DUI and assault, filing criminal complaints",
  "tone": "dark",
  "seo": {
    "title": "Criminal Lawyer in Korea | Police Questioning, Detention, Criminal Trials | Jisan Law Criminal Law Center",
    "description": "Called in by the Korean police, arrested or detained, facing a criminal trial, or filing a complaint? At Jisan Law's Criminal Law Center, the managing partner consults with you in person, and we handle mock questioning, sitting in on questioning and defense written opinions. Message us through the chat on this page.",
    "keywords": [
      "criminal lawyer Korea",
      "police questioning lawyer Korea",
      "arrest warrant lawyer Korea",
      "fraud lawyer Korea",
      "embezzlement lawyer Korea",
      "DUI lawyer Korea",
      "assault lawyer Korea",
      "criminal complaint lawyer Korea"
    ]
  },
  "hero": {
    "title": "Don't face police questioning alone\nJisan Law stays with you from the start of the investigation to trial",
    "sub": "We don't hand you off to office managers or associate lawyers. The managing partner consults with you in person and handles mock questioning, sitting in on questioning and the defense written opinion."
  },
  "stageTitle": "What is your situation right now?",
  "stages": [
    {
      "label": "The police contacted me and told me to come in",
      "hint": "Prepare for questioning →",
      "href": "#process"
    },
    {
      "label": "Questioning is over and I'm waiting for the outcome",
      "hint": "Submit a written opinion →",
      "href": "#process"
    },
    {
      "label": "A family member has been arrested",
      "hint": "Call now →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "My home or workplace was searched",
      "hint": "Call now →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "I received an indictment",
      "hint": "Prepare for trial →",
      "href": "#consult"
    },
    {
      "label": "I was harmed and want to file a criminal complaint",
      "hint": "Filing a complaint →",
      "href": "#process"
    }
  ],
  "intro": {
    "title": "A criminal case is hard to talk about. Jisan Law is on your side",
    "body": [
      "From the day the police call, your mind starts racing. The more you search online, the more anxious you get, and the questioning date draws closer while you still don't know where to start. Jisan Law's Criminal Law Center sorts out what needs to be done first. Together we go over what you are accused of, what records exist, and which parts to dispute and which to admit.",
      "At Jisan Law, we don't hand you off to office managers or associate lawyers. The managing partner handles your first consultation in person. Once we take the case, we run mock questioning with likely questions, go into the interview room with you, and submit a defense written opinion after questioning. The lawyer in charge does all of this personally.",
      "We offer consultations at our main office in Seoul and our branch offices in Incheon, Hongseong and Songpa. You can send us a message through the chat on this page at any time, including weekends and public holidays. If time is short, as with an arrest, message us at any hour of the night."
    ]
  },
  "situations": {
    "title": "This is for you if",
    "items": [
      "You received a call or text from the police telling you to come in",
      "You pushed someone during an argument and were reported for assault",
      "You couldn't repay borrowed money on time and were accused of fraud",
      "Your company accused you of embezzlement for spending company money",
      "You thought it was a high-paying part-time job, but now you are being questioned over voice phishing",
      "You were caught driving under the influence and have a previous record",
      "A family member was arrested and you don't know where to start",
      "Someone took your money and you are deciding whether to file a criminal complaint"
    ]
  },
  "areasTitle": "Every case needs different preparation",
  "areas": [
    {
      "name": "Arrest, Detention and Search and Seizure",
      "law": "Criminal Procedure Act Articles 200-2, 201-2 and 215",
      "desc": "After an arrest, whether to request a detention warrant is decided within 48 hours. We visit right away to hear what happened, and prepare a written opinion and documents on residence, work and family for the pre-detention hearing. If you were searched, we check whether anything was seized beyond the scope written in the warrant, and request to take part in the forensic examination of phones and computers."
    },
    {
      "name": "Fraud, Embezzlement and Breach of Trust",
      "law": "Criminal Act Articles 347, 355 and 356; Act on the Aggravated Punishment of Specific Economic Crimes Article 3",
      "desc": "The dispute is often whether you meant to deceive from the start, or whether it is a civil matter where you could not repay because things got worse. We organize contracts, transfer records and messages in time order to respond, and we also file criminal complaints on behalf of victims."
    },
    {
      "name": "DUI and Traffic Accidents",
      "law": "Road Traffic Act Article 148-2; Act on Special Cases Concerning the Settlement of Traffic Accidents Article 3",
      "desc": "The statutory penalty is set by your blood alcohol level and past record. Within that range, we check how the test was done and find and argue the sentencing materials that actually carry weight."
    },
    {
      "name": "Assault, Injury and Threats",
      "law": "Criminal Act Articles 257, 260 and 283",
      "desc": "Early in the case, we decide whether it was a mutual fight, whether self-defense can be argued and when to settle. Simple assault and threats cannot be punished if the victim does not want punishment."
    },
    {
      "name": "Criminal Trials",
      "law": "Criminal Procedure Act Articles 266-3 and 358",
      "desc": "Once you receive the indictment, we first inspect and copy the investigation records and review them. We dispute contested points with evidence, and in cases you admit we prepare evidence of making up for the harm and sentencing materials. An appeal against a first-instance judgment must be filed within 7 days of the sentencing date."
    },
    {
      "name": "Filing Criminal Complaints",
      "law": "Criminal Procedure Act Articles 223 and 245-7",
      "desc": "We write the criminal complaint so investigators can see at once when, who and what, and we go with you to your questioning as the complainant. If the police decide not to refer the case to prosecutors, we file an objection to seek a new decision."
    }
  ],
  "table": {
    "title": "Penalties by Offense",
    "nav": "Penalties",
    "columns": [
      "Offense",
      "Legal basis",
      "Statutory penalty",
      "Notes"
    ],
    "rows": [
      [
        "Fraud",
        "Criminal Act Article 347",
        "Up to 20 years' imprisonment or a fine of up to KRW 50 million (as amended on December 23, 2025)",
        "The Specific Economic Crimes Act applies if the gain is KRW 500 million or more"
      ],
      [
        "Embezzlement, breach of trust",
        "Criminal Act Article 355",
        "Up to 5 years' imprisonment or a fine of up to KRW 15 million",
        ""
      ],
      [
        "Occupational embezzlement, breach of trust",
        "Criminal Act Article 356",
        "Up to 10 years' imprisonment or a fine of up to KRW 30 million",
        "The Specific Economic Crimes Act applies if the gain is KRW 500 million or more"
      ],
      [
        "Fraud, embezzlement, breach of trust (gain of KRW 500 million to under KRW 5 billion)",
        "Specific Economic Crimes Act Article 3",
        "Imprisonment for a fixed term of 3 years or more",
        "KRW 5 billion or more: life imprisonment or 5 years or more"
      ],
      [
        "Assault",
        "Criminal Act Article 260",
        "Up to 2 years' imprisonment, a fine of up to KRW 5 million, short-term detention or a petty fine",
        "Cannot be punished if the victim does not want punishment"
      ],
      [
        "Injury",
        "Criminal Act Article 257",
        "Up to 7 years' imprisonment, suspension of qualifications for up to 10 years, or a fine of up to KRW 10 million",
        "Can be punished even after a settlement"
      ],
      [
        "Special injury",
        "Criminal Act Article 258-2",
        "1 to 10 years' imprisonment",
        "No fine option"
      ],
      [
        "DUI (0.03% to under 0.08%)",
        "Road Traffic Act Article 148-2",
        "Up to 1 year's imprisonment or a fine of up to KRW 5 million",
        "Heavier if you violate again within 10 years of a fine or heavier sentence becoming final"
      ],
      [
        "DUI (0.08% to under 0.2%)",
        "Road Traffic Act Article 148-2",
        "1 to 2 years' imprisonment or a fine of KRW 5 million to 10 million",
        "Heavier if you violate again within 10 years of a fine or heavier sentence becoming final"
      ],
      [
        "DUI (0.2% or more)",
        "Road Traffic Act Article 148-2",
        "2 to 5 years' imprisonment or a fine of KRW 10 million to 20 million",
        "A repeat violation within 10 years of a fine or heavier sentence becoming final: 2 to 6 years' imprisonment or a fine of KRW 10 million to 30 million"
      ],
      [
        "Refusing a breathalyzer test",
        "Road Traffic Act Article 148-2",
        "1 to 5 years' imprisonment or a fine of KRW 5 million to 20 million",
        ""
      ],
      [
        "Injury caused by dangerous driving",
        "Act on the Aggravated Punishment of Specific Crimes Article 5-11",
        "1 to 15 years' imprisonment or a fine of KRW 10 million to 30 million",
        "If it causes death: life imprisonment or 3 years or more"
      ]
    ],
    "note": "The statutory penalty is the range of punishment set by law. The actual decision and sentence depend on factors such as criminal record, making up for the harm and whether a settlement was reached. Based on laws in force as of October 2026."
  },
  "points": {
    "title": "Why you should contact us before questioning",
    "items": [
      {
        "title": "Your first statement stays on record",
        "desc": "A statement you sign in the statement record becomes the basic material for deciding whether to refer the case and whether to indict. If what you say first differs from what you say later, it often leads to the view that your whole statement is hard to believe."
      },
      {
        "title": "After an arrest, things are decided within 48 hours",
        "desc": "If a detention warrant is not requested within 48 hours of the arrest, the person must be released (Criminal Procedure Act Article 200-2, etc.). Materials for the pre-detention hearing must be prepared within that time."
      },
      {
        "title": "From October 2026, prosecutors no longer investigate directly",
        "desc": "The Prosecutors' Office is abolished. The Public Prosecution Service (공소청) handles indictments, and the police and the Serious Crimes Investigation Agency (중대범죄수사청) handle investigations. Prosecutors decide based on the records and request supplementary investigation if something is missing, so statements and materials from the investigation stage may carry even more weight."
      },
      {
        "title": "Submit a written opinion before the decision is made",
        "desc": "It must be submitted before the police decide whether to refer the case and before the prosecutor decides whether to indict, or it will not be reflected. Right after questioning, while your memory is fresh, is a good time to write it."
      }
    ]
  },
  "processes": [
    {
      "title": "Defense for Suspects",
      "steps": [
        {
          "title": "One-on-one consultation",
          "desc": "The managing partner consults with you in person. We start by checking what you are accused of, what the text asking you to appear says and what materials you have."
        },
        {
          "title": "Setting a direction and collecting evidence",
          "desc": "We decide whether to dispute or admit the allegations. We first secure materials that can be deleted or overwritten, such as CCTV footage, messages and transfer records."
        },
        {
          "title": "Mock questioning",
          "desc": "We pick out likely questions and practice in advance as if it were the real questioning. This reduces the chance of changing your story because you panic in the interview room, and we make sure you don't fill in what you can't remember with guesses."
        },
        {
          "title": "Sitting in on questioning",
          "desc": "We go into the interview room with you. We object on the spot to leading or improper questions, and before you sign, we check together whether anything in the statement record differs from what you said."
        },
        {
          "title": "Submitting a defense written opinion",
          "desc": "After questioning, we submit to the police and prosecutor a written opinion that shows, with evidence, that there is no crime or that it is minor. If you admit the allegations, we also submit evidence of making up for the harm and of remorse."
        }
      ]
    },
    {
      "title": "Filing a Criminal Complaint (for Victims)",
      "steps": [
        {
          "title": "Analyzing the harm and the evidence",
          "desc": "We review whether the elements of a crime are met, pick out the key evidence and set a strategy. A complaint that does not meet the elements can turn into a dispute over false accusation, so we screen it out at this stage."
        },
        {
          "title": "Writing and filing the complaint",
          "desc": "We set out when, who and what so investigators can see it at once, attach a list of evidence and file it."
        },
        {
          "title": "Practicing for your questioning as the complainant",
          "desc": "We go over the counterarguments the other side is likely to raise, and prepare so your statement stays steady."
        },
        {
          "title": "Sitting in on your questioning as the complainant",
          "desc": "We go with you to the questioning, help with your statement and check how far the investigation has progressed."
        },
        {
          "title": "Petition for strict punishment and recovery of loss",
          "desc": "We submit a written opinion saying you want the offender punished, and if a settlement offer comes, we help steer it toward recovering your loss. If the police decide not to refer the case, we consider filing an objection."
        }
      ]
    }
  ],
  "lawyers": [
    {
      "slug": "kim-hansol",
      "note": "Former prosecutor at the Incheon District Prosecutors' Office, the Ansan Branch of the Suwon District Prosecutors' Office and the Hongseong Branch of the Daejeon District Prosecutors' Office"
    },
    {
      "slug": "koo-bonwoo",
      "note": "Economic criminal cases such as Capital Markets Act violations, investment fraud, embezzlement and breach of trust"
    }
  ],
  "faqs": [
    {
      "q": "The police contacted me and told me to come in. Do I have to go right away?",
      "a": "You can adjust the date and time by discussing it with the investigator. Rather than rushing, it is safer to find out what you are accused of and decide how to give your statement before you go. A lawyer can sit in on the questioning of a suspect (Criminal Procedure Act Article 243-2)."
    },
    {
      "q": "Do I have to make a statement during police questioning?",
      "a": "A suspect has the right to remain silent. You can refuse to answer all or some questions, and you cannot be disadvantaged for doing so (Criminal Procedure Act Article 244-3). In some cases, though, it is better to explain actively, so we decide how much to say after reviewing the materials before questioning."
    },
    {
      "q": "A family member has been arrested. What should I do now?",
      "a": "Whether to request a detention warrant is decided within 48 hours of the arrest. A lawyer can visit right after the arrest, so contact us immediately. If a warrant is requested, a judge questions the suspect in person (Criminal Procedure Act Article 201-2), and we prepare a written opinion and documents on residence, work and family for that hearing. You can send us a message through the chat on this page at any time, including weekends and public holidays."
    },
    {
      "q": "Questioning is over, and I was told the case has been referred to prosecutors. What happens now?",
      "a": "Once the case is referred, the prosecutor decides whether to indict. From October 2, 2026, the Prosecutors' Office is abolished and prosecutors at the Public Prosecution Service handle indictments. Prosecutors do not investigate directly, and if more is needed, they request supplementary investigation by the police (Criminal Procedure Act Article 197-2). Before the indictment decision, we can submit a defense written opinion to seek a decision of no charge due to lack of suspicion (혐의없음) or a suspended indictment (기소유예)."
    },
    {
      "q": "My company accused me of embezzlement for spending company money. Will I be detained right away?",
      "a": "Being accused does not mean you will be detained right away. A judge orders detention when there is substantial reason to suspect you committed a crime and you have no fixed residence, or there is a risk you will destroy evidence or flee (Criminal Procedure Act Articles 70 and 201). In embezzlement cases, the first issues are whether the money was held for the company and whether you spent it within your authority. The amount of loss and whether it was repaid greatly affect the outcome."
    },
    {
      "q": "I couldn't repay money I borrowed, and now I've been accused of fraud.",
      "a": "The key is whether you intended and were able to repay when you borrowed. If you could not repay because things got worse after borrowing, it may not be fraud. The judgment is based on the time you borrowed, so organize your income and assets at that time, your repayment history and the messages you exchanged, in time order."
    },
    {
      "q": "If I settle with the victim, will I avoid punishment?",
      "a": "It depends on the offense. For crimes that cannot be punished if the victim does not want punishment (반의사불벌죄), such as assault, threats and defamation, a settlement can end the case. For crimes such as injury, fraud and embezzlement, you can be punished even after a settlement, but it counts in your favor when the decision and sentence are set. The timing and method of the settlement also affect the outcome. If it is hard to contact the victim yourself, Jisan Law handles settlement contact on your behalf."
    },
    {
      "q": "I'm worried that what I say in a consultation will get out.",
      "a": "Under the Attorney-at-Law Act, lawyers must keep secret what they learn in the course of their work (Attorney-at-Law Act Article 26). We do not disclose the fact or content of a consultation without the client's consent."
    }
  ],
  "form": {
    "caseType": "Criminal",
    "stageOptions": [
      "Asked to appear (before questioning)",
      "Waiting for the outcome / referred after questioning",
      "Arrested or detained",
      "Searched and seized",
      "On trial",
      "Victim (preparing a complaint)"
    ]
  },
  "closing": "If a questioning date has been set, contact us before you go in."
}
