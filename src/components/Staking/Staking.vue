<template>
	<div class="staking_container">
		<div class="staking_content">
			<div class="staking_title_container">
				<span>{{ $t('ExplorerLang.staking.title') }}</span>
<!--				<span>{{ count }} {{ titleStatus }}</span>-->
			</div>
			
			<list-component
				:tableWidth="'11.5rem'"
				:empty-text="$t('ExplorerLang.table.emptyDescription')"
				:token-symbol="mainTokenSymbol"
				:is-loading="isValidatorListLoading"
				:column-list="validatorColumnList"
				:list-data="tableData"
				:pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(pageNum)}"
			>
				<template v-slot:txCount>
					<tx-count-component :title="titleStatus" :icon="'iconValidators'" :tx-count="count" ></tx-count-component>
				</template>
				<template v-slot:datePicket>
					<div class="staking_tab_content">
						<m-tabs class="staking_m_tabs" :data="stakingStatusTitleList" :chose="selectStakingStatus"></m-tabs>
					</div>
				</template>
			</list-component>
<!--			<div class="staking_table_list_content">
				
				<el-table class="sort_table table_overflow_x" :empty-text="$t('ExplorerLang.table.emptyDescription')"
						  :data="tableData">
					<el-table-column key="index" align="center" type="index" class="index"
									 :min-width="ColumnMinWidth.No"
									 :label="$t('ExplorerLang.table.number')"></el-table-column>
					<el-table-column class-name="moniker" key="moniker" align="left" prop="moniker"
									 show-overflow-tooltip :min-width="ColumnMinWidth.validatorMoniker"
									 :label="$t('ExplorerLang.table.name')" sortable
									 :sort-orders="['descending', 'ascending']">
						<template v-slot:default="{ row }">
							<div style="display: flex;align-items: center;position: relative">
								<span class="avatar"
									  style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;display: flex;align-items: center;justify-content: center">{{
										row.validatorIconSrc
									}}</span>
								<img v-if="row.url"
									 style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;position: absolute"
									 :src="row.url ? row.url : ''"/>
								<el-tooltip popper-class="tooltip" :disabled="!row.isTooltip"
											:content="row.monikerValue" placement="top">
									<router-link style="margin-left: 0.2rem;" :to="'staking/' + row.operatorAddress"
												 class="link_style">{{ row.moniker }}
									</router-link>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column class-name="operator" key="operatorAddress" prop="operatorAddress" align="left"
									 :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.operator')">
						<template v-slot:default="{ row }">
              <span class="remove_default_style">
                <el-tooltip popper-class="tooltip" :content="row.operatorAddress" placement="top">
                  <router-link :to="'staking/' + row.operatorAddress" class="link_style operator_address_style">
                    {{ formatAddress(row.operatorAddress) }}
                  </router-link>
                </el-tooltip>
              </span>
						</template>
					</el-table-column>
					<el-table-column key="commission" align="center" prop="commission"
									 :min-width="ColumnMinWidth.commission" :sort-method="commissionSort"
									 :label="$t('ExplorerLang.table.commission')" sortable
									 :sort-orders="['descending', 'ascending']"></el-table-column>
					<el-table-column key="bondedToken" class-name="bondedToken" align="right" prop="bondedToken"
									 :min-width="ColumnMinWidth.bondedTokens" :sort-method="bondedTokenSort"
									 :label="$t('ExplorerLang.table.bondedTokens')" sortable
									 :sort-orders="['descending', 'ascending']">
						<template slot="header" slot-scope="scope">
							<span>{{ $t('ExplorerLang.table.bondedTokens') }}</span>
							<el-tooltip :content="mainTokenSymbol"
										placement="top">
								<i class="iconfont iconyiwen yiwen_icon"/>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column key="votingPower"
									 v-if="titleStatus === 'Active' && productionConfig.table.votingPower"
									 class-name="votingPower" align="center" prop="votingPower"
									 :min-width="ColumnMinWidth.votingPower" :sort-method="votingPowerSort"
									 :label="$t('ExplorerLang.table.votingPower')" sortable
									 :sort-orders="['descending', 'ascending']"></el-table-column>
					<el-table-column key="uptime" v-if="titleStatus === 'Active'" align="right" prop="uptime"
									 :min-width="ColumnMinWidth.uptime" :sort-method="uptimeSort"
									 :label="$t('ExplorerLang.table.uptime')" sortable
									 :sort-orders="['descending', 'ascending']"></el-table-column>
					<el-table-column key="selfBond" align="right" prop="selfBond"
									 :min-width="ColumnMinWidth.validatorSelfBond" :sort-method="selfBondSort"
									 :label="$t('ExplorerLang.table.selfBonded')" sortable
									 :sort-orders="['descending', 'ascending']">
						<template slot="header" slot-scope="scope">
							<span>{{ $t('ExplorerLang.table.selfBonded') }}</span>
							<el-tooltip :content="mainTokenSymbol"
										placement="top">
								<i class="iconfont iconyiwen yiwen_icon"/>
							</el-tooltip>
						</template>
					</el-table-column>
					&lt;!&ndash; <el-table-column key="delegators" class-name="delegators" v-if="titleStatus !== 'Jailed'" min-width="ColumnMinWidth.delegators" align="center" prop="delegatorNum" width="117" :label="$t('ExplorerLang.table.delegators')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column> &ndash;&gt;
					&lt;!&ndash; <el-table-column key="bondHeight" class-name="bondHeight" align="center" prop="bondHeight" :min-width="ColumnMinWidth.bondHeight" :label="$t('ExplorerLang.table.bondHeight')" sortable :sort-orders="['descending', 'ascending']"> </el-table-column> &ndash;&gt;
					<el-table-column key="unbondingHeight" align="center" v-if="titleStatus !== 'Active'"
									 prop="unbondingHeight" :min-width="ColumnMinWidth.unbondingHeight"
									 :label="$t('ExplorerLang.table.unbondingHeight')" sortable
									 :sort-orders="['descending', 'ascending']"></el-table-column>
				</el-table>
				<div class="pagination_content">
					<m-pagination :page-size="pageSize" :total="count" :page="pageNum"
								  :page-change="pageChange"></m-pagination>
				</div>
			</div>-->
		</div>
	</div>
