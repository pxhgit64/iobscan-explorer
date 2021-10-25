<template>
	<div class="tx_content_container">
		<div class="tx_content_wrap">
			<div class="tx_content_header_title">
				<p class="tc_content_header">{{$t('ExplorerLang.transactions.title')}}</p>
			</div>
			<list-component
				:tableWidth="'11.5rem'"
				:is-show-token-type="true"
				:is-loading="isLoading"
				:token-symbol="mainTokenSymbol"
				:list-data="transactionArray"
				:column-list="txColumnList"
				:pagination="{pageSize:Number(pageSize),dataCount:txCount,pageNum:Number(pageNum)}"
				@pageChange="pageChange"
				:empty-text="$t('ExplorerLang.table.emptyDescription')">
				<template v-slot:msgType>
					<tabs-component :tab-list="txTypeOption"
									@onSelectMagType="getFilterTxs"></tabs-component>
				</template>
				<template v-slot:resetButton>
					<tx-reset-button-component @resetParams="resetFilterCondition"></tx-reset-button-component>
				</template>
				
				<template v-slot:datePicket>
					<tx-status-tabs-components
						@onChangTxStatus="changeTxStatus"
						@onChangeDate="changeTime"
						ref="statusDatePicker"></tx-status-tabs-components>
				</template>
				<template v-slot:txCount>
					<tx-count-component :title="$t('ExplorerLang.transactions.txs')" :icon="'iconTrainsaction'" :tx-count="txCount"></tx-count-component>
				</template>
			</list-component>
		</div>
	</div>
</template>

