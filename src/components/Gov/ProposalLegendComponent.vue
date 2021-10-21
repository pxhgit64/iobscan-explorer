<template>
	<div class="legend_container">
		<div class="legend_content">
			<div class="icon_list">
				<div>
					<i style="margin-left: 0;"></i>
					<span>{{ $t("ExplorerLang.gov.proposalOption.yes") }}</span>
				</div>
				<div>
					<i style="background-color: #CCDCFF;"></i>
					<span>{{ $t("ExplorerLang.gov.proposalOption.abstain") }}</span>
				</div>
				<div>
					<i style="background-color: #FFCF65;"></i>
					<span>{{ $t("ExplorerLang.gov.proposalOption.no") }}</span>
				</div>
				<div>
					<i style="background-color: #FE8A8A;"></i>
					<span>{{ $t("ExplorerLang.gov.proposalOption.noWithVeto") }}</span>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
export default {
	name: "ProposalLegendComponent"
}
</script>

<style scoped lang="scss">
.legend_container{
	display: flex;
	justify-content: flex-end;
	@media (max-width: 768px) {
		justify-content: flex-start;
	}
	.legend_content{
		border-radius: 0.08rem;
		border:0.01rem solid rgba(231, 234, 243, 1);
		padding: 0.08rem 0.12rem;
		max-width: 2.52rem;
		.icon_list {
			display: flex;
			align-items: center;
			div {
				font-size: $s12;
				color: $t_second_c;
				display: flex;
				align-items: center;
				
				i {
					width: 0.12rem;
					height: 0.12rem;
					border-radius: 0.06rem;
					display: inline-block;
					margin-left: 0.12rem;
					background-color: $theme_c;
					vertical-align: middle;
					@media (max-width: 375px) {
						width: 0.06rem;
						height: 0.06rem;
						border-radius: 0.03rem;
						margin-left: 0.1rem;
					}
				}
				
				img {
					width: 0.14rem;
					height: 0.14rem;
					margin-left: 0.5rem;
					vertical-align: middle;
				}
				
				span {
					margin-left: 0.06rem;
					vertical-align: middle;
				}
			}
		}
	}
}


</style>