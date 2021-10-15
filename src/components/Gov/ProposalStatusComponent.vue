<template>
	<div class="proposal_status_container">
		<div class="proposal_status_icon_content">
			<template >
				<i class="iconfont iconPass" v-if="status === proposalStatus.passed"
				   style="color:#44C190;"></i>
				<i class="iconfont iconVeto" v-if="status === proposalStatus.rejected"
				   style="color:rgb(254, 138, 138);"></i>
				<i class="iconfont iconDepositPeriod-liebiao" style="color: var(--bgColor)"
				   v-if="status === proposalStatus.depositPeriod"></i>
				<i class="iconfont iconDepositPeriod" style="color: var(--bgColor)"
				   v-if="status === proposalStatus.votingPeriod"></i>
				<span style="margin-left:0.06rem;white-space: nowrap">{{status }}</span>
			</template>
		</div>
		<div class="votes_per_content">
			<template >
				<div class="votes_per_content">
					<el-tooltip :content="`Yes: ${formatNum(finalVotes.yes)} %`" placement="top"
								effect="dark">
						<div class="votes_per" :style="{ width: `${finalVotes.yes}%` }"></div>
					</el-tooltip>
					<el-tooltip :content="`Abstain: ${formatNum(finalVotes.abstain)} %`"
								placement="top" effect="dark">
						<div class="votes_per"
							 :style="{ backgroundColor: '#CCDCFF', width: `${finalVotes.abstain}%` }"></div>
					</el-tooltip>
					<el-tooltip :content="`No: ${formatNum(finalVotes.no)} %`" placement="top"
								effect="dark">
						<div class="votes_per"
							 :style="{ backgroundColor: '#FFCF65', width: `${finalVotes.no}%` }"></div>
					</el-tooltip>
					<el-tooltip :content="`NoWithVeto: ${formatNum(finalVotes.no_with_veto)} %`"
								placement="top" effect="dark">
						<div class="votes_per"
							 :style="{ backgroundColor: '#FE8A8A', width: `${finalVotes.no_with_veto}%` }"></div>
					</el-tooltip>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import {proposalStatus, voteOptions} from "../../constant";
export default {
	name: "ProposalStatusComponent",
	props: {
		status:{
			type: String,
			default:'',
		},
		finalVotes:{
			type:Object,
			default: {}
		}
	},
	data () {
		return {
			proposalStatus
		}
	},
	methods:{
		formatNum(num) {
			return num.toFixed(2);
		},
	}
}
</script>

<style scoped lang="scss">
.proposal_status_container{
	display: flex;
	align-items: center;
	.proposal_status_icon_content{
		width: 1.33rem;
	}
	.votes_per_content {
		width: 1.02rem;
		height: 0.1rem;
		display: flex;
		.votes_per:nth-of-type(1) {
			background: $theme_c;
		}
	}
}
</style>