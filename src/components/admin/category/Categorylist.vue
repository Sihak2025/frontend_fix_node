
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import {
    getAllCategory,
    deleteCategory,
  } from '../../../service/categoryService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';
  import { RouterLink } from 'vue-router';

  const isSidebarOpen = ref(false);

  const categories = ref([]);
  const searchQuery = ref('');

  const fetchCategory = async () => {
    try {
      const response = await getAllCategory();
      categories.value = response.data || response || [];
    } catch (error) {
      console.error('Get all category fail..', error);
    }
  };

  const filterCategory = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      return categories.value;
    }

    return categories.value.filter((category) =>
      category.name?.toLowerCase().includes(query),
    );
  });

  const handleDelete = async (id, name) => {
    if (!confirm(`Do you want to delete category "${name}"?`)) {
      return;
    }
    try {
      await deleteCategory(id);
      categories.value = categories.value.filter(
        (category) => category.id !== id,
      );
    } catch (error) {
      console.error('Delete category fail..!', error);
    }
  };

  onMounted(() => {
    fetchCategory();
  });
</script>

<template>
  <div
    class="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
    <SidebarAdmin
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false" />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-30 shrink-0">
        <div class="flex items-center space-x-3">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1
            class="text-base sm:text-lg font-semibold text-slate-800 truncate">
            Category Management
          </h1>
        </div>

        <div class="flex items-center space-x-3">
          <button
            class="relative text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors">
            🔔
            <span
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div
            class="flex items-center space-x-3 border-l pl-3 sm:pl-4 border-slate-200">
            <div
              class="w-9 h-9 bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center shadow-sm shrink-0">
              S
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-slate-700 leading-tight">
                Store Manager
              </p>
              <p class="text-xs text-slate-400">store@company.com</p>
            </div>
          </div>
        </div>
      </header>
      <main class="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto space-y-6">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">
                Category Management
              </h1>
              <p class="text-sm text-slate-500">
                Manage all product categories in the system
              </p>
            </div>
            <Router-Link to="/createcategory"
              ><button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer">
                + Add New Category
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
                  placeholder="Search categories..."
                  class="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <span class="text-xs text-slate-500 font-medium"
                >Total: {{ filterCategory.length }} categories</span
              >
            </div>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table
                class="w-full text-left border-collapse text-sm text-slate-600 min-w-[600px]">
                <thead
                  class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase">
                  <tr>
                    <th class="py-3 px-4">#</th>
                    <th class="py-3 px-4">Category Name</th>
                    <th class="py-3 px-4">Description</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr v-if="filterCategory.length === 0">
                    <td
                      colspan="4"
                      class="py-6 text-center text-slate-400">
                      No categories found.
                    </td>
                  </tr>
                  <tr
                    v-for="(category, index) in filterCategory"
                    :key="category.id || index"
                    class="hover:bg-slate-50 transition">
                    <td class="py-3 px-4 font-medium text-slate-900">
                      {{ index + 1 }}
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-800">
                      {{ category.name }}
                    </td>
                    <td class="py-3 px-4 text-slate-500">
                      {{ category.description || 'N/A' }}
                    </td>
                    <td class="py-3 px-4 text-right space-x-2">
                      <router-link :to="`/updatecategory/${category.id}`">
                        <button
                          class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer">
                          Edit
                        </button>
                      </router-link>
                      <button
                        @click="handleDelete(category.id, category.name)"
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
