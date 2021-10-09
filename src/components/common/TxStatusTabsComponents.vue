<template>
	<div class="tx_status_container">
		<div class="tx_status_content">
			<el-button size="small"
					   v-for="(item,index) in statusTypes"
					   :key="index"
					   @click="choiceTxStatus(index)"
					   :class="item.isActive ? 'active_style' : 'default_style'">
				{{ item.label }}
			</el-button>
		</div>
		<div class="tx_date_picket_content">
			<el-date-picker size="small"
							v-model="value"
							range-separator="~"
							type="daterange"
							:start-placeholder="$t('ExplorerLang.common.startDate')"
							:end-placeholder="$t('ExplorerLang.common.endDate')"
							:picker-options="pickerOptions"
							@change="selectTime"></el-date-picker>
		</div>
		<div class="tooltip_content">
		  	<el-tooltip popper-class="tooltip" :content="$t('ExplorerLang.transactions.tooltip')">
				<i class="iconfont iconyiwen"></i>
			</el-tooltip>
		</div>
		<button class="ref_content" @click="resetParams">
			<i class="iconfont iconzhongzhi"></i>
		</button>
	</div>
</template>

<script>
import config from '../../productionConfig'
import moment from 'moment'
import Tools from "../../util/Tools";
export default {
	name: "TxStatusTabsComponents",
	data() {
		return {
			statusTypes: [
				{
					value: 0,
					label: this.$t('ExplorerLang.common.allTxStatus'),
					isActive: true
				},
				{
					value: 1,
					label: this.$t('ExplorerLang.common.success'),
					isActive: false
				},
				{
					value: 2,
					label: this.$t('ExplorerLang.common.failed'),
					isActive: false
				}
			],
			value: sessionStorage.getItem('txTimeRange') ?JSON.parse(sessionStorage.getItem('txTimeRange')) : [],
			pickerOptions:{
				disabledDate(time){
					let _now = Date.now(),
						dayTimestamp = 7 * 24 * 60 * 60 * 1000,
						startTime = Number(config.firstBlockTimestamp) - dayTimestamp;
					return time.getTime() > _now || time.getTime() < startTime.toString();
					//大于当前的禁止，小于7天前的禁止
				}
			}
		}
	},
	mounted(){
		const {status} = Tools.urlParser();
		if(status){
			this.statusTypes.forEach(item => {
				item.isActive = false
				if(item.value === Number(status)){
					item.isActive = true
				}
			})
		}
	},
	methods: {
		choiceTxStatus(index) {
			this.statusTypes.forEach(item => {
				item.isActive = false
			})
			this.statusTypes[index].isActive = true
			this.$emit('onChangTxStatus',this.statusTypes[index].value)
		},
		selectTime(){
			if(this?.value?.length === 2){
				const startTime = this.value[0].toString();
				const endTime = this.value[1].toString();
				const startTimeStamp = moment(startTime).format('YYYY-MM-DD')
				const engTimeStamp = moment(endTime).format('YYYY-MM-DD')
				sessionStorage.setItem('txTimeRange',JSON.stringify([startTimeStamp,engTimeStamp]))
				this.$emit('onChangeDate',[startTimeStamp,engTimeStamp])
			}else {
				this.$emit('onChangeDate',[])
			}
		},
		resetParams(){
			this.statusTypes.forEach(item => {
				item.isActive = false
			})
			this.statusTypes[0].isActive = true
			this.value = []
			this.$emit('resetParams','')
		}
	}
}
</script>

<style scoped lang="scss">
.tx_status_container {
	display: flex;
	margin: 0.2rem 0;
	.tx_status_content {
		display: flex;
		margin-right: 0.12rem;
		
		::v-deep.el-button + .el-button {
			margin-left: 0;
			border-radius: 0;
		}
		
		.el-button {
			color: rgba(23, 29, 68, 1);
			border-color: rgba(231, 234, 243, 1);
			
			&:hover {
				background: rgba(90, 93, 99, 0.1);
			}
		}
		
		.el-button:first-child {
			border-radius: 0.08rem 0 0 0.08rem;
			border-right: none;
		}
		
		.el-button:last-child {
			border-radius: 0 0.08rem 0.08rem 0;
			border-left: none;
		}
		
		.active_style {
			border-color: $theme_c !important;
			background: $theme_c !important;
			color: #fff !important;
		}
	}

	.tx_date_picket_content {
		::v-deep.el-date-editor {
			border-radius: 0.08rem;
		}
	}
	.tooltip_content {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin: 0 0.1rem;
	}
	.ref_content{
		border: none;
		background: $theme_c !important;
		color: #fff;
		border-radius: 0.08rem;
		width: 0.32rem;
		height: 0.32rem;
	}
}

</style>