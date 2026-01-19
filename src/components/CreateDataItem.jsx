import { useState } from 'react'

export default function CreateDataItem({ createIncome }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState('')

  function toNumber(value) {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }

  async function handleBlur() {
    const trimmedDesc = description.trim()

    const body = {}

    if (trimmedDesc !== '') body.description = trimmedDesc

    if (Object.keys(body).length == 0) return

    body.month = new Date().toISOString()

    setIsSubmitting(true)
    try {
      await createIncome(body)
      setDescription('')
    } catch (error) {
      alert('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur()
    } else if (e.key === 'Escape') {
      setDescription('')
    }
  }

  return (
    <>
      <div className='flex justify-between'>
        <div className='relative flex items-center'>
          <input
            type='text'
            name='createDescription'
            id='createDescription'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='border-1'
            disabled={isSubmitting}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          {isSubmitting && (
            <div className='absolute right-2'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
            </div>
          )}
        </div>
        <div className='relative flex items-center'>
          <input
            type='number'
            name='createProjectedAmount'
            id='createProjectedAmount'
            className='border-1'
            disabled
          />
        </div>
        <div className='relative flex items-center'>
          <input
            type='number'
            name='createActualAmount'
            id='createActualAmount'
            className='border-1'
            disabled
          />
        </div>
        <div>
          <input
            type='number'
            name='difference'
            id='difference'
            className='border-1'
            disabled
          />
        </div>
      </div>
    </>
  )
}
