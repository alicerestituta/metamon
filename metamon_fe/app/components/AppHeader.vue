<template>
  <header class="app-header">
    <div class="brand-container" style="cursor: pointer" @click="emit('go-home')">
      <div class="brand-logo-icon">
        <img
          src="/logo.png"
          alt="Metamon Logo"
          style="width: 40px; height: 40px; object-fit: contain"
        />
      </div>
      <span class="brand-name">Metamon</span>
    </div>

    <button class="menu-toggle-btn" aria-label="Menu" @click.prevent.stop="onToggle">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1A1D1F"
        stroke-width="2.2"
        stroke-linecap="round"
      >
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </svg>
    </button>
  </header>
</template>

<script setup>
const emit = defineEmits(['toggle-sidebar', 'go-home']);

function onToggle() {
  emit('toggle-sidebar');
}
</script>

<style scoped>
.app-header {
  height: 60px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo-icon {
  display: flex;
  align-items: center;
  width: 40px;
  height: 40px;
}

.brand-name {
  font-size: 21px;
  font-weight: 700;
  color: #057602;
  letter-spacing: -0.4px;
}

.menu-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-right: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.menu-toggle-btn:hover {
  background: #f4f4f6;
}
</style>
