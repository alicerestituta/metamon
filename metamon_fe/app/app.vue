<template>
  <div class="app-viewport">
    <NuxtRouteAnnouncer />
    <!-- Global Toast Notifications -->
    <AppToast />

    <!-- Loading saat validasi token awal -->
    <div v-if="!appReady" class="app-init-loader">
      <span class="init-spinner"></span>
    </div>

    <!-- Login Screen -->
    <LoginScreen v-else-if="!isLoggedIn" @login-success="onLoginSuccess" />

    <template v-else>
      <!-- Top Header (Logo click returns to Dashboard) -->
      <AppHeader @toggle-sidebar="showSidebar = true" @go-home="currentView = 'dashboard'" />

      <!-- Navigation View Switcher -->
      <main class="app-main-content">
        <!-- Dashboard View -->
        <template v-if="currentView === 'dashboard'">
          <!-- Hero Status Banner -->
          <QuickInfo @open-protocol="currentView = 'sop'" />

          <!-- Main Telemetry Cards (2x2 Grid) -->
          <TelemetrySection />

          <!-- Spatial Map with Heatmap Overlay & Sector Filters -->
          <SpatialMap />

          <!-- Sector Breakdown Status List -->
          <SectorStatus />

          <!-- Methane Gas Time Series Chart & Action Buttons -->
          <MethaneChart
            @open-logs="currentView = 'sensor-log'"
            @open-protocol="currentView = 'sop'"
          />
        </template>

        <!-- Sensor Log / Telemetry Page View -->
        <template v-else-if="currentView === 'sensor-log'">
          <div class="view-header-bar">
            <button class="back-btn" @click="currentView = 'dashboard'">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1F1F1F"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
          <SensorLogPage />
        </template>

        <!-- Protokol SOP Page View -->
        <template v-else-if="currentView === 'sop'">
          <div class="view-header-bar">
            <button class="back-btn" @click="currentView = 'dashboard'">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1F1F1F"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
          <SopProtocolPage />
        </template>

        <!-- Pengalihan Rute Page View -->
        <template v-else-if="currentView === 'reroute'">
          <div class="view-header-bar">
            <button class="back-btn" @click="currentView = 'dashboard'">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1F1F1F"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
          <ReroutePage />
        </template>

        <!-- Profil Petugas View -->
        <template v-else-if="currentView === 'profile'">
          <div class="view-header-bar">
            <button class="back-btn" @click="currentView = 'dashboard'">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1F1F1F"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
          <ProfilePage @logout="handleLogout" />
        </template>
      </main>

      <!-- Sidebar Drawer - Teleported to Body -->
      <Teleport to="body">
        <transition name="slide-fade">
          <SidebarMenu
            v-if="showSidebar"
            :active-view="currentView"
            @close="showSidebar = false"
            @navigate="handleNavigation"
            @open-sop="currentView = 'sop'"
          />
        </transition>
      </Teleport>

      <!-- Modals -->
      <SensorLogModal v-if="showLogsModal" @close="showLogsModal = false" />

      <SafetyProtocolModal v-if="showProtocolModal" @close="showProtocolModal = false" />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import QuickInfo from './components/QuickInfo.vue';
import TelemetrySection from './components/TelemetrySection.vue';
import SpatialMap from './components/SpatialMap.vue';
import SectorStatus from './components/SectorStatus.vue';
import MethaneChart from './components/MethaneChart.vue';
import SensorLogPage from './components/SensorLogPage.vue';
import SopProtocolPage from './components/SopProtocolPage.vue';
import ReroutePage from './components/ReroutePage.vue';
import ProfilePage from './components/ProfilePage.vue';
import SensorLogModal from './components/SensorLogModal.vue';
import SafetyProtocolModal from './components/SafetyProtocolModal.vue';
import LoginScreen from './components/LoginScreen.vue';

const { isLoggedIn, token, user, logout, getMe } = useApi();

const currentView = ref('dashboard');
const showSidebar = ref(false);
const showLogsModal = ref(false);
const showProtocolModal = ref(false);

// Validasi token secara diam-diam saat pertama load
const appReady = ref(false);
onMounted(async () => {
  if (token.value) {
    try {
      // Ambil data terbaru dari server dan update user state
      const res = await getMe({ silent: true });
      if (res?.data) {
        user.value = res.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('metamon_user', JSON.stringify(res.data));
        }
      }
    } catch {
      // Token tidak valid — hapus sesi tanpa toast
      token.value = null;
      user.value = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('metamon_token');
        localStorage.removeItem('metamon_user');
      }
    }
  }
  appReady.value = true;
});

async function onLoginSuccess() {
  // Seed historical data in background so chart has data immediately
  try {
    const api = useApi();
    await api.seedTodayHistory?.();
  } catch {}
}

async function handleLogout() {
  await logout();
  currentView.value = 'dashboard';
}

function handleNavigation(viewName) {
  if (viewName === 'telemetry') {
    currentView.value = 'sensor-log';
  } else if (viewName === 'dashboard') {
    currentView.value = 'dashboard';
  } else if (viewName === 'sop') {
    currentView.value = 'sop';
  } else if (viewName === 'reroute') {
    currentView.value = 'reroute';
  } else if (viewName === 'profile') {
    currentView.value = 'profile';
  }
  showSidebar.value = false;
}
</script>

<style scoped>
.app-init-loader {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1117;
}

.init-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(203, 5, 37, 0.2);
  border-top-color: #cb0525;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.app-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.view-header-bar {
  padding: 12px 16px 0 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #1f1f1f;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.back-btn:hover {
  background: #f4f4f6;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
