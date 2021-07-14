<template>
  <div class="validation_txs_list">
    <div class="validation_txs_table_container">
      <el-table class="table_overflow_x" :data="dataList" style="width: 100%" :empty-text="$t('ExplorerLang.table.emptyDescription')">
        <el-table-column class-name="hash_status"  align="left" prop="Tx_Hash" :label="$t('ExplorerLang.table.txHash')" :min-width="ColumnMinWidth.txHash">
          <template v-slot:default="{ row }">
            <div class="validation_txs_table_container_status">
              <div class="status">
                <img class="status_icon" :src="require(`../../assets/${row.Tx_Status == 'Success' ? 'success.png' : 'failed.png'}`)" />
              </div>
              <el-tooltip :content="`${row.Tx_Hash}`">
                <div>
                  <router-link :to="`/tx?txHash=${row.Tx_Hash}`" :style="{ color: '$theme_c !important' }">{{ formatTxHash(row.Tx_Hash) }} </router-link>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="tx_type" prop="Tx_Type" :label="$t('ExplorerLang.table.txType')" :width="ColumnMinWidth.txType">
          <template v-slot:default="{ row }">
              <el-tooltip :content="row.Tx_Type.join(',')"
                          placement="top-start"
                          :disabled="row.MsgsNum <= 1">
                  <div class="ty_type_message">
                      <span>{{getDisplayTxType(row.Tx_Type)}}</span>
                      <span class="message_number" v-if="row.MsgsNum != 1">+{{row.MsgsNum - 1}}</span>
                  </div>
              </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Self-Bonded" :label="$t('ExplorerLang.table.selfBonded')" :min-width="ColumnMinWidth.selfBond">
          <template v-slot:default="{ row }">
            <span>{{ row.SelfBonded }}</span>
          </template>
          <template slot="header" slot-scope="scope">
                <span>{{ $t('ExplorerLang.table.selfBonded')}}</span>
                <el-tooltip :content="mainTokenSymbol"
                            placement="top">
                    <i class="iconfont iconyiwen yiwen_icon" />
                </el-tooltip>
          </template >
        </el-table-column>
        <el-table-column class-name="moniker" :label="$t('ExplorerLang.table.name')" :min-width="ColumnMinWidth.validatirName">
          <template v-slot:default="{ row }">
            <el-tooltip :disabled="row.OperatorMonikers === '--' && row.OperatorAddr === '--' " :content="`${row.OperatorAddr}`">
              <span v-if="row.OperatorAddr === $route.params.param || row.OperatorAddr == '--'">{{ row.OperatorMonikers !== '--' ? formatMoniker(row.OperatorMonikers,monikerNum.otherTable) : formatAddress(row.OperatorAddr) }}</span>
              <span v-else @click="addressRoute(row.OperatorAddr)" class="address_link link_style justify">{{ row.OperatorMonikers !== '--' ? formatMoniker(row.OperatorMonikers,monikerNum.otherTable) : formatAddress(row.OperatorAddr) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column class-name="operator" prop="OperatorAddr" :label="$t('ExplorerLang.table.operator')" :min-width="ColumnMinWidth.address">
          <template v-slot:default="{ row }">
            <span v-if="/^[1-9]\d*$/.test(row.OperatorAddr)" class="skip_route">
              <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.OperatorAddr }} Validators</router-link>
            </span>
            <div class="name_address" v-show="!/^[0-9]\d*$/.test(row.OperatorAddr) && row.OperatorAddr && row.OperatorAddr !== '--'">
              <el-tooltip :content="`${row.OperatorAddr}`">
                <span v-if="row.OperatorAddr === $route.params.param">{{ formatAddress(row.OperatorAddr) }}</span>
                <span v-else @click="addressRoute(row.OperatorAddr)" class="address_link link_style justify">
                  {{ formatAddress(row.OperatorAddr) }}
                </span>
              </el-tooltip>
            </div>
            <span class="no_skip" v-show="/^[0]\d*$/.test(row.OperatorAddr) || row.OperatorAddr === '--'">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="Block" :label="$t('ExplorerLang.table.block')" :min-width="ColumnMinWidth.blockListHeight">
          <template v-slot:default="{ row }">
            <router-link style="font-family: Arial;" :to="'/block/' + row.Block" :style="{ color: '$theme_c !important' }">{{ row.Block }} </router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="MsgsNum" :label="$t('ExplorerLang.table.message')" :min-width="ColumnMinWidth.message"> </el-table-column> -->
        <el-table-column v-if="isShowFee" prop="Tx_Fee" align="right" :label="$t('ExplorerLang.table.fee')" :min-width="ColumnMinWidth.fee">
          <template slot="header" slot-scope="scope">
              <span>{{ $t('ExplorerLang.table.fee')}}</span>
              <el-tooltip :content="mainTokenSymbol"
                          placement="top">
                  <i class="iconfont iconyiwen yiwen_icon" />
              </el-tooltip>
          </template >
        </el-table-column>
        <el-table-column prop="Tx_Signer" class-name="signer" :label="$t('ExplorerLang.table.signer')" :min-width="ColumnMinWidth.address">
          <template v-slot:default="{ row }">
            <el-tooltip :disabled="row.Tx_Signer === '--'" :content="`${row.Tx_Signer}`">
              <span @click="addressRoute(row.Tx_Signer)" class="address_link link_style justify">{{ formatAddress(row.Tx_Signer) }} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Timestamp" :label="$t('ExplorerLang.table.txTimestamp')" :width="ColumnMinWidth.timestamp"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Tools from '@/util/Tools'
import { ColumnMinWidth,monikerNum } from '@/constant'
import { addressRoute, formatMoniker, getMainToken } from '@/helper/IritaHelper'
export default {
  name: 'ValidationTxsList',
  components: {},
  props: {
    dataList: {
      type: Array,
      required: true,
    },
    isShowFee: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      ColumnMinWidth,
      Tools,
      addressRoute,
      formatMoniker,
      monikerNum,
        mainTokenSymbol:'',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
      this.setMainToken();
  },
  methods: {
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
      async setMainToken(){
          let mainToken = await getMainToken();
          if(mainToken && mainToken.symbol){
              this.mainTokenSymbol = mainToken.symbol.toUpperCase();
          }
      },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    getDisplayTxType(types=[]){
        let type = types[0] || '';
        if (type && types.length > 1) {
            types.forEach(item => {
                if(type.length > item.length) {
                    type = item
                }
            })
        }
        return type;
    },
  },
}
</script>

<style lang="scss" scoped>
.validation_txs_list {
  .validation_txs_table_container {
    a {
      color: $t_link_c !important;
    }
    /deep/ .hash_status {
        .cell {
            // margin-left: 0.1rem;
        }
    }
    .validation_txs_table_container_status {
        display: flex;
        .status {
            .status_icon{
                width:0.13rem;
                height:0.13rem;
                margin-right:0.05rem;
            }
        }
    }
    /deep/ .cell {
      // padding: 0;
    }
  }
}
</style>
