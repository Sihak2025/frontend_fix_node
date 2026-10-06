
<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
  <div class="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
    <header
      class="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center shadow-md shadow-indigo-100">
          <img
            src="https://i.pinimg.com/736x/16/7c/b2/167cb29c12d04c75dbc33ea7638b54f3.jpg"
            alt="App Logo"
            class="w-full h-full object-cover" />
        </div>

        <span class="text-xl font-bold tracking-tight text-slate-900">
          Shop bos anh
        </span>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          to="/login"
          class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
          Login
        </router-link>

        <router-link
          to="/register"
          class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-100 transition-all duration-200">
          Get Started
        </router-link>
      </div>
    </header>
    <main class="flex-grow flex items-center justify-center px-6 py-12">
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          ✨ Welcome to My Shop bus anh
        </span>
        <h1
          class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Shop bus anh
          <span class="text-indigo-600"> Good Shop for you </span>
        </h1>

        <p
          class="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
         Small shop that sell many products. You can buy everything that you need and cost is very cheap
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <router-link
            to="/register"
            class="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-100 transition-all duration-200 text-center">
            Create an Account
          </router-link>

          <router-link
            to="/login"
            class="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm rounded-xl shadow-sm transition-all duration-200 text-center">
            Sign In to Existing Account
          </router-link>
        </div>
      </div>
    </main>
    <footer
      class="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-200 text-center text-sm text-slate-500">
      <p>&copy; 2026 AppName. All rights reserved.</p>
    </footer>
  </div>
</template>

