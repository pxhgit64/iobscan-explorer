<template>
	<div class="tx_count_content">
		<span class="iconfont icon4HoursLeft"></span>
		<span class="tx_count_label"> {{$t('ExplorerLang.transactions.txs')}}</span>
		<span class="tx_count_number">{{txCount}}</span>
	</div>
</template>

<script>
export default {
	name: "TxCountComponent",
	props:{
		txCount:{
			type:Number,
			default:0
		}
	}
}
</script>

<style scoped lang="scss">
	.tx_count_content{
		display: flex;
		margin: 0.2rem 0;
		align-items: center;
		.iconfont{
			margin-right: 0.08rem;
		}
		.tx_count_label{
			font-size: 0.18rem;
			color: rgba(23, 29, 68, 1);
			margin-right: 0.16rem;
			line-height: 0.32rem;
		}
		.tx_count_number{
			font-size: 0.18rem;
			line-height: 0.32rem;
		}
	}
</style>