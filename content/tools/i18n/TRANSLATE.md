# 계산기·자가진단 번역 안내서 (1단계 도구)

계산기 페이지(`/tools/…`)의 외국어판(`/en/tools/…` 등)을 만드는 방법입니다.
한국어 원문은 `content/tools/i18n/ko/` 에 있고, 번역본은 **같은 파일 이름·같은 모양**으로 `content/tools/i18n/{언어}/` 에 둡니다.
언어 코드: `en`(영어) `zh`(중국어 간체) `vi`(베트남어) `ru`(러시아어) `mn`(몽골어).

구형·양형 계산기(`prosecution-*.json`, `sentencing-*.json`, `num-format.json`)는 이 안내서가 아니라 `TRANSLATE-crimes.md` 를 따르세요.

## 1. 만들 파일

| 파일 | 내용 | 원문 글자 수 |
|---|---|---|
| `common.json` | 공통 틀(상담 안내·관련 페이지), 목록 페이지, 도구 이름·설명 11개, 단위 | 약 900자 |
| `police-summons.json` | 경찰 출석요구 체크리스트 (질문, 항목 45개 제목·설명·근거, 인쇄물) | 약 6,900자 |
| `drunk-driving.json` | 음주운전 처벌 기준 (질문, 결과 문장, 조문, 면허 처분 안내) | 약 4,900자 |
| `deadline.json` | 법정 기한 계산기 (절차 25개 이름·기산일·근거, 공휴일 이름 32개) | 약 2,500자 |
| `child-support.json` | 양육비 계산기 | 약 1,800자 |
| `inheritance.json` | 상속분 계산기 (상속인 입력 칸·순위 이름은 유류분 계산기도 같이 씀) | 약 2,000자 |
| `reserved-share.json` | 유류분 계산기 | 약 1,800자 |

- `common.json` 이 없으면 그 언어의 계산기 페이지는 하나도 생기지 않습니다.
- 도구 파일이 있고 **모든 키가 빈칸 없이** 있어야 그 도구 페이지가 생깁니다. 하나라도 빠지면 한국어로 채우지 않고 그 페이지를 만들지 않습니다.
- `reserved-share` 페이지는 `inheritance.json` 도 있어야 생깁니다.
- 목록(`/{언어}/tools`)에는 번역이 다 된 도구만 나옵니다. hreflang 연결도 자동입니다.
- 다 쓰면 검사: `node content/tools/i18n/check.mjs en` (한 도구만: `node content/tools/i18n/check.mjs en deadline`). ✗ 오류는 반드시 고치고, ! 경고는 확인하세요.

시작할 때는 한국어 파일을 복사해서 값만 바꾸는 것이 가장 안전합니다:
`mkdir -p content/tools/i18n/en && cp content/tools/i18n/ko/deadline.json content/tools/i18n/en/`

## 2. 그대로 두는 것 (번역하지 않음)

| 항목 | 예 | 이유 |
|---|---|---|
| JSON 키 이름 전부 | `ui`, `items`, `verify-caller`, `call`, `default` | 코드가 이 이름으로 읽음 |
| `deadline.json` 의 `holidays` **키** | `"추석": "…"` 의 왼쪽 `추석` | 공휴일 표(holidays.json)의 이름과 맞춰 찾음. **오른쪽 값만** 번역 |
| 자리표시자 | `{n}` `{date}` `{label}` `{item}` `{name}` `{rank}` `{link}` `{reason}` … | 프로그램이 숫자·날짜·이름·링크를 넣는 자리. 철자 그대로, 개수 그대로 (순서는 그 언어에 맞게 옮겨도 됨) |
| 조문 번호·숫자 | 제148조의2 제1항 제1호, 0.03%, 100점, 90일, 2년 | 번호·숫자를 바꾸지 말고 표기 방식만 그 언어식으로 |
| 금액 숫자 | 500만원, 3천만원, 1,200만 원 | 숫자를 바꾸거나 반올림하지 말 것 (KRW 5 million, 500万韩元 …) |
| 배열의 개수 | `terms`, `notIncluded`, `lawChanges` | 항목을 빼거나 더하지 말 것. `keywords` 만 개수 자유 |

- `{link}` 자리에는 다른 계산기로 가는 링크(그 계산기 이름)가, `{rank}` 자리에는 굵은 글씨의 순위 이름이 들어갑니다. 문장 안 위치는 자연스럽게 옮겨도 됩니다.
- 날짜(`{date}`, `{from}`, `{to}`)와 금액(`{lo}`, `{hi}`, `{income}`)은 프로그램이 그 언어 방식으로 써서 넣습니다(예: October 6, 2026 / KRW 1,234,000). 문장에 "년·월·일"이나 "원"을 따로 붙이지 마세요.

## 3. 파일별로 주의할 곳