<script>
import Tools from "../util/Tools"
import MPagination from "./common/MPagination";
import TxListComponent from "./common/TxListComponent";
import {TxHelper} from "../helper/TxHelper";
import {getTxList, getAllTxTypes} from '../service/api';
import {
	TX_TYPE,
	TX_STATUS,
	ColumnMinWidth,
	monikerNum,
	decimals,
	IRIS_ADDRESS_PREFIX,
	COSMOS_ADDRESS_PREFIX
} from '../constant';
import ListComponent from "./common/ListComponent";
import txCommonTable from "./tableListColumnConfig/txCommonTable";
import txCommonLatestTable from "./tableListColumnConfig/txCommonLatestTable";
import {getAmountByTx, getDenomMap, getDenomTheme} from "../helper/txListAmoutHelper";
import {addressRoute, formatMoniker, converCoin, getMainToken, getTxType} from '@/helper/IritaHelper';
import parseTimeMixin from '../mixins/parseTime'
import prodConfig from "../productionConfig";
import TabsComponent from "./common/TabsComponent";
import TxStatusTabsComponents from "./common/TxStatusTabsComponents";
import TxCountComponent from "./TxCountComponent";
import {needAddColumn} from "./tableListColumnConfig/allTxTableColumnConfig";
import SignerColunmn from "./tableListColumnConfig/SignerColunmn";
import TxResetButtonComponent from "./common/TxResetButtonComponent";
export default {
	name: "TxList",
	components: {
		TxResetButtonComponent,
		TxCountComponent,
		TxStatusTabsComponents, TabsComponent, ListComponent, MPagination, TxListComponent
	},
	mixins: [parseTimeMixin],
	data() {
		const {txType, status, beginTime, endTime, pageNum, pageSize} = Tools.urlParser();
		return {
			isLoading: false,
			TX_TYPE_DISPLAY: {},
			IBC: 'IBC',
			HashLock: 'Hash Lock',
			PickerOptions: {
				disabledDate: (time) => {
					return time.getTime() < new Date(this.pickerStartTime).getTime() || time.getTime() > Date.now()
				}
			},
			TX_TYPE,
			TX_STATUS,
			transactionArray: [],
			txCount: 0,
			txTypeOption: [],
			statusOpt: [
				{
					value: 0,
					label: this.$t('ExplorerLang.common.allTxStatus')
				},
				{
					value: 1,
					label: this.$t('ExplorerLang.common.success')
				},
				{
					value: 2,
					label: this.$t('ExplorerLang.common.failed')
				}
			],
			statusValue: status ? status : '',
			txType: txType ? txType : '',
			beginTime: beginTime ? beginTime : '',
			endTime: endTime ? endTime : '',
			/*filterStartTime : '',
			filterEndTime : '',
			urlParamsShowStartTime : this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
			urlParamsShowEndTime : this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',*/
			txStatus: '',
			pageNum: pageNum ? pageNum : 1,
			pageSize: pageSize ? pageSize : 15,
			txTypeArray: [''],
			txColumnList: [],
			tyepWidth: ColumnMinWidth.txType,
			TxHelper,
			isShowFee: prodConfig.fee.isShowFee,
			isShowDenom: prodConfig.fee.isShowDenom,
			ColumnMinWidth,
			Tools,
			addressRoute,
			formatMoniker,
			monikerNum,
			feeDecimals: decimals.fee,
			txDataList: [],
			colWidthList: [],
			loading: false,
			mainTokenSymbol: '',
			IRIS_ADDRESS_PREFIX,
			COSMOS_ADDRESS_PREFIX,
			denomMap: {},
      isShowIbc:false,
      isShowHashLock:false,
		}
	},
	async created() {
		await this.getTxTypeData()
		const {txType, status, beginTime, endTime} = Tools.urlParser();
		this.formatTxData(txType)
	},
	mounted() {
		const {txType} = Tools.urlParser();
		this.txColumnList = txCommonTable.concat(SignerColunmn,txCommonLatestTable)
		if(txType && needAddColumn[txType]){
			this.txColumnList = txCommonTable.concat(needAddColumn[txType],txCommonLatestTable)
		}
		this.getTxListData(this.pageNum,this.pageSize,true)
		this.getAllTxType();
		this.setMainToken();
    this.setIsShowIbc();
    this.setIsShowHashLock();
	},
	methods: {
    async setIsShowIbc() {
      const msgTypeIbcList = await getTxType()
      const IbcList = [TX_TYPE.recv_packet, TX_TYPE.create_client, TX_TYPE.update_client,
        TX_TYPE.transfer, TX_TYPE.timeout_packet, TX_TYPE.upgrade_client, TX_TYPE.submit_misbehaviour,
        TX_TYPE.connection_open_init, TX_TYPE.connection_open_try, TX_TYPE.connection_open_ack,
        TX_TYPE.connection_open_confirm, TX_TYPE.channel_open_init, TX_TYPE.channel_open_try,
        TX_TYPE.channel_open_ack, TX_TYPE.channel_open_confirm, TX_TYPE.channel_close_init,
        TX_TYPE.channel_close_confirm, TX_TYPE.timeout_on_close_packet, TX_TYPE.acknowledge_packet];

      if (msgTypeIbcList?.txTypeData?.length) {
        let ibcArr = []
        ibcArr = msgTypeIbcList.txTypeData.filter((item) => {
          if (item?.typeName) {
            if (IbcList.includes(item.typeName)) {
              return item
            }
          }
        })
        this.isShowIbc = false
        if (ibcArr?.length) {
          this.isShowIbc = true
        }
      }
    },
    async setIsShowHashLock() {
        const msgTypeHashLockList = await getTxType()
        const HashLockList = [TX_TYPE.create_htlc, TX_TYPE.claim_htlc]

        if(msgTypeHashLockList?.txTypeData?.length){
          let HashLockArr =[]
          HashLockArr = msgTypeHashLockList.txTypeData.filter((item)=>{
            if(item?.typeName){
              if(HashLockList.includes(item.typeName)){
                return item
              }
            }
          })
          this.isShowHashLock = false
          if(HashLockArr?.length){
            this.isShowHashLock = true
          }

        }
      },

    changeTxStatus(txStatus) {
			this.statusValue = Number(txStatus)
			this.getFilterTxs()
		},
		changeTime(selectTime) {
			this.beginTime = ''
			this.endTime = ''
			if (selectTime?.length === 2) {
				this.beginTime = selectTime[0]
				this.endTime = selectTime[1]
			}
			
			this.getFilterTxs()
		},
		getFilterTxs(param) {
			if (param?.value) {
				this.txType = param.value
			}else if(param?.value === '') {
				//处理点击all的情况
				this.txType = ''
			}
			this.txColumnList = txCommonTable.concat(SignerColunmn,txCommonLatestTable)
			if(this.txType && needAddColumn[this.txType]){
				this.txColumnList = txCommonTable.concat(needAddColumn[this.txType],txCommonLatestTable)
			}
			this.statusValue = Number(this.statusValue || 0);
			this.pageNum = 1;
			let url = `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
			if(this.txType){
			    url += `&txType=${this.txType}`;
			}
			if (this.statusValue) {
				url += `&status=${this.statusValue}`;
			}
			if (this.beginTime) {
				url += `&beginTime=${this.beginTime}`;
			}
			if (this.endTime) {
				url += `&endTime=${this.endTime}`;
			}
			
			param == 'init' ? history.replaceState(null, null, url) : history.pushState(null, null, url);
			this.getTxListData(null, null, true)
			this.getTxListData(this.pageNum, this.pageSize)
		},
		/*filterTxByTxType(e){
			if(e === 'allTxType' || e === undefined){
				this.TxType = ''
			} else {
				this.TxType = e
			}
		},*/
		resetUrl() {
			this.beginTime = '';
			this.endTime = '';
			this.txType = '';
			this.statusValue = 0;
			this.txStatus = '';
			this.beginTime = '';
			this.endTime = '';
			sessionStorage.setItem('currentChoiceMsgType', JSON.stringify(this.txType))
			history.pushState(null, null, `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&useCount=true`);
		},
		async getTxListData(pageNum, pageSize, useCount = false) {
			this.isLoading = true
			const {txType, status, beginTime, endTime} = Tools.urlParser();
			let params = {txType, status, beginTime, endTime};
			if (pageNum && pageSize) {
				params = {...params, pageNum, pageSize}
			}
			if (useCount) {
				params = {...params, useCount}
			}
			try {
				const res = await getTxList(params);
				if (Number(this.pageNum) === Number(res.pageNum)) {
					this.txData = res.data
					this.formatTxData(txType)
					this.isLoading = false
				}
				if (useCount) {
					this.txCount = res.count
				}
				if(pageNum){
					this.pageNum = res.pageNum
				}
				if(pageSize){
					this.pageSize = res.pageSize
				}
			} catch (e) {
				this.isLoading = false
				console.error(e);
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
		},
		async getAllTxType() {
			try {
				const res = await getAllTxTypes()
				const typeList = TxHelper.formatTxType(res.data)
				typeList.unshift({
					value: '',
					label: this.$t('ExplorerLang.common.allTxType'),
					slot: 'allTxType',
				});
				this.txTypeOption = typeList;
				this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption, this.txType)
			} catch (e) {
				console.error(e);
				// this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
			}
			
		},
		/*filterTxByStatus(e){
			if(e === '' || e === undefined){
				this.txStatus = ''
			} else {
				this.txStatus = e
			}
		},*/
		getStartTime(time) {
			this.beginTime = time;
		},
		getEndTime(time) {
			this.endTime = time;
		},
		/*formatEndTime(time){

			// let utcTime = Tools.conversionTimeToUTCByValidatorsLine(new Date(time).toISOString());
			let oneDaySeconds = 24 * 60 * 60;
			return Number(new Date(time).getTime() / 1000) + Number(oneDaySeconds)
		},
		formatStartTime(time){
			// let utcTime = Tools.conversionTimeToUTCByValidatorsLine(new Date(time).toISOString());
			return Number(new Date(time).getTime() / 1000)
		},*/
		resetFilterCondition() {
			this.txType = '';
			this.statusValue = '';
			this.beginTime = '';
			this.endTime = '';
			this.pageNum = 1;
			this.pageSize = 15;
			this.$refs.statusDatePicker.resetParams()
			this.resetUrl();
			this.getTxListData(null, null, true)
			this.getTxListData(this.pageNum, this.pageSize)
			this.$store.commit('currentTxModelIndex', 0)
			sessionStorage.setItem('lastChoiceMsgModelIndex',0)
			sessionStorage.setItem('txTimeRange',[])
			this.txTypeArray = ['']
			this.txColumnList = txCommonTable.concat(txCommonLatestTable)
			
		},
		async getTxTypeData() {
			try {
				let res = await getTxType()
				this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
			} catch (error) {
				console.log(error)
			}
		},
		isValid(value) {
			return (!value || !value.length || value == '--') ? false : true;
		},
		async setMainToken() {
			let mainToken = await getMainToken();
			if (mainToken && mainToken.symbol) {
				this.mainTokenSymbol = mainToken.symbol.toUpperCase();
			}
		},
		getAmount(amount) {
			if (!amount) {
				return "";
			}
			let denomRule = /[0-9.]+/
			return amount.match(denomRule)[0];
		},
		getAmountUnit(amount) {
			if (!amount) {
				return "";
			}
			let denomRule = /[A-Za-z\/]+/
			return amount.match(denomRule)[0];
		},
		/*getParamsByUrlHash(){
			let txType,
				txStatus,
				filterStartTime,
				urlParamShowStartTime,
				urlParamShowEndTime,
				filterEndTime;
			let path = window.location.hash;
			if(path.includes("?")){
				let urlHash = path.split('?')[1];
				let params = urlHash.split("&");
				params.forEach(item =>{
					if(item.includes('txType')){
						txType = item.split("=")[1]
					} else if(item.includes('status')){
						txStatus = item.split("=")[1]
					} else if(item.includes('beginTime')){
						urlParamShowStartTime = item.split("=")[1]
						filterStartTime = this.formatStartTime(item.split("=")[1])
					} else if(item.includes('endTime')){
						urlParamShowEndTime = item.split("=")[1]
						filterEndTime = this.formatEndTime(item.split("=")[1])
					}
				})
			}
			return {txType, txStatus, filterStartTime, filterEndTime, urlParamShowStartTime, urlParamShowEndTime}
		},*/
		pageChange(pageNum) {
			if (this.pageNum === pageNum) return;
			this.pageNum = pageNum;
			/*let urlParams = this.getParamsByUrlHash();
			this.statusValue = urlParams.txStatus ? urlParams.txStatus : '';
			this.txType = urlParams.txType ? urlParams.txType : 'allTxType';
			this.beginTime = urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : '';
			this.endTime = urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : '';*/
			
			const {txType, status, beginTime, endTime, pageSize} = Tools.urlParser();
			let url = `/#/txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=false`;
			if (txType) {
				url += `&txType=${txType}`;
				this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption, txType)
				this.txType = txType
			} else {
				this.txTypeArray = ['']
				this.txType = ''
			}
			if (status) {
				url += `&status=${status}`;
				this.statusValue = Number(status)
			} else {
				this.statusValue = 0
			}
			if (beginTime) {
				url += `&beginTime=${beginTime}`;
				this.beginTime = beginTime
			} else {
				this.beginTime = ''
			}
			if (endTime) {
				url += `&endTime=${endTime}`;
				this.endTime = endTime
			} else {
				this.endTime = ''
			}
			history.pushState(null, null, url);
			this.getTxListData(this.pageNum, this.pageSize);
		},
		formatTxHash(TxHash) {
			if (TxHash) {
				return Tools.formatTxHash(TxHash)
			}
		},
		formatAddress(address) {
			return Tools.formatValidatorAddress(address)
		},
		handleChange(value) {
			this.txType = value[1] ? value[1] : ''
		},
		async formatTxData(msgType) {
			this.transactionArray = []
			try {
				//这里处理方式需要优化
				if (this.txData && this.txData.length) {
					let fees = [],amounts = [];
					for (const tx of this.txData) {
						let numberOfTo = '--',
							numberOfToArr = [],
							requestId= '--',
							requestIdArr= [],
							denomId = '--',
							denomIdArr = [],
							denomName = '--',
							denomNameArr= [],
							nftId='--',
							nftIdArr = [],
							feedName='--',
							feedNameArr = [],
							oracleCreator = '--',
							oracleCreatorArr = [],
							consumer = '--',
							consumerArr = [],
							digest='--',
							digestArr = [],
							digest_algo ='--',
							digest_algoArr = [],
							symbol='--',
							symbolArr = [],
							minUnit='--',
							minUnitArr = [],
							owner='--',
							ownerArr = [],
							dstOwner = '--',
							dstOwnerArr = [],
							srcOwner = '--',
							srcOwnerArr = [],
							sender = '--',
							senderArr = [],
							proposalId = '--',
							proposalIdArr = [],
							option='--',
							optionArr = [],
							voter='--',
							voterArr = [],
							depositor='--',
							depositorArr=[],
							title='--',
							author = '--',
							authorArr = [],
							provider = '--',
							providerArr = [],
							requestContextId='--',
							requestContextIdArr = [],
							serviceName='--',
							
							serviceNameArr = [],
							clientId = '--',
							clientIdArr= [],
							portId = '--',
							portIdArr =[],
							channelId='--',
							channelIdArr = [],
							connectionId='--',
							connectionIdArr = [],
							receiver='--',
							receiverArr = [],
							sameMsg = [],
							sameMsgFromAddrArr = [],
							sameMsgToAddrArr = [],
							msg
						;
						if (tx.msgs.length > 0) {
								tx.msgs.forEach(item => {
									if(item.type === msgType){
										sameMsg.push(item)
										msg=item
									}
								})
								
							}

						/*
						* 处理单一类型多msg的情况
						* */
						if(sameMsg?.length > 1){
							//处理from 跟 to 的情况
							sameMsg.forEach( item => {
								const addrObj = TxHelper.getFromAndToAddressFromMsg(item)
								if(addrObj?.from){
									sameMsgFromAddrArr.push(addrObj.from)
								}
								if(addrObj?.to){
									sameMsgToAddrArr.push(addrObj.to)
								}
								
								if(item?.type === TX_TYPE.multisend && item?.msg?.outputs?.length){
									numberOfToArr.push(item.msg.outputs.length)
								}
								if(msg?.type === TX_TYPE.respond_service && msg?.msg?.request_id){
									requestIdArr.push(msg.msg.request_id)
								}
								if(msg?.type === TX_TYPE.burn_nft
									|| msg?.type === TX_TYPE.edit_nft
									|| msg?.type === TX_TYPE.mint_nft
									||  msg?.type === TX_TYPE.transfer_nft
									&& msg?.msg?.denom && msg?.msg?.id){
									denomIdArr.push(msg.msg.denom)
									nftIdArr.push(msg.msg.id)
								}
								if(msg?.type === TX_TYPE.start_feed || msg?.type === TX_TYPE.edit_feed || msg?.type === TX_TYPE.pause_feed || msg?.type === TX_TYPE.create_feed  && msg?.msg?.feed_name && msg?.msg?.creator){
									feedNameArr.push(msg.msg.feed_name)
									oracleCreatorArr.push(msg.msg.creator)
								}
								
								if(msg?.type=== TX_TYPE.request_rand && msg?.msg?.consumer){
									consumerArr.push(msg.msg.consumer)
								}
								if(msg?.type=== TX_TYPE.create_client
									|| msg?.type=== TX_TYPE.update_client
									&& msg?.msg?.client_id){
									clientIdArr.push(msg.msg.client_id)
								}
								if(msg?.type=== TX_TYPE.call_service
									|| msg?.type=== TX_TYPE.respond_service
									|| msg?.msg?.consumer && msg?.msg?.request_context_id && msg?.msg?.service_name){
									consumerArr.push(msg.msg.consumer)
									requestContextIdArr.push(msg.msg.request_context_id)
									serviceNameArr.push( msg.msg.service_name)
									
								}
								if(msg?.type === TX_TYPE.issue_denom && msg?.msg?.id && msg?.msg?.name &&  msg?.msg?.sender){
									senderArr.push(msg.msg.sender)
									denomIdArr.push(msg.msg.id)
									denomNameArr.push(msg.msg.name)
								}
								if(msg?.type === TX_TYPE.channel_open_init
									|| msg?.type === TX_TYPE.channel_open_confirm
									|| msg?.type === TX_TYPE.channel_open_try
									|| msg?.type === TX_TYPE.channel_open_ack
									&& msg?.msg?.channel_id && msg?.msg?.port_id){
									portIdArr.push(msg.msg.port_id)
									channelIdArr.push(msg.msg.channel_id)
								}
								if(msg?.type === TX_TYPE.connection_open_init
									|| msg?.type === TX_TYPE.connection_open_confirm
									|| msg?.type === TX_TYPE.connection_open_try
									|| msg?.type === TX_TYPE.connection_open_ack
									&& msg?.msg?.connection_id && msg?.msg?.client_id){
									clientIdArr.push(msg.msg.client_id)
									connectionIdArr.push(msg.msg.connection_id)
								}
								
								if(msg?.type === TX_TYPE.create_record && msg?.msg?.contents?.length && msg?.msg?.contents[0]?.digest  && msg?.msg?.contents[0]?.digest_algo){
									digestArr.push(msg.msg.contents[0].digest)
									digest_algoArr.push(msg.msg.contents[0].digest_algo)
								}
								if(msg?.type === TX_TYPE.issue_token && msg?.msg?.symbol && msg?.msg?.owner && msg?.msg?.min_unit){
									symbolArr.push(msg.msg.symbol)
									minUnitArr.push(msg.msg.min_unit)
									ownerArr.push(msg.msg.owner)
								}
								if(msg?.type === TX_TYPE.acknowledge_packet && msg?.msg?.packet?.data?.receiver){
									receiverArr.push(msg.msg.packet.data.receiver)
								}
								if(msg?.type === TX_TYPE.edit_token && msg?.msg?.symbol  && msg?.msg?.owner){
									symbolArr.push( msg.msg.symbol)
									ownerArr.push(msg.msg.owner)
								}
								if(msg?.type === TX_TYPE.transfer_token_owner && msg?.msg?.symbol && msg?.msg?.dst_owner  && msg?.msg?.src_owner){
									symbolArr.push(msg.msg.symbol)
									dstOwnerArr.push(msg.msg.dst_owner)
									srcOwnerArr.push(msg.msg.src_owner)
								}
								if(msg?.type === TX_TYPE.mint_token && msg?.msg?.owner && msg?.msg?.symbol && msg?.msg?.amount  && msg?.msg?.to){
									symbolArr.push( msg.msg.symbol)
									ownerArr.push(msg.msg.owner)
								}
								if(msg?.type === TX_TYPE.burn_token && msg?.msg?.sender && msg?.msg?.symbol && msg?.msg?.amount){
									symbolArr.push( msg.msg.symbol)
									senderArr.push(msg.msg.sender)
								}
								if(msg?.type === TX_TYPE.vote && msg?.msg?.option && msg?.msg?.proposal_id && msg?.msg?.voter){
									proposalIdArr.push(msg.msg.proposal_id)
									optionArr.push(msg.msg.option)
									voterArr.push(msg.msg.voter)
								}
								if(msg?.type === TX_TYPE.deposit && msg?.msg?.depositor && msg?.msg?.proposal_id ){
									proposalIdArr.push(msg.msg.proposal_id)
									depositorArr.push(msg.msg.depositor)
								}
								if(msg?.type === TX_TYPE.submit_proposal && msg?.msg?.content?.title ){
									title = msg.msg.content.title
								}
								if(msg?.type === TX_TYPE.pause_request_context
									|| msg?.type === TX_TYPE.start_request_context
									|| msg?.type === TX_TYPE.update_request_context
									|| msg?.type === TX_TYPE.kill_request_context
									&& msg?.msg?.consumer && msg?.msg?.request_context_id){
									consumerArr.push(msg.msg.consumer)
									requestContextIdArr.push(msg.msg.request_context_id)
								}
								if(msg?.type === TX_TYPE.define_service && msg?.msg?.author && msg?.msg?.name){
									authorArr.push(msg.msg.author)
									serviceNameArr.push( msg.msg.service_name)
								}
								if(msg?.type === TX_TYPE.bind_service
									|| msg?.type === TX_TYPE.refund_service_deposit
									|| msg?.type === TX_TYPE.disable_service_binding
									|| msg?.type === TX_TYPE.enable_service_binding
									|| msg?.type === TX_TYPE.update_service_binding
									
									&& msg?.msg?.owner && msg?.msg?.provider && msg?.msg?.service_name){
									ownerArr.push(msg.msg.owner)
									providerArr.push( msg.msg.provider)
									serviceNameArr.push( msg.msg.service_name)
								}
								if(msg?.type=== TX_TYPE.update_request_context && msg?.msg?.ex && msg?.msg?.ex?.service_name){
									serviceNameArr.push( msg.msg.service_name)
								}
							})
							/*
							* 同一类型多msg 去重
							* */
							sameMsgFromAddrArr = Array.from(new Set(sameMsgFromAddrArr))
							sameMsgToAddrArr = Array.from(new Set(sameMsgToAddrArr))
							portIdArr = Array.from(new Set(portIdArr))
							channelIdArr = Array.from(new Set(channelIdArr))
							connectionIdArr = Array.from(new Set(connectionIdArr))
							receiverArr = Array.from(new Set(receiverArr))
							numberOfToArr = Array.from(new Set(numberOfToArr))
							requestIdArr = Array.from(new Set(requestIdArr))
							denomIdArr = Array.from(new Set(denomIdArr))
							nftIdArr = Array.from(new Set(nftIdArr))
							feedNameArr = Array.from(new Set(feedNameArr))
							clientIdArr = Array.from(new Set(clientIdArr))
							denomNameArr = Array.from(new Set(denomNameArr))
							oracleCreatorArr = Array.from(new Set(oracleCreatorArr))
							consumerArr = Array.from(new Set(consumerArr))
							digestArr = Array.from(new Set(digestArr))
							digest_algoArr = Array.from(new Set(digest_algoArr))
							symbolArr = Array.from(new Set(symbolArr))
							minUnitArr = Array.from(new Set(minUnitArr))
							ownerArr = Array.from(new Set(ownerArr))
							dstOwnerArr = Array.from(new Set(dstOwnerArr))
							srcOwnerArr = Array.from(new Set(srcOwnerArr))
							senderArr = Array.from(new Set(senderArr))
							proposalIdArr = Array.from(new Set(proposalIdArr))
							optionArr = Array.from(new Set(optionArr))
							voterArr = Array.from(new Set(voterArr))
							depositorArr = Array.from(new Set(depositorArr))
							authorArr = Array.from(new Set(authorArr))
							providerArr = Array.from(new Set(providerArr))
							requestContextIdArr = Array.from(new Set(requestContextIdArr))
							serviceNameArr = Array.from(new Set(serviceNameArr))
							
							
							
							
							
						}else {
							if(msg?.type === TX_TYPE.multisend && msg?.msg?.outputs?.length){
								numberOfTo = msg.msg.outputs.length
							}
							if(msg?.type === TX_TYPE.respond_service && msg?.msg?.request_id){
								requestId = msg.msg.request_id
							}
							if(msg?.type === TX_TYPE.burn_nft
								|| msg?.type === TX_TYPE.edit_nft
								|| msg?.type === TX_TYPE.mint_nft
								||  msg?.type === TX_TYPE.transfer_nft
								&& msg?.msg?.denom && msg?.msg?.id){
								denomId = msg.msg.denom
								nftId = msg.msg.id
							}
							if(msg?.type === TX_TYPE.start_feed || msg?.type === TX_TYPE.edit_feed || msg?.type === TX_TYPE.pause_feed || msg?.type === TX_TYPE.create_feed  && msg?.msg?.feed_name && msg?.msg?.creator){
								feedName = msg.msg.feed_name
								oracleCreator = msg.msg.creator
							}
							
							if(msg?.type=== TX_TYPE.request_rand && msg?.msg?.consumer){
								consumer = msg.msg.consumer
							}
							if(msg?.type=== TX_TYPE.create_client
								|| msg?.type=== TX_TYPE.update_client
								&& msg?.msg?.client_id){
								clientId = msg.msg.client_id
							}
							if(msg?.type=== TX_TYPE.call_service
								|| msg?.type=== TX_TYPE.respond_service
								|| msg?.msg?.consumer && msg?.msg?.request_context_id && msg?.msg?.service_name){
								consumer = msg.msg.consumer
								requestContextId = msg.msg.request_context_id
								serviceName = msg.msg.service_name
								
							}
							if(msg?.type === TX_TYPE.issue_denom && msg?.msg?.id && msg?.msg?.name &&  msg?.msg?.sender){
								sender = msg.msg.sender
								denomId = msg.msg.id
								denomName = msg.msg.name
							}
							if(msg?.type === TX_TYPE.channel_open_init
								|| msg?.type === TX_TYPE.channel_open_confirm
								|| msg?.type === TX_TYPE.channel_open_try
								|| msg?.type === TX_TYPE.channel_open_ack
								&& msg?.msg?.channel_id && msg?.msg?.port_id){
								portId = msg.msg.port_id
								channelId = msg.msg.channel_id
							}
							if(msg?.type === TX_TYPE.connection_open_init
								|| msg?.type === TX_TYPE.connection_open_confirm
								|| msg?.type === TX_TYPE.connection_open_try
								|| msg?.type === TX_TYPE.connection_open_ack
								&& msg?.msg?.connection_id && msg?.msg?.client_id){
								clientId = msg.msg.client_id
								connectionId = msg.msg.connection_id
							}
							
							if(msg?.type === TX_TYPE.create_record && msg?.msg?.contents?.length && msg?.msg?.contents[0]?.digest  && msg?.msg?.contents[0]?.digest_algo){
								digest = msg.msg.contents[0].digest
								digest_algo = msg.msg.contents[0].digest_algo
							}
							if(msg?.type === TX_TYPE.issue_token && msg?.msg?.symbol && msg?.msg?.owner && msg?.msg?.min_unit){
								symbol = msg.msg.symbol
								minUnit = msg.msg.min_unit
								owner = msg.msg.owner
							}
							if(msg?.type === TX_TYPE.acknowledge_packet && msg?.msg?.packet?.data?.receiver){
								receiver =  msg.msg.packet.data.receiver
							}
							if(msg?.type === TX_TYPE.edit_token && msg?.msg?.symbol  && msg?.msg?.owner){
								symbol = msg.msg.symbol
								owner = msg.msg.owner
							}
							if(msg?.type === TX_TYPE.transfer_token_owner && msg?.msg?.symbol && msg?.msg?.dst_owner  && msg?.msg?.src_owner){
								symbol = msg.msg.symbol
								dstOwner = msg.msg.dst_owner
								srcOwner = msg.msg.src_owner
							}
							if(msg?.type === TX_TYPE.mint_token && msg?.msg?.owner && msg?.msg?.symbol && msg?.msg?.amount  && msg?.msg?.to){
								symbol = msg.msg.symbol
								owner = msg.msg.owner
							}
							if(msg?.type === TX_TYPE.burn_token && msg?.msg?.sender && msg?.msg?.symbol && msg?.msg?.amount){
								symbol = msg.msg.symbol
								sender = msg.msg.sender
							}
							if(msg?.type === TX_TYPE.vote && msg?.msg?.option && msg?.msg?.proposal_id && msg?.msg?.voter){
								proposalId = msg.msg.proposal_id
								option = msg.msg.option
								voter = msg.msg.voter
							}
							if(msg?.type === TX_TYPE.deposit && msg?.msg?.depositor && msg?.msg?.proposal_id ){
								proposalId = msg.msg.proposal_id
								depositor = msg.msg.depositor
							}
							if(msg?.type === TX_TYPE.submit_proposal && msg?.msg?.content?.title ){
								title = msg.msg.content.title
							}
							if(msg?.type === TX_TYPE.pause_request_context
								|| msg?.type === TX_TYPE.start_request_context
								|| msg?.type === TX_TYPE.update_request_context
								|| msg?.type === TX_TYPE.kill_request_context
								&& msg?.msg?.consumer && msg?.msg?.request_context_id){
								consumer = msg.msg.consumer
								requestContextId = msg.msg.request_context_id
							}
							if(msg?.type === TX_TYPE.define_service && msg?.msg?.author && msg?.msg?.name){
								author = msg.msg.author
								serviceName = msg.msg.name
							}
							if(msg?.type === TX_TYPE.bind_service
								|| msg?.type === TX_TYPE.refund_service_deposit
								|| msg?.type === TX_TYPE.disable_service_binding
								|| msg?.type === TX_TYPE.enable_service_binding
								|| msg?.type === TX_TYPE.update_service_binding
								
								&& msg?.msg?.owner && msg?.msg?.provider && msg?.msg?.service_name){
								owner = msg.msg.owner
								provider = msg.msg.provider
								serviceName = msg.msg.service_name
							}
							if(msg?.type=== TX_TYPE.update_request_context && msg?.msg?.ex && msg?.msg?.ex?.service_name){
								serviceName = msg.msg.ex.service_name
							}
						}
						
						let addrObj = TxHelper.getFromAndToAddressFromMsg(msg);
						amounts.push(msg ? sameMsg?.length > 1 ? ' ' : await getAmountByTx(msg, tx.events, true) : '--');
						let from = sameMsg?.length > 1 ? sameMsgFromAddrArr?.length > 1 ? ' ' : sameMsgFromAddrArr?.length === 1 ? sameMsgFromAddrArr[0] : '--' : addrObj.from || '--',
							to = sameMsg?.length > 1 ? sameMsgToAddrArr?.length > 1 ? ' ' : sameMsgToAddrArr?.length === 1 ? sameMsgToAddrArr[0] : '--' : addrObj.to || '--';
						let fromMonikers = ' ', toMonikers =  ' ' ,validatorMoniker,validatorAddress;
						if ((tx.monikers || {}).length) {
							let monikersMap = new Map()
							tx.monikers.forEach( item => {
								validatorMoniker = Object.values(item)[0] || ' '
								validatorAddress = Object.keys(item)[0] || ' '
								monikersMap.set(Object.keys(item)[0],Object.values(item)[0])
							})
							if(monikersMap.has(from)){
								fromMonikers = monikersMap.get(from)
							}
							if(monikersMap.has(to)){
								toMonikers = monikersMap.get(to)
							}
							
						}
						if (this.isShowFee) {
							fees.push(tx.fee && tx.fee.amount && tx.fee.amount.length > 0 ? await converCoin(tx.fee.amount[0]) : '--')
						}
						let isShowMore = false;
						const type = tx.msgs && tx.msgs[0] && tx.msgs[0].type;
						if (type && (type === TX_TYPE.add_liquidity || type === TX_TYPE.remove_liquidity)) {
							isShowMore = true
						}
						if (tx.type === TX_TYPE.send) {
							tx && tx.msgs && tx.msgs[0] && tx.msgs[0].msg && tx.msgs[0].msg.amount && tx.msgs[0].msg.amount.length > 1 ? isShowMore = true : ''
							let denom = tx?.msgs?.[0]?.msg?.amount?.[0]?.denom
							if (denom !== undefined && /(swap|SWAP)/g.test(denom)) {
								isShowMore = true
							}
						}
						this.transactionArray.push({
							txHash: tx.tx_hash,
							blockHeight: tx.height,
							txType: (tx.msgs || []).map(item => item.type ),
							from,
							author : authorArr?.length > 1 ?  ' ' : authorArr?.length === 1 ? authorArr[0] : author ,
							provider: providerArr?.length > 1 ? ' ' : providerArr?.length === 1 ? providerArr[0] : provider,
							requestContextId: requestContextIdArr?.length > 1 ? ' ' : requestContextIdArr?.length === 1 ? requestContextIdArr[0] : requestContextId,
							fromMonikers,
							toMonikers,
							receiver:receiverArr?.length > 1 ? ' ' : receiverArr?.length === 1 ? receiverArr[0] : receiver,
							to,
							portId: portIdArr?.length > 1 ? ' ' : portIdArr?.length === 1 ? portIdArr[0] : portId,
							channelId: channelIdArr?.length > 1 ? ' ' : channelIdArr?.length === 1 ? channelIdArr[0] : channelId,
							connectionId: connectionIdArr?.length > 1 ? ' ' : connectionIdArr?.length === 1 ? connectionIdArr[0] : connectionId,
							validatorMoniker,
							validatorAddress,
							numberOfTo: numberOfToArr?.length > 1 ? ' ' : numberOfToArr?.length === 1 ? numberOfToArr[0] : numberOfTo,
							requestId : requestIdArr?.length > 1 ? ' ' : requestIdArr?.length === 1 ? requestIdArr[0] : requestId,
							denomId: denomIdArr?.length > 1 ? ' ' : denomIdArr?.length === 1 ? denomIdArr[0] : denomId,
							denomName: denomNameArr?.length > 1 ? ' ' : denomNameArr?.length === 1 ? denomNameArr[0] : denomName,
							nftId:nftIdArr?.length > 1 ? ' ' : nftIdArr?.length === 1 ? nftIdArr[0] : nftId,
							clientId: clientIdArr?.length > 1 ? ' ' : clientIdArr?.length === 1 ? clientIdArr[0] : clientId,
							feedName: feedNameArr?.length > 1 ? ' ' : feedNameArr?.length ===1 ? feedNameArr[0] : feedName,
							oracleCreator: oracleCreatorArr?.length > 1 ? ' ' : oracleCreatorArr?.length === 1 ? oracleCreatorArr[0] : oracleCreator,
							consumer: consumerArr?.length > 1 ? ' ' : consumerArr?.length === 1 ? consumerArr[0] : consumer,
							serviceName: serviceNameArr?.length > 1 ? ' ' : serviceNameArr?.length === 1 ? serviceNameArr[0] : serviceName,
							digest: digestArr?.length > 1 ? ' ' :  digestArr?.length === 1 ? digestArr[0] : digest,
							digest_algo: digest_algoArr?.length > 1 ? ' ' : digest_algoArr?.length === 1 ? digest_algoArr[0] : digest_algo,
							symbol:symbolArr?.length > 1 ? ' ' : symbolArr?.length ===1 ? symbolArr[0] : symbol,
							minUnit: minUnitArr?.length > 1 ? ' ' : minUnitArr?.length === 1 ? minUnitArr[0] : minUnit,
							owner: ownerArr?.length > 1 ? ' ' : ownerArr?.length === 1 ? ownerArr[0] : owner,
							dstOwner: dstOwnerArr?.length > 1 ? ' ' : dstOwnerArr?.length === 1 ? dstOwnerArr[0] : dstOwner,
							srcOwner: srcOwnerArr?.length > 1 ? ' ' : srcOwnerArr?.length === 1 ? srcOwnerArr[0] : srcOwner,
							sender: senderArr?.length > 1 ? ' ' : senderArr?.length === 1 ? senderArr[0] : sender,
							proposalId: proposalIdArr?.length > 1 ? ' ' : proposalIdArr?.length === 1 ? proposalIdArr[0] : proposalId,
							option:optionArr?.length > 1 ? ' ' : optionArr?.length === 1 ? optionArr[0] : option,
							voter: voterArr?.length > 1 ? ' ' : voterArr?.length ===1 ? voterArr[0] : voter,
							depositor : depositorArr?.length > 1 ? ' ' : depositorArr?.length === 1 ? depositorArr[0] : depositor,
							title,
							signer: tx.signers?.length > 1 ? ' ' : tx.signers?.length === 1 ? tx.signers[0] : '--',
							status: tx.status,
							msgCount: tx.msgs.length,
							// time :Tools.getDisplayDate(tx.time),
							Tx_Fee: '',
							Time: Tools.formatLocalTime(tx.time),
							amount: '',
							swapAmount1:'',
							swapDenomTheme1:'',
							swapAmount2:'',
							swapDenomTheme2:'',
							ageTime: Tools.formatAge(Tools.getTimestamp(), tx.time * 1000, this.$t('ExplorerLang.table.suffix')),
							isShowMore,
							denomTheme: {
								denomColor: '',
								tooltipContent: ''
							}
						})
						/**
						 * @description: from parseTimeMixin
						 */
						this.parseTime('transactionArray', 'Time', 'ageTime')
					}
					if (fees && fees.length > 0 && this.isShowFee) {
						let fee = await Promise.all(fees);
						this.transactionArray.forEach((item, index) => {
							// this.transactionArray[index].Tx_Fee = fee[index] && fee[index].amount ?  this.isShowDenom ? `${Tools.toDecimal(fee[index].amount,this.feeDecimals)} ${fee[index].denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee[index].amount,this.feeDecimals)}` : '--';
							// remove denom
							this.transactionArray[index].Tx_Fee = fee[index] && fee[index].amount ? this.isShowDenom ? `${Tools.toDecimal(fee[index].amount, this.feeDecimals)}` : `${Tools.toDecimal(fee[index].amount, this.feeDecimals)}` : '--';
						})
					}
					if (amounts && amounts.length > 0) {
						let amount = await Promise.all(amounts)
						this.denomMap = await getDenomMap()
						this.transactionArray.forEach((item, index) => {
							if(amount[index]?.length === 2 ){
								this.transactionArray[index].swapDenomTheme1 = getDenomTheme(amount[index][0], this.denomMap)
								this.transactionArray[index].swapDenomTheme2 = getDenomTheme(amount[index][1], this.denomMap)
								this.transactionArray[index].swapAmount1 =  amount[index][0]
								this.transactionArray[index].swapAmount2 =  amount[index][1]
							}else {
								this.transactionArray[index].denomTheme = getDenomTheme(amount[index], this.denomMap)
								this.transactionArray[index].amount = amount[index]
								let denom = /[A-Za-z\-]{2,15}/.exec(amount[index])?.length ? /[A-Za-z\-]{2,15}/.exec(amount[index])[0] : ' '
								if (denom !== undefined && /(swap|SWAP|lpt|LPT|lpt-|LPT-)/g.test(denom)) {
									this.transactionArray[index].amount = ''
								}
								
							}
						})
					}
					/*this.$nextTick(() => {
						setTimeout(() => {
							this.colWidthList = this.$adjustColumnWidth(this.$refs['listTable'].$el);
							this.loading = false;
						});
					});*/
				}
			} catch (error) {
				console.log(error)
			}
			
		},
	},
	beforeDestroy(){
		this.$store.commit('currentTxModelIndex',0)
	},
}

