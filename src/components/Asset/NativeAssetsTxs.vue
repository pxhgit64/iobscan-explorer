<template>
  <div class="native_asset_container">
    <div class="native_asset_content">
      <div class="native_asset_title_container">
        <span>{{ $t('ExplorerLang.asset.nativeAssetTxsList') }}</span>
      </div>
      <AssetTxsComponent/>
    </div>
  </div>
</template>

<script>
import AssetTxsComponent from './AssetTxsComponent'
export default {
  name: 'NativeAssetsList',
  components: { AssetTxsComponent },
  props: {},
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.native_asset_container {
  .native_asset_content {
    max-width: 12rem;
    margin: 0 auto;
    text-align: left;
    .native_asset_title_container {
      margin: 0.30rem 0 0.16rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
    }
    ::v-deep .txs_title {
      margin-left: 0 !important;
    }
  }
}
	@media screen and (max-width: 1265px) {
    .native_asset_container {
      .native_asset_content {
          margin: 0 0.24rem;
      }
    }
	}
  @media screen and (max-width: 768px) {
    .native_asset_container {
      .native_asset_content {
          margin: 0 0.12rem;
      }
    }
	}
</style>