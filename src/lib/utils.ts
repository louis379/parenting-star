import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())

  if (months < 1) return '未滿1個月'
  if (months < 12) return `${months} 個月`
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  if (remainMonths === 0) return `${years} 歲`
  return `${years} 歲 ${remainMonths} 個月`
}

export function calcAgeMonths(birthDate: string): number {
  const birth = new Date(birthDate)
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

export function getAgeStage(ageMonths: number): string {
  if (ageMonths < 4) return '新生兒'
  if (ageMonths < 12) return '嬰兒期'
  if (ageMonths < 36) return '幼兒期'
  if (ageMonths < 72) return '學齡前'
  return '學齡'
}
