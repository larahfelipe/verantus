<template>
  <div
    v-if="asset"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div class="space-y-6">
        <div class="flex items-start gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500/20 text-white dark:text-emerald-400 text-sm font-bold tracking-[0.1em] shadow-md overflow-hidden bg-white dark:bg-zinc-800"
          >
            <img
              v-if="logoUrl"
              :src="logoUrl"
              :alt="asset.profile.name"
              class="h-full w-full object-contain p-1 bg-white"
              @error="handleLogoError"
            />
            <span v-else>{{ logoInitials }}</span>
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1
                class="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
              >
                {{ asset.profile.name }}
              </h1>
              <span class="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
                {{ displaySymbol }}
              </span>
            </div>
            <div
              class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-neutral-500 dark:text-neutral-400"
            >
              <span class="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">{{
                asset.profile.exchange
              }}</span>
              <span>•</span>
              <span>{{ asset.profile.sector }}</span>
              <span>•</span>
              <span>{{ asset.profile.industry }}</span>
              <span>•</span>
              <span>{{ asset.profile.country }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
          <div>
            <div class="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Market Cap
            </div>
            <div class="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {{ formatAmount(asset.metrics.valuation.enterpriseValue) }}
            </div>
          </div>
          <div>
            <div class="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Fulltime Employees
            </div>
            <div class="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {{ asset.profile.employees ? asset.profile.employees.toLocaleString() : '—' }}
            </div>
          </div>
          <div>
            <div class="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Website
            </div>
            <a
              v-if="asset.profile.website"
              :href="asset.profile.website"
              target="_blank"
              rel="noreferrer"
              class="mt-1 block truncate text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
            >
              {{ displayWebsite }}
            </a>
            <div v-else class="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              —
            </div>
          </div>
          <div>
            <div class="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Currency
            </div>
            <div class="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {{ asset.profile.currency }}
            </div>
          </div>
        </div>

        <div class="border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <p
            class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 transition-all duration-300"
            :class="isExpanded ? '' : 'line-clamp-3'"
          >
            {{ asset.profile.businessSummary }}
          </p>
          <button
            type="button"
            class="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? 'Hide profile' : 'Expand profile' }}
          </button>
        </div>
      </div>

      <div
        class="rounded-lg bg-neutral-50 dark:bg-zinc-800/40 p-6 flex flex-col justify-between border border-neutral-100/50 dark:border-neutral-800/50"
      >
        <div>
          <div class="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            Spot Price
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {{ displayCurrency }} {{ asset.profile.currentPrice?.toFixed(2) }}
            </span>
          </div>
          <div
            class="mt-2 inline-flex items-center gap-1 text-xs font-bold rounded-full px-2 py-0.5"
            :class="
              isPositiveChange
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            "
          >
            <span class="text-[10px]">{{ isPositiveChange ? '▲' : '▼' }}</span>
            <span
              >{{ isPositiveChange ? '+' : '' }}{{ asset.profile.priceChange?.toFixed(2) }} ({{
                isPositiveChange ? '+' : ''
              }}{{ asset.profile.priceChangePercent?.toFixed(2) }}%)</span
            >
          </div>
        </div>

        <div
          class="grid grid-cols-2 gap-4 border-t border-neutral-100 dark:border-neutral-800/80 pt-4 mt-6"
        >
          <div>
            <div class="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              Symbol
            </div>
            <div class="mt-1 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {{ displaySymbol }}
            </div>
          </div>
          <div>
            <div class="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              Trading exchange
            </div>
            <div class="mt-1 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {{ asset.profile.exchange }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { NormalizedAsset } from '../../../shared/types/domain';
import { parseCurrency } from '../../../shared/utils/parseCurrency';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const isExpanded = ref(false);
const logoFailed = ref(false);

watch(
  () => props.asset,
  () => {
    logoFailed.value = false;
  }
);

const logoUrl = computed(() => {
  if (logoFailed.value || !props.asset || !props.asset.profile.website) return '';
  try {
    const raw = props.asset.profile.website.trim();
    const regex = new RegExp('^(?:https?://)?(?:www\\.)?([^/?#:]+)', 'i');
    const match = raw.match(regex);
    if (match && match[1]) {
      return `https://www.google.com/s2/favicons?sz=128&domain=${match[1]}`;
    }
    return '';
  } catch (_) {
    return '';
  }
});

const handleLogoError = () => {
  logoFailed.value = true;
};

const displaySymbol = computed(() => {
  if (!props.asset) return '';
  const sym = props.asset.profile.symbol;
  return sym.endsWith('.SA') ? sym.split('.')[0] : sym;
});

const logoInitials = computed(() => {
  return displaySymbol.value.slice(0, 3).toUpperCase();
});

const displayWebsite = computed(() => {
  return props.asset?.profile.website.replace(/^https?:\/\/(www\.)?/, '') || '';
});

const displayCurrency = computed(() => {
  return parseCurrency(props.asset?.profile.currency || 'USD');
});

const isPositiveChange = computed(() => {
  return (props.asset?.profile.priceChangePercent || 0) >= 0;
});

const formatAmount = (val: number | null): string => {
  if (val === null) return '—';
  if (val >= 1e12) return `${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  return val.toLocaleString();
};
</script>
