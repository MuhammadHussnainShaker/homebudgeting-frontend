import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CreateDataItem from '@/components/data-items/CreateDataItem'

describe('CreateDataItem', () => {
  beforeEach(() => {
    vi.stubGlobal('alert', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates a record on blur and clears the input', async () => {
    const createRecordFn = vi.fn().mockResolvedValue()
    render(<CreateDataItem createRecordFn={createRecordFn} parentId='p1' />)

    fireEvent.change(screen.getByLabelText(/new item description/i), {
      target: { value: 'Internet' },
    })
    fireEvent.blur(screen.getByLabelText(/new item description/i))

    await waitFor(() =>
      expect(createRecordFn).toHaveBeenCalledWith({
        description: 'Internet',
        month: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        parentId: 'p1',
      }),
    )
    expect(screen.getByLabelText(/new item description/i)).toHaveValue('')
  })

  it('alerts on create error and preserves text', async () => {
    const createRecordFn = vi.fn().mockRejectedValue(new Error('fail'))
    render(<CreateDataItem createRecordFn={createRecordFn} />)

    fireEvent.change(screen.getByLabelText(/new item description/i), {
      target: { value: 'Groceries' },
    })
    fireEvent.blur(screen.getByLabelText(/new item description/i))

    await waitFor(() => expect(alert).toHaveBeenCalled())
    expect(screen.getByLabelText(/new item description/i)).toHaveValue('Groceries')
  })
})
