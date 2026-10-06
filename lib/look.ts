import { SHOW_SAMPLES } from "@/lib/preview"

/**
 * 첫 화면 시안
 * photo: 능선 사진 (추천안) / ridge: 남색 바탕 + 움직이는 능선 그래픽 (B안)
 * 정식 사이트에는 LOOK 하나만 나갑니다. 개발 미리보기에서는 두 시안을 모두 넣고
 * 화면 왼쪽 아래 전환 버튼(또는 주소 끝 ?look=ridge)으로 바꿔 볼 수 있습니다.
 */
export type Look = "photo" | "ridge"

export const LOOK: Look = "photo"

/** 미리보기에서만 두 시안을 함께 렌더링 */
export const LOOK_SWITCH = SHOW_SAMPLES

/** 렌더링할 시안 목록 */
export const looksToRender: Look[] = LOOK_SWITCH ? ["photo", "ridge"] : [LOOK]

/** 첫 화면 그림이 깔리기 전에 html[data-look]을 정해 깜빡임을 막는 스크립트 */
export const lookInitScript = `(function(){try{var q=new URLSearchParams(location.search).get('look');var v=q||localStorage.getItem('jisan-look')||'${LOOK}';if(v!=='photo'&&v!=='ridge')v='${LOOK}';if(q)localStorage.setItem('jisan-look',v);document.documentElement.setAttribute('data-look',v)}catch(e){document.documentElement.setAttribute('data-look','${LOOK}')}})()`
