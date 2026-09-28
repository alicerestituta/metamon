<template>
  <div class="sop-page-container">
    <!-- Header Title Banner -->
    <header class="sop-header">
      <div class="header-content">
        <h1 class="page-title">Protokol Tanggap Darurat</h1>
        <p class="page-subtitle">Tahapan mitigasi sebelum mengirim laporan penutupan insiden ke Pusat Data DLH.</p>
      </div>
      <div class="header-status-badge">
        <span class="status-dot-pulse"></span>
        <span class="status-label">Modul Mitigasi Aktif</span>
      </div>
    </header>

    <!-- Main Content Layout (Stack of Cards) -->
    <div class="sop-grid">
      <!-- CARD 1: Checklist Protokol Tanggap Darurat -->
      <section class="sop-card">
        <div class="card-header">
          <div class="title-group">
            <h2 class="card-title">Protokol Tanggap Darurat</h2>
            <p class="card-subtext">Centang setiap langkah yang telah selesai terverifikasi di lapangan</p>
          </div>
          <div class="progress-badge-group">
            <span class="progress-capsule">{{ completedCount }} / {{ tasks.length }} Selesai</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>

        <!-- Task Checklist Items -->
        <div class="task-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            :class="{ completed: task.completed }"
            @click="toggleTask(task)"
          >
            <div class="checkbox-wrapper">
              <input
                type="checkbox"
                :id="'task-' + task.id"
                :checked="task.completed"
                @change.stop="toggleTask(task)"
              />
              <span class="custom-checkbox">
                <svg
                  v-if="task.completed"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            </div>

            <div class="task-content">
              <label
                :for="'task-' + task.id"
                class="task-label"
                :class="{ strikethrough: task.completed }"
              >
                {{ task.title }}
              </label>
            </div>

            <div
              v-if="task.completed"
              class="verified-badge"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#057602"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Terverifikasi {{ task.time || '10:14 WIB' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CARD 2: Log Penanganan -->
      <section class="sop-card">
        <div class="card-header">
          <div class="title-group">
            <h2 class="card-title">Log Penanganan</h2>
            <p class="card-subtext">Penanggung jawab & pengawas lapangan yang bertugas</p>
          </div>
        </div>

        <!-- Officers Grid -->
        <div class="officers-grid">
          <!-- Officer 1 -->
          <div class="officer-card">
            <div class="officer-avatar-wrapper">
              <img
                src="/officer_bambang.png"
                alt="Bambang Suharto Wijaya"
                class="officer-avatar"
              />
            </div>
            <div class="officer-details">
              <span class="role-tag command">Penanggung Jawab Komando</span>
              <h3 class="officer-name">Bambang Suharto Wijaya</h3>
              <span class="officer-nip">NIP: 19840312 200801 1 004</span>
            </div>
          </div>

          <!-- Officer 2 -->
          <div class="officer-card">
            <div class="officer-avatar-wrapper">
              <img
                src="/officer_indra.png"
                alt="Indra Setiawan Nugraha"
                class="officer-avatar"
              />
            </div>
            <div class="officer-details">
              <span class="role-tag supervisor">Pengawas Lapangan</span>
              <h3 class="officer-name">Indra Setiawan Nugraha</h3>
              <span class="officer-nip">NIP: 19900824 201402 1 009</span>
            </div>
          </div>
        </div>

        <!-- Log Notes Textarea -->
        <div class="log-notes-form">
          <label class="notes-label">Catatan penanganan & tindakan mitigasi lapangan</label>
          <textarea
            v-model="logNotes"
            class="notes-textarea"
            rows="3"
            placeholder="Tuliskan perkembangan situasi mitigasi darurat di lapangan..."
          ></textarea>

          <div class="notes-form-footer">
            <span class="char-counter">Karakter tercatat: {{ logNotes.length }}</span>
            <button
              class="save-confirm-btn"
              @click="handleSaveLog"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Simpan & Konfirmasi Penanganan</span>
            </button>
          </div>
        </div>
      </section>

      <!-- CARD 3: Riwayat Insiden Terselesaikan -->
      <section class="sop-card">
        <div class="card-header">
          <div class="title-group">
            <h2 class="card-title">Riwayat Insiden Terselesaikan</h2>
            <p class="card-subtext">Daftar kejadian insiden K3 TPA yang berhasil ditangani</p>
          </div>
          <span class="history-period-badge">24 Jam Terakhir</span>
        </div>

        <div class="history-list">
          <!-- History Item 1 -->
          <div class="history-item">
            <div class="history-item-header">
              <div class="history-title-wrap">
                <span class="history-status-icon">✓</span>
                <h3 class="history-title">Tekanan Balik Pipa Lindi</h3>
              </div>
              <span class="history-time">Hari Ini, 08:30 WIB</span>
            </div>
            <p class="history-desc">Pembersihan sedimentasi kerak & flushing katup primer sektor B.</p>
            <div class="history-footer">
              <span class="resolved-tag">✓ Selesai</span>
              <span class="sector-tag">Sektor B</span>
            </div>
          </div>

          <!-- History Item 2 -->
          <div class="history-item">
            <div class="history-item-header">
              <div class="history-title-wrap">
                <span class="history-status-icon">✓</span>
                <h3 class="history-title">Saturasi Gas Dekat Jalan Masuk</h3>
              </div>
              <span class="history-time">Kemarin, 14:15 WIB</span>
            </div>
            <p class="history-desc">Aerasi portabel & penutupan membrane geomembrane tambahan sektor B.</p>
            <div class="history-footer">
              <span class="resolved-tag">✓ Selesai</span>
              <span class="sector-tag">Sektor B</span>
            </div>
          </div>
        </div>

        <!-- Archive Button -->
        <div class="archive-btn-wrapper">
          <button
            class="archive-btn"
            @click="handleOpenArchive"
          >
            <span>Buka Arsip Lengkap Insiden K3 TPA</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#057602"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              ></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const tasks = ref([
  {
    id: 1,
    title: 'Sterilisasi Perimeter Zona Merah (Radius 50m)',
    completed: true,
    time: '10:14 WIB',
  },
  {
    id: 2,
    title: 'Pengalihan Lalu Lintas Truk ke Sektor C',
    completed: true,
    time: '10:18 WIB',
  },
  {
    id: 3,
    title: 'Eksekusi Aerasi Sampah (Pengerukan Ekskavator)',
    completed: false,
    time: '',
  },
  {
    id: 4,
    title: 'Injeksi Air Pendingin ke Pipa Sensor',
    completed: false,
    time: '',
  },
]);

