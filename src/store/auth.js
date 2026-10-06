
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import api from '../service/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const useAuthStore = defineStore('auth', () => {
  const user = ref(getStoredUser());
  const token = ref(localStorage.getItem('token'));
  const error = ref(null);

  // Getters
  const authentication = computed(() => !!token.value);
  const role = computed(() =>
    String(user.value?.role || '')
      .trim()
      .toLowerCase(),
  );
  const admin = computed(() => role.value === 'admin');
  const customer = computed(() => role.value === 'customer');

  const register = async (name, email, password) => {
    error.value = null;

    try {
      await api.post('/register', {
        name,
        email,
        password,
      });
      return true;
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed';

      return false;
    }
  };

  const login = async (email, password) => {
    error.value = null;

    try {
      const response = await api.post('/login', {
        email,
        password,
      });
      const data = response.data.data || response.data;
      user.value = data.user || data;
      token.value = data.token;
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('token', token.value);
      return true;
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed';

      return false;
    }
  };
  const logout = () => {
    user.value = null;
    token.value = null;
    error.value = null;

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    error,
    authentication,
    role,
    admin,
    customer,
    register,
    login,
    logout,
  };
});

export default useAuthStore;
