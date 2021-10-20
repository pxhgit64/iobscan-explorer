<template>
	<div class="proposals_list_page_wrap">
		<div class="proposals_list_content">
			<div class="proposals_title_container"
				 v-if="votingPeriodDatas.length !== 0 || depositPeriodDatas.length !== 0">
				<span>{{ $t("ExplorerLang.gov.proposalsTitle") }}</span>
			</div>
			<div class="graph_containers">
				<!-- <div class="graph_container">
				  <div v-for="v in votingPeriodDatas" :key="v.proposal_id">
					<m-proposals-echart :data="v" v-if="v"></m-proposals-echart>
				  </div>
				  <div v-for="v in depositPeriodDatas" :key="v.proposal_id">
					<m-proposals-card :data="v" v-if="v"></m-proposals-card>
				  </div>
				</div> -->
				
				<!-- PC端 一个投票期-多个质押期或没有质押期 -->
				<div class="graph_container votingPeriodDatas_one"
					 v-if="votingPeriodDatas.length === 1 && (depositPeriodDatas.length === 0 || depositPeriodDatas.length > 1)">
					<div v-for="v in votingPeriodDatas" :key="v.proposal_id">
						<m-proposals-echart :data="v" v-if="v"></m-proposals-echart>
					</div>
					<div v-for="v in depositPeriodDatas" :key="v.proposal_id">
						<m-proposals-card :data="v" v-if="v"></m-proposals-card>
					</div>
				</div>
				
				<!--PC端 没有投票期且只有一个质押期 -->
				<div class="graph_container depositPeriodDatas_one"
					 v-if="votingPeriodDatas.length === 0 && depositPeriodDatas.length === 1">
					<div v-for="v in depositPeriodDatas" :key="v.proposal_id">
						<m-proposals-card :data="v" v-if="v"></m-proposals-card>
					</div>
				</div>
				
				<!--PC端 一个投票期一个质押期 -->
				<div class="graph_container votingPeriodDatas_one_depositPeriodDatas_one"
					 v-if="votingPeriodDatas.length === 1 && depositPeriodDatas.length === 1">
					<div v-for="v in votingPeriodDatas" :key="v.proposal_id">
						<m-proposals-echart :data="v" v-if="v"></m-proposals-echart>
					</div>
					<div v-for="v in depositPeriodDatas" :key="v.proposal_id">
						<m-proposals-card :data="v" v-if="v"></m-proposals-card>
					</div>
				</div>
				
				<!-- PC端 多个质押期提案且投票期为0或多个 -->
				<div class="graph_container votingPeriodDatas_depositPeriodDatas"
					 v-if="votingPeriodDatas.length !== 1 && (depositPeriodDatas.length > 1 || votingPeriodDatas.length > 1)">
					<div>
						<div v-for="v in votingPeriodDatas" :key="v.proposal_id">
							<m-proposals-echart :data="v" v-if="v"></m-proposals-echart>
						</div>
					</div>
					<div>
						<div v-for="v in depositPeriodDatas" :key="v.proposal_id">
							<m-proposals-card :data="v" v-if="v"></m-proposals-card>
						</div>
					</div>
				</div>
			</div>
			<div class="proposals_list">
				<div class="proposals_icon"
					 :class="votingPeriodDatas.length !== 0 || depositPeriodDatas.length !== 0 ? 'flex_right' : ''">
					<div class="proposals_title"
						 v-if="votingPeriodDatas.length === 0 && depositPeriodDatas.length === 0">
						<span>{{ $t("ExplorerLang.gov.proposalsTitle") }}</span>
<!--						<span>{{ count }} {{ $t("ExplorerLang.gov.proposals") }}</span>-->
					</div>
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
				<div class="proposals_list_table_content">
					<list-component :empty-text="$t('ExplorerLang.table.emptyDescription')"
									:is-loading="isProposalLoading"
									:list-data="tableData"
									:column-list="proposalListColumn"
									:pagination="{pageSize:Number(pageSize),dataCount:count,pageNum:Number(pageNum)}"
									@pageChange="pageChange">
						<template v-slot:txCount>
							<tx-count-component :title="$t('ExplorerLang.gov.proposals')" :icon="'iconProposal'"  :tx-count="count"></tx-count-component>
						</template>
					</list-component>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MPagination from ".././common/MPagination";
