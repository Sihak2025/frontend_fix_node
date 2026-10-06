<!-- @format -->

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import {
    getAllPaymentMethod,
    deletePaymentMethod,
  } from '../../../service/paymentMethodService.js';

  const paymentMethods = ref([]);
  const searchQuery = ref('');
  const loading = ref(true);
  const errorMessage = ref('');

  const fetchPaymentMethod = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
      const response = await getAllPaymentMethod();
      paymentMethods.value = response.data || response || [];
    } catch (error) {
      console.error('Get all payment method fail', error);
      errorMessage.value =
        'Failed to load payment methods. Server error (500) or backend is offline.';
    } finally {
      loading.value = false;
    }
  };

  const filterPaymentMethod = computed(() => {
    const query = searchQuery.value.toLowerCase();
    if (!query) {
      return paymentMethods.value;
    }
    return paymentMethods.value.filter((paymentMethod) =>
      paymentMethod.name?.toLowerCase().includes(query),
    );
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deletePaymentMethod(id);
        paymentMethods.value = paymentMethods.value.filter(
          (paymentMethod) => paymentMethod.id !== id,
        );
      } catch (error) {
        console.error('Delete payment method fail', error);
        alert('Failed to delete payment method.');
      }
    }
  };

  onMounted(() => {
    fetchPaymentMethod();
  });
</script>

<template>
  <div class="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
    <SidebarAdmin />
    <div class="flex flex-1 flex-col overflow-x-hidden">
      <header
        class="flex flex-col gap-4 border-b border-slate-200/80 bg-white px-8 py-6 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-credit-card-fill"
                viewBox="0 0 16 16">
                <path
                  d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1" />
              </svg>
            </span>
            <h1 class="text-xl font-bold tracking-tight text-slate-900">
              Payment Methods
            </h1>
          </div>
          <p class="mt-1 text-sm text-slate-500">
            Manage your store's accepted payment gateways and active options.
          </p>
        </div>
        <div>
          <button
            @click="$router.push('/createpaymentmethod')"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
            <i class="fas fa-plus text-xs"></i> Add New Method
          </button>
        </div>
      </header>
      <main class="flex-1 p-8 space-y-6">
        <div
          v-if="errorMessage"
          class="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700 text-sm">
          <div class="flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-red-500"></i>
            <span>{{ errorMessage }}</span>
          </div>
          <button
            @click="fetchPaymentMethod"
            class="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition">
            Retry
          </button>
        </div>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div class="relative flex items-center w-full sm:max-w-md">
            <span class="absolute left-3.5 text-slate-400">
              <i class="fas fa-search text-sm"></i>
            </span>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search payment methods by name..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10" />
          </div>
          <div class="text-xs font-medium text-slate-500 px-1">
            Showing
            <span class="font-bold text-slate-800">{{
              filterPaymentMethod.length
            }}</span>
            results
          </div>
        </div>
        <div
          class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr
                  class="border-b border-slate-200 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th class="px-6 py-4">#ID</th>
                  <th class="px-6 py-4">Image</th>
                  <th class="px-6 py-4">Method Name</th>
                  <th class="px-6 py-4">Description</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-if="loading">
                  <td
                    colspan="5"
                    class="px-6 py-16 text-center text-slate-400">
                    <i
                      class="fas fa-spinner fa-spin text-2xl text-indigo-600 mb-2"></i>
                    <p class="text-sm font-medium text-slate-600">
                      Loading payment methods...
                    </p>
                  </td>
                </tr>
                <tr
                  v-else-if="filterPaymentMethod.length > 0"
                  v-for="(method, index) in filterPaymentMethod"
                  :key="method.id"
                  class="transition-colors hover:bg-slate-50/50 group">
                  <td
                    class="px-6 py-4 font-mono text-xs font-medium text-slate-500">
                    #{{ index + 1 }}
                  </td>
                  <td class="px-6 py-4">
                    <div
                      class="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden text-slate-400">
                      <img
                        v-if="method.image"
                        :src="method.image"
                        alt="Payment Logo"
                        class="h-full w-full object-cover" />
                      <i
                        v-else
                        class="fas fa-wallet text-sm text-slate-400"></i>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold text-slate-800">
                    {{ method.name }}
                  </td>
                  <td class="px-6 py-4 text-slate-500 max-w-xs truncate">
                    {{ method.description || 'No description provided' }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="
                          $router.push(`/updatepaymentmethod/${method.id}`)
                        "
                        title="Edit"
                        class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200">
                        <svg
                          class="w-6 h-6 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24">
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>
                      </button>
                      <button
                        @click="handleDelete(method.id)"
                        title="Delete"
                        class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash3"
                          viewBox="0 0 16 16">
                          <path
                            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="!loading && filterPaymentMethod.length === 0">
                  <td
                    colspan="5"
                    class="px-6 py-16 text-center">
                    <div
                      class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                      <i class="fas fa-credit-card text-lg"></i>
                    </div>
                    <p class="text-sm font-semibold text-slate-700">
                      No payment methods found
                    </p>
                    <p class="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or add a new method.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
