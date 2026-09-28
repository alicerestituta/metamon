<template>
  <section class="methane-chart-section">
    <div class="methane-card">
      <!-- Header Row Inside Card -->
      <div class="chart-header">
        <h2 class="section-title">Konsentrasi CH<sub class="sub-4">4</sub> Hari Ini</h2>
        <div class="current-metric">
          <span class="metric-num" :class="currentPpm >= 1000 ? 'danger-num' : 'safe-num'">
            {{ currentPpmLabel }}
          </span>
          <span class="metric-unit">ppm</span>
        </div>
      </div>

      <!-- Live indicator -->
      <div class="live-row">
        <span class="live-dot" :class="liveStatus"></span>
        <span class="live-label">{{ liveLabel }}</span>
        <span class="poll-note">Simulasi realtime · diperbarui tiap 5 dtk</span>
      </div>

      <!-- Chart Area -->
      <div class="chart-canvas-area">
        <svg v-if="series.length" class="chart-svg" :viewBox="`0 0 320 165`" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ch4RedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#CB0525" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#CB0525" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="ch4GreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#057602" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#057602" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Baseline -->
          <line x1="15" y1="95" x2="305" y2="95" stroke="#9CA3AF" stroke-width="1.2" stroke-dasharray="3 3" />

          <!-- Threshold line at 1000ppm -->
          <line :x1="15" :y1="threshY" :x2="305" :y2="threshY" stroke="#CB0525" stroke-width="1.5" stroke-dasharray="4 3" />
          <text :x="160" :y="threshY - 5" fill="#CB0525" font-size="9" font-weight="700" text-anchor="middle">Batas Bahaya (1.000 ppm)</text>

          <!-- Fill path -->
          <path :d="fillPath" fill="url(#ch4GreenGradient)" />

          <!-- Main line -->
          <path :d="linePath" fill="none" :stroke="lineColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

          <!-- X-axis labels (first, mid, last) -->
          <text v-for="(tick, i) in xTicks" :key="i"
            :x="tick.x" y="155" :fill="i === xTicks.length - 1 && currentPpm >= 1000 ? '#CB0525' : '#6C6C6C'"
            font-size="9.5" font-weight="600" text-anchor="middle"
          >{{ tick.label }}</text>
        </svg>

        <div v-else class="chart-empty">
          <p>Memuat data historis grafik...</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-grid">
        <button class="action-btn log-btn" @click="$emit('open-logs')">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 2.25H4.5C3.67157 2.25 3 2.92157 3 3.75V14.25C3 15.0784 3.67157 15.75 4.5 15.75H10.5L15 11.25V3.75C15 2.92157 14.3284 2.25 13.5 2.25Z" stroke="#18181B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 15.75V11.25H15" stroke="#18181B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6H12" stroke="#18181B" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M6 8.625H10.5" stroke="#18181B" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span>Log Sensor</span>
        </button>

        <button class="action-btn protocol-btn" @click="$emit('open-protocol')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="4.5" r="2.5" />
            <path d="M12 7v5" />
            <path d="M12 10.5a2.5 2.5 0 0 1 5 0v2.5a2 2 0 0 1 2 2v1c0 3.3-2.7 6-6 6h-1c-3.3 0-6-2.7-6-6v-3a2.5 2.5 0 0 1 5 0" />
          </svg>
          <span>Protokol K3</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineEmits(['open-logs', 'open-protocol'])

const { getCh4Series, getSimulatedReading } = useApi()

const series     = ref([])   // [{ time, ch4Ppm }]
const currentPpm = ref(0)
const liveStatus = ref('connecting') // 'live' | 'connecting' | 'error'
let seriesTimer  = null
let liveTimer    = null

// Chart dimensions
const SVG_W     = 320
const SVG_H     = 165
const PAD_L     = 20
const PAD_R     = 15
const PAD_T     = 20
const PAD_B     = 25
const MAX_PPM   = 2000
const THRESH    = 1000

const liveLabel = computed(() => {
  if (liveStatus.value === 'live')        return 'Live'
  if (liveStatus.value === 'error')       return 'Gagal konek'
  return 'Menghubungkan...'
})

const currentPpmLabel = computed(() =>
  currentPpm.value ? currentPpm.value.toLocaleString('id-ID') : '—'
)