import {ColumnMinWidth, product} from "@/constant";
import {getProposalsListApi} from "@/service/api.js";
import Tools from "../../util/Tools";
import {converCoin, getMainToken} from "../../helper/IritaHelper";
import MProposalsCard from "../common/MProposalsCard";
import MProposalsEchart from "../common/MProposalsEchart";
import {proposalStatus, voteOptions} from "../../constant";
import productionConfig from '@/productionConfig.js';
import ListComponent from "../common/ListComponent";
import proposalColumn from "./govColumnConfig/proposalColumn";
import TxCountComponent from "../TxCountComponent";
export default {
	name: "",
	components: {
		TxCountComponent,
		ListComponent,
		MPagination,
		MProposalsCard,
		MProposalsEchart,
	},
	props: {},
	data() {
		return {
			proposalListColumn:[],
			isProposalLoading:false,
			ColumnMinWidth,
			proposalStatus,
			count: 0,
			pageNum: 1,
			pageSize: 10,
			tableData: [],
			proposalTitleNum: 20,
			depositPeriodDatas: [],
			votingPeriodDatas: [],
		};
	},
	computed: {},
	watch: {},
	mounted() {
		this.proposalListColumn = proposalColumn
		this.getProposalsListCount();
		this.getProposalsList();
		this.getProposalsByStatus();
	},
	methods: {
		async getProposalsList() {
			this.isProposalLoading = true
			try {
				let res = await getProposalsListApi('', this.pageNum, this.pageSize, false);
				if (res && res.data && res.data.length > 0) {
					this.tableData = res.data.map(proposal => {
						let id = proposal.id;
						let title = proposal.content && Tools.formatString(proposal.content.title, this.proposalTitleNum, "...");
						let type = proposal.content && proposal.content.type;
						let status = proposal.status;
						let submitTime = proposal.submit_time ? Tools.formatLocalTime(proposal.submit_time) : "--";
						let depositEndTime = proposal.deposit_end_time ? Tools.formatLocalTime(proposal.deposit_end_time) : "--";
						let votingEndTime = proposal.voting_end_time ? Tools.formatLocalTime(proposal.voting_end_time) : "--";
						let finalVotes = {};
						let finalTotalVotes = 0;
						if (status === "VotingPeriod") {
							let currentTallyResult = proposal.current_tally_result;
							if (currentTallyResult) {
								finalTotalVotes = currentTallyResult.total_voting_power;
								finalVotes.yes = (currentTallyResult.yes / finalTotalVotes) * 100;
								finalVotes.no = (currentTallyResult.no / finalTotalVotes) * 100;
								finalVotes.abstain = (currentTallyResult.abstain / finalTotalVotes) * 100;
								finalVotes.no_with_veto = (currentTallyResult.no_with_veto / finalTotalVotes) * 100;
							}
						} else {
							finalVotes = Object.keys(proposal.final_tally_result).length > 0 ? proposal.final_tally_result : finalVotes;
							for (let k in proposal.final_tally_result) {
								finalTotalVotes += Number(proposal.final_tally_result[k]);
							}
							if (finalTotalVotes > 0) {
								for (let k in finalVotes) {
									finalVotes[k] = (Number(finalVotes[k]) / finalTotalVotes) * 100;
								}
							}
						}
						if (votingEndTime === "0001-01-01 08:05:43" || proposal.voting_end_time === -62135596800.0) {
							votingEndTime = "--";
						}
						return {
							id,
							title,
							type,
							status: status,
							submitTime,
							depositEndTime,
							votingEndTime,
							finalTotalVotes,
							finalVotes,
						};
					});
				} else {
					this.tableData = []
				}
				this.isProposalLoading = false
			} catch (e) {
				this.isProposalLoading = false
				console.error(e);
			}
		},
		async getProposalsListCount() {
			try {
				let res = await getProposalsListApi("", null, null, true);
				if (res?.count) {
					this.count = res.count;
				} else {
					this.count = 0
				}
			} catch (e) {
				console.error(e);
			}
		},
		async getProposalsByStatus() {
			try {
				let res = await getProposalsListApi(`${proposalStatus.votingPeriod},${proposalStatus.depositPeriod}`);
				if (res && res.data && res.data.length > 0) {
					let depositPeriodDatas = res.data.filter(v => v.status === proposalStatus.depositPeriod);
					let mainToken = await getMainToken();
					for (const v of depositPeriodDatas) {
						v.proposal_id = v.id;
						v.title = v.content && v.content.title;
						v.type = v.content && v.content.type;
						v.min_deposit_number = Number(v.min_deposit);
						let n = await converCoin({
							denom: mainToken.denom,
							amount: v.min_deposit_number,
						});
						v.min_deposit_format = `${n.amount} ${n.denom.toUpperCase()}`;
						if (v.initial_deposit && v.initial_deposit[0] && v.initial_deposit[0].amount) {
							let initial_deposit = v.initial_deposit[0];
							v.initial_deposit_number = Number(initial_deposit.amount);
							let n = await converCoin(initial_deposit);
							v.initial_deposit_format = `${n.amount} ${n.denom.toUpperCase()}`;
						} else {
							v.initial_deposit_format = `0 ${mainToken.symbol.toUpperCase()}`;
						}
						if (v.total_deposit && v.total_deposit[0] && v.total_deposit[0].amount) {
							let total_deposit = v.total_deposit[0];
							v.total_deposit_number = Number(total_deposit.amount);
							let n = await converCoin(total_deposit);
							v.total_deposit_format = `${n.amount} ${n.denom.toUpperCase()}`;
						}
						v.initial_deposit_number_per = this.isNumber(v.initial_deposit_number) && this.isNumber(v.min_deposit_number) ? this.forLimitNumer(v.initial_deposit_number / v.min_deposit_number) * 100 + "%" : 0;
						v.total_deposit_number_per = this.isNumber(v.total_deposit_number) && this.isNumber(v.min_deposit_number) ? this.forLimitNumer(v.total_deposit_number / v.min_deposit_number) * 100 + "%" : 0;
					}
					this.depositPeriodDatas = depositPeriodDatas.sort((a, b) => {
						return b.proposal_id - a.proposal_id;
					});
					let votingPeriodDatas = res.data.filter(v => v.status === proposalStatus.votingPeriod);
					this.votingPeriodDatas = votingPeriodDatas.map(item => {
						let o = {};
						o.proposal_id = item.id;
						o.title = item.content && item.content.title;
						o.type = item.content && item.content.type;
						o.status = item.status;
						o.votingEndTime = item.voting_end_time;
						let all = item.current_tally_result && item.current_tally_result.system_voting_power;
						let yesArr = item.tally_details.filter(v => v.vote === voteOptions[1]);
						let yes = item.current_tally_result && item.current_tally_result.yes;
						let noArr = item.tally_details.filter(v => v.vote === voteOptions[3]);
						let no = item.current_tally_result && item.current_tally_result.no;
						let abstainArr = item.tally_details.filter(v => v.vote === voteOptions[2]);
						let abstain = item.current_tally_result && item.current_tally_result.abstain;
						let noWithVetoArr = item.tally_details.filter(v => v.vote === voteOptions[4]);
						let noWithVeto = item.current_tally_result && item.current_tally_result.no_with_veto;
						let votes = item.current_tally_result && item.current_tally_result.total_voting_power;
						o.participationNum = item.quorum && Tools.formatPerNumber(item.quorum * 100);
						o.passThresholdNum = item.threshold && Tools.formatPerNumber(item.threshold * 100);
						o.vetoThresholdNum = item.veto_threshold && Tools.formatPerNumber(item.veto_threshold * 100);
						o.participation = all ? (votes / all) * 100 : 0;
						o.passThreshold = votes ? (yes / votes) * 100 : 0;
						o.vetoThreshold = votes ? (noWithVeto / votes) * 100 : 0;
						let nonparticipantPer = Tools.formatPerNumber(((all - votes) / all) * 100);
						let data = [
							{
								name: "Participant",
								value: votes,
								perData: Tools.formatPerNumber((votes / all) * 100),
								itemStyle: {
									// color: "#3264fd",
									color: productionConfig.themeColor,
									borderColor: "#ECEFFF",
									borderWidth: 0,
								},
								children: [
									{
										name: "Yes",
										value: yes,
										perData: Tools.formatPerNumber((yes / votes) * 100),
										itemStyle: {
											color: "#45B4FF",
											borderColor: "#ECEFFF",
											borderWidth: 0,
										},
										children: this.formatGrahpChildren(yesArr, {
											h: [205, 204],
											s: [100, 100],
											l: [79, 35]
										}),
									},
									{
										name: "Abstain",
										value: abstain,
										perData: Tools.formatPerNumber((abstain / votes) * 100),
										itemStyle: {
											color: "#CCDCFF",
											borderColor: "#ECEFFF",
											borderWidth: 0,
										},
										children: this.formatGrahpChildren(abstainArr, {
											h: [222, 221],
											s: [100, 44],
											l: [86, 58]
										}),
									},
									{
										name: "No",
										value: no,
										perData: Tools.formatPerNumber((no / votes) * 100),
										itemStyle: {
											color: "#FFCF65",
											borderColor: "#ECEFFF",
											borderWidth: 0,
										},
										children: this.formatGrahpChildren(noArr, {
											h: [36, 36],
											s: [100, 100],
											l: [77, 48]
										}),
									},
									{
										name: "NoWithVeto",
										value: noWithVeto,
										perData: Tools.formatPerNumber((noWithVeto / votes) * 100),
										itemStyle: {
											color: "#FE8A8A",
											borderColor: "#ECEFFF",
											borderWidth: 0,
										},
										children: this.formatGrahpChildren(noWithVetoArr, {
											h: [21, 21],
											s: [100, 100],
											l: [79, 50]
										}),
									},
								],
							},
							{
								name: "Nonparticipant",
								value: all - votes,
								perData: nonparticipantPer,
								nodeClick: false,
								itemStyle: {
									color: "#E5E9FB",
									borderColor: "#E5E9FB",
									borderWidth: 0,
								},
								label: {
									color: "#51A9FF",
									textBorderWidth: 0,
									fontWeight: 600,
								},
								children: [
									{
										name: "",
										tipName: "Nonparticipant",
										value: all - votes,
										perData: nonparticipantPer,
										nodeClick: false,
										itemStyle: {
											color: "#E5E9FB",
											borderColor: "#E5E9FB",
											borderWidth: 0,
										},
										children: [
											{
												name: "",
												tipName: "Nonparticipant",
												value: all - votes,
												perData: nonparticipantPer,
												nodeClick: false,
												itemStyle: {
													color: "#E5E9FB",
													borderColor: "#E5E9FB",
													borderWidth: 0,
												},
											},
										],
									},
								],
							},
						];
						o.data = data;
						return o;
					});
					this.votingPeriodDatas = this.votingPeriodDatas.sort((a, b) => {
						return b.proposal_id - a.proposal_id;
					});
				} else {
				
				}
			} catch (e) {
				console.error(e);
			}
		},
		isNumber(n) {
			return typeof n === "number";
		},
		forLimitNumer(number) {
			if (typeof number === "number") {
				return Math.max(Math.min(number, 1), 0);
			}
		},
		formatNum(num) {
			return num.toFixed(2);
		},
		pageChange(pageNum) {
			if (this.pageNum == pageNum) {
				return;
			}
			this.pageNum = pageNum;
			this.getProposalsList("", this.pageNum, this.pageSize);
			this.getProposalsByStatus();
		},
		formatGrahpChildren(arr, color) {
			let hStep = (color.h[1] - color.h[0]) / 100;
			let sStep = (color.s[1] - color.s[0]) / 100;
			let lStep = (color.l[1] - color.l[0]) / 100;
			let result = [];
			arr.forEach((v, i) => {
				let h = color.h[0] + hStep * i;
				let s = color.s[0] + sStep * i;
				let l = color.l[0] + lStep * i;
				if (v.isValidator && (v.notVoteVotingPower || v.selfDelVotingPower || v.delVotingPower)) {
					result.push({
						value: v.notVoteVotingPower + v.selfDelVotingPower + v.delVotingPower,
						info: v,
						nodeClick: false,
						itemStyle: {
							color: `hsla(${h},${s}%,${l}%, 1)`,
							borderColor: "#ECEFFF",
							borderWidth: 0,
						},
					});
				} else if (v.delVotingPower) {
					result.push({
						value: v.delVotingPower,
						info: v,
						nodeClick: false,
						itemStyle: {
							color: `hsla(${h},${s}%,${l}%, 1)`,
							borderColor: "#ECEFFF",
							borderWidth: 0,
						},
					});
				}
			});
			return result;
		},
	},
};
</script>

