<!-- @format -->

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {
    getProductById,
    updateProduct,
  } from '../../../service/productService.js';
  import { getAllCategory } from '../../../service/categoryService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const router = useRouter();
  const route = useRoute();
  const productId = route.params.id;
  const categories = ref([]);
  const loading = ref(false);

  const product = ref({
    name: '',
    categoryId: '',
    price: '',
    image: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();
      categories.value = response.data || response || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async (id) => {
    try {
      loading.value = true;
      const response = await getProductById(id);
      const data = response.data || response;
      product.value = {
        name: data.name || '',
        categoryId: data.categoryId?.id || data.categoryId || '',
        price: data.price || '',
        image: data.image || '',
        description: data.description || '',
      };
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      loading.value = false;
    }
  };

  const handleUpdate = async () => {
    if (!product.value.name.trim()) {
      alert('Product name is required!');
      return;
    }

    try {
      await updateProduct(productId, product.value);
      alert('Product updated successfully!');
      router.push('/productlist');
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  onMounted(() => {
    fetchCategories();
    fetchProduct(productId);
  });
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <SidebarAdmin />
    <main class="flex-1 p-6 sm:p-8 overflow-y-auto">
      <div class="max-w-3xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Update Product</h1>
            <p class="text-sm text-slate-500">
              Modify product information easily
            </p>
          </div>
          <router-link
            to="/productlist"
            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition">
            ← Back to List
          </router-link>
        </div>
        <div
          class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div
            v-if="loading"
            class="py-12 text-center text-slate-400 font-medium">
            Loading product data...
          </div>

          <form
            v-else
            @submit.prevent="handleUpdate"
            class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700"
                >Product Name</label
              >
              <input
                v-model="product.name"
                type="text"
                placeholder="Enter product name"
                required
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700"
                  >Category</label
                >
                <select
                  v-model="product.categoryId"
                  required
                  class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                  <option
                    disabled
                    value="">
                    Select category
                  </option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700"
                  >Price ($)</label
                >
                <input
                  v-model="product.price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700"
                >Image URL</label
              >
              <input
                v-model="product.image"
                type="text"
                placeholder="https://example.com/image.jpg"
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
              <div
                v-if="product.image"
                class="mt-3 w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  :src="product.image"
                  alt="Preview"
                  class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700"
                >Description</label
              >
              <input
                v-model="product.description"
                type="text"
                placeholder="Enter product description..."
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                class="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition cursor-pointer">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
