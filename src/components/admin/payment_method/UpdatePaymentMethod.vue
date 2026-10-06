
<script setup>
  import { ref, onMounted } from 'vue';
  import {
    updatePaymentMethod,
    getPaymentMethodById, 
  } from '../../../service/paymentMethodService';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const paymentMethodId = route.params.id;

  const paymentMethods = ref({
    name: '',
    description: '',
    image: '',
  });

  const loading = ref(false);
  const fetching = ref(true);
  const errorMessage = ref('');

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

  const handleById = async (id) => {
    fetching.value = true;
    errorMessage.value = '';
    try {
      const response = await getPaymentMethodById(id);
      const data = response.data || response;
      paymentMethods.value = {
        name: data.name || '',
        description: data.description || '',
        image: data.image || '',
      };
    } catch (error) {
      console.error('Get old data fail', error);
      errorMessage.value = 'Failed to load payment method data.';
    } finally {
      fetching.value = false;
    }
  };

  const handleUpdate = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
      await updatePaymentMethod(paymentMethodId, paymentMethods.value);
      router.push('/paymentmethodlist');
    } catch (error) {
      console.error('Update payment method fail', error);
      errorMessage.value = 'Failed to update payment method. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    handleById(paymentMethodId);
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
              Edit Payment Method
            </h1>
          </div>
          <p class="mt-1 text-sm text-slate-500">
            Update your store's payment gateway details and configurations.
          </p>
        </div>
        <div>
          <button
            @click="router.push('/paymentmethodlist')"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            &larr; Back to List
          </button>
        </div>
      </header>
      <main class="flex-1 p-8 max-w-3xl w-full mx-auto">
        <div
          v-if="fetching"
          class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <i class="fas fa-spinner fa-spin text-2xl text-indigo-600 mb-2"></i>
          <p class="text-sm font-medium text-slate-600">
            Loading payment method details...
          </p>
        </div>
        <div
          v-else
          class="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          <div
            v-if="errorMessage"
            class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-red-500"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form
            @submit.prevent="handleUpdate"
            class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Method Name</label
              >
              <input
                v-model="paymentMethods.name"
                type="text"
                required
                placeholder="e.g., Credit Card, PayPal, ABA Bank"
                class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Description</label
              >
              <textarea
                v-model="paymentMethods.description"
                rows="4"
                placeholder="Enter details or instructions for this payment method..."
                class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Method Logo / Icon</label
              >
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
              <div
                v-if="paymentMethods.image"
                class="mt-4">
                <p class="text-xs font-medium text-slate-400 mb-2">
                  Current Logo Preview:
                </p>
                <div
                  class="h-16 w-16 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1 overflow-hidden">
                  <img
                    :src="paymentMethods.image"
                    alt="Preview"
                    class="h-full w-full object-contain" />
                </div>
              </div>
            </div>
            <div
              class="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition shadow-sm disabled:opacity-50">
                <span
                  v-if="loading"
                  class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ loading ? 'Saving Changes...' : 'Update Payment Method' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>
