import { Incomes, Savings, MonthlyExpenses, Container } from '../components'

export default function Dashboard() {
  return (
    <>
      <h1>Dashborad Page</h1>
      <Container>
        <Incomes />
        <Savings />
      </Container>
    </>
  )
}
