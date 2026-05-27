import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types"

interface DashboardStats {
  overview: {
    total_reviews: number
    completed_reviews: number
    average_score: number
  }
  language_usage: { language: string; count: number }[]
  issue_breakdown: Record<string, number>
  activity_graph: { date: string; count: number }[]
  ai_metrics: {
    total_tokens: number
    total_cost: number
    avg_latency_ms: number
  }
}

interface ReviewTrend {
  date: string
  count: number
  average_score: number
}

export async function getDashboardStats() {
  const res = await apiClient.get<ApiResponse<DashboardStats>>("/analytics/dashboard/")
  return res.data.data
}

export async function getReviewTrends(params?: { days?: number }) {
  const query = params?.days ? `?days=${params.days}` : ""
  const res = await apiClient.get<ApiResponse<ReviewTrend[]>>(`/reviews/trends/${query}`)
  return res.data.data
}
