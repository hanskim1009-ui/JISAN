/** 계산할 수 없는 입력: code 는 사전(content/tools/i18n/{언어}/*.json 의 errors)의 키, message 는 한국어 설명 */
export class CalcError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
  }
}
