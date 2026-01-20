import { useState } from 'react'

export default function CreateExpenseItem({ createRecordFn, date = '2026-01-20' }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState('')

  async function handleBlur() {
    const trimmedDesc = description.trim()
    const body = {}
    if (trimmedDesc !== '') body.description = trimmedDesc
    if (Object.keys(body).length == 0) return

    // Try to create record
    setIsSubmitting(true)
    body.date = new Date(date).toISOString()
    try {
      await createRecordFn(body)
      setDescription('')
    } catch (error) {
      alert('Failed to create record. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur()
    else if (e.key === 'Escape') setDescription('')
  }

  const inputBase =
    'w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-70'

  return (
    <div className='rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-900/20 p-3'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center sm:gap-2'>
        <div className='sm:col-span-1 text-sm font-semibold text-gray-700 dark:text-gray-200'>
          +
        </div>

        <div className='sm:col-span-5'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            New item description
          </label>
          <div className='relative flex items-center'>
            <input
              type='text'
              name='createDescription'
              id='createDescription'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputBase}
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
        </div>

        <div className='sm:col-span-2'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            Amount
          </label>
          <input type='number' className={inputBase} disabled />
        </div>
      </div>
    </div>
  )
}
