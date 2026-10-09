/** 외국인 형사·가사센터 등록 (scratchpad fc/install.py 가 만듦. 직접 고치지 말 것) */
import type { Center } from "@/lib/centers"
import { crimeEn } from "@/lib/center-data/crime-en"
import crimeEnPages from "@/content/center-pages/crime-en.json"
import { familyEn } from "@/lib/center-data/family-en"
import familyEnPages from "@/content/center-pages/family-en.json"
import { crimeZh } from "@/lib/center-data/crime-zh"
import crimeZhPages from "@/content/center-pages/crime-zh.json"
import { familyZh } from "@/lib/center-data/family-zh"
import familyZhPages from "@/content/center-pages/family-zh.json"

export const intlCenters: Center[] = [crimeEn, familyEn, crimeZh, familyZh]
export const intlCenterPages: unknown[] = [crimeEnPages, familyEnPages, crimeZhPages, familyZhPages]
