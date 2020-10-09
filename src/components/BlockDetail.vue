<template>
	<div class="block_detail_container">
		<div class="block_detail_content_wrap">
			<!-- 标题 -->
			<div class="block_detail_header_content">
				 <span class="block_height_content">
                    <i :class="active?'flag_item_left':'flag_item_left_disabled'" class="iconfont iconshangyigequkuai" @click="skipNext(-1)"></i>
                        <span class="information_value" style="flex:none;">{{heightValue}}</span>
                    <i :class="activeNext?'flag_item_right':'flag_item_right_disabled'" class="iconfont iconxiayigequkuai" @click="skipNext(1)"></i>
                </span>
			</div>
			<!-- 区块基本信息 -->
			<div class="block_detail_content">
				<template v-if="!moduleSupport('107', prodConfig.navFuncList)">
					<div class="block_information_item">
						<span>{{$t('ExplorerLang.blockDetail.blockHash')}}</span>
						<span style="word-break: break-all;">{{blockHash}}</span>
					</div>
					<div class="block_information_item">
						<span>{{$t('ExplorerLang.blockDetail.transaction')}}</span>
						<span>{{txNumber}}</span>
					</div>
					<div class="block_information_item">
						<span>{{$t('ExplorerLang.blockDetail.timestamp')}}</span>
						<span>{{time}}</span>
					</div>
				</template>
				<template v-else>
					<div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.blockHash')}}</span>
                        <span>{{blockHashValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.proposer')}}</span>
                        <span v-if="proposerAddress !== ''&& proposerAddress !== '--'"><router-link class="common_link_style" :to="`/staking/${proposerAddress}`">{{proposerValue}}</router-link></span>
                        <span v-if="proposerAddress === '' && proposerValue">{{proposerValue}}</span>
                        <span v-if="proposerAddress === '--'">--</span>
                    </div>
                    <div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.validators')}}</span>
                        <span>{{validatorValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.votingPower')}}</span>
                        <span>{{votingPowerValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.transaction')}}</span>
                        <span>{{transactionsValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.inflation')}}</span>
                        <span>{{inflationValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>{{$t('ExplorerLang.blockDetail.timestamp')}}</span>
                        <span v-if="timestampValue">{{timestampValue}}</span>
                        <span v-if="!timestampValue">--</span>
                    </div>
				</template>
			</div>
			<!-- 区块交易 -->
			<div class="block_transaction_content" v-if="transactionArray.length > 0">
				<div class="block_transaction_title_content">{{$t('ExplorerLang.blockDetail.transactions')}}</div>
				<TxListComponent :txData="transactionArray"></TxListComponent>
			</div>
			<!-- Validator Set 表格 -->
            <div class="block_validator_set_container">
                <div class="block_validator_set_title">{{$t('ExplorerLang.blockDetail.validatorSet')}}</div>
                <div class="block_validator_set_content">
                    <m-block-information-table :items="validatorSetList" :showNoData="flValidatorNoData" :min-width="tableMinWidth"></m-block-information-table>
                    <div v-show="flValidatorNoData" class="no_data_show">
                        <img src="../assets/no_data.svg" alt="">
                    </div>
                </div>
                <div class="pagination" style='margin-top:0.2rem;margin-bottom: 0.2rem;' v-if="flShowValidatorListSetPagination">
                    <m-pagination :total="validatorSetListCount"
                                  :pageSize="pageSize"
                                  :page="validatorSetPageNum"
                                  :page-change="pageChangeValidatorSet">
                    </m-pagination>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
	import TxListComponent from "./common/TxListComponent";
	import { getBlockWithHeight, getLatestBlock, getBlockTxList } from '../service/api';
	import Tools from "../util/Tools";
  	import { TxHelper } from "../helper/TxHelper";
	import { TX_TYPE,TX_STATUS } from '../constant';
	import { moduleSupport } from "../helper/ModulesHelper";
	import prodConfig from "../productionConfig"
	import MBlockInformationTable from "./MBlockInformationTable";
	import MPagination from "./common/MPagination";
	import axios from 'axios'
	export default {
		name: "BlockDetail",
		components:{ TxListComponent,MBlockInformationTable,MPagination },
		data(){
			return {
				moduleSupport,
				prodConfig,
				TX_TYPE,
				TX_STATUS,
				blockHash: 0,
				txNumber:0,
				time:'',
				active: true,
				activeNext: true,
				maxBlock: 0,
				heightValue: '',
				transactionArray:[],

				blockHashValue: '',
				proposerValue: "",
				proposerAddress:'',
				validatorValue: null,
				votingPowerValue: '',
				transactionsValue: '',
				inflationValue: null,
				timestampValue: '',
				validatorSetList: [],
				flValidatorNoData: false,
				tableMinWidth:"",
				flShowValidatorListSetPagination: false,
				validatorSetListCount: 0,
				pageSize: 10,
				validatorSetPageNum:1,
			}
		},
		watch:{
			$route() {
				this.getBlockInformation();
				this.getTransactionList();
				this.latestBlock()
				this.computeMinWidth();
				if (Number(this.$route.params.height) <= 1) {
					this.active = false;
				} else {
					this.active = true;
				}
				if (this.maxBlock !== 0) {
					if (Number(this.$route.params.height) >= this.maxBlock) {
						this.activeNext = false;
					} else {
						this.activeNext = true;
					}
				}
			},
			validatorSetListCurrentPage(validatorSetListCurrentPage){
                this.getValidatorSetList(validatorSetListCurrentPage,this.pageSize,this.$route.params.height)
            },
		},
		mounted () {
			this.getBlockInformation();
			this.getTransactionList();
			this.latestBlock()
			if (Number(this.$route.params.height) > 1) {
				this.active = true;
				this.activeNext = true;
			} else {
				this.active = false;
				this.activeNext = false
			}
			this.computeMinWidth();
			this.getValidatorSetList(this.validatorSetListCurrentPage,this.pageSize,this.$route.params.height);
		},
		methods:{
			async latestBlock(){
				try {
					let blockData = await getLatestBlock();
					if(blockData){
						this.getMaxBlock(blockData.height);
					}
				}catch (e) {
					console.error(e)
				}				
			},
			async getBlockInformation(){
				if(!moduleSupport('107', prodConfig.navFuncList)) {
					try {
						let blockData = await getBlockWithHeight(this.$route.params.height);
						if(blockData){
							this.heightValue = blockData.height;
							this.blockHash = blockData.hash;
							this.txNumber = blockData.txn;
							this.time = Tools.getDisplayDate(blockData.time);
						}
					}catch (e) {
						console.error(e)
					}
				} else {
					const { data:result } = await axios.get(`https://www.irisplorer.io/api/block/blockinfo/${this.$route.params.height}`)
					try {
						if (result) {
							// 联动
							// this.getTxListByTxCount(result.transactions);
							this.transactionsValue = result.transactions;
							this.heightValue = result.block_height;
							this.validatorValue = `${result.precommit_validator_num !== null ? result.precommit_validator_num : '--'} / ${result.total_validator_num ? result.total_validator_num : '--'}`;
							this.votingPowerValue = result.precommit_voting_power !== null ? `${((result.precommit_voting_power / result.total_voting_power) *100).toFixed(4)} %` : '--';
							this.timestampValue = Tools.format2UTC(result.timestamp);
							this.blockHashValue = result.block_hash;
							this.proposerValue = result.propopser_moniker ? result.propopser_moniker : '--';
							this.proposerAddress = result.propopser_addr;
							this.inflationValue = result.mint_coin.denom !== '' ? `${Tools.formatPriceToFixed(Tools.convertScientificNotation2Number(Tools.formatNumber(result.mint_coin.amount)))} ${Tools.formatDenom(result.mint_coin.denom)}` : '--';
							// this.precommitValidatorsValue = result.validator_num !== 0 ? result.validator_num : '--';
							this.getMaxBlock(result.latest_height)
						} else {
							this.validatorValue= '--';
							this.proposerAddress = '--';
							this.inflationValue = '--';
							this.heightValue = '';
							this.timestampValue = '';
							this.blockHashValue = '--';
							this.transactionsValue = '--';
							// this.precommitValidatorsValue = '--';
							this.votingPowerValue = '--';
						}
					}catch (e) {
						console.error(e);
						this.validatorValue= '--';
						this.proposerAddress = '--';
						this.inflationValue = '--';
						this.heightValue = '';
						this.timestampValue = '';
						this.blockHashValue = '--';
						this.transactionsValue = '--';
						// this.precommitValidatorsValue = '--';
						this.votingPowerValue = '--';
					}

					// Service.commonInterface({blockInfoHeight:{height: this.$route.params.height}}, (result) => {
					// 	try {
					// 		if (result) {
					// 			this.getTxListByTxCount(result.transactions);
					// 			this.transactionsValue = result.transactions;
					// 			this.heightValue = result.block_height;
					// 			this.validatorValue = `${result.precommit_validator_num !== null ? result.precommit_validator_num : '--'} / ${result.total_validator_num ? result.total_validator_num : '--'}`;
					// 			this.votingPowerValue = result.precommit_voting_power !== null ? `${((result.precommit_voting_power / result.total_voting_power) *100).toFixed(4)} %` : '--';
					// 			this.timestampValue = Tools.format2UTC(result.timestamp);
					// 			this.blockHashValue = result.block_hash;
					// 			this.proposerValue = result.propopser_moniker ? result.propopser_moniker : '--';
					// 			this.proposerAddress = result.propopser_addr;
					// 			this.inflationValue = result.mint_coin.denom !== '' ? `${Tools.formatPriceToFixed(Tools.convertScientificNotation2Number(Tools.formatNumber(result.mint_coin.amount)))} ${Tools.formatDenom(result.mint_coin.denom)}` : '--';
					// 			this.precommitValidatorsValue = result.validator_num !== 0 ? result.validator_num : '--';
					// 			this.getMaxBlock(result.latest_height)
					// 		} else {
					// 			this.validatorValue= '--';
					// 			this.proposerAddress = '--';
					// 			this.inflationValue = '--';
					// 			this.heightValue = '';
					// 			this.timestampValue = '';
					// 			this.blockHashValue = '--';
					// 			this.transactionsValue = '--';
					// 			this.precommitValidatorsValue = '--';
					// 			this.votingPowerValue = '--';
					// 		}
					// 	}catch (e) {
					// 		console.error(e);
					// 		this.validatorValue= '--';
					// 		this.proposerAddress = '--';
					// 		this.inflationValue = '--';
					// 		this.heightValue = '';
					// 		this.timestampValue = '';
					// 		this.blockHashValue = '--';
					// 		this.transactionsValue = '--';
					// 		this.precommitValidatorsValue = '--';
					// 		this.votingPowerValue = '--';
					// 	}
					// });
				}

			},
			getMaxBlock(latestHeight) {
				this.maxBlock = latestHeight;
				if (Number(this.$route.params.height) >= Number(latestHeight)) {
					this.activeNext = false;
				} else {
					this.activeNext = true;
				}
			},
			async getTransactionList(){
                try {
                    const res = await getBlockTxList(this.$route.params.height);
                    if(res){
                        this.transactionArray = res.data;
                    }
                }catch (e) {
                		console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
			},
			skipNext(num) {
				if(Number(this.$route.params.height) >= 1){
					if (Number(this.$route.params.height) <= 1) {
						this.active = false;
						if (num !== -1) {
							this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
						}
					} else if (Number(this.$route.params.height) >= this.maxBlock) {
						if (num !== 1) {
							this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
						}
					} else {
						this.active = true;
						this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
					}
				}
			},
			formatTxHash(TxHash){
				if(TxHash){
					return Tools.formatTxHash(TxHash)
				}
			},
			formatAddress(address){
				return Tools.formatValidatorAddress(address)
			},
			pageChange(pageNum) {
				this.pageNum = pageNum;
				this.getTxByAddress();
			},
			computeMinWidth(){
                if(this.$route.params.height){
                    this.tableMinWidth = 8.8;
                }
			},
			async getValidatorSetList(){		
				const { data:validatorSetList } = await axios.get(`https://www.irisplorer.io/api/block/validatorset/${this.$route.params.height}?page=${this.validatorSetPageNum}&size=${this.pageSize}`)
				try {
					this.handleValidatorSetList(validatorSetList)
				}catch (e) {
					console.error(e);
					this.handleValidatorSetList(null)
				}

                // Service.commonInterface({blockInfoValidatorSet:{
		        //         blockHeight: this.$route.params.height,
		        //         currentPage: this.validatorSetPageNum,
		        //         pageSize: this.pageSize,
                //     }},(validatorSetList) => {
                // 	try {
		        //         this.handleValidatorSetList(validatorSetList)
	            //     }catch (e) {
		        //         console.error(e);
		        //         this.handleValidatorSetList(null)
	            //     }
                // });
			},
			handleValidatorSetList(validatorList){
                if(validatorList && validatorList.items && validatorList.items.length !== 0){
	                this.flValidatorNoData = false;
                    this.validatorSetListCount = validatorList.total;
                    if(validatorList.total > this.pageSize){
                        this.flShowValidatorListSetPagination = true
                    }else {
                        this.flShowValidatorListSetPagination = false
                    }
                    this.validatorSetList = validatorList.items.map( validator => {
                        return{
                            'moniker' : Tools.formatString(validator.moniker,15,'...'),
                            'OperatorAddress' : validator.operator_address,
                            'Consensus': validator.consensus,
                            'ProposerPriority': validator.proposer_priority,
                            'VotingPower' : validator.voting_power,
                            'flProposer' : validator.is_proposer
                        }
                    })
                }else {
                    this.flValidatorNoData = true;
                    this.validatorSetList = [
                        {
                            'Moniker' : '',
                            'OperatorAddress' : '',
                            'Consensus': '',
                            'ProposerPriority': '',
                            'VotingPower' : '',
	                        'flProposer': ''
                        }
                    ]
                }
			},
			pageChangeValidatorSet(pageNum){
	        	this.validatorSetPageNum = pageNum;
	        	this.getValidatorSetList()
            },
		}
	}
</script>

<style scoped lang="scss">
	.block_detail_container{
		a {
			color: $t_link_c !important;
		}
		padding: 0 0.15rem;
		.block_detail_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.block_detail_header_content{
				margin: 0.3rem 0 0.1rem 0;
				text-align: left;
				padding-left: 0.2rem;
				.block_height_content{
					.information_value{
						font-size: $s22;
						color: $t_second_c;
						margin: 0 0.07rem;
					}
					.flag_item_left {
						display: inline-block;
						font-size: $s20;
						margin-right: 0.05rem;
						cursor: pointer;
						color: $t_link_c !important;
					}
					.flag_item_left_disabled {
						display: inline-block;
						font-size: $s20;
						margin-right: 0.05rem;
						cursor: pointer;
						color: $t_second_c;
					}
					.flag_item_right {
						display: inline-block;
						font-size: $s20;
						margin-left: 0.05rem;
						color: $t_link_c;
						cursor: pointer;
					}
					.flag_item_right_disabled {
						display: inline-block;
						font-size: $s20;
						color: $t_second_c;
						margin-left: 0.05rem;
						cursor: pointer;
					}
				}
			}
			.block_detail_content{
				padding: 0.2rem;
				box-sizing: border-box;
				background: $bg_white_c;
				.block_information_item{
					display: flex;
					margin-bottom: 0.16rem;
					span:nth-of-type(1){
						text-align: left;
						color: $t_second_c;
						font-size: $s14;
						min-width: 1.5rem;
					}
					span:nth-of-type(2){
						text-align: left;
						color: $t_first_c;	
						font-size: $s14;
						flex: 1;
						.common_link_style{
                            color: $theme_c !important;
                        }
					}
				}
				.block_information_item:last-child{
					margin-bottom: 0;
				}
			}
			.block_transaction_content{
				.block_transaction_title_content{
					font-size: $s18;
					font-weight: bold;
					margin: 0.3rem 0 0.1rem 0;
					text-align: left;
					text-indent: 0.2rem;
				}
				.tx_transaction_content_hash{
            display: flex;
            align-items: center;
        }
			}
			.status_icon{
				width:0.13rem;
				height:0.13rem;
				margin-right:0.05rem;
	    	}
			.block_validator_set_container{
				padding-bottom: 0.01rem;
                .block_validator_set_title{
                    height: 0.65rem;
                    display: flex;
                    align-items: center;
                    padding-left: 0.2rem;
                    color: $t_first_c
                }
                .block_validator_set_content{
                    background: #fff;
                    overflow-x: auto;
                    overflow-y: hidden;
                    .no_data_show{
                        display: flex;
                        min-height: 2rem;
                        img{
                            width: 1.5rem;
                        }
					}
					/deep/ .m-table-header {
						width: 12rem !important;
					}
					/deep/ table.m_table {
						min-width: 12rem !important;
						text-align: left;
					}
					
                }
                .pagination{
                    display: flex;
                    justify-content: flex-end;
                }
			}
		}
	}


@media screen and (max-width: 768px) {
	.block_detail_container{
		.block_detail_content_wrap{
			.block_detail_header_content{
				.block_height_content{
					.information_value{
						
					}
					.flag_item_left {
						
					}
					.flag_item_left_disabled {
						
					}
					.flag_item_right {
						
					}
					.flag_item_right_disabled {
						
					}
				}
			}
			.block_detail_content{
				
				.block_information_item{
					
					span:nth-of-type(1){
						min-width: 1rem;
					}
					span:nth-of-type(2){
						
					}
				}
				.block_information_item:last-child{
					
				}
			}
			.block_transaction_content{
				.block_transaction_title_content{
					
				}
			}
		}
	}
}
</style>
