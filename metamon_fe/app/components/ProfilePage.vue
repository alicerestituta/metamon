<template>
  <div class="profile-page-container">
    <!-- Hero Profile Card (Figma Node 101:1681) -->
    <div class="profile-card hero-card">
      <div class="profile-info-row">
        <!-- Avatar with Verification Badge -->
        <div class="avatar-wrapper">
          <img :src="userProfile.avatar" :alt="userProfile.name" class="avatar-img" />
          <div class="verified-badge" title="Akun Terverifikasi Resmi">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              stroke-width="3.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <!-- Identity Details -->
        <div class="identity-details">
          <h2 class="officer-name">{{ userProfile.name }}</h2>
          <p class="officer-credentials">{{ userProfile.credentials }}</p>
          <p class="officer-nip">NIP. {{ userProfile.nip }}</p>
          <p class="officer-role">{{ userProfile.role }}</p>
        </div>
      </div>

      <!-- Edit Profile Button -->
      <button class="edit-profile-btn" @click="openEditModal">
        <svg
          class="btn-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
        <span>Edit Profil</span>
      </button>
    </div>

    <!-- Telemetry Notification Preferences Card (Figma Node 101:1848) -->
    <div class="profile-card settings-card">
      <h3 class="card-heading">Preferensi Notifikasi Telemetri</h3>

      <div class="settings-list">
        <!-- Toggle 1: Peringatan Metana -->
        <div class="setting-item" @click="toggleSetting('methaneAlert')">
          <div class="setting-text-group">
            <h4 class="setting-title">Peringatan Metana &gt; 1.000 ppm</h4>
            <p class="setting-desc">Getar &amp; push notifikasi prioritas tinggi</p>
          </div>

          <button
            type="button"
            role="switch"
            :aria-checked="notifications.methaneAlert"
            class="switch-control"
            :class="{ 'switch-active': notifications.methaneAlert }"
            @click.stop="toggleSetting('methaneAlert')"
          >
            <span class="switch-knob"></span>
          </button>
        </div>

        <!-- Toggle 2: Laporan Harian Ritase Armada -->
        <div class="setting-item" @click="toggleSetting('dailyReport')">
          <div class="setting-text-group">
            <h4 class="setting-title">Laporan Harian Ritase Armada Masuk</h4>
            <p class="setting-desc">Ringkasan tonase timbunan setiap 18:00 WIB</p>
          </div>

          <button
            type="button"
            role="switch"
            :aria-checked="notifications.dailyReport"
            class="switch-control"
            :class="{ 'switch-active': notifications.dailyReport }"
            @click.stop="toggleSetting('dailyReport')"
          >
            <span class="switch-knob"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Device & Security Card (Figma Node 101:1890) -->
    <div class="profile-card settings-card">
      <h3 class="card-heading">Perangkat &amp; Keamanan Akun</h3>

      <div class="menu-action-list">
        <!-- Button 1: Ganti Kata Sandi & PIN -->
        <button class="action-row-btn" @click="showPasswordModal = true">
          <div class="action-left">
            <!-- Icon Asterisk PIN -->
            <div class="action-icon-box">
              <svg
                width="18"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                stroke="#242424"
                stroke-width="2"
                stroke-linecap="round"
              >
                <!-- Three Password Asterisks with Baseline -->
                <line x1="3" y1="2" x2="3" y2="8"></line>
                <line x1="1" y1="3.5" x2="5" y2="6.5"></line>
                <line x1="1" y1="6.5" x2="5" y2="3.5"></line>

                <line x1="10" y1="2" x2="10" y2="8"></line>
                <line x1="8" y1="3.5" x2="12" y2="6.5"></line>
                <line x1="8" y1="6.5" x2="12" y2="3.5"></line>

                <line x1="17" y1="2" x2="17" y2="8"></line>
                <line x1="15" y1="3.5" x2="19" y2="6.5"></line>
                <line x1="15" y1="6.5" x2="19" y2="3.5"></line>
                <line x1="1" y1="11" x2="19" y2="11"></line>
              </svg>
            </div>
            <span class="action-title">Ganti Kata Sandi &amp; PIN</span>
          </div>

          <svg
            class="chevron-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6C6C6C"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Button 2: Riwayat Masuk & Audit -->
        <button class="action-row-btn" @click="showAuditModal = true">
          <div class="action-left">
            <div class="action-icon-box">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#242424"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <polyline points="12 7 12 12 15 15"></polyline>
              </svg>
            </div>
            <span class="action-title">Riwayat Masuk &amp; Audit</span>
          </div>

          <svg
            class="chevron-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6C6C6C"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Keluar Akun Petugas Button (Figma Node 101:1937) -->
    <button class="logout-action-btn" @click="confirmLogout">
      <svg
        class="logout-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CB0525"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span>Keluar Akun Petugas</span>
    </button>

    <!-- Feedback Toast Notification -->
    <transition name="toast-pop">
      <div v-if="toastMessage" class="toast-feedback">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#057602"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Modal: Edit Profile -->
    <Teleport to="body">
      <div v-if="isEditingProfile" class="modal-backdrop" @click.self="isEditingProfile = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Edit Profil Petugas</h3>
            <button class="modal-close-btn" @click="isEditingProfile = false">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C6C6C"
                stroke-width="2.2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form class="modal-body" @submit.prevent="saveProfile">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input v-model="editForm.name" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Gelar Akademik</label>
              <input v-model="editForm.credentials" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Nomor Induk Pegawai (NIP)</label>
              <input v-model="editForm.nip" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Jabatan &amp; Tanggung Jawab</label>
              <textarea v-model="editForm.role" class="form-textarea" rows="2" required></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="isEditingProfile = false">
                Batal
              </button>
              <button type="submit" class="btn-primary">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Ganti Kata Sandi & PIN -->
    <Teleport to="body">
      <div v-if="showPasswordModal" class="modal-backdrop" @click.self="showPasswordModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Ganti Kata Sandi &amp; PIN</h3>
            <button class="modal-close-btn" @click="showPasswordModal = false">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C6C6C"
                stroke-width="2.2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form class="modal-body" @submit.prevent="saveSecurity">
            <div class="form-group">
              <label class="form-label">Kata Sandi Saat Ini</label>
              <input type="password" placeholder="••••••••" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Kata Sandi Baru</label>
              <input type="password" placeholder="Minimal 8 karakter" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">PIN Cepat (6 Angka)</label>
              <input type="password" maxlength="6" placeholder="Misal: 123456" class="form-input" />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="showPasswordModal = false">
                Batal
              </button>
              <button type="submit" class="btn-primary">Perbarui Keamanan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Riwayat Masuk & Audit -->
    <Teleport to="body">
      <div v-if="showAuditModal" class="modal-backdrop" @click.self="showAuditModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Riwayat Masuk &amp; Audit</h3>
            <button class="modal-close-btn" @click="showAuditModal = false">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C6C6C"
                stroke-width="2.2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body audit-list">
            <div class="audit-item active-session">
              <div class="audit-header">
                <span class="audit-device">Ponsel Lapangan Rugged CAT S62</span>
                <span class="audit-badge-now">Sesi Aktif</span>
              </div>
              <p class="audit-location">Sektor B TPA (Zona Aktif) • IP: 192.168.10.42</p>
              <span class="audit-time">Hari ini, 08:15 WIB</span>
            </div>

            <div class="audit-item">
              <div class="audit-header">
                <span class="audit-device">Desktop Ruang Kontrol SCADA</span>
              </div>
              <p class="audit-location">Kantor Operasional Gedung A • IP: 192.168.1.15</p>
              <span class="audit-time">Kemarin, 16:40 WIB</span>
            </div>

            <div class="audit-item">
              <div class="audit-header">
                <span class="audit-device">Tablet Inspeksi Drone Telemetri</span>
              </div>
              <p class="audit-location">Pos Jaga Gerbang Utama • IP: 192.168.12.88</p>
              <span class="audit-time">25 Sep 2026, 11:20 WIB</span>
            </div>

            <div class="modal-actions" style="margin-top: 14px">
              <button
                type="button"
                class="btn-primary"
                style="width: 100%"
                @click="showAuditModal = false"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const emit = defineEmits(['logout']);

