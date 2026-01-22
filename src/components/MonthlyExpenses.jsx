import React, { useEffect, useMemo, useState } from 'react'
import { CreateDataItem, DataHeader, DataItem } from './index'

export default function MonthlyExpenses() {
  const [parentCategories, setParentCategories] = useState([])
  const [monthlyCatExpenses, setMonthlyCatExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const month = '2026-01-01T00:00:00.000Z'

  // Totals per parent category + grand total (derived state; no setState to avoid re-render loops)
  const totals = useMemo(() => {
    const byParent = Object.create(null)
    const grand = { projTotal: 0, actTotal: 0, difference: 0 }

    for (const exp of monthlyCatExpenses) {
      const parentKey = String(exp.parentId ?? '')

      if (!byParent[parentKey]) {
        byParent[parentKey] = { projTotal: 0, actTotal: 0, difference: 0 }
      }

      const proj = Number(exp.projectedAmount) || 0
      const act = Number(exp.actualAmount) || 0

      byParent[parentKey].projTotal += proj
      byParent[parentKey].actTotal += act

      grand.projTotal += proj
      grand.actTotal += act
    }

    // difference for expenses: projected - actual
    for (const key of Object.keys(byParent)) {
      byParent[key].difference = byParent[key].projTotal - byParent[key].actTotal
    }
    grand.difference = grand.projTotal - grand.actTotal

    return { byParent, grand }
  }, [monthlyCatExpenses])

  useEffect(() => {
    async function fetchParentCategories() {
      try {
        const response = await fetch(
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

    async function fetchMonthlyCategoricalExpenses() {
      try {
        const response = await fetch(
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
      const response = await fetch('/api/v1/monthly-categorical-expenses/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
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
        prev.filter((expense) => expense._id !== id),
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

      {parentCategories.length === 0 && <p>No categories available.</p>}

      {parentCategories.length > 0 &&
        parentCategories.map((parentCategory) => {
          const relevantExpenses = monthlyCatExpenses.filter(
            (expense) => String(expense.parentId) === String(parentCategory._id),
          )

          const parentTotals =
            totals.byParent[String(parentCategory._id)] ?? {
              projTotal: 0,
              actTotal: 0,
              difference: 0,
            }

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

              {/* Per-parent totals */}
              <div className='mt-2 text-sm text-gray-700'>
                <div className='flex flex-wrap gap-x-6 gap-y-1'>
                  <span className='font-medium'>Total</span>
                  <span>Projected: {parentTotals.projTotal}</span>
                  <span>Actual: {parentTotals.actTotal}</span>
                  <span>Difference: {parentTotals.difference}</span>
                </div>
              </div>
            </React.Fragment>
          )
        })}

      {/* Grand total across all parent categories */}
      {parentCategories.length > 0 && (
        <div className='mt-6 border-t pt-3 text-sm text-gray-800'>
          <div className='flex flex-wrap gap-x-6 gap-y-1'>
            <span className='font-semibold'>Grand Total</span>
            <span>Projected: {totals.grand.projTotal}</span>
            <span>Actual: {totals.grand.actTotal}</span>
            <span>Difference: {totals.grand.difference}</span>
          </div>
        </div>
      )}
    </section>
  )
}