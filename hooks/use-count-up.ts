"use client"

import { useEffect, useState } from "react"

export function useCountUp(
  target: number,
  isVisible: boolean,
  duration = 1200,
  decimals = 0
) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let start: number
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 2.5) // ease-out
      const current = target * eased
      setValue(decimals > 0 ? Number(current.toFixed(decimals)) : Math.floor(current))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, isVisible, duration, decimals])

  return value
}
