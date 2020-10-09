<template>
  <div class="staking_container">
    <div class="staking_content">
      <div class="staking_title_container">
        <span>{{ $t('ExplorerLang.staking.title') }}</span>
        <span>{{ count }} {{ titleStatus }}</span>
      </div>
      <div class="staking_tab_content">
        <m-tabs class="staking_m_tabs" :data="stakingStatusTitleList" :chose="selectStakingStatus"></m-tabs>
      </div>
      <div class="staking_table_list_content">
        <el-table class="sort_table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="tableData" :default-sort="{ prop: 'votingPower', order: 'descending' }">
          <el-table-column align="right" type="index" width="45" :label="$t('ExplorerLang.table.number')"></el-table-column>
          <el-table-column align="left" prop="moniker" show-overflow-tooltip  min-width="178" :label="$t('ExplorerLang.table.name')" sortable :sort-orders="['descending', 'ascending']">
            <template v-slot:default="{ row }">
              <div style="display: flex;align-items: center;position: relative">
                <span style="background:#E0E8FF;width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;display: flex;align-items: center;justify-content: center">{{ row.validatorIconSrc }}</span>
                <img v-if="row.url" style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;position: absolute" :src="row.url ? row.url : ''" />
                <router-link style="margin-left: 0.2rem;" :to="'staking/' + row.operatorAddress" class="link_style">{{ row.moniker }}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operatorAddress" align="center" width="128" :label="$t('ExplorerLang.table.operator')">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip :content="row.operatorAddress" placement="top">
                  <router-link :to="'staking/' + row.operatorAddress" class="link_style operator_address_style" style="font-family: Consolas,Menlo;color:#171d44;">
                    {{ formatAddress(row.operatorAddress) }}
                  </router-link>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="commission" width="129" :sort-method="commissionSort" :label="$t('ExplorerLang.table.commission')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column align="right" prop="bondedToken" width="152" :sort-method="bondedTokenSort" :label="$t('ExplorerLang.table.bondedTokens')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column align="center" prop="votingPower" width="137" :sort-method="votingPowerSort" :label="$t('ExplorerLang.table.votingPower')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column align="right" prop="uptime" width="92" :sort-method="uptimeSort" :label="$t('ExplorerLang.table.uptime')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column align="right" prop="selfBond" width="150" :sort-method="selfBondSort" :label="$t('ExplorerLang.table.selfBonded')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column align="right" prop="delegatorNum" width="117" :label="$t('ExplorerLang.table.delegators')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
          <el-table-column align="right" prop="bondHeight" width="132" :label="$t('ExplorerLang.table.bondHeight')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :page-size="1" :total="1" :page="1"></m-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MTabs from '.././common/MTabs'
import MPagination from '.././common/MPagination'
import Tools from '../../util/Tools'
import { CHAINNAME } from '../../constant'
import BigNumber from 'bignumber.js'
import { getValidatorsListApi } from "@/service/api"
import productionConfig from '@/productionConfig.js'
export default {
  name: 'Staking',
  components: { MTabs, MPagination },
  props: {},
  data() {
    return {
      count: 0,
      titleStatus: this.$t('ExplorerLang.staking.status.active'),
      stakingStatusTitleList: [
        {
          title: this.$t('ExplorerLang.staking.status.active'),
          isActive: true,
          name: 'active',
        },
        {
          title: this.$t('ExplorerLang.staking.status.candidate'),
          isActive: false,
          name: 'candidate',
        },
        {
          title: this.$t('ExplorerLang.staking.status.jailed'),
          isActive: false,
          name: 'jailed',
        },
      ],
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getValidatorsList('active')
  },
  mounted() {},
  methods: {
    percentSort(a, b, c) {
      a = Number(a.substring(0, a.length - c))
      b = Number(b.substring(0, b.length - c))
      return a - b
    },
    bigNumberSort(a, b, c) {
      a = a.substring(0, a.length - c).replace(/,/g, '')
      b = b.substring(0, b.length - c).replace(/,/g, '')
      a = new BigNumber(a).toNumber()
      b = new BigNumber(b).toNumber()
      return a - b
    },
    commissionSort(a, b) {
      return this.percentSort(a.commission, b.commission, 2)
    },
    bondedTokenSort(a, b) {
      return this.bigNumberSort(a.bondedToken, b.bondedToken, 5)
    },
    votingPowerSort(a, b) {
      return this.percentSort(a.votingPower, b.votingPower, 1)
    },
    uptimeSort(a, b) {
      return this.percentSort(a.uptime, b.uptime, 1)
    },
    selfBondSort(a, b) {
      return this.bigNumberSort(a.selfBond, b.selfBond, 5)
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    selectStakingStatus(i, v) {
      this.titleStatus = v.title
      this.getValidatorsList(v.name)
    },
    async getValidatorsList(type) {
      try{
          let res = await getValidatorsListApi(1,100,true,type)
          this.count = res && res.count ? res.count : 0
          let result = res && res.data ? res.data : null
          // console.log(result)
          if (result) {
            this.tableData = result.map(item => {
              let regex = /[^\w\u4e00-\u9fa50-9a-zA-Z]/g
              let replaceMoniker = item.description.moniker.replace(regex, '')
              let validatorIconSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : ''
              let selfBond = String(Tools.formatUnit(item.self_bond))
              return {
                validatorStatus: status,
                moniker: Tools.formatString(item.description.moniker, 15, '...'),
                operatorAddress: item.operator_address,
                commission: `${(item.commission.commission_rates.rate * 100).toFixed(2)} %`,
                bondedToken: `${Tools.formatPriceToFixed(Number(item.tokens), 2)} ${CHAINNAME.toLocaleUpperCase()}`,
                uptime: Tools.FormatUptime(item.uptime),
                votingPower: `${(item.voting_rate * 100).toFixed(4)}%`,
                selfBond: `${Tools.subStrings(Tools.formatPriceToFixed(Number(selfBond.match(/\d*(\.\d{0,4})?/)[0])), 2)} ${CHAINNAME.toLocaleUpperCase()}`,
                delegatorNum: item.delegator_num,
                bondHeight: Number(item.bond_height),
                unbondingHeight: item.unbonding_height && Number(item.unbonding_height) > 0 ? Number(item.unbonding_height) : '--',
                // unbondingTime: new Date(item.unbonding_time).getTime() > 0 ? Tools.format2UTC(item.unbonding_time) : '--',
                // identity: item.description.identity,
                url: item.icons ? item.icons : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg'),
                validatorIconSrc: validatorIconSrc,
              }
            })
          } else {
            this.tableData = []
          }
			}catch(err){
					console.error(err);
			}
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.staking_container {
  .staking_content {
    max-width: 12.6rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    text-align: left;
    .staking_title_container {
      margin: 0.3rem 0 0.1rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
      span {
        margin-right: 0.1rem;
      }
    }
    .staking_tab_content {
      margin-bottom: 0.1rem;
      .staking_m_tabs {
        margin-top: -0.2rem;
      }
    }
    .staking_table_list_content {
      width: 100%;
      /deep/ .sort_table {
        overflow: auto hidden;
        // td {
        //   text-align: right;
        // }
        /deep/ .sort-caret.ascending,
        .sort-caret.descending {
          margin-left: 0.09rem;
        }
      }
      /deep/ .el-table .descending .sort-caret.descending {
        border-top-color: $theme_c;
      }
      /deep/ .el-table .ascending .sort-caret.ascending {
        border-bottom-color: $theme_c;
      }
      .pagination_content {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin: 0.05rem 0 0.2rem 0;
      }
    }
  }
}
</style>