const { user, getMe, updateMe } = useApi();
const toast = useToast();

// Profil dari state global (real-time dari server)
const userProfile = computed(() => ({
  name: user.value?.name ?? '-',
  credentials: user.value?.credentials ?? '-',
  nip: user.value?.nip ?? '-',
  role: user.value?.role ?? '-',
  avatar: user.value?.avatarUrl ?? '/officer_default.jpg',
}));

// Edit Form State — diisi ulang saat modal dibuka
const isEditingProfile = ref(false);
const editForm = reactive({
  name: '',
  credentials: '',
  nip: '',
  role: '',
});

function openEditModal() {
  editForm.name = user.value?.name ?? '';
  editForm.credentials = user.value?.credentials ?? '';
  editForm.nip = user.value?.nip ?? '';
  editForm.role = user.value?.role ?? '';
  isEditingProfile.value = true;
}

// Notification Preferences
const notifications = reactive({
  methaneAlert: user.value?.notifications?.methaneAlert ?? true,
  dailyReport: user.value?.notifications?.dailyReport ?? true,
});

// Sync notifikasi saat user berubah (misal ganti akun)
onMounted(async () => {
  try {
    const res = await getMe();
    if (res?.data?.notifications) {
      notifications.methaneAlert = res.data.notifications.methaneAlert;
      notifications.dailyReport = res.data.notifications.dailyReport;
    }
  } catch {}
});

