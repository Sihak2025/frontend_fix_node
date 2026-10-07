
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { createOrder } from '../../service/orderService.js';
  import { getProductById } from '../../service/productService.js';

  const route = useRoute();
  const router = useRouter();

  const product = ref(null);
  const selectedVariant = ref(null);
  const quantity = ref(1);

  const isSubmitting = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  const hasVariants = computed(() => {
    return product.value?.variants?.length > 0;
  });

  const availableStock = computed(() => {
    if (!product.value) return 0;

    if (hasVariants.value) {
      if (!selectedVariant.value) return 0;

      return Number(selectedVariant.value.stock ?? 0);
    }

    return Number(product.value.stock ?? 0);
  });

  const isOutOfStock = computed(() => {
    return availableStock.value <= 0;
  });

  const isStockInsufficient = computed(() => {
    return Number(quantity.value) > availableStock.value;
  });

  const totalAmount = computed(() => {
    if (!product.value) return '0.00';

    return (Number(product.value.price) * Number(quantity.value)).toFixed(2);
  });

  const loadProduct = async () => {
    const productId = route.params.id;

    if (!productId) {
      errorMessage.value = 'Product not found.';
      return;
    }

    try {
      errorMessage.value = '';

      const response = await getProductById(productId);

      console.log('PRODUCT RESPONSE:', response);

      const productData = response?.data;

      if (!response?.success || !productData?.id) {
        throw new Error(
          response?.message || response?.error || 'Product not found.',
        );
      }

      product.value = {
        ...productData,

        price: Number(productData.price),

        stock: Number(
          productData.stock ??
            productData.balance ??
            productData.stock_quantity ??
            0,
        ),

        variants: Array.isArray(productData.variants)
          ? productData.variants.map((variant) => ({
              ...variant,
              stock: Number(variant.stock ?? 0),
            }))
          : [],
      };

      console.log('PRODUCT:', product.value);
      console.log('VARIANTS:', product.value.variants);
      if (hasVariants.value) {
        const firstAvailableVariant = product.value.variants.find(
          (variant) => Number(variant.stock) > 0,
        );

        if (firstAvailableVariant) {
          selectedVariant.value = firstAvailableVariant;
        }
      }

      quantity.value = 1;
    } catch (error) {
      console.error('Load product error:', error);

      errorMessage.value =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to load product.';
    }
  };

  onMounted(() => {
    loadProduct();
  });

  const selectVariant = (variant) => {
    if (Number(variant.stock) <= 0) {
      return;
    }

    selectedVariant.value = variant;

  
    quantity.value = 1;

    errorMessage.value = '';
    successMessage.value = '';
  };
  const increaseQty = () => {
    if (quantity.value < availableStock.value) {
      quantity.value++;
    }
  };

  const decreaseQty = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };

  const handleQuantityInput = () => {
    let value = Number(quantity.value);

    if (!Number.isInteger(value) || value < 1) {
      quantity.value = 1;
      return;
    }

    if (value > availableStock.value) {
      quantity.value = availableStock.value;
    }
  };
  const handleOrder = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!product.value?.id) {
      errorMessage.value = 'Product not found.';
      return;
    }

    if (hasVariants.value && !selectedVariant.value?.id) {
      errorMessage.value = 'Please select a size.';
      return;
    }

    if (availableStock.value <= 0) {
      if (selectedVariant.value) {
        errorMessage.value = `Size ${selectedVariant.value.size} is out of stock.`;
      } else {
        errorMessage.value = 'This product is currently out of stock.';
      }

      return;
    }

    if (
      !Number.isInteger(Number(quantity.value)) ||
      Number(quantity.value) <= 0
    ) {
      errorMessage.value = 'Quantity must be greater than 0.';
      return;
    }

    if (Number(quantity.value) > availableStock.value) {
      errorMessage.value = `Only ${availableStock.value} item(s) available.`;
      return;
    }
    if (isSubmitting.value) {
      return;
    }

    try {
      isSubmitting.value = true;
      const item = {
        productId: product.value.id,
        quantity: Number(quantity.value),
      };
      if (hasVariants.value) {
        item.productVariantId = selectedVariant.value.id;
      }

      const payload = {
        items: [item],
      };

      console.log('ORDER PAYLOAD:', payload);

      const response = await createOrder(payload);

      console.log('ORDER RESPONSE:', response);

      if (!response?.success) {
        throw new Error(
          response?.error || response?.message || 'Failed to create order.',
        );
      }
      if (!response?.data?.id) {
        throw new Error('Order ID not found.');
      }
      const order = response.data;
      const amount = Number(order.totalAmout);
      if (Number.isNaN(amount)) {
        throw new Error('Invalid order amount.');
      }
      successMessage.value = 'Order created successfully!';
      setTimeout(() => {
        router.push({
          path: '/payment',
          query: {
            orderId: order.id,
            amount: amount.toFixed(2),
          },
        });
      }, 800);
    } catch (error) {
      console.error('Create order error:', error);

      errorMessage.value =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.errors
          ?.map(({ field, message }) => `${field}: ${message}`)
          .join(', ') ||
        error.message ||
        'Failed to create order.';
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-12">
    <div class="mx-auto max-w-3xl">
      <div class="mb-8 flex w-full items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-900">Place Order</h1>

          <p class="mt-2 text-slate-500">
            Review your product before placing the order.
          </p>
        </div>
        <router-link to="/viewpage">
          <div
            class="flex h-10 w-25 items-center justify-center rounded-[15px] bg-blue-600 duration-300 hover:scale-110 hover:bg-blue-400">
            <h1
              class="flex items-center justify-center gap-2 text-[17px] font-bold text-gray-200">
              Back
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
              </svg>
            </h1>
          </div>
        </router-link>
      </div>
      <div
        v-if="errorMessage"
        class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 font-medium text-rose-700">
        {{ errorMessage }}
      </div>
      <div
        v-if="successMessage"
        class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-medium text-emerald-700">
        {{ successMessage }}
      </div>
      <div
        v-if="product?.id"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div class="grid md:grid-cols-2">
          <div class="bg-slate-100 p-8">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-80 w-full rounded-2xl object-cover" />
              <div class="w-50 h-50 bg-blue-400"></div>
          </div>
          <div class="flex flex-col justify-center p-8">
            <p
              class="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-600">
              Product
            </p>
            <h2 class="text-2xl font-black text-slate-900">
              {{ product.name }}
            </h2>
            <p class="mt-3 text-2xl font-black text-indigo-600">
              ${{ Number(product.price).toFixed(2) }}
            </p>
            <div
              v-if="hasVariants"
              class="mt-6">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-sm font-bold text-slate-700">Select Size</p>
                <span
                  v-if="selectedVariant"
                  class="text-sm font-semibold text-indigo-600">
                  Selected:
                  {{ selectedVariant.size }}
                </span>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="variant in product.variants"
                  :key="variant.id"
                  type="button"
                  @click="selectVariant(variant)"
                  :disabled="Number(variant.stock) <= 0 || isSubmitting"
                  class="min-w-[60px] rounded-xl border px-5 py-3 text-sm font-bold transition"
                  :class="
                    selectedVariant?.id === variant.id
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : Number(variant.stock) <= 0
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600'
                  ">
                  {{ variant.size }}
                </button>
              </div>
            </div>
            <div class="mt-5">
              <div
                v-if="selectedVariant && availableStock > 0"
                class="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span>

                Size {{ selectedVariant.size }}: {{ availableStock }} item(s)
                available
              </div>
              <div
                v-else-if="selectedVariant && availableStock <= 0"
                class="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
                <span class="h-2 w-2 rounded-full bg-rose-500"></span>

                Size {{ selectedVariant.size }}
                is Out of Stock
              </div>
              <div
                v-else-if="!hasVariants && availableStock > 0"
                class="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span>

                {{ availableStock }}
                item(s) available
              </div>
              <div
                v-else-if="hasVariants && !selectedVariant"
                class="rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
                Please select a size.
              </div>
              <div
                v-else
                class="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
                <span class="h-2 w-2 rounded-full bg-rose-500"></span>

                Out of Stock
              </div>
            </div>
            <div class="mt-8">
              <p class="mb-3 text-sm font-bold text-slate-700">Quantity</p>
              <div
                class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  @click="decreaseQty"
                  :disabled="quantity <= 1 || isOutOfStock || isSubmitting"
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  -
                </button>
                <span class="w-14 text-center font-bold text-slate-900">
                  {{ quantity }}
                </span>
                <button
                  type="button"
                  @click="increaseQty"
                  :disabled="
                    quantity >= availableStock || isOutOfStock || isSubmitting
                  "
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  +
                </button>
              </div>
              <p
                v-if="isStockInsufficient && !isOutOfStock"
                class="mt-2 text-sm font-medium text-rose-600">
                Only {{ availableStock }} item(s) available.
              </p>
            </div>
            <div
              class="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <span class="font-bold text-slate-500"> Total </span>
              <span class="text-2xl font-black text-slate-900">
                ${{ totalAmount }}
              </span>
            </div>
            <button
              type="button"
              @click="handleOrder"
              :disabled="
                isSubmitting ||
                isOutOfStock ||
                isStockInsufficient ||
                (hasVariants && !selectedVariant)
              "
              class="mt-6 w-full rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none">
              <span v-if="isSubmitting"> Creating Order... </span>
              <span v-else-if="hasVariants && !selectedVariant">
                Select Size
              </span>
              <span v-else-if="isOutOfStock"> Out of Stock </span>
              <span v-else> Place Order </span>
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
        class="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg">
        <p class="font-medium text-slate-500">Product not found.</p>
        <button
          type="button"
          @click="router.back()"
          class="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>
