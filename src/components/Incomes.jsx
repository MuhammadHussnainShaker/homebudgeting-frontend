import { useEffect, useState } from 'react'
import { DataHeader, DataItem, CreateDataItem } from './index'

export default function Incomes() {
  const [incomes, setIncomes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalProjAmount, setTotalProjAmount] = useState(0)
  const [totalActAmount, setTotalActAmount] = useState(0)
  const [totalDifference, setTotalDifference] = useState(0)

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const response = await fetch(
          // TODO: create global month variable and fetch data from there and replace here
          '/api/v1/incomes/2026-01-01T00:00:00.000Z',
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
          throw new Error(data.message || 'Fetching incomes failed')
        }

        setIncomes(data.data)
      } catch (error) {
        console.error('Following error occured while fetching incomes', error)
        setError(error?.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncomes()
  }, [])

  // useEffect to calculate
  // this useEffect to only run when incomes array is changed
  useEffect(() => {
    const { projTotal, actTotal } = incomes.reduce(
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
  }, [incomes])

  async function createIncome(body) {
    try {
      const response = await fetch('/api/v1/incomes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Creating income record failed')
      }

      setIncomes((prev) => [...prev, data.data])
    } catch (error) {
      console.error(
        'Following error occured while creating income record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function updateIncome(id, body) {
    try {
      const response = await fetch(`/api/v1/incomes/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Updating income record failed')
      }

      setIncomes((prev) =>
        prev.some((income) => income._id === data.data._id)
          ? prev.map((income) =>
              income._id === data.data._id ? data.data : income,
            )
          : [data.data, ...prev],
      )
    } catch (error) {
      console.error(
        'Following error occured while updating income record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function deleteIncome(id) {
    try {
      const response = await fetch(`/api/v1/incomes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Deleting income record failed')
      }

      setIncomes((prev) => prev.filter((income) => income._id != id))
    } catch (error) {
      console.error(
        'Following error occured while deleting income record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section className='space-y-3'>
      <div className='flex items-baseline justify-between gap-3'>
        <h2 className='text-lg font-semibold'>Incomes</h2>
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      <div className='space-y-2'>
        <DataHeader sectionName={'Income'} />

        <div className='space-y-2 sm:space-y-1'>
          {incomes.length > 0 &&
            incomes.map((income, index) => (
              <DataItem
                id={income._id}
                key={income._id}
                index={index}
                description={income.description}
                projAmount={income.projectedAmount}
                actualAmount={income.actualAmount}
                projMinusActual={false}
                updateRecordFn={updateIncome}
                deleteRecordFn={deleteIncome}
              />
            ))}
        </div>

        <CreateDataItem createRecordFn={createIncome} />
        <div className=''>
          <div className=''>
            -
          </div>

          <div className=''>
            <label className='sm:hidden mb-1 block text-xs text-gray-500'>
            </label>
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
      </div>
    </section>
  )
}
