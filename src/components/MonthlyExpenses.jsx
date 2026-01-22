import React, { useEffect, useState } from 'react'
import { CreateDataItem, DataHeader, DataItem } from './index'

export default function MonthlyExpenses() {
  const [parentCategories, setParentCategories] = useState([])
  const [monthlyCatExpenses, setMonthlyCatExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const month = '2026-01-01T00:00:00.000Z'

  useEffect(() => {
    async function fetchParentCategories() {
      try {
        const response = await fetch(
          // TODO: create global month variable and fetch data from there and replace here
          '/api/v1/parent-categories/2026-01-01T00:00:00.000Z',
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
          throw new Error(data.message || 'Fetching parent-categories failed')
        }

        setParentCategories(data.data)
      } catch (error) {
        console.error(
          'Following error occured while fetching parent-categories',
          error,
        )
        setError(error?.message)
      } finally {
        setIsLoading(false)
      }
    }

    // calculate totals for categories where selectable is true
    async function fetchMonthlyCategoricalExpenses() {
      try {
        const response = await fetch(
          // TODO: create global month variable and fetch data from there and replace here
          '/api/v1/monthly-categorical-expenses/2026-01-01T00:00:00.000Z',
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
          throw new Error(
            data.message || 'Fetching monthly-categorical-expenses failed',
          )
        }

        setMonthlyCatExpenses(data.data)
      } catch (error) {
        console.error(
          'Following error occured while fetching monthly-categorical-expenses',
          error,
        )
        setError(error?.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchParentCategories()
    fetchMonthlyCategoricalExpenses()
  }, [])

  async function createMonthlyCategoricalExpenses(body) {
    try {
      const response = await fetch(
        // TODO: create global month variable and fetch data from there and replace here
        '/api/v1/monthly-categorical-expenses/',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      )
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || 'Creating monthly-categorical-expense record failed',
        )
      }

      setMonthlyCatExpenses((prev) => [...prev, data.data])
    } catch (error) {
      console.error(
        'Following error occured while creating monthly-categorical-expense record',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function updateMonthlyCategoricalExpense(id, body) {
    try {
      const response = await fetch(
        `/api/v1/monthly-categorical-expenses/${id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      )
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || 'Updating monthly-categorical-expense record failed',
        )
      }

      setMonthlyCatExpenses((prev) =>
        prev.some((expense) => expense._id === data.data._id)
          ? prev.map((expense) =>
              expense._id === data.data._id ? data.data : expense,
            )
          : [data.data, ...prev],
      )
    } catch (error) {
      console.error(
        'Following error occured while updating monthly-categorical-expense record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function toggleSelectableFn(id, body) {
    try {
      const response = await fetch(
        `/api/v1/monthly-categorical-expenses/${id}/toggle-selectable/${month}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      )

      // TODO: fix error failed to execute .json
      // if (!response.ok) {
      //   throw new Error(
      //     'Toggling monthly-categorical-expense record selectable failed',
      //   )
      // }

      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            'Toggling monthly-categorical-expense record selectable failed',
        )
      }

      setMonthlyCatExpenses((prev) =>
        prev.some((expense) => expense._id === data.data.record._id)
          ? prev.map((expense) =>
              expense._id === data.data.record._id ? data.data.record : expense,
            )
          : [data.data.record, ...prev],
      )
    } catch (error) {
      console.error(
        'Following error occured while toggling monthly-categorical-expense record selectable:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function deleteMonthlyCategoricalExpense(id) {
    try {
      const response = await fetch(
        `/api/v1/monthly-categorical-expenses/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || 'Deleting monthly-categorical-expense record failed',
        )
      }

      setMonthlyCatExpenses((prev) =>
        prev.filter((expense) => expense._id != id),
      )
    } catch (error) {
      console.error(
        'Following error occured while deleting monthly-categorical-expenses record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section>
      <div className='text-center'>MonthlyExpenses</div>
      {error && <p className='text-sm text-red-600'>{error}</p>}
      {parentCategories.length > 0 &&
        monthlyCatExpenses.length > 0 &&
        parentCategories.map((parentCategory) => {
          const relevantExpenses = monthlyCatExpenses.filter(
            (expense) => expense.parentId == parentCategory._id,
          )
          return (
            <React.Fragment key={parentCategory._id}>
              <DataHeader
                sectionName={parentCategory.description}
                showSelectable={true}
              />
              {relevantExpenses.length === 0 && (
                <p>No expenses recorded for this category.</p>
              )}
              {relevantExpenses.length > 0 &&
                relevantExpenses.map((expense, index) => (
                  <DataItem
                    key={expense._id}
                    id={expense._id}
                    index={index}
                    description={expense.description}
                    projAmount={expense.projectedAmount}
                    actualAmount={expense.actualAmount}
                    projMinusActual={true}
                    isActualDisabled={expense.selectable}
                    showSelectable={true}
                    initialSelectable={expense.selectable}
                    toggleSelectableFn={toggleSelectableFn}
                    deleteRecordFn={deleteMonthlyCategoricalExpense}
                    updateRecordFn={updateMonthlyCategoricalExpense}
                  />
                ))}
              <CreateDataItem
                createRecordFn={createMonthlyCategoricalExpenses}
                parentId={parentCategory._id}
              />
            </React.Fragment>
          )
        })}
    </section>
  )
}