### common.json
- `shell.ctaPhone` 은 **넣지 마세요**(삭제). 한국어판 전용 전화 안내입니다. 있으면 검사에서 오류입니다.
- `shell.ctaLead`: 전화 이야기 없이 "메시지로 사정을 보내 주시면 변호사가 확인하고 답합니다" 뜻으로.
  예(en): "Send us a message about your situation. A lawyer will review it and reply."
- `shell.ctaButton`: "메시지로 문의" 뜻 (en "Message us"). 이 버튼은 `/{언어}/consult`(메신저 안내 페이지)로 갑니다.
- `list.seoDescription`: 목록에 나오는 도구는 언어마다 다르므로 **도구 이름을 늘어놓지 말고** "사건에서 먼저 따져 볼 것을 직접 계산해 보는 도구" 같은 일반적인 설명으로.
- `tools`: 11개 모두 번역합니다(아직 번역되지 않은 도구 이름도 링크 문구로 쓰일 수 있음).
- `units`
  - `won`: 금액 표기 틀. en `"KRW {n}"`, zh `"{n}韩元"`, vi `"{n} KRW"`, ru `"{n} вон"`, mn `"{n} вон"`
  - `wonUnit`: 금액 입력칸 옆 단위. en `"KRW"`, zh `"韩元"` …
  - `percent`: `"{n}%"` (러시아어는 `"{n} %"` 도 됨)
  - `people`: 사람 수 칸 표시. en `"{n}"`, zh `"{n}人"`, vi `"{n} người"`
- `words.decrease` / `words.increase`: 화면 읽기 프로그램용 단추 이름 ("Fewer {label}" / "More {label}" 처럼).

### police-summons.json
- `items` 의 `title`·`desc` 가 `{ "call": …, "letter": … }` 처럼 객체인 항목은 상황에 따라 바뀌는 문장입니다. 변형 키(`call`, `letter`, `victim`, `witness`, `counsel`, `default`, `phone`)는 그대로 두고 각 문장을 번역하세요.
- `schedule-agree.desc.default` 원문은 "…협의해야 하고. 일정이…" 로 문장이 어색하게 끊겨 있습니다. 번역은 "수사관은 조사 일시·장소를 당신과 협의해야 합니다. 일정이 정해지면 문자로 확인받아 두세요." 뜻의 온전한 문장으로 쓰세요.
- `summary.*` 는 "신분: 피의자 · 출석일까지: 2~7일 …" 처럼 이어 붙는 짧은 표기입니다. `{v}` 는 고른 선택지 이름.
- `basis`(근거)는 조문 표기입니다. 아래 5의 표기법을 따르세요.
- `print` 는 인쇄용 문서의 제목·꼬리말입니다.

### drunk-driving.json
- `msg` 아래가 계산 결과 문장입니다. `msg.law.*` 는 조문 표기, `msg.penalty.*` 는 법정형("1년 이상 6년 이하 징역이나 500만원 이상 3천만원 이하 벌금")입니다. 숫자·단위를 정확히 옮기세요.
- `msg.repeat` 의 `{base}` 에는 "0.2% 이상" 같은 구간 이름이 들어갑니다.
- `msg.lic.reduction` 의 `{effect}` 에는 `reductionRevoke`/`reductionSuspend` 문장이 들어갑니다.
- `ui.disqualification` 의 `{years}` 에는 굵은 글씨로 `ui.years`("{n}년")가 들어갑니다.
- `ui.lawFootLink` 는 구형 예상 계산기 외국어판이 있을 때만 보입니다.

### deadline.json
- `procedures.*.period` 는 법조문에 적힌 기간 표기("2주", "7일")입니다. 숫자와 단위를 그대로 옮기세요(2 weeks, 7 days).
- `procedures.*.from` 은 기간이 시작되는 사건(예: "판결서를 송달받은 날"), `basis` 는 근거 조문입니다.
- `ui.skip` 은 "{reason}이라 하루 미룸" — `{reason}` 에 요일·공휴일 이름이 들어갑니다 (en "{reason}, moved to next day").
- `holidays`: 값만 그 언어의 공휴일 이름으로 (설날 → Seollal (Lunar New Year), 추석 → Chuseok, 대체공휴일 → substitute holiday).

### child-support.json · inheritance.json · reserved-share.json
- `child-support.json` 의 `ui.bandRange`·`bandFrom`·`bandTo` 는 기준표 소득 칸입니다. 한국어는 `{lo}` 에 "400만" 같은 만 단위가 들어가지만 외국어판에는 원 단위 숫자("4,000,000")가 들어가므로, 금액 틀에 맞춰 en `"KRW {lo}–{hi}"`, `"KRW {lo} or more"`, `"KRW {hi} or less"` 처럼 쓰세요.
- `child-support.json` 의 `ui.highIncome` 처럼 문장 안에 금액이 직접 쓰인 곳(월 1,200만 원)은 숫자를 바꾸지 말고 그 언어 표기로(KRW 12 million).
- `inheritance.json` 의 `names` 는 결과 표에 나오는 사람 이름("자녀 1", "자녀 1의 배우자", "형제자매 2의 자녀(조카) 1")을 만드는 틀입니다.
- `ranks` 는 상속 순위 이름입니다.
- 분수(1/3), 백분율은 프로그램이 넣습니다.

