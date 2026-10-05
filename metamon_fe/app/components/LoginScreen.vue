<template>
  <div class="login-fullscreen">
    <div class="login-card">
      <!-- Logo / Brand -->
      <div class="brand-area">
        <img
          src="/logo.png"
          alt="Metamon Logo"
          style="width: 48px; height: 48px; object-fit: contain; flex-shrink: 0"
        />
        <div>
          <h1 class="brand-name">Metamon</h1>
          <p class="brand-sub">TPA Bantar Gebang — Sistem Telemetri Gas Metana</p>
        </div>
      </div>

      <!-- Form -->
      <form class="login-form" @submit.prevent="doLogin">
        <h2 class="form-title">Masuk ke Dashboard</h2>

        <div class="field-group">
          <label class="field-label">NIP Petugas</label>
          <input
            v-model="nip"
            type="text"
            class="field-input"
            placeholder="Contoh: 19880415 201201 2 004"
            autocomplete="username"
            required
          />
        </div>

        <div class="field-group">
          <label class="field-label">Kata Sandi</label>
          <div class="pw-wrapper">
            <input
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              class="field-input"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
              required
            />
            <button type="button" class="pw-toggle" @click="showPw = !showPw">
              <svg
                v-if="!showPw"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C6C6C"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C6C6C"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="error-banner">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ errorMsg }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">Masuk</span>
          <span v-else class="spinner"></span>
        </button>

        <p class="hint-text">
          Demo: NIP <strong>19880415 201201 2 004</strong> / Sandi: <strong>admin123</strong>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const { login } = useApi();

const nip = ref('');
const password = ref('');
const showPw = ref(false);
const loading = ref(false);
const errorMsg = ref('');

async function doLogin() {
  errorMsg.value = '';
  loading.value = true;
  try {
    await login(nip.value, password.value);
    emit('login-success');
  } catch (e) {
    errorMsg.value = e?.message ?? 'Login gagal. Periksa NIP dan kata sandi.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-fullscreen {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d1117 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 28px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

/* .brand-icon removed - using img directly */

.brand-name {
  font-size: 22px;
  font-weight: 900;
  color: #1f1f1f;
  letter-spacing: -0.5px;
  line-height: 1;
}

.brand-sub {
  font-size: 11px;
  color: #6c6c6c;
  margin-top: 3px;
}

.form-title {
  font-size: 18px;
  font-weight: 800;
  color: #1f1f1f;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: #1f1f1f;
}

.field-input {
  width: 100%;
  height: 44px;
  border: 1.5px solid #e4e4e7;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  color: #1f1f1f;
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.field-input:focus {
  border-color: #cb0525;
  background: #ffffff;
}

.pw-wrapper {
  position: relative;
}

.pw-wrapper .field-input {
  padding-right: 44px;
}

.pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  height: 48px;
  background: #cb0525;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(203, 5, 37, 0.35);
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  background: #a8041e;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(203, 5, 37, 0.45);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hint-text {
  font-size: 11px;
  color: #6c6c6c;
  text-align: center;
  line-height: 1.5;
}
</style>
