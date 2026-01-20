import { useEffect, useState } from "react"

export default function ExpenseItem({
  id,
  index = 0,
  description: initialDescription = '',
  amount: initialAmount = 0,
  updateRecordFn,
  deleteRecordFn,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [amount, setAmount] = useState(String(initialAmount))

  useEffect(() => {
    setDescription(initialDescription)
    setAmount(String(initialAmount))
  }, [initialDescription, initialAmount])

  // Convert string to number
  function toNumber(value) {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }

  async function handleBlur() {
    const trimmedDesc = description.trim()
    const amountInNum = toNumber(amount)

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
          setAmount(String(initialAmount))
          alert('Failed to delete. Reverting changes.')
        } finally {
          setIsSubmitting(false)
        }
        return
      }
    }

    const body = {}
    if (trimmedDesc !== initialDescription) body.description = trimmedDesc
    if (amountInNum !== initialAmount) body.amount = amountInNum

    // Return if body object is empty, nothing to update
    if (Object.keys(body).length == 0) return

    // Try to update record
    setIsSubmitting(true)
    try {
      await updateRecordFn(id, body)
    } catch (error) {
      setDescription(initialDescription)
      setAmount(String(initialAmount))
      alert('Failed to update. Reverting changes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur()
    else if (e.key === 'Escape') {
      setDescription(initialDescription)
      setAmount(String(initialAmount))
    }
  }

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

        <div className='sm:col-span-2'>
          <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            Amount
          </label>
          <div className='relative flex items-center'>
            <input
              type='number'
              name={`amount-${id}`}
              id={`amount-${id}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputBase}
              disabled={isSubmitting}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            {isSubmitting && amount != initialAmount && (
              <div className='absolute right-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
              </div>
            )}
          </div>
        </div>

        <div className='categoryContainer'>
          <select name='category' id='category'>
            <option value=''>--Please choose an option--</option>
            <option value='health'>Health Expenses</option>
            <option value='home'>Home Expenses</option>
            <option value='travel'>Travel Expenses</option>
            <option value='food'>Food & Dining</option>
          </select>
        </div>
      </div>
    </div>
  )
}
