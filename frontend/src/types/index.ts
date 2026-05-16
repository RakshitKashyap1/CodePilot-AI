export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Review {
  id: string;
  repositoryName: string;
  status: "pending" | "completed" | "failed";
  score: number;
  createdAt: string;
}
