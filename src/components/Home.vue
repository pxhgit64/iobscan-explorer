<template>
	<div class="home_container">
		<div class="home_content_wrap">
			<div class="home_content_header_content">
				<ul class="home_content_header_top_content">
					<li class="home_content_header_top_item_content" v-show="(prodConfig.homeCard || {}).lestBlock">
						<p class="home_content_header_top_item_title"><i class="iconfont iconBlocks"></i>{{$t('ExplorerLang.home.blockHeight')}}</p>
						<p class="home_content_header_top_center_content"><router-link :to="`block/${block_height}`">{{block_height}}</router-link></p>
						<p class="home_content_header_top_footer_content"></p>
					</li>
					<li class="home_content_header_top_item_content" v-show="(prodConfig.homeCard || {}).txCount">
						<p class="home_content_header_top_item_title"><i class="iconfont iconTransactions"></i>{{$t('ExplorerLang.home.transactions')}}</p>
						<p class="home_content_header_top_center_content"><router-link :to="`/txs`">{{transactionNumber}}</router-link></p>
						<p class="home_content_header_top_footer_content">{{transactionTime}}</p>
					</li>
					<li class="home_content_header_top_item_content" v-show="(prodConfig.homeCard || {}).avgBlockTime">
						<p class="home_content_header_top_item_title"><i class="iconfont iconAvgBlockTime"></i>{{$t('ExplorerLang.home.avgBlockTime')}}</p>
						<p class="home_content_header_top_center_content">{{`${ageTime} ${$t('ExplorerLang.unit.second')}`}}</p>
						<p class="home_content_header_top_footer_content">{{$t('ExplorerLang.home.last100Blocs')}}</p>
					</li>
				</ul>
				<ul class="home_content_header_bottom_content" >
					<li class="home_content_header_bottom_item_content" v-show="(prodConfig.homeCard || {}).validatorCount">
						<p class="home_content_header_bottom_title"><i class="iconfont iconVotingPower"></i>{{$t('ExplorerLang.home.validators')}}</p>
						<p class="home_content_header_bottom_footer">{{validatorNumber}}</p>
					</li>
					<li class="home_content_header_bottom_item_content" v-show="(prodConfig.homeCard || {}).serviceCount">
						<p class="home_content_header_bottom_title"><i class="iconfont iconservice"></i>{{$t('ExplorerLang.home.services')}}</p>
						<p class="home_content_header_bottom_footer">
							<router-link v-if="serverNumber" :to="`/services`">{{serverNumber}}</router-link>
							<span v-else >--</span>
						</p>
					</li>
					<li class="home_content_header_bottom_item_content" v-show="(prodConfig.homeCard || {}).assetCount">
						<p class="home_content_header_bottom_title"><i class="iconfont iconAssets"></i>{{$t('ExplorerLang.home.assets')}}</p>
						<p class="home_content_header_bottom_footer"><router-link :to="`/nftAsset`">{{assetsNumber}}</router-link></p>
					</li>
				</ul>
			</div>
			<div class="home_block_and_transaction_content">
				<div class="home_block_content">
					<div class="home_block_top_content">
						<div class="home_block_top_title">
							<i class="iconfont iconBlocks"></i>
							<span>{{$t('ExplorerLang.home.blocks')}}</span>
						</div>
						<div class="home_block_view_all">
							<router-link :to="`/blocks`">{{$t('ExplorerLang.home.viewAll')}}</router-link>
						</div>
					</div>
					<ul class="home_block_bottom_content">
						<div v-for="item in latestBlockArray" :class="item.flShowTranslationalAnimation ? 'animation ' : '' ">
							<li class="home_block_list_item_content"
							    :class="item.showAnimation === 'show' ? 'fadeIn_animation' : '' ">
								<p class="home_block_time_content">
									<router-link  class="home_block" :to="`block/${item.height}`">{{item.height}}</router-link>
									<span class="home_age_time"> {{item.blockAgeTime}}</span>
								</p>
								<p class="home_tx_time_content">
									<span class="home_tx">{{$t('ExplorerLang.home.txn')}}: <span>{{item.txNumber}}</span></span>
									<span class="home_time">{{item.time}}</span>
								</p>
							</li>
						</div>
					
					</ul>
				</div>
				<div class="home_transaction_content">
					<div class="home_transaction_top_content">
						<div class="home_transaction_top_title">
							<i class="iconfont iconTransactions"></i>
							<span>{{$t('ExplorerLang.home.listTransactions')}}</span>
						</div>
						<div class="home_transaction_view_all">
							<router-link :to="`/txs`">{{$t('ExplorerLang.home.viewAll')}}</router-link>
						</div>
					</div>
					<ul class="home_transaction_bottom_content">
						<li class="home_transaction_list_item_content" v-for="item in latestTransaction">
							<p class="home_transaction_time_content">
								<span class="home_transaction" >
									{{$t('ExplorerLang.home.tx')}}<router-link :to="`/tx?txHash=${item.hash}`">{{`${item.hash.substr(0,16)}...`}}</router-link>
								</span>
								<span class="home_age_time">{{item.txAgeTime}}</span>
							</p>
							<p class="home_tx_type_content">
								<span class="home_tx_type">{{item.txType}}</span>
								<span class="home_tx_time">{{item.time}}</span>
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Tools from "../util/Tools";
	import prodConfig from "../productionConfig"
	import { getStatistics, getBlockList } from "../service/api";
	import {getTxList} from "../service/api";
	import { TX_TYPE,TX_STATUS } from '../constant';

    export default {
		name: "Home",
		data () {
			return {
				prodConfig:prodConfig,
				TX_TYPE,
				TX_STATUS,
				block_height: 0,
				transactionNumber: 0,
				transactionTime:"",
				ageTime:"",
				validatorNumber: 0,
				userNumber: 0,
				assetsNumber: 0,
				serverNumber:0,
				syncTimer:null,
				latestBlockArray:[],
				latestTransaction:[],
				blocksTimer: null,
				transfersTimer:null,
			}
		},
		mounted () {
			this.getNavigation();
			this.getLastBlocks();
			this.getTransaction();
			clearInterval(this.syncTimer )
			this.syncTimer = setInterval(() => {
				this.getNavigation();
				this.getLastBlocks();
				this.getTransaction();
			},5000)
		},
		watch:{
			latestBlockArray(latestBlockArray){
				setTimeout( () => {
					latestBlockArray.forEach( item => {
						if(item.showAnimation){
							item.showAnimation = " "
						}
					})
				},1000)
			}
		},
		methods:{
			async getNavigation(){
				try{
					let statistics = await getStatistics();
					if(statistics){
						this.block_height = statistics.blockHeight;
						this.transactionNumber = statistics.txCount;
						this.validatorNumber = statistics.validatorCount;
						this.transactionTime = Tools.getDisplayDate(statistics.latestBlockTime);
						this.ageTime = statistics.avgBlockTime;
						this.assetsNumber = statistics.assetCount;
						this.serverNumber = statistics.serviceCount;
					}
				}catch(err){
					console.error(err);
				}
			},
			async getLastBlocks(){
				try{
					let blockData = await getBlockList(1, 10, false);
					if(blockData && blockData.data && blockData.data.length){
							let blocks = blockData.data;
							this.showBlockFadeinAnimation(blocks);
							let that = this;
							setTimeout( ()=> {
								that.latestBlockArray.map(item => {
									return item.flShowTranslationalAnimation = false
								})
							},1000);
							sessionStorage.setItem("lastBlockHeight",blocks[0].height);
							this.latestBlockArray = blocks.map(item => {
								return {
									flShowTranslationalAnimation :  item.flShowTranslationalAnimation ? item.flShowTranslationalAnimation : "",
									showAnimation: item.showAnimation ? item.showAnimation : "",
									height: item.height,
                                    time: Tools.getDisplayDate(item.time),
                                    Time: item.time,
									txNumber: item.txn,
									blockAgeTime: Tools.formatAge(Tools.getTimestamp(),item.time*1000,"ago",">")
								}
							});
							clearInterval(this.blocksTimer)
							this.blocksTimer = setInterval( () => {
								that.latestBlockArray = that.latestBlockArray.map(item => {
									item.blockAgeTime = Tools.formatAge(Tools.getTimestamp(),item.Time*1000,"ago",">");
									return item
								})
							},1000)
						}
				}catch(err){
					console.error(err);
				}
			},
			async getTransaction(){
                const params = {
                    pageNum:1,
                    pageSize:10,
                };
                try {
                    const res = await getTxList(params);
                    // console.log('tx list:',res)
                    if(res){
                        for (let txIndex = 0; txIndex < res.data.length; txIndex++){
                            let lastTxTime = Tools.getTimestamp();
                            if(sessionStorage.getItem("lastTxTime")){
                                lastTxTime = JSON.parse(sessionStorage.getItem("lastTxTime"));
                            }
                            if(res.data[txIndex].time > lastTxTime){
                                res.data[txIndex].showAnimation = "show";
                                res.data.forEach(item => {
                                    item.flShowTranslationalAnimation = true
                                })
                            }
                        }
                        setTimeout(()=> {
                            this.latestTransaction.map(item => {
                                return item.flShowTranslationalAnimation = false
                            })
                        },1000);
                        sessionStorage.setItem('lastTxTime',JSON.stringify(Tools.getTimestamp()));
                        this.latestTransaction = res.data.map(item => {
                            return {
                                flShowTranslationalAnimtation :  item.flShowTranslationalAnimation ? item.flShowTranslationalAnimation : "",
                                showAnimation: item.showAnimation ? item.showAnimation : '',
                                hash: item.tx_hash,
                                time: Tools.getDisplayDate(item.time),
                                txType: item.type,
                                Time: item.time,
                                txAgeTime: Tools.formatAge(Tools.getTimestamp(),item.time*1000,"ago",">")
                            }
                        });
                        clearInterval(this.transfersTimer);
                        this.transfersTimer = setInterval(()=> {
                            this.latestTransaction = this.latestTransaction.map(item => {
                                item.txAgeTime = Tools.formatAge(Tools.getTimestamp(),item.Time*1000,"ago",">");
                                return item
                            })
                        },1000)
                    }
                }catch (e) {
                    //this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                    console.error(e);
                }
			},
			showBlockFadeinAnimation (blockList) {
				let storedLastBlockHeight = sessionStorage.getItem('lastBlockHeight') ? sessionStorage.getItem('lastBlockHeight') : '';
				if(storedLastBlockHeight){
					for(let index = 0; index < blockList.length; index++){
						if(blockList[index].height > storedLastBlockHeight){
							blockList.forEach(item => {
								item.flShowTranslationalAnimation = true
							});
							blockList[index].showAnimation = "show";
						}
					}
				}
			},
			componentAgeTime(beginTime,endTime){
				return ((Number(new Date(beginTime).getTime()) - Number(new Date(endTime).getTime())) /1000/ 100).toFixed(2)
			}
		},
		destroyed () {
			clearInterval(this.blocksTimer);
			clearInterval(this.transfersTimer);
			clearInterval(this.syncTimer )
		}
	}
