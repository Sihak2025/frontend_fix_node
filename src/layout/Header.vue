

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useAuthStore from '../store/auth.js';

  const authStore = useAuthStore();
  const router = useRouter();

  const searchQuery = ref('');
  const cartItemCount = ref(3);
  const unreadNotificationsCount = ref(2);
  const showNotifications = ref(false);
  const showMobileMenu = ref(false);
  const showMobileSearch = ref(false);

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/viewpage',
        query: {
          q: searchQuery.value.trim(),
        },
      });
      showMobileSearch.value = false;
    }
  };

  const handleLogout = () => {
    authStore.logout();
    router.push('/');
  };
</script>

<template>
  <header
    class="w-full bg-white border-b border-slate-200 sticky top-0 z-50 font-sans shadow-xs">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4 sm:gap-6">
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle menu">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <router-link
          to="/viewpage"
          class="flex items-center gap-2.5 flex-shrink-0 group">
          <div
            class="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
            <img
              src="https://i.pinimg.com/736x/16/7c/b2/167cb29c12d04c75dbc33ea7638b54f3.jpg"
              alt="App Logo"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <span
            class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Shop Anh
          </span>
        </router-link>

        <router-link
          v-if="authStore.admin"
          to="/dashboardAdmin"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors">
          Admin Management
        </router-link>
      </div>
      <div class="flex-1 max-w-md hidden md:block">
        <form
          @submit.prevent="handleSearch"
          class="relative">
          <label
            for="search"
            class="sr-only"
            >Search</label
          >
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-slate-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products, orders..."
            id="search"
            class="block w-full py-2.5 pl-10 pr-20 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" />
          <button
            type="submit"
            class="absolute end-1.5 top-1.5 bottom-1.5 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-xs px-3.5 transition-colors cursor-pointer">
            Search
          </button>
        </form>
      </div>
      <div class="flex items-center gap-1 sm:gap-3">
        <button
          @click="showMobileSearch = !showMobileSearch"
          class="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Search">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
        </button>
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
            title="Notifications">
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span
              v-if="unreadNotificationsCount > 0"
              class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {{ unreadNotificationsCount }}
            </span>
          </button>
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 z-50">
            <div
              class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 class="font-bold text-slate-800 text-sm">Notifications</h4>
              <span class="text-xs text-indigo-600 font-semibold cursor-pointer"
                >Mark all as read</span
              >
            </div>
            <div class="py-3 space-y-2 text-xs text-slate-600">
              <div
                class="p-2 hover:bg-slate-50 rounded-xl transition cursor-pointer">
                <p class="font-semibold text-slate-800">New order shipped!</p>
                <p class="text-slate-500">Your package is on the way.</p>
              </div>
              <div
                class="p-2 hover:bg-slate-50 rounded-xl transition cursor-pointer">
                <p class="font-semibold text-slate-800">Special Discount 50%</p>
                <p class="text-slate-500">Check out our latest collection.</p>
              </div>
            </div>
          </div>
        </div>
        <router-link
          to="/shoppinghistory"
          class="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors relative"
          title="View Cart / Purchases">
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span
            v-if="cartItemCount > 0"
            class="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {{ cartItemCount }}
          </span>
        </router-link>
        <button
          @click="handleLogout"
          class="hidden sm:inline-flex px-3 py-2 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
          Logout
        </button>
      </div>
    </div>
    <div
      v-if="showMobileSearch"
      class="md:hidden px-4 pb-3 border-t border-slate-100 bg-slate-50 pt-3">
      <form
        @submit.prevent="handleSearch"
        class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products, orders..."
          class="block w-full py-2.5 pl-4 pr-20 bg-white border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        <button
          type="submit"
          class="absolute end-1.5 top-1.5 bottom-1.5 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-xs px-3.5">
          Search
        </button>
      </form>
    </div>
    <div
      v-if="showMobileMenu"
      class="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-md">
      <router-link
        v-if="authStore.admin"
        to="/sidebarAdmin"
        @click="showMobileMenu = false"
        class="block px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg text-center">
        Admin Management
      </router-link>
      <button
        @click="
          handleLogout();
          showMobileMenu = false;
        "
        class="w-full text-center px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg cursor-pointer">
        Logout
      </button>
    </div>
  </header>
</template>
