/**
 * useApi — Central composable for all backend calls.
 * - Reads baseURL from runtimeConfig.
 * - Automatically attaches the JWT Bearer token when available.
 * - Provides login / logout helpers and a reactive `user` state.
 */
import { ref, computed } from 'vue'
import { useToast } from './useToast'

const TOKEN_KEY = 'metamon_token'
const USER_KEY  = 'metamon_user'

// ── Global reactive state (module-level singleton) ──────────────────────────
const token = ref<string | null>(null)
const user  = ref<Record<string, any> | null>(null)

// Hydrate from localStorage on first import (client-side only)
if (typeof window !== 'undefined') {
  token.value = localStorage.getItem(TOKEN_KEY)
  const stored = localStorage.getItem(USER_KEY)
  if (stored) {
    try { user.value = JSON.parse(stored) } catch {}
  }
}

export function useApi() {
  const config  = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const toast   = useToast()

  const isLoggedIn = computed(() => !!token.value)

  // ── Low-level fetch wrapper ───────────────────────────────────────────────
  async function apiFetch<T = any>(
    path: string,
    options: RequestInit & { params?: Record<string, any> } = {},
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    let url = `${baseURL}${path}`
    if (params) {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ).toString()
      if (qs) url += `?${qs}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> ?? {}),
    }
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`

    const res = await fetch(url, { ...fetchOptions, headers, cache: 'no-store' })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const msg = err?.message ?? `Terjadi kesalahan (HTTP ${res.status})`
      toast.error(msg)
      throw new Error(msg)
    }

    return res.json() as Promise<T>
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  async function login(nip: string, password: string) {
    const data = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nip, password }),
    })
    token.value = data.data.accessToken
    user.value  = data.data.officer
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token.value!)
      localStorage.setItem(USER_KEY,  JSON.stringify(user.value))
    }
    toast.success(`Selamat datang, ${user.value?.name ?? 'Petugas'}!`)
    return data
  }

  async function logout() {
    try { await apiFetch('/auth/logout', { method: 'POST' }) } catch {}
    token.value = null
    user.value  = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  // ── Telemetry Dashboard ───────────────────────────────────────────────────
  async function getDashboard() {
    return apiFetch<any>('/telemetry/dashboard')
  }

  // ── Sectors ───────────────────────────────────────────────────────────────
  async function getSectors() {
    return apiFetch<any>('/sectors')
  }

  // ── Sensors ───────────────────────────────────────────────────────────────
  async function getSensors(params?: { sector?: string; search?: string; status?: string; page?: number; limit?: number }) {
    return apiFetch<any>('/sensors', { params })
  }

  // ── CH4 Time-Series (realtime simulation) ─────────────────────────────────
  async function getCh4Series(sectorCode?: string) {
    return apiFetch<any>('/readings/ch4-series', { params: { sectorCode } })
  }

  // ── CH4 Simulated Realtime (calls simulate endpoint) ─────────────────────
  async function getSimulatedReading() {
    return apiFetch<any>('/readings/simulate')
  }

  // ── Officer Profile ───────────────────────────────────────────────────────
  async function getMe() {
    return apiFetch<any>('/officers/me')
  }

  async function updateMe(dto: Record<string, any>) {
    return apiFetch<any>('/officers/me', { method: 'PATCH', body: JSON.stringify(dto) })
  }

  // ── Trucks ────────────────────────────────────────────────────────────────
  async function getTrucks(params?: { search?: string; isRerouted?: boolean }) {
    return apiFetch<any>('/trucks', { params })
  }

  async function rerouteTruck(id: string, dto: Record<string, any>) {
    return apiFetch<any>(`/trucks/${id}/reroute`, { method: 'PATCH', body: JSON.stringify(dto) })
  }

  async function rerouteBulk(dto: Record<string, any>) {
    const res = await apiFetch<any>('/trucks/reroute-bulk', { method: 'PATCH', body: JSON.stringify(dto) })
    toast.success(res.data?.message ?? 'Pengalihan berhasil dieksekusi.')
    return res
  }

  // ── Seed historical data (called once after login) ────────────────────────
  async function seedTodayHistory() {
    return apiFetch<any>('/readings/seed-history')
  }

  return {
    // state
    token,
    user,
    isLoggedIn,
    // auth
    login,
    logout,
    // data
    getDashboard,
    getSectors,
    getSensors,
    getCh4Series,
    getSimulatedReading,
    getMe,
    updateMe,
    getTrucks,
    rerouteTruck,
    rerouteBulk,
    seedTodayHistory,
  }
}