</template>

<script>
import MTabs from '.././common/MTabs';
import MPagination from '.././common/MPagination';
import Tools from '../../util/Tools';
import BigNumber from 'bignumber.js';
import {getValidatorsListApi} from "@/service/api";
import productionConfig from '@/productionConfig.js';
import {getMainToken, converCoin, formatMoniker} from '@/helper/IritaHelper';
import {ColumnMinWidth, monikerNum} from '@/constant';
import ListComponent from "../common/ListComponent";
import validatorListColumn from "./tableColumnConfig/validatorListColumn";
import TxCountComponent from "../TxCountComponent";
export default {
	name: 'Staking',
	components: {TxCountComponent, ListComponent, MTabs, MPagination},
	props: {},
	data() {
		return {
			validatorColumnList:[],
			isValidatorListLoading: false,
			productionConfig,
			decimalNamber: 2,
			percentum: 4,
			ColumnMinWidth,
			count: 0,
			pageSize: 500,
			pageNum: 1,
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
			type: '',
			mainTokenSymbol: '',
		}
	},
	computed: {},
	watch: {},
	mounted() {
		this.validatorColumnList = validatorListColumn[this.stakingStatusTitleList[0].name]
		if(!productionConfig.table.votingPower){
			this.validatorColumnList = this.validatorColumnList.filter( item => {
				return item.displayValue !== "votingPower"
			})
		}
		this.getValidatorsList(this.stakingStatusTitleList[0].name)
		this.setMainToken();
	},
	methods: {
		percentSort(a, b, c) {
			a = Number(a.substring(0, a.length - c))
			b = Number(b.substring(0, b.length - c))
			return a - b
		},
		async setMainToken() {
			let mainToken = await getMainToken();
			if (mainToken && mainToken.symbol) {
				this.mainTokenSymbol = mainToken.symbol.toUpperCase();
			}
		},
		bigNumberSort(a, b, c) {
			// a = a.substring(0, a.length - c).replace(/,/g, '')
			// b = b.substring(0, b.length - c).replace(/,/g, '')
			a = new BigNumber(a || 0).toNumber()
			b = new BigNumber(b || 0).toNumber()
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
			this.pageNum = 1
			this.tableData = []
			this.count = 0
			this.validatorColumnList = validatorListColumn[v.name]
			if(!productionConfig.table.votingPower){
				this.validatorColumnList = this.validatorColumnList.filter( item => {
					return item.displayValue !== "votingPower"
				})
			}
			this.getValidatorsList(v.name)
		},
		pageChange(pageNum) {
			if (this.pageNum == pageNum) {
				return;
			}
			this.pageNum = pageNum;
			this.getValidatorsList(this.type)
		},
		async getValidatorsList(type) {
			this.isValidatorListLoading = true
			let mainToken = await getMainToken();
			try {
				let res = await getValidatorsListApi(this.pageNum, this.pageSize, true, type)
				this.type = type
				this.count = res && res.count ? res.count : 0
				let result = res && res.data ? res.data : null
				if (result) {
					this.tableData =
						await Promise.all(result.map(async item => {
								let regex = /[^\w\u4e00-\u9fa50-9a-zA-Z]/g
								let replaceMoniker = item.description.moniker.replace(regex, '')
								let validatorIconSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : ''
								let selfBond = item.self_bond && item.self_bond.amount && await converCoin(item.self_bond)
								let bondedToken = await converCoin({
									amount: item.tokens,
									denom: mainToken.denom
								})
								return {
									validatorStatus: status,
									isTooltip: item.description.moniker.length > this.cutNumber,
									monikerValue: item.description.moniker,
									moniker: formatMoniker(item.description.moniker, monikerNum.validatorList),
									operatorAddress: item.operator_address,
									commission: `${(item.commission.commission_rates.rate * 100).toFixed(this.decimalNamber)} %`,
									// bondedToken: `${Tools.subStrings(bondedToken.amount, this.decimalNamber)} ${bondedToken.denom.toLocaleUpperCase()}`,
									bondedToken: `${Tools.subStrings(bondedToken.amount, this.decimalNamber)}`,
									uptime: Tools.FormatUptime(item.uptime),
									votingPower: `${(item.voting_rate * 100).toFixed(this.percentum)}%`,
									// selfBond: selfBond ? `${Tools.subStrings(selfBond.amount, this.decimalNamber)} ${selfBond.denom.toLocaleUpperCase()}` : `0.00 ${mainToken.symbol.toLocaleUpperCase()}`,
									selfBond: selfBond ? `${Tools.subStrings(selfBond.amount, this.decimalNamber)}` : `0.00`,
									delegatorNum: item.delegator_num,
									// bondHeight: Number(item.bond_height),
									unbondingHeight: Number(item.unbonding_height),
									// unbondingTime: new Date(item.unbonding_time).getTime() > 0 ? Tools.format2UTC(item.unbonding_time) : '--',
									// identity: item.description.identity,
									url: item.icons ? item.icons : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg'),
									validatorIconSrc: validatorIconSrc,
								}
							})
						)
				} else {
					this.tableData = []
				}
				this.isValidatorListLoading = false
			} catch (err) {
				this.isValidatorListLoading = false
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
		max-width: 12rem;
		margin: 0 auto;
		padding: 0 0.15rem;
		text-align: left;
		
		.staking_title_container {
			margin: 0.4rem 0 0.1rem 0;
			text-align: left;
			display: flex;
			color: $t_first_c;
			font-size: $s22;
			font-weight: bold;
			span {
				margin-right: 0.1rem;
			}
		}
		
		.staking_tab_content {
			margin: 0.16rem 0rem;
			
			.staking_m_tabs {
				margin-top: -0.2rem;
			}
		}
		
		.staking_table_list_content {
			width: 100%;
			padding: 0 0.15rem 0.15rem;
			background: #fff;
			box-sizing: border-box;
			
			.avatar {
				background: $bg_avatar;
			}
			
			::v-deep .cell {
				padding: 0;
			}
			
			::v-deep .delegators .cell {
				// min-width: 1.21rem;
				min-width: 1.17rem;
				padding-right: 0.05rem;
			}
			
			::v-deep .votingPower .cell {
				min-width: 1.26rem;
			}
			
			// ::v-deep .bondHeight .cell {
			//   padding-right: 0.07rem;
			// }
			::v-deep .sort_table {
				overflow-x: auto;
				
				.sort-caret.ascending,
				.sort-caret.descending {
					margin-left: 0.07rem;
				}
			}
			
			::v-deep .el-table .descending .sort-caret.descending {
				border-top-color: $theme_c;
			}
			
			::v-deep .el-table .ascending .sort-caret.ascending {
				border-bottom-color: $theme_c;
			}
			
			.pagination_content {
				width: 100%;
				display: flex;
				justify-content: flex-end;
				margin: 0.1rem 0 0.2rem 0;
			}
			
			::v-deep .yiwen_icon {
				vertical-align: -0.1em;
				font-weight: normal;
				margin-top: 0.03rem;
				margin-right: -0.08rem;
			}
		}
	}
}
</style>
