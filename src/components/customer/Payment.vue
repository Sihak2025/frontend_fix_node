<!-- @format -->

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { createPayment } from '../../service/paymentService';
  import { getAllPaymentMethod } from '../../service/paymentMethodService';

  const route = useRoute();
  const router = useRouter();

  const isSubmitting = ref(false);
  const paymentMethods = ref([]);
  const imageErrors = ref({});

  const paymentForm = ref({
    orderId: route.query.orderId || '',
    paymentMethodId: '',
    amount: route.query.amount || '',
  });

  const formattedAmount = computed(() => {
    return Number(paymentForm.value.amount || 0).toFixed(2);
  });

  const fetchPaymentMethods = async () => {
    try {
      const response = await getAllPaymentMethod();

      const data = response?.data || response || [];

      paymentMethods.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      paymentMethods.value = [];
    }
  };
  const getImageUrl = (method) => {
    const image = method?.image || method?.logo;

    if (!image) {
      return '';
    }
    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:')
    ) {
      return image;
    }

    return `http://localhost:3000${
      image.startsWith('/') ? image : `/${image}`
    }`;
  };
  const handleImageError = (methodId) => {
    imageErrors.value[methodId] = true;
  };

  const handlePaymentSubmit = async () => {
    if (!paymentForm.value.paymentMethodId) {
      alert('សូមជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់');
      return;
    }

    if (!paymentForm.value.orderId) {
      alert('Order ID មិនត្រឹមត្រូវ');
      return;
    }

    if (!Number(paymentForm.value.amount)) {
      alert('ចំនួនទឹកប្រាក់មិនត្រឹមត្រូវ');
      return;
    }

    try {
      isSubmitting.value = true;

      await createPayment({
        orderId: paymentForm.value.orderId,
        paymentMethodId: paymentForm.value.paymentMethodId,
        amount: Number(paymentForm.value.amount),
      });

      alert('ការទូទាត់ប្រាក់បានជោគជ័យ!');

      router.push('/shoppinghistory');
    } catch (error) {
      console.error('Payment failed:', error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'ការទូទាត់ប្រាក់មិនជោគជ័យ សូមព្យាយាមម្តងទៀត។',
      );
    } finally {
      isSubmitting.value = false;
    }
  };

  const goBack = () => {
    router.back();
  };

  onMounted(() => {
    fetchPaymentMethods();
  });
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"></div>
      <div
        class="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl"></div>
    </div>
    <div class="relative mx-auto max-w-6xl">
      <div class="mb-8">
        <button
          type="button"
          @click="goBack"
          class="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-sm">
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div
          class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div
              class="mb-3 inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
              <svg
                class="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1
              class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Secure Checkout
            </h1>
            <p
              class="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Choose your preferred payment method to securely complete your
              order.
            </p>
          </div>
          <div
            class="flex w-fit items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800">Secure Payment</p>

              <p class="mt-0.5 text-xs text-slate-400">SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-5">
        <div class="lg:col-span-3">
          <div
            class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div class="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div class="flex items-center gap-4">
                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">
                    Payment Method
                  </h2>
                  <p class="mt-0.5 text-xs text-slate-500">
                    Select how you want to pay
                  </p>
                </div>
              </div>
            </div>
            <form
              @submit.prevent="handlePaymentSubmit"
              class="px-6 py-6 sm:px-8">
              <div
                v-if="paymentMethods.length"
                class="space-y-3">
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  :class="[
                    'group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl border-2 p-4 transition-all duration-200',
                    paymentForm.paymentMethodId === method.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10'
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm',
                  ]">
                  <div
                    v-if="paymentForm.paymentMethodId === method.id"
                    class="absolute left-0 top-0 h-full w-1 bg-indigo-600"></div>
                  <div class="flex min-w-0 items-center gap-4">
                    <div class="relative shrink-0">
                      <input
                        type="radio"
                        name="paymentMethod"
                        :value="method.id"
                        v-model="paymentForm.paymentMethodId"
                        class="peer sr-only" />
                      <div
                        class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition-all duration-200 peer-checked:border-indigo-600 peer-checked:ring-4 peer-checked:ring-indigo-100">
                        <img
                          v-if="
                            (method.image || method.logo) &&
                            !imageErrors[method.id]
                          "
                          :src="getImageUrl(method)"
                          :alt="method.name || method.type || 'Payment method'"
                          class="h-full w-full object-contain p-2"
                          @error="handleImageError(method.id)" />
                        <svg
                          v-else
                          class="h-6 w-6 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p
                        class="truncate text-sm font-bold text-slate-900 transition group-hover:text-indigo-600">
                        {{ method.name || method.type || 'Payment Method' }}
                      </p>
                      <p
                        class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {{
                          method.description ||
                          'Fast, safe and encrypted payment'
                        }}
                      </p>
                      <span
                        v-if="method.type"
                        class="mt-2 inline-flex rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        {{ method.type }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
                    :class="
                      paymentForm.paymentMethodId === method.id
                        ? 'border-indigo-600 bg-indigo-600 text-white scale-105'
                        : 'border-slate-200 text-transparent'
                    ">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>
              <div
                v-else
                class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div
                  class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <svg
                    class="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z" />
                  </svg>
                </div>
                <p class="font-semibold text-slate-700">
                  No payment methods available
                </p>
                <p class="mt-1 text-sm text-slate-400">
                  Please try again later.
                </p>
              </div>
              <button
                type="submit"
                :disabled="isSubmitting || !paymentMethods.length"
                class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
                <svg
                  v-if="isSubmitting"
                  class="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4" />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>
                  {{
                    isSubmitting
                      ? 'Processing Payment...'
                      : `Pay $${formattedAmount} Now`
                  }}
                </span>
              </button>
            </form>
            <div
              class="border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8">
              <div
                class="flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-400">
                <svg
                  class="h-4 w-4 shrink-0 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                256-bit SSL encrypted & secure payment
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <div
            class="sticky top-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div
              class="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-widest text-indigo-200">
                    Order Summary
                  </p>
                  <h2 class="mt-1 text-xl font-black">Review & Pay</h2>
                </div>
                <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                      d="M9 14l6-6m-5-3h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2h1" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div
                class="mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p
                      class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Order Reference
                    </p>
                    <p class="mt-1 break-all text-sm font-bold text-slate-800">
                      #{{ paymentForm.orderId || 'N/A' }}
                    </p>
                  </div>
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5a3 3 0 016 0" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500"> Order amount </span>
                  <span class="font-semibold text-slate-800">
                    ${{ formattedAmount }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500"> Payment fee </span>
                  <span
                    class="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                    FREE
                  </span>
                </div>
                <div class="border-t border-dashed border-slate-200 pt-5">
                  <div class="flex items-end justify-between gap-3">
                    <div>
                      <p class="text-sm font-bold text-slate-700">Total</p>

                      <p class="mt-1 text-xs text-slate-400">Amount to pay</p>
                    </div>
                    <p
                      class="text-3xl font-black tracking-tight text-indigo-600">
                      ${{ formattedAmount }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-7 space-y-3 border-t border-slate-100 pt-6">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-xs font-medium text-slate-600">
                    Secure transaction
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span class="text-xs font-medium text-slate-600">
                    Fast payment processing
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-.836-.086-1.653-.248-2.44z" />
                    </svg>
                  </div>
                  <span class="text-xs font-medium text-slate-600">
                    Protected checkout
                  </span>
                </div>
              </div>
              <div
                v-if="paymentForm.paymentMethodId"
                class="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <p
                  class="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Selected Payment
                </p>

                <div class="mt-2 flex items-center gap-3">
                  <template
                    v-for="method in paymentMethods"
                    :key="method.id">
                    <template v-if="method.id === paymentForm.paymentMethodId">
                      <div
                        class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-indigo-100 bg-white">
                        <img
                          v-if="
                            (method.image || method.logo) &&
                            !imageErrors[method.id]
                          "
                          :src="getImageUrl(method)"
                          :alt="method.name"
                          class="h-full w-full object-contain p-1" />

                        <svg
                          v-else
                          class="h-5 w-5 text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>

                      <div>
                        <p class="text-sm font-bold text-indigo-900">
                          {{ method.name || method.type }}
                        </p>

                        <p class="text-xs text-indigo-500">Ready for payment</p>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 text-center">
        <p class="text-xs text-slate-400">
          By completing this payment, you agree to our
          <span class="font-semibold text-slate-500"> Terms & Conditions </span>
          and
          <span class="font-semibold text-slate-500"> Privacy Policy </span>
        </p>
      </div>
    </div>
  </div>
</template>
