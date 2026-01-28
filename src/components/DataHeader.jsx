export default function DataHeader({
  sectionName = 'Section',
  className = '',
  showSelectable = false,
}) {
  const gridCols = showSelectable
    ? 'grid-cols-[3rem_1fr_8rem_8rem_8rem_7rem]'
    : 'grid-cols-[3rem_1fr_8rem_8rem_8rem]'

  return (
    <div
      className={[
        'min-w-[720px]',
        'grid',
        gridCols,
        'gap-2',
        'px-2 py-2',
        'text-sm font-medium',
        'border border-slate-700/50 rounded',
        className,
      ].join(' ')}
    >
      <div>#</div>
      <div className='truncate'>{sectionName}</div>
      <div className='text-right'>Projected</div>
      <div className='text-right'>Actual</div>
      <div className='text-right'>Difference</div>
      {showSelectable && <div className='text-center'>Selectable</div>}
    </div>
  )
}
