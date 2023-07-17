import { useEffect, useState } from 'react'

const useGrantUniqueToken = () => {
  const [token, setToken] = useState('')

  function generateUniqueId() {
    const randomNumber = Math.random().toString(36).substr(2, 9)

    const timestamp = Date.now().toString(36)

    const uniqueId = randomNumber + timestamp

    return uniqueId
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token || '')
  }, [token])

  useEffect(() => {
    if (!token) {
      const newToken = generateUniqueId()

      localStorage.setItem('token', newToken)
    }
  }, [])
}

export default useGrantUniqueToken
