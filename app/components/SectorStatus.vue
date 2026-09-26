<template>
  <section class="sector-status-outer-container">
    <div class="sector-status-wrapper-card">
      <div class="section-header">
        <h2 class="section-title">Status Sektor TPA</h2>
        <span class="update-label">Update: 2 mnt lalu</span>
      </div>

      <div class="sector-item-list">
        <div 
          v-for="item in sectors" 
          :key="item.id" 
          class="sector-row-item"
        >
          <div class="item-left-content">
            <div class="badge-square" :class="item.badgeType">
              {{ item.id }}
            </div>
            <div class="sector-text-details">
              <h3 class="sector-name">{{ item.name }}</h3>
              <p class="sector-metric-line">Kapasitas Buang: {{ item.capacity }}</p>
              <p class="sector-metric-line">CH<sub>4</sub>: {{ item.ch4 }}</p>
            </div>
          </div>

          <div class="status-pill-badge" :class="item.badgeType">
            {{ item.statusText }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const sectors = [
  {
    id: 'A',
    name: 'Sektor A',
    capacity: '42%',
    ch4: '190 ppm',
    statusText: 'Status: Aman',
    badgeType: 'green'
  },
  {
    id: 'B',
    name: 'Sektor B',
    capacity: '100%',
    ch4: '1.490 ppm',
    statusText: 'Status: Terkunci',
    badgeType: 'red'
  },
  {
    id: 'C',
    name: 'Sektor C',
    capacity: '60%',
    ch4: '910 ppm',
    statusText: 'Status: Waspada',
    badgeType: 'yellow'
  },
  {
    id: 'D',
    name: 'Sektor D',
    capacity: '68%',
    ch4: '800 ppm',
    statusText: 'Status: Waspada',
    badgeType: 'yellow'
  }
]
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
  height: 78px;
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

.badge-square.green { background: #057602; color: #FFFFFF; }
.badge-square.red { background: #CB0525; color: #FFFFFF; }
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

.status-pill-badge.green { background: #057602; color: #FFFFFF; }
.status-pill-badge.red { background: #CB0525; color: #FFFFFF; }
.status-pill-badge.yellow { background: #F59E0B; color: #1F1F1F; }
</style>
