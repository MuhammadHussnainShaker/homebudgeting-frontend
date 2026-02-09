import { useEffect, useState } from 'react'
import { CreateDataItem, DataHeader, DataItem } from './index'
import ErrorMessage from './ErrorMessage'
import { DEFAULT_MONTH } from '../constants/dates'
import { apiFetch } from '../utils/apiFetch'
import { calculateParentTotals } from '../utils/calculations'
import {
  addItemToList,
  removeItemFromList,
  updateItemInList,
} from '../utils/listStateUpdaters'

export default function MonthlyExpenses() {
  const [parentCategories, setParentCategories] = useState([])
  const [monthlyCatExpenses, setMonthlyCatExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const totals = calculateParentTotals(monthlyCatExpenses)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [parentData, expenseData] = await Promise.all([
          apiFetch(`/api/v1/parent-categories/${DEFAULT_MONTH}`, {
            method: 'GET',
          }),
          apiFetch(`/api/v1/monthly-categorical-expenses/${DEFAULT_MONTH}`, {
            method: 'GET',
          }),
        ])

        setParentCategories(parentData.data)
        setMonthlyCatExpenses(expenseData.data)
      } catch (error) {
        console.error('Error occurred while fetching monthly expense data', error)
        setError(error?.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  async function createMonthlyCategoricalExpenses(body) {
    try {
      const data = await apiFetch('/api/v1/monthly-categorical-expenses/', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setMonthlyCatExpenses((prev) => addItemToList(prev, data.data))
    } catch (error) {
      console.error(
        'Error occurred while creating monthly-categorical-expense record',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function updateMonthlyCategoricalExpense(id, body) {
    try {
      const data = await apiFetch(`/api/v1/monthly-categorical-expenses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      setMonthlyCatExpenses((prev) => updateItemInList(prev, data.data))
    } catch (error) {
      console.error(
        'Error occurred while updating monthly-categorical-expense record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function toggleSelectableFn(id, body) {
    try {
      const data = await apiFetch(
        `/api/v1/monthly-categorical-expenses/${id}/toggle-selectable/${DEFAULT_MONTH}`,
        {
          method: 'PATCH',
          body: JSON.stringify(body),
        },
      )

      setMonthlyCatExpenses((prev) => updateItemInList(prev, data.data.record))
    } catch (error) {
      console.error(
        'Error occurred while toggling monthly-categorical-expense record selectable:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function deleteMonthlyCategoricalExpense(id) {
    try {
      await apiFetch(`/api/v1/monthly-categorical-expenses/${id}`, {
        method: 'DELETE',
      })
      setMonthlyCatExpenses((prev) => removeItemFromList(prev, id))
    } catch (error) {
      console.error(
        'Error occurred while deleting monthly-categorical-expenses record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium'>Monthly Expenses</h2>
      </div>

      <ErrorMessage message={error} />
      {parentCategories.length === 0 && <p>No categories available.</p>}

      {parentCategories.length > 0 &&
        parentCategories.map((parentCategory) => {
          const relevantExpenses = monthlyCatExpenses.filter(
            (expense) => String(expense.parentId) === String(parentCategory._id),
          )

          const parentTotals = totals.byParent[String(parentCategory._id)] ?? {
            projectedTotal: 0,
            actualTotal: 0,
            difference: 0,
          }

          return (
            <div key={parentCategory._id} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium'>{parentCategory.description}</h3>
              </div>

              <div className='space-y-2 overflow-x-auto'>
                <DataHeader sectionName={parentCategory.description} showSelectable={true} />

                {relevantExpenses.length === 0 && (
                  <p className='text-sm opacity-80'>No expenses recorded for this category.</p>
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
              </div>

              <div className='overflow-x-auto'>
                <div className='min-w-[720px] grid grid-cols-4 gap-2 px-2 py-2 border border-slate-700/50 rounded'>
                  <div className='font-medium'>Total</div>
                  <div className='text-right'>
                    Projected: {parentTotals.projectedTotal}
                  </div>
                  <div className='text-right'>Actual: {parentTotals.actualTotal}</div>
                  <div className='text-right'>Difference: {parentTotals.difference}</div>
                </div>
              </div>
            </div>
          )
        })}

      {parentCategories.length > 0 && (
        <div className='overflow-x-auto'>
          <div className='min-w-[720px] grid grid-cols-4 gap-2 px-2 py-2 border border-slate-700/50 rounded'>
            <div className='font-medium'>Grand Total</div>
            <div className='text-right'>Projected: {totals.grand.projectedTotal}</div>
            <div className='text-right'>Actual: {totals.grand.actualTotal}</div>
            <div className='text-right'>Difference: {totals.grand.difference}</div>
          </div>
        </div>
      )}
    </section>
  )
}
