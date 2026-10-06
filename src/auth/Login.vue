<!-- @format -->

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useAuthStore from '../store/auth.js';

  const authStore = useAuthStore();
  const router = useRouter();

  const login = ref({
    email: '',
    password: '',
  });

  const loading = ref(false);

  const handleLogin = async () => {
    loading.value = true;

    try {
      const result = await authStore.login(
        login.value.email,
        login.value.password,
      );

      if (result) {
        login.value.email = '';
        login.value.password = '';

        router.push(authStore.admin ? '/dashboardadmin' : '/viewpage');
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
    <div
      class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2
        class="text-2xl font-bold text-slate-900 mb-6 text-center tracking-tight">
        Welcome Back
      </h2>
      <div
        v-if="authStore.error"
        class="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium">
        {{ authStore.error }}
      </div>
      <form
        @submit.prevent="handleLogin"
        class="space-y-4">
        <div class="form-group flex flex-col gap-1.5">
          <label
            for="email"
            class="text-sm font-semibold text-slate-700"
            >Email Address</label
          >

          <input
            id="email"
            v-model="login.email"
            type="email"
            placeholder="Enter your email"
            required
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-slate-50 placeholder-slate-400 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />
        </div>
        <div class="form-group flex flex-col gap-1.5">
          <label
            for="password"
            class="text-sm font-semibold text-slate-700"
            >Password</label
          >

          <input
            id="password"
            v-model="login.password"
            type="password"
            placeholder="Enter your password"
            required
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-slate-50 placeholder-slate-400 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-md shadow-indigo-100 transition-all duration-200 cursor-pointer">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Don't have an account?
        <router-link
          to="/register"
          class="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>
