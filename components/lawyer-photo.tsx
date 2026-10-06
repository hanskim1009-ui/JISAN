"use client"

import Image from "next/image"
import { useState } from "react"

/** 사진 파일이 없거나 깨지면 이름 첫 글자로 대체 */
export function LawyerPhoto({
  src,
  name,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 38vw",
  initialClassName = "text-7xl",
}: {
  src: string
  name: string
  /** 양옆 여백 축소 등: object-cover + scale + object-center */
  imageClassName?: string
  sizes?: string
  /** 사진이 없을 때 첫 글자 크기 (작은 원형 사진은 text-sm) */
  initialClassName?: string
}) {
  const [error, setError] = useState(false)
  const initials = name.slice(0, 1)

  if (error || !src) {
    return (
      <div className="absolute inset-0 bg-[hsl(230_35%_18%)] flex items-center justify-center">
        <span className={`text-white/80 font-light select-none ${initialClassName}`}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      className={imageClassName ?? "object-cover object-top"}
      sizes={sizes}
      onError={() => setError(true)}
    />
  )
}
