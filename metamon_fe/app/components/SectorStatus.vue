<template>
  <section class="sector-status-outer-container">
    <div class="sector-status-wrapper-card">
      <div class="section-header">
        <h2 class="section-title">Status Sektor TPA</h2>
        <span class="update-label">{{ updatedLabel }}</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="sector-item-list">
        <div v-for="i in 4" :key="i" class="sector-row-item skeleton-row">
          <div class="skel skel-sq"></div>
          <div class="skel-lines">
            <div class="skel skel-line-l"></div>
            <div class="skel skel-line-s"></div>
          </div>
          <div class="skel skel-pill"></div>
        </div>
      </div>

      <div v-else class="sector-item-list">
        <div
          v-for="sector in sectors"
          :key="sector.id"
          class="sector-row-item"
        >
          <div class="item-left-content">
            <div class="badge-square" :class="badgeClass(sector.status)">
              {{ sector.sectorCode }}
            </div>
            <div class="sector-text-details">
              <h3 class="sector-name">{{ sector.name }}</h3>
              <p class="sector-metric-line">Kapasitas Buang: {{ sector.capacityPercent }}%</p>
              <p class="sector-metric-line">CH<sub>4</sub>: {{ formatCh4(sector.currentCh4Ppm) }}</p>
            </div>
          </div>

          <div class="status-pill-badge" :class="badgeClass(sector.status)">
            Status: {{ statusLabel(sector.status) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { getSectors } = useApi()

const loading  = ref(true)
const sectors  = ref([])
const lastFetch = ref(null)
let pollTimer  = null

const updatedLabel = computed(() => {
  if (!lastFetch.value) return 'Memuat...'
  const diff = Math.round((Date.now() - lastFetch.value) / 1000)
  if (diff < 60) return `Update: ${diff} dtk lalu`
  return `Update: ${Math.round(diff / 60)} mnt lalu`
})

function badgeClass(status) {
  if (status === 'danger' || status === 'locked') return 'red'
  if (status === 'warning') return 'yellow'
  return 'green'
}

function statusLabel(status) {
  const map = { normal: 'Aman', warning: 'Waspada', danger: 'Bahaya', locked: 'Terkunci' }
  return map[status] ?? status
}

function formatCh4(ppm) {
  if (ppm == null) return '—'
  return ppm >= 1000 ? `${(ppm / 1000).toFixed(2).replace('.', '.')} kppm` : `${Math.round(ppm)} ppm`
}

async function fetchSectors() {
  try {
    const res = await getSectors()
    sectors.value = res.data
    lastFetch.value = Date.now()
  } catch {}
  finally { loading.value = false }
}

onMounted(() => {
  fetchSectors()
  pollTimer = setInterval(fetchSectors, 15000)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.sector-status-outer-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

.sector-status-wrapper-card {
  background: #FFFFFF;
  border: 1px solid #EBEBEB;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1F1F1F;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.update-label {
  font-size: 12px;
  font-weight: 400;
  color: #6C6C6C;
}

.sector-item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sector-row-item {
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 78px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.item-left-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge-square {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  flex-shrink: 0;
}

.badge-square.green  { background: #057602; color: #FFFFFF; }
.badge-square.red    { background: #CB0525; color: #FFFFFF; }
.badge-square.yellow { background: #F59E0B; color: #1F1F1F; }

.sector-text-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sector-name {
  font-size: 14px;
  font-weight: 800;
  color: #1F1F1F;
  line-height: 1.2;
}

.sector-metric-line {
  font-size: 11px;
  font-weight: 400;
  color: #6C6C6C;
  line-height: 1.3;
}

.sector-metric-line sub {
  font-size: 8px;
  vertical-align: sub;
}

.status-pill-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill-badge.green  { background: #057602; color: #FFFFFF; }
.status-pill-badge.red    { background: #CB0525; color: #FFFFFF; }
.status-pill-badge.yellow { background: #F59E0B; color: #1F1F1F; }

/* Skeleton */
.skeleton-row { gap: 12px; }

.skel {
  background: #F3F4F6;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.skel-sq { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; }
.skel-lines { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.skel-line-l { height: 14px; width: 60%; }
.skel-line-s { height: 10px; width: 40%; }
.skel-pill { height: 22px; width: 70px; border-radius: 4px; }

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
</style>
