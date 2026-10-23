import Decimal from 'decimal.js'

/**
 * All monetary math uses decimal.js. ETH amounts cross transport
 * boundaries as decimal strings (never JS floats).
 */
export type Eth = string

Decimal.set({ precision: 30, rounding: Decimal.ROUND_HALF_UP })

export function eth(value: string | number): Decimal {
  return new Decimal(String(value))
}

/** Normalize a Decimal back to a trimmed decimal string, e.g. 26.846. */
export function ethToString(value: Decimal, maxFraction = 8): Eth {
  return value.toFixed(maxFraction).replace(/\.?0+$/, '')
}

export function addEth(...values: Eth[]): Eth {
  return ethToString(values.reduce((acc, v) => acc.plus(eth(v)), new Decimal(0)))
}

export function subEth(a: Eth, b: Eth): Eth {
  return ethToString(eth(a).minus(eth(b)))
}

export function mulEth(a: Eth, qty: number): Eth {
  return ethToString(eth(a).times(qty))
}

export function ethCompare(a: Eth, b: Eth): number {
  return eth(a).comparedTo(eth(b))
}

/** Network fee = max(0.5% of subtotal, 0.016 ETH). Matches the design's "Taxa estimada". */
export function networkFeeEth(subtotal: Eth): Eth {
  const pct = eth(subtotal).times(0.005)
  const min = eth('0.016')
  const fee = pct.gte(min) ? pct : min
  return ethToString(fee)
}

/** Launch-discount model used by coupons: a flat fractional discount on subtotal. */
export function discountEth(subtotal: Eth, rate: number): Eth {
  if (rate <= 0) return '0'
  return ethToString(eth(subtotal).times(rate))
}
