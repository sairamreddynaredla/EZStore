import { useState } from 'react'
import { AuthContext } from './AuthContext'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Login User
  const login = (userData) => {
    setUser(userData)

    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Logout User
  const logout = () => {
    setUser(null)

    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider