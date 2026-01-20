export default function DataHeader({sectionName='Section'}) {
  return (
    <>
      <div className='flex justify-between'>
        <div>#</div>
        <div>{sectionName}</div>
        <div>Projected Amount</div>
        <div>Actual Amount</div>
        <div>Difference</div>
      </div>
    </>
  )
}
