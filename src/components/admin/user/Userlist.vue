
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { getAllUsers, deleteUser } from '../../../service/userService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const users = ref([]);
  const searchQuery = ref('');

  const fetchUser = async () => {
    try {
      const response = await getAllUsers();

      users.value = response.data || response || [];
    } catch (error) {
      console.error('Fail get all user:', error);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Do you want to delete this user ${name || ''}?`)) {
      return;
    }

    try {
      await deleteUser(id);

      users.value = users.value.filter((user) => user.id !== id);
    } catch (error) {
      console.error('Delete user fail:', error);
    }
  };

  const filteredUsers = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) {
      return users.value;
    }

    return users.value.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query),
    );
  });

  onMounted(() => {
    fetchUser();
  });
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans flex">
    <SidebarAdmin />
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1
              class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Users Directory
            </h1>
            <p class="text-sm text-slate-500 mt-1">
              Manage platform users, permissions, and accounts.
            </p>
          </div>
          <div class="relative w-full lg:w-80">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email or role..."
              class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
          </div>
        </div>
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm text-slate-500">
            Total Users:
            <span class="font-semibold text-slate-800">
              {{ filteredUsers.length }}
            </span>
          </p>
        </div>
        <div
          v-if="filteredUsers.length === 0"
          class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <svg
            class="mx-auto h-12 w-12 text-slate-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-base font-semibold text-slate-800">No users found</h3>
          <p class="text-sm text-slate-500 mt-1">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
        <div v-else>
          <div class="grid grid-cols-1 gap-4 md:hidden">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm shrink-0">
                    {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                  </div>

                  <div class="min-w-0">
                    <h4 class="font-semibold text-slate-900 text-sm truncate">
                      {{ user.name || 'Unnamed User' }}
                    </h4>

                    <p class="text-xs text-slate-500 truncate">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                  {{ user.role || 'Member' }}
                </span>
              </div>
              <div
                class="flex items-center justify-end pt-3 border-t border-slate-100 gap-2">
                <button
                  class="px-3 py-1.5 text-indigo-600 bg-indigo-50 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                  Edit
                </button>
                <button
                  @click="handleDeleteUser(user.id, user.name)"
                  class="px-3 py-1.5 text-rose-600 bg-rose-50 rounded-lg font-medium hover:bg-rose-100 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div
            class="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th class="py-4 px-6">User</th>
                    <th class="py-4 px-6">Email</th>
                    <th class="py-4 px-6">Role</th>
                    <th class="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                  <tr
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="hover:bg-slate-50 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div
                          class="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-xs shrink-0">
                          {{
                            user.name ? user.name.charAt(0).toUpperCase() : 'U'
                          }}
                        </div>
                        <div class="min-w-0">
                          <div class="font-medium text-slate-900 truncate">
                            {{ user.name || 'Unnamed User' }}
                          </div>

                          <div class="text-xs text-slate-500 truncate">
                            {{ user.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-slate-600">
                      {{ user.email }}
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        {{ user.role || 'Member' }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-right">
                      <button
                        class="text-indigo-600 hover:text-indigo-900 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors mr-1">
                        Edit
                      </button>
                      <button
                        @click="handleDeleteUser(user.id, user.name)"
                        class="text-rose-600 hover:text-rose-900 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
