import { describe, expect, it } from 'vitest'
import isoDateToYYYYMM from '@/utils/date-manipulators/isoDateToYYYYMM'
import yyyyMMToISODate from '@/utils/date-manipulators/yyyyMMToISODate'

describe('date manipulators', () => {
  it('formats ISO dates to YYYY-MM for month inputs', () => {
    expect(isoDateToYYYYMM('2026-02-01T00:00:00.000Z')).toBe('2026-02')
    expect(isoDateToYYYYMM('')).toBe('')
  })

  it('converts YYYY-MM values to ISO start-of-month dates', () => {
    expect(yyyyMMToISODate('2026-03')).toBe('2026-03-01T00:00:00.000Z')
    expect(yyyyMMToISODate('')).toBe('')
    expect(yyyyMMToISODate('2026-13')).toBe('')
  })
})
