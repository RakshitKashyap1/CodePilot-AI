import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types"

interface WorkspaceFile {
  name: string
  path: string
  type: "file" | "directory"
  children?: WorkspaceFile[]
}

interface FileContent {
  path: string
  content: string
  language: string
}

interface ScanResult {
  issues: number
  errors: number
  warnings: number
}

export async function getWorkspaceFiles(repoId: string) {
  const res = await apiClient.get<ApiResponse<WorkspaceFile[]>>(`/workspace/${repoId}/files/`)
  return res.data.data
}

export async function getFileContent(repoId: string, filePath: string) {
  const res = await apiClient.get<ApiResponse<FileContent>>(`/workspace/${repoId}/files/${encodeURIComponent(filePath)}`)
  return res.data.data
}

export async function runCodeScan(repoId: string, filePath: string) {
  const res = await apiClient.post<ApiResponse<ScanResult>>(`/workspace/${repoId}/scan/`, { file_path: filePath })
  return res.data.data
}
