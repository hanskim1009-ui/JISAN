# 구형·양형 계산기 번역 안내 (번역 에이전트용)

다른 계산기·체크리스트의 번역은 `TRANSLATE.md` 를 보세요. 이 문서는 **구형 예상 계산기**(`/{lang}/tools/prosecution`)와
**선고형 예상 계산기(양형기준)**(`/{lang}/tools/sentencing`)만 다룹니다. 언어는 `en`, `zh`, `vi`, `ru`, `mn`.

## 1. 무엇을 번역하나

원문은 `ko/` 에 있고, 같은 이름으로 `{lang}/` 에 번역본을 만듭니다. 다섯 파일이 **모두** 있고 원문의 키가 **하나도 빠지지 않아야**
그 언어 페이지가 생깁니다(하나라도 빠지면 그 언어 계산기는 404, 한국어로 채우지 않음). 공통 틀 문구 `{lang}/common.json` 은 `TRANSLATE.md` 쪽 몫이지만 그것도 있어야 합니다.

| 파일 | 내용 | 원문 분량 |
|---|---|---|
| `prosecution-ui.json` | 구형 계산기 화면 문구, 처리 단계 이름·설명, 묶음(`groups`)·법률(`laws`) 이름 | 약 1,800자 |
| `prosecution-crimes.json` | 고른 죄명 103개의 이름·법정형·조문·질문·보기·결과 문장·참고 | 약 39,700자 |
| `sentencing-ui.json` | 양형 계산기 화면 문구, 계산 설명 문장(`engine`) | 약 4,100자 |
| `sentencing-groups.json` | 범죄군 12개의 이름·적용 범위·세부 범죄·유형·양형인자·집행유예 참작사유·주의사항 | 약 79,000자 |
| `num-format.json` | 금액·기간 표기 틀 (아래 4) | 짧음 |

어떤 죄명·범죄군을 번역하는지는 `prosecution-ids.json`, `sentencing-ids.json` 에 이유와 함께 적혀 있습니다. 목록에 없는 죄명은
외국어판에서 검색되지 않고, 화면 아래 "다른 죄명은 메시지로 문의하세요" 안내(`intl.otherCrimes`)가 대신합니다.

## 2. 규칙

- **값만 번역.** 키, 죄명 id, 질문 id, 보기 값(`options` 의 왼쪽), 유형 번호, 인자 id 는 그대로 둡니다. `_note` 는 번역하지 않아도 됩니다.
- **목록은 같은 개수, 같은 순서.** `tiers`, `notes`, `aliases` 를 뺀 모든 목록(`probation` 의 각 칸, `rules.items` 등)은 원문과 개수·순서가 같아야 합니다.
  `tiers` 는 원문 칸 수 그대로, 빈 칸 `{}` 은 빈 칸 그대로 둡니다.
- **`aliases`(다른 이름)** 는 그 언어 사용자가 검색할 만한 말을 자유롭게 넣습니다(개수 자유, 한국어 별칭을 옮길 필요 없음). 예: en `["DUI", "drink driving"]`.
- **자리표시자** `{n}`, `{total}`, `{range}`, `{zone}` 같은 것은 글자 그대로 남기고, 문장 안 위치는 그 언어 어순에 맞게 옮겨도 됩니다.
  한국어 조사가 붙은 틀(예: `"{zone}으로 보면"`, `"{side}가 큽니다"`)은 그 언어 문장으로 새로 쓰세요.
- **법률 이름·죄명 표기**는 이미 게시한 외국인센터·형사센터 번역을 따릅니다:
  `lib/center-data/crime-{lang}.ts`, `lib/center-data/foreigner-{lang}.ts`, `content/center-pages/crime-{lang}.json`, `content/center-pages/foreigner-{lang}.json`
  (예: en `Immigration Act`, `Road Traffic Act`). 거기 없는 법률은 법제처 영문 법령 이름을 쓰고, 한 파일 안에서 같은 법률은 같은 이름으로.
  `prosecution-ui.json` 의 `laws` 에 법률 이름을 한 번 정해 두고, `law`(조문) 칸도 같은 이름으로 씁니다. 조문 표기 예: `형법 제257조 제1항` → en `Criminal Act, Article 257(1)`.
- **한국어 병기**는 괄호 안에서만, 꼭 필요한 절차 용어에만 (센터 번역처럼 `suspect (피의자)`). 검사 스크립트는 괄호 밖 한글을 경고합니다.
- **글 속 금액·기간**(법정형, 결과 문장, 참고)은 그 언어 표기로 바꿔 씁니다: `1천만원 이하의 벌금` → en `a fine of up to KRW 10 million`,
  `징역 1년 6월` → en `1 year 6 months in prison`. 숫자 값은 바꾸지 마세요. (계산기가 계산해서 보여 주는 벌금·형량 범위는 4의 표기 틀로 자동으로 만들어집니다.)
- **양형 형량 범위(`1년6월 - 4년` 같은 칸)는 번역하지 않습니다.** 파일에도 없습니다. 계산기가 `num-format.json` 과 `sentencing-ui.json` 의 `engine`
  (`between`, `atMost`, `atLeast`, `life`, `death`, `fine`, `mixed`)로 다시 만듭니다.
- **집행유예 참작사유 끝의 꼬리표** `(일반사기 유형)` 같은 것도 번역합니다(어느 세부 범죄에 쓰는지는 계산기가 원문으로 미리 골라 둡니다).
- **쉬운 말로.** 법률 용어는 처음 나올 때 한 번 풀어 줍니다(원문이 이미 풀어 쓴 곳은 그대로 옮기면 됩니다).

