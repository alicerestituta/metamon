<template>
  <div class="sidebar-backdrop" @click.self="$emit('close')">
    <aside class="sidebar-drawer">
      <!-- Top Brand Header -->
      <div class="sidebar-header">
        <div class="brand-group">
          <div class="brand-logo-icon">
            <svg width="20" height="14" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 13 C 0 6 5 0 12 0 C 16 0 19 3 19 7 C 19 10 16 13 12 13 Z" fill="#057602" />
            </svg>
          </div>
          <span class="brand-title">Metamon</span>
        </div>

        <button class="close-sidebar-btn" @click="$emit('close')" aria-label="Tutup Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6C6C6C" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <!-- Item 1: Dashboard Pemantauan -->
          <li 
            class="nav-item" 
            :class="{ active: activeView === 'dashboard' }"
            @click="handleNav('dashboard')"
          >
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="activeView === 'dashboard' ? '#057602' : '#6C6C6C'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span class="nav-text">Dashboard Pemantauan</span>
          </li>

          <!-- Item 2: Telemetri Sensor -->
          <li 
            class="nav-item" 
            :class="{ active: activeView === 'telemetry' || activeView === 'sensor-log' }"
            @click="handleNav('telemetry')"
          >
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="(activeView === 'telemetry' || activeView === 'sensor-log') ? '#057602' : '#6C6C6C'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
            <span class="nav-text">Telemetri Sensor</span>
          </li>

          <!-- Item 3: Pengalihan Rute -->
          <li 
            class="nav-item" 
            :class="{ active: activeView === 'reroute' }"
            @click="handleNav('reroute')"
          >
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="activeView === 'reroute' ? '#057602' : '#6C6C6C'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="19" r="3"></circle>
              <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
              <polyline points="12 2 15 5 12 8"></polyline>
            </svg>
            <span class="nav-text">Pengalihan Rute</span>
          </li>

          <!-- Item 4: Protokol SOP -->
          <li 
            class="nav-item" 
            :class="{ active: activeView === 'sop' }"
            @click="handleNav('sop')"
          >
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="activeView === 'sop' ? '#057602' : '#6C6C6C'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <span class="nav-text">Protokol SOP</span>
          </li>

          <!-- Item 5: Profil Petugas (Figma Node 101:1989) -->
          <li 
            class="nav-item" 
            :class="{ active: activeView === 'profile' }"
            @click="handleNav('profile')"
          >
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="activeView === 'profile' ? '#057602' : '#6C6C6C'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="nav-text">Profil &amp; Pengaturan</span>
          </li>
        </ul>
      </nav>

      <!-- Bottom Actions Footer -->
      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CB0525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Keluar Akun Petugas</span>
        </button>

        <button class="user-avatar-btn" title="Profil Petugas" @click="handleNav('profile')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
const props = defineProps({
  activeView: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['close', 'navigate', 'open-sop'])

function handleNav(type) {
  emit('navigate', type)
  emit('close')
}

function handleLogout() {
  alert('Anda telah keluar dari akun petugas.')
  emit('close')
}
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999999;
  display: flex;
}

.sidebar-drawer {
  width: 280px;
  max-width: 85vw;
  height: 100vh;
  background: #FFFFFF;
  border-right: 1px solid #EBEBEB;
  display: flex;
  flex-direction: column;
  box-shadow: 6px 0 30px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1000000;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Header */
.sidebar-header {
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid #EBEBEB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo-icon {
  display: flex;
  align-items: center;
}

.brand-title {
  font-size: 21px;
  font-weight: 700;
  color: #057602;
  letter-spacing: -0.4px;
}

.close-sidebar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-sidebar-btn:hover {
  background: #F4F4F6;
}

/* Navigation List */
.sidebar-nav {
  flex: 1;
  padding: 14px 12px;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  height: 46px;
  padding: 0 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: #F4F4F6;
}

.nav-item.active {
  background: #E6F4E6;
}

.nav-text {
  font-size: 14px;
  font-weight: 600;
  color: #4A4A4A;
}

.nav-item.active .nav-text {
  color: #057602;
  font-weight: 800;
}

.nav-icon {
  flex-shrink: 0;
}

/* Footer */
.sidebar-footer {
  height: 65px;
  padding: 12px 14px;
  border-top: 1px solid #EBEBEB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  background: #FFFFFF;
}

.logout-btn {
  flex: 1;
  height: 40px;
  background: #F7F7F8;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #CB0525;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.logout-btn:hover {
  background: #FEE2E2;
}

.user-avatar-btn {
  width: 40px;
  height: 40px;
  background: #057602;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.user-avatar-btn:hover {
  background: #046201;
}
</style>
