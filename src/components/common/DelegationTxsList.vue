<template>
  <div class="delegation_txs_list">
    <div class="delegations_txs_table_container">
      <el-table class="table_overflow_x" :data="dataList" style="width: 100%" :empty-text="$t('ExplorerLang.table.emptyDescription')">
        <el-table-column class-name="hash_status" prop="Tx_Hash" align="left" :label="$t('ExplorerLang.table.txHash')" :min-width="ColumnMinWidth.txHash">
          <template v-slot:default="{ row }">
            <div class="delegations_txs_table_container_status">
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
          <!-- <template v-slot:default="{ row }">
            <el-tooltip :content="row.Tx_Type.join(',')" placement="top" :disabled="row.Tx_Type.length <= 1">
              <span>{{ getDisplayTxType(row.Tx_Type) }}</span>
            </el-tooltip>
          </template> -->
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
        <el-table-column align="right" class-name="amount" prop="Amount" :label="$t('ExplorerLang.table.amount')" :min-width="ColumnMinWidth.delegationTxsAmount">
            <template slot="header" slot-scope="scope">
                <span>{{ $t('ExplorerLang.table.amount')}}</span>
                <el-tooltip :content="mainTokenSymbol"
                            placement="top">
                    <i class="iconfont iconyiwen yiwen_icon" />
                </el-tooltip>
            </template >
            <template v-slot:default="{ row }">
                        <span v-if="row.MsgsNum == 1 && !row.isShowMore">{{row.Amount}}</span>
                        <router-link v-else :to="`/tx?txHash=${row.Tx_Hash}`">{{$t('ExplorerLang.table.more')}} <i class="iconfont icontiaozhuan more_icontiaozhuan"></i></router-link>
            </template>
        </el-table-column>
        <el-table-column class-name="from" prop="From" :label="$t('ExplorerLang.table.from')" :min-width="ColumnMinWidth.delegationTxsFrom">
          <template v-slot:default="{ row }">
            <template v-if="row.MsgsNum > 1">
              <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{$t('ExplorerLang.table.more')}} <i class="iconfont icontiaozhuan more_icontiaozhuan"></i></router-link>
            </template>
            <template v-else>
              <span v-if="/^[1-9]\d*$/.test(row.From)" class="skip_route">
                <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.From }} Validators</router-link>
              </span>
              <div class="name_address" v-if="!/^[0-9]\d*$/.test(row.From) && row.From && row.From !== '--'">
                <span class="remove_default_style skip_route" :class="row.From === $route.params.param ? 'no_skip' : ''">
                  <el-tooltip :content="`${row.From}`">
                      <span v-if="row.From === $route.params.param">{{ formatMoniker(row.fromMonikers,monikerNum.otherTable) || formatAddress(row.From) }}</span>
                      <span v-else @click="addressRoute(row.From)" class="address_link link_style">{{ formatMoniker(row.fromMonikers,monikerNum.otherTable) || formatAddress(row.From) }}</span>
                  </el-tooltip>
                </span>
              </div>
              <span class="no_skip" v-show="/^[0]\d*$/.test(row.From) || row.From === '--'">--</span>
            </template>   
          </template>
        </el-table-column>
        <el-table-column prop="To" class-name="to" row-class-name="left" align="left" :label="$t('ExplorerLang.table.to')" :min-width="ColumnMinWidth.address">
          <template v-slot:default="{ row }">
            <template v-if="row.MsgsNum > 1">
              <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{$t('ExplorerLang.table.more')}} <i class="iconfont icontiaozhuan more_icontiaozhuan"></i></router-link>
            </template>
            <template v-else>
              <span v-if="/^[1-9]\d*$/.test(row.To)" class="skip_route">
                <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.To }} Validators</router-link>
              </span>
              <div class="name_address" v-show="!/^[0-9]\d*$/.test(row.To) && row.To && row.To !== '--'">
                <span class="remove_default_style skip_route" :class="row.To === $route.params.param ? 'no_skip' : ''">
                  <el-tooltip :content="`${row.To}`">
                      <span v-if="!(row.To === $route.params.param)" class="address_link link_style" @click="addressRoute(row.To)">{{ formatMoniker(row.toMonikers,monikerNum.otherTable) || formatAddress(row.To) }}</span>
                      <span v-else>{{ formatMoniker(row.toMonikers,monikerNum.otherTable) }}</span>
                  </el-tooltip>
                </span>
              </div>
              <span class="no_skip" v-show="/^[0]\d*$/.test(row.To) || row.To === '--'">--</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="Block" :label="$t('ExplorerLang.table.block')" :min-width="ColumnMinWidth.blockListHeight">
          <template v-slot:default="{ row }">
            <router-link style="font-family: Arial;" :to="'/block/' + row.Block" :style="{ color: '$theme_c !important' }">{{ row.Block }} </router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="MsgsNum" :label="$t('ExplorerLang.table.message')" :min-width="ColumnMinWidth.message"></el-table-column> -->
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
            <el-tooltip :content="`${row.Tx_Signer}`">
                <span @click="addressRoute(row.Tx_Signer)" class="address_link link_style justify">{{ formatAddress(row.Tx_Signer) }} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Timestamp" :label="$t('ExplorerLang.table.txTimestamp')" :min-width="ColumnMinWidth.timestamp"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Tools from '@/util/Tools'
import { ColumnMinWidth,monikerNum } from '@/constant'
import { addressRoute, formatMoniker, getMainToken } from '@/helper/IritaHelper'
export default {
  name: 'DelegationTxsList',
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
            // type += this.$t('ExplorerLang.unit.ellipsis');
        }
        return type;
    },
  },
}
</script>

<style lang="scss" scoped>
    ::v-deep .hash_status {
        .cell {
            // margin-left: 0.1rem;
        }
    }
    .delegation_txs_list {
        .delegations_txs_table_container {
            a {
                color: $t_link_c !important;
            }
            .delegations_txs_table_container_status {
                display: flex;
                .status {
                    // margin-left: 0.1rem;
                    .status_icon{
                        width:0.13rem;
                        height:0.13rem;
                        margin-right:0.05rem;
                    }
                }
            }
            ::v-deep .cell {
              // padding: 0;
            }
            ::v-deep .amount {
              padding-right: 0.2rem;
            }
        }
    }
</style>
