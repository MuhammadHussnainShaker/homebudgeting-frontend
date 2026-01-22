import { useEffect, useMemo, useState } from 'react'
import ExpenseItem from './ExpenseItem'
import CreateExpenseItem from './CreateExpenseItem'

export default function DailyExpenses() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyExpenses, setDailyExpenses] = useState([])
  // derived total (no extra state)
  const totals = useMemo(() => {
    const totalAmount = dailyExpenses.reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0,
    )
    return { totalAmount }
  }, [dailyExpenses])
  const [selectableCategories, setSelectableCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchDailyExpenses() {
      setIsLoading(true)
      try {
        const response = await fetch(
          // localhost:8081/api/v1/daily-expense?date=2026-07-01&month=2026-01
          `/api/v1/daily-expense?date=${date}`,
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
          throw new Error(data.message || 'Fetching daily-expenses failed')
        }

        setDailyExpenses(data.data.dailyExpenses)
        setSelectableCategories(data.data.selectableCategoricalExpenses)
      } catch (error) {
        console.error(
          'Following error occured while fetching daily-expenses',
          error,
        )
        setError(error?.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDailyExpenses()
  }, [date])

  async function createDailyExpense(body) {
    try {
      const response = await fetch('/api/v1/daily-expense', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const text = await response.text() // safe even if empty or not JSON
        let message = response.statusText || 'Request failed'
        try {
          const errJson = text ? JSON.parse(text) : null
          message = errJson?.message ?? errJson?.error ?? message
        } catch (e) {
          // not JSON, use plain text
          message = text || message
        }
        throw new Error(message)
      }
      
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Creating daily-expense record failed')
      }

      setDailyExpenses((prev) => [...prev, data.data])
    } catch (error) {
      console.error(
        'Following error occured while creating daily-expense record',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function updateDailyExpense(id, body) {
    try {
      const response = await fetch(`/api/v1/daily-expense/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Updating daily-expense record failed')
      }

      setDailyExpenses((prev) =>
        prev.some((expense) => expense._id === data.data._id)
          ? prev.map((expense) =>
              expense._id === data.data._id ? data.data : expense,
            )
          : [data.data, ...prev],
      )
    } catch (error) {
      console.error(
        'Following error occured while updating daily-expense record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  async function deleteDailyExpense(id) {
    try {
      const response = await fetch(`/api/v1/daily-expense/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Deleting daily-expense record failed')
      }

      setDailyExpenses((prev) => prev.filter((expense) => expense._id != id))
    } catch (error) {
      console.error(
        'Following error occured while deleting daily-expense record:',
        error,
      )
      setError(error?.message)
      throw error
    }
  }

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section>
      <h1 className='text-center'>DailyExpenses Component</h1>
      {error && <p className='text-sm text-red-600'>{error}</p>}
      <div>
        <input
          type='date'
          name='daily-expense-date'
          id='daily-expense-date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div
          className={
            'hidden sm:grid sm:grid-cols-12 sm:gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200 pb-2 border-b border-gray-200/60 dark:border-gray-700/60'
          }
        >
          <div>#</div>
          <div>Item Name</div>
          <div>Price</div>
          <label htmlFor='category'>Choose a category:</label>
        </div>
        <div>
          {dailyExpenses.length > 0 &&
            dailyExpenses.map((expense, index) => (
              <ExpenseItem
                key={expense._id}
                id={expense._id}
                index={index}
                description={expense.description}
                amount={expense.amount}
                updateRecordFn={updateDailyExpense}
                deleteRecordFn={deleteDailyExpense}
                selectableCategories={selectableCategories}
                categoryId={expense.monthlyCategoricalExpenseId}
              />
            ))}
        </div>
        <CreateExpenseItem createRecordFn={createDailyExpense} date={date} />

        {/* Totals */}
        <div className='mt-4 text-sm font-semibold text-gray-800'>
          <span>Total: {totals.totalAmount}</span>
        </div>
      </div>
    </section>
  )
}
