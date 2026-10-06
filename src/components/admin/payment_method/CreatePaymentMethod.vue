
<script setup>
  import { ref } from 'vue';
  import { createPaymentMethod } from '../../../service/paymentMethodService';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const loading = ref(false);
  const errorMessage = ref('');

  const paymentMethods = ref({
    name: '',
    description: '',
    image: '',
  });

  //handle image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        paymentMethods.value.image = reader.result;
      };
    }
  };

  const handleCreate = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
      await createPaymentMethod(paymentMethods.value);
      router.push('/paymentmethodlist');
    } catch (error) {
      console.error('Create payment method fail', error);
      errorMessage.value = 'Failed to create payment method. Please try again.';
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <SidebarAdmin />
    <div class="flex-1 flex flex-col overflow-y-auto">
      <header
        class="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Add Payment Method</h1>
        <button
          @click="router.push('/paymentmethodlist')"
          class="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
          &larr; Back to List
        </button>
      </header>
      <main class="p-8 max-w-3xl w-full mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div
            v-if="errorMessage"
            class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {{ errorMessage }}
          </div>

          <form
            @submit.prevent="handleCreate"
            class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Method Name</label
              >
              <input
                v-model="paymentMethods.name"
                type="text"
                required
                placeholder="e.g., Credit Card, PayPal, ABA Bank"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Description</label
              >
              <textarea
                v-model="paymentMethods.description"
                rows="4"
                placeholder="Enter details or instructions for this payment method..."
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Method Logo / Icon</label
              >
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-150 cursor-pointer" />
              <div
                v-if="paymentMethods.image"
                class="mt-4">
                <p class="text-xs text-gray-500 mb-2">Preview:</p>
                <img
                  :src="paymentMethods.image"
                  alt="Preview"
                  class="h-16 w-16 object-contain rounded-lg border border-gray-200 p-1 bg-gray-50" />
              </div>
            </div>
            <div
              class="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2">
                <span
                  v-if="loading"
                  class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ loading ? 'Saving...' : 'Save Payment Method' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>
