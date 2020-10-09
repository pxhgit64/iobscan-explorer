<template>
  <div class="tx_detail_container">
    <div class="tx_detail_content_wrap">
      <div class="tx_detail_content">
        <!-- 标题 -->
        <div class="tx_detail_title">
          <div class="tx_detail_title_first">
            {{ `${$t('ExplorerLang.transactionInformation.transactionInformation')} |` }}
          </div>
          <div class="tx_detail_title_hash">{{ txHash }}</div>
          <MClip :text="txHash"></MClip>
        </div>
        <div class="tx_information_content" v-if="!moduleSupport('107', prodConfig.navFuncList)" >
          <p class="tx_information_list_title">{{ $t('ExplorerLang.transactionInformation.baseInfo') }}</p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.blockHeight') }}：</span>
            <span
              ><router-link :to="`/block/${blockHeight}`">{{ blockHeight }}</router-link></span
            >
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.status') }}：</span>
            <span>{{ status }}</span>
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.timestamp') }}：</span>
            <span>{{ timestamp }}</span>
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.signer') }}：</span>
            <span style="word-break:break-all;"
              ><router-link :to="`/address/${signer}`">{{ signer }}</router-link></span
            >
          </p>
          <p class="tx_information_list_item">
            <span>{{ $t('ExplorerLang.transactionInformation.memo') }}：</span>
            <span>{{ memo }}</span>
          </p>
        </div>
        <!-- 交易消息 -->
        <div class="tx_information_tx_message_content" v-if="messages.length !== 0">
          <div class="tx_information_tx_content">
            <div class="tx_information_tx_message_title">
              {{ $t('ExplorerLang.transactionInformation.transactionMessage') }}
            </div>
            <div v-for="(item, index) in messages" :key="index">
              <TxMessage :msg="item" :events="events" />
              <div class="tx_information_tx_message_line" v-if="messages.length > 1 && index != messages.length - 1"></div>
            </div>
          </div>
        </div>
        <!-- 关联交易 -->
        <div class="tx_information_relevance_tx" v-if="txCount > 0">
          <div class="tx_information_relevance_tx_content">
            <div class="tx_information_relevance_tx_title">
              {{ $t('ExplorerLang.transactionInformation.relevanceTx') }}
            </div>
            <div class="tx_information_relevance_tx_list_content">
              <el-table class="table" :data="relevanceTxs" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                  <template slot-scope="scope">
                    <div class="tx_information_relevance_tx_list_content_hash">
                      <img class="service_tx_status" :src="require(`../assets/${scope.row.status == TX_STATUS.success ? 'success.png' : 'failed.png'}`)" />
                      <el-tooltip :content="scope.row.txHash" class="item" placement="top" effect="dark">
                        <router-link :to="`tx?txHash=${scope.row.txHash}`">
                          {{ formatTxHash(scope.row.txHash) }}
                        </router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')" prop="txType"></el-table-column>
                <el-table-column :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
                  <template slot-scope="scope">
                    <span>{{ formatAddress(scope.row.txType == TX_TYPE.call_service ? scope.row.requestContextId : scope.row.requestId) }}</span>
                  </template>
                </el-table-column>
                <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
                  <template slot-scope="scope">
                    <router-link :to="`/block/${scope.row.blockHeight}`">{{ scope.row.blockHeight }} </router-link>
                  </template>
                </el-table-column>
                <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.provider')">
                  <template slot-scope="scope">
                    <router-link v-if="scope.row.txType == TX_TYPE.respond_service" :to="`/address/${scope.row.provider}`">
                      {{ formatAddress(scope.row.provider) }}
                    </router-link>
                    <div v-else>
                      <el-tooltip effect="dark" v-if="(scope.row.provider || []).length === 1" :content="scope.row.provider[0]" placement="top">
                        <router-link :to="`/address/${scope.row.provider[0]}`">
                          {{ formatAddress(scope.row.provider[0]) }}
                        </router-link>
                      </el-tooltip>
                      <div class="service_tx_muti_to_container" v-else>
                        <router-link :to="`/tx?txHash=${scope.row.txHash}`"> {{ scope.row.provider.length }} providers </router-link>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                  <template slot-scope="scope">
                    <span>{{ scope.row.time }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination_content" v-show="txCount > pageSize">
              <keep-alive>
                <m-pagination :page-size="Number(pageSize)" :total="txCount" :page="Number(pageNum)" :page-change="pageChange"> </m-pagination>
              </keep-alive>
            </div>
          </div>
        </div>
        <!-- 复用部分 -->
        <div class="tx_detail_common_information_content_wrap" v-if="moduleSupport('107', prodConfig.navFuncList)">
            <!-- 标题 -->
            <div class="tx_detail_header_title">{{ $t('ExplorerLang.transactionInformation.transactionInformations.title') }}</div>
            <!-- 表格内容 -->
            <div class="tx_detail_common_information_wrap">
                <ul class="tx_detail_common_information_content">
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.block') }} :</span>
                        <div class="tx_detail_common_information_item_value skip_route">
                            <router-link :to="`/block/${blockValue}`">{{blockValue}}</router-link>
                        </div>
                    </li>
                    <!-- Status  -->
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.status') }} :</span>
                        <div class="tx_detail_common_information_item_value" style="display: flex">
                            <span :style="{color: statusValue === 'Failed' ? '#fa8593' : ''}">{{statusValue}}</span>
                            <div v-if="statusValue === 'Failed'" class="log_content_container">
                                <i class="iconfont iconyiwen" style="margin-left: 0.03rem;"></i>
                                <div class="tip_content" :class="failTipStyle ? 'overstep_style' :''" :style="{left:`${-((logContentWidth / 2) - 6) / 100}rem`}">
                                    <span class="log_content"  ref="logContent">{{log}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.timestamp') }} :</span>
                        <div class="tx_detail_common_information_item_value">{{timestampValue}}</div>
                    </li>
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.fee') }}  :</span>
                        <div class="tx_detail_common_information_item_value">{{feeValue}}</div>
                    </li>
                    <!-- Gas Used -->
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.gasUsed') }} :</span>
                        <div class="tx_detail_common_information_item_value gas_container">
                            <span>{{gasUsedValue}}</span>
                            <div class="gas_content_container" style="margin-left: 0.03rem;">
                                <i class="el-icon-warning-outline"></i>
                                <div class="gas_tip_content_wrap"  :style="{left:`${-((gasContentWidth / 2) - 7) / 100}rem`}">
                                    <div class="gas_tip_content">
                                        <p>Gas Price : {{gasPrice ? gasPrice + ' Nano' : '--'}}</p>
                                        <p>Gas Used : {{gasUsed || '--'}}</p>
                                        <p>Gas Wanted : {{gasWanted || '--'}}</p>
                                        <p>Gas Limit : {{gasLimit || '--'}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <!-- Signer -->
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.signer') }} :</span>
                        <div class="tx_detail_common_information_item_value skip_route iconProfiler_content">
                            <router-link :to="`/address/${signerValue}`">{{signerValue}}</router-link>
                            <span class="address_information_address_status_profiler" v-if="isProfiler">Profiler</span>
                        </div>
                    </li>
                    <li class="tx_detail_common_information_item">
                        <span class="tx_detail_common_information_item_name">{{ $t('ExplorerLang.transactionInformation.transactionInformations.memo') }} :</span>
                        <div class="tx_detail_common_information_item_value">{{memoValue}}</div>
                    </li>
                </ul>
            </div>
            <!-- 交易消息 -->
            <div class="tx_detail_message_content_title">{{ $t('ExplorerLang.transactionInformation.transactionMessage.title') }}</div>
            <div class="tx_detail_message_information_content">
                <ul class="tx_detail_message_information">
                    <li class="tx_detail_message_information_item" v-for="(item,key) in messageList" :key="key">
                        <!-- 左侧的信息 -->
                        <span class="tx_detail_message_information_name" v-if="key !=='tooltip'">{{key}}</span>
                        <div>
                            <div class="tx_detail_message_information_value" :class="key !== 'Commission Rate :'? 'hide_rate_tip' : ''" v-for="(value,index) in item" :key="index">
                                <span v-if="key !== 'From :'
                                    && key !== 'To :'
                                    && key !== 'Owner :'
                                    && key !== 'Operator Address :'
                                    && key !== 'Owner Address :'
                                    && key !== 'Delegator Address :'
                                    && key !== 'Withdraw Address:'
                                    && key !== 'Proposer :'
                                    && key !== 'Depositor :'
                                    && key !== 'Proposal ID :'
                                    && key !== 'Voter :'
                                    && key !== 'Original Owner :'
                                    && key !== 'New Owner :'
                                    && key !== 'Website :'
                                    && key !== 'tooltip'
                                    && key !== 'Identity :'
                                    && key !== 'Software :'
                                    && key !== 'Address :'
                                    && key !== 'Added By :'
                                    && key !== 'Deleted By :'
                                    && key !== 'Hash Lock :'
                                    && key !== 'DestAddress :'
                                    && key !== 'Symbol :'
                                    && key !== 'Sender :'
                                    && key !== 'Input Address :'
                                    && key !== 'Output Address :'">
                                    {{value}}
                                </span>
                                <span class="skip_route"
                                    v-if="key === 'From :'
                                    || key === 'To :'
                                    || key === 'Owner :'
                                    || key === 'Operator Address :'
                                    || key === 'Owner Address :'
                                    || key === 'Delegator Address :'
                                    || key === 'Withdraw Address:'
                                    || key === 'Proposer :'
                                    || key === 'Depositor :'
                                    || key === 'Proposal ID :'
                                    || key === 'Voter :'
                                    || key === 'Original Owner :'
                                    || key === 'New Owner :'
                                    || key === 'Website :'
                                    || key === 'tooltip'
                                    || key === 'Identity :'
                                    || key === 'Software :'
                                    || key === 'Address :'
                                    || key === 'Added By :'
                                    || key === 'Deleted By :'
                                    || key === 'Hash Lock :'
                                    || key === 'DestAddress :'
                                    || key === 'Symbol :'
                                    || key === 'Sender :'
                                    || key === 'Input Address :'
                                    || key === 'Output Address :'">
                                    <router-link v-if="key === 'Input Address :' && value !== '-'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Output Address :' && value !== '-'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Sender :' && value !== '-'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Symbol :' && value !== '-'" :to="`asset/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'DestAddress :' && value !== '-'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'From :' && value !== '-' &&  typeof(value) === 'string'" :to="`/address/${value}`">{{fromMoniker || value}}</router-link>
                                    <router-link v-if="key === 'From :' && value !== '-' &&  typeof(value) === 'object' && !value.isLink" :to="`/address/${value.address}`">{{value.moniker || value.address}}</router-link>
                                    <router-link v-if="key === 'To :' && value !== '-'" :to="`/staking/${value}`">{{toMoniker || value}}</router-link>
                                    <router-link v-if="key === 'Owner :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Operator Address :'" :to="`/staking/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'Owner Address :'" :to="`/address/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'Delegator Address :'" :to="`/address/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'Withdraw Address:'" :to="`/address/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'Proposer :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Depositor :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Proposal ID :'" :to="`ProposalsDetail/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'Voter :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Original Owner :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'New Owner :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Address :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Added By :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Deleted By :'" :to="addressRoute(value)">{{value}}</router-link>
                                    <router-link v-if="key === 'Hash Lock :' && messageList['TxType :'][0] !== 'CreateHTLC'" :to="`/htlc/${value}`">{{value}}</router-link>
                                    <router-link v-if="key === 'Hash Lock :' && messageList['TxType :'][0] === 'CreateHTLC' && statusValue === 'Success'" :to="`/htlc/${value}`">{{value}}</router-link>
                                    <span v-if="key === 'Hash Lock :' && statusValue === 'Failed' && messageList['TxType :'][0] === 'CreateHTLC'">{{value}}</span>
                                    <span v-if="key === 'Website :' && value !== '--'" @click="openUrl(value)" style="color: var(--bgColor);cursor: pointer;">{{value}}</span>
                                    <span v-if="key === 'Software :'&& value !== '--'" @click="openUrl(value)" style="color: var(--bgColor);cursor: pointer;">{{value}}</span>
                                    <span v-if="key === 'Identity :'&& value !== '--'" @click="getKeyBaseName(value)" style="color: var(--bgColor);cursor: pointer;">{{value}}</span>
                                    <span v-if="key === 'From :' && value === '-'">--</span>
                                    <span v-if="key === 'From :' && value.isLink">{{value.moniker || value.address}}</span>
                                    <span v-if="key === 'To :' && value === '-'">--</span>
                                    <span v-if="key === 'DestAddress :' && value === '-'">--</span>
                                    <span v-if="key === 'Website :' && value === '--'">--</span>
                                    <span v-if="key === 'Software :' && value === '--'">--</span>
                                    <span v-if="key === 'Identity :' && value === '--'">--</span>
                                </span>
                                <div class="commission_rate_container" v-if="key === 'Commission Rate :' && messageList['TxType :'][0] === 'CreateValidator' && value !== '--'">
                                    <i class="el-icon-warning-outline"></i>
                                    <div class="commission_rate_content_wrap" :style="{left:`${-((rateContentWidth / 2) - 7) / 100}rem`}">
                                        <div class="commission_rate_content">
                                            <p>Max Rate : {{messageList.tooltip.maxRate || '--'}}</p>
                                            <p>Max Change Rate : {{messageList.tooltip.maxChangeRate || '--'}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '../util/Tools'
import MPagination from './common/MPagination'
import MClip from './common/MClip.vue'
import TxMessage from './common/TxMessage.vue'
import { getTxDetail, getRelevanceTxList } from '../service/api'
import { TX_TYPE, TX_STATUS, ColumnMinWidth } from '../constant'
import { moduleSupport } from '../helper/ModulesHelper'
import prodConfig from '../productionConfig'
import slef_axios from "../axios"

import formatMessage from "../util/txdetail.js"
import axios from 'axios'
export default {
  name: 'TxDetail',
  components: { MPagination, MClip, TxMessage },
  data() {
    return {
      moduleSupport,
      prodConfig,
      TX_TYPE,
      TX_STATUS,
      ColumnMinWidth,
      txHash: '',
      blockHeight: '',
      status: '',
      timestamp: '',
      signer: '',
      memo: '',
      txType: '',
      requestContextId: '',
      relevanceTxs: [],
      txCount: 0,
      pageNum: 1,
      pageSize: 10,
      messages: [],
      events: [],
      
      txHashValue: '',
      blockValue: '',
      statusValue: '',
      timestampValue: '',
      feeValue: '',
      gasUsedValue: '',
      signerValue: '',
      memoValue: '',
      messageList: null,
      fromMoniker:'',
      toMoniker:'',
      log:'',
      gasPrice:'',
      gasLimit:'',
      gasUsed:'',
      gasWanted:'',
      logContentWidth: '',
      gasContentWidth:'',
      rateContentWidth:'',
      flShowRateToolTip: false,
      isProfiler:false,
      failTipStyle:false,
    }
  },
  mounted() {
    this.getTransactionInformation()
    if(moduleSupport('107', prodConfig.navFuncList)) {
        this.getTxDetailInformation()
    }
  },
  watch:{
      log(){
          this.$nextTick( () => {
              let toolTipMaxWidth = 400;
              this.logContentWidth = document.getElementsByClassName('tip_content')[0].clientWidth;
              if(this.logContentWidth > toolTipMaxWidth){
              this.failTipStyle = true;
              }
          })
      },
      gasPrice(){
          this.$nextTick( () => {
              this.gasContentWidth = document.getElementsByClassName('gas_tip_content_wrap')[0].clientWidth;
          })
      },
      messageList(){
          if(this.flShowRateToolTip){
              this.$nextTick(() => {
                  this.rateContentWidth = document.getElementsByClassName('commission_rate_content_wrap')[0].clientWidth;
              })
          }
      }
  },
  methods: {
    async getTransactionInformation() {
      try {
        const res = await getTxDetail(this.$route.query.txHash)
        if (res) {
          this.messages = res.msgs || []
          this.events = res.events
          // console.log(res)
          this.txHash = res.tx_hash || '--'
          this.blockHeight = res.height || '--'
          this.status = res.status === TX_STATUS.success ? 'Success' : 'Failed'
          this.timestamp = Tools.getDisplayDate(res.time) || '--'
          this.signer = res.signer || '--'
          this.memo = res.memo ? res.memo : '--'
          this.txType = res.msgs[0].type || '--'
          switch (this.txType) {
            case TX_TYPE.mint_nft:
              break
            case TX_TYPE.burn_nft:
              break
            case TX_TYPE.create_record:
              break
            case TX_TYPE.define_service:
              break
            case TX_TYPE.bind_service:
              break
            case TX_TYPE.send:
              break
            case TX_TYPE.call_service:
              res.events.forEach(item => {
                ;(item.attributes || []).forEach(attr => {
                  if (attr.key == 'request_context_id') {
                    this.requestContextId = attr.value || '--'
                  }
                })
              })
              break
            case TX_TYPE.transfer_nft:
              break
            case TX_TYPE.edit_nft:
              break
            case TX_TYPE.issue_denom:
              break
            case TX_TYPE.respond_service:
              this.requestContextId = (res.msgs[0].msg.ex || {}).request_context_id || '--'
              break
            case TX_TYPE.pause_request_context:
              break
            case TX_TYPE.start_request_context:
              break
            case TX_TYPE.kill_request_context:
              break
            case TX_TYPE.update_request_context:
              break
            case TX_TYPE.update_service_binding:
              break
            case TX_TYPE.disable_service_binding:
              break
            case TX_TYPE.enable_service_binding:
              break
            case TX_TYPE.refund_service_deposit:
              break
            case TX_TYPE.recv_packet:
              break
          }
          this.relevanceTxList()
        }
      } catch (e) {
        if (!moduleSupport('107', prodConfig.navFuncList)) {
          console.error(e)
          this.$message.error(this.$t('ExplorerLang.message.requestFailed'))
        }
      }
    },
    pageChange(pageNum) {
      if (this.pageNum === pageNum) return
      this.pageNum = pageNum
      this.relevanceTxList()
    },
    async relevanceTxList() {
      let type = ''
      switch (this.txType) {
        case TX_TYPE.call_service:
          type = TX_TYPE.respond_service
          break
        case TX_TYPE.respond_service:
          type = TX_TYPE.call_service
          break
      }
      console.log(this.TxType, '///', type, '///', this.requestContextId)
      if (type && type.length && this.requestContextId && this.requestContextId.length) {
        try {
          const res = await getRelevanceTxList(type, this.requestContextId, this.pageNum, this.pageSize, true)
          if (res) {
            this.txCount = res.count
            this.relevanceTxs = res.data.map(tx => {
              let result = {
                status: tx.status,
                txHash: tx.tx_hash,
                txType: tx.type,
                blockHeight: tx.height,
                time: Tools.getDisplayDate(tx.time),
              }
              switch (tx.type) {
                case TX_TYPE.call_service:
                  result.provider = tx.msgs[0].msg.providers
                  tx.events.forEach(item => {
                    ;(item.attributes || []).forEach(attr => {
                      if (attr.key == 'request_context_id') {
                        result.requestContextId = attr.value
                      }
                    })
                  })
                  break
                case TX_TYPE.respond_service:
                  result.provider = tx.msgs[0].msg.provider
                  result.requestId = tx.msgs[0].msg.request_id
                  break
              }
              return result
            })
          }
          console.log('=========:', this.relevanceTxs)
        } catch (e) {
          console.error(e)
        }
      }
    },
    formatTxHash(TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    formatAddress(address) {
      return Tools.formatValidatorAddress(address)
    },
    getCallProviders(providers) {
      if (providers && providers.length > 2) {
        return providers.slice(0, 2)
      }
      return providers
    },
    openUrl(url) {
        url = url.trim();
        if (url) {
            if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
                url = `http://${url}`;
            }
            window.open(url);
        }
    },
    getKeyBaseName(identity) {
        if(identity !== '--'){
            let url = `https://keybase.io/_/api/1.0/user/lookup.json?fields=basics&key_suffix=${identity}`;
            if (identity) {
                slef_axios.http(url).then(res => {
                    if (res.them && res.them[0].basics.username) {
                        window.open(`https://keybase.io/${res.them[0].basics.username}`)
                    }
                });
            }
        }
    },
    async getTxDetailInformation(){
        const { data:res } = await axios.get(`https://www.irisplorer.io/api/tx/${this.$route.query.txHash}`)
        try {
            if(res){
                let fromInformation,toInformation;
                fromInformation = Tools.formatListAmount(res).fromAddressAndMoniker;
                toInformation = Tools.formatListAmount(res).toAddressAndMoniker;
                this.gasPrice = Tools.convertScientificNotation2Number(
                    Tools.formaNumberAboutGasPrice(res.gas_price)
                );
                if(res.isProfiler){
                    this.isProfiler = res.isProfiler;
                }
                this.gasLimit = res.gas_limit;
                this.gasUsed = res.gas_used;
                this.gasWanted = res.gas_wanted;
                this.txHashValue = res.hash;
                this.txHash = res.hash;
                this.log = res.log;
                this.blockValue = res.block_height;
                this.statusValue = Tools.firstWordUpperCase(res.status);
                this.timestampValue = Tools.format2UTC(res.timestamp);
                this.feeValue = Tools.formatFee(res.fee);
                this.gasUsedValue = res.gas_used;
                this.signerValue = res.signer;
                this.memoValue = res.memo ? res.memo : '--';
                this.fromMoniker =  fromInformation.length > 1 ? fromInformation.length : fromInformation.length === 1 ? fromInformation[0].moniker :'';
                this.toMoniker = toInformation.length > 1 ? toInformation.length : toInformation.length === 1 ? toInformation[0].moniker :'';
                console.log('转换前',res)
                this.messageList = formatMessage.switchTxType(res);
                if(this.messageList.tooltip){
                    this.flShowRateToolTip = true
                }
                console.log('转换后',this.messageList)
            }
        }catch (e) {
            console.error(e)
        }
        
        // Server.commonInterface( {txDetail: {txHash: this.$route.query.txHash} },(res) => {
        //     try {
        //         if(res){
        //             let fromInformation,toInformation;
        //             fromInformation = Tools.formatListAmount(res).fromAddressAndMoniker;
        //             toInformation = Tools.formatListAmount(res).toAddressAndMoniker;
        //             this.gasPrice = Tools.convertScientificNotation2Number(
        //                 Tools.formaNumberAboutGasPrice(res.gas_price)
        //             );
        //             if(res.isProfiler){
        //                 this.isProfiler = res.isProfiler;
        //             }
        //             this.gasLimit = res.gas_limit;
        //             this.gasUsed = res.gas_used;
        //             this.gasWanted = res.gas_wanted;
        //             this.txHashValue = res.hash;
        //             this.log = res.log;
        //             this.blockValue = res.block_height;
        //             this.statusValue = Tools.firstWordUpperCase(res.status);
        //             this.timestampValue = Tools.format2UTC(res.timestamp);
        //             this.feeValue = Tools.formatFee(res.fee);
        //             this.gasUsedValue = res.gas_used;
        //             this.signerValue = res.signer;
        //             this.memoValue = res.memo ? res.memo : '--';
        //             this.fromMoniker =  fromInformation.length > 1 ? fromInformation.length : fromInformation.length === 1 ? fromInformation[0].moniker :'';
        //             this.toMoniker = toInformation.length > 1 ? toInformation.length : toInformation.length === 1 ? toInformation[0].moniker :'';
        //             this.messageList = formatMessage.switchTxType(res);
        //             if(this.messageList.tooltip){
        //                 this.flShowRateToolTip = true
        //             }
        //         }

        //     }catch (e) {
        //         console.error(e)
        //     }
        // })
    }
  },
}
</script>

<style scoped lang="scss">
a {
  color: $t_link_c !important;
}
.tx_detail_container {
  padding: 0 0.15rem;
  .tx_detail_content_wrap {
    max-width: 12rem;
    margin: 0 auto;
    .tx_detail_content {
      .tx_detail_title {
        display: flex;
        justify-content: flex-start;
        color: $t_first_c;
        font-size: $s18;
        line-height: 0.21rem;
        margin: 0.3rem 0 0.15rem 0.25rem;
        text-align: left;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        .tx_detail_title_first {
          white-space: nowrap;
          margin-right: 0.05rem;
        }
        .tx_detail_title_hash {
          font-size: $s14;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: $t_first_c;
          line-height: 0.2rem;
          word-break: break-all;
          margin-right: 0.05rem;
        }
      }
      .tx_information_content {
        box-sizing: border-box;
        padding: 0.25rem;
        background: $bg_white_c;
        text-align: left;
        border-radius: 0.05rem;
        border: 1px solid $bd_first_c;
        .tx_information_list_title {
          font-size: $s16;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: $t_first_c;
          line-height: 22px;
          margin-bottom: 0.48rem;
        }
        .tx_information_list_item {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 0.26rem;
          span:nth-of-type(1) {
            margin-right: 0.15rem;
            text-align: left;
            min-width: 1.5rem;
            color: $t_second_c;
            font-size: $s14;
            line-height: 0.16rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
          }
          span:nth-of-type(2) {
            text-align: left;
            flex: 1;
            color: $t_first_c;
            font-size: $s14;
            line-height: 0.16rem;
          }
        }
        .tx_information_list_item:last-child {
          margin-bottom: 0;
        }
      }
      .tx_information_tx_message_content {
        margin: 0.48rem 0 0.1rem 0;
        .tx_information_tx_content {
          box-sizing: border-box;
          padding: 0.25rem;
          background: $bg_white_c;
          border-radius: 0.05rem;
          border: 1px solid $bd_first_c;
          .tx_information_tx_message_title {
            text-align: left;
            font-size: $s16;
            font-weight: bold;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
          }
          .tx_information_tx_message_line {
            height: 0.01rem;
            background: $bd_first_c;
          }
        }
      }
      .tx_information_relevance_tx {
        margin: 0.48rem 0 0.1rem 0;
        .tx_information_relevance_tx_content {
          box-sizing: border-box;
          padding: 0.25rem;
          background: $bg_white_c;
          border-radius: 0.05rem;
          border: 1px solid $bd_first_c;
          .tx_information_relevance_tx_title {
            text-align: left;
            font-size: $s16;
            font-weight: bold;
            margin-bottom: 0.48rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
          }
          .tx_information_relevance_tx_list_content {
            .tx_information_relevance_tx_list_content_hash {
              display: flex;
              align-items: center;
              .service_tx_status {
                width: 0.13rem;
                height: 0.13rem;
                margin-right: 0.05rem;
              }
            }
          }
          .pagination_content {
            display: flex;
            justify-content: flex-end;
            margin: 0.1rem 0 0.2rem 0;
          }
        }
      }
      .tx_detail_common_information_content_wrap{
        text-align: left;
        padding-top: 0.05rem;
        max-width: 12.8rem;
        margin: 0 auto;
        .tx_detail_header_title{
            text-align: left;
            height: 0.7rem;
            line-height: 0.7rem;
            color:$t_first_c;
            margin-left: 0.2rem;
            font-size: 0.18rem;
        }
        .tx_detail_common_information_wrap{
            background: #fff;
            border:0.01rem solid #d7d9e0;
            box-sizing: border-box;
            padding: 0.2rem;
            font-size: 0.14rem;
            .tx_detail_common_information_content{
                .tx_detail_common_information_item{
                    padding: 0.05rem 0;
                    display: flex;
                    .tx_detail_common_information_item_name{
                        width: 1.5rem;
                        color: $t_second_c;
                    }
                    .tx_detail_common_information_item_value{
                        display: flex;
                        color: $t_first_c;
                        span{
                            color: $t_first_c;
                            overflow-x: auto;
                            overflow-y: hidden;
                        }
                        .log_content_container{
                            position: relative;
                            .iconyiwen{
                                padding-left: 0.05rem;
                                font-size: 0.14rem;
                                color: #fa8593;
                            }
                            &:hover{
                                .tip_content{
                                    visibility: visible;
                                }
                            }
                            .tip_content{
                                position: absolute;
                                bottom:0.25rem;
                                visibility: hidden;
                                .log_content{
                                    white-space: nowrap;
                                    bottom: 0.25rem;
                                    word-break: normal;
                                    background: #000;
                                    color:#fff;
                                    padding: 0.08rem 0.15rem;
                                    border-radius: 0.04rem;
                                    &::after{
                                        position: absolute;
                                        width: 0;
                                        height: 0;
                                        border: 0.1rem solid transparent;
                                        content: "";
                                        display: block;
                                        border-top-color: #000000;
                                        left: 50%;
                                        margin-left: -0.06rem;
                                    }
                                }

                            }
                            .overstep_style{
                                left: -1.5rem!important;
                                .log_content{
                                    &::after{
                                        left: 1.5rem !important;
                                        margin-left: 0 !important;
                                    }
                                }
                            }
                        }
                        .address_information_address_status_profiler{
                            background: $theme_c;
                            min-width: 0.65rem;
                            font-size: 0.12rem;
                            color: #fff;
                            padding: 0.02rem 0.14rem;
                            border-radius: 0.22rem;
                            margin-left: 0.05rem;
                        }
                    }
                    .iconProfiler_content{
                        overflow-x: auto;
                        overflow-y: hidden;
                    }
                    .gas_container{
                        .gas_content_container{
                            position: relative;
                            &:hover{
                                .gas_tip_content_wrap{
                                    visibility: visible;
                                }
                            }
                            .el-icon-warning-outline{
                                padding-left: 0.05rem;
                                font-size: 0.14rem;
                                color:$theme_c;

                            }
                            .gas_tip_content_wrap{
                                position: absolute;
                                bottom: 0.25rem;
                                left: -1.2rem;
                                visibility: hidden;
                                .gas_tip_content{
                                    background: #000;
                                    color: #fff;
                                    padding: 0.09rem 0.15rem;
                                    border-radius: 0.04rem;
                                    p{
                                        display: flex;
                                        white-space: nowrap;
                                    }
                                    &::after{
                                        position: absolute;
                                        width: 0;
                                        height: 0;
                                        border: 0.14rem solid transparent;
                                        content: "";
                                        display: block;
                                        border-top-color: #000000;
                                        left: 50%;
                                        margin-left: -0.08rem;
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
        .tx_detail_message_content_title{
            text-align: left;
            font-size: 0.18rem;
            height: 0.7rem;
            line-height: 0.7rem;
            margin-left: 0.2rem;
            color:$t_first_c;
        }
        .tx_detail_message_information_content{
            padding-bottom: 0.4rem;
            .tx_detail_message_information{
                box-sizing: border-box;
                padding: 0.2rem;
                background: #fff;
                border: 0.01rem solid #d7d9e0;
                .tx_detail_message_information_item{
                    padding: 0.05rem 0;
                    display: flex;
                    font-size: 0.14rem;
                    .tx_detail_message_information_name{
                        width: 1.5rem;
                        min-width: 1.5rem;
                        max-width: 1.5rem;
                        color: $t_second_c;
                    }
                    .hide_rate_tip{
                        overflow-x: auto;
                        overflow-y: hidden;
                    }
                    .tx_detail_message_information_value{
                        display: flex;
                        color: $t_first_c;

                        .commission_rate_container{
                            position: relative;
                            display: flex;
                            i{
                                font-size: 0.14rem;
                                padding-left: 0.05rem;
                                color:$theme_c;
                            }
                            &:hover{
                                .commission_rate_content_wrap{
                                    visibility: visible;
                                }
                            }
                            .commission_rate_content_wrap{
                                background: #000;
                                color: #fff;
                                padding: 0.08rem 0.15rem;
                                border-radius: 0.04rem;
                                position: absolute;
                                bottom:0.3rem;
                                visibility: hidden;
                                .commission_rate_content{
                                    p{
                                        display: flex;
                                        white-space: nowrap;
                                    }
                                    &::after{
                                        position: absolute;
                                        width: 0;
                                        height: 0;
                                        border: 0.14rem solid transparent;
                                        content: "";
                                        display: block;
                                        border-top-color: #000000;
                                        left: 50%;
                                        margin-left: -0.08rem;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
      }
    }
  }
}

@media screen and (max-width: 1280px){
    .tx_detail_container{
        .tx_detail_common_information_content_wrap{
            .tx_detail_common_information_wrap{
                margin: 0 0.2rem;
            }
            .tx_detail_message_information_content{
                margin: 0 0.2rem;
            }
        }
    }
}
@media screen and (max-width: 910px){
    .tx_detail_container{
        .tx_detail_common_information_content_wrap{
            padding-top: 0;
            .tx_detail_common_information_wrap{
                margin: 0 0.1rem;
                .tx_detail_common_information_content{
                    .tx_detail_common_information_item{
                        flex-direction: column;
                        .tx_detail_common_information_item_value{
                            display: flex;
                            .log_content_container{
                                .tip_content{
                                    width: 2.25rem;
                                    left: -0.12rem !important;
                                    .log_content{
                                        display: inline-block;
                                        overflow-x: auto;
                                        overflow-y: hidden;
                                        padding: 0.04rem 0.1rem !important;
                                        width: 100%;
                                        &::after{
                                            left: 0.2rem;
                                        }
                                    }
                                }
                            }
                        }
                        .gas_container{
                            .gas_content_container{
                                .gas_tip_content_wrap{
                                    left: -0.2rem !important;
                                    .gas_tip_content{
                                        &::after{
                                            left: 0.25rem;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .tx_detail_message_information_content{
                margin: 0 0.1rem;
                padding-bottom: 0.4rem;
                .tx_detail_message_information{
                    .tx_detail_message_information_item{
                        flex-direction: column;
                        padding: 0;
                        .tx_detail_message_information_value{
                            .commission_rate_container{
                                .commission_rate_content_wrap{
                                    left: -0.2rem !important;
                                    .commission_rate_content{
                                        &::after{
                                            left: 0.25rem;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}
@media screen and (max-width: 768px) {
  .tx_detail_container {
    .tx_detail_content_wrap {
      .tx_detail_content {
        .tx_detail_title {
        }
        .tx_information_content {
          .tx_information_list_item {
            span:nth-of-type(1) {
              min-width: 1rem;
            }
            span:nth-of-type(2) {
            }
          }
          .tx_information_list_item:last-child {
          }
        }
        .tx_information_tx_message_content {
          .tx_information_tx_message_title {
          }
        }
      }
    }
  }
}
</style>