const logNotes = ref('Tim damkar standby di radius 100m. Pembacaan metana mulai melandai dari puncak 1.620 ppm.');

const completedCount = computed(() => tasks.value.filter((t) => t.completed).length);
const progressPercentage = computed(() => Math.round((completedCount.value / tasks.value.length) * 100));

function toggleTask(task) {
  task.completed = !task.completed;
  if (task.completed && !task.time) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    task.time = `${hh}:${mm} WIB`;
  }
}

function handleSaveLog() {
  alert('Log penanganan & catatan mitigasi berhasil disimpan dan diteruskan ke Pusat Data DLH.');
}

function handleOpenArchive() {
  alert('Membuka Arsip Lengkap Insiden K3 TPA.');
}
</script>

<style scoped>
.sop-page-container {
  padding: 16px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

/* Header Banner */
.sop-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.status-label {
  font-size: 11px;
  font-weight: 700;
  color: #057602;
  background: #e6f4e6;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.status-dot-pulse {
  width: 6px;
  height: 6px;
  background: #057602;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(5, 118, 2, 0.4);
  animation: pulse-ring 1.8s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(5, 118, 2, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(5, 118, 2, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(5, 118, 2, 0);
  }
}

/* Grid Stack */
.sop-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Shared Card Styling */
.sop-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 3px 0;
}

.card-subtext {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Progress Capsule */
.progress-capsule {
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #057602;
  border-radius: 10px;
  transition: width 0.3s ease;
}

/* Task Checklist */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.15s ease;
}

.task-item:hover {
  background: #f4f4f6;
  border-color: #e5e7eb;
}

.task-item.completed {
  background: #f9fbf9;
  border-color: #e2ece2;
}

.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-wrapper input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.task-item.completed .custom-checkbox {
  background: #057602;
  border-color: #057602;
}

.task-content {
  flex: 1;
}

.task-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #1f2937;
  cursor: pointer;
}

.task-label.strikethrough {
  text-decoration: line-through;
  color: #6b7280;
  font-weight: 600;
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #057602;
  background: #e6f4e6;
  padding: 3px 8px;
  border-radius: 6px;
}

/* Officers Grid */
.officers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.officer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
}

.officer-avatar-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.officer-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.officer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.role-tag.command {
  background: #e6f4e6;
  color: #057602;
}

.role-tag.supervisor {
  background: #f3f4f6;
  color: #4b5563;
}

.officer-name {
  font-size: 13.5px;
  font-weight: 800;
  color: #111827;
  margin: 2px 0 0 0;
}

.officer-nip {
  font-size: 10.5px;
  color: #6b7280;
}

/* Log Notes Form */
.log-notes-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.notes-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #374151;
}

.notes-textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: #1f2937;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.notes-textarea:focus {
  border-color: #057602;
  box-shadow: 0 0 0 3px rgba(5, 118, 2, 0.1);
}

.notes-form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.char-counter {
  font-size: 11.5px;
  color: #6b7280;
  font-weight: 600;
}

.save-confirm-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #057602;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.1s ease;
  box-shadow: 0 2px 6px rgba(5, 118, 2, 0.25);
}

.save-confirm-btn:hover {
  background: #046201;
  transform: translateY(-1px);
}

.save-confirm-btn:active {
  transform: translateY(0);
}

/* History Card */
.history-period-badge {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.history-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-status-icon {
  width: 18px;
  height: 18px;
  background: #dcfce7;
  color: #15803d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
}

.history-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.history-time {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
}

.history-desc {
  font-size: 12px;
  color: #4b5563;
  margin: 0;
  line-height: 1.4;
  padding-left: 26px;
}

.history-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 26px;
}

.resolved-tag {
  font-size: 10.5px;
  font-weight: 800;
  color: #057602;
  background: #e6f4e6;
  padding: 2px 7px;
  border-radius: 4px;
}

.sector-tag {
  font-size: 10.5px;
  font-weight: 700;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 7px;
  border-radius: 4px;
}

.archive-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.archive-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border: 1.5px solid #057602;
  color: #057602;
  border-radius: 20px;
  padding: 9px 18px;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}

.archive-btn:hover {
  background: #e6f4e6;
}

@media (max-width: 640px) {
  .sop-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .notes-form-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .save-confirm-btn {
    justify-content: center;
  }
}
</style>
