<!-- @format -->

<script setup>
  import { ref, onMounted } from 'vue';
  import {
    updateProductVariant,
    getProductVariantById,
  } from '../../../service/productVariantService';
  import { getAllProduct } from '../../../service/productService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import { useRouter, useRoute, RouterLink } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const productVariantId = route.params.id;

  // Sidebar state for mobile drawer toggle
  const isSidebarOpen = ref(false);

  const productVariants = ref({
    productId: '',
    size: '',
  });
  const products = ref([]);
  const isSubmitting = ref(false);

  const fetchProduct = async () => {
    try {
      const response = await getAllProduct();
      products.value = response.data || response || [];
    } catch (error) {
      console.error('Get all product fail', error);
    }
  };

  const fetchProductVariant = async (id) => {
    try {
      const response = await getProductVariantById(id);
      const data = response.data || response;

      productVariants.value = {
        productId: data.productId?.id || data.productId || '',
        size: data.size || '',
      };
    } catch (error) {
      console.error('Get product variant by id fail', error);
    }
  };

  const handleUpdate = async () => {
    if (!productVariants.value.productId) {
      alert('Please select a product.');
      return;
    }

    try {
      isSubmitting.value = true;
      await updateProductVariant(productVariantId, productVariants.value);
      router.push('/productvariantlist');
    } catch (error) {
      console.error('Update product variant fail', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  onMounted(() => {
    fetchProduct();
    if (productVariantId) {
      fetchProductVariant(productVariantId);
    }
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
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                Edit Product Variant
              </h1>
              <p class="text-sm text-slate-500">
                Update product relation or size/attribute specification
              </p>
            </div>
            <RouterLink to="/productvariantlist">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition cursor-pointer">
                Back to List
              </button>
            </RouterLink>
          </div>
          <div
            class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <form
              @submit.prevent="handleUpdate"
              class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">
                  Select Product <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="productVariants.productId"
                  required
                  class="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition">
                  <option
                    value=""
                    disabled>
                    -- Choose a Product --
                  </option>
                  <option
                    v-for="product in products"
                    :key="product.id"
                    :value="product.id">
                    {{ product.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">
                  Size / Variant Attribute
                </label>
                <input
                  v-model="productVariants.size"
                  type="text"
                  placeholder="e.g. S, M, L, XL, or Red/Large"
                  class="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" />
              </div>
              <div
                class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50">
                  {{ isSubmitting ? 'Updating...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
