import axios, { AxiosError } from 'axios'
import { apiErrorSchema, type ApiErrorCode, type ApiErrorShape } from '@/lib/contracts'

/** Normalized, UI-friendly API error. */
export class ApiError extends Error {
  code: ApiErrorCode
  details: Record<string, unknown> | undefined

  constructor(code: ApiErrorCode, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<ApiErrorShape>
    const data = ax.response?.data
    if (data && typeof data === 'object' && 'code' in data) {
      const parsed = apiErrorSchema.safeParse(data)
      if (parsed.success) {
        return new ApiError(parsed.data.code, parsed.data.message, parsed.data.details)
      }
      return new ApiError('INTERNAL', (data as { message?: string }).message ?? ax.message)
    }
    if (ax.code === 'ECONNABORTED' || !ax.response) {
      return new ApiError('NETWORK_ERROR', 'Falha de conexão. Verifique sua internet e tente novamente.')
    }
    return new ApiError('INTERNAL', ax.message)
  }
  return new ApiError('INTERNAL', error instanceof Error ? error.message : 'Erro inesperado')
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: { indexes: null },
})

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
)

export function bearer(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
