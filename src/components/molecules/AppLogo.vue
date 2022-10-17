<template>
  <div class="logo-wrapper">
    <div :class="logoStyles">
      <em>verantus</em>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppLogo',
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    logoStyles() {
      return this.theme === 'dark' ? 'logo logo__dark' : 'logo';
    }
  }
});
</script>

<style scoped>
.logo-wrapper {
  width: 10%;

  margin-left: 2rem;
}

.logo {
  width: 1.7rem;

  border-radius: 10px;

  font-size: 32px;
  font-weight: bold;

  color: inherit;
  background-color: #00ff80;

  cursor: default;

  transition: width 0.2s ease;
}

.logo:hover {
  width: 55%;
}

.logo__dark {
  background-color: #006d36;
}

.logo__dark > em {
  color: #ddd;
}

@media (max-width: 650px) {
  .logo-wrapper {
    display: none;
  }
}
</style>
