import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format an ETH amount kept as a decimal string (e.g. "1.190000000000000000"). */
export function formatEth(value: string, maxFraction = 3): string {
  const num = Number(value)
  if (Number.isNaN(num)) return value
  const [int, frac] = value.split('.')
  const trimmedFrac = (frac ?? '').replace(/0+$/, '')
  const shown = trimmedFrac ? trimmedFrac.slice(0, maxFraction) : '0'
  const whole = int ?? '0'
  return trimmedFrac ? `${whole}.${shown}` : whole
}

export function formatCurrencyEth(value: string, maxFraction = 3): string {
  return `${formatEth(value, maxFraction)} ETH`
}

/** Compact wallet address: 0xA91F…E82C */
export function shortenAddress(address: string, head = 6, tail = 4): string {
  if (address.length <= head + tail) return address
  return `${address.slice(0, head)}…${address.slice(-tail)}`
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}