## 4. 외국어판에서 바꾸는 것 (중요)

외국어 사이트는 **전화·신청서 없이 메신저 채팅으로만** 상담합니다.

- 어디에도 전화번호, `tel:`, "전화 주세요/call us" 같은 전화 권유 문장을 넣지 마세요.
- 원문의 "변호사와 상의하세요"는 그대로 옮겨도 됩니다("talk to a lawyer"). "전화로 상담" 같은 방법을 덧붙이지 마세요.
- 상담 언어(예: "영어로 상담할 수 있습니다")를 새로 약속하지 마세요.

## 5. 법 이름·조문 표기

- 이미 번역된 형사·가사·외국인센터와 같은 이름을 쓰세요. 먼저 찾아보기:
  `grep -oh "Road Traffic Act[^,;.]*" content/center-pages/crime-en.json | sort | uniq -c`
  (언어별 파일: `content/center-pages/{crime,family,foreigner}-{언어}.json`, `lib/center-data/*-{언어}.ts`)
- 기존 영어 번역에서 쓰는 이름 (각 언어는 같은 파일의 그 언어판을 확인):

| 한국어 | en |
|---|---|
| 형사소송법 | Criminal Procedure Act |
| 검사와 사법경찰관의 상호협력과 일반적 수사준칙에 관한 규정(수사준칙) | Mutual Cooperation between Prosecutors and Judicial Police Officers and General Investigation Rules |
| 경찰수사규칙 | Police Investigation Rules |
| 도로교통법 / 시행규칙 별표 28 | Road Traffic Act / Attached Table 28 of the Enforcement Rules of the Road Traffic Act |
| 특정범죄 가중처벌 등에 관한 법률 | Act on the Aggravated Punishment of Specific Crimes |
| 교통사고처리 특례법 | Act on Special Cases Concerning the Settlement of Traffic Accidents |
| 행정심판법 / 행정소송법 | Administrative Appeals Act / Administrative Litigation Act |
| 민법 / 민사소송법 / 민사집행법 / 민사조정법 | Civil Act / Civil Procedure Act / Civil Execution Act / Civil Conciliation Act |
| 가사소송법 | Family Litigation Act |

- 조문 표기는 기존 번역과 같게:

| 언어 | 제148조의2 제3항 제1호 |
|---|---|
| en | Article 148-2(3)(1) |
| zh | 第148条之2第3款第1项 |
| vi | Điều 148-2 khoản 3 điểm 1 |
| ru | ст. 148-2 ч. 3 п. 1 |
| mn | 148-2-р зүйлийн 3-р хэсгийн 1-р заалт |

- 사전 파일마다 법 이름이 **처음** 나오는 곳에 한국어 원래 이름을 괄호로 붙여도 됩니다(예: `Road Traffic Act (도로교통법)`). 검사 스크립트는 한글이 남은 곳을 경고(!)로 보여 주니, 이런 의도한 경우만 남기세요.

## 6. 쓰면 안 되는 말 (변호사 광고 규정)

어느 언어로도 아래 뜻을 쓰지 마세요. `check.mjs` 가 대표 단어를 찾아 경고합니다.

- 전문·전문가 (en specialist/expert, zh 专家/专业律师, vi chuyên gia, ru специалист/эксперт, mn мэргэжилтэн)
- 최고·1등 (best, No. 1, 最好/第一, tốt nhất, лучший, шилдэг)
- 승소율이나 퍼센트로 된 성과, 결과 보장 (guarantee, 保证, đảm bảo kết quả, гарантия, баталгаа)
- 무료 (free, 免费, miễn phí, бесплатно, үнэгүй)
- 서초, 전관
- 결과를 약속하는 표현. 원문의 "~할 수 있습니다", "~될 수 있습니다", "참고용" 같은 조심스러운 말투를 그대로 살리세요.

## 7. 내용을 바꾸지 마세요

- 원문에 없는 기간·금액·조문을 더하지 마세요. 그 나라 사정에 맞춰 "보충"하지 말고 원문 뜻만 옮깁니다.
- 원문이 틀려 보이면 고치지 말고 보고에 적어 주세요(법률 내용은 변호사 검토 대상).
- 쉬운 말로. 법률 용어는 처음 나올 때 한 번 풀어 주세요(원문이 괄호로 풀어 둔 곳은 그대로 풀이).

## 8. 끝나면

1. `node content/tools/i18n/check.mjs {언어}` 통과 (마지막 줄 "페이지가 생기는 도구" 에 번역한 도구가 모두 나와야 함)
2. 보고: 만든 파일 목록, 경고 중 그대로 둔 것과 이유, 원문에서 이상해 보인 곳
