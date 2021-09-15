<template>
	<div class="list_table_content_container">
		<el-card class="box-card">
			<div class="header_content">
				<slot name="txCount"></slot>
				<slot name="dataPicket"></slot>
			</div>
			<slot name="msgType"></slot>
			<loading v-if="isLoading"></loading>
			<el-table v-if="!isLoading" :data="tabList" stripe ref="listTable">
				<el-table-column
					v-for="(item,index) in columns"
					:key="index"
					:prop="item.displayValue"
					:label="item.label">
					
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
							<router-link class="link_style" v-if="item.isLink"
										 :to="`${item.linkRoute}/${scope.row[item.nativeValue]}`">
								<span v-if="item.isNeedFormatHash">{{ formatTxHash(scope.row[item.displayValue]) }}</span>
								<span v-else>{{ scope.row[item.displayValue] }}</span>
							</router-link>
							<span v-else-if="item.isShowTag">
								<el-tag
									class="tag_style">{{ formatTypeNotString(scope.row[item.displayValue]) }}</el-tag>
								<span class="tag_num">{{ setTagNum(scope.row[item.displayValue]) }}</span>
							</span>
							<span v-else>{{ scope.row[item.displayValue] }}</span>
						</el-tooltip>
					
					</template>
				</el-table-column>
			</el-table>
			<m-pagination v-show="pagination.dataCount !==0"
						  :page-size="pagination.pageSize"
						  :total="pagination.dataCount"
						  :page="pagination.pageNumber"
						  :page-change="pageChange"></m-pagination>
		</el-card>
	</div>
</template>

<script>
import Loading from "./Loading";
import MPagination from "./MPagination";
import Tools from "../../util/Tools";
import {
	TX_TYPE,
	TX_STATUS,
	ColumnMinWidth,
	monikerNum,
	decimals,
	IRIS_ADDRESS_PREFIX,
	COSMOS_ADDRESS_PREFIX
} from '../../constant';

export default {
	name: "ListComponent",
	components: {MPagination, Loading},
	data() {
		return {
			tabList: [],
			columns: [],
			TX_STATUS,
			isShowTooltip: false,
			tagNum: ''
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
				this.columns = newValue
			},
			deep: true
		},
		listData: {
			handler(newValue, oldValue) {
				this.tabList = newValue
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
				return false
			}
			return true
			
		},
		pageChange(pageNum) {
			this.$emit('pageChange', pageNum)
		},
		formatTxHash(TxHash) {
			if (TxHash) {
				return Tools.formatTxHash(TxHash)
			}
		},
		
		formatStr(str) {
			if (str && Array.isArray(str)) {
				let data = str.reduce(function (prev, next) {
					prev[next] = (prev[next] + 1) || 1;
					return prev;
				}, {});
				let formatStr = ''
				for (let dataKey in data) {
					formatStr += `${dataKey} *${data[dataKey]},`
				}
				return formatStr.substring(0,formatStr.length -1)
			}else {
				return  str?.toString() || str
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
					value.forEach( item => {
						if(item === currentChoiceTxType){
							displayMsgType = item
						}else {
							displayMsgType = value[0]
						}
					})
					return displayMsgType
				} else {
					this.isShowTooltip = false
					return value[0]
				}
			} else {
				this.isShowTooltip = false
				return value
			}
		}
	},
	mounted() {
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
		.header_content{
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