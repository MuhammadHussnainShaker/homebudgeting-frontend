import { useEffect, useState } from 'react'
import { DataHeader, DataItem, CreateDataItem } from './index'

export default function Incomes() {
  const [incomes, setIncomes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
      </div>
    </section>
  )
}
