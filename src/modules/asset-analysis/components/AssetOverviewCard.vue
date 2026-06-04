<template>
  <section
    v-if="asset"
    aria-labelledby="asset-overview-heading"
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
                id="asset-overview-heading"
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
              {{ formatCompactMoney(asset.metrics.valuation.marketCap, asset.profile.currency) }}
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
          <div class="relative">
            <p
              ref="summaryRef"
              class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 transition-all duration-300"
              :class="isExpanded ? '' : 'line-clamp-3'"
            >
              {{ asset.profile.businessSummary }}
            </p>

            <div
              v-if="isClamped && !isExpanded"
              class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent"
            />
          </div>

          <button
            v-if="isClamped || isExpanded"
            type="button"
            class="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
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
              {{ displayCurrency }}
              {{
                asset.profile.currentPrice !== null ? asset.profile.currentPrice.toFixed(2) : '—'
              }}
            </span>
          </div>

          <div
            v-if="asset.profile.priceChangePercent !== null"
            class="mt-2 inline-flex items-center gap-1 text-xs font-bold rounded-full px-2 py-0.5"
            :class="
              isPositiveChange
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            "
          >
            <span class="text-[10px]">{{ isPositiveChange ? '▲' : '▼' }}</span>

            <span
              >{{ isPositiveChange ? '+' : ''
              }}{{
                asset.profile.priceChange !== null ? asset.profile.priceChange.toFixed(2) : '—'
              }}
              ({{ formatSignedPercent(asset.profile.priceChangePercent) }})</span
            >
          </div>

          <div
            class="mt-5 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/60 grid grid-cols-3 gap-2 text-center"
          >
            <div>
              <div class="text-[8px] font-extrabold uppercase tracking-wider text-neutral-400">
                7d change
              </div>

              <div
                class="mt-1 text-xs font-bold"
                :class="changeColorClass(asset.profile.change7dPercent)"
              >
                {{ formatSignedPercent(asset.profile.change7dPercent) }}
              </div>
            </div>

            <div>
              <div class="text-[8px] font-extrabold uppercase tracking-wider text-neutral-400">
                1m change
              </div>

              <div
                class="mt-1 text-xs font-bold"
                :class="changeColorClass(asset.profile.change1mPercent)"
              >
                {{ formatSignedPercent(asset.profile.change1mPercent) }}
              </div>
            </div>

            <div>
              <div class="text-[8px] font-extrabold uppercase tracking-wider text-neutral-400">
                1y change
              </div>

              <div
                class="mt-1 text-xs font-bold"
                :class="changeColorClass(asset.profile.change1yPercent)"
              >
                {{ formatSignedPercent(asset.profile.change1yPercent) }}
              </div>
            </div>
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
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated, nextTick } from 'vue';

import type { NormalizedAsset } from '@/shared/types/domain';
import { formatCompactMoney } from '@/shared/utils/formatMoney';
import { formatSignedPercent } from '@/shared/utils/formatPercent';
import { parseCurrency } from '@/shared/utils/parseCurrency';

/** Captures the bare host (no scheme, www. or path) from a website URL. */
const WEBSITE_HOST_PATTERN = /^(?:https?:\/\/)?(?:www\.)?([^/?#:]+)/i;

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const isExpanded = ref(false);
const isClamped = ref(false);
const summaryRef = ref<HTMLParagraphElement | null>(null);
const logoFailed = ref(false);

function checkClamped(): void {
  const el = summaryRef.value;
  if (!el) {
    isClamped.value = false;
    return;
  }
  isClamped.value = el.scrollHeight > el.clientHeight;
}

onMounted(checkClamped);
onUpdated(() => nextTick(checkClamped));

watch(
  () => props.asset,
  () => {
    isExpanded.value = false;
    logoFailed.value = false;
    nextTick(checkClamped);
  }
);

const logoUrl = computed(() => {
  if (logoFailed.value || !props.asset || !props.asset.profile.website) return '';
  const host = props.asset.profile.website.trim().match(WEBSITE_HOST_PATTERN)?.[1];
  return host ? `https://www.google.com/s2/favicons?sz=128&domain=${host}` : '';
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

const changeColorClass = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return 'text-neutral-400';
  return val >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
};
</script>
