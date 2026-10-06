<!-- @format -->

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import SidebarAdmin from '../layout/SidebarAdmin.vue';
  import { getAllDashboard } from '../service/dashboardService.js';

  const isSidebarOpen = ref(false);
  const isLoading = ref(true);
  const error = ref('');

  const dashboard = ref({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      totalCustomers: 0,
      revenueChange: 0,
      orderChange: 0,
      customerChange: 0,
    },
    recentOrders: [],
    topProducts: [],
    monthlySales: [],
  });

  const stats = computed(() => [
    {
      title: 'Total Revenue',
      value: `$${Number(dashboard.value.stats.totalRevenue || 0).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )}`,
      change: Number(dashboard.value.stats.revenueChange || 0),
      icon: '💵',
      iconBg: 'bg-emerald-50',
    },
    {
      title: 'Total Orders',
      value: Number(dashboard.value.stats.totalOrders || 0).toLocaleString(),
      change: Number(dashboard.value.stats.orderChange || 0),
      icon: '📦',
      iconBg: 'bg-blue-50',
    },
    {
      title: 'Average Order Value',
      value: `$${Number(
        dashboard.value.stats.averageOrderValue || 0,
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: 0,
      icon: '🏷️',
      iconBg: 'bg-violet-50',
    },
    {
      title: 'Total Customers',
      value: Number(dashboard.value.stats.totalCustomers || 0).toLocaleString(),
      change: Number(dashboard.value.stats.customerChange || 0),
      icon: '👥',
      iconBg: 'bg-orange-50',
    },
  ]);

  const fetchDashboard = async () => {
    try {
      isLoading.value = true;
      error.value = '';

      const response = await getAllDashboard();
      if (response?.success && response?.data) {
        dashboard.value = {
          ...response.data,
          monthlySales: response.data.monthlySales || [],
        };
      } else {
        throw new Error(
          response?.message || response?.error || 'Failed to load dashboard',
        );
      }
    } catch (err) {
      console.error('Dashboard error:', err);

      error.value =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load dashboard';
    } finally {
      isLoading.value = false;
    }
  };

  const formatMoney = (value) => {
    return `$${Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getChangeClass = (change) => {
    if (change > 0) {
      return 'bg-emerald-50 text-emerald-600';
    }

    if (change < 0) {
      return 'bg-red-50 text-red-600';
    }

    return 'bg-gray-100 text-gray-500';
  };

  const getStatusClass = (status) => {
    const value = String(status || '').toLowerCase();

    if (value === 'delivered' || value === 'completed' || value === 'paid') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }

    if (value === 'processing' || value === 'pending') {
      return 'bg-blue-50 text-blue-700 border-blue-100';
    }

    if (value === 'shipped' || value === 'shipping') {
      return 'bg-amber-50 text-amber-700 border-amber-100';
    }

    if (value === 'cancelled' || value === 'canceled') {
      return 'bg-red-50 text-red-700 border-red-100';
    }

    return 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const maxRevenue = computed(() => {
    const values =
      dashboard.value.monthlySales?.map((item) => Number(item.revenue || 0)) ||
      [];

    return Math.max(...values, 1);
  });

  const chartHeight = (revenue) => {
    const value = Number(revenue || 0);

    return `${Math.max((value / maxRevenue.value) * 100, 5)}%`;
  };

  onMounted(() => {
    fetchDashboard();
  });
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
    <SidebarAdmin
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false" />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <div
          class="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                Overview
              </p>

              <h1
                class="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard
              </h1>

              <p class="mt-1 text-sm text-slate-500">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>

            <button
              @click="fetchDashboard"
              :disabled="isLoading"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              <svg
                class="h-4 w-4"
                :class="{ 'animate-spin': isLoading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>

              {{ isLoading ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <div class="space-y-6 p-4 sm:p-6 lg:p-8">
          <div
            v-if="error"
            class="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                ⚠️
              </div>

              <div>
                <p class="font-semibold">Unable to load dashboard</p>

                <p class="text-sm">
                  {{ error }}
                </p>
              </div>
            </div>

            <button
              @click="fetchDashboard"
              class="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
              Retry
            </button>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
              v-for="stat in stats"
              :key="stat.title"
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div
                class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-slate-50 transition group-hover:scale-150"></div>

              <div class="relative flex items-start justify-between">
                <div>
                  <p
                    class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {{ stat.title }}
                  </p>

                  <h2
                    v-if="!isLoading"
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {{ stat.value }}
                  </h2>
                  <div
                    v-else
                    class="mt-3 h-8 w-28 animate-pulse rounded-lg bg-slate-200"></div>

                  <div
                    v-if="!isLoading"
                    class="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="getChangeClass(stat.change)">
                    <svg
                      v-if="stat.change > 0"
                      class="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>

                    <svg
                      v-else-if="stat.change < 0"
                      class="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>

                    <span>
                      {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
                    </span>

                    <span class="font-normal opacity-70"> vs last month </span>
                  </div>
                </div>
                <div
                  class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  :class="stat.iconBg">
                  {{ stat.icon }}
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div
              class="xl:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div
                class="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <h3 class="font-bold text-slate-900">Sales & Revenue</h3>

                  <p class="mt-1 text-xs text-slate-400">
                    Monthly performance overview
                  </p>
                </div>

                <span
                  class="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                  2026
                </span>
              </div>

              <div class="p-5 sm:p-6">
                <div
                  v-if="!isLoading && dashboard.monthlySales.length"
                  class="flex h-64 items-end gap-2 sm:gap-4">
                  <div
                    v-for="item in dashboard.monthlySales"
                    :key="item.month"
                    class="group flex h-full flex-1 flex-col items-center justify-end">
                    <div
                      class="mb-2 hidden rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                      {{ formatMoney(item.revenue) }}
                    </div>
                    <div
                      class="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-500 hover:from-indigo-700 hover:to-violet-500"
                      :style="{
                        height: chartHeight(item.revenue),
                      }"></div>

                    <span
                      class="mt-3 text-[10px] font-medium text-slate-400 sm:text-xs">
                      {{ item.month }}
                    </span>
                  </div>
                </div>
                <div
                  v-else-if="isLoading"
                  class="flex h-64 items-end gap-3">
                  <div
                    v-for="n in 12"
                    :key="n"
                    class="flex-1 animate-pulse rounded-t-lg bg-slate-100"
                    :style="{
                      height: `${20 + (n % 5) * 12}%`,
                    }"></div>
                </div>
                <div
                  v-else
                  class="flex h-64 flex-col items-center justify-center text-center">
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    📊
                  </div>

                  <p class="mt-3 font-semibold text-slate-700">No sales data</p>

                  <p class="mt-1 text-xs text-slate-400">
                    Sales data will appear here.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div
                class="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                <div>
                  <h3 class="font-bold text-slate-900">Top Products</h3>

                  <p class="mt-1 text-xs text-slate-400">
                    Best selling products
                  </p>
                </div>

                <button
                  class="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  View All
                </button>
              </div>

              <div class="divide-y divide-slate-100">
                <div
                  v-for="(product, index) in dashboard.topProducts"
                  :key="product.id || product.name"
                  class="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                    :class="
                      index === 0
                        ? 'bg-amber-100 text-amber-700'
                        : index === 1
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-orange-50 text-orange-600'
                    ">
                    {{ index + 1 }}
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-800">
                      {{ product.name }}
                    </p>

                    <p class="mt-0.5 text-xs text-slate-400">
                      {{ product.category || 'Uncategorized' }}
                    </p>

                    <p class="mt-1 text-xs font-medium text-emerald-600">
                      {{ product.sales }} units sold
                    </p>
                  </div>

                  <p class="text-sm font-bold text-slate-800">
                    {{ formatMoney(product.revenue) }}
                  </p>
                </div>

                <div
                  v-if="!isLoading && !dashboard.topProducts.length"
                  class="px-5 py-12 text-center">
                  <div class="text-3xl">📦</div>

                  <p class="mt-2 text-sm font-semibold text-slate-700">
                    No products yet
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              class="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h3 class="font-bold text-slate-900">Recent Orders</h3>

                <p class="mt-1 text-xs text-slate-400">
                  Latest customer orders
                </p>
              </div>

              <button
                class="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50">
                View All Orders →
              </button>
            </div>
            <div class="space-y-3 p-4 md:hidden">
              <div
                v-for="order in dashboard.recentOrders"
                :key="order.id"
                class="rounded-xl border border-slate-100 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-indigo-600">
                      {{ order.id }}
                    </p>

                    <p class="mt-1 text-sm font-semibold text-slate-800">
                      {{ order.customer }}
                    </p>

                    <p class="text-xs text-slate-400">
                      {{ order.email }}
                    </p>
                  </div>

                  <span
                    class="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                    :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <div
                  class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <p class="max-w-[60%] truncate text-xs text-slate-500">
                    {{ order.product }}
                  </p>

                  <p class="font-bold text-slate-800">
                    {{ formatMoney(order.total) }}
                  </p>
                </div>

                <p class="mt-2 text-[11px] text-slate-400">
                  {{ formatDate(order.date) }}
                </p>
              </div>

              <div
                v-if="!isLoading && !dashboard.recentOrders.length"
                class="py-12 text-center">
                <div class="text-3xl">🛒</div>

                <p class="mt-2 text-sm font-semibold text-slate-700">
                  No recent orders
                </p>
              </div>
            </div>
            <div class="hidden overflow-x-auto md:block">
              <table class="w-full min-w-[800px]">
                <thead>
                  <tr
                    class="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th class="px-6 py-4">Order</th>

                    <th class="px-6 py-4">Customer</th>

                    <th class="px-6 py-4">Product</th>

                    <th class="px-6 py-4">Total</th>

                    <th class="px-6 py-4">Status</th>

                    <th class="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="order in dashboard.recentOrders"
                    :key="order.id"
                    class="transition hover:bg-slate-50/70">
                    <td class="px-6 py-4">
                      <span class="font-semibold text-indigo-600">
                        {{ order.id }}
                      </span>
                    </td>

                    <td class="px-6 py-4">
                      <p class="font-semibold text-slate-800">
                        {{ order.customer }}
                      </p>

                      <p class="mt-0.5 text-xs text-slate-400">
                        {{ order.email }}
                      </p>
                    </td>

                    <td class="max-w-[260px] px-6 py-4">
                      <p class="truncate text-sm text-slate-600">
                        {{ order.product }}
                      </p>
                    </td>

                    <td class="px-6 py-4">
                      <span class="font-bold text-slate-800">
                        {{ formatMoney(order.total) }}
                      </span>
                    </td>

                    <td class="px-6 py-4">
                      <span
                        class="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                        :class="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>

                    <td class="px-6 py-4 text-sm text-slate-500">
                      {{ formatDate(order.date) }}
                    </td>
                  </tr>

                  <tr v-if="!isLoading && !dashboard.recentOrders.length">
                    <td
                      colspan="6"
                      class="py-16 text-center">
                      <div class="text-3xl">🛒</div>

                      <p class="mt-2 font-semibold text-slate-700">
                        No recent orders
                      </p>

                      <p class="mt-1 text-xs text-slate-400">
                        New orders will appear here.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="flex flex-col gap-2 pb-4 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>Dashboard Overview</p>

            <p>Data updated automatically from your store</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
