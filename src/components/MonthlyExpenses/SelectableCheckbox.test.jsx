import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SelectableCheckbox from './SelectableCheckbox'

describe('SelectableCheckbox', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn())
    vi.stubGlobal('alert', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls toggleSelectableFn when confirmed', async () => {
    const toggleSelectableFn = vi.fn().mockResolvedValue()
    vi.mocked(confirm).mockReturnValue(true)

    render(
      <SelectableCheckbox
        id='c1'
        initialSelectable={false}
        toggleSelectableFn={toggleSelectableFn}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: /selectable/i }))

    await waitFor(() =>
      expect(toggleSelectableFn).toHaveBeenCalledWith('c1', { selectable: true }),
    )
  })

  it('does not toggle when confirmation is declined', () => {
    const toggleSelectableFn = vi.fn().mockResolvedValue()
    vi.mocked(confirm).mockReturnValue(false)

    render(
      <SelectableCheckbox
        id='c2'
        initialSelectable={false}
        toggleSelectableFn={toggleSelectableFn}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: /selectable/i }))

    expect(toggleSelectableFn).not.toHaveBeenCalled()
    expect(screen.getByRole('checkbox', { name: /selectable/i })).not.toBeChecked()
  })

  it('reverts selection on failure', async () => {
    const toggleSelectableFn = vi.fn().mockRejectedValue(new Error('fail'))
    vi.mocked(confirm).mockReturnValue(true)

    render(
      <SelectableCheckbox
        id='c3'
        initialSelectable={true}
        toggleSelectableFn={toggleSelectableFn}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: /selectable/i }))

    await waitFor(() => expect(alert).toHaveBeenCalled())
    expect(screen.getByRole('checkbox', { name: /selectable/i })).toBeChecked()
  })
})
