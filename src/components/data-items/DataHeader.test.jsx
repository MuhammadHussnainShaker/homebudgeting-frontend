import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import DataHeader from '@/components/data-items/DataHeader'

describe('DataHeader', () => {
  it('renders default columns without selectable', () => {
    const { container } = render(<DataHeader />)

    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.queryByText('Selectable')).not.toBeInTheDocument()
    expect(container.firstChild).toHaveClass(
      'grid-cols-[3rem_1fr_8rem_8rem_8rem]',
    )
  })

  it('renders selectable column when enabled', () => {
    const { container } = render(
      <DataHeader sectionName='Housing' showSelectable={true} className='custom' />,
    )

    expect(screen.getByText('Housing')).toBeInTheDocument()
    expect(screen.getByText('Selectable')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass(
      'grid-cols-[3rem_1fr_8rem_8rem_8rem_7rem]',
      'custom',
    )
  })
})
