

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAllShoppingHistory } from '../../service/shoppingHistoryService';

  const router = useRouter();

  const orders = ref([]);
  const loading = ref(true);
  const error = ref('');
  const selectedOrder = ref(null);

  const fetchShoppingHistory = async () => {
    try {
      loading.value = true;
      error.value = '';

      const response = await getAllShoppingHistory();
      const result = response?.data || response;

      if (result?.success) {
        orders.value = result.data || [];
      } else if (Array.isArray(result)) {
        orders.value = result;
      } else {
        orders.value = [];
      }
    } catch (err) {
      console.error('Shopping history error:', err);

      error.value =
        err?.response?.data?.message || 'Failed to load shopping history';
    } finally {
      loading.value = false;
    }
  };

  const goBack = () => {
    router.back();
  };


  const getOrderId = (order) => {
    if (order.orderNumber) {
      return order.orderNumber;
    }

    if (order.id) {
      return `#ORD-${String(order.id).slice(0, 8).toUpperCase()}`;
    }

    return '#ORD-UNKNOWN';
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

  const getTotalItems = (order) => {
    return getItems(order).reduce(
      (total, item) => total + Number(item.quantity || 1),
      0,
    );
  };

  const getOrderTotal = (order) => {
    return Number(
      order.totalAmount ?? order.totalAmout ?? order.total ?? order.amount ?? 0,
    );
  };


  const totalSpent = computed(() => {
    return orders.value.reduce(
      (total, order) => total + getOrderTotal(order),
      0,
    );
  });

  const deliveredOrders = computed(() => {
    return orders.value.filter((order) =>
      ['delivered', 'completed'].includes(
        String(order.status || '').toLowerCase(),
      ),
    ).length;
  });

  const activeOrders = computed(() => {
    return orders.value.filter((order) =>
      ['pending', 'processing', 'shipped', 'shipping'].includes(
        String(order.status || '').toLowerCase(),
      ),
    ).length;
  });



  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString('en-US', {
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

  const getStatus = (status) => {
    const value = String(status || '').toLowerCase();

    if (['completed', 'delivered'].includes(value)) {
      return {
        label: 'Delivered',
        icon: '✓',
        class: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        dot: 'bg-emerald-500',
      };
    }

    if (['shipped', 'shipping'].includes(value)) {
      return {
        label: 'Shipped',
        icon: '↗',
        class: 'bg-blue-50 text-blue-700 ring-blue-200',
        dot: 'bg-blue-500',
      };
    }

    if (['pending', 'processing'].includes(value)) {
      return {
        label: value === 'processing' ? 'Processing' : 'Pending',
        icon: '◷',
        class: 'bg-amber-50 text-amber-700 ring-amber-200',
        dot: 'bg-amber-500',
      };
    }

    if (['cancelled', 'canceled'].includes(value)) {
      return {
        label: 'Cancelled',
        icon: '×',
        class: 'bg-rose-50 text-rose-700 ring-rose-200',
        dot: 'bg-rose-500',
      };
    }

    return {
      label: status || 'Unknown',
      icon: '•',
      class: 'bg-slate-50 text-slate-600 ring-slate-200',
      dot: 'bg-slate-400',
    };
  };


  const getProductImage = (item) => {
    const image = item?.product?.image;

    if (!image) {
      return '';
    }

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:')
    ) {
      return image;
    }

    return `http://localhost:3000${
      image.startsWith('/') ? image : `/${image}`
    }`;
  };


  const viewOrder = (order) => {
    selectedOrder.value = order;
  };

  const closeOrder = () => {
    selectedOrder.value = null;
  };


  onMounted(() => {
    fetchShoppingHistory();
  });
</script>

<template>
  <div class="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <div class="mb-5">
        <button
          @click="goBack"
          class="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
          <span
            class="text-lg transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Back
        </button>
      </div>
      <div
        class="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-xl shadow-indigo-200 sm:p-9">
        <div
          class="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>

        <div
          class="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-purple-300/10 blur-3xl"></div>

        <div
          class="absolute right-20 top-10 h-20 w-20 rounded-full border border-white/10"></div>

        <div class="relative">
          <div
            class="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <span>🛍️</span>
            My Account
          </div>

          <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Shopping History
          </h1>

          <p
            class="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Track your orders, review your purchases, and see everything you've
            bought in one place.
          </p>
        </div>
      </div>
      <div v-if="loading">
        <div class="grid gap-4 sm:grid-cols-3">
          <div
            v-for="i in 3"
            :key="i"
            class="h-28 animate-pulse rounded-2xl bg-white"></div>
        </div>
        <div class="mt-6 space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="h-52 animate-pulse rounded-[24px] bg-white"></div>
        </div>
      </div>
      <div
        v-else-if="error"
        class="rounded-[28px] border border-rose-100 bg-white p-10 text-center shadow-sm">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl">
          ⚠️
        </div>

        <h2 class="mt-5 text-xl font-bold text-slate-900">
          Unable to load your orders
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">
          {{ error }}
        </p>

        <button
          @click="fetchShoppingHistory"
          class="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
          Try Again
        </button>
      </div>
      <div
        v-else-if="orders.length === 0"
        class="rounded-[28px] bg-white px-6 py-20 text-center shadow-sm ring-1 ring-slate-100">
        <div
          class="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-indigo-50 text-5xl">
          🛍️
        </div>

        <h2 class="mt-6 text-2xl font-extrabold text-slate-900">
          No orders yet
        </h2>

        <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          You haven't placed an order yet. Discover something you love and your
          shopping history will appear here.
        </p>

        <router-link
          to="/viewproduct"
          class="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
          <span>Start Shopping</span>
          <span>→</span>
        </router-link>
      </div>
      <div v-else>
        <div class="mb-7 grid gap-4 sm:grid-cols-3">
          <div
            class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Orders
                </p>

                <p class="mt-2 text-3xl font-extrabold text-slate-900">
                  {{ orders.length }}
                </p>

                <p class="mt-1 text-xs text-slate-400">All your orders</p>
              </div>

              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl transition group-hover:scale-110">
                🛒
              </div>
            </div>
          </div>
          <div
            class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Spent
                </p>

                <p class="mt-2 text-3xl font-extrabold text-slate-900">
                  {{ formatMoney(totalSpent) }}
                </p>

                <p class="mt-1 text-xs text-slate-400">Lifetime spending</p>
              </div>

              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl transition group-hover:scale-110">
                💳
              </div>
            </div>
          </div>
          <div
            class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Delivered
                </p>

                <p class="mt-2 text-3xl font-extrabold text-slate-900">
                  {{ deliveredOrders }}
                </p>

                <p class="mt-1 text-xs text-slate-400">
                  Successfully completed
                </p>
              </div>

              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl transition group-hover:scale-110">
                ✓
              </div>
            </div>
          </div>
        </div>
        <div class="mb-5 flex items-end justify-between">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">Your Orders</h2>

            <p class="mt-1 text-sm text-slate-500">
              {{ orders.length }}
              order{{ orders.length > 1 ? 's' : '' }}
              in your history
            </p>
          </div>

          <div
            class="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-100 sm:block">
            {{ activeOrders }} active
          </div>
        </div>
        <div class="space-y-5">
          <div
            v-for="order in orders"
            :key="order.id"
            class="group overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <div class="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div
                class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
                    📦
                  </div>

                  <div>
                    <div class="flex flex-wrap items-center gap-3">
                      <h3 class="font-extrabold text-slate-900">
                        {{ getOrderId(order) }}
                      </h3>
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1"
                        :class="getStatus(order.status).class">
                        <span
                          class="h-1.5 w-1.5 rounded-full"
                          :class="getStatus(order.status).dot"></span>

                        {{ getStatus(order.status).label }}
                      </span>
                    </div>

                    <div
                      class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span> 📅 {{ formatDate(order.createdAt) }} </span>

                      <span> 🕐 {{ formatTime(order.createdAt) }} </span>

                      <span> 🛍️ {{ getTotalItems(order) }} items </span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between gap-6 lg:justify-end">
                  <div class="text-left lg:text-right">
                    <p class="text-xs font-medium text-slate-400">
                      Order Total
                    </p>

                    <p class="mt-1 text-xl font-extrabold text-slate-900">
                      {{ formatMoney(getOrderTotal(order)) }}
                    </p>
                  </div>

                  <button
                    @click="viewOrder(order)"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    title="View order">
                    →
                  </button>
                </div>
              </div>
            </div>
            <div class="px-5 py-4 sm:px-6">
              <div
                v-for="(item, index) in getItems(order)"
                :key="item.id"
                class="flex items-center gap-4 py-3"
                :class="{
                  'border-b border-slate-100':
                    index < getItems(order).length - 1,
                }">
                <div
                  class="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    v-if="getProductImage(item)"
                    :src="getProductImage(item)"
                    :alt="item.product?.name || 'Product'"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-2xl">
                    📦
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="truncate font-bold text-slate-800">
                    {{ item.product?.name || 'Product' }}
                  </h4>
                  <p class="mt-1 text-xs text-slate-400">
                    Quantity:
                    <span class="font-semibold text-slate-600">
                      {{ item.quantity || 1 }}
                    </span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-slate-900">
                    {{ formatMoney(item.price) }}
                  </p>

                  <p class="mt-1 text-[11px] text-slate-400">each</p>
                </div>
              </div>
            </div>
            <div
              class="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span
                  class="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  🛍️
                </span>

                {{ getItems(order).length }}
                product{{ getItems(order).length > 1 ? 's' : '' }}
              </div>

              <button
                @click="viewOrder(order)"
                class="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600">
                View Order Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="modal">
      <div
        v-if="selectedOrder"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        @click.self="closeOrder">
        <div
          class="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
          <div
            class="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-6 text-white">
            <div
              class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10"></div>

            <div class="relative flex items-start justify-between">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Order Details
                </p>

                <h2 class="mt-1 text-2xl font-extrabold">
                  {{ getOrderId(selectedOrder) }}
                </h2>

                <p class="mt-1 text-sm text-indigo-100">
                  {{ formatDate(selectedOrder.createdAt) }}
                  ·
                  {{ formatTime(selectedOrder.createdAt) }}
                </p>
              </div>

              <button
                @click="closeOrder"
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20">
                ✕
              </button>
            </div>
          </div>
          <div class="max-h-[65vh] overflow-y-auto p-6">
            <div
              class="mb-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div>
                <p class="text-xs text-slate-400">Order Status</p>

                <p class="mt-1 font-bold capitalize text-slate-800">
                  {{ getStatus(selectedOrder.status).label }}
                </p>
              </div>

              <span
                class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ring-1"
                :class="getStatus(selectedOrder.status).class">
                <span
                  class="h-2 w-2 rounded-full"
                  :class="getStatus(selectedOrder.status).dot"></span>

                {{ getStatus(selectedOrder.status).label }}
              </span>
            </div>
            <div class="space-y-3">
              <div
                v-for="item in getItems(selectedOrder)"
                :key="item.id"
                class="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30">
                <div
                  class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    v-if="getProductImage(item)"
                    :src="getProductImage(item)"
                    :alt="item.product?.name || 'Product'"
                    class="h-full w-full object-cover" />

                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-2xl">
                    📦
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <h3 class="truncate font-bold text-slate-800">
                    {{ item.product?.name || 'Product' }}
                  </h3>

                  <p class="mt-1 text-xs text-slate-400">
                    {{ formatMoney(item.price) }}
                    ×
                    {{ item.quantity || 1 }}
                  </p>
                </div>

                <p class="font-extrabold text-slate-900">
                  {{
                    formatMoney(
                      Number(item.price || 0) * Number(item.quantity || 1),
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-300"> Total Amount </span>

                <span class="text-2xl font-extrabold">
                  {{ formatMoney(getOrderTotal(selectedOrder)) }}
                </span>
              </div>
            </div>
          </div>
          <div class="border-t border-slate-100 bg-white p-5">
            <button
              @click="closeOrder"
              class="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.2s ease;
  }

  .modal-enter-active > div,
  .modal-leave-active > div {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-from > div,
  .modal-leave-to > div {
    transform: scale(0.96) translateY(10px);
    opacity: 0;
  }
</style>
