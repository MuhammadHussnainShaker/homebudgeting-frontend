export default function DataHeader({
  sectionName = 'Section',
  className = '',
  showSelectable = false,
}) {
  return (
    <div
      className={[
        'hidden sm:grid sm:grid-cols-12 sm:gap-2',
        'text-xs font-semibold text-gray-700 dark:text-gray-200',
        'pb-2 border-b border-gray-200/60 dark:border-gray-700/60',
        className,
      ].join(' ')}
    >
      <div className='sm:col-span-1'>#</div>
      <div className='sm:col-span-2'>{sectionName}</div>
      <div className='sm:col-span-2'>Projected</div>
      <div className='sm:col-span-2'>Actual</div>
      <div className='sm:col-span-2'>Difference</div>
      {showSelectable && (
        <div className='sm:col-span-2'>Selectable</div>
      )}
    </div>
  )
}
