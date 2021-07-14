<template>
	<div class="block_list_container">
		<div class="block_list_content_wrap">
			<div class="block_list_content">
				<div class="block_list_header_content">
					<div class="block_list_herder_top_content">
						<div class="block_list_current_height_content">
							<span class="block_list_current_height_title">{{$t('ExplorerLang.block.currentHeight')}}</span>
							<span class="block_list_current_height_number">
								<router-link :to="`/block/${latestBlockHeight}`">{{latestBlockHeight}}</router-link>
							</span>
						</div>
						<!-- <div class="pagination_content">
							<m-pagination :page-size="pageSize" :total="dataCount" :page="pageNumber" :page-change="pageChange"></m-pagination>
						</div> -->
					</div>
					<div class="block_list_pagination_content">
						<el-table class="table"  :data="blockList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
							<el-table-column :min-width="ColumnMinWidth.blockListHeight" :label="$t('ExplorerLang.table.block')">
								<template slot-scope="scope">
									<router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
								</template>
							</el-table-column>
							<el-table-column class-name="address" v-if="productionConfig.blockList.proposer" :min-width="ColumnMinWidth.proposer" :label="$t('ExplorerLang.table.proposer')">
								<template slot-scope="scope">
										<span v-if="scope.row.proposerAddress !== '' && scope.row.proposerAddress !== '--'">
											<router-link class="common_link_style" :to="`/staking/${scope.row.proposerAddress}`">{{scope.row.proposerValue}}</router-link>
										</span>
										<span v-if="scope.row.proposerAddress === '' && scope.row.proposerValue">{{scope.row.proposerValue}}</span>
										<span v-if="scope.row.proposerAddress === '--'">--</span>
								</template>
							</el-table-column>
							<el-table-column :min-width="ColumnMinWidth.txn" prop="numTxs" :label="$t('ExplorerLang.table.transactions')"></el-table-column>
							<!-- <el-table-column v-if="productionConfig.blockList.validtors" :min-width="ColumnMinWidth.validatorValue" prop="validatorValue" :label="$t('ExplorerLang.table.validators')"></el-table-column> -->
							<!-- <el-table-column v-if="productionConfig.blockList.votingPower" :min-width="ColumnMinWidth.votingPowerValue" prop="votingPowerValue" :label="$t('ExplorerLang.table.votingPower')"></el-table-column> -->
							<el-table-column :min-width="ColumnMinWidth.time" prop="time" :label="$t('ExplorerLang.table.timestamp')"></el-table-column>
							<el-table-column :min-width="ColumnMinWidth.blockAge" prop="ageTime" :label="$t('ExplorerLang.table.age')"></el-table-column>
						</el-table>
					</div>
					<div class="pagination_content">
						<m-pagination :page-size="pageSize" :total="dataCount" :page="pageNumber" :page-change="pageChange"></m-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Tools from "../util/Tools"
	import MPagination from "./common/MPagination";
	import { getBlockList, getLatestBlock } from "../service/api";
	import { ColumnMinWidth } from '../constant';
	import productionConfig from '@/productionConfig.js';

	export default {
		name: "BlockList",
		components: {MPagination},
		data() {
			return {
				ColumnMinWidth,
				productionConfig,
				pageNumber: 1,
				pageSize: 20,
				dataCount: 0,
				latestBlockHeight:0,
				blockList: [],
				blockListTimer: null
			}
		},
		mounted () {
			this.getBlocks()
		},
		methods: {
			async getBlocks () {
				this.latestBlock();
				try {
					let blockData = await getBlockList(this.pageNumber, this.pageSize, true);
					if(blockData){
						this.dataCount = blockData.count;
						this.blockList = blockData.data.map( item => {
							return{
								proposerAddress:item.proposer_addr || '--',
								proposerValue: item.proposer_moniker || ( item.proposer_addr || '--'),
								// validatorValue: `${item.precommit_validator_num || 0} / ${item.total_validator_num || 0}`,
								// votingPowerValue: item.precommit_voting_power ? `${Tools.formatPerNumber((Number(item.precommit_voting_power) / item.total_voting_power) * 100)} %` : '--',
								height: item.height,
								time: Tools.getDisplayDate(item.time),
								Time: item.time,
								numTxs: item.txn,
								ageTime: Tools.formatAge(Tools.getTimestamp(),item.time*1000,"",">")
							}
						})
					}
					clearInterval(this.blockListTimer);
					this.blockListTimer = setInterval(() => {
						this.blockList.map(item => {
							item.ageTime = Tools.formatAge(Tools.getTimestamp(),item.Time*1000,"ago",">");
							return item
						})
					},1000)
				}catch (e) {
					console.error(e)
				}
			},
			async latestBlock(){
				try {
					let blockData = await getLatestBlock();
					if(blockData){
						this.latestBlockHeight = blockData.height;
					}
				}catch (e) {
					console.error(e)
				}				
			},
			pageChange(pageNum){
				if (this.pageNumber == pageNum) {return;}
				this.pageNumber = pageNum;
				this.getBlocks()
			}
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: $t_link_c !important;
	}
	.block_list_container{
		/*margin-top: 0.61rem;*/
        @media screen and (min-width: 910px){
            .block_list_content_wrap{
                max-width: 12.3rem;
            }
        }
        @media screen and (max-width: 910px){
            .block_list_content_wrap{
                // width:100%;
            }
        }
		.block_list_content_wrap{
			margin: 0 auto;
			.block_list_content{
                width:100%;
				.block_list_header_content{
                    width:100%;
                    padding:0 0.15rem;
                    box-sizing:border-box;
					.block_list_herder_top_content{
                        display: flex;
                        width:100%;
						.pagination_content{
							display: flex;
							justify-content: flex-end;
							margin: 0.3rem 0 0.1rem 0;
						}
					}
                    @media screen and (min-width: 910px){
                        .block_list_herder_top_content{

                            justify-content: space-between;
                            // align-items: center;
                            .pagination_content{
                                width:40%;
                            }
                        }
                    }
                    @media screen and (max-width: 910px){
                        .block_list_herder_top_content{
                            flex-direction:column;
                            .pagination_content{
                                width:100%;
								margin: -0.1rem 0 0.1rem 0;
                            }
                        }
                    }
					.block_list_pagination_content{


                        width:100%;
                        overflow-x: auto;
						.el-table{
							overflow-x: auto;
							.el-table__header-wrapper{
								/*position: fixed;*/
								/*z-index: 10;*/
							}
							/deep/ .el-table__body-wrapper {
								overflow: auto;
							}
						}
                        @media screen and (min-width: 910px) and (max-width: 1280px){
                            .el-table{
                                min-width:8rem;
                            }
                        }
                        @media screen and (max-width: 910px){
                            .el-table{
                                min-width:4rem;
                            }
                        }
					}


					.block_list_current_height_content{
						padding:0.3rem 0 0.16rem 0;
						text-align: left;
                        display:flex;
                        align-items: center;
						.block_list_current_height_title{
							color: $t_first_c;
							font-size: $s18;
							line-height: 0.21rem;
							font-weight: bold;
                            margin-right:0.1rem;
						}
						.block_list_current_height_number{
							a{
								font-size: $s18;
								font-weight: bold;
							}
						}
					}
					.pagination_content{
                        width:100%;
						display: flex;
						justify-content: flex-end;
						margin: 0.05rem 0 0.2rem 0;
					}
				}
			}
		}
	}
</style>