function ppmToY(ppm) {
  const chartH = SVG_H - PAD_T - PAD_B
  const ratio  = Math.min(1, ppm / MAX_PPM)
  return PAD_T + chartH * (1 - ratio)
}

const threshY = computed(() => ppmToY(THRESH))

function pointsToPath(pts) {
  if (!pts.length) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
}

const chartPoints = computed(() => {
  if (!series.value.length) return []
  // Fixed window of 60 points for a smooth scrolling effect
  const MAX_POINTS = 60
  const xStep = (SVG_W - PAD_L - PAD_R) / (MAX_POINTS - 1)
  const startIdx = MAX_POINTS - series.value.length

  return series.value.map((pt, i) => ({
    x: PAD_L + (startIdx + i) * xStep,
    y: ppmToY(pt.ch4Ppm),
  }))
})

const linePath  = computed(() => pointsToPath(chartPoints.value))
const lineColor = computed(() => currentPpm.value >= THRESH ? '#CB0525' : '#057602')

const fillPath = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  const bottomY = SVG_H - PAD_B
  return `${linePath.value} L ${pts[pts.length - 1].x},${bottomY} L ${pts[0].x},${bottomY} Z`
})

const xTicks = computed(() => {
  const pts  = chartPoints.value
  const data = series.value
  if (!pts.length) return []
  const picks = [0, Math.floor(pts.length / 2), pts.length - 1]
  return picks
    .filter(i => i < pts.length)
    .map(i => ({ x: pts[i].x, label: data[i].time }))
})

// Fetch historical series every 60s
async function fetchSeries() {
  try {
    const res = await getCh4Series()
    if (res?.data?.series?.length) series.value = res.data.series
    if (res?.data?.currentCh4Ppm)  currentPpm.value = res.data.currentCh4Ppm
  } catch {}
}

// Fetch simulated reading every 5s (realtime simulation)
async function fetchLive() {
  try {
    const res = await getSimulatedReading()
    if (res?.data) {
      const avg = res.data.avgCh4Ppm
      currentPpm.value = avg

      // Append new point to series (rolling 60-point window)
      const now = new Date()
      const label = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      series.value = [...series.value.slice(-59), { time: label, ch4Ppm: avg }]
      liveStatus.value = 'live'
    }
  } catch {
    liveStatus.value = 'error'
  }
}

onMounted(async () => {
  await fetchSeries()
  await fetchLive()
  liveTimer = setInterval(fetchLive, 5000)
})

onUnmounted(() => {
  clearInterval(liveTimer)
})
</script>

<style scoped>
.methane-chart-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.methane-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.2px;
  margin: 0;
}

.sub-4 { font-size: 11px; bottom: -0.1em; }

.current-metric {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-num {
  font-size: 19px;
  font-weight: 900;
  transition: color 0.3s ease;
}

.danger-num { color: #CB0525; }
.safe-num   { color: #057602; }

.metric-unit {
  font-size: 12px;
  color: #6B7280;
  font-weight: 600;
}

/* Live indicator */
.live-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #6C6C6C;
  margin-top: -6px;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.live-dot.live         { background: #22C55E; animation: pulse 1.5s infinite; }
.live-dot.connecting   { background: #F59E0B; animation: pulse 1.5s infinite; }
.live-dot.error        { background: #CB0525; }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.3); }
}

.live-label {
  font-weight: 700;
  color: #1F1F1F;
}

.poll-note { margin-left: auto; font-size: 10px; }

.chart-canvas-area {
  background: #F8F7F4;
  border-radius: 12px;
  padding: 12px 6px 4px;
  border: 1px solid #F3F4F6;
}

.chart-svg {
  width: 100%;
  height: 155px;
  overflow: visible;
}

.chart-empty {
  height: 155px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #9CA3AF;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  font-family: inherit;
}

.log-btn {
  background: #F4F4F6;
  color: #18181B;
  border: 1px solid #E4E4E7;
}

.log-btn:hover {
  background: #E4E4E7;
  color: #000000;
}

.protocol-btn {
  background: #CB0525;
  color: #FFFFFF;
  box-shadow: 0 3px 10px rgba(203, 5, 37, 0.3);
}

.protocol-btn:hover {
  background: #A8041E;
  box-shadow: 0 4px 14px rgba(203, 5, 37, 0.4);
  transform: translateY(-1px);
}
</style>
