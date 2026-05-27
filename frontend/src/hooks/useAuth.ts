"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { login as loginApi, register as registerApi } from "@/services/auth"
import { extractApiError } from "@/utils/error"

export function useAuth() {
  const router = useRouter()
  const { user, token, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginApi(email, password)
    setAuth(
      { id: data.user.id, email: data.user.email, name: data.user.username },
      data.access,
    )
    router.push("/dashboard")
  }, [setAuth, router])

  const register = useCallback(async (username: string, email: string, password: string, confirmPassword: string) => {
    const data = await registerApi({ username, email, password, password_confirm: confirmPassword })
    setAuth(
      { id: data.user.id, email: data.user.email, name: data.user.username },
      data.access,
    )
    router.push("/dashboard")
  }, [setAuth, router])

  const logout = useCallback(() => {
    storeLogout()
    router.push("/login")
  }, [storeLogout, router])

  return { user, token, isAuthenticated, login, register, logout, loginError: extractApiError }
}
