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

      <!-- Red Alert Sub-Card -->
      <div class="hero-alert-bar">
        <div class="alert-left">
          <div class="alert-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="alert-text">
            <span class="alert-title">BAHAYA SEKTOR B</span>
            <span class="alert-desc">CH4 melampaui batas ambang</span>
          </div>
        </div>

        <button class="action-followup-btn" @click="$emit('open-protocol')">
          Tindak Lanjuti
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['open-protocol'])

const isSpinning = ref(false)

function refreshData() {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 600)
}
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

.refresh-circle-btn:hover {
  background: #F4F4F5;
}

.spin {
  animation: spin 0.6s linear;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* Hero Alert Bar */
.hero-alert-bar {
  background: #D91E36;
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-icon-box {
  display: flex;
  align-items: center;
}

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

.action-followup-btn:hover {
  transform: scale(1.03);
}
</style>