<style lang="scss" scoped>
a {
	color: $t_link_c !important;
}

.proposals_list_page_wrap {
	.proposals_list_content {
		max-width: 12rem;
		margin: 0 auto;
		padding: 0 0.15rem;
		text-align: left;
		
		.proposals_title_container, .proposals_title {
			margin: 0.3rem 0 0 0;
			text-align: left;
			display: flex;
			line-height: 0.3rem;
			color: $t_first_c;
			font-size: $s18;
			font-weight: bold;
			
			span {
				margin-right: 0.1rem;
			}
		}
		
		.graph_containers {
			width: 100%;
			position: relative;
			z-index: 1;
			padding-top: 10rem;
			margin-top: -10rem;
			overflow-x: auto;
			
			.graph_container {
				display: flex;
				width: 12rem;
				flex-wrap: wrap;
				margin: 0rem auto 0.1rem;
				
				&:nth-last-of-type(1) {
					margin-bottom: 0;
				}
			}
			
			.votingPeriodDatas_one {
				justify-content: space-between;
				
				& > div {
					margin-top: 0.2rem !important;
					width: calc(50% - 0.1rem);
					
					.propsals_card_container {
						height: 2.5rem;
					}
				}
				
				& > div:nth-child(1) {
					width: 100%;
					margin-top: 0rem !important;
					
					.propsals_echart_container {
						width: 100%;
						background: $t_white_c;
					}
				}
			}
			
			.depositPeriodDatas_one {
				margin-top: 0.2rem;
				height: 2.2rem;
				
				& > div {
					width: 100%;
					display: flex;
					
					& > div {
						flex: 1;
					}
				}
			}
			
			.votingPeriodDatas_one_depositPeriodDatas_one {
				flex-direction: column;
				justify-content: space-between;
				
				& > div {
					margin-bottom: 0.2rem;
					// width: calc(50% - 0.1rem);
				}
				
				.propsals_echart_container,
				.propsals_card_container {
					width: 100%;
				}
			}
			
			.votingPeriodDatas_depositPeriodDatas {
				flex-direction: column;
				display: flex;
				// margin-top: 0.54rem;
				& > div {
					flex-direction: row;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					
					& > div {
						width: calc(50% - 0.1rem);
						margin-top: 0.2rem;
						
						.propsals_card_container {
							height: 2.5rem;
						}
					}
				}
			}
		}
		
		.proposals_list {
			.proposals_icon {
				display: flex;
				justify-content: space-between;
				
				.proposals_title {
					padding: 0.30rem 0 0.16rem 0;
					margin-top: 0rem;
					display: flex;
					align-items: center;
				}
				
				.icon_list {
					display: flex;
					padding: 0.30rem 0 0.16rem 0;
					
					div {
						font-size: $s14;
						color: $t_second_c;
						display: flex;
						align-items: center;
						
						i {
							width: 0.12rem;
							height: 0.12rem;
							border-radius: 0.02rem;
							display: inline-block;
							margin-left: 0.5rem;
							background-color: $theme_c;
							vertical-align: middle;
						}
						
						img {
							width: 0.14rem;
							height: 0.14rem;
							margin-left: 0.5rem;
							vertical-align: middle;
						}
						
						span {
							margin-left: 0.1rem;
							vertical-align: middle;
						}
					}
				}
			}
			
			.flex_right {
				justify-content: flex-end;
			}
			
			.proposals_list_table_content {
				.proposals_table {
					.status_icon {
						width: 0.14rem;
						margin: 0.08rem 0;
						vertical-align: middle;
						margin-right: 0.1rem;
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
				
				.pagination_content {
					width: 100%;
					display: flex;
					justify-content: flex-end;
					margin: 0.1rem 0 0.2rem 0;
				}
			}
		}
	}
}

@media screen and (max-width: 760px) {
	.proposals_list_page_wrap {
		.proposals_list_content {
			.proposals_list {
				.proposals_icon {
					flex-direction: column;
					
					.proposals_title {
						padding-bottom: 0.1rem;
					}
					
					.icon_list {
						padding: 0 0 0.1rem 0;
						
						div {
							i {
							}
							
							img {
							}
							
							span {
							}
						}
					}
				}
				
				.flex_right {
					flex-direction: row;
					
					.icon_list {
						padding: 0.30rem 0 0.16rem 0;
					}
				}
			}
		}
	}
}

@media screen and (max-width: 615px) {
	.proposals_list_page_wrap {
		.proposals_list_content {
			.proposals_list {
				.proposals_icon {
					.icon_list {
						div {
							i {
								margin-left: 0.1rem;
							}
							
							img {
							}
							
							span {
							}
						}
					}
				}
			}
		}
	}
}
</style>
