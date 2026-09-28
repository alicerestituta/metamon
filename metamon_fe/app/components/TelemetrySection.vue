<template>
  <section class="telemetry-outer-container">
    <div class="telemetry-wrapper-card">
      <div class="section-header">
        <h2 class="section-title">Telemetri Utama</h2>
        <p class="section-subtitle">Ringkasan data metrik operasional</p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="card-grid">
        <div v-for="i in 4" :key="i" class="metric-card skeleton-card">
          <div class="skel skel-label"></div>
          <div class="skel skel-value"></div>
          <div class="skel skel-badge"></div>
        </div>
      </div>

      <div v-else class="card-grid">
        <!-- Card 1: Risk Card -->
        <div class="metric-card">
          <span class="metric-label">Tingkat Risiko</span>
          <div class="risk-level-val" :class="riskClass">{{ riskLabel }}</div>
          <div class="status-badge" :class="riskBadgeClass">
            {{ alertText }}
          </div>
        </div>

        <!-- Card 2: Rata-Rata CH4 -->
        <div class="metric-card">
          <span class="metric-label">Rata-Rata CH<sub>4</sub></span>
          <div class="metric-value-box">
            <span class="val-number">{{ data?.avgCh4Ppm ?? '—' }}</span>
            <span class="val-unit">ppm</span>
          </div>
          <div class="trend-box" :class="trendClass">
            <svg
              class="trend-icon"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <template v-if="(data?.ch4TrendPercent24h ?? 0) >= 0">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </template>
              <template v-else>
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </template>
            </svg>
            <span>{{ trendText }} 24 Jam</span>
          </div>
        </div>

        <!-- Card 3: Sensor Aktif -->
        <div class="metric-card">
          <span class="metric-label">Sensor Aktif</span>
          <div class="metric-value-box">
            <span class="val-number">{{ data?.activeNodes ?? '—' }}</span>
            <span class="val-slash">/ {{ data?.totalNodes ?? '—' }}</span>
          </div>
          <div class="status-msg success-msg">{{ data?.activeNodePercent ?? '—' }}% Terhubung</div>
        </div>

        <!-- Card 4: Armada Alih -->
        <div class="metric-card">
          <span class="metric-label">Armada Alih</span>
          <div class="metric-value-box">
            <span class="val-number">{{ data?.reroutedTrucks ?? '—' }}</span>
            <span class="val-unit">Truk</span>
          </div>
          <div v-if="(data?.reroutedTrucks ?? 0) > 0" class="status-badge blue-badge">
            Diarahkan ke Sektor {{ data?.alertSector ?? '—' }}
          </div>
          <div v-else class="status-msg success-msg">Semua normal</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { getDashboard } = useApi();

const loading = ref(true);
const data = ref(null);
let pollTimer = null;

const RISK_MAP = {
  danger: { label: 'BAHAYA', cls: 'risk-danger', badge: 'danger-badge' },
  warning: { label: 'WASPADA', cls: 'risk-warning', badge: 'warning-badge' },
  normal: { label: 'NORMAL', cls: 'risk-normal', badge: 'normal-badge' },
};

const riskInfo = computed(() => RISK_MAP[data.value?.riskLevel ?? 'normal'] ?? RISK_MAP.normal);
const riskLabel = computed(() => riskInfo.value.label);
const riskClass = computed(() => riskInfo.value.cls);
const riskBadgeClass = computed(() => `status-badge ${riskInfo.value.badge}`);

const alertText = computed(() => {
  if (data.value?.alertSector) return `Sektor ${data.value.alertSector} Terdeteksi`;
  return 'Semua sektor aman';
});

const trendPct = computed(() => data.value?.ch4TrendPercent24h ?? 0);
const trendText = computed(() =>
  trendPct.value >= 0 ? `+${trendPct.value}%` : `${trendPct.value}%`,
);
const trendClass = computed(() => (trendPct.value > 0 ? 'danger-trend' : 'safe-trend'));

async function fetchData() {
  try {
    const res = await getDashboard();
    data.value = res.data;
  } catch {
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
  pollTimer = setInterval(fetchData, 10000); // refresh every 10s
});

onUnmounted(() => clearInterval(pollTimer));
</script>

<style scoped>
.telemetry-outer-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

.telemetry-wrapper-card {
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1f1f1f;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.section-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #6c6c6c;
  margin-top: 2px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 12px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.metric-label {
  font-size: 11px;
  font-weight: 400;
  color: #6c6c6c;
  line-height: 1;
}

.metric-label sub {
  font-size: 8px;
  vertical-align: sub;
}

.risk-level-val {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.2px;
  line-height: 1.1;
  margin: 2px 0;
}

.risk-danger {
  color: #cb0525;
}
.risk-warning {
  color: #d97706;
}
.risk-normal {
  color: #057602;
}

.metric-value-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 2px 0;
}

.val-number {
  font-size: 24px;
  font-weight: 800;
  color: #1f1f1f;
  line-height: 1;
}

.val-unit {
  font-size: 13px;
  font-weight: 400;
  color: #6c6c6c;
}

.val-slash {
  font-size: 14px;
  font-weight: 400;
  color: #6c6c6c;
}

.status-badge {
  display: inline-block;
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  width: fit-content;
  line-height: 1.2;
}

.danger-badge {
  background: #cb0525;
  color: #ffffff;
}
.warning-badge {
  background: #f59e0b;
  color: #1f1f1f;
}
.normal-badge {
  background: #057602;
  color: #ffffff;
}
.blue-badge {
  background: #0084ff;
  color: #ffffff;
}

.trend-box {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.danger-trend {
  color: #cb0525;
}
.safe-trend {
  color: #057602;
}

.trend-icon {
  flex-shrink: 0;
}

.status-msg {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.success-msg {
  color: #5fbf24;
}

/* Skeleton */
.skeleton-card {
  gap: 6px;
}

.skel {
  background: #f3f4f6;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.skel-label {
  height: 10px;
  width: 60%;
}
.skel-value {
  height: 28px;
  width: 50%;
}
.skel-badge {
  height: 18px;
  width: 80%;
  border-radius: 4px;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
