
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import Login from '../auth/Login.vue';
import Register from '../auth/Register.vue';
import useAuthStore from '../store/auth.js';
import SidebarAdmin from '../layout/SidebarAdmin.vue';
import ViewPage from '../components/ViewPage.vue';
import Userlist from '../components/admin/user/Userlist.vue';
import Categorylist from '../components/admin/category/Categorylist.vue';
import CreateCategory from '../components/admin/category/CreateCategory.vue';
import UpdateCategory from '../components/admin/category/UpdateCategory.vue';
import ProductList from '../components/admin/product/ProductList.vue';
import CreateProduct from '../components/admin/product/CreateProduct.vue';
import UpdateProduct from '../components/admin/product/UpdateProduct.vue';
import ProductDetail from '../components/customer/ProductDetail.vue';
import DashboardAdmin from '../layout/DashboardAdmin.vue';
import ProductVariantList from '../components/admin/product_variant/ProductVariantList.vue';
import CreateProductVariant from '../components/admin/product_variant/CreateProductVariant.vue';
import UpdateProductVariant from '../components/admin/product_variant/UpdateProductVariant.vue';
import StockProductList from '../components/admin/stock_product/StockProductList.vue';
import CreateStockProduct from '../components/admin/stock_product/CreateStockProduct.vue';
import PaymentMethodList from '../components/admin/payment_method/PaymentMethodList.vue';
import CreatePaymentMethod from '../components/admin/payment_method/CreatePaymentMethod.vue';
import UpdatePaymentMethod from '../components/admin/payment_method/UpdatePaymentMethod.vue';
import Payment from '../components/customer/Payment.vue';
import OrderList from '../components/admin/order/OrderList.vue';
import ShoppingHistory from '../components/customer/ShoppingHistory.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
  },

  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/sidebarAdmin',
    name: 'sidebarAdmin',
    component: SidebarAdmin,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/viewpage',
    name: 'viewpage',
    component: ViewPage,
  },
  {
    path: '/userlist',
    name: 'userlist',
    component: Userlist,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/categorylist',
    name: 'categorylist',
    component: Categorylist,
  },
  {
    path: '/createcategory',
    name: 'categorycreate',
    component: CreateCategory,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/updatecategory/:id',
    name: 'updatecategory',
    component: UpdateCategory,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/productlist',
    name: 'productlist',
    component: ProductList,
  },
  {
    path: '/createproduct',
    name: 'createproduct',
    component: CreateProduct,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/updateproduct/:id',
    name: 'updateproduct',
    component: UpdateProduct,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/productdetail/:id',
    name: 'productdetail',
    component: ProductDetail,
  },
  {
    path: '/stockproductlist',
    name: 'stockproductlist',
    component: StockProductList,
  },
  {
    path: '/dashboardadmin',
    name: 'dashboardadmin',
    component: DashboardAdmin,
  },
  {
    path: '/productvariantlist',
    name: 'productvariantlist',
    component: ProductVariantList,
  },
  {
    path: '/createproductvariant',
    name: 'createproductvarinat',
    component: CreateProductVariant,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/updateproductvariant/:id',
    name: 'updateproductvariant',
    component: UpdateProductVariant,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/createstockproduct',
    name: 'createstockproduct',
    component: CreateStockProduct,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/paymentmethodlist',
    name: 'paymentmethodlist',
    component: PaymentMethodList,
  },
  {
    path: '/createpaymentmethod',
    name: 'createpaymentmethod',
    component: CreatePaymentMethod,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/updatepaymentmethod/:id',
    name: 'updatepaymentmethod',
    component: UpdatePaymentMethod,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/payment',
    name: 'payment',
    component: Payment,
  },
  {
    path: '/orderlist',
    name: 'orderlist',
    component: OrderList,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/shoppinghistory',
    name: 'shoppinghistory',
    component: ShoppingHistory,
    meta: {
      requiresAuth: true,
      role: 'customer',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protect route  role
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.authentication) {
    return { name: 'Login' };
  }
  if (to.meta.role === 'admin' && !authStore.admin) {
    return { name: 'Login' };
  }

  if (to.meta.role === 'customer' && !authStore.customer) {
    return { name: 'Login' };
  }
  return true;
});
export default router;
