import { useEffect, useState } from 'react'
import SelectableCheckbox from './MonthlyExpenses/SelectableCheckbox'

export default function DataItem({
  id,
  index = 0,
  description: initialDescription = '',
  projAmount: initialProjAmount = 0,
  actualAmount: initialActualAmount = 0,
  projMinusActual = true,
  isActualDisabled = false,
  showSelectable = false,
  initialSelectable = false,
  toggleSelectableFn = async () => {},
  updateRecordFn = async () => {},
  deleteRecordFn = async () => {},
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [projAmount, setProjectedAmount] = useState(String(initialProjAmount))
  const [actualAmount, setActualAmount] = useState(String(initialActualAmount))

  useEffect(() => {
    setDescription(initialDescription)
    setProjectedAmount(String(initialProjAmount))
    setActualAmount(String(initialActualAmount))
  }, [initialDescription, initialProjAmount, initialActualAmount])

  function toNumber(value) {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }

  async function handleBlur() {
    const trimmedDesc = description.trim()
    const projectedValue = toNumber(projAmount)
    const actualValue = toNumber(actualAmount)

    if (trimmedDesc === '') {
      const deleteRecord = confirm(
        'Empty description will delete this record! Do you want to proceed?',
      )
      if (deleteRecord) {
        try {
          await deleteRecordFn(id)
        } catch (error) {
          console.error('Failed to delete data item record.', error)
          setDescription(initialDescription)
          setProjectedAmount(String(initialProjAmount))
          setActualAmount(String(initialActualAmount))
          alert('Failed to delete. Reverting changes.')
        } finally {
          setIsSubmitting(false)
        }
        return
      }
    }

    const body = {}
    if (trimmedDesc !== initialDescription) body.description = trimmedDesc
    if (projectedValue !== initialProjAmount)
      body.projectedAmount = projectedValue
    if (actualValue !== initialActualAmount) body.actualAmount = actualValue

    if (Object.keys(body).length === 0) return

    setIsSubmitting(true)
    try {
      await updateRecordFn(id, body)
    } catch (error) {
      console.error('Failed to update data item record.', error)
      setDescription(initialDescription)
      setProjectedAmount(String(initialProjAmount))
      setActualAmount(String(initialActualAmount))
      alert('Failed to update. Reverting changes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur()
    else if (e.key === 'Escape') {
      setDescription(initialDescription)
      setProjectedAmount(String(initialProjAmount))
      setActualAmount(String(initialActualAmount))
    }
  }

  const diffValue = projMinusActual
    ? toNumber(projAmount) - toNumber(actualAmount)
    : toNumber(actualAmount) - toNumber(projAmount)

  const gridCols = showSelectable
    ? 'grid-cols-[3rem_1fr_8rem_8rem_8rem_7rem]'
    : 'grid-cols-[3rem_1fr_8rem_8rem_8rem]'

  const inputBase =
    'w-full rounded border border-slate-700/50 bg-transparent px-2 py-1 text-sm'

  return (
    <div
      className={[
        'min-w-[720px]',
        'grid',
        gridCols,
        'gap-2',
        'px-2 py-2',
        'border border-slate-700/50 rounded',
      ].join(' ')}
    >
      <div className='flex items-center justify-start text-sm'>{index + 1}</div>

      <div className='relative'>
        <label className='sr-only' htmlFor={`description-${id}`}>
          Description
        </label>
        <input
          type='text'
          name={`description-${id}`}
          id={`description-${id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputBase}
        />
        {isSubmitting && description !== initialDescription && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200' />
          </div>
        )}
      </div>

      <div className='relative'>
        <label className='sr-only' htmlFor={`projectedAmount-${id}`}>
          Projected Amount
        </label>
        <input
          type='number'
          name={`projectedAmount-${id}`}
          id={`projectedAmount-${id}`}
          value={projAmount}
          onChange={(e) => setProjectedAmount(e.target.value)}
          disabled={isSubmitting}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={[inputBase, 'text-right'].join(' ')}
        />
        {isSubmitting && projAmount != initialProjAmount && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200' />
          </div>
        )}
      </div>

      <div className='relative'>
        <label className='sr-only' htmlFor={`actualAmount-${id}`}>
          Actual Amount
        </label>
        <input
          type='number'
          name={`actualAmount-${id}`}
          id={`actualAmount-${id}`}
          value={actualAmount}
          onChange={(e) => setActualAmount(e.target.value)}
          disabled={isSubmitting || isActualDisabled}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={[inputBase, 'text-right'].join(' ')}
        />
        {isSubmitting && actualAmount != initialActualAmount && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200' />
          </div>
        )}
      </div>

      <div>
        <label className='sr-only' htmlFor={`difference-${id}`}>
          Difference
        </label>
        <input
          type='number'
          name={`difference-${id}`}
          id={`difference-${id}`}
          value={diffValue}
          disabled
          className={[inputBase, 'text-right opacity-80'].join(' ')}
        />
      </div>

      {showSelectable && (
        <div className='flex items-center justify-center'>
          <SelectableCheckbox
            id={id}
            initialSelectable={initialSelectable}
            toggleSelectableFn={toggleSelectableFn}
          />
        </div>
      )}
    </div>
  )
}
