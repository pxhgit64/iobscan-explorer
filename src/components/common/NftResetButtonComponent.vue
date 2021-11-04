<template>
	<div class="nft_reset_button_container">
		<el-button type="primary" size="small" class="reset_btn" @click="resetFilterCondition"><i
			class="iconfont iconzhongzhi"></i></el-button>
	</div>
</template>

<script>
export default {
	name: "NftResetButtonComponent",
	methods:{
		resetFilterCondition() {
			this.input = ''
			this.$emit('resetFilterCondition')
		}
	}
}
</script>

<style scoped lang="scss">
.nft_reset_button_container{
	margin-top: 0.2rem;
	.reset_btn {
		background: $theme_c;
		border-color: $theme_c;
		padding: 0.07rem;
	}
}

</style>