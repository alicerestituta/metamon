<template>
  <div class="reroute-page-container">
    <!-- Section 1: Kontrol Intervensi Petugas -->
    <section class="reroute-card">
      <div class="card-header">
        <h1 class="card-title">Kontrol Intervensi Petugas</h1>
        <p class="card-subtext">Pengalihan arus truk dan muatan aktif</p>
      </div>

      <div class="intervention-box">
        <div class="box-label-row">
          <span class="box-label">Pilih sektor tujuan baru:</span>
          <span class="box-sublabel">3 alternatif sektor tersedia</span>
        </div>

        <!-- 4 Sector Choice Cards -->
        <div class="sector-choice-grid">
          <div 
            v-for="sec in sectorChoices" 
            :key="sec.id"
            class="sector-choice-card"
            :class="{ 
              active: selectedTargetSector === sec.id,
              disabled: sec.disabled 
            }"
            @click="selectSector(sec)"
          >
            <span class="choice-name">{{ sec.name }}</span>
            <span class="choice-capacity" :class="{ danger: sec.disabled }">
              {{ sec.capacity }} Kapasitas
            </span>
          </div>
        </div>

        <!-- Action Execution Button -->
        <button class="execute-btn" @click="handleExecuteReroute">
          Eksekusi Pengalihan Kuota
        </button>
      </div>
    </section>

    <!-- Section 2: Detail Beban Sektor -->
    <section class="reroute-card">
      <div class="card-header">
        <h2 class="card-title">Detail Beban Sektor</h2>
      </div>

      <div class="sector-load-grid">
        <div 
          v-for="sec in sectorLoads" 
          :key="sec.id"
          class="sector-load-card"
        >
          <div class="load-card-header">
            <div class="load-title-group">
              <h3 class="load-sector-name">{{ sec.name }}</h3>
              <span class="status-badge" :class="sec.statusType">{{ sec.statusLabel }}</span>
            </div>
            <span class="load-capacity-percent">{{ sec.capacityPercent }}% Kapasitas</span>
          </div>

          <!-- Load Progress Bar -->
          <div class="load-progress-track">
            <div 
              class="load-progress-fill" 
              :class="sec.statusType"
              :style="{ width: sec.progressWidth + '%' }"
            ></div>
          </div>

          <div class="load-card-footer">
            <span class="methane-label">Konsentrasi gas metana:</span>
            <span class="methane-value" :class="sec.statusType">{{ sec.ch4Value }} Ppm</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Kontrol Kendaraan Timbangan -->
    <section class="reroute-card">
      <div class="card-header">
        <h2 class="card-title">Kontrol Kendaraan Timbangan</h2>
        <p class="card-subtext">Antrean masuk jembatan timbang & routing armada</p>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs-wrapper">
        <button 
          class="tab-pill" 
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          Semua ({{ totalCount }})
        </button>
        <button 
          class="tab-pill" 
          :class="{ active: activeTab === 'rerouted' }"
          @click="activeTab = 'rerouted'"
        >
          Dialihkan ({{ reroutedCount }})
        </button>
        <button 
          class="tab-pill" 
          :class="{ active: activeTab === 'normal' }"
          @click="activeTab = 'normal'"
        >
          Sesuai Rute ({{ normalCount }})
        </button>
      </div>

      <!-- Search Input -->
      <div class="search-input-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari plat nomor..." 
          class="search-input"
        />
      </div>

      <!-- Truck Vehicle Cards List -->
      <div class="truck-list">
        <div 
          v-for="truck in filteredTrucks" 
          :key="truck.id"
          class="truck-card"
        >
          <div class="truck-card-header">
            <span class="plate-number">{{ truck.plate }}</span>
            <span class="truck-status-badge" :class="truck.isRerouted ? 'rerouted' : 'normal'">
              {{ truck.isRerouted ? 'Dialihkan' : 'Sesuai Tujuan' }}
            </span>
          </div>

          <!-- Destination Route Box -->
          <div class="route-box">
            <template v-if="truck.isRerouted">
              <span class="route-origin">Tujuan: {{ truck.originalTarget }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <span class="route-rerouted">Dialihkan: {{ truck.reroutedTarget }}</span>
            </template>
            <template v-else>
              <span class="route-origin normal">Tujuan: {{ truck.originalTarget }}</span>
            </template>
          </div>

          <!-- Reroute Actions (Only if rerouted) -->
          <div v-if="truck.isRerouted" class="truck-action-row">
            <span class="action-label">Ubah Pengalihan:</span>
            <div class="action-btn-group">
              <button class="shift-btn" @click="changeTruckTarget(truck, 'Sektor A')">Pindah ke A</button>
              <button class="shift-btn" @click="changeTruckTarget(truck, 'Sektor D')">Pindah ke D</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <button class="page-nav-btn" disabled>&lt;</button>
        <button class="page-num-btn active">1</button>
        <button class="page-num-btn">2</button>
        <span class="page-dots">...</span>
        <button class="page-num-btn">10</button>
        <button class="page-nav-btn">&gt;</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const { getSectors, getTrucks, rerouteBulk, rerouteTruck } = useApi()

const selectedTargetSector = ref('') // ex: 'A'

const rawSectors = ref([])
const rawTrucks = ref([])
const totalCount = ref(0)
const reroutedCount = ref(0)
const normalCount = ref(0)

const activeTab = ref('all')
const searchQuery = ref('')

async function fetchData() {
  try {
    const s = await getSectors()
    rawSectors.value = s.data

    if (!selectedTargetSector.value) {
      const avail = rawSectors.value.find(sec => sec.status !== 'locked' && sec.status !== 'danger')
      if (avail) selectedTargetSector.value = avail.sectorCode
    }

    const q = { limit: 50 }
    if (activeTab.value !== 'all') q.status = activeTab.value
    if (searchQuery.value) q.search = searchQuery.value

    const t = await getTrucks(q)
    rawTrucks.value = t.data.trucks
    totalCount.value = t.data.summary.total
    reroutedCount.value = t.data.summary.reroutedCount
    normalCount.value = t.data.summary.normalCount
  } catch (err) {
    console.error(err)
  }
}

watch([activeTab, searchQuery], () => {
  fetchData()
})

const sectorChoices = computed(() => {
  return rawSectors.value.map(s => ({
    id: s.sectorCode,
    name: s.name,
    capacity: `${s.capacityPercent}%`,
    disabled: s.status === 'locked' || s.status === 'danger'
  }))
})

const sectorLoads = computed(() => {
  return rawSectors.value.map(s => ({
    id: s.id,
    name: s.name,
    statusLabel: s.statusLabel,
    statusType: s.status,
    capacityPercent: s.capacityPercent,
    progressWidth: s.capacityPercent,
    ch4Value: s.currentCh4Ppm ? s.currentCh4Ppm.toLocaleString('id-ID') : '0'
  }))
})

const filteredTrucks = computed(() => {
  return rawTrucks.value.map(t => ({
    id: t.id,
    plate: t.plateNumber,
    isRerouted: t.isRerouted,
    originalTarget: t.originalSector?.name || '?',
    reroutedTarget: t.reroutedSector?.name || ''
  }))
})

function selectSector(sec) {
  if (sec.disabled) return
  selectedTargetSector.value = sec.id
}

async function handleExecuteReroute() {
  if (!selectedTargetSector.value) return
  
  const source = rawSectors.value.find(s => s.status === 'locked' || s.status === 'danger')
  if (!source) {
    alert("Tidak ada sektor yang sedang kelebihan kapasitas (locked/danger) untuk dialihkan.")
    return
  }
  
  try {
    const res = await rerouteBulk({ 
      fromSectorCode: source.sectorCode, 
      toSectorCode: selectedTargetSector.value 
    })
    alert(res.data?.message || "Pengalihan berhasil dieksekusi.")
    await fetchData()
  } catch(e) {
    alert(e.message || "Gagal mengeksekusi pengalihan.")
  }
}

async function changeTruckTarget(truck, newTargetName) {
  try {
    const sectorCode = newTargetName.replace('Sektor ', '')
    const res = await rerouteTruck(truck.id, { toSectorCode: sectorCode })
    alert(res.message || `Rute armada ${truck.plate} berhasil dipindahkan.`)
    await fetchData()
  } catch(e) {
    alert(e.message || "Gagal memindahkan armada.")
  }
}

let pollTimer = null
onMounted(() => {
  fetchData()
  pollTimer = setInterval(fetchData, 10000)
})
</script>

<style scoped>
.reroute-page-container {
  padding: 16px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

/* Shared Card Styling */
.reroute-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
  margin: 0;
}

.card-subtext {
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

/* Section 1: Intervention Box */
.intervention-box {
  background: #F8F9FA;
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.box-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.box-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
}

.box-sublabel {
  font-size: 11.5px;
  color: #9CA3AF;
}

/* Sector Choice Grid */
.sector-choice-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.sector-choice-card {
  background: #FFFFFF;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
}

.sector-choice-card:hover:not(.disabled) {
  border-color: #057602;
}

.sector-choice-card.active {
  border-color: #057602;
  box-shadow: 0 0 0 2px rgba(5, 118, 2, 0.15);
}

.sector-choice-card.disabled {
  background: #EFEFEF;
  border-color: #E5E7EB;
  cursor: not-allowed;
  opacity: 0.65;
}

.choice-name {
  font-size: 13.5px;
  font-weight: 800;
  color: #1F2937;
}

.choice-capacity {
  font-size: 11px;
  color: #6B7280;
  font-weight: 600;
}

.choice-capacity.danger {
  color: #CB0525;
}

/* Execute Button */
.execute-btn {
  width: 100%;
  height: 42px;
  background: #057602;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  box-shadow: 0 2px 6px rgba(5, 118, 2, 0.25);
}

.execute-btn:hover {
  background: #046201;
  transform: translateY(-1px);
}

/* Section 2: Sector Load Grid */
.sector-load-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sector-load-card {
  background: #F8F9FA;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.load-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.load-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.load-sector-name {
  font-size: 14px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.status-badge {
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  color: #FFFFFF;
}

.status-badge.normal {
  background: #057602;
}

.status-badge.danger {
  background: #CB0525;
}

.status-badge.warning {
  background: #EAB308;
  color: #1F2937;
}

.load-capacity-percent {
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
}

.load-progress-track {
  width: 100%;
  height: 6px;
  background: #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
}

.load-progress-fill {
  height: 100%;
  border-radius: 10px;
}

.load-progress-fill.normal {
  background: #057602;
}

.load-progress-fill.danger {
  background: #CB0525;
}

.load-progress-fill.warning {
  background: #EAB308;
}

.load-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.methane-label {
  color: #6B7280;
}

.methane-value {
  font-weight: 800;
}

.methane-value.normal {
  color: #057602;
}

.methane-value.danger {
  color: #CB0525;
}

.methane-value.warning {
  color: #EAB308;
}

/* Section 3: Truck Control */
.filter-tabs-wrapper {
  background: #F3F4F6;
  padding: 4px;
  border-radius: 10px;
  display: flex;
  gap: 4px;
}

.tab-pill {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-pill.active {
  background: #FFFFFF;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F8F9FA;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 8px 12px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  font-family: inherit;
  width: 100%;
  color: #1F2937;
}

/* Truck List */
.truck-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.truck-card {
  background: #F8F9FA;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.truck-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plate-number {
  font-size: 14.5px;
  font-weight: 800;
  color: #111827;
}

.truck-status-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
}

.truck-status-badge.rerouted {
  background: #FEF3C7;
  color: #D97706;
}

.truck-status-badge.normal {
  background: #DCFCE7;
  color: #15803D;
}

/* Route Box */
.route-box {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
}

.route-origin {
  color: #CB0525;
  font-weight: 700;
}

.route-origin.normal {
  color: #374151;
}

.route-rerouted {
  color: #374151;
  font-weight: 700;
}

/* Action Row */
.truck-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.action-label {
  font-size: 11.5px;
  color: #6B7280;
  font-weight: 600;
}

.action-btn-group {
  display: flex;
  gap: 8px;
}

.shift-btn {
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 11.5px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}

.shift-btn:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}

/* Pagination Bar */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.page-nav-btn, .page-num-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: #EFEFEF;
  color: #4B5563;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-num-btn.active {
  background: #057602;
  color: #FFFFFF;
  border-color: #057602;
}

.page-dots {
  color: #9CA3AF;
  font-size: 12px;
}

@media (max-width: 640px) {
  .sector-choice-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .truck-action-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
