<template>
  <div class="company-stock-chart-wrapper">
    <apexchart
      width="100%"
      height="100%"
      type="area"
      :options="chartOptions"
      :series="[
        {
          data: [
            [1, 4],
            [2, 5],
            [3, 6],
            [4, 7],
            [5, 8],
            [6, 9]
          ]
        }
      ]"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CompanyStockChartSection',
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    chartOptions() {
      return {
        xaxis: {
          seriesName: 'Time',
          labels: {
            show: false
            // formatter: (value: number) => 'Time: ' + this.parseTime(value)
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          seriesName: 'Price',
          labels: {
            // formatter: (value: number) => {
            //   const symbol = this.data.meta.symbol as string;
            //   const fmtPrice = '$ ' + value.toFixed(2);
            //   return symbol.endsWith('.SA') ? 'R' + fmtPrice : fmtPrice;
            // }
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
            fontSize: '12px'
          },
          onDatasetHover: {
            highlightDataSeries: false
          },
          x: {
            show: true,
            format: 'dd MMM'
            // formatter: undefined
          },
          y: {
            formatter: undefined,
            title: {
              // formatter: (seriesName) => seriesName
            }
          },
          marker: {
            show: false
          },
          fixed: {
            enabled: false,
            position: 'topRight'
          }
        }
      };
    }
  }
});
</script>

<style scoped>
.company-stock-chart-wrapper {
  height: 80%;

  margin-top: -4.5rem;

  padding-right: 2rem;
}
</style>
