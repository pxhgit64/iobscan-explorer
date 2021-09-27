<template>
	<div class="nft_search_container">
		<el-input class="nft_search_content" v-model="input" size="small" @change="handleSearchClick" :placeholder="$t('ExplorerLang.nftAsset.placeHolder')"></el-input>
		<div class="tx_type_mobile_content">
			<el-button type="primary" size="small" class="search_btn" @click="handleSearchClick">{{$t('ExplorerLang.nftAsset.search')}}</el-button>
			<el-button  type="primary" size="small" class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: "NftSearchComponent",
	data() {
		return {
			input:''
		}
	},
	methods:{
		handleSearchClick(){
			this.$emit('searchInput',this.input)
		},
		resetFilterCondition(){
			this.input = ''
			this.$emit('resetFilterCondition',this.input)
		}
	}
}
</script>

<style scoped lang="scss">
.nft_search_container{
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: flex-end;
	.nft_search_content{
		max-width: 3.5rem;
	}
	.tx_type_mobile_content {
		align-items: center;
		display: flex;
		.search_btn{
			background: $theme_c;
			border-color: $theme_c;
			margin:  0 0.1rem;
		}
		.reset_btn{
			background: $theme_c;
			border-color: $theme_c;
			padding: 0.07rem;
		}
	}
}
</style>