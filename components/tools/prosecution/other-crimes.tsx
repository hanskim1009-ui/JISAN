import Link from "next/link"

/** 외국어판: 번역한 죄명만 있으니, 없는 죄명은 메시지로 문의하라는 안내 */
export function OtherCrimes({ text, link, href }: { text: string; link: string; href: string }) {
  return (
    <p className="mt-8 rounded-xl bg-[#F4F5F7] px-5 py-4 text-sm leading-relaxed text-[#4A505A]">
      {text}{" "}
      <Link href={href} className="font-semibold text-jisan-ink underline underline-offset-2 hover:text-brand-accent">
        {link}
      </Link>
    </p>
  )
}
