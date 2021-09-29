<template>
	<div class="block_list_container">
		<div class="block_list_content_wrap">
			<div class="block_list_content">
				<div class="block_list_header_content">
					<div class="block_list_herder_top_content">
						<div class="block_list_current_height_content">
              				<span class="block_list_current_height_title">{{$t("ExplorerLang.block.title") }}</span>
						</div>
					</div>
					<div class="block_list_pagination_content">
						<list-component :is-loading="isLoading"
										:list-data="blockList"
										:column-list="blockChainColumnArr"
										:pagination="{pageSize,dataCount,pageNumber}"
										@pageChange="pageChange"
										:empty-text="$t('ExplorerLang.table.emptyDescription')">
							<template v-slot:txCount>
								<tx-count-component :icon="'iconBlockchain'"
													:title="$t('ExplorerLang.block.currentHeight')"
													:isLink="true"
													:linkRoute="'/block'"
													:tx-count="latestBlockHeight"></tx-count-component>
							</template>
						</list-component>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Tools from '../util/Tools'
import MPagination from './common/MPagination'
import {getRangeBlockList, getLatestBlock} from '../service/api'
import {ColumnMinWidth} from '../constant'
import productionConfig from '@/productionConfig.js'
import {validatePositiveInteger} from '../helper/IritaHelper'
import ListComponent from "./common/ListComponent";
import blockChainColumnList from "./tableListColumnConfig/blockChainTableList"
import TxCountComponent from "./TxCountComponent";

export default {
	name: 'BlockList',
	components: {TxCountComponent, ListComponent, MPagination},
	data() {
		return {
			ColumnMinWidth,
			productionConfig,
			pageNumber: 1,
			pageSize: 15,
			dataCount: 0,
			latestBlockHeight: 0,
			dbHeight: 0,
			blockList: [],
			blockListTimer: null,
			blockChainColumnArr: [],
			isLoading: false
		}
	},
	mounted() {
		this.queryBlockList()
		this.blockChainColumnArr = blockChainColumnList
	},
	methods: {
		async queryBlockList() {
			this.isLoading = true
			this.getBlocksCount()
			await this.latestBlock()
			this.getBlocks()
		},
		async getBlocks() {
			let start = this.dbHeight - (this.pageNumber - 1) * this.pageSize
			let end = start - this.pageSize
			try {
				let blockList = await getRangeBlockList(
					start,
					validatePositiveInteger(end)
				)
				if (blockList?.data && blockList?.data.length > 0) {
					if (blockList.data.length > this.pageSize) {
						blockList.data = blockList.data.slice(0, this.pageSize)
					}
					this.blockList = blockList.data.map((item) => {
						return {
							proposerAddress: item.proposer_addr || '--',
							proposerValue:
								item.proposer_moniker || item.proposer_addr || '--',
							// validatorValue: `${item.precommit_validator_num || 0} / ${item.total_validator_num || 0}`,
							// votingPowerValue: item.precommit_voting_power ? `${Tools.formatPerNumber((Number(item.precommit_voting_power) / item.total_voting_power) * 100)} %` : '--',
							height: item.height,
							time: Tools.getDisplayDate(item.time),
							Time: item.time,
							numTxs: item.txn,
							ageTime: Tools.formatAge(
								Tools.getTimestamp(),
								item.time * 1000,
								this.$t('ExplorerLang.table.suffix'),
								''
							),
						}
					})
				}
				clearInterval(this.blockListTimer)
				this.isLoading = false
				this.blockListTimer = setInterval(() => {
					this.blockList.map((item) => {
						item.ageTime = Tools.formatAge(
							Tools.getTimestamp(),
							item.Time * 1000,
							this.$t('ExplorerLang.table.suffix'),
							''
						)
						return item
					})
				}, 1000)
			} catch (e) {
				this.isLoading = false
				console.error(e)
			}
		},
		async getBlocksCount() {
			try {
				let data = await getRangeBlockList(null, null, true)
				if (data?.count) {
					this.dataCount = data.count
				}
			} catch (e) {
				console.error(e)
			}
		},
		async latestBlock() {
			try {
				let blockData = await getLatestBlock()
				if (blockData) {
					this.latestBlockHeight = blockData.height
					this.dbHeight = blockData.dbHeight
				}
			} catch (e) {
				console.error(e)
			}
		},
		pageChange(pageNum) {
			if (this.pageNumber == pageNum) {
				return
			}
			this.pageNumber = pageNum
			this.getBlocks()
		},
	},
}
</script>

<style scoped lang="scss">
a {
	color: $t_link_c !important;
}

.block_list_container {
	/*margin-top: 0.61rem;*/
	@media screen and (min-width: 910px) {
		.block_list_content_wrap {
			max-width: 12.3rem;
		}
	}
	@media screen and (max-width: 910px) {
		.block_list_content_wrap {
			// width:100%;
		}
	}
	
	.block_list_content_wrap {
		margin: 0 auto;
		
		.block_list_content {
			width: 100%;
			
			.block_list_header_content {
				width: 100%;
				padding: 0 0.15rem;
				box-sizing: border-box;
				
				.block_list_herder_top_content {
					display: flex;
					width: 100%;
					
					.pagination_content {
						display: flex;
						justify-content: flex-end;
						margin: 0.3rem 0 0.1rem 0;
					}
				}
				
				@media screen and (min-width: 910px) {
					.block_list_herder_top_content {
						justify-content: space-between;
						// align-items: center;
						.pagination_content {
							width: 40%;
						}
					}
				}
				@media screen and (max-width: 910px) {
					.block_list_herder_top_content {
						flex-direction: column;
						
						.pagination_content {
							width: 100%;
							margin: -0.1rem 0 0.1rem 0;
						}
					}
				}
				
				.block_list_pagination_content {
					width: 100%;
					overflow-x: auto;
					
					.el-table {
						overflow-x: auto;
						
						.el-table__header-wrapper {
							/*position: fixed;*/
							/*z-index: 10;*/
						}
						
						::v-deep .el-table__body-wrapper {
							overflow: auto;
						}
					}
					
					@media screen and (min-width: 910px) and (max-width: 1280px) {
						.el-table {
							min-width: 8rem;
						}
					}
					@media screen and (max-width: 910px) {
						.el-table {
							min-width: 4rem;
						}
					}
				}
				
				.block_list_current_height_content {
					padding: 0.4rem 0 0 0;
					text-align: left;
					display: flex;
					align-items: center;
					margin-bottom: 0.1rem;
					.block_list_current_height_title {
						color: $t_first_c;
						font-size: $s22;
						line-height: 0.26rem;
						font-weight: bold;
						margin-right: 0.1rem;
					}
					
					.block_list_current_height_number {
						a {
							font-size: $s18;
							font-weight: bold;
						}
					}
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
}
</style>
