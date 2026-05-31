<template>
  <div
    v-if="asset"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4"
    >
      <div>
        <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Price History</h2>
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

      <div class="flex flex-wrap items-center gap-1 bg-neutral-100 dark:bg-zinc-800 rounded-xl p-1">
        <button
          v-for="tf in timeframes"
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

    <div class="relative mt-5 w-full h-[320px] md:h-[380px]">
      <div
        v-if="stockStore.isLoading"
        class="absolute inset-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-lg z-10 transition-all duration-300"
      >
        <div
          class="h-8 w-8 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"
        />
        <span class="text-[10px] font-bold text-neutral-500 mt-2">Updating history...</span>
      </div>
      <canvas ref="canvasRef" role="img" aria-label="Stock price history chart">
        Interactive stock price chart showing historic daily closing values over time.
      </canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

import { Chart, registerables } from 'chart.js';

import type { NormalizedAsset } from '../../../shared/types/domain';
import { parseCurrency } from '../../../shared/utils/parseCurrency';
import { useStockStore } from '../../../stores/stockStore';
import { useThemeStore } from '../../../stores/themeStore';

Chart.register(...registerables);

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const stockStore = useStockStore();
const themeStore = useThemeStore();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const timeframes = [
  { label: '1D', value: '1d' },
  { label: '5D', value: '5d' },
  { label: '1M', value: '1mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' }
];

const displayCurrency = computed(() => {
  return parseCurrency(props.asset?.profile.currency || 'USD');
});

const latestClose = computed(() => {
  if (!props.asset || props.asset.history.length === 0) return '—';
  const hist = props.asset.history;
  const lastVal = hist[hist.length - 1].close;
  return lastVal !== null ? lastVal.toFixed(2) : '—';
});

const activeRangeLabel = computed(() => {
  const matched = timeframes.find((t) => t.value === stockStore.range);
  return matched ? matched.label : stockStore.range;
});

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
  const labels = history.map((h) => h.date);
  const data = history.map((h) => h.close as number);

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
          data,
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
            display: false
          },
          ticks: {
            color: labelColor,
            font: {
              family: 'Geist, sans-serif',
              size: 10,
              weight: 'bold'
            },
            maxTicksLimit: 6
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
