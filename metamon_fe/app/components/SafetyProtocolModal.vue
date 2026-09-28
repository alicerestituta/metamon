<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-left">
          <span class="icon red">🚨</span>
          <div>
            <h3 class="modal-title">Prosedur Keselamatan (SOP)</h3>
            <p class="modal-sub">Mitigasi Kebakaran & Gas Metana TPA</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="sop-list">
          <div class="sop-step active-alert">
            <div class="step-num danger">1</div>
            <div class="step-content">
              <h4>Aktivasi Gas Venting & Methane Flare</h4>
              <p>
                Segera aktifkan katup pembuangan gas otomatis pada Sektor B untuk mengurangi tekanan
                konsentrasi metana (>40%).
              </p>
            </div>
          </div>

          <div class="sop-step">
            <div class="step-num warning">2</div>
            <div class="step-content">
              <h4>Pembatasan Akses Sektor B</h4>
              <p>
                Isolasi area radius 200 meter dari Sektor B. Petugas lapangan wajib mengenakan
                respirator gas metana.
              </p>
            </div>
          </div>

          <div class="sop-step">
            <div class="step-num info">3</div>
            <div class="step-content">
              <h4>Penimbunan Tanah Penutup (Soil Capping)</h4>
              <p>
                Siapkan armada bulldozer untuk pemadatan tanah penutup apabila suhu lokasi melebihi
                60°C.
              </p>
            </div>
          </div>

          <div class="sop-step">
            <div class="step-num primary">4</div>
            <div class="step-content">
              <h4>Notifikasi Tim Pemadam Kebakaran & BPBD</h4>
              <p>
                Hubungi Posko Tanggap Darurat BPBD Kab. Bandung Barat jika konsentrasi gas bertahan
                tinggi selama 2 jam.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-emergency" @click="triggerAlert">🚨 Broadcast Peringatan Dini</button>
        <button class="btn-close" @click="$emit('close')">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);

function triggerAlert() {
  alert('Peringatan Dini (Alert Broadcast) telah dikirimkan ke Tim Operasional TPA & Damkar.');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--color-danger-border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 440px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-glow-red);
  overflow: hidden;
}

.modal-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(203, 5, 37, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
}

.modal-sub {
  font-size: 10px;
  color: var(--text-muted);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.sop-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sop-step {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-radius: var(--radius-md);
  background: #121216;
  border: 1px solid var(--border-color);
}

.sop-step.active-alert {
  border-color: var(--color-danger-border);
  background: rgba(203, 5, 37, 0.08);
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 12px;
  flex-shrink: 0;
}

.step-num.danger {
  background: var(--color-danger);
  color: #fff;
}
.step-num.warning {
  background: var(--color-warning);
  color: #000;
}
.step-num.info {
  background: #3b82f6;
  color: #fff;
}
.step-num.primary {
  background: var(--color-brand);
  color: #fff;
}

.step-content h4 {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
}

.step-content p {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

.modal-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn-emergency {
  background: var(--color-danger);
  border: none;
  color: #fff;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.btn-close {
  background: var(--bg-card-hover);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>
