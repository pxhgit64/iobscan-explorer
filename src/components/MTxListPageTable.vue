<template>
  <div>
    <m-table v-table-head-fixed class="tx_container_table override_mtable" :columns="fields" :data="items">
      <template slot-scope="{ row }" slot="Block">
        <span class="skip_route">
          <router-link :to="`/block/${row.Block}`" class="link_style">{{ row.Block }}</router-link>
        </span>
      </template>
      <template slot-scope="{ row }" slot="Proposal_ID">
        <router-link v-if="row.Proposal_ID !== '--' && row.Proposal_Title && row.Proposal_Title !== '--'" :to="`/ProposalsDetail/${row.Proposal_ID}`" class="link_style">{{ row.Proposal_ID }}</router-link>
        <span v-if="row.Proposal_ID === '--' && row.Proposal_Title && row.Proposal_Title !== '--'">{{ row.Proposal_ID }}</span>
        <span v-if="row.Proposal_Title && row.Proposal_Title === '--'">--</span>
      </template>
      <template slot-scope="{ row }" slot="Proposal_Title">
        <router-link v-if="row.Proposal_ID !== '--' && row.Proposal_Title && row.Proposal_Title !== '--'" :to="`/ProposalsDetail/${row.Proposal_ID}`" class="link_style">{{ row.Proposal_Title }}</router-link>
        <span v-if="row.Proposal_ID === '--' && row.Proposal_Title && row.Proposal_Title !== '--'">{{ row.Proposal_Title }}</span>
        <span v-if="row.Proposal_Title && row.Proposal_Title === '--'">--</span>
      </template>
      <template slot-scope="{ row }" slot="Tx_Hash">
        <div class="skip_route" v-if="row.Tx_Hash">
          <router-link :to="`/tx?txHash=${row.Tx_Hash}`" class="link_style common_font_style">{{ formatTxHash(row.Tx_Hash) }} </router-link>
        </div>
      </template>
      <template slot-scope="{ row }" slot="From">
        <div class="common_hover_address_parent">
          <span v-if="/^[1-9]\d*$/.test(row.From)" class="skip_route common_font_style">
            <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.From }} Validators</router-link>
          </span>
          <div class="name_address" v-if="!/^[0-9]\d*$/.test(row.From) && row.From !== '--'">
            <div>
              <span class="remove_default_style skip_route">
                <router-link :to="`/address/${row.From}`" class="link_style  justify common_font_style">{{ formatMoniker(row.fromMoniker) || formatAddress(row.From) }} </router-link>
              </span>
            </div>
          </div>
          <span class="no_skip" v-show="/^[0]\d*$/.test(row.From) || row.From === '--'">--</span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="To">
        <div class="common_hover_address_parent">
          <span v-if="/^[1-9]\d*$/.test(row.To)" class="skip_route common_font_style">
            <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.To }} Validators</router-link>
          </span>
          <div class="name_address" v-if="!/^[0-9]\d*$/.test(row.To) && row.To !== '--'">
            <div>
              <span class="remove_default_style skip_route">
                <router-link :to="`/address/${row.To}`" class="link_style justify common_font_style">{{ formatMoniker(row.toMoniker) || formatAddress(row.To) }} </router-link>
              </span>
            </div>
          </div>
          <span class="no_skip" v-show="/^[0]\d*$/.test(row.To) || row.To === '--'">--</span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="Tx_Signer">
        <div class="common_hover_address_parent skip_route" v-if="row.Tx_Signer">
          <router-link :to="`/address/${row.Tx_Signer}`" class="link_style common_font_style">{{ formatAddress(row.Tx_Signer) }} </router-link>
        </div>
      </template>
      <template slot-scope="{ row }" slot="OperatorAddr">
        <div class="common_hover_address_parent skip_route">
          <router-link :to="`/staking/${row.OperatorAddr}`" class="link_style common_font_style">{{ formatAddress(row.OperatorAddr) }} </router-link>
        </div>
      </template>
      <template slot-scope="{ row }" slot="Moniker">
        <div class="common_hover_address_parent skip_route">
          <router-link v-if="row.Moniker && row.Moniker !== '--'" :to="`/staking/${row.Moniker}`" class="link_style">{{ row.Moniker }}</router-link>
        </div>
        <span v-if="row.Moniker && row.Moniker === '--'">--</span>
      </template>
      <template slot-scope="{ row }" slot="Amount">
        <div class="name_address">
          <div v-if="!row.Amount.toString().includes('Tokens')">
            <span>
              <span>{{ row.Amount }}</span>
            </span>
          </div>
          <div v-if="row.Amount.toString().includes('Tokens')" class="skip_route">
            <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{ row.Amount }}</router-link>
          </div>
        </div>
      </template>
    </m-table>
  </div>
