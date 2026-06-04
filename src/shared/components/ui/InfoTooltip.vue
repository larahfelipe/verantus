<template>
  <div class="inline-block">
    <button
      ref="buttonRef"
      type="button"
      class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors ml-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-full"
      :aria-label="'Learn more about ' + title"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focusin="showTooltip"
      @focusout="hideTooltip"
    >
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="isVisible"
        class="absolute z-[9999] w-72 p-4 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl text-neutral-800 dark:text-neutral-200 pointer-events-none transition-all duration-200"
        :style="tooltipStyle"
      >
        <div class="space-y-2 text-left">
          <h5
            class="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
          >
            {{ title }}
          </h5>

          <div class="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
            <p class="font-medium mb-1.5">{{ definition }}</p>

            <div
              class="p-1.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800/80 rounded-lg text-[10px] font-mono mb-2"
            >
              <span
                class="text-neutral-400 font-bold block uppercase tracking-wide text-[8px] mb-0.5"
                >Formula:</span
              >
              {{ formula }}
            </div>

            <p class="mb-1.5">
              <strong class="text-neutral-700 dark:text-neutral-200"
                >Practical Interpretation:</strong
              >
              {{ interpretation }}
            </p>

            <p class="mb-1.5">
              <strong class="text-neutral-700 dark:text-neutral-200">Attractive Range:</strong>
              {{ range }}
            </p>

            <p class="text-neutral-400">
              <strong class="text-neutral-500 dark:text-neutral-400">Limitation:</strong>
              {{ limitation }}
            </p>
          </div>
        </div>

        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-zinc-950"
        />

        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-200 dark:border-t-neutral-800 -z-10 mt-[1px]"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

defineProps<{
  title: string;
  definition: string;
  formula: string;
  interpretation: string;
  range: string;
  limitation: string;
}>();

const buttonRef = ref<HTMLElement | null>(null);
const coords = ref({ top: 0, left: 0 });
const isVisible = ref(false);

const showTooltip = () => {
  if (!buttonRef.value) return;
  const rect = buttonRef.value.getBoundingClientRect();
  coords.value = {
    top: rect.top + window.scrollY - 8,
    left: rect.left + window.scrollX + rect.width / 2
  };
  isVisible.value = true;
  window.addEventListener('scroll', hideTooltip, { passive: true });
  window.addEventListener('resize', hideTooltip);
};

const hideTooltip = () => {
  isVisible.value = false;
  window.removeEventListener('scroll', hideTooltip);
  window.removeEventListener('resize', hideTooltip);
};

onUnmounted(() => {
  window.removeEventListener('scroll', hideTooltip);
  window.removeEventListener('resize', hideTooltip);
});

const tooltipStyle = computed(() => {
  return {
    top: `${coords.value.top}px`,
    left: `${coords.value.left}px`,
    transform: 'translate(-50%, -100%)'
  };
});
</script>
