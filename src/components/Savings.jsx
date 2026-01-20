import { useEffect, useState } from 'react'
import { DataHeader, DataItem, CreateDataItem } from './index'

export default function Savings() {
  const [savings, setSavings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
        console.error('Following error occured while deleting saving record:', error)
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
      </section>
    </>
  )
}
