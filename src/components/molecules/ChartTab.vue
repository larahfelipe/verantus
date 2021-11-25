<template>
  <div class="chart-wrapper">
    <apexchart
      width="100%"
      height="580px"
      type="area"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { StockChartTabProps } from '@/types';

export default defineComponent({
  name: 'ChartTab',
  props: {
    data: {
      type: Object,
      required: true
    }
  } as StockChartTabProps,
  computed: {
    stockQuotation() {
      const quoteValues = this.data.indicators.quote[0].open as any[];
      const timestampValues = this.data.timestamp as number[];

      return quoteValues.map((value, i) =>
        value && typeof value === 'number'
          ? [timestampValues[i], value.toFixed(2)]
          : [timestampValues[i], quoteValues[i - 1].toFixed(2)]
      ) as number[][];
    },
    chartOptions() {
      return {
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            formatter: (value: number) => this.parseTime(value)
          }
        },
        yaxis: {
          labels: {
            formatter: (value: number) => {
              const symbol = this.data.meta.symbol as string;
              const fmtPrice = '$' + value.toFixed(2);

              return symbol.endsWith('.SA') ? 'R' + fmtPrice : fmtPrice;
            }
          }
        },
        colors: ['#00c853'],
        stroke: {
          show: true,
          curve: 'straight',
          width: 3
        }
      };
    },
    chartSeries() {
      return [
        {
          name: 'Price',
          data: this.stockQuotation
        }
      ];
    }
  },
  methods: {
    parseTime(timestamp: number) {
      const date = new Date(timestamp * 1000);
      const hours = date.getHours();
      const minutes = '0' + date.getMinutes();

      return hours + ':' + minutes.substr(-2);
    }
  }
});
</script>
