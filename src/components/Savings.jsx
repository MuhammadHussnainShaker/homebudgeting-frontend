import { useEffect, useState } from 'react'
import { DataHeader, DataItem, CreateDataItem } from './index'

export default function Savings() {
  const [savings, setSavings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalProjAmount, setTotalProjAmount] = useState(0)
  const [totalActAmount, setTotalActAmount] = useState(0)
  const [totalDifference, setTotalDifference] = useState(0)

  useEffect(() => {
    async function fetchSavings() {
      try {
        const response = await fetch(
          // TODO: create global month variable and fetch data from there and replace here
          '/api/v1/savings/2026-01-01T00:00:00.000Z',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        const data = await response.json()

        if (!response.ok || data.success === false) {
          throw new Error(data.message || 'Fetching savings failed')
        }

        setSavings(data.data)
      } catch (error) {
        console.error('Following error occured while fetching savings', error)
        setError(error?.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavings()
  }, [])

  useEffect(() => {
      const { projTotal, actTotal } = savings.reduce(
        (acc, inc) => {
          acc.projTotal += Number(inc.projectedAmount) || 0
          acc.actTotal += Number(inc.actualAmount) || 0
          return acc
        },
        { projTotal: 0, actTotal: 0 },
      )
      setTotalProjAmount(projTotal)
      setTotalActAmount(actTotal)
      setTotalDifference(actTotal - projTotal)
    }, [savings])

  async function createSaving(body) {
    try {
      const response = await fetch('/api/v1/savings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Creating saving record failed')
      }

      setSavings((prev) => [...prev, data.data])
    } catch (error) {
      console.error(
        'Following error occured while creating saving record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function updateSaving(id, body) {
    try {
      const response = await fetch(`/api/v1/savings/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Updating saving record failed')
      }

      setSavings((prev) =>
        prev.some((saving) => saving._id === data.data._id)
          ? prev.map((saving) =>
              saving._id === data.data._id ? data.data : saving,
            )
          : [data.data, ...prev],
      )
    } catch (error) {
      console.error(
        'Following error occured while updaing saving record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function deleteSaving(id) {
    try {
      const response = await fetch(`/api/v1/savings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Deleting saving record failed')
      }

      setSavings((prev) => prev.filter((saving) => saving._id != id))
    } catch (error) {
      console.error(
        'Following error occured while deleting saving record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <section>
        <h2>Savings</h2>
        {error && <p>{error}</p>}
        <DataHeader sectionName={'Savings'} />
        {savings.length > 0 &&
          savings.map((saving, index) => (
            <DataItem
              id={saving._id}
              key={saving._id}
              index={index}
              description={saving.description}
              projAmount={saving.projectedAmount}
              actualAmount={saving.actualAmount}
              projMinusActual={false}
              updateRecordFn={updateSaving}
              deleteRecordFn={deleteSaving}
            />
          ))}
        <CreateDataItem createRecordFn={createSaving} />
        <div className=''>
          <div className=''>-</div>

          <div className=''>
            <label className='sm:hidden mb-1 block text-xs text-gray-500'></label>
            <div className='relative flex items-center'>
              <input
                type='text'
                name='createDescription'
                id='createDescription'
                value={'Total'}
                onChange={(e) => {}}
                className={''}
                disabled={true}
              />
            </div>
          </div>

          <div className='sm:col-span-2'>
            <label className='sm:hidden mb-1 block text-xs text-gray-500'>
              Projected Amount
            </label>
            <input value={totalProjAmount} disabled />
          </div>

          <div className='sm:col-span-2'>
            <label className='sm:hidden mb-1 block text-xs text-gray-500'>
              Actual Amount
            </label>
            <input value={totalActAmount} disabled />
          </div>

          <div className='sm:col-span-2'>
            <label className='sm:hidden mb-1 block text-xs text-gray-500'>
              Difference
            </label>
            <input value={totalDifference} disabled />
          </div>
        </div>
      </section>
    </>
  )
}
