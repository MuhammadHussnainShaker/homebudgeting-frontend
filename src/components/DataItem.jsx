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

  // KEEP LOCAL STATE IN SYNC WITH PARENT/PROPS TODO: UNDERSTAND IT
  useEffect(() => {
    setDescription(initialDescription)
    setProjectedAmount(String(initialProjAmount))
    setActualAmount(String(initialActualAmount))
  }, [initialDescription, initialProjAmount, initialActualAmount])

  // Convert string to number
  function toNumber(value) {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }

  async function handleBlur() {
    const trimmedDesc = description.trim()
    const projectedValue = toNumber(projAmount)
    const actualValue = toNumber(actualAmount)

    // Delete record if description is empty
    if (trimmedDesc === '') {
      const deleteRecord = confirm(
        'Empty description will delete this record! Do you want to proceed?',
      )
      if (deleteRecord) {
        try {
          await deleteRecordFn(id)
        } catch (error) {
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

    // Return if body object is empty, nothing to update
    if (Object.keys(body).length == 0) return

    // Try to update record
    setIsSubmitting(true)
    try {
      await updateRecordFn(id, body)
    } catch (error) {
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

  const inputBase =
    'w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-70'

  return (
    <div className='rounded-lg border border-gray-200/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/40 p-3 sm:p-0 sm:border-0 sm:bg-transparent'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center sm:gap-2'>
        <div className='flex items-center justify-between sm:block sm:col-span-1'>
          <div className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
            {index + 1}
          </div>
          <div className='sm:hidden text-xs text-gray-500'>Item</div>
        </div>

        <div className='sm:col-span-5'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            Description
          </label>
          <div className='relative flex items-center'>
            <input
              type='text'
              name={`description-${id}`}
              id={`description-${id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputBase}
              disabled={isSubmitting}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            {isSubmitting && description !== initialDescription && (
              <div className='absolute right-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
              </div>
            )}
          </div>
        </div>

        <div className='sm:col-span-1'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            Projected Amount
          </label>
          <div className='relative flex items-center'>
            <input
              type='number'
              name={`projectedAmount-${id}`}
              id={`projectedAmount-${id}`}
              value={projAmount}
              onChange={(e) => setProjectedAmount(e.target.value)}
              className={inputBase}
              disabled={isSubmitting}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            {isSubmitting && projAmount != initialProjAmount && (
              <div className='absolute right-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
              </div>
            )}
          </div>
        </div>

        <div className='sm:col-span-1'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            Actual Amount
          </label>
          <div className='relative flex items-center'>
            <input
              type='number'
              name={`actualAmount-${id}`}
              id={`actualAmount-${id}`}
              value={actualAmount}
              onChange={(e) => setActualAmount(e.target.value)}
              className={inputBase}
              disabled={isSubmitting || isActualDisabled}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            {isSubmitting && actualAmount != initialActualAmount && (
              <div className='absolute right-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
              </div>
            )}
          </div>
        </div>

        <div className='sm:col-span-1'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            Difference
          </label>
          <input
            type='number'
            name={`difference-${id}`}
            id={`difference-${id}`}
            value={diffValue}
            className={inputBase}
            disabled
          />
        </div>
        {showSelectable && (
          <div className='sm:col-span-1'>
            <SelectableCheckbox id={id} initialSelectable={initialSelectable} toggleSelectableFn={toggleSelectableFn} />
          </div>
        )}
      </div>
    </div>
  )
}
