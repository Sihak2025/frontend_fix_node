

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import use from '../store/auth.js';

  const authStore = use();
  const router = useRouter();

  const register = ref({
    name: '',
    email: '',
    password: '',
  });

  const loading = ref(false);

  const handleRegister = async () => {
    loading.value = true;
    try {
      const result = await authStore.register(
        register.value.name,
        register.value.email,
        register.value.password,
      );

      if (result) {
        // Clear form
        register.value.name = '';
        register.value.email = '';
        register.value.password = '';

        // Go to login page
        router.push('/login');
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
        Create an Account
      </h2>

      <!-- Error -->
      <div
        v-if="authStore.error"
        class="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium">
        {{ authStore.error }}
      </div>

      <form
        @submit.prevent="handleRegister"
        class="space-y-4">
        <!-- Name -->
        <div class="form-group flex flex-col gap-1.5">
          <label
            for="name"
            class="text-sm font-semibold text-slate-700"
            >Full Name</label
          >

          <input
            id="name"
            v-model="register.name"
            type="text"
            placeholder="Enter your name"
            required
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-slate-50 placeholder-slate-400 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />
        </div>

        <!-- Email -->
        <div class="form-group flex flex-col gap-1.5">
          <label
            for="email"
            class="text-sm font-semibold text-slate-700"
            >Email Address</label
          >

          <input
            id="email"
            v-model="register.email"
            type="email"
            placeholder="Enter your email"
            required
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-slate-50 placeholder-slate-400 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />
        </div>

        <!-- Password -->
        <div class="form-group flex flex-col gap-1.5">
          <label
            for="password"
            class="text-sm font-semibold text-slate-700"
            >Password</label
          >

          <input
            id="password"
            v-model="register.password"
            type="password"
            placeholder="Create a password"
            required
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-slate-50 placeholder-slate-400 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-md shadow-indigo-100 transition-all duration-200 cursor-pointer">
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Already have an account?
        <router-link
          to="/login"
          class="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
          Login here
        </router-link>
      </p>
    </div>
  </div>
</template>
