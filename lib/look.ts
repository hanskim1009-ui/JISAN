import { SHOW_SAMPLES } from "@/lib/preview"

/**
 * 첫 화면 시안
 * photo: 능선 사진 (추천안) / ridge: 남색 바탕 + 움직이는 능선 그래픽 (B안, 채택)
 * LOOK 하나만 화면에 나갑니다. 두 시안을 다시 비교하려면 LOOK_SWITCH를 SHOW_SAMPLES로 바꾸면
 * 미리보기 화면 아래에 전환 버튼(또는 주소 끝 ?look=photo)이 생깁니다.
 */
export type Look = "photo" | "ridge"

export const LOOK: Look = "ridge"

/** 두 시안을 함께 넣고 전환 버튼을 보여 줄지 (B안 채택 후 끔. 다시 비교하려면 SHOW_SAMPLES) */
export const LOOK_SWITCH: boolean = false && SHOW_SAMPLES

/** 렌더링할 시안 목록 */
export const looksToRender: Look[] = LOOK_SWITCH ? ["photo", "ridge"] : [LOOK]

/** 첫 화면 그림이 깔리기 전에 html[data-look]을 정해 깜빡임을 막는 스크립트 */
export const lookInitScript = `(function(){try{var q=new URLSearchParams(location.search).get('look');var v=q||localStorage.getItem('jisan-look')||'${LOOK}';if(v!=='photo'&&v!=='ridge')v='${LOOK}';if(q)localStorage.setItem('jisan-look',v);document.documentElement.setAttribute('data-look',v)}catch(e){document.documentElement.setAttribute('data-look','${LOOK}')}})()`
