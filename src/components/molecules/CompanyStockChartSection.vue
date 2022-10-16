<template>
  <div class="company-stock-chart-wrapper">
    <apexchart
      width="100%"
      height="100%"
      type="area"
      :series="chartSeries"
      :options="chartOptions"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { StockChartDestructured } from '@/types';

export default defineComponent({
  name: 'CompanyStockChartSection',
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    stockChart() {
      return this.$store.getters['stock/stockChart'].chart.result[0];
    },
    chartSeries() {
      const { indicators, timestamp } = this
        .stockChart as StockChartDestructured;

      const quoteValues = indicators.quote[0].close as any[];
      const timestampValues = timestamp as number[];

      const fmtStockQuotation: [number, number][] = quoteValues.map(
        (value, i) => [timestampValues[i], value?.toFixed(2)]
      );

      return [
        {
          data: fmtStockQuotation
        }
      ];
    },
    chartOptions() {
      return {
        xaxis: {
          seriesName: 'Timestamp',
          labels: {
            show: false,
            formatter: this.parseDate
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          seriesName: 'Stock price',
          labels: {
            formatter: (value: number) => value.toFixed(2)
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          show: false
        },
        colors:
          this.theme === 'dark'
            ? ['#009148', '#01c261']
            : ['#00c853', '#00ff80'],
        stroke: {
          show: true,
          curve: 'straight',
          width: 3
        },
        tooltip: {
          enabled: true,
          shared: true,
          followCursor: true,
          style: {
            fontSize: '14px'
          },
          y: {
            title: {
              formatter: () => ''
            }
          },
          marker: {
            show: true
          },
          fixed: {
            enabled: false,
            position: 'topRight'
          }
        }
      };
    }
  },
  methods: {
    parseDate(value: number) {
      return new Date(value * 1000).toLocaleString('en-US', {
        minute: 'numeric',
        hour: 'numeric',
        day: 'numeric',
        month: 'short'
      });
    }
  }
});
</script>

<style scoped>
.company-stock-chart-wrapper {
  height: 92.5%;

  margin-top: -4.5rem;

  padding-right: 2rem;
}
</style>
