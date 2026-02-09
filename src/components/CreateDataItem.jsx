import { useState } from 'react'

export default function CreateDataItem({ createRecordFn, parentId = '' }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState('')

  async function handleBlur() {
    const trimmedDesc = description.trim()
    const body = {}
    if (trimmedDesc !== '') body.description = trimmedDesc
    if (Object.keys(body).length === 0) return

    setIsSubmitting(true)
    body.month = new Date().toISOString()
    if (parentId) body.parentId = parentId
    try {
      await createRecordFn(body)
      setDescription('')
    } catch (error) {
      console.error('Failed to create record.', error)
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
    'w-full rounded border border-slate-700/50 bg-transparent px-2 py-1 text-sm'

  return (
    <div
      className={[
        'min-w-[720px]',
        'grid grid-cols-[3rem_1fr_8rem_8rem_8rem]',
        'gap-2',
        'px-2 py-2',
        'border border-dashed border-slate-700/50 rounded',
      ].join(' ')}
    >
      <div className='flex items-center justify-start font-medium'>+</div>

      <div className='relative'>
        <label className='sr-only' htmlFor='createDescription'>
          New item description
        </label>
        <input
          type='text'
          name='createDescription'
          id='createDescription'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputBase}
          placeholder='New item...'
        />
        {isSubmitting && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200' />
          </div>
        )}
      </div>

      <div>
        <input type='number' disabled className={[inputBase, 'text-right opacity-60'].join(' ')} />
      </div>
      <div>
        <input type='number' disabled className={[inputBase, 'text-right opacity-60'].join(' ')} />
      </div>
      <div>
        <input type='number' disabled className={[inputBase, 'text-right opacity-60'].join(' ')} />
      </div>
    </div>
  )
}
