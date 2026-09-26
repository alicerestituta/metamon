<template>
  <section class="methane-chart-section">
    <!-- Single Unified Card Container (Figma Node 74:1211) -->
    <div class="methane-card">
      <!-- Header Row Inside Card -->
      <div class="chart-header">
        <h2 class="section-title">Konsentrasi CH<sub class="sub-4">4</sub> Hari Ini</h2>
        <div class="current-metric">
          <span class="metric-num">1.428</span>
          <span class="metric-unit">ppm</span>
        </div>
      </div>

      <!-- Inner Gray Chart Area (Figma Node 74:1208) -->
      <div class="chart-canvas-area">
        <svg class="chart-svg" viewBox="0 0 320 165" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ch4RedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#CB0525" stop-opacity="0.35" />
              <stop offset="60%" stop-color="#CB0525" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#CB0525" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="ch4GreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#057602" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#057602" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Dotted Gray Baseline -->
          <line x1="15" y1="95" x2="305" y2="95" stroke="#9CA3AF" stroke-width="1.2" stroke-dasharray="3 3" />

          <!-- Red Dashed Threshold Line (Batas Bahaya 1.000ppm) -->
          <line x1="15" y1="52" x2="305" y2="52" stroke="#CB0525" stroke-width="1.5" stroke-dasharray="3 3" />
          <text x="160" y="45" fill="#CB0525" font-size="9" font-weight="700" text-anchor="middle">Batas Bahaya (1.000ppm)</text>

          <!-- Fill under Green Curve -->
          <path 
            d="M 25,95 L 55,88 L 85,102 L 115,82 L 145,70 L 175,74 L 235,45 L 235,135 L 25,135 Z" 
            fill="url(#ch4GreenGradient)" 
          />

          <!-- Fill under Red Danger Curve -->
          <path 
            d="M 235,45 L 255,30 L 295,20 L 295,135 L 235,135 Z" 
            fill="url(#ch4RedGradient)" 
          />

          <!-- Green Curve Path (below 1.000 ppm threshold) -->
          <path 
            d="M 25,95 L 55,88 L 85,102 L 115,82 L 145,70 L 175,74 L 235,45" 
            fill="none" 
            stroke="#057602" 
            stroke-width="3" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />

          <!-- Bold Red Curve Path (above 1.000 ppm threshold) -->
          <path 
            d="M 235,45 L 255,30 L 295,20" 
            fill="none" 
            stroke="#CB0525" 
            stroke-width="3.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />

          <!-- X-Axis Labels -->
          <text x="25" y="150" fill="#6C6C6C" font-size="9.5" font-weight="600" text-anchor="middle">02:00</text>
          <text x="95" y="150" fill="#6C6C6C" font-size="9.5" font-weight="600" text-anchor="middle">05:00</text>
          <text x="165" y="150" fill="#6C6C6C" font-size="9.5" font-weight="600" text-anchor="middle">08:00</text>
          <text x="235" y="150" fill="#6C6C6C" font-size="9.5" font-weight="600" text-anchor="middle">11:00</text>
          <text x="295" y="150" fill="#CB0525" font-size="10" font-weight="800" text-anchor="middle">14:00</text>
        </svg>
      </div>

      <!-- Action Buttons Row (Figma Nodes 77:1501 & 77:1506) -->
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
defineEmits(['open-logs', 'open-protocol'])
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
  gap: 16px;
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

.sub-4 {
  font-size: 11px;
  bottom: -0.1em;
}

.current-metric {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-num {
  font-size: 19px;
  font-weight: 900;
  color: #CB0525;
}

.metric-unit {
  font-size: 12px;
  color: #6B7280;
  font-weight: 600;
}

.chart-canvas-area {
  background: #F8F7F4;
  border-radius: 12px;
  padding: 12px 6px;
  border: 1px solid #F3F4F6;
}

.chart-svg {
  width: 100%;
  height: 155px;
  overflow: visible;
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
