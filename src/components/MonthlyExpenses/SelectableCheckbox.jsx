import { useEffect, useState } from 'react'

export default function SelectableCheckbox({
  id,
  initialSelectable = false,
  toggleSelectableFn = async () => {},
}) {
  const [selectable, setSelectable] = useState(initialSelectable)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => setSelectable(initialSelectable), [initialSelectable])

  const onChange = async (e) => {
    const newVal = e.target.checked
    setSelectable(newVal)
    setIsSubmitting(true)
    try {
      await toggleSelectableFn(id, { selectable: newVal })
    } catch {
      setSelectable((prev) => !prev)
      alert('Failed to update. Reverting changes.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      <label className='sm:hidden mb-1 block text-xs text-gray-500'>
        Selectable
      </label>
      <input
        type='checkbox'
        name={`selectable-${id}`}
        id={`selectable-${id}`}
        checked={selectable}
        onChange={onChange}
        disabled={isSubmitting}
      />
    </>
  )
}
