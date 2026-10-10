import { Fragment } from "react"

/** "예상 결과는 {link}에서 …" 처럼 자리표시자 자리에 링크·굵은 글씨 등을 끼워 넣음 */
export function rich(tpl: string, nodes: Record<string, React.ReactNode>): React.ReactNode[] {
  return tpl.split(/(\{\w+\})/).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part)
    return <Fragment key={i}>{m && m[1] in nodes ? nodes[m[1]] : part}</Fragment>
  })
}