</script>

<style scoped lang="scss">
	a {
		color: $t_link_c !important;
	}
	.home_container{
		.home_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			padding:0 0.15rem;
			.home_content_header_content{
				display: flex;
				flex-direction: column;
				.home_content_header_top_content{
					display: flex;
					margin-top: 0.3rem;
					.home_content_header_top_item_content{
						flex: 1;
						max-width:32.3%;
						margin:0 0.2rem 0 0;
						border-radius: 0.04rem;
						border: 0.01rem solid $bd_second_c;
						background: $bg_white_c;
						text-align: left;
						box-sizing: border-box;
						padding: 0.14rem;
						font-size: $s14;
						i{
							color: $theme_c;
							margin-right: 0.1rem;
						}
						.home_content_header_top_center_content{
							font-size: $s20;
							margin-top: 0.35rem;
						}
						.home_content_header_top_footer_content{
							font-size: $s10;
							color: $t_second_c;
							margin-top: 0.1rem;
						}
					}
					.home_content_header_top_item_content:first-child{
						// margin-left: 0;
					}
					.home_content_header_top_item_content:last-child{
						margin-right: 0;
					}
				}
				.home_content_header_bottom_content{
					display: flex;
					margin-top: 0.2rem;
					.home_content_header_bottom_item_content{
						flex: 1;
						max-width:32.3%;
						margin:0 0.2rem 0 0;
						border-radius: 0.04rem;
						border: 0.01rem solid $bd_second_c;
						background: $bg_white_c;
						text-align: left;
						box-sizing: border-box;
						padding: 0.14rem;
						font-size: $s14;
						i{
							color: $theme_c;
							margin-right: 0.1rem;
						}
						.home_content_header_bottom_footer{
							margin-top: 0.35rem;
							color: $t_first_c;
							font-size: $s20;
							line-height: 0.23rem;
							a{
								color: $t_link_c;
							}
						}
					}
					.home_content_header_bottom_item_content:first-child{
						// margin-left: 0;
					}
					.home_content_header_bottom_item_content:last-child{
						margin-right: 0;
					}
				}
			}
			.home_block_and_transaction_content{
				display: flex;
				margin: 0.2rem 0 1rem 0;
				.home_block_content{
					flex: 1;
					margin-right: 0.2rem;
					box-sizing: border-box;
					padding: 0.27rem 0.25rem 0.18rem 0.25rem;
					background: $bg_white_c;
					.home_block_top_content{
						display: flex;
						justify-content: space-between;
						background: $bg_white_c;
						z-index: 2;
						.home_block_top_title{
							i{
								color: $theme_c;
								margin-right: 0.1rem;
							}
							span{
								color: $t_first_c;
								font-size: $s16;
								font-weight: bold;
							}
						}
						.home_block_view_all{
							font-size: $s14;
							a{
								color: $t_link_c;
							}
							border-bottom: 0.01rem solid $t_link_c;
							
						}
					}
					.home_block_bottom_content{
						margin-top: 0.24rem;
						border-top: 0.01rem solid $bd_third_c;
						font-size: $s14;
						color: $t_second_c;
						.home_block_list_item_content{
							display: flex;
							flex-direction: column;
							padding: 0.15rem 0;
							border-bottom: 0.01rem solid $bd_third_c;
							.home_block_time_content{
								display: flex;
								justify-content: space-between;
								.home_block{
									a{
										color: $t_link_c ;
									}
								}
							}
							.home_tx_time_content{
								margin-top: 0.07rem;
								display: flex;
								justify-content: space-between;
								.home_tx{
									span{
										color: $t_first_c;
									}
								}
							}
						}
						.animation{
							animation:translational_animation 1.1s infinite;
						}
					}
					
				}
				.home_transaction_content{
					flex: 1;
					box-sizing: border-box;
					padding: 0.27rem 0.25rem 0.18rem 0.25rem;
					background: $bg_white_c;
					.home_transaction_top_content{
						display: flex;
						justify-content: space-between;
						.home_transaction_top_title{
							i{
								color: $theme_c;
								margin-right: 0.1rem;
							}
							span{
								color: $t_first_c;
								font-size: $s16;
								font-weight: bold;
							}
						}
						.home_transaction_view_all{
							font-size:$s14;
							a{
								color: $t_link_c;
							}
							border-bottom: 0.01rem solid $t_link_c;
							
						}
					}
					.home_transaction_bottom_content{
						margin-top: 0.24rem;
						border-top: 0.01rem solid $bd_third_c;
						font-size: $s14;
						color: $t_second_c;
						.home_transaction_list_item_content{
							display: flex;
							flex-direction: column;
							padding: 0.15rem 0;
							border-bottom: 0.01rem solid $bd_third_c;
							.home_transaction_time_content{
								display: flex;
								justify-content: space-between;
								.home_transaction{
									font-size: $s14;
									color: $t_first_c;
									font-weight: bold;
									a{
										padding-left: 0.05rem;
										font-weight: lighter;
										color: $t_link_c ;
									}
								}
							}
							.home_tx_type_content{
								margin-top: 0.07rem;
								display: flex;
								justify-content: space-between;
							}
						}
					}
				}
			}
		}
	}
	.fadeIn_animation{
		animation: fadeIn 1s 1 0s;
	}
	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes translational_animation{
		from{transform: translateY(-0.59rem);}
		to{transform: translateY(0)}
	}

	@media screen and (max-width: 1000px) {
		.home_container{
			.home_content_wrap{
				.home_content_header_content{
					.home_content_header_top_content{
						margin-top: 0.05rem;
						flex-direction:column;
						height:auto;
						.home_content_header_top_item_content{
							width:100%;
							max-width:100%;
							padding: 0.14rem;
							margin:0.05rem 0;
							.home_content_header_top_center_content{
								margin-top: 0.2rem;
							}
						}
						
						.home_content_header_top_item_content:last-child{
						
						}
					}
					.home_content_header_bottom_content{
						margin-top: 0rem;
						height:auto;
						flex-direction:column;
						.home_content_header_bottom_item_content{
							width:100%;
							max-width:100%;
							padding: 0.14rem;
							margin:0.05rem 0;
							.home_content_header_bottom_footer{
								margin-top: 0.2rem;
							}
						}
						
						.home_content_header_bottom_item_content:last-child{
						
						}
					}
				}
				.home_block_and_transaction_content{
					flex-direction:column;
					.home_block_content{
						margin-right: 0rem;
						.home_block_top_content{
							.home_block_top_title{
								i{
								
								}
								span{
								
								}
							}
							.home_block_view_all{
								a{

								}
							}
						}
						.home_block_bottom_content{
							
							.home_block_list_item_content{
								
								.home_block_time_content{
									
									.home_block{
										a{
										
										}
									}
								}
								.home_tx_time_content{
									
									.home_tx{
										span{
										
										}
									}
								}
							}
							.animation{
							
							}
						}
						
					}
					.home_transaction_content{
						margin-top:0.2rem;
						.home_transaction_top_content{
							
							.home_transaction_top_title{
								i{
								
								}
								span{
								
								}
							}
							.home_transaction_view_all{
								a{
								
								}
								
								
							}
						}
						.home_transaction_bottom_content{
							
							.home_transaction_list_item_content{
								
								.home_transaction_time_content{
									
									.home_transaction{
										
										a{
										
										}
									}
								}
								.home_tx_type_content{
								
								}
							}
						}
					}
				}
			}
		}
	}

</style>
