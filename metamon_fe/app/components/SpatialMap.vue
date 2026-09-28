<template>
  <section class="spatial-map-outer-container">
    <div class="spatial-map-wrapper-card">
      <!-- Header Row (Figma Node 74:1175) -->
      <div class="map-header">
        <div class="header-titles">
          <h2 class="section-title">Peta Spasial Real-Time</h2>
          <p class="section-subtitle">Monitoring sebaran gas</p>
        </div>

        <button class="fullscreen-btn" title="Layar Penuh" @click="toggleFullscreen">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1F1F1F"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
      </div>

      <!-- Sector Filter Chips -->
      <div class="filter-chips-row">
        <button
          v-for="chip in chips"
          :key="chip.id"
          :class="['chip-item', { active: activeFilter === chip.id }]"
          @click="activeFilter = chip.id"
        >
          {{ chip.name }}
        </button>
      </div>

      <!-- Map Viewport Frame -->
      <div class="map-viewport-card" :class="{ 'is-fullscreen': isFullscreen }">
        <div v-if="isFullscreen" class="close-fullscreen-badge" @click="toggleFullscreen">
          &times; Tutup Peta
        </div>

        <div class="map-inner-canvas">
          <img src="/tpa_satellite_map.png" alt="Satellite Map TPA" class="map-bg-img" />

          <!-- Top-Left Floating Legend -->
          <div class="floating-legend">
            <div class="legend-dot-item"><span class="dot green-dot"></span> Aman</div>
            <div class="legend-dot-item"><span class="dot yellow-dot"></span> Waspada</div>
            <div class="legend-dot-item"><span class="dot red-dot"></span> Bahaya</div>
          </div>

          <!-- SVG Heatmap & Sector Boundaries -->
          <svg class="svg-map-layer" viewBox="0 0 320 310" preserveAspectRatio="none">
            <defs>
              <radialGradient id="redGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#CB0525" stop-opacity="0.85" />
                <stop offset="60%" stop-color="#CB0525" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#CB0525" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="yellowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.75" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="greenGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#5FBF24" stop-opacity="0.65" />
                <stop offset="100%" stop-color="#5FBF24" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- Heatmap Radials -->
            <ellipse
              v-if="showSector('B')"
              cx="220"
              cy="155"
              rx="80"
              ry="65"
              fill="url(#redGradient)"
            />
            <ellipse
              v-if="showSector('C')"
              cx="80"
              cy="150"
              rx="60"
              ry="55"
              fill="url(#yellowGradient)"
            />
            <ellipse
              v-if="showSector('D')"
              cx="150"
              cy="255"
              rx="75"
              ry="40"
              fill="url(#yellowGradient)"
            />
            <ellipse
              v-if="showSector('A')"
              cx="225"
              cy="65"
              rx="65"
              ry="45"
              fill="url(#greenGradient)"
            />

            <!-- Polygons -->
            <!-- Sektor A (Top Right) -->
            <polygon
              v-if="showSector('A')"
              points="160,15 305,25 295,100 155,90"
              class="sector-polygon sector-a"
              :class="{ highlighted: activeFilter === 'A' }"
              @click="activeFilter = 'A'"
            />

            <!-- Sektor B (Center Red) -->
            <polygon
              v-if="showSector('B')"
              points="155,98 310,108 300,210 145,195"
              class="sector-polygon sector-b"
              :class="{ highlighted: activeFilter === 'B' }"
              @click="activeFilter = 'B'"
            />

            <!-- Sektor C (Left Yellow) -->
            <polygon
              v-if="showSector('C')"
              points="15,105 148,95 138,200 10,195"
              class="sector-polygon sector-c"
              :class="{ highlighted: activeFilter === 'C' }"
              @click="activeFilter = 'C'"
            />

            <!-- Sektor D (Bottom Yellow) -->
            <polygon
              v-if="showSector('D')"
              points="10,205 295,218 285,298 5,290"
              class="sector-polygon sector-d"
              :class="{ highlighted: activeFilter === 'D' }"
              @click="activeFilter = 'D'"
            />

            <!-- Sector Badges -->
            <g
              v-if="showSector('A')"
              transform="translate(225, 55)"
              class="sector-badge-group"
              @click="activeFilter = 'A'"
            >
              <rect x="-38" y="-12" width="76" height="24" rx="5" fill="rgba(5, 118, 2, 0.9)" />
              <text text-anchor="middle" y="-1" fill="#FFF" font-size="9.5" font-weight="800">
                Sektor A
              </text>
              <text text-anchor="middle" y="8" fill="#E2F7D9" font-size="7.5" font-weight="600">
                Aman (190 ppm)
              </text>
            </g>

            <g
              v-if="showSector('B')"
              transform="translate(220, 155)"
              class="sector-badge-group"
              @click="activeFilter = 'B'"
            >
              <rect x="-48" y="-13" width="96" height="25" rx="5" fill="rgba(203, 5, 37, 0.92)" />
              <text text-anchor="middle" y="-1" fill="#FFF" font-size="9.5" font-weight="900">
                Sektor B
              </text>
              <text text-anchor="middle" y="8" fill="#FFD0D0" font-size="7.5" font-weight="700">
                Bahaya (1.490 ppm)
              </text>
            </g>

            <g
              v-if="showSector('C')"
              transform="translate(75, 150)"
              class="sector-badge-group"
              @click="activeFilter = 'C'"
            >
              <rect x="-42" y="-12" width="84" height="24" rx="5" fill="rgba(217, 119, 6, 0.92)" />
              <text text-anchor="middle" y="-1" fill="#FFF" font-size="9.5" font-weight="800">
                Sektor C
              </text>
              <text text-anchor="middle" y="8" fill="#FFFBEB" font-size="7.5" font-weight="600">
                Waspada (910 ppm)
              </text>
            </g>

            <g
              v-if="showSector('D')"
              transform="translate(150, 255)"
              class="sector-badge-group"
              @click="activeFilter = 'D'"
            >
              <rect x="-42" y="-12" width="84" height="24" rx="5" fill="rgba(217, 119, 6, 0.92)" />
              <text text-anchor="middle" y="-1" fill="#FFF" font-size="9.5" font-weight="800">
                Sektor D
              </text>
              <text text-anchor="middle" y="8" fill="#FFFBEB" font-size="7.5" font-weight="600">
                Waspada (800 ppm)
              </text>
            </g>

            <!-- Sensor Pins -->
            <g v-if="showSector('B')">
              <circle
                cx="215"
                cy="130"
                r="4.5"
                fill="#CB0525"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
              <circle
                cx="185"
                cy="145"
                r="4.5"
                fill="#CB0525"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
              <circle
                cx="260"
                cy="155"
                r="4.5"
                fill="#CB0525"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
              <circle
                cx="170"
                cy="125"
                r="4.5"
                fill="#CB0525"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
            </g>

            <g v-if="showSector('C')">
              <circle cx="70" cy="125" r="4.5" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.5" />
              <circle cx="45" cy="170" r="4.5" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.5" />
              <circle
                cx="115"
                cy="160"
                r="4.5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
            </g>

            <g v-if="showSector('D')">
              <circle cx="65" cy="245" r="4.5" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.5" />
              <circle
                cx="190"
                cy="265"
                r="4.5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
              <circle
                cx="240"
                cy="250"
                r="4.5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                stroke-width="1.5"
              />
            </g>

            <g v-if="showSector('A')">
              <circle cx="195" cy="45" r="4.5" fill="#5FBF24" stroke="#FFFFFF" stroke-width="1.5" />
              <circle cx="265" cy="55" r="4.5" fill="#5FBF24" stroke="#FFFFFF" stroke-width="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const isFullscreen = ref(false);
