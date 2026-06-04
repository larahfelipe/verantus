<template>
  <section
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
  >
    <div
      class="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6 flex items-start justify-between gap-4"
    >
      <div>
        <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Financial Statements
        </h2>

        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Annual income statements, balance sheets, cash flows, and capital return
        </p>
      </div>

      <DataQualityBadge :confidence="asset.provenance.financials" />
    </div>

    <div
      v-for="(section, sectionIndex) in sections"
      :key="section.title"
      class="space-y-3"
      :class="sectionIndex < sections.length - 1 ? 'mb-8' : ''"
    >
      <h3
        class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-2"
      >
        {{ section.title }}
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              class="text-neutral-400 uppercase font-bold text-[10px] border-b border-neutral-100 dark:border-neutral-800"
            >
              <th scope="col" class="py-2 px-3">Line Item</th>

              <th
                v-for="yr in asset.financialsHistory"
                :key="yr.year"
                scope="col"
                class="py-2 px-3 text-right"
              >
                {{ yr.year }}
              </th>
            </tr>
          </thead>

          <tbody
            class="divide-y divide-neutral-100/50 dark:divide-neutral-800/30 text-neutral-700 dark:text-neutral-300"
          >
            <tr v-for="row in section.rows" :key="row.field" :class="rowClass(row.emphasis)">
              <td
                class="py-2.5 px-3 flex items-center justify-between"
                :class="labelClass(row.emphasis)"
              >
                <span>{{ row.label }}</span>

                <InfoTooltip v-bind="STATEMENT_TOOLTIPS[row.field]" />
              </td>

              <td
                v-for="yr in asset.financialsHistory"
                :key="yr.year"
                class="py-2.5 px-3 text-right font-mono"
                :class="valueClass(row.emphasis)"
              >
                {{ formatMoney(yr[row.field]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DataQualityBadge from '@/shared/components/ui/DataQualityBadge.vue';
import InfoTooltip from '@/shared/components/ui/InfoTooltip.vue';
import { STATEMENT_TOOLTIPS } from '@/shared/constants/tooltips';
import type { NormalizedAsset } from '@/shared/types/domain';
import { formatCompactMoney } from '@/shared/utils/formatMoney';

type StatementField = keyof typeof STATEMENT_TOOLTIPS;

/** `strong` highlights a subtotal; `accent` flags free cash flow as the headline figure. */
type RowEmphasis = 'normal' | 'strong' | 'accent';

interface StatementRow {
  label: string;
  field: StatementField;
  emphasis: RowEmphasis;
}

interface StatementSection {
  title: string;
  rows: StatementRow[];
}

const props = defineProps<{
  asset: NormalizedAsset;
}>();

const sections: StatementSection[] = [
  {
    title: 'Income Statement',
    rows: [
      { label: 'Revenue', field: 'revenue', emphasis: 'normal' },
      { label: 'Gross Profit', field: 'grossProfit', emphasis: 'normal' },
      { label: 'EBITDA', field: 'ebitda', emphasis: 'normal' },
      { label: 'Operating Income (EBIT)', field: 'ebit', emphasis: 'normal' },
      { label: 'Net Income', field: 'netIncome', emphasis: 'strong' }
    ]
  },
  {
    title: 'Balance Sheet & Liquidity',
    rows: [
      { label: 'Cash & Equivalents', field: 'cash', emphasis: 'normal' },
      { label: 'Total Debt', field: 'debt', emphasis: 'normal' },
      { label: "Shareholder's Equity", field: 'equity', emphasis: 'normal' },
      { label: 'Net Working Capital', field: 'workingCapital', emphasis: 'strong' }
    ]
  },
  {
    title: 'Cash Flow Statement',
    rows: [
      { label: 'Operating Cash Flow', field: 'operatingCashFlow', emphasis: 'normal' },
      { label: 'Capital Expenditure (CAPEX)', field: 'capex', emphasis: 'normal' },
      { label: 'Free Cash Flow (FCF)', field: 'freeCashFlow', emphasis: 'accent' },
      { label: 'Share Repurchases (Buybacks)', field: 'buybacks', emphasis: 'normal' },
      { label: 'Dividends Paid', field: 'dividends', emphasis: 'normal' }
    ]
  }
];

const formatMoney = (value: number | null): string =>
  formatCompactMoney(value, props.asset.profile.currency);

const rowClass = (emphasis: RowEmphasis): string => {
  if (emphasis === 'strong') return 'font-bold bg-neutral-50/50 dark:bg-zinc-800/10';
  if (emphasis === 'accent') return 'font-bold bg-emerald-500/5 dark:bg-emerald-400/5';
  return '';
};

const labelClass = (emphasis: RowEmphasis): string => {
  if (emphasis === 'strong') return 'text-neutral-900 dark:text-white';
  if (emphasis === 'accent') return 'text-emerald-600 dark:text-emerald-400';
  return 'font-semibold';
};

const valueClass = (emphasis: RowEmphasis): string => {
  if (emphasis === 'strong') return 'text-neutral-900 dark:text-white';
  if (emphasis === 'accent') return 'text-emerald-600 dark:text-emerald-400';
  return '';
};
</script>
