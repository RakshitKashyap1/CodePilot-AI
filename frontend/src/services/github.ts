import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types"

interface GitHubRepo {
  name: string
  url: string
  private: boolean
}

interface GitHubProfile {
  github_id: string
  avatar_url: string
}

export async function getOAuthUrl() {
  const res = await apiClient.get<ApiResponse<{ oauth_url: string }>>("/github/oauth/url/")
  return res.data.data.oauth_url
}

export async function exchangeOAuthCode(code: string) {
  const res = await apiClient.post<ApiResponse<{ webhook_secret: string }>>("/github/oauth/callback/", { code })
  return res.data
}

export async function listRepositories() {
  const res = await apiClient.get<ApiResponse<GitHubRepo[]>>("/github/repos/import/")
  return res.data.data
}

export async function importRepository(repo: { name: string; url: string; private: boolean }) {
  const res = await apiClient.post<ApiResponse<{ message: string }>>("/github/repos/import/", repo)
  return res.data
}
