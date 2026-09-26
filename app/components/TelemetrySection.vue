<template>
  <section class="telemetry-outer-container">
    <div class="telemetry-wrapper-card">
      <div class="section-header">
        <h2 class="section-title">Telemetri Utama</h2>
        <p class="section-subtitle">Ringkasan data metrik operasional</p>
      </div>

      <div class="card-grid">
        <!-- Card 1: Risk Card -->
        <div class="metric-card">
          <span class="metric-label">Tingkat Risiko</span>
          <div class="risk-level-val">BAHAYA</div>
          <div class="status-badge danger-badge">
            Sektor B Tedeteksi
          </div>
        </div>

        <!-- Card 2: Rata-Rata CH4 -->
        <div class="metric-card">
          <span class="metric-label">Rata-Rata CH<sub>4</sub></span>
          <div class="metric-value-box">
            <span class="val-number">840</span>
            <span class="val-unit">ppm</span>
          </div>
          <div class="trend-box danger-trend">
            <svg class="trend-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span>+14% 24 Jam</span>
          </div>
        </div>

        <!-- Card 3: Sensor Aktif -->
        <div class="metric-card">
          <span class="metric-label">Sensor Aktif</span>
          <div class="metric-value-box">
            <span class="val-number">48</span>
            <span class="val-slash">/ 52</span>
          </div>
          <div class="status-msg success-msg">
            92.3% Terhubung
          </div>
        </div>

        <!-- Card 4: Armada Alih -->
        <div class="metric-card">
          <span class="metric-label">Armada Alih</span>
          <div class="metric-value-box">
            <span class="val-number">4</span>
            <span class="val-unit">Truk</span>
          </div>
          <div class="status-badge blue-badge">
            Diarahkan ke Sektor B
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.telemetry-outer-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

.telemetry-wrapper-card {
  background: #FFFFFF;
  border: 1px solid #EBEBEB;
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
  color: #1F1F1F;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.section-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #6C6C6C;
  margin-top: 2px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-card {
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
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
  color: #6C6C6C;
  line-height: 1;
}

.metric-label sub {
  font-size: 8px;
  vertical-align: sub;
}

.risk-level-val {
  font-size: 19px;
  font-weight: 800;
  color: #CB0525;
  letter-spacing: -0.2px;
  line-height: 1.1;
  margin: 2px 0;
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
  color: #1F1F1F;
  line-height: 1;
}

.val-unit {
  font-size: 13px;
  font-weight: 400;
  color: #6C6C6C;
}

.val-slash {
  font-size: 14px;
  font-weight: 400;
  color: #6C6C6C;
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
  background: #CB0525;
  color: #FFFFFF;
}

.blue-badge {
  background: #0084FF;
  color: #FFFFFF;
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
  color: #CB0525;
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
  color: #5FBF24;
}
</style>
