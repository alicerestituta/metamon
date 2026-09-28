<template>
  <div class="sensor-page-container">
    <!-- Top Header Card: Pencarian Sensor -->
    <div class="page-card search-card">
      <div class="card-header-group">
        <h1 class="page-title">Telemetri Sensor</h1>
        <p class="page-subtitle">Pemantauan konsentrasi gas metana real-time.</p>
      </div>

      <div class="search-filter-row">
        <div class="search-input-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C6C6C" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari ID Sensor (misal: C-07)..."
            class="search-input"
            @input="debounceFetch"
          />
        </div>

        <div class="dropdown-filter-wrapper">
          <select v-model="selectedSector" class="select-filter" @change="fetchSensors(1)">
            <option value="">Sektor</option>
            <option value="A">Sektor A</option>
            <option value="B">Sektor B</option>
            <option value="C">Sektor C</option>
            <option value="D">Sektor D</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Metrics Grid -->
    <div class="summary-metrics-grid">
      <!-- Card 1: Node Terhubung -->
      <div class="page-card summary-card">
        <div class="summary-left">
          <span class="summary-label">Node Terhubung</span>
          <div class="summary-value">
            <span class="num-bold">{{ summary?.activeNodes ?? '—' }}</span>
            <span class="num-sub">/ {{ summary?.totalNodes ?? '—' }}</span>
          </div>
        </div>
        <div class="summary-right">
          <span class="active-badge-green">{{ activePercent }}% Aktif</span>
          <span class="summary-subtext">{{ (summary?.totalNodes ?? 0) - (summary?.activeNodes ?? 0) }} dalam perawatan</span>
        </div>
      </div>

      <!-- Card 2: Titik Tertinggi (CH4) -->
      <div class="page-card summary-card">
        <div class="summary-left">
          <span class="summary-label">Titik Tertinggi (CH<sub>4</sub>)</span>
          <div class="summary-value">
            <span class="num-bold red-text">{{ summary?.peakCh4Ppm?.toLocaleString('id-ID') ?? '—' }}</span>
            <span class="unit-text">ppm</span>
          </div>
        </div>
        <div class="summary-right text-right">
          <span class="peak-node-id">{{ summary?.peakNodeCode ?? '—' }}</span>
          <span class="summary-subtext">{{ summary?.peakSectorName ?? '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Main List Card: Pemantauan Real Time -->
    <div class="page-card list-container-card">
      <div class="list-header">
        <h2 class="list-title">Pemantauan Real Time</h2>

        <div class="status-filter-wrapper">
          <select v-model="selectedStatus" class="select-status-filter" @change="fetchSensors(1)">
            <option value="">Semua Status</option>
            <option value="danger">Bahaya</option>
            <option value="warning">Waspada</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="nodes-list">
        <div v-for="i in 4" :key="i" class="node-item-card skeleton-node">
          <div class="skel skel-title"></div>
          <div class="skel skel-data"></div>
        </div>
      </div>

      <!-- Node Cards Stream -->
      <div v-else class="nodes-list">
        <div v-if="!nodes.length" class="empty-state">
          Tidak ada node yang sesuai filter.
        </div>

        <div
          v-for="node in nodes"
          :key="node.id"
          class="node-item-card"
          :class="node.status"
        >
          <div class="node-top-bar">
            <div class="node-title-group">
              <span class="node-name">Node {{ node.nodeCode }}</span>
              <span class="status-chip" :class="node.status">{{ statusLabel(node.status) }}</span>
            </div>

            <div class="battery-group">
              <svg
width="12" height="12" viewBox="0 0 24 24" fill="none"
                :stroke="node.batteryPercent >= 30 ? '#057602' : '#CB0525'"
                stroke-width="2">
                <rect x="1" y="6" width="18" height="12" rx="2"></rect>
                <line x1="23" y1="10" x2="23" y2="14"></line>
              </svg>
              <span class="battery-level">{{ node.batteryPercent }}%</span>
            </div>
          </div>

          <!-- Data Box -->
          <div class="node-data-box">
            <div class="data-col text-center">
              <span class="col-label">Sektor</span>
              <span class="col-val">{{ node.sector?.name ?? '—' }}</span>
            </div>
            <div class="data-divider"></div>
            <div class="data-col text-center">
              <span class="col-label">Konsentrasi CH<sub>4</sub></span>
              <span class="col-val bold" :class="node.status === 'danger' ? 'danger-val' : ''">
                {{ node.latestReading ? `${node.latestReading.ch4Ppm.toLocaleString('id-ID')} ppm` : '—' }}
              </span>
            </div>
            <div class="data-divider"></div>
            <div class="data-col text-center">
              <span class="col-label">Terakhir Aktif</span>
              <span class="col-val">{{ formatRelative(node.lastSeenAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="pagination-bar">
        <button class="page-arrow" :disabled="pagination.page <= 1" @click="fetchSensors(pagination.page - 1)">‹</button>
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          class="page-num"
          :class="{ active: p === pagination.page }"
          @click="fetchSensors(p)"
        >{{ p }}</button>
        <button class="page-arrow" :disabled="pagination.page >= pagination.totalPages" @click="fetchSensors(pagination.page + 1)">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { getSensors } = useApi()

const searchQuery  = ref('')
const selectedSector = ref('')
const selectedStatus = ref('')

const loading   = ref(true)
const nodes     = ref([])
const summary   = ref(null)
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 })
let   pollTimer  = null
let   debounce   = null

const activePercent = computed(() => {
  if (!summary.value) return '—'
  const { activeNodes, totalNodes } = summary.value
  return totalNodes > 0 ? ((activeNodes / totalNodes) * 100).toFixed(1) : '0'
})

function statusLabel(s) {
  return { danger: 'Bahaya', warning: 'Waspada', normal: 'Normal' }[s] ?? s
}

function formatRelative(iso) {
  if (!iso) return '—'
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff} dtk lalu`
  if (diff < 3600) return `${Math.round(diff / 60)} mnt lalu`
  return `${Math.round(diff / 3600)} jam lalu`
}

async function fetchSensors(page = 1) {
  loading.value = true
  try {
    const res = await getSensors({
      search: searchQuery.value || undefined,
      sector: selectedSector.value || undefined,
      status: selectedStatus.value || undefined,
      page,
      limit: 10,
    })
    nodes.value     = res.data.nodes
    summary.value   = res.data.summary
    pagination.value = { ...res.data.pagination, page }
  } catch {}
  finally { loading.value = false }
}

function debounceFetch() {
  clearTimeout(debounce)
  debounce = setTimeout(() => fetchSensors(1), 400)
}

onMounted(() => {
  fetchSensors()
  pollTimer = setInterval(() => fetchSensors(pagination.value.page), 10000)
})

onUnmounted(() => {
  clearInterval(pollTimer)
  clearTimeout(debounce)
})
</script>

<style scoped>
.sensor-page-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.page-card {
  background: #FFFFFF;
  border: 1px solid #EBEBEB;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.page-title {
  font-size: 18px;
  font-weight: 800;
  color: #1F1F1F;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 12px;
  color: #6C6C6C;
  margin-top: 2px;
}

.search-filter-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.search-input-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 38px;
  background: #F4F4F6;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 12px 0 36px;
  font-size: 12px;
  color: #1F1F1F;
  outline: none;
  font-family: inherit;
}

.search-input:focus {
  border-color: #057602;
  background: #FFFFFF;
}

.dropdown-filter-wrapper, .status-filter-wrapper {
  position: relative;
}

.select-filter, .select-status-filter {
  height: 38px;
  background: #F4F4F6;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1F1F1F;
  outline: none;
  cursor: pointer;
  font-family: inherit;
}

.select-status-filter {
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  height: 32px;
  padding: 0 8px;
}

/* Summary Metrics */
.summary-metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-card {
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-left {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 12px;
  color: #6C6C6C;
}

.summary-label sub { font-size: 8px; }

.summary-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 2px;
}

.num-bold {
  font-size: 22px;
  font-weight: 800;
  color: #1F1F1F;
}

.num-bold.red-text { color: #CB0525; }

.num-sub, .unit-text {
  font-size: 13px;
  color: #6C6C6C;
}

.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.text-right { text-align: right; }

.active-badge-green {
  background: #057602;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.summary-subtext {
  font-size: 11px;
  color: #6C6C6C;
  margin-top: 4px;
}

.peak-node-id {
  font-size: 18px;
  font-weight: 900;
  color: #CB0525;
}

/* Main List Container */
.list-container-card { padding: 18px 14px; }

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.list-title {
  font-size: 16px;
  font-weight: 800;
  color: #1F1F1F;
}

.nodes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #9CA3AF;
  font-size: 13px;
}

.node-item-card {
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
  transition: border-color 0.2s ease;
}

.node-item-card.danger  { border-left: 3px solid #CB0525; }
.node-item-card.warning { border-left: 3px solid #F59E0B; }

.node-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.node-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-name {
  font-size: 14px;
  font-weight: 800;
  color: #1F1F1F;
}

.status-chip {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  color: #FFFFFF;
}

.status-chip.danger  { background: #CB0525; }
.status-chip.warning { background: #F59E0B; color: #1F1F1F; }
.status-chip.normal  { background: #057602; }

.battery-group {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #505050;
}

.node-data-box {
  background: #F7F7F8;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.data-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.text-center { text-align: center; }

.col-label {
  font-size: 10px;
  color: #6C6C6C;
}

.col-label sub { font-size: 7px; }

.col-val {
  font-size: 13px;
  font-weight: 700;
  color: #1F1F1F;
}

.col-val.bold { font-weight: 800; }
.col-val.danger-val { color: #CB0525; }

.data-divider {
  width: 1px;
  height: 28px;
  background: #EAEAEA;
}

/* Pagination Bar */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
  padding-top: 14px;
  flex-wrap: wrap;
}

.page-arrow, .page-num {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #F3F4F6;
  color: #505050;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.page-arrow:disabled { opacity: 0.5; cursor: not-allowed; }
.page-num.active { background: #057602; color: #FFFFFF; }

/* Skeleton */
.skeleton-node { display: flex; flex-direction: column; gap: 12px; }

.skel {
  background: #F3F4F6;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.skel-title { height: 14px; width: 40%; }
.skel-data  { height: 50px; width: 100%; border-radius: 8px; }

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
</style>
