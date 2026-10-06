
<script setup>
  import { ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import useAuthStore from '../store/auth';

  defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['close']);

  const router = useRouter();
  const fileInput = ref(null);
  const previewImage = ref(null);

  const selectImage = () => {
    fileInput.value.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    previewImage.value = URL.createObjectURL(file);
  };

  const authStore = useAuthStore();
  const handleLogout = () => {
    authStore.logout();
    router.push('/');
  };
</script>

<template>
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"></div>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-800 p-4 select-none shrink-0 text-slate-200 transition-transform duration-300 ease-in-out md:static md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]">
    <div
      class="flex items-center gap-3 px-3 py-4 mb-2 bg-slate-800/50 rounded-2xl border border-slate-800/80">
      <div
        @click="selectImage"
        class="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 font-bold text-lg hover:opacity-90">
        <img
          v-if="previewImage"
          :src="previewImage"
          alt="Profile"
          class="h-full w-full object-cover" />
        <span v-else>
          {{
            authStore.user?.name
              ? authStore.user.name.charAt(0).toUpperCase()
              : 'U'
          }}
        </span>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageChange" />
      </div>
      <div class="overflow-hidden">
        <h2
          class="text-sm font-semibold text-slate-100 tracking-tight truncate">
          {{ authStore.user?.name || 'User Name' }}
        </h2>
        <p class="text-[11px] text-slate-400 font-medium truncate">
          {{ authStore.user?.email || 'user@example.com' }}
        </p>
      </div>
    </div>
    <div class="space-y-1.5 flex-1 overflow-y-auto pr-1">
      <router-link
        @click="$emit('close')"
        to="/dashboardadmin"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
          </svg>
        </span>
        <span>Dashboard</span>
      </router-link>

      <router-link
        @click="$emit('close')"
        to="/orderlist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
        </span>
        <span>Orders</span>
        <span
          class="ml-auto rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          24
        </span>
      </router-link>

      <router-link
        @click="$emit('close')"
        to="/productlist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3.3 7.5L12 12.5l8.7-5M12 22V12.5" />
          </svg>
        </span>
        <span>Products</span>
      </router-link>

      <router-link
        @click="$emit('close')"
        to="/stockproductlist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 2l10 5-10 5L2 7l10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </span>
        <span>Inventory</span>
        <span
          class="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          5
        </span>
      </router-link>
      <router-link
        @click="$emit('close')"
        to="/productvariantlist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="w-6 h-6 text-gray-600 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm4.996 2a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM11 8a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Zm-4.004 3a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM11 11a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Zm-4.004 3a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM11 14a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <span>Product Variant</span>
      </router-link>
      <router-link
        @click="$emit('close')"
        to="/categorylist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-[.router-link-active]:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z" />
          </svg>
        </span>
        <span>Category</span>
      </router-link>

      <router-link
        @click="$emit('close')"
        to="/customer"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.9M9 20H2v-2a4 4 0 014-4h3m8-6a3 3 0 11-6 0 3 3 0 016 0zM7 10a3 3 0 106 0 3 3 0 00-6 0z" />
          </svg>
        </span>
        <span>Customer</span>
      </router-link>

      <router-link
        @click="$emit('close')"
        to="/paymentmethodlist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 10h18M7 15h3" />
          </svg>
        </span>
        <span>Payment Method</span>
      </router-link>

      <router-link
        @click="$emit('close')"
        to="/userlist"
        class="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-indigo-400"
        active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-600/30 hover:!bg-indigo-600">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.9M9 20H2v-2a4 4 0 014-4h3m8-6a3 3 0 11-6 0 3 3 0 016 0zM7 10a3 3 0 106 0 3 3 0 00-6 0z" />
          </svg>
        </span>
        <span>User</span>
      </router-link>

      <button
        @click="handleLogout"
        class="w-full h-10 mt-3 bg-slate-800 text-sm font-semibold text-slate-200 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer flex items-center justify-center">
        Logout
      </button>
    </div>
    <div class="pt-4 mt-auto border-t border-slate-800">
      <router-link
        @click="$emit('close')"
        to="/viewpage"
        class="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30">
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
          <circle
            cx="12"
            cy="12"
            r="3" />
        </svg>
        <span>View Shop</span>
      </router-link>
    </div>
  </aside>
</template>
