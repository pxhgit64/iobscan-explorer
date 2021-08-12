<template>
  <div class="asset_info_container">
    <div class="asset_info_list_container">
      <div class="asset_title_container">
        <span>{{ tokenID }} {{ $t('ExplorerLang.asset.details') }}</span>
      </div>
      <div class="asset_info_list_content">
        <div class="asset_info_kflower_contennt">
          <div class="kflower_content">
            <ul class="kflower_left_content">
              <li class="kflower_list_item" v-for="item in leftInfoContentArray" :key="item.key">
                <span class="kflower_item_name">{{ item.key }}:</span>
                <span class="kflower_item_value">
                  <router-link v-if="item.address" @click="addressRoute(item.address)" class="address_link">{{ item.address }}</router-link>
                  <span v-if="item.value">{{ item.value }}</span>
                </span>
              </li>
            </ul>
            <ul class="kflower_right_content">
              <li class="kflower_list_item" v-for="item in rightInfoContentArray" :key="item.key">
                <span class="kflower_item_name">{{ item.key }}:</span>
                <span class="kflower_item_value">{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>
        <AssetTxsComponent :symbol='$route.params.param' />
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '../../util/Tools'
import AssetTxsComponent from './AssetTxsComponent'
import { getNativeAssetDetailApi } from '@/service/api'
import { addressRoute } from '@/helper/IritaHelper'
export default {
  name: 'AssetInformation',
  components: {AssetTxsComponent},
  props: {},
  data() {
    return {
      Tools,
      addressRoute,
      tokenID: this.$route.params.param,
      leftInfoContentArray: [
        {
          id: 'owner',
          key: this.$t('ExplorerLang.asset.owner'),
          address: '',
        },
        {
          id: 'total_supply',
          key: this.$t('ExplorerLang.asset.totalSupply'),
          value: '',
        },
        {
          id: 'initial_supply',
          key: this.$t('ExplorerLang.asset.initialSupply'),
          value: '',
        },
        {
          id: 'max_supply',
          key: this.$t('ExplorerLang.asset.maxSupply'),
          value: '',
        },
        {
          id: 'mintable',
          key: this.$t('ExplorerLang.asset.mintable'),
          value: '',
        },
      ],
      rightInfoContentArray: [
        {
          id: 'name',
          key: this.$t('ExplorerLang.asset.name'),
          value: '',
        },
        {
          id: 'scale',
          key: this.$t('ExplorerLang.asset.decimal'),
          value: '',
        },
        {
          id: 'denom',
          key: this.$t('ExplorerLang.asset.minUnit'),
          value: '',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getNativeAssetDetail()
  },
  methods: {
    async getNativeAssetDetail() {
      try {
        let res = await getNativeAssetDetailApi(this.$route.params.param)
        this.leftInfoContentArray.forEach(item => {
          if (item.id === 'owner') {
            item.value = res[item.id]
          } else if (item.id === 'total_supply' || item.id === 'initial_supply' || item.id === 'max_supply') {
            item.value = res[item.id] ? Tools.formatNumber(res[item.id]) : '--'
          } else if (item.id === 'mintable') {
            item.value = res[item.id] ? Tools.firstWordUpperCase(String(res[item.id])) : '--'
          } else {
            item.value = res[item.id] ? res[item.id] : '--'
          }
        })
        this.rightInfoContentArray.forEach(item => {
          item.value = res[item.id] ? res[item.id] : '--'
        })
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.asset_info_container {
  box-sizing: border-box;
  position: relative;
  text-align: left;
  .asset_info_list_container {
    box-sizing: border-box;
    margin-bottom: 0.2rem;
    max-width: 12rem;
    margin: 0 auto;
    .asset_title_container {
      margin: 0.28rem 0 0.16rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
      span {
        margin-left: 0.1rem;
      }
    }
    .asset_info_kflower_contennt {
      .kflower_content {
        box-sizing: border-box;
        padding: 0.2rem;
        display: flex;
        margin: 0.1rem 0 0.2rem 0;
        background: #fff;
        .kflower_left_content {
          flex: 1;
          margin-right: 0.2rem;
          .kflower_list_item {
            display: flex;
            margin-bottom: 0.12rem;
            .kflower_item_name {
              font-size: $s14;
              width: 1.3rem;
              color: $t_second_c;
            }
            .kflower_item_value {
              flex: 1;
              font-size: $s14;
              color: $t_first_c;
              a {
                color: $theme_c !important;
              }
            }
          }
        }
        .kflower_right_content {
          flex: 1;
          .kflower_list_item {
            display: flex;
            margin-bottom: 0.12rem;
            .kflower_item_name {
              width: 1rem;
              font-size: $s14;
              color: $t_second_c;
            }
            .kflower_item_value {
              flex: 1;
              word-break: break-all;
              font-size: $s14;
              color: $t_first_c;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1248px) {
  .asset_info_container {
    .asset_info_list_container {
      margin: 0 0.24rem;
    }
  }
}
@media screen and (max-width: 910px) {
  .kflower_content {
    flex-direction: column;
    .kflower_left_content {
      .kflower_list_item {
        flex-direction: column;
        margin-bottom: 0;
      }
    }
    .kflower_right_content {
      .kflower_list_item {
        flex-direction: column;
        margin-bottom: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .asset_info_container {
    .asset_info_list_container {
      margin: 0 0.12rem;
    }
  }
}
</style>
