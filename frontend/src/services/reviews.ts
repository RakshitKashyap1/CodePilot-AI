import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types"
import { buildQueryString } from "@/utils/url"

export interface ReviewItem {
  id: string
  title: string
  language: string
  status: string
  overall_score: number | null
  summary: string | null
  is_saved: boolean
  created_at: string
  feedbacks: ReviewFeedback[]
}

export interface ReviewFeedback {
  id: string
  file_path: string
  line_number: number | null
  issue_type: string
  severity: string
  description: string
  suggestion: string
}

export interface ReviewFilters {
  language?: string
  status?: string
  is_saved?: boolean
  search?: string
  ordering?: string
  created_at_after?: string
  created_at_before?: string
}

export async function getReviews(filters?: ReviewFilters) {
  const query = filters ? buildQueryString(filters as Record<string, string | number | boolean | undefined>) : ""
  const res = await apiClient.get<ReviewItem[]>(`/reviews/${query}`)
  return res.data
}

export async function getReviewById(id: string) {
  const res = await apiClient.get<ApiResponse<ReviewItem>>(`/reviews/${id}/`)
  return res.data.data
}

export async function createReview(payload: { title: string; code_snippet: string; language: string }) {
  const res = await apiClient.post<ApiResponse<ReviewItem>>("/reviews/", payload)
  return res.data
}

export async function deleteReview(id: string) {
  const res = await apiClient.delete<ApiResponse<null>>(`/reviews/${id}/`)
  return res.data
}

export async function toggleSaveReview(id: string) {
  const res = await apiClient.post<ApiResponse<{ is_saved: boolean }>>(`/reviews/${id}/toggle_save/`)
  return res.data.data.is_saved
}
