<template>
	<div class="list_table_content_container">
		<el-card class="box-card">
			<div class="header_content">
				<slot name="txCount"></slot>
				<slot name="dataPicket"></slot>
			</div>
			<slot name="msgType"></slot>
			<loading v-if="isLoading"></loading>
			<el-table v-if="!isLoading" :data="tableList" stripe ref="listTable">
				<el-table-column
					v-for="(item,index) in columns"
					:key="item.label"
					:prop="item.displayValue"
					:label="item.label"
					:width="item.width ? item.width : 'auto'">
					
					<template slot="header" slot-scope="scope">
						<span>{{ item.label }}</span>
						<el-tooltip v-show="item.isShowTokenSymbol" :content="tokenSymbol"
									placement="top">
							<i class="iconfont iconyiwen yiwen_icon"/>
						</el-tooltip>
					</template>
					<template slot-scope="scope">
						<!--						blockChain-->
						<div class="status" v-show="item.isShowTxStatusIcon">
							<img class="status_icon"
								 :src="require(`../../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
						</div>
						
						<el-tooltip :manual="setManual(!item.isNeedFormat,scope.row[item.displayValue])"
									:content="formatStr(scope.row[item.nativeValue])">
							<router-link class="link_style" v-if="item.isLink &&  scope.row[item.displayValue] && scope.row[item.displayValue] !== '--'"
										 :to="!item.isNft ? `${item.linkRoute}/${scope.row[item.nativeValue]}` : `${item.linkRoute}${scope.row[item.nftRouterParamsValue]}${item.denomRouter}${scope.row[item.nativeValue]}`">
								<span v-if="item.isNeedFormatHash">{{formatTxHash(scope.row[item.displayValue]) }} </span>
								<span v-else-if="item.isFormatAddress">{{ formatAddress(scope.row[item.displayValue]) }}</span>
								<span v-else-if="item.isFormatMoniker">{{ formatTableMoniker(scope.row[item.displayValue]) }}</span>
								<span v-else>{{ scope.row[item.displayValue] }}</span>
							</router-link>
							<span v-else-if="item.isShowTag">
								<el-tag
									class="tag_style">{{ formatTypeNotString(scope.row[item.displayValue]) }}</el-tag>
								<span class="tag_num">{{ setTagNum(scope.row[item.displayValue]) }}</span>
							</span>
							<span v-else-if="item.isFormatAddress && !item.isHref">{{ formatAddress(scope.row[item.displayValue]) }}</span>
							<span v-else-if="item.isHref">
								<a v-show="isShowHref(scope.row[item.displayValue])"
								   class="route_link_style" :href="`${item.href}/#/address/${scope.row[item.nativeValue]}`"
								   target="_blank"
								   rel="noreferrer noopener">
									{{ formatAddress(scope.row[item.displayValue]) }}
								</a>
								<span v-show="!isShowHref(scope.row[item.displayValue])" >
									{{ formatAddress(scope.row[item.displayValue]) }}
								</span>
							</span>
							<span v-else-if="item.isShowDenomTip">
								<span>
									{{getAmount(scope.row[item.displayValue])}}
								</span>
								<el-tooltip :manual="isShowDenomTip(scope.row.denomTheme.tooltipContent)"
											:content="scope.row.denomTheme.tooltipContent" placement="top">
									<span :style="{ color: scope.row.denomTheme.denomColor }">{{ getAmountUnit(scope.row[item.displayValue] )}}</span>
								</el-tooltip>
							</span>
							<span v-else>{{ scope.row[item.displayValue] || '--' }}</span>
						</el-tooltip>
					
					</template>
				</el-table-column>
			</el-table>
			<m-pagination v-show="dataCount !==0"
						  :page-size="pageSize"
						  :total="dataCount"
						  :page="pageNum"
						  :page-change="pageChange"></m-pagination>
		</el-card>
	</div>
</template>

<script>
import Loading from "./Loading";
import MPagination from "./MPagination";
import Tools from "../../util/Tools";
import {formatMoniker, getConfig} from "../../helper/IritaHelper";
import {
	TX_TYPE,
	TX_STATUS,
	ColumnMinWidth,
	monikerNum,
	decimals,
	IRIS_ADDRESS_PREFIX,
	COSMOS_ADDRESS_PREFIX, TX_TYPE_DISPLAY
} from '../../constant';

