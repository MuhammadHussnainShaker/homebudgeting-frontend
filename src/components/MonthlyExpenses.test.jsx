import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MonthlyExpenses from './MonthlyExpenses'

describe('MonthlyExpenses', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders fetched categories, expenses, and totals', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          success: true,
          data: [{ _id: 'p1', description: 'Housing' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          success: true,
          data: [
            {
              _id: 'm1',
              parentId: 'p1',
              description: 'Rent',
              projectedAmount: 1000,
              actualAmount: 900,
              selectable: false,
            },
          ],
        }),
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<MonthlyExpenses />)

    expect(await screen.findByText('Monthly Expenses')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Housing' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
    expect(screen.getByText('Selectable')).toBeInTheDocument()

    expect(screen.getAllByText('Projected: 1000')).toHaveLength(2)
    expect(screen.getAllByText('Actual: 900')).toHaveLength(2)
    expect(screen.getAllByText('Difference: 100')).toHaveLength(2)
  })

  it('shows empty state when no categories are available', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data: [] }),
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<MonthlyExpenses />)

    expect(await screen.findByText('No categories available.')).toBeInTheDocument()
  })
})
