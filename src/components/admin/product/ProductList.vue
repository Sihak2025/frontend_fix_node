
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import {
    getAllProduct,
    deleteProduct,
  } from '../../../service/productService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const products = ref([]);
  const searchQuery = ref('');

  const fetchProduct = async () => {
    try {
      const response = await getAllProduct();
      products.value = response.data || response || [];
    } catch (error) {
      console.error('Get all products fail ', error);
    }
  };

  const filterProduct = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      return products.value;
    }

    return products.value.filter((product) =>
      product.name?.toLowerCase().includes(query),
    );
  });

  const truncateText = (text, limit = 30) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Do you want to delete ${name}`)) {
      return;
    }
    try {
      await deleteProduct(id);
      products.value = products.value.filter((product) => product.id !== id);
    } catch (error) {
      console.error('Delete product fail..', error);
    }
  };

  onMounted(() => {
    fetchProduct();
  });
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <SidebarAdmin />
    <main class="flex-1 p-6 sm:p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">
              Product Management
            </h1>
            <p class="text-sm text-slate-500">
              Manage your store products efficiently
            </p>
          </div>
          <router-link
            to="/createproduct"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition">
            + Add New Product
          </router-link>
        </div>
        <div
          class="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex items-center justify-between gap-4">
          <div class="w-full sm:w-80">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products by name..."
              class="w-full py-2 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
          </div>
        </div>
        <div
          class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th class="py-3.5 px-6">Id</th>
                  <th class="py-3.5 px-6">Image</th>
                  <th class="py-3.5 px-6">Name</th>
                  <th class="py-3.5 px-6">Category</th>
                  <th class="py-3.5 px-6">Price</th>
                  <th class="py-3.5 px-6">Description</th>
                  <th class="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                <tr v-if="filterProduct.length === 0">
                  <td
                    colspan="7"
                    class="py-12 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
                <tr
                  v-for="(product, index) in filterProduct"
                  :key="product.id || index"
                  class="hover:bg-slate-50/50 transition">
                  <td class="py-4 px-6">{{ index + 1 }}</td>
                  <td class="py-4 px-6">
                    <div
                      class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                      <img
                        v-if="product.image || product.imageUrl || product.img"
                        :src="product.image || product.imageUrl || product.img"
                        alt="Product Image"
                        class="w-full h-full object-cover" />
                      <span
                        v-else
                        class="text-xs text-slate-400 font-medium"
                        >No Img</span
                      >
                    </div>
                  </td>
                  <td class="py-4 px-6 font-semibold text-slate-900">
                    {{ product.name }}
                  </td>
                  <td class="py-4 px-6">
                    <span
                      class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg">
                      {{
                        product.category?.name ||
                        product.categoryId?.name ||
                        'N/A'
                      }}
                    </span>
                  </td>
                  <td class="py-4 px-6 font-medium text-slate-900">
                    ${{ product.price }}
                  </td>
                  <td
                    class="py-4 px-6 font-medium text-slate-600 max-w-xs truncate"
                    :title="product.description">
                    {{ truncateText(product.description, 30) }}
                  </td>
                  <td class="py-4 px-6 text-right space-x-2">
                    <router-link
                      :to="`/updateproduct/${product.id}`"
                      class="inline-block px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
                      Edit
                    </router-link>
                    <button
                      @click="handleDelete(product.id, product.name)"
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
</template>