export default {
	name: "ListComponent",
	components: {MPagination, Loading},
	data() {
		return {
			tableList: [],
			columns: [],
			TX_STATUS,
			isShowTooltip: false,
			tagNum: '',
			pageNum: 1,
			pageSize: 30,
			dataCount: 0,
			sessionStorage: sessionStorage.getItem('config') || null
		}
	},
	props: {
		tokenSymbol: {
			type: String,
			default: ''
		},
		isLoading: {
			type: Boolean,
			default: false
		},
		pagination: {
			type: Object,
			default: {}
		},
		columnList: {
			type: Array,
			default: []
		},
		listData: {
			type: Array,
			default: []
		}
	},
	watch: {
		columnList: {
			handler(newValue, oldValue) {
				this.columns = []
				this.columns = newValue
			},
			deep: true
		},
		listData: {
			handler(newValue, oldValue) {
				this.tableList = newValue
			},
			deep: true
		},
		pagination: {
			handler(newValue, oldValue) {
				if (JSON.stringify(newValue) !== '{}') {
					this.pageNum = newValue.pageNum
					this.pageSize = newValue.pageSize
					this.dataCount = newValue.dataCount
				}
			},
			deep: true
		}
	},
	methods: {
		setManual(value, data) {
			if (!value || Array.isArray(data)) {
				if (data?.length <= 1) {
					return true
				}
				if(!data || data === '--'){
					return  true
				}
				return false
			}
			return true
			
		},
		isShowDenomTip(denom){
			if(denom){
				return false
			}
			return  true
		},
		pageChange(pageNum) {
			this.$emit('pageChange', pageNum)
		},
		getAmount(amount) {
			if (!amount) {
				return "";
			}
			if(amount === '--'){
				return '--'
			}
			let denomRule = /[0-9.]+/
			return amount.match(denomRule)[0];
		},
		getAmountUnit(amount) {
			if (!amount) {
				return "";
			}
			if(amount === '--'){
				return ''
			}
			let denomRule = /[A-Za-z\/]+/
			return amount.match(denomRule)[0];
		},
		isShowHref(address){
			
			let storageAddressPrefix = JSON.parse(this.sessionStorage) || null
			let addressPrefix = null
			if(storageAddressPrefix){
				addressPrefix = storageAddressPrefix.addressPrefix
			}else {
				getConfig().then(res => {
					addressPrefix = res.addressPrefix
				});
				
			}
			if (addressPrefix.iva) {
				let length = addressPrefix.iva.length
				if(address) {
					let isIris = addressPrefix.iaa === IRIS_ADDRESS_PREFIX,
						isCosmos = addressPrefix.iaa === COSMOS_ADDRESS_PREFIX;
					if (address.substring(0, length) === addressPrefix.iva) {
						return 'false'
					} else if (isIris && address.startsWith(COSMOS_ADDRESS_PREFIX)) {
						return 'true'
					}  else if (isCosmos && address.startsWith(IRIS_ADDRESS_PREFIX)) {
						return 'false'
					}  else if (address.startsWith(IRIS_ADDRESS_PREFIX) || address.startsWith(COSMOS_ADDRESS_PREFIX)) {
						return 'false'
					}
				}else {
					return  'false'
				}
			}
		},
		formatTableMoniker(moniker) {
			if(moniker){
				return formatMoniker(moniker,monikerNum.validatorList)
			}
			return  '--'
		},
		formatTxHash(TxHash) {
			if (TxHash) {
				return Tools.formatTxHash(TxHash)
			}
			return '--'
		},
		formatAddress(address) {
			if(address){
				return Tools.formatValidatorAddress(address)
			}
			return '--'
		},
		formatStr(str) {
			if (str && Array.isArray(str)) {
				const {txType} = Tools.urlParser();
				let msgTxTypeIndex = 0,tmp =str[0]
				str.forEach((item,index) => {
					if(txType && item === txType){
						msgTxTypeIndex = index
					}
				})
				if(msgTxTypeIndex !== 0){
					str[0] = txType
					str[msgTxTypeIndex] = tmp
				}
				
				let data = str.reduce(function (prev, next) {
					prev[next] = (prev[next] + 1) || 1;
					return prev;
				}, {});
				let formatStr = ''
				for (let dataKey in data) {
					formatStr += `${TX_TYPE_DISPLAY[dataKey]} *${data[dataKey]},`
				}
				return formatStr.substring(0, formatStr.length - 1)
			} else {
				return TX_TYPE_DISPLAY[str?.toString()]  || TX_TYPE_DISPLAY[str] || str?.toString() || str
			}
		},
		setTagNum(value) {
			if (Array.isArray(value)) {
				if (value.length > 1) {
					return `+${value.length - 1}`
				}
				return ''
			}
			return ''
		},
		formatTypeNotString(value) {
			if (Array.isArray(value)) {
				if (value.length > 1) {
					this.tagNum = value.length - 1
					this.isShowTooltip = true
					const currentChoiceTxType = sessionStorage.getItem('currentChoiceMsgType') || ''
					let displayMsgType = ''
					value.forEach(item => {
						if (item === currentChoiceTxType) {
							displayMsgType = item
						} else {
							displayMsgType = value[0]
						}
					})
					return TX_TYPE_DISPLAY[displayMsgType] || displayMsgType
				} else {
					this.isShowTooltip = false
					return TX_TYPE_DISPLAY[value[0]] || value[0]
				}
			} else {
				this.isShowTooltip = false
				return TX_TYPE_DISPLAY[value] || value
			}
		}
	},
	mounted() {
		this.columns = []
		this.columns = this.columnList
		this.listData = this.listData
	}
}
</script>

<style scoped lang="scss">
.list_table_content_container {
	::v-deep.box-card {
		box-sizing: border-box;
		padding: 0.08rem 0.2rem 0 0.2rem;
		border-radius: 0.08rem;
		border: none;
		box-shadow: 0 0.03rem 0.06rem 0 #EDEDED;
		margin-bottom: 0.2rem;
		
		.header_content {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		
		.el-card__body {
			width: 100%;
			height: 100%;
			padding: 0;
			border-radius: 0.8rem;
		}
		
		.link_style {
			color: $t_link_c !important;
		}
		
		.tag_style {
			background: $tag_c !important;
			border: none;
			color: $theme_c !important;
		}
		
		.yiwen_icon {
			cursor: pointer;
		}
		.route_link_style{
			color: $theme_c !important;
		}
		.tag_num {
			color: $theme_c !important;
			margin-left: 0.06rem;
			font-size: 0.14rem;
		}
		
		.el-table td, .el-table th.is-leaf {
			border-bottom: 0.01rem solid rgba(248, 248, 248, 1);
		}
		
		.cell {
			display: flex;
			align-items: center;
			
			.status {
				display: flex;
				align-items: center;
				justify-content: center;
				
				.status_icon {
					width: 0.13rem;
					height: 0.13rem;
					margin-right: 0.05rem;
				}
			}
		}
		
	}
}

</style>