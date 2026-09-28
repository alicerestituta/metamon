<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-left">
          <span class="icon">📋</span>
          <div>
            <h3 class="modal-title">Log Telemetri Sensor</h3>
            <p class="modal-sub">24 Telemetry Node Log Stream</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="log-stream">
          <div v-for="(log, idx) in logs" :key="idx" class="log-entry" :class="log.type">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-node">[{{ log.node }}]</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-export" @click="downloadLogs">Export Log (.CSV)</button>
        <button class="btn-close" @click="$emit('close')">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['close']);

const logs = ref([
  {
    time: '21:56:40',
    node: 'NODE-08',
    message: 'Konsentrasi CH4 melebihi ambang batas: 45.2%',
    type: 'danger',
  },
  { time: '21:55:12', node: 'NODE-08', message: 'Suhu permukaan naik ke 52°C', type: 'warning' },
  {
    time: '21:50:00',
    node: 'NODE-03',
    message: 'Telemetri normal: CH4 18%, Temp 38°C',
    type: 'info',
  },
  { time: '21:45:30', node: 'NODE-12', message: 'Kalibrasi rutin selesai', type: 'info' },
  {
    time: '21:40:15',
    node: 'SYSTEM',
    message: 'Sinkronisasi 24 Node Sensor berhasil',
    type: 'success',
  },
  {
    time: '21:30:00',
    node: 'NODE-08',
    message: 'Hotspot terdeteksi pada koordinat (-6.892, 107.412)',
    type: 'danger',
  },
]);

function downloadLogs() {
  alert('Export file log telemetri berhasil diunduh.');
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
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 440px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.modal-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 14px;
  overflow-y: auto;
  flex: 1;
}

.log-stream {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: monospace;
  font-size: 11px;
}

.log-entry {
  padding: 8px;
  border-radius: var(--radius-sm);
  background: #121215;
  border-left: 3px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.log-entry.danger {
  border-left-color: var(--color-danger);
  color: #ffaaaa;
}
.log-entry.warning {
  border-left-color: var(--color-warning);
  color: #ffe088;
}
.log-entry.success {
  border-left-color: var(--color-success);
  color: #b3ff88;
}
.log-entry.info {
  border-left-color: #3b82f6;
  color: var(--text-main);
}

.log-time {
  color: var(--text-muted);
}
.log-node {
  font-weight: bold;
}

.modal-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-export {
  background: var(--bg-card-hover);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-close {
  background: var(--color-brand);
  border: none;
  color: #fff;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>
