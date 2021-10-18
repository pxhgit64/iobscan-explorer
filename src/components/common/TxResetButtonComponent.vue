<template>
	<div class="reset_button_content">
		<button class="ref_content" @click="resetParams">
			<i class="iconfont iconzhongzhi"></i>
		</button>
	</div>
</template>

<script>
export default {
	name: "TxResetButtonComponent",
	methods:{
		resetParams(){
			/*this.statusTypes.forEach(item => {
				item.isActive = false
			})
			this.statusTypes[0].isActive = true
			this.value = []*/
			this.$emit('resetParams','')
		}
	}
}
</script>

<style scoped lang="scss">
.ref_content{
	border: none;
	background: $theme_c !important;
	color: #fff;
	border-radius: 0.08rem;
	width: 0.32rem;
	height: 0.32rem;
}
</style>