<template>
  <div class="native_assets_content">
    <div class="native_asset_list_table_container" v-if="issueToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.issueTokenTxs') }}</div>
      <div class="native_asset_list_table_content" >
        <list-component
          :token-symbol="mainTokenSymbol"
          :is-loading="isIssueTokenLoading"
          :list-data="issueToken"
          :column-list="issueTokenColumn"
          :pagination="{pageSize:Number(pageSize),dataCount:issueTokenTotalPageNum,pageNum:Number(issueTokenCurrentPageNum)}"
          @pageChange="issueTokenPageChange"
        >
        </list-component>
      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="editToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.editTokenTxs') }}</div>
      <div class="native_asset_list_table_content">
<!--        <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="editToken">
          <el-table-column class-name="hash_status" :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column class-name="symbol" :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column class-name="address" :label="$t('ExplorerLang.table.owner')" prop="owner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.owner" placement="top">
                  <span class="address_link"  @click="addressRoute(row.owner)">
                    {{ Tools.formatValidatorAddress(row.owner) }}
                  </span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>

          <el-table-column :label="$t('ExplorerLang.table.fee')" align="right" prop="fee" v-if="isShowFee" :width="ColumnMinWidth.fee">
              <template slot="header"  slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.fee')}}</span>
                  <el-tooltip :content="mainTokenSymbol"
                              placement="top">
                      <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :width="ColumnMinWidth.time"></el-table-column>
        </el-table>-->