// Modals State
const showPasswordModal = ref(false);
const showAuditModal = ref(false);
const toastMessage = ref('');

let toastTimer = null;
function showToast(msg) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2500);
}

async function toggleSetting(key) {
  notifications[key] = !notifications[key];
  const status = notifications[key] ? 'diaktifkan' : 'dinonaktifkan';
  const title = key === 'methaneAlert' ? 'Peringatan Metana' : 'Laporan Harian Ritase';
  try {
    await updateMe({ notifications: { methaneAlert: notifications.methaneAlert, dailyReport: notifications.dailyReport } });
    showToast(`${title} berhasil ${status}`);
  } catch {
    // error shown via useApi toast
  }
}

async function saveProfile() {
  try {
    await updateMe({ name: editForm.name, credentials: editForm.credentials, nip: editForm.nip, role: editForm.role });
    // Refresh user state
    const res = await getMe();
    if (res?.data && typeof window !== 'undefined') {
      localStorage.setItem('metamon_user', JSON.stringify(res.data));
    }
    isEditingProfile.value = false;
    showToast('Data profil berhasil diperbarui');
  } catch {
    // error shown via useApi toast
  }
}

function saveSecurity() {
  showPasswordModal.value = false;
  showToast('Kata sandi dan PIN berhasil diperbarui');
}

function confirmLogout() {
  if (confirm('Apakah Anda yakin ingin keluar dari akun petugas?')) {
    emit('logout');
  }
}
</script>

<style scoped>
.profile-page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px 28px 20px;
}

/* Card Styling */
.profile-card {
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

/* Hero Profile Card */
.hero-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-info-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Avatar & Verified Badge */
.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  background: #f0f2f5;
  border: 1px solid #e5e7eb;
}

