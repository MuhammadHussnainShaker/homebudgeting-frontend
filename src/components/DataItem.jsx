import { useEffect, useState } from 'react'

export default function DataItem({
  id,
  index = 0,
  description: initialDescription = '',
  projAmount: initialProjAmount = 0,
  actualAmount: initialActualAmount = 0,
  projMinusActual = true,
  updateRecordFn,
  deleteRecordFn,
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
    if (e.key === 'Enter') {
      e.target.blur()
    } else if (e.key === 'Escape') {
      setDescription(initialDescription)
      setProjectedAmount(String(initialProjAmount))
      setActualAmount(String(initialActualAmount))
    }
  }

  // TODO: handle TAB press
  // TODO: handle focus on newly created record's description

  return (
    <>
      <div className='flex justify-between'>
        <div>{index + 1}</div>
        <div className='relative flex items-center'>
          <input
            type='text'
            name='description'
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='border-1'
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
        <div className='relative flex items-center'>
          <input
            type='number'
            name='projectedAmount'
            id='projectedAmount'
            value={projAmount}
            onChange={(e) => setProjectedAmount(e.target.value)}
            className='border-1'
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
        <div className='relative flex items-center'>
          <input
            type='number'
            name='actualAmount'
            id='actualAmount'
            value={actualAmount}
            onChange={(e) => setActualAmount(e.target.value)}
            className='border-1'
            disabled={isSubmitting}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          {isSubmitting && actualAmount != initialActualAmount && (
            <div className='absolute right-2'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
            </div>
          )}
        </div>
        <div>
          <input
            type='number'
            name='difference'
            id='difference'
            value={
              projMinusActual
                ? toNumber(projAmount) - toNumber(actualAmount)
                : toNumber(actualAmount) - toNumber(projAmount)
                // TODO: Show + sign with positive difference
            }
            className='border-1'
            disabled
          />
        </div>
      </div>
    </>
  )
}
