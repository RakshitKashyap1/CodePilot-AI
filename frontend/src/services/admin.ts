import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types"

interface SystemStatus {
  database: "healthy" | "degraded" | "down"
  redis: "healthy" | "degraded" | "down"
  ai_service: "healthy" | "degraded" | "down"
  uptime_hours: number
}

interface RevenueMetrics {
  total_revenue: number
  monthly_recurring: number
  active_subscriptions: number
  revenue_by_month: { month: string; revenue: number }[]
}

interface AdminUser {
  id: string
  email: string
  username: string
  role: string
  is_active: boolean
  date_joined: string
}

export async function getSystemStatus() {
  const res = await apiClient.get<ApiResponse<SystemStatus>>("/admin/system/status/")
  return res.data.data
}

export async function getRevenueMetrics() {
  const res = await apiClient.get<ApiResponse<RevenueMetrics>>("/admin/revenue/")
  return res.data.data
}

export async function getUsers(params?: { search?: string; page?: number }) {
  const query = params?.search ? `?search=${params.search}` : ""
  const res = await apiClient.get<ApiResponse<AdminUser[]>>(`/admin/users/${query}`)
  return res.data.data
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  const res = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/`, { is_active: isActive })
  return res.data.data
}