const activeFilter = ref('all');

const chips = [
  { id: 'all', name: 'Semua' },
  { id: 'A', name: 'Sektor A' },
  { id: 'B', name: 'Sektor B' },
  { id: 'C', name: 'Sektor C' },
  { id: 'D', name: 'Sektor D' },
];

function showSector(sectorId) {
  if (activeFilter.value === 'all') return true;
  return activeFilter.value === sectorId;
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}
</script>

<style scoped>
.spatial-map-outer-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

.spatial-map-wrapper-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

/* Header Row (Figma Node 74:1175) */
.map-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1f1f1f;
  line-height: 1.2;
  letter-spacing: -0.3px;
  margin: 0;
}

.section-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #6c6c6c;
  margin: 0;
}

.fullscreen-btn {
  width: 32px;
  height: 32px;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.fullscreen-btn:hover {
  background: #e5e7eb;
}

.filter-chips-row {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 12px;
}
.filter-chips-row::-webkit-scrollbar {
  display: none;
}

.chip-item {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chip-item.active {
  background: #057602;
  color: #ffffff;
  border-color: #057602;
  box-shadow: 0 2px 6px rgba(5, 118, 2, 0.25);
}

.fullscreen-btn {
  width: 32px;
  height: 32px;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.fullscreen-btn:hover {
  background: #e5e7eb;
}

/* Map Viewport Frame */
.map-viewport-card {
  position: relative;
  background: #000000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.map-viewport-card.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  border-radius: 0;
}

.close-fullscreen-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  z-index: 25;
}

.map-inner-canvas {
  position: relative;
  width: 100%;
  height: 310px;
}

.map-bg-img {
  width: 135%;
  height: 135%;
  margin-top: -16%;
  margin-left: -5%;
  object-fit: cover;
  object-position: left center;
  display: block;
}

/* Legend Floating Box */
.floating-legend {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #1f1f1f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.legend-dot-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.green-dot {
  background: #057602;
}
.yellow-dot {
  background: #f59e0b;
}
.red-dot {
  background: #cb0525;
}

.svg-map-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

/* SVG Sector Polygons */
.sector-polygon {
  cursor: pointer;
  transition: all 0.2s ease;
}

.sector-polygon.sector-a {
  fill: rgba(95, 191, 36, 0.25);
  stroke: #5fbf24;
  stroke-width: 1.8;
}
.sector-polygon.sector-b {
  fill: rgba(203, 5, 37, 0.35);
  stroke: #cb0525;
  stroke-width: 2.2;
}
.sector-polygon.sector-c {
  fill: rgba(245, 158, 11, 0.25);
  stroke: #f59e0b;
  stroke-width: 1.8;
}
.sector-polygon.sector-d {
  fill: rgba(245, 158, 11, 0.25);
  stroke: #f59e0b;
  stroke-width: 1.8;
}

.sector-polygon:hover,
.sector-polygon.highlighted {
  filter: brightness(1.2);
  stroke-width: 3px;
}

.sector-badge-group {
  cursor: pointer;
}

.sector-badge-group:hover {
  transform: scale(1.05);
}
</style>