</template>

<script>
import Tools from '../util/Tools'
import MTable from './common/MTable'
export default {
  name: 'MTxListPageTable',
  props: {
    items: {
      type: Array,
      default: [],
    },
    showNoData: {
      type: Boolean,
      default: true,
    },
  },
  components: { MTable },
  data() {
    return {
      fields: null,
      transferFields: [
        {
          title: 'Tx_Hash',
          slot: 'Tx_Hash',
          width: 100,
          tooltip: true,
          tooltipClassName: 'tooltip_left',
        },
        {
          title: 'Block',
          slot: 'Block',
          className: 'text_right',
        },
        {
          title: 'From',
          slot: 'From',
        },
        {
          title: 'Amount',
          slot: 'Amount',
          className: 'text_right',
        },
        {
          title: 'Token',
          slot: 'Token',
          key: 'tokenId',
          className: 'text_right',
        },
        {
          title: 'To',
          slot: 'To',
        },
        {
          title: 'TxType',
          slot: 'Tx_Type',
          key: 'Tx_Type',
        },
        {
          title: 'Fee',
          slot: 'Tx_Fee',
          key: 'transferFee',
          className: 'text_right',
        },
        {
          title: 'Signer',
          slot: 'Tx_Signer',
          tooltip: true,
        },
        {
          title: 'Status',
          slot: 'Tx_Status',
          key: 'Tx_Status',
        },
        {
          title: 'Timestamp',
          slot: 'Timestamp',
          key: 'Timestamp',
        },
      ],
      declarationFields: [
        {
          title: this.$t('ExplorerLang.table.txHash'),
          slot: 'Tx_Hash',
          width: 100,
          tooltip: true,
          tooltipClassName: 'tooltip_left',
        },
        {
          title: this.$t('ExplorerLang.table.block'),
          slot: 'Block',
          className: 'text_right',
        },
        {
          title: this.$t('ExplorerLang.table.name'),
          slot: 'Moniker',
        },
        {
          title: this.$t('ExplorerLang.table.operator'),
          slot: 'OperatorAddr',
          tooltip: true,
        },
        {
          title: this.$t('ExplorerLang.table.selfBonded'),
          slot: 'Self_Bonded',
          key: 'Amount',
          className: 'text_right',
        },
        {
          title: this.$t('ExplorerLang.table.TxType'),
          slot: 'Tx_Type',
          key: 'Tx_Type',
        },
        {
          title: this.$t('ExplorerLang.table.fee'),
          slot: 'Tx_Fee',
          key: 'Tx_Fee',
          className: 'text_right',
        },
        {
          title: this.$t('ExplorerLang.table.signer'),
          slot: 'Tx_Signer',
          tooltip: true,
        },
        {
          title: this.$t('ExplorerLang.table.status'),
          slot: 'TxStatus',
          key: 'Tx_Status',
        },
        {
          title: this.$t('ExplorerLang.table.timestamp'),
          slot: 'Timestamp',
          key: 'Timestamp',
        },
      ],
      stakeFields: [
        {
          title: this.$t('ExplorerLang.table.txHash'),
          slot: 'Tx_Hash',
          width: 100,
          tooltip: true,
          tooltipClassName: 'tooltip_left',
        },
        {
          title: this.$t('ExplorerLang.table.block'),
          slot: 'Block',
          className: 'text_right',
        },
        {
          title: this.$t('ExplorerLang.table.from'),
          slot: 'From',
        },
        {
          title: this.$t('ExplorerLang.table.amount'),
          slot: 'Amount',
          key: 'Amount',
          className: 'text_right',
        },
        {
          title: this.$t('ExplorerLang.table.to'),
          slot: 'To',
        },
        {
          title: this.$t('ExplorerLang.table.txType'),
          slot: 'Tx_Type',
          key: 'Tx_Type',
        },
        {
          title: this.$t('ExplorerLang.table.fee'),
          slot: 'Tx_Fee',
          key: 'Tx_Fee',
          className: 'text_right',
        },
        {
          title: this.$t('ExplorerLang.table.signer'),
          slot: 'Tx_Signer',
          tooltip: true,
        },
        {
          title: this.$t('ExplorerLang.table.status'),
          slot: 'Tx_Status',
          key: 'Tx_Status',
        },
        {
          title: this.$t('ExplorerLang.table.txTimestamp'),
          slot: 'Timestamp',
          key: 'Timestamp',
        },
      ],
      govFields: [
        {
          title: 'Tx_Hash',
          slot: 'Tx_Hash',
          width: 100,
          tooltip: true,
          tooltipClassName: 'tooltip_left',
        },
        {
          title: 'Block',
          slot: 'Block',
          className: 'text_right',
        },
        {
          title: 'Proposal_Type',
          slot: 'Proposal_Type',
          key: 'Proposal_Type',
        },
        {
          title: 'Proposal_ID',
          slot: 'Proposal_ID',
          className: 'text_right',
        },
        {
          title: 'Proposal_Title',
          slot: 'Proposal_Title',
        },
        {
          title: 'Amount',
          slot: 'Amount',
          key: 'Amount',
          className: 'text_right',
        },
        {
          title: 'TxType',
          slot: 'Tx_Type',
          key: 'Tx_Type',
        },
        {
          title: 'Fee',
          slot: 'Tx_Fee',
          key: 'Tx_Fee',
          className: 'text_right',
        },
        {
          title: 'Signer',
          slot: 'Tx_Signer',
          tooltip: true,
        },
        {
          title: 'Status',
          slot: 'Tx_Status',
          key: 'Tx_Status',
        },
        {
          title: 'Timestamp',
          slot: 'Timestamp',
          key: 'Timestamp',
        },
      ],
    }
  },
  methods: {
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    setTxFields() {
      if (this.$route.params.txType === 'transfers') {
        this.fields = this.transferFields
      } else if (this.$route.params.txType === 'validations') {
        this.fields = this.declarationFields
      } else if (this.$route.params.txType === 'delegations') {
        this.fields = this.stakeFields
      } else if (this.$route.params.txType === 'governance') {
        this.fields = this.govFields
      }
    },
    substrAmount(amount) {
      if (amount.toString().length > 12) {
        return Tools.formatString(amount.toString(), 12, '...')
      } else {
        return amount
      }
    },
    formatMoniker(moniker) {
      if (!moniker) {
        return ''
      }
      return Tools.formatString(moniker, 13, '...')
    },
  },
  watch: {
    showNoData(showNoData) {},
    items() {
      this.setTxFields()
    },
  },
}
</script>

<style lang="scss" scoped>
 /deep/ .tx_container_table {
  a {
    color: $t_link_c !important;
  }
  .m-table-header {
    position: static;
    margin-top: -0rem !important;
    background-color: #ffffff;
  }
  .m-table-body {
    margin-top: 0rem;
  }
}
.address {
  display: none;
}
.show_no_data {
  .m-table-body {
    .m_table tbody {
      display: none;
    }
  }
}
table {
  thead {
    tr {
      border-top: 0.01rem solid #d7d9e0;
    }
  }
}
.common_hover_parent {
  a {
    display: inline-block;
    position: relative;
    color: $theme_c !important;
  }
}
.common_hover_address_parent {
  a {
    position: relative;
  }
}
.common_font_style {
  font-family: Consolas, Menlo;
}
</style>
