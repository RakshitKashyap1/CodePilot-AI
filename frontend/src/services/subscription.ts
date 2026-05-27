import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types"

interface Plan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
}

interface Subscription {
  plan: Plan
  status: "active" | "canceled" | "past_due"
  current_period_end: string
  cancel_at_period_end: boolean
}

export async function getPlans() {
  const res = await apiClient.get<ApiResponse<Plan[]>>("/subscription/plans/")
  return res.data.data
}

export async function getCurrentSubscription() {
  const res = await apiClient.get<ApiResponse<Subscription>>("/subscription/current/")
  return res.data.data
}

export async function createCheckoutSession(planId: string) {
  const res = await apiClient.post<ApiResponse<{ url: string }>>("/subscription/create-checkout/", { plan_id: planId })
  return res.data.data.url
}
