"use client"

import { useEffect, useState } from "react"

const sectionIds = ["about", "team", "practice", "contact", "map"]

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY + 120
      let current: string | null = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActiveId(current)
    }
    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => window.removeEventListener("scroll", update)
  }, [])

  return activeId
}
