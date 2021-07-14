<template>
    <div class="transaction_list_page_container">
		<div class="transaction_list_page_container_title">
			<div class="title_container">
				<span v-if="$route.params.txType === 'delegations'">{{ $t('ExplorerLang.transactions.delegationTxsList')}}</span>
				<span v-if="$route.params.txType === 'validations'">{{$t('ExplorerLang.transactions.validationTxsList')}}</span>
				<span v-if="$route.params.txType === 'governance'">{{$t('ExplorerLang.transactions.govTxsList')}}</span>
				<span>{{ count }} {{$t('ExplorerLang.transactions.txs')}}</span>
			</div>
			<div class="transaction_list_title_wrap">
				<div class="transaction_list_title_content">
					<div class="filter_container">
						<div class="filter_tx_type_statue_content">
							<el-select popper-class="tooltip" v-model="value" filterable :change="filterTxByTxType(value)">
								<el-option v-for="(item, index) in txTypeListArray"
										:key="index"
										:label="item.label"
										:value="item.value">
								</el-option>
							</el-select>

							<el-select popper-class="tooltip" v-model="statusValue" :change="filterTxByStatus(statusValue)">
								<el-option v-for="(item, index) in status"
										:key="index"
										:label="item.label"
										:value="item.value"></el-option>
							</el-select>
						</div>
						<div class="select_date_content">
							<el-date-picker  type="date"
											popper-class="tooltip"
											v-model="startTime"
											@change="getStartTime(startTime)"
											:picker-options="PickerOptions"
											:editable="false"
											value-format="yyyy-MM-dd"
											:placeholder="$t('ExplorerLang.common.selectDate')">
							</el-date-picker>
							<span class="joint_mark">~</span>
							<el-date-picker  type="date"
											popper-class="tooltip"
											v-model="endTime"
											:picker-options="PickerOptions"
											value-format="yyyy-MM-dd"
											@change="getEndTime(endTime)"
											:editable="false"
											:placeholder="$t('ExplorerLang.common.selectDate')">
							</el-date-picker>
							<div class="tooltip_content">
								<el-tooltip popper-class="tooltip"  :content="$t('ExplorerLang.transactions.tooltip')">
									<i class="iconfont iconyiwen"></i>
								</el-tooltip>
							</div>
						</div>
						<div class="reset_search_content">
							<div class="tx_search_btn" @click="getFilterTxs">{{$t('ExplorerLang.transactions.search')}}</div>
							<div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
						</div>
					</div>
				</div>
			</div>
		</div>
        <div class="transaction_list_table_container">
            <div class="transaction_list_table_content">
                <div class="table_list_content">
                    <!-- Delegation Txs -->
					<DelegationTxsList :dataList="txList" :isShowFee="isShowFee" v-if="this.$route.params.txType === 'delegations'" />
                    <!-- Validation Txs -->
					<ValidationTxsList :dataList="txList" :isShowFee="isShowFee" v-if="this.$route.params.txType === 'validations'" />
					<!-- Gov Txs -->
					<GovTxsList :dataList="txList" :isShowFee="isShowFee" v-if="this.$route.params.txType === 'governance'" />
                </div>
                <div class="pagination_nav_footer_content">
                    <keep-alive>
                        <m-pagination :total="count" :page="currentPageNum" :page-size="pageSize" :page-change="pageChange"></m-pagination>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import Tools from "../util/Tools";
	import MPagination from "./common/MPagination";
	import {pageTitleConfig, TxStatus,decimals,TX_TYPE,TX_TYPE_DISPLAY} from "../constant";
	import {TxHelper} from '@/helper/TxHelper.js';
	import {getTypeStakingApi, getTypeDeclarationApi, getDelegationTxsApi, getValidationTxsApi,getGovTxsApi,getTypeGovApi} from "@/service/api";
	import {converCoin,getMainToken} from "../helper/IritaHelper";
	import {getAmountByTx} from "../helper/txListAmoutHelper";
	import DelegationTxsList from '@/components/common/DelegationTxsList'
	import ValidationTxsList from '@/components/common/ValidationTxsList'
	import GovTxsList from '@/components/common/GovTxsList'
	import prodConfig from '../productionConfig';
	import parseTimeMixin from '../mixins/parseTime'

	export default {
		name: "TransactionListPage",
		components: {MPagination,DelegationTxsList,ValidationTxsList,GovTxsList},
		mixins:[parseTimeMixin],
		data () {
			return {
				isShowFee: prodConfig.fee.isShowFee,
				isShowDenom: prodConfig.fee.isShowDenom,
				proposalTitleNum: 20,
				feeDecimals: decimals.fee,
                pageTitle:'',
				totalPageNum: sessionStorage.getItem("txpagenum") ? JSON.parse(sessionStorage.getItem("txpagenum")) : 1,
				currentPageNum: this.forCurrentPageNum(),
				pickerStartTime: sessionStorage.getItem('firstBlockTime') ? sessionStorage.getItem('firstBlockTime') : '',
				PickerOptions: {
					disabledDate: (time) => {
						return time.getTime() < new Date(this.pickerStartTime).getTime() || time.getTime() > Date.now()
					}
				},
				txList: [],
				txTypeListArray: [
					{
						value: 'allTxType',
						label: this.$t('ExplorerLang.common.allTxType'),
						slot: 'allTXType'
					}
				],
				listTitleName: "",
				count: sessionStorage.getItem("txTotal") ? Number(sessionStorage.getItem("txTotal")) : 0,
				pageSize: 10,
				delegationPageSize:10,
				showNoData: false,
				flShowLoading: false,
				value: this.getParamsByUrlHash().txType ? this.getParamsByUrlHash().txType : 'allTxType',
				txStatus: '',
				statusValue: this.getParamsByUrlHash().txStatus ? this.getParamsByUrlHash().txStatus : 'allStatus',
				status: [],
				startTime: this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
				endTime: this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',
				filterStartTime: '',
				filterEndTime: '',
				urlParamsShowStartTime: this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
				urlParamsShowEndTime: this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',
				type: '',
			}
		},
		mounted () {
			let statusArray = [
				{
					value: 'allStatus',
					label: this.$t('ExplorerLang.common.allTxStatus')
				},
				{
					value: 'success',
					label: this.$t('ExplorerLang.common.success')
				},
				{
					value: 'fail',
					label: this.$t('ExplorerLang.common.failed')
				}
			]
			statusArray.forEach(item => {
				this.status.push(item)
			})
			
			this.getType();
			this.getTxListByFilterCondition();
		},
		methods: {
			getParamsByUrlHash () {
				let txType,
					txStatus,
					urlParamShowStartTime,
					urlParamShowEndTime,
					filterStartTime,
					filterEndTime;
				let path = window.location.hash;
				if (path.includes("?")) {
					let urlHash = path.split('?')[1];
					let params = urlHash.split("&");
					params.forEach(item => {
						if (item.includes('txType')) {
							txType = item.split("=")[1]
						} else if (item.includes('status')) {
							txStatus = item.split("=")[1]
						} else if (item.includes('startTime')) {
							urlParamShowStartTime = item.split("=")[1]
							filterStartTime = this.formatStartTime(item.split("=")[1])
						} else if (item.includes('endTime')) {
							urlParamShowEndTime = item.split("=")[1]
							filterEndTime = this.formatEndTime(item.split("=")[1])
						}
					})
				}
				return {txType, txStatus, filterStartTime, filterEndTime, urlParamShowStartTime, urlParamShowEndTime}
			},
			forCurrentPageNum () {
				let currentPageNum = 1;
				let urlPageSize = this.$route.query.page && Number(this.$route.query.page);
				currentPageNum = urlPageSize ? urlPageSize : 1;
				return currentPageNum;
			},
			pageChange (pageNum) {
				this.currentPageNum = pageNum;
				if (this.currentPageNumCache === this.currentPageNum) {
					return;
				}
				this.currentPageNumCache = this.currentPageNum;
				let path = this.$route.path, urlParams = this.getParamsByUrlHash();
				this.statusValue = urlParams.txStatus ? urlParams.txStatus : 'allStatus';
				this.value = urlParams.txType ? urlParams.txType : 'allTxType';
				this.startTime = urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : '';
				this.endTime = urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : '';
				history.pushState(null, null, `/#${path}?txType=${urlParams.txType ? urlParams.txType : ''}&status=${urlParams.txStatus ? urlParams.txStatus : ''}&startTime=${urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : ''}&endTime=${urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : ''}&page=${pageNum}`);
				this.getTxListByFilterCondition();
			},
			getFilterTxs () {
				this.currentPageNum = 1;
				sessionStorage.setItem('txpagenum', 1);
				history.pushState(null, null, `/#${this.$route.path}?txType=${this.TxType}&status=${this.txStatus}&startTime=${this.urlParamsShowStartTime}&endTime=${this.urlParamsShowEndTime}&page=1`);
				this.getTxListByFilterCondition();		
			},
			resetUrl () {
				this.value = 'allTxType';
				this.statusValue = 'allStatus';
				this.startTime = '';
				this.endTime = '';
				this.currentPageNum = 1;
				this.urlParamsShowStartTime = '';
				this.urlParamsShowEndTime = '';
				history.pushState(null, null, `/#${this.$route.path}?txType=&status=&startTime=&endTime=&page=1`);
			},
			filterTxByTxType (e) {
				if (e === 'allTxType' || e === undefined) {
					this.TxType = '';
				} else {
					this.TxType = e
				}
			},
			filterTxByStatus (e) {
				if (e === 'allStatus') {
					this.txStatus = '';
				} else {
					this.txStatus = e
				}
			},
			getStartTime (time) {
				this.filterStartTime = this.formatStartTime(time)
			},
			getEndTime (time) {
				this.filterEndTime = this.formatEndTime(time)
			},
			formatStartTime (time) {
				this.urlParamsShowStartTime = time
				let offest = 8 * 60 * 60
				return Number(new Date(time).getTime() / 1000) - Number(offest)
			},
			formatEndTime (time) {
				this.urlParamsShowEndTime = time
				let offest = 8 * 60 * 60
				let oneDaySeconds = 24 * 60 * 60
				return Number(new Date(time).getTime() / 1000) + Number(oneDaySeconds) - Number(offest)
			},
			resetFilterCondition () {
				this.getType();
				this.resetUrl()
				this.getTxListByFilterCondition();
			},
			getType () {
				switch (this.$route.params.txType) {
					case 'delegations' :
						this.type = 'stake';
						this.pageTitle = pageTitleConfig.StakingDelegationTxs;
						break;
					case 'validations':
						this.type = 'declaration';
						this.pageTitle = pageTitleConfig.StakingValidationTxs;
						break;
					case 'transfers':
						this.type = 'trans';
						this.pageTitle = pageTitleConfig.Transfer;
						break;
					case 'governance':
						this.type = 'gov';
						this.pageTitle = pageTitleConfig.GovGovTxs;
				}
				this.getAllTxType();
			},
			async getAllTxType () {
				let res = [];
				if (this.type === 'stake') {
					const {data} = await getTypeStakingApi()
					data.forEach(item => {
						res.push(item.typeName)
					})
				} else if (this.type === 'declaration') {
					const {data} = await getTypeDeclarationApi()
					data.forEach(item => {
						res.push(item.typeName)
					})
				} else if (this.type === 'gov') {
					const data = await getTypeGovApi()
					data.forEach(item => {
						res.push(item.typeName)
					})
				}
				try {
					if (res) {
						let typeArray;
						typeArray = res.map(item => {
							return {
								value: item,
								label: TX_TYPE_DISPLAY[item] || itme
							}
						});
						this.txTypeListArray = [
							{
								value: 'allTxType',
								label: this.$t('ExplorerLang.common.allTxType'),
								slot: 'allTXType'
							}
						];
						this.txTypeListArray = this.txTypeListArray.concat(typeArray)
					}
				} catch (e) {
					console.error(e)
				}
			},
			async getTxListByFilterCondition () {
				let mainToken = await getMainToken()
				let urlParams = this.getParamsByUrlHash(), param = {};
				param.type = this.type;
				param.pageNumber = this.currentPageNum;
				param.pageSize = this.pageSize;
				param.txType = urlParams.txType ? urlParams.txType : '';
				if (urlParams.txStatus) {
					if (urlParams.txStatus === 'success') {
						param.status = 1
					} else if (urlParams.txStatus === 'fail') {
						param.status = 2
					}
				} else {
					param.status = ''
				}
				param.beginTime = urlParams.filterStartTime ? urlParams.filterStartTime : '';
				param.endTime = urlParams.filterEndTime ? urlParams.filterEndTime : '';
				if (this.type === 'stake') {
					let res = await getDelegationTxsApi('', param.pageNumber, param.pageSize, true, param.txType, param.status, param.beginTime, param.endTime)
					try {
						this.count = res.count;
						if (res && res.data) {
							this.totalPageNum = Math.ceil((res.data / this.pageSize) === 0 ? 1 : (res.data / this.pageSize));
							if (res.data) {
								this.txList = []
								for (const item of res.data) {
									if(item) {
										let msgsNumber = item.msgs ? item.msgs.length : 0, formTO;
										let amount = '--'
										if (item.msgs && item.msgs.length === 1) {
											formTO = TxHelper.getFromAndToAddressFromMsg(item.msgs[0])
											amount = item.msgs[0] ? await getAmountByTx(item.msgs[0],item.events) : '--'
										} else {
											formTO = '--'
										}
										let fromMonikers,toMonikers
										if(item.monikers.length) {
											item.monikers.map( it => {
												toMonikers = toMonikers|| it[formTO.to] || ''
												fromMonikers = fromMonikers || it[formTO.from] || ''
											})
										}
										let isShowMore = false;
										// const type = item.msgs && item.msgs[0] && item.msgs[0].type;
										// if(type && type === TX_TYPE.withdraw_delegator_reward) {
										// 	isShowMore = true
										// }
										// const time = Tools.getDisplayDate(item.time)
										const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) :'--'
										this.txList.push({
											Tx_Hash: item.tx_hash,
											Block: item.height,
											From: formTO.from || "--",
											fromMonikers,
											Amount: amount,
											To: formTO.to || '--',
											toMonikers,
											Tx_Type: (item.msgs || []).map(item=>TX_TYPE_DISPLAY[item.type] || item.type),
											MsgsNum: msgsNumber,
											// Tx_Fee: fee && fee.amount ?  this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
											Tx_Fee: fee && fee.amount ?  `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
											Tx_Signer: item.signers[0] ? item.signers[0] : '--',
											Tx_Status: TxStatus[item.status],
											Timestamp: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
											isShowMore,
											Time: item.time
										})
									}
								}
							} else {
								this.txList = [];
								this.showNoData = true;
							}
							this.flShowLoading = false;
						} else {
							this.txList = [];
							this.showNoData = true;
							this.flShowLoading = false;
						}
					} catch (e) {
						this.showNoData = true;
						console.error(e)
					}
				} else if (this.type === 'declaration') {
					let res = await getValidationTxsApi('', param.pageNumber, param.pageSize, true, param.txType, param.status, param.beginTime, param.endTime)
					try {
						this.count = res.count;
						if (res && res.data) {
							this.totalPageNum = Math.ceil((res.data / this.pageSize) === 0 ? 1 : (res.data / this.pageSize));
							if (res.data) {
								this.txList = []
								for (const item of res.data) {
									if(item) {
										let msgsNumber = item.msgs ? item.msgs.length : 0
										const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) :'--';
										const selfBonded = item.msgs && item.msgs.length === 1 ? item.msgs[0].msg && item.msgs[0].msg.value ? await converCoin(item.msgs[0].msg.value) : '--' : '--';
										// const time = Tools.getDisplayDate(item.time)
										const time = Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix'))

										let OperatorAddr = item.msgs && item.msgs.length === 1 ? item.msgs[0] && TxHelper.getValidationTxsOperator(item.msgs[0]) : '--'
										let OperatorMonikers
										if(item.monikers.length) {
											item.monikers.map( it => {
												OperatorMonikers = OperatorMonikers || it[OperatorAddr] || ''
											})
										}
										this.txList.push({
												Tx_Hash: item.tx_hash,
												Block: item.height,
												OperatorAddr,
												OperatorMonikers: OperatorMonikers || '--',
												SelfBonded: selfBonded.amount || '--',
												'Tx_Type': (item.msgs || []).map(item=>TX_TYPE_DISPLAY[item.type] || item.type),
												MsgsNum: msgsNumber,
												// 'Tx_Fee': fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
												'Tx_Fee': fee && fee.amount ? this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
												'Tx_Signer': item.signers[0] ? item.signers[0] : '--',
												'Tx_Status': TxStatus[item.status],
												Timestamp: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
												Time: item.time
										})
									}
								}
							} else {
								this.txList = [];
								this.showNoData = true;
							}
							this.flShowLoading = false;
						} else {
							this.txList = [];
							this.showNoData = true;
							this.flShowLoading = false;
						}
					} catch (e) {
						this.showNoData = true;
						console.error(e)
					}
				} else if (this.type === 'gov') {
					try {
						let res = await getGovTxsApi('', param.pageNumber, param.pageSize, true, param.txType, param.status, param.beginTime, param.endTime)
						this.txList = [];
						if(res.data && res.data.length > 0) {
							this.count = res.count
							for (const item of res.data) {
								let msgsNumber = item.msgs ? item.msgs.length : 0
								const fee = this.isShowFee && item.fee && item.fee.amount && item.fee.amount.length > 0 ? await converCoin(item.fee.amount[0]) :'--'
								// const time = Tools.getDisplayDate(item.time)
								// const time = Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix'))

								let amount = null
								let msg = item.msgs && item.msgs[0]
								if(msg) {
									if(msg.type == "deposit") {
										let unit = msg.msg && msg.msg.amount && msg.msg.amount[0]
										if(unit) {
											amount = await converCoin(unit)
										}
									} else {
										let unit = msg.msg && msg.msg.initial_deposit && msg.msg.initial_deposit[0]
										if(unit) {
											amount = await converCoin(unit)
										}
									}
								}
								this.txList.push({
									Tx_Hash: item.tx_hash,
									Block: item.height,
									proposalType: item.ex && item.ex.type,
									proposalId: item.ex && item.ex.id,
									proposalTitle: item.ex && item.ex.title && Tools.formatString(item.ex.title, this.proposalTitleNum, '...'),
									// amount: amount ? `${Tools.toDecimal(amount.amount,this.feeDecimals)} ${amount.denom.toLocaleUpperCase()}` : '--',
									amount: amount ? `${Tools.toDecimal(amount.amount,this.feeDecimals)}` : '--',
									'Tx_Type': (item.msgs || []).map(item=>TX_TYPE_DISPLAY[item.type] || item.type),
									MsgsNum: msgsNumber,
									// 'Tx_Fee': fee && fee.amount ?  this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)} ${fee.denom.toLocaleUpperCase()}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
									'Tx_Fee': fee && fee.amount ?  this.isShowDenom ? `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : `${Tools.toDecimal(fee.amount,this.feeDecimals)}` : '--',
									'Tx_Signer': item.signers[0] ? item.signers[0] : '--',
									'Tx_Status': TxStatus[item.status],
									Timestamp: Tools.formatAge(Tools.getTimestamp(),item.time*1000, this.$t('ExplorerLang.table.suffix')),
									proposalLink: item.ex && item.ex.proposal_link,
									Time: item.time
								})
							}
						}
					} catch(e) {
						console.error(e)
					}
				}
				/**
				 * @description: from parseTimeMixin
				 */
				this.parseTime(this.txList, 'Time', 'Timestamp')
			},
			formatAddress (address) {
				return Tools.formatValidatorAddress(address)
			},
			formatTxHash (TxHash) {
				if (TxHash) {
					return Tools.formatTxHash(TxHash)
				}
			},
			getDisplayTxType(types=[]){
				let type = types[0] || '';
                if (type && types.length > 1) {
                    type += this.$t('ExplorerLang.unit.ellipsis');
                }
                return type;
            },
		}
	}
</script>

<style scoped lang="scss">
	.transaction_list_page_container {
		.transaction_list_page_container_title {
			max-width: 12rem;
			margin: 0.3rem auto;
			margin-bottom: 0.13rem;
			display: flex;
		}
		.title_container {
			text-align: left;
			line-height: 0.32rem;
			color: $t_first_c;
			font-size: $s18;
			font-weight: bold;
			margin-right: 0.2rem;
			span:nth-child(1) {
				margin-right: 0.1rem;
			}
		}
		.transaction_list_title_wrap {
			background-color: $bg_cancel_c;
			.transaction_list_title_content {
				// height: 0.64rem;
				display: flex;
				align-items: center;
				// max-width: 12.8rem;
				max-width: 12rem;
				margin: 0 auto;
				
				.filter_container {
					display: flex;
					
					.filter_tx_type_statue_content {
						display: flex;
						align-items: center;
						
						/deep/ .el-select {
							width: 1.3rem;
							margin-right: 0.1rem;
							
							.el-input {
								.el-input__inner {
									padding-left: 0.07rem;
									height: 0.32rem;
									font-size: $s14 !important;
									line-height: 0.32rem;
									
									&::-webkit-input-placeholder {
										font-size: $s10 !important;
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
					}
					
					.select_date_content {
						display: flex;
						align-items: center;
						
						/deep/ .el-date-editor {
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
						
						.tooltip_content {
							padding: 0 0 0 0.1rem;
						}
					}
					
					.reset_search_content {
						display: flex;
						align-items: center;
						
						.reset_btn {
							background: $theme_c;
							color: $t_white_c;
							border-radius: 0.04rem;
							margin-left: 0.1rem;
							cursor: pointer;
							height: 0.3rem;
							
							i {
								padding: 0.08rem;
								font-size: $s14;
								line-height: 1;
								display: inline-block;
							}
						}
						
						.tx_search_btn {
							height: 0.2rem;
							cursor: pointer;
							background: $theme_c;
							margin-left: 0.1rem;
							color: $t_white_c;
							border-radius: 0.04rem;
							padding: 0.05rem 0.18rem;
							font-size: $s14;
							line-height: 0.2rem;
							white-space: nowrap;
						}
					}
				}
				
			}
		}
		.transaction_list_table_container {
			// max-width: 12.8rem;
			max-width: 12rem;
			// padding: 1.24rem 0 0.2rem 0;
			padding: 0rem 0 0.2rem 0;
			margin: 0 auto;
			
			.transaction_list_table_content {
				text-align: left;
				
				.table_list_content {
					width: 100%;
					overflow-x: auto;
					padding-top: 0rem;
				}
				
				.pagination_nav_footer_content {
					display: flex;
					justify-content: flex-end;
					height: 0.7rem;
					align-items: center;
				}
				
			}
		}
	}
	
	@media screen and (max-width: 1248px) {
		.transaction_list_page_container {
			.transaction_list_page_container_title {
				margin-left:0.24rem;
			}
			.title_container {
				span {
				}
			}
			.transaction_list_title_wrap {
				.transaction_list_title_content {
					// margin: 0 0.24rem;
					.filter_container {		
						.filter_tx_type_statue_content {
						}
						
						.select_date_content {

						}
						
						.reset_search_content {
							.reset_btn {
							}
							
							.tx_search_btn {
							}
						}
					}
					
				}
			}
			.transaction_list_table_container {
				margin: 0 0.24rem;				
				.transaction_list_table_content {				
					.table_list_content {
					}				
					.pagination_nav_footer_content {
					}
					
				}
			}
		}
	}

	@media screen and (max-width: 1053px) {
		.transaction_list_page_container {
			.transaction_list_page_container_title {
				display: block;
			}
			.title_container {
				margin-bottom: 0.1rem;
				span {
				}
			}
			.transaction_list_title_wrap {
				.transaction_list_title_content {
					// margin: 0 0.24rem;
					.filter_container {		
						.filter_tx_type_statue_content {
						}
						
						.select_date_content {

						}
						
						.reset_search_content {
							.reset_btn {
							}
							
							.tx_search_btn {
							}
						}
					}
					
				}
			}
			.transaction_list_table_container {			
				.transaction_list_table_content {				
					.table_list_content {
					}				
					.pagination_nav_footer_content {
					}
					
				}
			}
		}
	}

	@media screen and (max-width: 910px) {
		.transaction_list_page_container {
			.title_container {	
				span {
				}
			}
			.transaction_list_title_wrap {
				position: static;
				padding-top: 0.15rem;
				
				.transaction_list_title_content {
					display: flex;
					flex-direction: column;
					height: auto;
					align-items: flex-start;
					
					.transaction_list_title {
						height: 0.7rem;
						line-height: 0.7rem;
					}
					
					.filter_container {
						flex-direction: column;
						width: 100%;
						
						.filter_tx_type_statue_content {
							width: 3.45rem;
							display: flex;
							margin-bottom: 0.1rem;
							
							.el-select {
								margin-right: 0;
								margin-right: 0.26rem;
							}
						}
						
						.select_date_content {
							width: 3.45rem;
							display: flex;
							margin-bottom: 0.1rem;
						}
						
						.reset_search_content {
							display: flex;
							justify-content: flex-end;
							margin-bottom: 0.1rem;
							
							.reset_btn {
								margin-left: 0;
							}
							
							.tx_search_btn {
								margin-left: 0;
								margin-right: 0.1rem;
								text-align: center;
							}
						}
					}
				}
			}
			.transaction_list_table_container {
				padding-top: 0;
				// padding-left: 0.1rem;
				// padding-right: 0.1rem;
				
				.transaction_list_table_content {
					.table_list_content {
						padding-top: 0;
					}
				}
			}
		}
	}

	@media screen and (max-width: 768px) {
		.transaction_list_page_container {
			.transaction_list_page_container_title {
				margin: 0px;
			}
			.title_container {
				margin: 0.3rem 0.12rem 0rem 0.12rem;
				span {
				}
			}
			.transaction_list_title_wrap {
				.transaction_list_title_content {
					margin: 0 0.12rem;
					.filter_container {		
						.filter_tx_type_statue_content {
						}
						
						.select_date_content {

						}
						
						.reset_search_content {
							.reset_btn {
							}
							
							.tx_search_btn {
							}
						}
					}
					
				}
			}
			.transaction_list_table_container {
				margin: 0 0.12rem;				
				.transaction_list_table_content {				
					.table_list_content {
					}				
					.pagination_nav_footer_content {
					}
					
				}
			}
		}
	}

</style>
