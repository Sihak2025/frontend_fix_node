
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import {
    getAllStockProduct,
    deleteStockProduct,
  } from '../../../service/stockProductService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const stockProducts = ref([]);
  const searchQuery = ref('');
  const isLoading = ref(false);

  const fetchStockProduct = async () => {
    try {
      isLoading.value = true;
      const response = await getAllStockProduct();
      stockProducts.value = response.data || response || [];
    } catch (error) {
      console.error('Get stock product failed:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const filterStockProduct = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return stockProducts.value.filter((item) => {
      const productName = item.product?.name?.toLowerCase() || '';
      const variantName = item.productVariant?.size?.toLowerCase() || '';
      const productId = String(item.productId || '');
      const variantId = String(item.productVariantId || '');

      return (
        productName.includes(query) ||
        variantName.includes(query) ||
        productId.includes(query) ||
        variantId.includes(query)
      );
    });
  });

  const handleDelete = async (id) => {
    if (!confirm('Do you want to delete this stock record?')) {
      return;
    }
    try {
      await deleteStockProduct(id);
      stockProducts.value = stockProducts.value.filter(
        (stockProduct) => stockProduct.id !== id,
      );
    } catch (error) {
      console.error('Delete stock product failed:', error);
      alert(error.response?.data?.error || 'Failed to delete stock record');
    }
  };

  onMounted(() => {
    fetchStockProduct();
  });
</script>

<template>
  <div
    class="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
    <SidebarAdmin />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="bg-white border-b border-slate-200 z-10 px-8 py-5 flex justify-between items-center shadow-xs">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Stock Movement Management
          </h1>
          <p class="text-sm text-slate-500 mt-0.5">
            Monitor incoming, outgoing and current balance of product inventory.
          </p>
        </div>
        <router-link
          to="/createstockproduct"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"></path>
          </svg>
          Add Stock Record
        </router-link>
      </header>
      <main class="flex-1 overflow-x-auto overflow-y-auto p-8 space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div class="w-full max-w-md relative">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by product name, variant, or ID..."
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs transition" />
          </div>
          <div class="text-sm text-slate-500">
            Total records:
            <span class="font-semibold text-slate-700">{{
              filterStockProduct.length
            }}</span>
          </div>
        </div>
        <div
          class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50/75">
              <tr>
                <th
                  class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  No.
                </th>
                <th
                  class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th
                  class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Variant
                </th>
                <th
                  class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Stock In
                </th>
                <th
                  class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Stock Out
                </th>
                <th
                  class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Balance
                </th>
                <th
                  class="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading">
                <td
                  colspan="7"
                  class="px-6 py-12 text-center text-slate-400 text-sm">
                  Loading stock records...
                </td>
              </tr>
              <tr
                v-for="(item, index) in filterStockProduct"
                :key="item.id"
                class="hover:bg-slate-50/80 transition-colors">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">
                  {{ index + 1 }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                  {{ item.product?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span
                    class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                    {{ item.productVariant?.size || 'Standard' }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">
                  +{{ item.stock_in ?? 0 }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-rose-600 font-bold">
                  -{{ item.stock_out ?? 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {{ item.balance ?? 0 }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <router-link
                    v-if="item.id"
                    :to="`/admin/stock-products/edit/${item.id}`"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors font-semibold">
                    Edit
                  </router-link>
                  <button
                    @click="handleDelete(item.id)"
                    class="text-rose-600 hover:text-rose-900 transition-colors font-semibold cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="!isLoading && filterStockProduct.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-16 text-center text-slate-400 text-sm">
                  <div
                    class="flex flex-col items-center justify-center space-y-2">
                    <svg
                      class="w-10 h-10 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <p class="font-medium text-slate-600">
                      No stock records found
                    </p>
                    <p class="text-xs text-slate-400">
                      Try adjusting your search query.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>
