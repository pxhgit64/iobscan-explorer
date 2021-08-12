<template>
	<div class="validator_detail_scatter_container">
		<div class="validator_detail_scatter_content_wrap">
			<!-- 散点图 -->
			<div id="validator_detail_scatter_content"></div>
		</div>
		<div class="validator_chart_tip">
			<!-- 提示信息 左侧 -->
			<p class="current_chart_tip">
				<span class="current_chart_color_block" :style="{background:tipColor}"></span>
				<span class="current_moniker">{{currentMoniker}}</span>
			</p>
			<!-- 提示信息 右侧 -->
			<p class="other_chart_tip">
				<span class="other_chart_color_block"></span>
				<span>{{ $t('ExplorerLang.validatorDetail.commissionInfo.scatter.otherValidator') }}</span>
			</p>
		</div>
	</div>
</template>

<script>
	import Tools from "../../util/Tools.js"
	import productionConfig from '@/productionConfig.js';
	import Constant,{ validator_Status,product } from "../../constant/index.js"
	import bigNumber from "bignumber.js"
	import { getValidatorCommissionInfoApi } from "@/service/api"
	import { getMainToken,converCoin } from '@/helper/IritaHelper';
	var echarts = require('echarts/lib/echarts');
	require('echarts/lib/component/legend');
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
	require('echarts/lib/chart/scatter');
	require('echarts/lib/component/legendScroll');
	export default {
		name: "ValidatorDetailScatter",
		props:{
			jailedData:{
				type:Object
			},
			validatorStatus:{
				type:String
			}
		},
		data () {
			return {
				otherValidatorBondedTokenArr:[],
				currentValidatorBondedTokenArr:[],
				mainnetThemeStyle:["#3264FD","#FF5C01"],
				testnetFuXiThemeStyle:["#0C4282","#FF5C01"],
				testnetNyancatThemeStyle:["#0D9388","#FF5C01"],
				defaultThemeStyle:["#0580D3","#FF5C01"],
				defaultJailedThemeStyle:["#0580D3","#101149"],
				mainnetJailedThemeStyle:['#3264FD',"#101149"],
				testnetFuXiJailedThemeStyle:['#0C4282',"#101149"],
				testnetNyancatJailedThemeStyle:['#0D9388',"#101149"],
				stargateThemeStyle:["#6958CA","#FF5C01"],
				stargateJailedThemeStyle:['#6958CA',"#101149"],
				chartOptionColor:'',
				currentMoniker:'',
				tipColor:'',
				validator_Status
			}
		},
		watch:{
			validatorStatus: {
				handler() {
					if(this.validatorStatus === this.validator_Status.jailed || this.validatorStatus === this.validator_Status.candidate){
						this.tipColor = "#101149"
					}else {
						this.tipColor = "#FF5C01"
					}
				},
				immediate:true
			}
		},
		mounted () {
			let getJailedData = new Promise((resolve,reject)=>{
				resolve (this.jailedData);
				reject('props data is empty')
			});
			getJailedData.then((data) => {
				if(data){
					this.getValidatorCommissionInfo()
				}
			}).catch(e => {
				console.error(e)
			});
			setTimeout(() => {
				this.getValidatorCommissionInfo()
			},300)
		},
		methods:{
			async initCharts(){
				let mainToken = await getMainToken();
				let itemStyle = {
					opacity: 0.4,
					shadowOffsetX: 0,
					shadowOffsetY: 0,
				};
				let echartsData = echarts.init(document.getElementById('validator_detail_scatter_content'));
				let echartsOption = {
					backgroundColor: '#fff',
					legendHoverLink:true,
					emphasis:{
						itemStyle:{
							opacity: 1,
						}
					},
					grid: {
						left: '19%',
						right: 150,
						top: '18%',
						bottom: '10%'
					},
					tooltip: {
						padding: 10,
						backgroundColor: '#222',
						borderColor: '#777',
						borderWidth: 1,
						formatter:  (obj) => {
							let value = obj.value;
							return `<div class='tooltip'>
										<p>${value[2]}</p>
										<p>${this.$t('ExplorerLang.validatorDetail.commissionInfo.scatter.tooltip.commissionRate')}:${value[0]}%</p>
										<p>${this.$t('ExplorerLang.validatorDetail.commissionInfo.scatter.tooltip.bondedTokens')}:<br/>${new bigNumber(value[1]).toFormat()} ${mainToken.symbol.toUpperCase()}</p>
										</div>`
						}
					},
					xAxis: {
						type: 'value',
						name:this.$t('ExplorerLang.validatorDetail.commissionInfo.scatter.xAxis'),
						nameLocation:'end',
						nameGap: 6,
						nameTextStyle: {
							color: '#787C99',
							fontSize: 14
						},
						splitLine: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#a2a2ae'
							}
						}
					},
					yAxis: {
						type: 'value',
						name:`${this.$t('ExplorerLang.validatorDetail.commissionInfo.scatter.yAxis')} (${mainToken.symbol.toUpperCase()})`,
						nameLocation: 'end',
						nameGap: 20,
						nameTextStyle: {
							color: '#787C99',
							fontSize: 14
						},
						axisLine: {
							lineStyle: {
								color: '#a2a2ae'
							}
						},
						splitLine: {
							show: false
						}
					},
					series: [
						{
							type: 'scatter',
							itemStyle: itemStyle,
							data: this.otherValidatorBondedTokenArr
						},
						{
							type: 'scatter',
							itemStyle: itemStyle,
							data: this.currentValidatorBondedTokenArr
						}
					]
				};
				if(this.validatorStatus === this.validator_Status.active){
					switch (productionConfig.product) {
						case product.stargate:
							echartsOption.color = this.stargateThemeStyle
							break;
						default:
							echartsOption.color = this.mainnetThemeStyle
							break;
					}
				}else {
					switch (productionConfig.product) {
						case product.stargate:
							echartsOption.color = this.stargateJailedThemeStyle
							break;
						default:
							echartsOption.color = this.mainnetJailedThemeStyle
							break;
					}
				}
				echartsData.setOption(echartsOption)
			},
			async getValidatorCommissionInfo(){
				try {
					const res = await getValidatorCommissionInfoApi()
					let mainToken = await getMainToken()
					if(res && res.data && res.data.length > 0){
						let copyData = JSON.parse(JSON.stringify(this.jailedData));
						res.data.push(copyData);
						let allValidatorBondedTokenArr = res.data;
						this.currentValidatorBondedTokenArr = [];
						this.otherValidatorBondedTokenArr = [];
						allValidatorBondedTokenArr.forEach( async item => {
							item.formatCommissionRote = (Number(item.commission_rate) * 100).toFixed(0);
							let bonded_tokens = await converCoin({
								amount: item.bonded_tokens,
								denom: mainToken.denom
							})
							item.formatBondedToken = Tools.subStrings(bonded_tokens.amount,6)
							if(item.operator_address === this.$route.params.param){
								this.currentMoniker = item.moniker;
								this.currentValidatorBondedTokenArr.push([item.formatCommissionRote,item.formatBondedToken,item.moniker]);
							}else {
								this.otherValidatorBondedTokenArr.push([item.formatCommissionRote,item.formatBondedToken,item.moniker]);

							}
						});
						this.initCharts();
					}
				}catch (e) {
					console.error(e)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.validator_detail_scatter_container{
		min-height: 2.2rem;
		width: 100%;
		.validator_detail_scatter_content_wrap{
			width: 100%;
			#validator_detail_scatter_content{
				height: 2.2rem;
				margin-right: 0.7rem;
				margin-top: 0.2rem;
				min-width: 5rem;
			}
		}
		.validator_chart_tip{
			display: flex;
			padding-left: 0.2rem;
			margin-top: 0.2rem;
			.current_chart_tip{
				display: flex;
				align-items: center;
				.current_chart_color_block{
					display: inline-block;
					width: 0.14rem;
					height: 0.14rem;
					border-radius: 0.07rem;
					opacity: 0.5;
				}
				.current_moniker{
					margin-left: 0.05rem;
				}
			}
			.other_chart_tip{
				margin-left: 0.4rem;
				display: flex;
				align-items: center;
				.other_chart_color_block{
					margin-right: 0.05rem;
					display: inline-block;
					width: 0.14rem;
					height: 0.14rem;
					border-radius: 0.07rem;
					opacity: 0.5;
					background: $theme_c;
				}
			}
		}
	}
	@media screen and (max-width: 750px){
		.validator_detail_scatter_container{
			width: 100%;
			.validator_detail_scatter_content_wrap{
				width: 100%;
				overflow-x: auto;
				#validator_detail_scatter_content{
					margin-right: 0;
				}
			}
		}
	}
</style>
