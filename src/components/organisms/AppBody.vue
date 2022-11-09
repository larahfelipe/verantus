<template>
  <div class="app-body-wrapper">
    <CompanyOverviewSection :data="overviewData" />

    <div class="company-stock-chart-and-statistics-wrapper">
      <div class="company-stock-chart-and-time-series-statistics-wrapper">
        <CompanyStockChartSection />
        <CompanyStockStatisticsSection
          :data="stockStatisticsData.baseStatistics"
        />
      </div>

      <CompanyFinancialStatisticsSection
        :data="stockStatisticsData.financialStatistics"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CompanyFinancialStatisticsSection from '@/components/molecules/CompanyFinancialStatisticsSection.vue';
import CompanyOverviewSection from '@/components/molecules/CompanyOverviewSection.vue';
import CompanyStockChartSection from '@/components/molecules/CompanyStockChartSection.vue';
import CompanyStockStatisticsSection from '@/components/molecules/CompanyStockStatisticsSection.vue';
import type {
  StockChartDestructured,
  StockDataDestructured,
  Stock
} from '@/types';

export default defineComponent({
  name: 'AppBody',
  components: {
    CompanyOverviewSection,
    CompanyStockChartSection,
    CompanyStockStatisticsSection,
    CompanyFinancialStatisticsSection
  },
  computed: {
    stock() {
      const stockData = this.$store.getters[
        'stock/stockData'
      ] as StockDataDestructured;
      const stockChart = this.$store.getters[
        'stock/stockChart'
      ] as StockChartDestructured;

      return {
        data: stockData,
        chart: stockChart
      };
    },
    overviewData() {
      const { data, chart } = this.stock as Stock;

      const fmtData = {
        uuid: data.quoteType.uuid,
        companyName: data.quoteType.longName,
        companyBusinessSummary: data.assetProfile.longBusinessSummary,
        companyWebsite: data.assetProfile.website,
        stockSymbol: data.quoteType.symbol,
        stockExchange: data.quoteType.exchange,
        stockFinancialCurrency: data.financialData.financialCurrency,
        currentStockPrice: data.financialData.currentPrice.fmt,
        stockPriceChangeSinceOpen: {
          value: (
            data.financialData.currentPrice.raw - chart.meta.previousClose
          ).toFixed(2),
          percentage: (
            (data.financialData.currentPrice.raw / chart.meta.previousClose -
              1) *
            100
          ).toFixed(2)
        }
      };

      return fmtData;
    },
    stockStatisticsData() {
      const { data, chart } = this.stock as Stock;

      const fmtData = {
        baseStatistics: {
          analystRecommendation: data.financialData.recommendationKey,
          previousClosePrice: chart.meta.previousClose,
          fiftyTwoWeekChange: data.defaultKeyStatistics['52WeekChange'].raw,
          fiftyTwoWeekHigh: data.financialData.targetMeanPrice.fmt,
          fiftyTwoWeekLow: data.financialData.targetLowPrice.fmt,
          stockFinancialCurrency: data.financialData.financialCurrency
        },
        financialStatistics: {
          enterpriseValue: data.defaultKeyStatistics.enterpriseValue.fmt,
          forwardPriceToEarnings: data.defaultKeyStatistics.forwardPE.fmt,
          pegRatio: data.defaultKeyStatistics.pegRatio.fmt,
          priceToBook: data.defaultKeyStatistics.priceToBook.fmt,
          enterpriseValueToRevenue:
            data.defaultKeyStatistics.enterpriseToRevenue.fmt,
          enterpriseValueToEbitda:
            data.defaultKeyStatistics.enterpriseToEbitda.fmt,
          fiscalYearEnds: data.defaultKeyStatistics.lastFiscalYearEnd.fmt,
          mostRecentQuarter: data.defaultKeyStatistics.mostRecentQuarter.fmt,
          profitMargin: data.financialData.profitMargins.fmt,
          operatingMargin: data.financialData.operatingMargins.fmt,
          revenue: data.financialData.totalRevenue.fmt,
          revenuePerShare: data.financialData.revenuePerShare.fmt,
          quarterlyRevenueGrowth: data.financialData.revenueGrowth.fmt,
          grossProfit: data.financialData.grossProfits.fmt,
          ebitda: data.financialData.ebitda.fmt,
          netIncomeToCommon: data.defaultKeyStatistics.netIncomeToCommon.fmt,
          dilutedEarningsPerShare: data.defaultKeyStatistics.trailingEps.fmt,
          quarterlyEarningsGrowth:
            data.defaultKeyStatistics.quarterlyEarningsGrowth,
          returnOnAssets: data.financialData.returnOnAssets.fmt,
          returnOnEquity: data.financialData.returnOnEquity.fmt,
          totalCash: data.financialData.totalCash.fmt,
          totalCashPerShare: data.financialData.totalCashPerShare.fmt,
          totalDebt: data.financialData.totalDebt.fmt,
          totalDebtToEquity: data.financialData.debtToEquity.fmt,
          currentRatio: data.financialData.currentRatio.fmt,
          operatingCashFlow: data.financialData.operatingCashflow.fmt,
          leveredFreeCashFlow: data.financialData.freeCashflow.fmt,
          sharesOutstanding: data.defaultKeyStatistics.sharesOutstanding.fmt,
          sharesFloat: data.defaultKeyStatistics.floatShares.fmt,
          sharesHeldByInsiders:
            data.defaultKeyStatistics.heldPercentInsiders.fmt,
          sharesHeldByInstitutions:
            data.defaultKeyStatistics.heldPercentInstitutions.fmt,
          dividendDate: data.defaultKeyStatistics.lastDividendDate.fmt,
          lastDividendValue: data.defaultKeyStatistics.lastDividendValue.fmt,
          lastSplitDate: data.defaultKeyStatistics.lastSplitDate.fmt,
          lastSplitFactor: data.defaultKeyStatistics.lastSplitFactor
        }
      };

      return fmtData;
    }
  }
});
</script>

<style scoped>
.app-body-wrapper {
  width: 100%;
  height: calc(100% - 5rem);

  display: flex;
  flex-direction: column;

  padding: 3rem;
}

.company-stock-chart-and-statistics-wrapper {
  width: 100%;
  height: 70%;

  display: flex;
  justify-content: space-between;
}

.company-stock-chart-and-time-series-statistics-wrapper {
  width: 70%;

  display: flex;
  flex-direction: column;
}

@media (max-width: 1550px) {
  .company-stock-chart-and-statistics-wrapper {
    height: 70vh;

    margin-top: 5rem;
  }
}
@media (max-width: 1190px) {
  .company-stock-chart-and-statistics-wrapper {
    height: 100%;

    flex-direction: column;

    margin-top: 3rem;
    gap: 1.5rem;
  }
  .company-stock-chart-and-time-series-statistics-wrapper {
    width: 100%;

    flex-direction: column;
  }
}
@media (max-width: 770px) {
  .app-body-wrapper {
    padding: 1rem;
  }
  .company-stock-chart-and-statistics-wrapper {
    margin-top: 1rem;
  }
}
</style>
