export interface Video {
  id: string;
  videoLink: string;
  script: string;
  videoId: string;
  createdAt?: string;
}

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  user: any;
  error: AuthError | null;
} 