<!--        <div class="pagination_content">
          <m-pagination :total="editTokenTotalPageNum" :page-size="pageSize" :page="editTokenCurrentPageNum" :page-change="editTokenPageChange"></m-pagination>
        </div>-->
        <list-component
            :token-symbol="mainTokenSymbol"
            :is-loading="isEditTokenLoading"
            :list-data="editToken"
            :column-list="editTokenColumn"
            :pagination="{pageSize:Number(pageSize),dataCount:editTokenTotalPageNum,pageNum:Number(editTokenCurrentPageNum)}"
            @pageChange="editTokenPageChange"
        >
        </list-component>
      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="mintToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.mintTokenTxs') }}</div>
      <div class="native_asset_list_table_content">
       <!-- <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="mintToken">
          <el-table-column class-name="hash_status" :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.amount')" prop="amount" :min-width="ColumnMinWidth.amount"></el-table-column>
          <el-table-column class-name="symbol" :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column class-name="address" :label="$t('ExplorerLang.table.owner')" prop="owner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.owner" placement="top">
                  <span class="address_link"  @click="addressRoute(row.owner)">
                    {{ Tools.formatValidatorAddress(row.owner) }}
                  </span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column class-name="to" :label="$t('ExplorerLang.table.mintTo')" prop="mintTo" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.mintTo" placement="top">
                  <span class="address_link"  @click="addressRoute(row.mintTo)">
                    {{ Tools.formatValidatorAddress(row.mintTo) }}
                  </span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" align="right" prop="fee" v-if="isShowFee" :width="ColumnMinWidth.fee">
              <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.fee')}}</span>
                  <el-tooltip :content="mainTokenSymbol"
                              placement="top">
                      <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="mintTokenTotalPageNum" :page-size="pageSize" :page="mintTokenCurrentPageNum" :page-change="mintTokenPageChange"></m-pagination>
        </div>
       -->
        <list-component
            :token-symbol="mainTokenSymbol"
            :is-loading="isMintTokenLoading"
            :list-data="mintToken"
            :column-list="mintTokenColumn"
            :pagination="{pageSize:Number(pageSize),dataCount:mintTokenTotalPageNum,pageNum:Number(mintTokenCurrentPageNum)}"
            @pageChange="mintTokenPageChange"
        >
        </list-component>

      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="burnToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.burnTokenTxs') }}</div>
      <div class="native_asset_list_table_content">
        <!--<el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="burnToken">
          <el-table-column class-name="hash_status" :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.amount')" prop="amount" :min-width="ColumnMinWidth.amount"></el-table-column>
          <el-table-column class-name="symbol" :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column class-name="sender" :label="$t('ExplorerLang.table.sender')" prop="sender" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.sender" placement="top">
                  <span class="address_link"  @click="addressRoute(row.sender)">
                    {{ Tools.formatValidatorAddress(row.sender) }}
                  </span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" align="right" prop="fee" v-if="isShowFee" :width="ColumnMinWidth.fee">
              <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.fee')}}</span>
                  <el-tooltip :content="mainTokenSymbol"
                              placement="top">
                      <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="burnTokenTotalPageNum" :page-size="pageSize" :page="burnTokenCurrentPageNum" :page-change="burnTokenPageChange"></m-pagination>
        -->
        <list-component
            :token-symbol="mainTokenSymbol"
            :is-loading="isBurnTokenLoading"
            :list-data="burnToken"
            :column-list="burnTokenColumn"
            :pagination="{pageSize:Number(pageSize),dataCount:burnTokenTotalPageNum,pageNum:Number(burnTokenCurrentPageNum)}"
            @pageChange="burnTokenPageChange"
        >
        </list-component>
      </div>
    </div>
    <div class="native_asset_list_table_container" v-if="transferToken.length !== 0">
      <div class="txs_title">{{ $t('ExplorerLang.asset.transferOwnerTxs') }}</div>
      <div class="native_asset_list_table_content" >
        <!--<el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="transferToken">
          <el-table-column class-name="hash_status" :label="$t('ExplorerLang.table.txHash')" prop="txHash" :min-width="ColumnMinWidth.txHash">
            <template v-slot:default="{ row }">
              <img class="status_icon" :src="require(`../../assets/${row.status === 1 ? 'success.png' : 'failed.png'}`)" />
              <el-tooltip :content="`${row.txHash}`">
                <router-link :to="`/tx?txHash=${row.txHash}`">{{ Tools.formatTxHash(row.txHash) }} </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column class-name="symbol" :label="$t('ExplorerLang.table.token')" prop="token" :min-width="ColumnMinWidth.symbol">
            <template v-slot:default="{ row }">
              <router-link :to="'/assets/' + row.token"> {{ row.token }}</router-link>
            </template>
          </el-table-column>
          <el-table-column class-name="address" :label="$t('ExplorerLang.table.srcOwner')" prop="srcOwner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <el-tooltip popper-class="tooltip" :content="row.srcOwner" placement="top">
                <span class="address_link"  @click="addressRoute(row.srcOwner)">
                  {{ Tools.formatValidatorAddress(row.srcOwner) }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column class-name="address" :label="$t('ExplorerLang.table.dstOwner')" prop="dstOwner" :min-width="ColumnMinWidth.address">
            <template v-slot:default="{ row }">
              <el-tooltip popper-class="tooltip" :content="row.dstOwner" placement="top">
                <span class="address_link"  @click="addressRoute(row.dstOwner)">
                  {{ Tools.formatValidatorAddress(row.dstOwner) }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.block')" prop="block" :min-width="ColumnMinWidth.block">
            <template v-slot:default="{ row }">
              <router-link :to="'/block/' + row.block">{{ row.block }}</router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.fee')" align="right" prop="fee" v-if="isShowFee" :width="ColumnMinWidth.fee">
              <template slot="header" slot-scope="scope">
                  <span>{{ $t('ExplorerLang.table.fee')}}</span>
                  <el-tooltip :content="mainTokenSymbol"
                              placement="top">
                      <i class="iconfont iconyiwen yiwen_icon" />
                  </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column :label="$t('ExplorerLang.table.timestamp')" prop="time" :width="ColumnMinWidth.time"></el-table-column>
        </el-table>
        <div class="pagination_content">
          <m-pagination :total="transferTokenTotalPageNum" :page-size="pageSize" :page="transferTokenCurrentPageNum" :page-change="transferTokenPageChange"></m-pagination>
        </div>

      -->

        <list-component
            :token-symbol="mainTokenSymbol"
            :is-loading="isTransferTokenLoading"
            :list-data="transferToken"
            :column-list="transferTokenColumn"
            :pagination="{pageSize:Number(pageSize),dataCount:transferTokenTotalPageNum,pageNum:Number(transferTokenCurrentPageNum)}"
            @pageChange="transferTokenPageChange"
        >
          </list-component>

      </div>
    </div>
  </div>

</template>

<script>
import MPagination from '.././common/MPagination'
import Tools from '../../util/Tools'
import { getNativeAssetsTxsApi } from '@/service/api'
import { ColumnMinWidth, TX_TYPE, decimals } from '@/constant'
import { converCoin, addressRoute, getMainToken } from '../../helper/IritaHelper'
import prodConfig from '../../productionConfig'
import parseTimeMixin from '../../mixins/parseTime'
import ListComponent from "../common/ListComponent";
import nativeAssTxColumnConfig from "../tableListColumnConfig/nativeAssTxColumnConfig"
import nativeAssTxEditTokenColumnConfig from "../tableListColumnConfig/nativeAssTxEditTokenColumnConfig";
import nativeAssTxMintColumnConfig from "../tableListColumnConfig/nativeAssTxMintColumnConfig";
import nativeAssTxBurnColumnConfig from "../tableListColumnConfig/nativeAssTxBurnColumnConfig";
import nativeAssTxTransferTokenColumnConfig from "../tableListColumnConfig/nativeAssTxTransferTokenColumnConfig";
export default {
  name: 'AssetTxsComponent',
  components: {ListComponent, MPagination },
  mixins: [parseTimeMixin],
  props: {
    symbol: {
      type:String,
      default:''
    }
  },
  data() {
    return {
      isShowFee: prodConfig.fee.isShowFee,
      isShowDenom: prodConfig.fee.isShowDenom,
      Tools,
      addressRoute,
      ColumnMinWidth,
      issueToken: [],
      editToken: [],
      mintToken: [],
      burnToken: [],
      transferToken: [],
      issueTokenTotalPageNum: 0,
      editTokenTotalPageNum: 0,
      mintTokenTotalPageNum: 0,
      burnTokenTotalPageNum:0,
      transferTokenTotalPageNum: 0,
      issueTokenCurrentPageNum: 1,
      editTokenCurrentPageNum: 1,
      mintTokenCurrentPageNum: 1,
      burnTokenCurrentPageNum: 1,
      transferTokenCurrentPageNum: 1,
      pageSize: 5,
        mainTokenSymbol:'',
		isLoading:false,
      isIssueTokenLoading:false,//新增
      isEditTokenLoading:false,//新增
      isMintTokenLoading:false,//新增
      isBurnTokenLoading:false,//新增
      isTransferTokenLoading:false,
      issueTokenColumn:[],//新增
      editTokenColumn:[],//新增
      mintTokenColumn:[],//新增
      burnTokenColumn:[],//新增
      transferTokenColumn:[],//新增

    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.issueTokenColumn = nativeAssTxColumnConfig
    this.editTokenColumn  = nativeAssTxEditTokenColumnConfig
    this.mintTokenColumn  = nativeAssTxMintColumnConfig
    this.burnTokenColumn  = nativeAssTxBurnColumnConfig
    this.transferTokenColumn = nativeAssTxTransferTokenColumnConfig
    this.setMainToken()
	  this.isIssueTokenLoading = true
	  this.isEditTokenLoading = true
	  this.isMintTokenLoading = true
	  this.isBurnTokenLoading = true
	  this.isTransferTokenLoading = true
    Promise.all([
      this.getIssueToken(),
      this.getEditToken(),
      this.getMintToken(),
      this.getBurnToken(),
      this.getTransferToken()
    ])
      .then(() => {
		  this.isIssueTokenLoading = false
		  this.isEditTokenLoading = false
		  this.isMintTokenLoading = false
		  this.isBurnTokenLoading = false
		  this.isTransferTokenLoading = false
         /**
         * @description: from parseTimeMixin
         */
        return this.parseTime(['issueToken', 'editToken', 'mintToken', 'burnToken', 'transferToken'], 'Time', 'time')
      })
  },
  methods: {
      async setMainToken(){
          let mainToken = await getMainToken();
          if(mainToken && mainToken.symbol){
              this.mainTokenSymbol = mainToken.symbol.toUpperCase();
          }
      },
    async getIssueToken() {
      	this.isIssueTokenLoading = true
      try {
        let { count } = await this.getNativeAssets(null, null, true, TX_TYPE.issue_token,this.symbol)
        this.issueTokenTotalPageNum = count ? count : 0
        let res = await this.getNativeAssets(this.issueTokenCurrentPageNum, this.pageSize, false, TX_TYPE.issue_token,this.symbol)
        let result = res && res.data ? res.data : null
        if (result) {
          let isShowFee = this.isShowFee
          let isShowDenom = this.isShowDenom
          this.issueToken = await Promise.all(
            result.map(async item => {
              let issueTokenData = item.msgs && item.msgs[0].msg
              let fee = isShowFee && item.fee && item.fee.amount && item.fee.amount[0] ? await converCoin(item.fee.amount[0]) : ''
              return {
                owner: issueTokenData && issueTokenData.owner,
                symbol: issueTokenData && issueTokenData.symbol,
                initialSupply: issueTokenData && Tools.formatNumber(issueTokenData.initial_supply),
                mintable: issueTokenData && Tools.firstWordUpperCase(String(issueTokenData.mintable)),
                block: item.height,
                txHash: item.tx_hash,
                // fee: fee ? isShowDenom ? `${Tools.toDecimal(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                fee: fee ? `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                time: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                // record origin time
                Time: Tools.formatLocalTime(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.issueToken = []
        }
		  this.isIssueTokenLoading = false
      } catch (err) {
		  this.isIssueTokenLoading = false
        console.error(err)
      }
    },
    async getEditToken() {
      	this.isEditTokenLoading = true
      try {
        let { count } = await this.getNativeAssets(null, null, true, TX_TYPE.edit_token,this.symbol)
        this.editTokenTotalPageNum = count ? count : 0
        let res = await this.getNativeAssets(this.editTokenCurrentPageNum, this.pageSize, false, TX_TYPE.edit_token,this.symbol)
        let result = res && res.data ? res.data : null
        if (result) {
          let isShowFee = this.isShowFee
          let isShowDenom = this.isShowDenom
          this.editToken = await Promise.all(
            result.map(async item => {
              let editTokenData = item.msgs && item.msgs[0].msg
              let fee = isShowFee && item.fee && item.fee.amount && item.fee.amount[0] ? await converCoin(item.fee.amount[0]) : ''
              return {
                owner: editTokenData && editTokenData.owner,
                token: editTokenData && editTokenData.symbol,
                block: item.height,
                txHash: item.tx_hash,
                // fee: fee ? isShowDenom ? `${Tools.toDecimal(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                fee: fee ? `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                time: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                // record origin time
                Time: Tools.formatLocalTime(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.editToken = []
        }
		  this.isEditTokenLoading = false
      } catch (err) {
		  this.isEditTokenLoading = false
        console.error(err)
      }
    },
    async getMintToken() {
      	this.isMintTokenLoading = true
      try {
        let { count } = await this.getNativeAssets(null, null, true, TX_TYPE.mint_token,this.symbol)
        this.mintTokenTotalPageNum = count ? count : 0
        let res = await this.getNativeAssets(this.mintTokenCurrentPageNum, this.pageSize, false, TX_TYPE.mint_token,this.symbol)
        let result = res && res.data ? res.data : null
        if (result) {
          let isShowFee = this.isShowFee
          let isShowDenom = this.isShowDenom
          this.mintToken = await Promise.all(
            result.map(async item => {
              let mintTokenData = item.msgs && item.msgs[0].msg
              let fee = isShowFee && item.fee && item.fee.amount && item.fee.amount[0] ? await converCoin(item.fee.amount[0]) : ''
              return {
                owner: mintTokenData && mintTokenData.owner,
                token: mintTokenData && mintTokenData.symbol,
                mintTo: mintTokenData && mintTokenData.to,
                amount: (mintTokenData && Tools.toDecimal(mintTokenData.amount, decimals.amount)) || '--',
                block: item.height,
                txHash: item.tx_hash,
                // fee: fee ?  isShowDenom ? `${Tools.toDecimal(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                fee: fee ? `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                time: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                // record origin time
                Time: Tools.formatLocalTime(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.mintToken = []
        }
		  this.isMintTokenLoading = false
      } catch (err) {
		  this.isMintTokenLoading = false
        console.error(err)
      }
    },
    async getBurnToken() {
      	this.isBurnTokenLoading = true
      try {
        let { count } = await this.getNativeAssets(null, null, true, TX_TYPE.burn_token,this.symbol)
        this.burnTokenTotalPageNum = count ? count : 0
        let res = await this.getNativeAssets(this.burnTokenCurrentPageNum, this.pageSize, false, TX_TYPE.burn_token,this.symbol)
        let result = res && res.data ? res.data : null
        if (result) {
          let isShowFee = this.isShowFee
          let isShowDenom = this.isShowDenom
          this.burnToken = await Promise.all(
            result.map(async item => {
              let burnTokenData = item.msgs && item.msgs[0].msg
              let fee = isShowFee && item.fee && item.fee.amount && item.fee.amount[0] ? await converCoin(item.fee.amount[0]) : ''
              return {
                token: burnTokenData && burnTokenData.symbol,
                sender: burnTokenData && burnTokenData.sender,
                amount: (burnTokenData && Tools.toDecimal(burnTokenData.amount, decimals.amount)) || '--',
                block: item.height,
                txHash: item.tx_hash,
                // fee: fee ?  isShowDenom ? `${Tools.toDecimal(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                fee: fee ? `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                time: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                // record origin time
                Time: Tools.formatLocalTime(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.burnToken = []
        }
		  this.isBurnTokenLoading = false
      } catch (err) {
		  this.isBurnTokenLoading = false
        console.error(err)
      }
    },
    async getTransferToken() {
      	this.isTransferTokenLoading = true
      try {
        let { count } = await this.getNativeAssets(null, null, true, TX_TYPE.transfer_token_owner,this.symbol)
        this.transferTokenTotalPageNum = count ? count : 0
        let res = await this.getNativeAssets(this.transferTokenCurrentPageNum, this.pageSize, false, TX_TYPE.transfer_token_owner,this.symbol)
        let result = res && res.data ? res.data : null
        if (result) {
          let isShowFee = this.isShowFee
          let isShowDenom = this.isShowDenom
          this.transferToken = await Promise.all(
            result.map(async item => {
              let transferTokenData = item.msgs && item.msgs[0].msg
              let fee = isShowFee && item.fee && item.fee.amount && item.fee.amount[0] ? await converCoin(item.fee.amount[0]) : ''
              return {
                token: transferTokenData && transferTokenData.symbol,
                srcOwner: transferTokenData && transferTokenData.src_owner,
                dstOwner: transferTokenData && transferTokenData.dst_owner,
                block: item.height,
                txHash: item.tx_hash,
                // fee: fee ? isShowDenom ? `${Tools.toDecimal(fee.amount, decimals.fee)} ${fee.denom.toUpperCase()}` || '--' : `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                fee: fee ? `${Tools.toDecimal(fee.amount, decimals.fee)}` : '--',
                time: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
                // record origin time
                Time: Tools.formatLocalTime(item.time),
                status: item.status,
              }
            })
          )
        } else {
          this.transferToken = []
        }
		  this.isTransferTokenLoading = false
      } catch (err) {
		  this.isTransferTokenLoading = false
        console.error(err)
      }
    },
    async getNativeAssets (pageNum, pageSize, useCount = false, type, symbol) {
      let res;
      if(!symbol) {
        res = await getNativeAssetsTxsApi(pageNum, pageSize, useCount, type)
      } else {
        res = await getNativeAssetsTxsApi(pageNum, pageSize, useCount, type, symbol)
      }
      return res
    },
    issueTokenPageChange(pageNum) {
      if (this.issueTokenCurrentPageNum == pageNum) {
        return
      }
      this.issueTokenCurrentPageNum = pageNum
      this.getIssueToken()
    },
    editTokenPageChange(pageNum) {
      if (this.editTokenCurrentPageNum == pageNum) {
        return
      }
      this.editTokenCurrentPageNum = pageNum
      this.getEditToken()
    },
    mintTokenPageChange(pageNum) {
      if (this.mintTokenCurrentPageNum == pageNum) {
        return
      }
      this.mintTokenCurrentPageNum = pageNum
      this.getMintToken()
    },
    burnTokenPageChange(pageNum) {
      if (this.burnTokenCurrentPageNum == pageNum) {
        return
      }
      this.burnTokenCurrentPageNum = pageNum
      this.getBurnToken()
    },
    transferTokenPageChange(pageNum) {
      if (this.transferTokenCurrentPageNum == pageNum) {
        return
      }
      this.transferTokenCurrentPageNum = pageNum
      this.getTransferToken()
    },
  },
}
</script>

<style lang="scss" scoped>

// ::v-deep th.is-right {
//   text-align: center;
// }

a {
  color: $t_link_c !important;
}
  .native_assets_content {
    max-width: 12rem;
    margin: 0 auto;
    text-align: left;
    .native_asset_title_container {
      margin: 0.28rem 0 0.16rem 0;
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
    .native_asset_list_table_container {
      .txs_title {
        padding: 0 0 0.16rem 0;
        margin-left: 0.1rem;
      }
      .native_asset_list_table_content {
        width: 100%;
        .status_icon {
          width: 0.13rem;
          height: 0.13rem;
          margin-right: 0.05rem;
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
