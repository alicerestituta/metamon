<template>
  <div class="hero-banner-card">
    <div class="hero-bg-overlay"></div>
    <div class="hero-content">
      <div class="hero-top">
        <div>
          <h1 class="hero-title">TPA Bantar Gebang</h1>
          <p class="hero-subtitle">Sistem Telemetri & Mitigasi Gas Metana</p>
        </div>
        <button class="refresh-circle-btn" @click="refreshData" title="Refresh Data">
          <svg :class="{ spin: isSpinning }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1D1F" stroke-width="2.5">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </div>

      <!-- Alert Bar — dynamic based on dashboard data -->
      <div v-if="riskLevel === 'danger' || riskLevel === 'warning'" class="hero-alert-bar" :class="riskLevel">
        <div class="alert-left">
          <div class="alert-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="alert-text">
            <span class="alert-title">{{ alertTitle }}</span>
            <span class="alert-desc">{{ alertMessage }}</span>
          </div>
        </div>

        <button class="action-followup-btn" @click="$emit('open-protocol')">
          Tindak Lanjuti
        </button>
      </div>

      <!-- Normal state -->
      <div v-else class="hero-normal-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>Semua sektor dalam kondisi normal</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineEmits(['open-protocol'])

const { getDashboard } = useApi()

const isSpinning = ref(false)
const dashData   = ref(null)
let pollTimer    = null

const riskLevel = computed(() => dashData.value?.riskLevel ?? 'normal')

const alertTitle = computed(() => {
  const s = dashData.value?.alertSector
  if (riskLevel.value === 'danger')  return s ? `BAHAYA SEKTOR ${s}` : 'BAHAYA TERDETEKSI'
  if (riskLevel.value === 'warning') return s ? `WASPADA SEKTOR ${s}` : 'PERINGATAN'
  return ''
})

const alertMessage = computed(() =>
  dashData.value?.alertMessage ?? 'Pantau kondisi dan segera tindak lanjuti'
)

async function fetchDashboard() {
  try {
    const res = await getDashboard()
    dashData.value = res.data
  } catch {}
}

async function refreshData() {
  isSpinning.value = true
  await fetchDashboard()
  setTimeout(() => { isSpinning.value = false }, 600)
}

onMounted(() => {
  fetchDashboard()
  pollTimer = setInterval(fetchDashboard, 15000)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.hero-banner-card {
  position: relative;
  background-image: url('/tpa_hero_bg.png');
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  margin: 16px 16px 12px 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.75) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 16px;
  color: #FFFFFF;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 20px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

.refresh-circle-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #FFFFFF;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.refresh-circle-btn:hover { background: #F4F4F5; }

.spin { animation: spin 0.6s linear; }

@keyframes spin { 100% { transform: rotate(360deg); } }

/* Alert Bar */
.hero-alert-bar {
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hero-alert-bar.danger  { background: #D91E36; }
.hero-alert-bar.warning { background: #B45309; }

.hero-normal-bar {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-icon-box { display: flex; align-items: center; }

.alert-text {
  display: flex;
  flex-direction: column;
}

.alert-title {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.3px;
}

.alert-desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.action-followup-btn {
  background: #FFFFFF;
  color: #D91E36;
  border: none;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.action-followup-btn:hover { transform: scale(1.03); }
</style>
