<template>
  <div :class="companyOverviewStyles">
    <div class="company-name-and-stock-details-wrapper">
      <div class="company-name-and-exchange-wrapper">
        <h2>Apple Inc.</h2>

        <div class="company-stock-exchange-wrapper">
          <h4>AAPL</h4>

          <div class="stock-exchange-name-wrapper">
            <QIcon name="bi-graph-up" size="xs" />
            <h6>NASDAQ</h6>
          </div>
        </div>
      </div>

      <div class="company-stock-price-wrapper">
        <h3>$ 145,69</h3>

        <div class="stock-price-float-wrapper">
          <QIcon name="bi-arrow-up-circle" size="xs" />
          <h6>+0,69 (0,47%)</h6>
        </div>
      </div>
    </div>

    <div class="company-summary-wrapper">
      <div class="company-summary-title-wrapper">
        <div class="title-wrapper">
          <QIcon name="bi-card-text" size="xs" />
          <h5>About</h5>
        </div>

        <div class="website-wrapper">
          <a href="https://www.apple.com/">
            <QIcon name="bi-box-arrow-in-up-right" size="xs" />
            <strong>Official website</strong>
          </a>
        </div>
      </div>

      <div :class="companyDescriptionStyles">
        <p>
          Apple Inc. designs, manufactures, and markets smartphones, personal
          computers, tablets, wearables, and accessories worldwide. It also
          sells various related services. In addition, the company offers
          iPhone, a line of smartphones; Mac, a line of personal computers;
          iPad, a line of multi-purpose tablets; AirPods Max, an over-ear
          wireless headphone; and wearables, home, and accessories comprising
          AirPods, Apple TV, Apple Watch, Beats products, HomePod, and iPod
          touch. Further, it provides AppleCare support services; cloud services
          store services; and operates various platforms, including the App
          Store that allow customers to discover and download applications and
          digital content, such as books, music, video, games, and podcasts.
          Additionally, the company offers various services, such as Apple
          Arcade, a game subscription service; Apple Music, which offers users a
          curated listening experience with on-demand radio stations; Apple
          News+, a subscription news and magazine service; Apple TV+, which
          offers exclusive original content; Apple Card, a co-branded credit
          card; and Apple Pay, a cashless payment service, as well as licenses
          its intellectual property. The company serves consumers, and small and
          mid-sized businesses; and the education, enterprise, and government
          markets. It distributes third-party applications for its products
          through the App Store. The company also sells its products through its
          retail and online stores, and direct sales force; and third-party
          cellular network carriers, wholesalers, retailers, and resellers.
          Apple Inc. was incorporated in 1977 and is headquartered in Cupertino,
          California
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CompanyOverviewSection',
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    companyOverviewStyles() {
      return this.theme === 'dark'
        ? 'company-overview-section-wrapper company-overview-section-wrapper__dark'
        : 'company-overview-section-wrapper';
    },
    companyDescriptionStyles() {
      return this.theme === 'dark'
        ? 'company-description-wrapper company-description-wrapper__dark'
        : 'company-description-wrapper';
    }
  }
});
</script>

<style scoped>
.company-overview-section-wrapper {
  width: 100%;
  height: 30%;

  display: flex;
  justify-content: space-between;
}

.company-overview-section-wrapper__dark {
  color: #dddcdc;
}

.company-name-and-stock-details-wrapper {
  width: 70%;

  display: flex;
  justify-content: space-between;
}

.company-name-and-exchange-wrapper {
  margin: 2rem;
}

.company-name-and-exchange-wrapper h2 {
  font-size: 64px;
}

.company-overview-section-wrapper__dark h2 {
  color: #f2f3f5;
}

.company-stock-exchange-wrapper {
  display: flex;
  align-items: flex-end;

  margin-top: 1.5rem;
  gap: 1.4rem;
}

.company-stock-exchange-wrapper h4 {
  color: #464c58;
}

.company-overview-section-wrapper__dark h4 {
  color: #ddd;
}

.company-stock-exchange-wrapper .stock-exchange-name-wrapper {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.stock-exchange-name-wrapper h6,
.stock-exchange-name-wrapper i {
  color: #a0a4a9;
}

.company-stock-price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  gap: 1rem;

  margin-top: 2rem;
  margin-right: 5rem;
}

.stock-price-float-wrapper {
  display: flex;
  align-items: center;

  gap: 0.25rem;

  color: green;
}

.company-summary-wrapper {
  width: 30%;

  display: flex;
  flex-direction: column;
}

.company-summary-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.title-wrapper h5 {
  font-weight: 600;
}

.website-wrapper strong {
  margin-left: 0.3rem;
}

.company-description-wrapper {
  height: 100%;

  margin-top: 1rem;

  overflow-y: auto;
}

.company-description-wrapper__dark::-webkit-scrollbar-track {
  background-color: #18191c;
}

.company-description-wrapper__dark::-webkit-scrollbar-thumb {
  background-color: #505050;
}

.company-description-wrapper__dark::-webkit-scrollbar-thumb:hover {
  background-color: #767676;
}
</style>
