import { useEffect, useMemo, useState } from 'react'
import ExpenseItem from './ExpenseItem'
import CreateExpenseItem from './CreateExpenseItem'

export default function DailyExpenses() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyExpenses, setDailyExpenses] = useState([])
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
        const response = await fetch(`/api/v1/daily-expense?date=${date}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()

        if (!response.ok || data.success === false) {
          throw new Error(data.message || 'Fetching daily-expenses failed')
        }

        setDailyExpenses(data.data.dailyExpenses)
        setSelectableCategories(data.data.selectableCategoricalExpenses)
      } catch (error) {
        console.error('Following error occured while fetching daily-expenses', error)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const text = await response.text()
        let message = response.statusText || 'Request failed'
        try {
          const errJson = text ? JSON.parse(text) : null
          message = errJson?.message ?? errJson?.error ?? message
        } catch {
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
      console.error('Following error occured while creating daily-expense record', error)
      setError(error?.message)
      throw error
    }
  }

  async function updateDailyExpense(id, body) {
    try {
      const response = await fetch(`/api/v1/daily-expense/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Updating daily-expense record failed')
      }

      setDailyExpenses((prev) =>
        prev.some((expense) => expense._id === data.data._id)
          ? prev.map((expense) => (expense._id === data.data._id ? data.data : expense))
          : [data.data, ...prev],
      )
    } catch (error) {
      console.error('Following error occured while updating daily-expense record:', error)
      setError(error?.message)
      throw error
    }
  }

  async function deleteDailyExpense(id) {
    try {
      const response = await fetch(`/api/v1/daily-expense/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Deleting daily-expense record failed')
      }

      setDailyExpenses((prev) => prev.filter((expense) => expense._id != id))
    } catch (error) {
      console.error('Following error occured while deleting daily-expense record:', error)
      setError(error?.message)
      throw error
    }
  }

  if (isLoading) return <h1>Loading...</h1>

  return (
    <section className='space-y-3'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-lg font-medium'>Daily Expenses</h2>

        <div className='flex items-center gap-2'>
          <label className='text-sm' htmlFor='daily-expense-date'>
            Date
          </label>
          <input
            className='rounded border border-slate-700/50 bg-transparent px-2 py-1 text-sm'
            type='date'
            name='daily-expense-date'
            id='daily-expense-date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <div className='space-y-2 overflow-x-auto'>
        <div className='min-w-[720px] grid grid-cols-[3rem_1fr_8rem_1fr] gap-2 px-2 py-2 text-sm font-medium border border-slate-700/50 rounded'>
          <div>#</div>
          <div>Description</div>
          <div className='text-right'>Amount</div>
          <div>Category</div>
        </div>

        <div className='space-y-2'>
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
      </div>

      <div className='overflow-x-auto'>
        <div className='min-w-[720px] grid grid-cols-2 gap-2 px-2 py-2 border border-slate-700/50 rounded'>
          <div className='font-medium'>Total</div>
          <div className='text-right'>{totals.totalAmount}</div>
        </div>
      </div>
    </section>
  )
}