.verified-badge {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 22px;
  height: 22px;
  background-color: #057602;
  border: 2.5px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

/* Identity Details */
.identity-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.officer-name {
  font-size: 20px;
  font-weight: 700;
  color: #242424;
  line-height: 1.25;
  letter-spacing: -0.3px;
}

.officer-credentials {
  font-size: 13px;
  font-weight: 500;
  color: #6c6c6c;
  line-height: 1.3;
}

.officer-nip {
  font-size: 12px;
  font-weight: 500;
  color: #6c6c6c;
  line-height: 1.3;
  margin-top: 1px;
}

.officer-role {
  font-size: 12px;
  font-weight: 500;
  color: #6c6c6c;
  line-height: 1.35;
  margin-top: 2px;
}

/* Edit Profile Button */
.edit-profile-btn {
  width: 100%;
  height: 38px;
  background-color: #057602;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    transform 0.1s ease;
}

.edit-profile-btn:hover {
  background-color: #046201;
}

.edit-profile-btn:active {
  transform: scale(0.99);
}

.btn-icon {
  flex-shrink: 0;
}

/* Settings & Preference Cards */
.settings-card {
  padding: 16px;
}

.card-heading {
  font-size: 15.5px;
  font-weight: 700;
  color: #242424;
  margin-bottom: 14px;
  letter-spacing: -0.2px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  cursor: pointer;
  user-select: none;
}

.setting-text-group {
  flex: 1;
}

.setting-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #242424;
  line-height: 1.35;
}

.setting-desc {
  font-size: 12px;
  color: #6c6c6c;
  line-height: 1.35;
  margin-top: 2px;
}

/* Custom Switch Control */
.switch-control {
  width: 44px;
  height: 24px;
  background-color: #e2e4e8;
  border: none;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.22s ease;
  padding: 2px;
}

.switch-control.switch-active {
  background-color: #057602;
}

.switch-knob {
  display: block;
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(0);
}

.switch-control.switch-active .switch-knob {
  transform: translateX(20px);
}

/* Action Rows (Perangkat & Keamanan Akun) */
.menu-action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-row-btn {
  width: 100%;
  height: 44px;
  background: #f7f7f8;
  border: 1px solid #f0f0f2;
  border-radius: 10px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.action-row-btn:hover {
  background: #efeff1;
  border-color: #e2e4e8;
}

.action-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-icon-box {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #242424;
}

.chevron-icon {
  flex-shrink: 0;
}

/* Keluar Akun Petugas Button */
.logout-action-btn {
  width: 100%;
  height: 44px;
  background: #f7f7f8;
  border: 1px solid #f0f0f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: #cb0525;
  font-size: 13.5px;
  font-weight: 700;
  transition: all 0.15s ease;
}

.logout-action-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.logout-icon {
  flex-shrink: 0;
}

/* Toast Feedback */
.toast-feedback {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #a7f3d0;
  color: #057602;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 99999;
}

.toast-pop-enter-active,
.toast-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #242424;
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.modal-close-btn:hover {
  background: #f4f4f6;
}

.modal-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #4a4a4a;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d5d9e0;
  border-radius: 8px;
  font-size: 13.5px;
  font-family: inherit;
  color: #1a1d1f;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #057602;
  box-shadow: 0 0 0 3px rgba(5, 118, 2, 0.1);
}

.form-textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.btn-secondary {
  flex: 1;
  height: 38px;
  background: #f4f4f6;
  border: 1px solid #e2e4e8;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #ebecef;
}

.btn-primary {
  flex: 1.5;
  height: 38px;
  background: #057602;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary:hover {
  background: #046201;
}

/* Audit Items */
.audit-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audit-item {
  padding: 12px 14px;
  background: #f9fafb;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.audit-item.active-session {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.audit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.audit-device {
  font-size: 13px;
  font-weight: 700;
  color: #242424;
}

.audit-badge-now {
  font-size: 10.5px;
  font-weight: 700;
  background: #057602;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 12px;
}

.audit-location {
  font-size: 11.5px;
  color: #6c6c6c;
}

.audit-time {
  font-size: 11px;
  color: #8e8e93;
}
</style>
