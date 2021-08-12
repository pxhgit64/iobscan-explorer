<template>
	<div id="address_information_chart"></div>
</template>

<script>
	import Constant,{ product } from "../constant"
	import productionConfig from '@/productionConfig.js';
	import bigNumber from "bignumber.js"
	import Tools from "@/util/Tools"
    import { getMainToken } from "@/helper/IritaHelper";
	var echarts = require('echarts/lib/echarts')
	require('echarts/lib/component/legend')
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	require('echarts/lib/chart/pie');
	require('echarts/lib/component/legendScroll')
	let pie = null;
	export default {
		name: "AddressInformationPie",
		data (){
			return {
				addressInformationCharts:null,
				themeStyleArray:'',
				mainnetThemeStyle:["#3264FD","#FFA300","#67E523","#8E66FF"],
				testnetFuXiThemeStyle:["#0C4282","#FFA300","#67E523","#8E66FF"],
				testnetNyancatThemeStyle:["#0D9388","#FFA300","#67E523","#8E66FF"],
				defaultThemeStyle:["#0580D3","#FFA300","#67E523","#8E66FF"],
				stargateThemeStyle:["#6958CA","#FFA300","#67E523","#5A9FFF"],
                mainTokenSymbol:'',
			}
		},
		watch:{
			echartData:{
				handler(newValue,oldValue){
					this.initCharts()
				},
				deep: true
			}
		},
		props:{
			echartData:{
				type: Array
			}
		},
		mounted () {
		    this.setMainToken();
        },
		methods:{
            async setMainToken(){
                let mainToken = await getMainToken();
                if(mainToken && mainToken.symbol){
                    this.mainTokenSymbol = mainToken.symbol.toUpperCase();
                }
            },
			async initCharts(){
				this.addressInformationCharts = echarts.init(document.getElementById('address_information_chart'));
				let echartsOption = {
					tooltip: {
						trigger: 'item',
						position:{
							left: 10,
						},
						formatter: (data) => {
							return `<span style="max-width: 1.2rem;word-break: break-all;">${data.name}: <br/>${new bigNumber(data.value).toFormat()} ${this.mainTokenSymbol} (${data.data.formatPercent}%)</span>`
						}
					},
					legend: {
						orient: 'vertical',
						left: 10,
						data: []
					},
					series : [
						{
							hoverAnimation :false,
							type: 'pie',
							radius: ['50%', '70%'],
							avoidLabelOverlap: false,
							label: {
								show: false,
								position: 'center'
							},

							emphasis: {
								label: {
									show: false,
									fontSize: '30',
									fontWeight: 'bold'
								}
							},
							labelLine: {
								show: false
							},
						}
					]
				};
				switch (productionConfig.product) {
					case product.stargate:
						this.themeStyleArray = this.stargateThemeStyle;
						break;
					default:
						this.themeStyleArray = this.mainnetThemeStyle;
						break;
				}
				let seriesData = this.echartData.map( (item,index )=> {
					return {
						value: item.numberValue,
						name: item.label,
						formatPercent: Number(item.percent),
						itemStyle:{
							color: this.themeStyleArray[index]
						}
					}
				});
				echartsOption.series[0].data = seriesData;

				this.addressInformationCharts.setOption(echartsOption)
			}
		}
	}
</script>

<style scoped lang="scss">
	#address_information_chart{
		height: 1rem;
	}
</style>
