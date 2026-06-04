<template>
  <section
    v-if="asset"
    aria-labelledby="price-history-heading"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4"
    >
      <div>
        <h2
          id="price-history-heading"
          class="text-sm font-bold uppercase tracking-wider text-neutral-400"
        >
          Price History
        </h2>

        <div class="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <div class="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Last Close
            </div>

            <div class="text-base font-extrabold text-neutral-900 dark:text-white mt-0.5">
              {{ displayCurrency }} {{ latestClose }}
            </div>
          </div>

          <div>
            <div class="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              History Range
            </div>

            <div class="text-base font-extrabold text-neutral-900 dark:text-white mt-0.5">
              {{ activeRangeLabel }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="w-fit flex flex-wrap items-center gap-1 bg-neutral-100 dark:bg-zinc-800 rounded-xl p-1"
      >
        <button
          v-for="tf in config.CHART.TIMEFRAMES"
          :key="tf.value"
          type="button"
          class="rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all duration-200"
          :aria-label="'Set history range to ' + tf.label"
          :aria-pressed="stockStore.range === tf.value ? 'true' : 'false'"
          :class="
            stockStore.range === tf.value
              ? 'bg-white dark:bg-zinc-700 text-neutral-950 dark:text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          "
          @click="changeRange(tf.value)"
        >
          {{ tf.label }}
        </button>
      </div>
    </div>

    <figure class="relative mt-5 mb-0 w-full h-[320px] md:h-[380px]">
      <div
        v-if="stockStore.isLoading"
        class="absolute inset-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-lg z-10 transition-all duration-300"
        role="status"
        aria-label="Updating price history"
      >
        <div
          class="h-8 w-8 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"
          aria-hidden="true"
        />

        <span class="text-[10px] font-bold text-neutral-500 mt-2">Updating history...</span>
      </div>

      <div
        v-if="!stockStore.isLoading && !hasHistory"
        class="absolute inset-0 flex flex-col items-center justify-center rounded-lg text-center"
      >
        <span class="text-xs font-bold text-neutral-500">Price history unavailable</span>

        <span class="text-[10px] text-neutral-400 mt-1"
          >No close series was returned by the data source for this range.</span
        >
      </div>

      <canvas v-show="hasHistory" ref="canvasRef" role="img" :aria-label="chartAriaLabel">
        {{ chartAriaLabel }}
      </canvas>

      <figcaption class="sr-only">
        Line chart of {{ displayCurrency }} closing prices over the {{ activeRangeLabel }} range.
      </figcaption>
    </figure>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { Chart, registerables } from 'chart.js';

import config from '@/config';
import type { HistoricalPoint, NormalizedAsset } from '@/shared/types/domain';
import { parseCurrency } from '@/shared/utils/parseCurrency';
import { useStockStore } from '@/stores/stockStore';
import { useThemeStore } from '@/stores/themeStore';

Chart.register(...registerables);

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const stockStore = useStockStore();
const themeStore = useThemeStore();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const displayCurrency = computed(() => {
  return parseCurrency(props.asset?.profile.currency || 'USD');
});

type AxisGranularity = 'hour' | 'day' | 'week' | 'month' | 'year';

function axisBucketId(date: Date, granularity: AxisGranularity): number {
  const ms = date.getTime();
  switch (granularity) {
    case 'hour':
      return Math.floor(ms / config.TIME.MS_PER_HOUR);
    case 'day':
      return Math.floor(ms / config.TIME.MS_PER_DAY);
    case 'week':
      return Math.floor(ms / config.TIME.MS_PER_WEEK);
    case 'month':
      return date.getFullYear() * 12 + date.getMonth();
    case 'year':
      return date.getFullYear();
  }
}

function axisBucketLabel(date: Date, granularity: AxisGranularity): string {
  switch (granularity) {
    case 'hour':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case 'day':
    case 'week':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'short' });
    case 'year':
      return String(date.getFullYear());
  }
}

function buildAxisLabels(history: HistoricalPoint[], range: string): string[] {
  const granularity =
    config.CHART.RANGE_AXIS_GRANULARITY[range] ?? config.CHART.DEFAULT_AXIS_GRANULARITY;
  let previousBucket: number | null = null;
  return history.map((point) => {
    const date = new Date(point.timestamp * 1000);
    const bucket = axisBucketId(date, granularity);
    if (bucket === previousBucket) return '';
    previousBucket = bucket;
    return axisBucketLabel(date, granularity);
  });
}

const hasHistory = computed(() => (props.asset?.history.length ?? 0) > 0);

const latestClose = computed(() => {
  const hist = props.asset?.history;
  if (!hist || hist.length === 0) return '—';
  for (let i = hist.length - 1; i >= 0; i -= 1) {
    const close = hist[i].close;
    if (close !== null) return close.toFixed(2);
  }
  return '—';
});

const activeRangeLabel = computed(() => {
  const matched = config.CHART.TIMEFRAMES.find((t) => t.value === stockStore.range);
  return matched ? matched.label : stockStore.range;
});

const chartAriaLabel = computed(
  () =>
    `Price history line chart over the ${activeRangeLabel.value} range, last close ${displayCurrency.value} ${latestClose.value}.`
);

const changeRange = async (rangeVal: string) => {
  await stockStore.changeRange(rangeVal);
};

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};

const renderChart = () => {
  destroyChart();
  if (!props.asset || props.asset.history.length === 0 || !canvasRef.value) return;

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const history = props.asset.history;
  const labels = history.map((point) => point.date);
  const axisLabels = buildAxisLabels(history, stockStore.range);
  // Close can be null on illiquid/holiday buckets; Chart.js renders gaps natively.
  const closePrices: (number | null)[] = history.map((point) => point.close);

  const gradient = ctx.createLinearGradient(0, 0, 0, 350);
  const isDark = themeStore.currentTheme === 'dark';

  gradient.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.18)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

  const gridColor = isDark ? 'rgba(63, 63, 70, 0.35)' : 'rgba(148, 163, 184, 0.22)';
  const labelColor = isDark ? '#cbd5e1' : '#64748b';
  const currencySymbol = displayCurrency.value;

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Close Price',
          data: closePrices,
          spanGaps: true,
          borderColor: '#10b981',
          borderWidth: 2.5,
          fill: true,
          backgroundColor: gradient,
          tension: 0.2,
          pointRadius: history.length > 50 ? 0 : 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#10b981',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#f8fafc' : '#0f172a',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (context) => {
              if (context.parsed.y !== null) {
                return `${currencySymbol} ${context.parsed.y.toFixed(2)}`;
              }
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawTicks: false
          },
          ticks: {
            color: labelColor,
            font: {
              family: 'Geist, sans-serif',
              size: 10,
              weight: 'bold'
            },
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            callback: (_value, index) => axisLabels[index] ?? ''
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: labelColor,
            font: {
              family: 'Geist, sans-serif',
              size: 10,
              weight: 'bold'
            },
            callback: (value) => {
              return `${currencySymbol} ${Number(value).toLocaleString()}`;
            }
          }
        }
      }
    }
  });
};

watch(
  () => props.asset,
  () => {
    renderChart();
  },
  { deep: true }
);

watch(
  () => themeStore.currentTheme,
  () => {
    renderChart();
  }
);

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  destroyChart();
});
</script>
