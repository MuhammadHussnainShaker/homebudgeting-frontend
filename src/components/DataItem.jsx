import { useEffect, useState } from 'react'

export default function DataItem({
  id,
  description: initialDescription = '',
  projectedAmount: initialProjectedAmount = 0,
  actualAmount: initialActualAmount = 0,
  updateIncome,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [projectedAmount, setProjectedAmount] = useState(
    String(initialProjectedAmount),
  )
  const [actualAmount, setActualAmount] = useState(String(initialActualAmount))

  // KEEP LOCAL STATE IN SYNC WITH PARENT/PROPS TODO: UNDERSTAND IT
  useEffect(() => {
    setDescription(initialDescription)
    setProjectedAmount(String(initialProjectedAmount))
    setActualAmount(String(initialActualAmount))
  }, [initialDescription, initialProjectedAmount, initialActualAmount])

  function toNumber(value) {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }

  async function handleBlur() {
    const trimmedDesc = description.trim()
    const projectedValue = toNumber(projectedAmount)
    const actualValue = toNumber(actualAmount)

    const body = {}

    if (trimmedDesc !== initialDescription) body.description = trimmedDesc
    if (projectedValue !== initialProjectedAmount)
      body.projectedAmount = projectedValue
    if (actualValue !== initialActualAmount) body.actualAmount = actualValue

    if (Object.keys(body).length == 0) return

    setIsSubmitting(true)
    try {
      await updateIncome(id, body)
    } catch (error) {
      setDescription(initialDescription)
      setProjectedAmount(String(initialProjectedAmount))
      setActualAmount(String(initialActualAmount))
      alert('Failed to save. Reverting changes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur()
    } else if (e.key === 'Escape') {
      setDescription(initialDescription)
      setProjectedAmount(String(initialProjectedAmount))
      setActualAmount(String(initialActualAmount))
    }
  }

  return (
    <>
      <div className='flex justify-between'>
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
            value={projectedAmount}
            onChange={(e) => setProjectedAmount(e.target.value)}
            className='border-1'
            disabled={isSubmitting}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          {isSubmitting && projectedAmount != initialProjectedAmount && (
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
            value={toNumber(projectedAmount) - toNumber(actualAmount)}
            className='border-1'
            disabled
          />
        </div>
      </div>
    </>
  )
}
