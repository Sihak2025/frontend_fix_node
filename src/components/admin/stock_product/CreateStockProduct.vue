<!-- @format -->

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter, RouterLink } from 'vue-router';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import { createStockProduct } from '../../../service/stockProductService';
  import { getAllProduct } from '../../../service/productService';
  import { getAllProductVariant } from '../../../service/productVariantService';

  const router = useRouter();
  const isSidebarOpen = ref(false);

  const stockProducts = ref({
    productId: '',
    productVariantId: '',
    stock_in: '',
  });

  const products = ref([]);
  const productVariants = ref([]);
  const isSubmitting = ref(false);

  const fetchProduct = async () => {
    try {
      const response = await getAllProduct();
      products.value = response.data || response || [];
    } catch (error) {
      console.error('Get all products fail', error);
    }
  };

  const fetchProductVariant = async () => {
    try {
      const response = await getAllProductVariant();
      productVariants.value = response.data || response || [];
    } catch (error) {
      console.error('Get all product variant fail', error);
    }
  };

  const filteredVariants = computed(() => {
    if (!stockProducts.value.productId) return [];
    return productVariants.value.filter((variant) => {
      const vProdId = variant.productId?.id || variant.productId;
      return vProdId === stockProducts.value.productId;
    });
  });

  const handleCreate = async () => {
    if (!stockProducts.value.productId) {
      alert('Please select a product.');
      return;
    }

    if (!stockProducts.value.stock_in || stockProducts.value.stock_in <= 0) {
      alert('Please enter a valid stock in quantity.');
      return;
    }

    try {
      isSubmitting.value = true;
      const variantId =
        stockProducts.value.productVariantId === ''
          ? null
          : stockProducts.value.productVariantId;

      await createStockProduct({
        productId: stockProducts.value.productId,
        productVariantId: variantId,
        stock_in: Number(stockProducts.value.stock_in),
      });
      router.push('/stockproductlist');
    } catch (error) {
      console.error('Create stock product fail', error);
      alert(error.response?.data?.error || 'Failed to create stock record');
    } finally {
      isSubmitting.value = false;
    }
  };

  onMounted(() => {
    fetchProduct();
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
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                Add Stock (Restock)
              </h1>
              <p class="text-sm text-slate-500">
                Add incoming quantities for product inventory
              </p>
            </div>
            <RouterLink to="/stockproductlist">
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
              @submit.prevent="handleCreate"
              class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">
                  Select Product <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="stockProducts.productId"
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
                  Select Variant (Size / Option)
                </label>
                <select
                  v-model="stockProducts.productVariantId"
                  class="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition">
                  <option value="">-- Choose Variant (Optional) --</option>
                  <option
                    v-for="variant in filteredVariants"
                    :key="variant.id"
                    :value="variant.id">
                    {{ variant.size }}
                  </option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">
                  Stock In Quantity <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="stockProducts.stock_in"
                  type="number"
                  min="1"
                  required
                  placeholder="Enter quantity to add"
                  class="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" />
              </div>
              <div
                class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <RouterLink to="/stockproductlist">
                  <button
                    type="button"
                    class="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer">
                    Cancel
                  </button>
                </RouterLink>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50">
                  {{ isSubmitting ? 'Saving...' : 'Add Stock' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