</script>

<style scoped lang="scss">
a {
	color: $t_link_c !important;
}

.tx_content_container {
	width: 100%;
	.tx_content_wrap {
		max-width: 12.3rem;
		.tx_content_header_title{
			text-align: left;
			margin-top: 0.4rem;
			padding-bottom: 0.1rem;
			.tc_content_header{
				font-size: 0.22rem;
				font-weight: 600;
				color: #171D44;
				line-height: 0.26rem;
			}
		}
		.tx_content_header_wrap {
			display: flex;
			justify-content: flex-start;
		}
	}
	@media screen and (max-width: 910px) {
		.tx_content_wrap {
			width: 100%;
			
			.tx_content_header_wrap {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				
				.tx_type_mobile_content {
					margin-bottom: 0.1rem;
					
					&:last-child {
						width: 100%;
						justify-content: flex-end;
						
						.search_btn {
							margin-left: 0;
						}
					}
					
					.tx_type_transactions {
						margin-right: 0.26rem !important;
					}
				}
			}
		}
	}
	@media screen and (max-width: 768px) {
		.tx_content_wrap {
			.pagination_content {
				.tooltip_box {
					text-align: end;
				}
				
				.common_pagination_content {
					border: 0;
					text-align: end;
				}
			}
		}
	}
	@media screen and (min-width: 768px) {
		.tx_content_wrap {
			.pagination_content {
				display: flex;
				justify-content: space-between;
			}
		}
	}
	
	.tx_content_wrap {
		margin: 0 auto;
		box-sizing: border-box;
		padding: 0 0.15rem;
		
		.service_tx_to_container {
			.service_tx_muti_to_container {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				
				.service_tx_muti_to_ellipsis {
					color: $t_link_c;
				}
			}
		}
		
		.service_tx_status {
			position: relative;
			top: 0.02rem;
			left: -0.04rem;
			width: 0.13rem;
			height: 0.13rem;
		}
		
		.tx_content_header_wrap {
			padding: 0.3rem 0 0.13rem 0;
			
			.tx_transaction_content_hash {
				display: flex;
				align-items: center;
			}
			
			.total_tx_content {
				// height: 0.64rem;
				line-height: 0.4rem;
				color: $t_first_c;
				font-size: $s18;
				font-weight: bold;
				margin: 0rem 0.2rem 0rem 0rem;
				//text-indent: 0.2rem;
			}
			
			/*.filer_content {
					display: flex;
					align-items: center;*/
			.tx_type_mobile_content {
				display: flex;
				align-items: center;
				
				.tooltip_content {
					padding: 0 0 0 0.1rem;
				}
				
				::v-deep.el-cascader {
					width: 1.3rem;
					margin-right: 0.1rem;
					
					.el-input {
						input::-webkit-input-placeholder {
							/* 使用webkit内核的浏览器 */
							color: $t_first_c;
						}
						
						input:-moz-placeholder {
							/* Firefox版本4-18 */
							color: $t_first_c;
						}
						
						input::-moz-placeholder {
							/* Firefox版本19+ */
							color: $t_first_c;
						}
						
						input:-ms-input-placeholder {
							/* IE浏览器 */
							color: $t_first_c;
						}
						
						.el-input__inner {
							padding-left: 0.07rem;
							height: 0.32rem;
							font-size: $s14 !important;
							line-height: 0.32rem;
							
							&::-webkit-input-placeholder {
								font-size: $s14 !important;
							}
						}
						
						.el-input__inner:focus {
							border-color: $theme_c !important;
						}
						
						.el-input__suffix {
							.el-input__suffix-inner {
								.el-input__icon {
									line-height: 0.32rem;
								}
							}
						}
					}
					
					.is-focus {
						.el-input__inner {
							border-color: $theme_c !important;
						}
					}
				}
				
				::v-deep .el-select {
					width: 1.3rem;
					margin-right: 0.1rem;
					
					.el-input {
						.el-input__inner {
							padding-left: 0.07rem;
							height: 0.32rem;
							font-size: $s14 !important;
							line-height: 0.32rem;
							
							&::-webkit-input-placeholder {
								font-size: $s14 !important;
							}
						}
						
						.el-input__inner:focus {
							border-color: $theme_c !important;
						}
						
						.el-input__suffix {
							.el-input__suffix-inner {
								.el-input__icon {
									line-height: 0.32rem;
								}
							}
						}
					}
					
					.is-focus {
						.el-input__inner {
							border-color: $theme_c !important;
						}
					}
				}
				
				::v-deep .el-date-editor {
					width: 1.3rem;
					
					.el-icon-circle-close {
						display: none !important;
					}
					
					.el-input__inner {
						height: 0.32rem;
						padding-left: 0.07rem;
						padding-right: 0;
						line-height: 0.32rem;
						
						&::-webkit-input-placeholder {
							font-size: $s14 !important;
						}
						
						&:focus {
							border-color: $theme_c;
						}
					}
					
					.el-input__prefix {
						right: 5px;
						left: 1rem;
						
						.el-input__icon {
							line-height: 0.32rem;
						}
					}
				}
				
				.joint_mark {
					margin: 0 0.08rem;
				}
				
				.reset_btn {
					background: $bg_button_c;
					color: $t_button_c;
					border-radius: 0.04rem;
					margin-left: 0.1rem;
					cursor: pointer;
					
					i {
						padding: 0.08rem;
						font-size: $s14;
						line-height: 1;
						display: inline-block;
					}
				}
				
				.search_btn {
					cursor: pointer;
					background: $bg_button_c;
					margin-left: 0.1rem;
					color: $t_button_c;
					border-radius: 0.04rem;
					padding: 0.05rem 0.18rem;
					font-size: $s14;
					line-height: 0.2rem;
					white-space: nowrap;
				}
			}
			
			//}
		}
		
		.status_icon {
			width: 0.13rem;
			height: 0.13rem;
			margin-right: 0.05rem;
		}
		
		.pagination_content {
			margin: 0.1rem 0 0.2rem 0;
			
			.tooltip_box {
				display: flex;
				align-items: center;
				background-color: white;
				padding: 0.05rem 0.2rem;
				font-size: $s12;
				color: #8d8b8b;
				
				.tooltip_title {
					margin-right: 0.24rem;
				}
				
				.tooltip_title_box {
					display: flex;
				}
				
				.tooltip_title_IBC {
					margin-right: 0.24rem;
					display: flex;
					align-items: center;
					position: relative;
					
					&::before {
						left: -0.12rem;
						content: ' ';
						position: absolute;
						height: 0.08rem;
						width: 0.08rem;
						border-radius: 0.04rem;
						background-color: #d47d78;
					}
				}
				
				.tooltip_title_HTLT {
					display: flex;
					align-items: center;
					position: relative;
					
					&::before {
						left: -0.12rem;
						content: ' ';
						position: absolute;
						height: 0.08rem;
						width: 0.08rem;
						border-radius: 0.04rem;
						background-color: #51a3a3;
					}
				}
			}
		}
	}
}
</style>
