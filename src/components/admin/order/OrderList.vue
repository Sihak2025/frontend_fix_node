
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { getAllOrder } from '../../../service/orderService';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const isSidebarOpen = ref(false);

  const orders = ref([]);
  const loading = ref(true);
  const error = ref('');
  const search = ref('');
  const statusFilter = ref('all');

  const fetchOrders = async () => {
    try {
      loading.value = true;
      error.value = '';

      const response = await getAllOrder();

      console.log('ORDER RESPONSE:', response);

      const result = response?.data || response;

      if (result?.success) {
        orders.value = result.data || [];
      } else if (Array.isArray(result)) {
        orders.value = result;
      } else {
        orders.value = [];
      }
    } catch (err) {
      console.error('Get orders error:', err);

      error.value =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load orders';
    } finally {
      loading.value = false;
    }
  };

  const filteredOrders = computed(() => {
    return orders.value.filter((order) => {
      const keyword = search.value.toLowerCase().trim();

      const orderId = String(order.orderNumber || order.id || '').toLowerCase();

      const customerName = String(
        order.user?.name || order.customer?.name || '',
      ).toLowerCase();

      const customerEmail = String(
        order.user?.email || order.customer?.email || '',
      ).toLowerCase();

      const matchesSearch =
        !keyword ||
        orderId.includes(keyword) ||
        customerName.includes(keyword) ||
        customerEmail.includes(keyword);

      const status = String(order.status || '').toLowerCase();

      const matchesStatus =
        statusFilter.value === 'all' ||
        status === statusFilter.value.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  });
  const totalOrders = computed(() => orders.value.length);

  const pendingOrders = computed(() => {
    return orders.value.filter((order) => {
      const status = String(order.status || '').toLowerCase();

      return status === 'pending' || status === 'processing';
    }).length;
  });

  const completedOrders = computed(() => {
    return orders.value.filter((order) => {
      const status = String(order.status || '').toLowerCase();

      return status === 'completed' || status === 'delivered';
    }).length;
  });

  const cancelledOrders = computed(() => {
    return orders.value.filter((order) => {
      const status = String(order.status || '').toLowerCase();

      return status === 'cancelled' || status === 'canceled';
    }).length;
  });
  const getOrderId = (order) => {
    if (order.orderNumber) {
      return order.orderNumber;
    }

    if (order.id) {
      return `#ORD-${String(order.id).slice(0, 8).toUpperCase()}`;
    }

    return '#ORD-UNKNOWN';
  };

  const getCustomerName = (order) => {
    return order.user?.name || order.customer?.name || 'Unknown Customer';
  };

  const getCustomerEmail = (order) => {
    return order.user?.email || order.customer?.email || '-';
  };

  const getItems = (order) => {
    if (Array.isArray(order.order_item)) {
      return order.order_item;
    }

    if (Array.isArray(order.items)) {
      return order.items;
    }

    return [];
  };

  const getItemsCount = (order) => {
    return getItems(order).reduce(
      (total, item) => total + Number(item.quantity || 1),
      0,
    );
  };

  const getFirstProduct = (order) => {
    const items = getItems(order);

    return items[0]?.product || items[0]?.Product || null;
  };

  const getProductName = (order) => {
    const product = getFirstProduct(order);

    return product?.name || 'Multiple Products';
  };

  const getProductImage = (order) => {
    const product = getFirstProduct(order);

    return product?.image || '';
  };

  const getTotal = (order) => {
    return Number(
      order.totalAmout || order.totalAmount || order.total || order.amount || 0,
    );
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

  const formatTime = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status) => {
    const value = String(status || '').toLowerCase();

    if (value === 'completed' || value === 'delivered') {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    }

    if (value === 'pending' || value === 'processing') {
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    }

    if (value === 'shipped' || value === 'shipping') {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    }

    if (value === 'cancelled' || value === 'canceled') {
      return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
      };
    }

    return {
      badge: 'bg-slate-50 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
    };
  };

  const statusCount = (status) => {
    if (status === 'all') {
      return orders.value.length;
    }

    return orders.value.filter(
      (order) => String(order.status || '').toLowerCase() === status,
    ).length;
  };

  onMounted(() => {
    fetchOrders();
  });
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-800">
    <SidebarAdmin
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false" />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <div class="border-b border-slate-200 bg-white">
          <div class="px-5 py-6 sm:px-7 lg:px-8">
            <div
              class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div
                  class="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>Dashboard</span>

                  <span>/</span>

                  <span class="text-indigo-600"> Orders </span>
                </div>

                <h1
                  class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Order Management
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                  View, manage and track customer orders.
                </p>
              </div>

              <div class="flex items-center gap-3">
                <button
                  @click="fetchOrders"
                  :disabled="loading"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50">
                  <svg
                    class="h-4 w-4"
                    :class="{
                      'animate-spin': loading,
                    }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>

                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6 p-5 sm:p-7 lg:p-8">

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div
                class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-50 transition group-hover:scale-125"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Orders
                  </p>

                  <h2 class="mt-2 text-3xl font-bold text-slate-900">
                    {{ totalOrders }}
                  </h2>

                  <p class="mt-1 text-xs text-slate-400">All orders</p>
                </div>

                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  📦
                </div>
              </div>
            </div>
            <div
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div
                class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition group-hover:scale-125"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pending
                  </p>

                  <h2 class="mt-2 text-3xl font-bold text-blue-600">
                    {{ pendingOrders }}
                  </h2>

                  <p class="mt-1 text-xs text-slate-400">Need attention</p>
                </div>

                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  ⏳
                </div>
              </div>
            </div>
            <div
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div
                class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 transition group-hover:scale-125"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Completed
                  </p>

                  <h2 class="mt-2 text-3xl font-bold text-emerald-600">
                    {{ completedOrders }}
                  </h2>

                  <p class="mt-1 text-xs text-slate-400">
                    Successfully delivered
                  </p>
                </div>

                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  ✓
                </div>
              </div>
            </div>
            <div
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div
                class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-50 transition group-hover:scale-125"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cancelled
                  </p>

                  <h2 class="mt-2 text-3xl font-bold text-red-600">
                    {{ cancelledOrders }}
                  </h2>

                  <p class="mt-1 text-xs text-slate-400">Cancelled orders</p>
                </div>

                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                  ✕
                </div>
              </div>
            </div>
          </div>
          <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div
                class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 class="text-lg font-bold text-slate-900">All Orders</h2>

                  <p class="mt-1 text-xs text-slate-400">
                    {{ filteredOrders.length }}
                    orders found
                  </p>
                </div>
                <div class="relative w-full xl:w-80">
                  <svg
                    class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                  </svg>
                  <input
                    v-model="search"
                    type="text"
                    placeholder="Search orders or customers..."
                    class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50" />
                </div>
              </div>
              <div class="mt-5 flex gap-2 overflow-x-auto pb-1">
                <button
                  v-for="status in [
                    'all',
                    'pending',
                    'processing',
                    'shipped',
                    'delivered',
                    'cancelled',
                  ]"
                  :key="status"
                  @click="statusFilter = status"
                  class="flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition"
                  :class="
                    statusFilter === status
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  ">
                  {{ status }}

                  <span
                    class="rounded-md px-1.5 py-0.5 text-[10px]"
                    :class="
                      statusFilter === status
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-slate-400'
                    ">
                    {{ statusCount(status) }}
                  </span>
                </button>
              </div>
            </div>
            <div
              v-if="error"
              class="mx-5 mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span class="text-lg"> ⚠️ </span>

              <span>{{ error }}</span>
            </div>
            <div
              v-if="loading"
              class="space-y-3 p-5">
              <div
                v-for="n in 6"
                :key="n"
                class="h-16 animate-pulse rounded-xl bg-slate-100"></div>
            </div>
            <div
              v-else
              class="overflow-x-auto">
              <table class="w-full min-w-[1050px]">
                <thead>
                  <tr
                    class="border-b border-slate-100 bg-slate-50/70 text-left">
                    <th
                      class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Order
                    </th>

                    <th
                      class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th
                      class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Product
                    </th>

                    <th
                      class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total
                    </th>

                    <th
                      class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th
                      class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                    <th
                      class="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="order in filteredOrders"
                    :key="order.id"
                    class="group transition hover:bg-indigo-50/30">
                    <td class="px-6 py-5">
                      <div>
                        <p class="font-bold text-indigo-600">
                          {{ getOrderId(order) }}
                        </p>

                        <p class="mt-1 text-[10px] text-slate-400">
                          {{
                            order.id
                              ? String(order.id).slice(0, 8) + '...'
                              : '-'
                          }}
                        </p>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                          {{ getCustomerName(order).charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                          <p class="truncate font-semibold text-slate-800">
                            {{ getCustomerName(order) }}
                          </p>

                          <p
                            class="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                            {{ getCustomerEmail(order) }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          <img
                            v-if="getProductImage(order)"
                            :src="getProductImage(order)"
                            class="h-full w-full object-cover"
                            alt="Product" />

                          <span
                            v-else
                            class="text-lg">
                            📦
                          </span>
                        </div>

                        <div class="min-w-0">
                          <p
                            class="max-w-[220px] truncate text-sm font-semibold text-slate-700">
                            {{ getProductName(order) }}
                          </p>

                          <p class="mt-1 text-xs text-slate-400">
                            {{ getItemsCount(order) }}
                            items
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5">
                      <span class="font-bold text-slate-900">
                        {{ formatMoney(getTotal(order)) }}
                      </span>
                    </td>
                    <td class="px-6 py-5">
                      <span
                        class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold capitalize"
                        :class="getStatusClass(order.status).badge">
                        <span
                          class="h-1.5 w-1.5 rounded-full"
                          :class="getStatusClass(order.status).dot"></span>

                        {{ order.status || 'Unknown' }}
                      </span>
                    </td>
                    <td class="px-6 py-5">
                      <p class="text-sm font-medium text-slate-600">
                        {{ formatDate(order.createdAt) }}
                      </p>

                      <p class="mt-0.5 text-[10px] text-slate-400">
                        {{ formatTime(order.createdAt) }}
                      </p>
                    </td>
                    <td class="px-6 py-5 text-right">
                      <button
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 opacity-70 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100"
                        title="View order">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />

                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke-width="2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!filteredOrders.length">
                    <td
                      colspan="7"
                      class="px-6 py-20 text-center">
                      <div
                        class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                        📦
                      </div>

                      <h3 class="mt-4 font-semibold text-slate-700">
                        No orders found
                      </h3>

                      <p class="mt-1 text-sm text-slate-400">
                        Try changing your search or status filter.
                      </p>

                      <button
                        v-if="search || statusFilter !== 'all'"
                        @click="
                          search = '';
                          statusFilter = 'all';
                        "
                        class="mt-4 rounded-lg bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100">
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="!loading"
              class="border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
              <div
                class="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing
                  <span class="font-semibold text-slate-600">
                    {{ filteredOrders.length }}
                  </span>
                  of
                  <span class="font-semibold text-slate-600">
                    {{ orders.length }}
                  </span>
                  orders
                </p>

                <p>
                  Last updated:
                  <span class="font-medium text-slate-500"> Today </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
