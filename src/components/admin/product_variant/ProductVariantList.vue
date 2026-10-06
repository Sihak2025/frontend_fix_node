<!-- @format -->

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import {
    getAllProductVariant,
    deleteProductVariant,
  } from '../../../service/productVariantService';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import { RouterLink } from 'vue-router';

  const isSidebarOpen = ref(false);

  const productVariants = ref([]);
  const searchQuery = ref('');

  const fetchProductVariant = async () => {
    try {
      const response = await getAllProductVariant();
      productVariants.value = response.data || response || [];
    } catch (error) {
      console.error('Get all product variant fail', error);
    }
  };

  const filterProductVariant = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) {
      return productVariants.value;
    }
    return productVariants.value.filter((productVariant) => {
      const productName = productVariant.product?.name || '';
      const sku = productVariant.sku || '';
      return (
        productName.toLowerCase().includes(query) ||
        sku.toLowerCase().includes(query)
      );
    });
  });

  const handleDelete = async (id) => {
    if (!confirm('Do you want to delete this product variant?')) {
      return;
    }
    try {
      await deleteProductVariant(id);
      productVariants.value = productVariants.value.filter(
        (productVariant) => productVariant.id !== id,
      );
    } catch (error) {
      console.error('Delete product variant fail', error);
    }
  };

  onMounted(() => {
    fetchProductVariant();
  });
</script>

<template>
  <div
    class="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
    <SidebarAdmin
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false" />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <main class="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div class="max-w-7xl mx-auto space-y-6">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                Product Variants
              </h1>
              <p class="text-sm text-slate-500">
                Manage stock, prices, attributes, and SKU variations for your
                inventory
              </p>
            </div>
            <Router-Link to="/createproductvariant">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer">
                + Add New Variant
              </button>
            </Router-Link>
          </div>
          <div
            class="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 space-y-6">
            <div
              class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div class="w-full sm:w-80">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by product or SKU..."
                  class="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <span class="text-xs text-slate-500 font-medium"
                >Total: {{ filterProductVariant.length }} variants</span
              >
            </div>
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table
                class="w-full text-left border-collapse text-sm text-slate-600 min-w-[750px]">
                <thead
                  class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase">
                  <tr>
                    <th class="py-3 px-4">#</th>
                    <th class="py-3 px-4">Product Name</th>
                    <th class="py-3 px-4">size</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr v-if="filterProductVariant.length === 0">
                    <td
                      colspan="4"
                      class="py-8 text-center text-slate-400">
                      No product variants found.
                    </td>
                  </tr>
                  <tr
                    v-for="(variant, index) in filterProductVariant"
                    :key="variant.id || index"
                    class="hover:bg-slate-50 transition">
                    <td class="py-3 px-4 font-medium text-slate-900">
                      {{ index + 1 }}
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-800">
                      {{ variant.product?.name || 'N/A' }}
                    </td>
                    <td class="py-3 px-4 text-slate-600">
                      <span
                        class="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                        {{ variant.size || 'Standard' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right space-x-2">
                      <router-link :to="`/updateproductvariant/${variant.id}`">
                        <button
                          class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer">
                          Edit
                        </button>
                      </router-link>
                      <button
                        @click="handleDelete(variant.id)"
                        class="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
