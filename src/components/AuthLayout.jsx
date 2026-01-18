import { useState } from 'react'

export default function Protected({ authenticationRequired = true, childern }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <h1>AuthLayout</h1>
      {isLoading ? <h1>Loading...</h1> : { childern }}
    </>
  )
}