## 3. 사이트 원칙 (어기면 검사 스크립트가 오류)

- 광고 금지어: 전문·전문가·최고·1등·승소율·퍼센트로 된 성과·결과 보장·무료·서초·전관에 해당하는 말
  (en `expert`, `specialist`, `best`, `No. 1`, `win rate`, `guarantee`, `free` … / zh `专家`, `最好`, `免费` … 등 `check-crimes.mjs` 의 `BANNED`).
- **외국어 사이트는 전화·신청서 없이 메신저로만 문의**합니다. 화면 문구의 "상담 신청으로 물어보세요"는 "메시지로 물어보세요"로 옮깁니다.
  전화번호, "call us", "hotline", "application form" 같은 말을 쓰지 마세요.
- **상담 언어를 약속하지 마세요**("we speak English", "in your language", "用中文" 등 금지).
- **출처**: 구형 계산기는 기준 문서 이름을 어디에도 쓰지 않습니다(원문에도 없음). 양형 계산기는 "2026 양형기준(양형위원회)" 표기만 허용
  (en 예: `2026 Sentencing Guidelines (Sentencing Commission)`).
- 결과를 약속하는 말 금지. 원문에 있는 "참고용" 안내(`notice`, `disclaimer`)는 빼지 말고 옮깁니다.

## 4. `num-format.json` (금액·기간 표기 틀)

```jsonc
{
  "locale": "en",            // Intl 복수형 규칙에 쓰는 언어 코드
  "decimal": ".",            // 소수점
  "group": ",",              // 천 단위 구분 (러시아어는 " ")
  "money": { "system": "million", "small": "KRW {n}", "million": "KRW {n} million", "billion": "KRW {n} billion" },
  "period": {
    "year":  { "one": "{n} year",  "other": "{n} years" },
    "month": { "one": "{n} month", "other": "{n} months" },
    "day":   { "one": "{n} day",   "other": "{n} days" },
    "sep": " "               // 연·월·일 사이 (중국어는 "")
  }
}
```

- `money.system` 은 `million`(100만 원 단위로 나눔: 150만원 → `KRW 1.5 million`) 또는 `man`(만·억 단위: `150万韩元`).
  `million` 은 `small`(100만 원 미만)·`million`·`billion`, `man` 은 `small`·`man`·`eok`·`eokMan`(`{eok}`·`{man}`) 이 필요합니다.
- `period` 의 복수형 칸은 그 언어의 규칙(`one`·`few`·`many`·`other`)대로. `other` 는 꼭 있어야 합니다. 0개월은 `month` 의 복수형으로 나옵니다.
- 시험해 본 값 (그대로 써도 됩니다):

| 언어 | money | 150만원 | 1년 6월 |
|---|---|---|---|
| en | million, `KRW {n} million` | KRW 1.5 million | 1 year 6 months |
| zh | man, `{n}万韩元`, `{n}亿韩元`, `{eok}亿{man}万韩元`, small `{n}韩元`; period `{n}年` `{n}个月` `{n}天`, sep `""` | 150万韩元 | 1年6个月 |
| vi | million, decimal `,` group `.`, `{n} triệu won`, `{n} tỷ won`, small `{n} won` | 1,5 triệu won | 1 năm 6 tháng |
| ru | million, decimal `,` group `" "`, `{n} млн вон`, `{n} млрд вон`; год/года/лет, месяц/месяца/месяцев, день/дня/дней | 1,5 млн вон | 1 год 6 месяцев |
| mn | million, `{n} сая вон`, `{n} тэрбум вон`; `{n} жил`, `{n} сар`, `{n} хоног` | 1.5 сая вон | 1 жил 6 сар |

## 5. 검사

```bash
node content/tools/i18n/check-crimes.mjs
```

- **오류**(종료 코드 1): 키 누락·빈 번역·목록 개수 다름, 자리표시자 다름, 금지어, 전화번호, 화면 문구의 전화·신청서·상담 언어 약속, 원문에 없는 퍼센트,
  `num-format.json` 의 빠진 틀, 원문(`ko/`)이 원본 데이터와 다름.
- **경고**: 원문에 없는 키, 괄호 밖 한글, 원문 숫자가 번역에 안 보임(금액 단위가 바뀐 곳은 빼고 셈). 경고는 한 번씩 눈으로 확인하세요.

## 6. 원본 데이터가 바뀌면

`content/tools/prosecution/*.json`, `content/tools/sentencing/*.json` 이 바뀌거나 `*-ids.json` 목록을 고치면:

```bash
node content/tools/i18n/check-crimes.mjs --write-ko   # ko/ 원문을 다시 뽑음 (prosecution-ui.json 의 groups·laws 에 새 이름 추가)
node content/tools/i18n/check-crimes.mjs              # 언어별로 빠진 곳이 오류로 나옴 → 번역 보충
```

번역을 보충하기 전까지 구조가 맞지 않는 죄명·범죄군은 그 언어 화면에서 자동으로 빠지고(빌드 로그에 경고), 키가 빠진 언어는 페이지가 404 가 됩니다.

## 7. 게시 전

법률 내용(법정형·조문·요건)은 게시 전 담당 변호사 검수가 필요합니다. 번역 파일 첫머리 `_note` 에 번역 날짜·검수 여부를 적어 두면 좋습니다.
