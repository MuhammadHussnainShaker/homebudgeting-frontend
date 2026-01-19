import { useEffect, useState } from 'react'
import DataHeader from './DataHeader'
import DataItem from './DataItem'
import CreateDataItem from './CreateDataItem'

export default function Incomes() {
  const [incomes, setIncomes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const response = await fetch(
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
        throw new Error(data.message || 'Creating income failed')
      }

      setIncomes((prev) => [data.data, ...prev])
    } catch (error) {
      console.error('Following error occured while creating income', error)
      setError(error?.message)
      throw error
    } finally {
      setIsLoading(false)
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
        throw new Error(data.message || 'Fetching incomes failed')
      }

      setIncomes((prev) =>
        prev.some((income) => income._id === data.data._id)
          ? prev.map((income) =>
              income._id === data.data._id ? data.data : income,
            )
          : [data.data, ...prev],
      )
    } catch (error) {
      console.error('Following error occured while fetching incomes', error)
      setError(error?.message)
      throw error
    } finally {
      // setIsLoading(false)
    }
  }

  // TODO: deleteIncome

  if (isLoading) {
    return <h1>Loading...</h1>
  }
  return (
    <>
      <section>
        <h2>Incomes Component</h2>
        {error && <p>{error}</p>}
        <DataHeader sectionName={'Income'} />
        {incomes.length > 0 &&
          incomes.map((income) => (
            <DataItem
              id={income._id}
              key={income._id}
              description={income.description}
              projectedAmount={income.projectedAmount}
              actualAmount={income.actualAmount}
              updateIncome={updateIncome}
            />
          ))}
        <CreateDataItem createIncome={createIncome} />
      </section>
    </>
  )
}
