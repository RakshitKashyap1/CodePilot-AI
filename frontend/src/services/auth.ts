import { apiClient } from "@/lib/api-client"
import type { ApiResponse, User } from "@/types"

interface LoginData {
  user: User
  access: string
  refresh: string
}

interface RegisterPayload {
  username: string
  email: string
  password: string
  password_confirm: string
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<ApiResponse<LoginData>>("/users/login/", { email, password })
  return res.data.data
}

export async function register(payload: RegisterPayload) {
  const res = await apiClient.post<ApiResponse<LoginData>>("/users/register/", payload)
  return res.data.data
}

export async function getProfile() {
  const res = await apiClient.get<ApiResponse<User>>("/users/profile/")
  return res.data.data
}

export async function updateProfile(data: Partial<User>) {
  const res = await apiClient.patch<ApiResponse<User>>("/users/profile/", data)
  return res.data.data
}

export async function forgotPassword(email: string) {
  await apiClient.post("/users/password-reset/", { email })
}

export async function resetPassword(token: string, password: string) {
  await apiClient.post("/users/password-reset/confirm/", { token, password })
}
