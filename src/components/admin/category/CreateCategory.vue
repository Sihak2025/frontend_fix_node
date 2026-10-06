
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { createCategory } from '../../../service/categoryService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const router = useRouter();
  const loading = ref(false);
  const errorMessage = ref('');

  const category = ref({
    name: '',
    description: '',
  });

  const handleCreate = async () => {
    if (!category.value.name.trim()) {
      errorMessage.value = 'Category name is required!';
      return;
    }

    try {
      loading.value = true;
      errorMessage.value = '';

      await createCategory(category.value);

      router.push('/categorylist');
    } catch (error) {
      console.error('Create category fail..!', error);
      errorMessage.value = 'Failed to create category. Please try again.';
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <SidebarAdmin />
    <main class="flex-1 p-6 sm:p-8 overflow-y-auto">
      <div class="max-w-2xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Add New Category</h1>
            <p class="text-sm text-slate-500">
              Create a new product category for your store
            </p>
          </div>
          <router-link
            to="/categorylist"
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
            &larr; Back to Lists
          </router-link>
        </div>
        <div
          class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <form
            @submit.prevent="handleCreate"
            class="space-y-5">
            <div
              v-if="errorMessage"
              class="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {{ errorMessage }}
            </div>
            <div class="space-y-1.5">
              <label
                for="name"
                class="block text-sm font-semibold text-slate-700">
                Category Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="category.name"
                type="text"
                placeholder="e.g., Electronics, Shoes..."
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div class="space-y-1.5">
              <label
                for="description"
                class="block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                v-model="category.description"
                rows="4"
                placeholder="Write a short description about this category..."
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"></textarea>
            </div>
            <div
              class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                :disabled="loading"
                class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer">
                {{ loading ? 'Creating...' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
