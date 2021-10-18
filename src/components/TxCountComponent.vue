<template>
	<div class="tx_count_content">
		<span :class="`iconfont ${icon}` "></span>
		<span class="tx_count_label"> {{ title }}</span>
		<span class="tx_count_number">
			<router-link class="link_style" v-if="isLink" :to="`${linkRoute}/${txCount}`">
				{{ txCount }}
			</router-link>
			<span v-else>{{ txCount }}</span>
		</span>
	</div>
</template>

<script>
export default {
	name: "TxCountComponent",
	props: {
		txCount: {
			type: Number,
			default: 0
		},
		icon: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		isLink: {
			type: Boolean,
			default: false
		},
		linkRoute: {
			type: String,
			default: ''
		}
	}
}
</script>

<style scoped lang="scss">
.tx_count_content {
	display: flex;
	margin: 0.2rem 0 0 0;
	align-items: center;
	
	.iconfont {
		margin-right: 0.08rem;
	}
	
	.tx_count_label {
		font-size: 0.18rem;
		color: rgba(23, 29, 68, 1);
		margin-right: 0.16rem;
		line-height: 0.32rem;
	}
	
	.tx_count_number {
		font-size: 0.18rem;
		line-height: 0.32rem;
		
		.link_style {
			color: $theme_c !important;
		}
	}
}
</style>