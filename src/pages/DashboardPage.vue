<template>
  <div class="space-y-6">
    <div
      v-if="stockStore.isLoading && !stockStore.currentAsset"
      class="space-y-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading financial data"
    >
      <div
        class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
      >
        <div class="flex items-start gap-4">
          <div class="h-12 w-12 rounded-lg bg-neutral-200 dark:bg-zinc-800 shrink-0" />

          <div class="space-y-2 flex-grow">
            <div class="h-6 bg-neutral-200 dark:bg-zinc-800 rounded-md w-1/3" />

            <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded-md w-1/4" />
          </div>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 mt-4 border-t border-neutral-100 dark:border-neutral-800"
        >
          <div v-for="i in 4" :key="i" class="space-y-1.5">
            <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/2" />

            <div class="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div class="h-10 bg-neutral-200 dark:bg-zinc-800 rounded-lg w-1/2" />

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 h-[400px]"
        />

        <div
          class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 h-[400px]"
        />
      </div>
    </div>

    <div
      v-else-if="stockStore.error"
      role="alert"
      class="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10"
    >
      <svg
        class="w-12 h-12 text-rose-500 mb-4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <h3 class="text-lg font-black text-rose-600 dark:text-rose-400">Data Fetching Failed</h3>

      <p class="text-xs text-neutral-500 max-w-md mt-2">
        {{ stockStore.error }}
      </p>

      <button
        type="button"
        class="mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
        @click="retryFetch"
      >
        Retry Fetch
      </button>
    </div>

    <div v-else-if="stockStore.currentAsset" class="space-y-6">
      <AssetOverviewCard :asset="stockStore.currentAsset" />

      <div
        ref="tabNavRef"
        class="relative border-b border-neutral-200 dark:border-neutral-800 flex overflow-x-auto scrollbar-hide gap-0.5 -mb-px"
        role="tablist"
        aria-label="Platform sections"
        @keydown="onTabKeydown"
      >
        <button
          v-for="tab in tabs"
          :id="`tab-${tab.value}`"
          :key="tab.value"
          :ref="(el) => setTabRef(tab.value, el)"
          type="button"
          role="tab"
          class="px-4 py-2.5 font-bold text-xs tracking-wider uppercase transition-colors duration-150 focus:outline-none whitespace-nowrap shrink-0 border-b-2 border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          :class="{
            'text-neutral-900 dark:text-white !border-emerald-500': activeTab === tab.value
          }"
          :aria-selected="activeTab === tab.value ? 'true' : 'false'"
          :aria-controls="`panel-${tab.value}`"
          :tabindex="activeTab === tab.value ? 0 : -1"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="relative overflow-hidden">
        <Transition :name="transitionName" mode="out-in">
          <div
            v-if="activeTab === 'overview'"
            id="panel-overview"
            key="overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,600px)] gap-6"
          >
            <div class="space-y-6">
              <section
                aria-labelledby="overview-thesis-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
              >
                <div class="flex items-center justify-between mb-3">
                  <h3
                    id="overview-thesis-heading"
                    class="text-xs font-bold uppercase tracking-wider text-neutral-400"
                  >
                    Investment Thesis Executive Summary
                  </h3>

                  <DataQualityBadge :confidence="stockStore.currentAsset.provenance.thesis" />
                </div>

                <p
                  class="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  {{ stockStore.currentAsset.thesis.thesisSummary }}
                </p>

                <div
                  class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800"
                >
                  <div>
                    <span class="text-[10px] uppercase font-bold text-neutral-400"
                      >Competitive Moat</span
                    >

                    <span
                      class="block text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1"
                    >
                      {{ stockStore.currentAsset.thesis.moat.classification }}
                    </span>
                  </div>

                  <div>
                    <span class="text-[10px] uppercase font-bold text-neutral-400"
                      >Capital Allocation</span
                    >

                    <span
                      class="block text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1"
                    >
                      {{ stockStore.currentAsset.thesis.capitalAllocation.score }}/100 Score
                    </span>
                  </div>
                </div>
              </section>

              <StockHistoryChart :asset="stockStore.currentAsset" />
            </div>

            <div>
              <QuantitativeScoresCard :asset="stockStore.currentAsset" />
            </div>
          </div>

          <div
            v-else-if="activeTab === 'financials'"
            id="panel-financials"
            key="financials"
            role="tabpanel"
            aria-labelledby="tab-financials"
            class="space-y-6"
          >
            <div
              v-if="!stockStore.currentAsset.financialsHistory.length"
              class="rounded-xl bg-neutral-50 dark:bg-zinc-800/20 border border-neutral-200 dark:border-neutral-800 p-4 flex items-start gap-3"
            >
              <span class="text-neutral-400 text-sm shrink-0 mt-0.5">&#9432;</span>

              <div>
                <span class="text-xs font-bold text-neutral-700 dark:text-neutral-300 block"
                  >Annual statements unavailable</span
                >

                <span class="text-[11px] text-neutral-500 block mt-0.5"
                  >The data source did not return income, balance sheet or cash-flow history for
                  this asset. The ratios above are live; the multi-year tables below are
                  omitted.</span
                >
              </div>
            </div>

            <CondensedStatements :asset="stockStore.currentAsset" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section
                aria-labelledby="cagr-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-4"
              >
                <h4
                  id="cagr-heading"
                  class="text-xs font-bold uppercase tracking-wider text-neutral-400"
                >
                  Compounded Growth (CAGR)
                </h4>

                <div class="space-y-3">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-500 font-medium">Revenue CAGR (3Yr)</span>

                    <span class="font-bold text-neutral-800 dark:text-neutral-200">{{
                      formatPercent(stockStore.currentAsset.evolutionStats.cagrRevenue)
                    }}</span>
                  </div>

                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-500 font-medium">Net Income CAGR (3Yr)</span>

                    <span class="font-bold text-neutral-800 dark:text-neutral-200">{{
                      formatPercent(stockStore.currentAsset.evolutionStats.cagrNetIncome)
                    }}</span>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="trend-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-4"
              >
                <h4
                  id="trend-heading"
                  class="text-xs font-bold uppercase tracking-wider text-neutral-400"
                >
                  Trend & Volatility Analysis
                </h4>

                <div class="space-y-3">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-500 font-medium">Revenue Direction</span>

                    <span
                      class="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                    >
                      {{ stockStore.currentAsset.evolutionStats.trendRevenue }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-500 font-medium">Revenue Volatility</span>

                    <span class="font-bold text-neutral-800 dark:text-neutral-200">{{
                      formatPercent(stockStore.currentAsset.evolutionStats.volatilityRevenue)
                    }}</span>
                  </div>
                </div>
              </section>
            </div>

            <AnnualStatementsTable :asset="stockStore.currentAsset" />
          </div>

          <div
            v-else-if="activeTab === 'valuation'"
            id="panel-valuation"
            key="valuation"
            role="tabpanel"
            aria-labelledby="tab-valuation"
            class="space-y-6"
          >
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div class="xl:col-span-1">
                <ValuationMetricsCard :asset="stockStore.currentAsset" />
              </div>

              <section
                aria-labelledby="dcf-heading"
                class="xl:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
              >
                <div
                  class="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6 flex items-start justify-between gap-4"
                >
                  <div>
                    <h2
                      id="dcf-heading"
                      class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                    >
                      Discounted Cash Flow (DCF) Scenarios
                    </h2>

                    <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Intrinsic value from a 10-year free-cash-flow projection discounted to today
                    </p>
                  </div>

                  <DataQualityBadge
                    :confidence="stockStore.currentAsset.provenance.valuationModel"
                  />
                </div>

                <ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <li
                    v-for="sc in [
                      stockStore.currentAsset.thesis.valuation.dcfScenarios.bear,
                      stockStore.currentAsset.thesis.valuation.dcfScenarios.base,
                      stockStore.currentAsset.thesis.valuation.dcfScenarios.bull
                    ]"
                    :key="sc.name"
                    class="p-4 rounded-xl border flex flex-col justify-between"
                    :class="
                      sc.name.includes('Base')
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/5 border-emerald-100/50 dark:border-emerald-800/20'
                        : 'bg-neutral-50/50 dark:bg-zinc-800/10 border-neutral-100 dark:border-neutral-800/40'
                    "
                  >
                    <div>
                      <span class="text-[10px] uppercase font-bold text-neutral-400">{{
                        sc.name
                      }}</span>

                      <div class="text-xl font-black mt-2 text-neutral-900 dark:text-white">
                        <template v-if="sc.intrinsicValue">
                          {{ displayCurrency }} {{ sc.intrinsicValue }}
                        </template>

                        <span v-else class="text-neutral-400">—</span>
                      </div>

                      <span
                        v-if="
                          sc.intrinsicValue && stockStore.currentAsset.profile.currentPrice !== null
                        "
                        class="text-[10px] font-bold mt-1 block"
                        :class="
                          sc.intrinsicValue >= (stockStore.currentAsset.profile.currentPrice || 0)
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        "
                      >
                        {{
                          calculateDiscount(
                            sc.intrinsicValue,
                            stockStore.currentAsset.profile.currentPrice || 0
                          )
                        }}
                      </span>

                      <span
                        v-else-if="!sc.intrinsicValue"
                        class="text-[10px] font-medium mt-1 block text-neutral-400"
                      >
                        DCF n/a (requires positive free cash flow)
                      </span>
                    </div>

                    <div
                      class="mt-6 space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-xs"
                    >
                      <div class="flex justify-between items-center text-[10px]">
                        <span class="text-neutral-400 font-medium">Proj. Cash Growth</span>

                        <span class="font-bold text-neutral-700 dark:text-neutral-300"
                          >{{ sc.growthRate }}%</span
                        >
                      </div>

                      <div class="flex justify-between items-center text-[10px]">
                        <span class="text-neutral-400 font-medium">Discount Rate</span>

                        <span class="font-bold text-neutral-700 dark:text-neutral-300"
                          >{{ sc.discountRate }}%</span
                        >
                      </div>

                      <div class="flex justify-between items-center text-[10px]">
                        <span class="text-neutral-400 font-medium">GGM Exit Multiple</span>

                        <span class="font-bold text-neutral-700 dark:text-neutral-300"
                          >{{ sc.terminalMultiple }}x FCF</span
                        >
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            <section
              aria-labelledby="reverse-dcf-heading"
              class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
            >
              <div class="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6">
                <h2
                  id="reverse-dcf-heading"
                  class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                >
                  Reverse DCF Model (Market-Implied Expectations)
                </h2>

                <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Analyzes what assumptions are built into the current market price of
                  {{ displayCurrency }} {{ stockStore.currentAsset.profile.currentPrice }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  class="p-4 rounded-xl bg-neutral-50/50 dark:bg-zinc-800/10 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1"
                >
                  <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400"
                    >Implied FCF Growth Rate</span
                  >

                  <div class="text-lg font-black text-neutral-900 dark:text-white">
                    {{ stockStore.currentAsset.thesis.valuation.reverseDcf.impliedGrowthRate }}%
                  </div>

                  <span class="text-[10px] text-neutral-400 block pt-1"
                    >CAGR required to justify price over next 10 years.</span
                  >
                </div>

                <div
                  class="p-4 rounded-xl bg-neutral-50/50 dark:bg-zinc-800/10 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1"
                >
                  <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400"
                    >Required Return Rate (CAPM)</span
                  >

                  <div class="text-lg font-black text-neutral-900 dark:text-white">
                    {{ stockStore.currentAsset.thesis.valuation.reverseDcf.expectedReturn }}%
                  </div>

                  <span class="text-[10px] text-neutral-400 block pt-1"
                    >The implied cost of equity/discount rate built in.</span
                  >
                </div>
              </div>
            </section>
          </div>

          <div
            v-else-if="activeTab === 'growthQuality'"
            id="panel-growthQuality"
            key="growthQuality"
            role="tabpanel"
            aria-labelledby="tab-growthQuality"
            class="space-y-6"
          >
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section
                aria-labelledby="moat-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-4"
              >
                <div
                  class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3"
                >
                  <div class="flex items-center gap-2">
                    <h3
                      id="moat-heading"
                      class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                    >
                      Economic Moat Analysis
                    </h3>

                    <DataQualityBadge :confidence="stockStore.currentAsset.provenance.thesis" />
                  </div>

                  <span
                    class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    {{ stockStore.currentAsset.thesis.moat.classification }}
                  </span>
                </div>

                <p class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {{ stockStore.currentAsset.thesis.moat.description }}
                </p>

                <div class="space-y-2 pt-2">
                  <span class="text-[10px] uppercase font-bold text-neutral-400 block"
                    >Identified Moat Drivers</span
                  >

                  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <li
                      v-for="fac in stockStore.currentAsset.thesis.moat.factors"
                      :key="fac"
                      class="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-zinc-800/30 text-xs"
                    >
                      <span
                        class="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"
                        aria-hidden="true"
                      />

                      <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{
                        fac
                      }}</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section
                aria-labelledby="capital-allocation-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-4"
              >
                <div
                  class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3"
                >
                  <h3
                    id="capital-allocation-heading"
                    class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                  >
                    Capital Allocation Assessment
                  </h3>

                  <span
                    class="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    {{ stockStore.currentAsset.thesis.capitalAllocation.score }}/100 Score
                  </span>
                </div>

                <p class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {{ stockStore.currentAsset.thesis.capitalAllocation.description }}
                </p>

                <div class="space-y-2 pt-2">
                  <span class="text-[10px] uppercase font-bold text-neutral-400 block"
                    >Assessment Metrics</span
                  >

                  <ul
                    class="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1"
                  >
                    <li
                      v-for="fac in stockStore.currentAsset.thesis.capitalAllocation.factors"
                      :key="fac"
                    >
                      {{ fac }}
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            <DividendsCard :asset="stockStore.currentAsset" />
          </div>

          <div
            v-else-if="activeTab === 'risks'"
            id="panel-risks"
            key="risks"
            role="tabpanel"
            aria-labelledby="tab-risks"
            class="space-y-6"
          >
            <section
              aria-labelledby="risk-assessment-heading"
              class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
            >
              <div
                class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <h2
                      id="risk-assessment-heading"
                      class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                    >
                      Multi-Factor Risk Assessment
                    </h2>

                    <DataQualityBadge :confidence="stockStore.currentAsset.provenance.thesis" />
                  </div>

                  <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Computed from real leverage, liquidity, valuation and cash-flow signals
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="text-2xl font-black"
                    :class="
                      stockStore.currentAsset.thesis.risks.overallScore >= 50
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    "
                  >
                    {{ stockStore.currentAsset.thesis.risks.overallScore }}/100
                  </span>

                  <span class="block text-[9px] uppercase font-bold text-neutral-400"
                    >Consolidated Risk</span
                  >
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Risk Factor Breakdown
                  </h3>

                  <ul class="space-y-4">
                    <li
                      v-for="r in stockStore.currentAsset.thesis.risks.factors"
                      :key="r.name"
                      class="space-y-1.5 p-3 rounded-xl bg-neutral-50/50 dark:bg-zinc-800/10 border border-neutral-100/50 dark:border-neutral-800/30"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300"
                      >
                        <span>{{ r.name }}</span>

                        <span
                          :class="
                            r.score >= 50
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          "
                          >{{ r.score }}%</span
                        >
                      </div>

                      <p
                        class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed"
                      >
                        {{ r.description }}
                      </p>

                      <div
                        class="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
                        role="progressbar"
                        :aria-valuenow="r.score"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :aria-label="`${r.name} risk level`"
                      >
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="
                            r.score >= 60
                              ? 'bg-rose-500'
                              : r.score >= 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                          "
                          :style="{ width: r.score + '%' }"
                        />
                      </div>
                    </li>
                  </ul>
                </div>

                <div
                  class="p-6 rounded-xl bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/80 space-y-4 h-fit"
                >
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Risk Narrative Overview
                  </h4>

                  <p
                    class="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    {{ stockStore.currentAsset.thesis.risks.description }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div
            v-else-if="activeTab === 'filingsResearch'"
            id="panel-filingsResearch"
            key="filingsResearch"
            role="tabpanel"
            aria-labelledby="tab-filingsResearch"
            class="grid grid-cols-1 xl:grid-cols-3 gap-6 text-xs"
          >
            <div class="xl:col-span-2 space-y-6">
              <section
                aria-labelledby="corporate-background-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <h3
                    id="corporate-background-heading"
                    class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                  >
                    Corporate Background & Operations
                  </h3>

                  <DataQualityBadge :confidence="stockStore.currentAsset.provenance.research" />
                </div>

                <div>
                  <span class="text-[10px] font-bold text-neutral-400 uppercase"
                    >Company History</span
                  >

                  <p class="mt-1 text-neutral-650 dark:text-neutral-300 leading-relaxed">
                    {{ stockStore.currentAsset.research.history }}
                  </p>
                </div>

                <div>
                  <span class="text-[10px] font-bold text-neutral-400 uppercase"
                    >Revenue Model</span
                  >

                  <p class="mt-1 text-neutral-650 dark:text-neutral-300 leading-relaxed">
                    {{ stockStore.currentAsset.research.businessModel }}
                  </p>
                </div>
              </section>

              <section
                aria-labelledby="segments-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
              >
                <h3
                  id="segments-heading"
                  class="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4"
                >
                  Key Offerings & Competitors
                </h3>

                <div class="space-y-3">
                  <div class="space-y-2">
                    <div>
                      <span class="text-[9px] uppercase font-bold text-neutral-400">Products</span>

                      <p class="text-neutral-650 dark:text-neutral-300 font-semibold">
                        {{
                          stockStore.currentAsset.research.keyProducts.join(', ') || 'Not available'
                        }}
                      </p>
                    </div>

                    <div class="pt-1">
                      <span class="text-[9px] uppercase font-bold text-neutral-400"
                        >Direct Competitors</span
                      >

                      <p class="text-neutral-650 dark:text-neutral-300 font-semibold">
                        {{
                          stockStore.currentAsset.research.keyCompetitors.join(', ') ||
                          'Not available'
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="regulatory-risks-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-3"
              >
                <h3
                  id="regulatory-risks-heading"
                  class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                >
                  Regulatory Risk Factors
                </h3>

                <ul
                  class="list-disc list-inside space-y-2 text-neutral-650 dark:text-neutral-300 leading-relaxed font-semibold"
                >
                  <li v-for="risk in stockStore.currentAsset.research.regulatoryRisks" :key="risk">
                    {{ risk }}
                  </li>

                  <li
                    v-if="!stockStore.currentAsset.research.regulatoryRisks.length"
                    class="text-neutral-400 italic list-none"
                  >
                    Not itemised in this data source.
                  </li>
                </ul>
              </section>
            </div>

            <div class="xl:col-span-1 space-y-6">
              <section
                aria-labelledby="guidance-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-4"
              >
                <h3
                  id="guidance-heading"
                  class="text-sm font-bold uppercase tracking-wider text-neutral-400"
                >
                  Guidance &amp; Analyst Summary
                </h3>

                <div class="space-y-4">
                  <div>
                    <span class="text-[10px] font-bold text-neutral-400 uppercase block"
                      >Recent Guidance & Metrics</span
                    >

                    <p
                      class="mt-1 text-neutral-700 dark:text-neutral-300 leading-relaxed font-semibold"
                    >
                      {{ stockStore.currentAsset.research.filingsAnalysis.recentGuidance }}
                    </p>
                  </div>

                  <div>
                    <span class="text-[10px] font-bold text-neutral-400 uppercase block"
                      >Strategic Changes</span
                    >

                    <p
                      class="mt-1 text-neutral-700 dark:text-neutral-300 leading-relaxed font-semibold"
                    >
                      {{ stockStore.currentAsset.research.filingsAnalysis.strategicChanges }}
                    </p>
                  </div>

                  <div>
                    <span class="text-[10px] font-bold text-neutral-400 uppercase block"
                      >Margins & Growth Outlook</span
                    >

                    <p
                      class="mt-1 text-neutral-700 dark:text-neutral-300 leading-relaxed font-semibold"
                    >
                      {{ stockStore.currentAsset.research.filingsAnalysis.marginComments }}
                    </p>
                  </div>
                </div>
              </section>

              <section
                aria-labelledby="data-quality-heading"
                class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 space-y-3"
              >
                <h3
                  id="data-quality-heading"
                  class="text-xs font-bold uppercase tracking-wider text-neutral-400"
                >
                  Data Quality & Audit
                </h3>

                <div class="space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-400 font-medium">Source</span>

                    <span class="font-bold text-neutral-700 dark:text-neutral-300">{{
                      stockStore.currentAsset.research.dataSource
                    }}</span>
                  </div>

                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-400 font-medium">Last Updated</span>

                    <span class="font-bold text-neutral-700 dark:text-neutral-300">{{
                      stockStore.currentAsset.research.dataUpdated
                    }}</span>
                  </div>

                  <div class="flex justify-between items-center text-xs">
                    <span class="text-neutral-400 font-medium">Reliability</span>

                    <span
                      class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      {{ stockStore.currentAsset.research.reliabilityTier }}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-[400px]">
      <p class="text-xs text-neutral-500 font-bold">
        Use the search box above to search for assets.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import config from '@/config';
import AssetOverviewCard from '@/modules/asset-analysis/components/AssetOverviewCard.vue';
import QuantitativeScoresCard from '@/modules/asset-analysis/components/QuantitativeScoresCard.vue';
import StockHistoryChart from '@/modules/asset-analysis/components/StockHistoryChart.vue';
import DividendsCard from '@/modules/dividends/components/DividendsCard.vue';
import AnnualStatementsTable from '@/modules/financial-statements/components/AnnualStatementsTable.vue';
import CondensedStatements from '@/modules/financial-statements/components/CondensedStatements.vue';
import ValuationMetricsCard from '@/modules/valuation/components/ValuationMetricsCard.vue';
import DataQualityBadge from '@/shared/components/ui/DataQualityBadge.vue';
import { formatPercent } from '@/shared/utils/formatPercent';
import { parseCurrency } from '@/shared/utils/parseCurrency';
import { useStockStore } from '@/stores/stockStore';

const stockStore = useStockStore();
const activeTab = ref('overview');
const previousTab = ref('overview');
const tabRefs = ref<Record<string, HTMLElement>>({});
const tabNavRef = ref<HTMLElement | null>(null);
const setTabRef = (key: string, el: unknown) => {
  if (el instanceof HTMLElement) {
    tabRefs.value[key] = el;
  }
};

const tabIndex = (val: string) => tabs.findIndex((t) => t.value === val);

const transitionName = computed(() => {
  const prevIdx = tabIndex(previousTab.value);
  const currIdx = tabIndex(activeTab.value);
  return currIdx > prevIdx ? 'slide-left' : 'slide-right';
});

const onTabKeydown = (e: KeyboardEvent) => {
  const current = tabIndex(activeTab.value);
  let next = current;
  if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = tabs.length - 1;
  else return;

  e.preventDefault();
  const value = tabs[next].value;
  activeTab.value = value;
  nextTick(() => tabRefs.value[value]?.focus());
};

const scrollActiveTabIntoView = () => {
  const activeEl = tabRefs.value[activeTab.value];
  if (activeEl && tabNavRef.value) {
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
};

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Financials', value: 'financials' },
  { label: 'Valuation', value: 'valuation' },
  { label: 'Growth & Quality', value: 'growthQuality' },
  { label: 'Risks', value: 'risks' },
  { label: 'Filings & Research', value: 'filingsResearch' }
];

watch(activeTab, (_, oldVal) => {
  previousTab.value = oldVal;
  nextTick(scrollActiveTabIntoView);
});

watch(
  () => stockStore.currentAsset,
  () => {
    activeTab.value = 'overview';
  }
);

onMounted(async () => {
  if (!stockStore.currentAsset) {
    await stockStore.fetchStock(config.STOCK.DEFAULT_SYMBOL, '');
  }
});

const retryFetch = async () => {
  await stockStore.fetchStock(
    stockStore.symbol || config.STOCK.DEFAULT_SYMBOL,
    stockStore.exchange || ''
  );
};

const displayCurrency = computed(() =>
  parseCurrency(stockStore.currentAsset?.profile.currency || 'USD')
);

const calculateDiscount = (intrinsic: number, current: number): string => {
  const diff = intrinsic - current;
  const pct = (diff / current) * 100;
  if (pct > 0) return `${pct.toFixed(1)}% Upside`;
  return `${Math.abs(pct).toFixed(1)}% Downside`;
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
