<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg-app: #fafafa;
  --bg-card: #ffffff;
  --bg-input: #f4f4f5;
  --border-color: #e4e4e7;
  --text-primary: #09090b;
  --text-secondary: #71717a;
  --text-tertiary: #a1a1aa;
  --accent-color: #6366f1;
  --accent-color-hover: #4f46e5;
  --color-positive: #10b981;
  --color-negative: #f43f5e;
}

.dark,
.body--dark {
  --bg-app: #09090b;
  --bg-card: #18181b;
  --bg-input: #27272a;
  --border-color: #27272a;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #52525b;
  --accent-color: #818cf8;
  --accent-color-hover: #6366f1;
  --color-positive: #34d399;
  --color-negative: #fb7185;
}

* {
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-size: 88.5%;
  font-weight: 500;
  font-family:
    'Geist',
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif !important;
  background-color: var(--bg-app);
  color: var(--text-primary);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

body,
input,
button,
select,
textarea {
  font-family:
    'Geist',
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif !important;
  background-color: transparent;
  color: var(--text-primary);
}

button,
a {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-tertiary);
}
</style>
