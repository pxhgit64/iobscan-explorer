<template>
	<div class="tabs_container">
		<div class="tabs_content">
			<el-button
				size="small"
				v-for="(item,index) in tabList"
				:key="item.label"
				@click.stop="clickButton(item,index)"
				:class="Number($store.state.currentTxModelIndex) === index ? 'active_style' :'default_style'">{{ item.label }}
			</el-button>
		</div>
		<div class="child_tabs_content" v-if="$store.state.isShowMsgChildrenType">
			<div class="tag_content">
				<el-card>
					<el-tag v-for="(value,index) in childrenTabs"
							:key="value.value"
							@click.stop="selectMsgType(value,index)"
							:class="value.active ? 'active_tag_style' : 'default_tag_style'">
						{{ setDisplayMsgType(value.value) }}
					</el-tag>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script>
import {TX_TYPE_DISPLAY} from "../../constant";
export default {
	name: "TabsComponent",
	data() {
		return {
			currentClickIndex: 0,
			// isShowChildren: false,
			childrenTabs: [],
			positionTop: 0,
			currentMsgTypeClickIndex: '',
			currentMsgType:  null,
		}
	},
	props: {
		tabList: {
			type: Array,
			default: [],
		},
		reset: {
			type: Function
		}
	},
	watch: {
		tabList: {
			handler(newValue, oldValue) {
				console.log(newValue,"交易类型")
			},
			deep: true
		},
		currentChoiceMsgType: {
			header(newValue, oldValue) {
			},
			deep: true
		}
	},
	mounted() {
		// const currentMstType = sessionStorage.
		
	},
	methods: {
		setDisplayMsgType(msgType){
			if(msgType){
				return TX_TYPE_DISPLAY[msgType]
			}
			return ''
		},
		clickButton(value, index) {
			// this.isShowChildren = false
			this.$store.commit('isShowMsgChildrenType',false)
			if (value?.children) {
				this.childrenTabs = value.children
				// this.isShowChildren = true
				this.$store.commit('isShowMsgChildrenType',true)
				const currentSearchType = sessionStorage.getItem('currentChoiceMsgType') || ''
				value.children.forEach((item, index) => {
					item.active = 0
					if (item.value === currentSearchType) {
						item.active = 1
					}
				})
			}
			this.currentClickIndex = index
			this.$store.commit('currentTxModelIndex',index)
			sessionStorage.setItem('currentTxModelIndex',index)
			if(!index){
				sessionStorage.setItem('lastChoiceMsgModelIndex',this.currentClickIndex)
			}
			if (!value.value) {
				sessionStorage.setItem('currentChoiceMsgType', '')
				this.$emit('onSelectMagType', {
					label:'all',
					value:''
				})
			}
			value.index = index
			this.$emit('onSelectMagModel', value)
		},
		selectMsgType(msgType, index) {
			this.childrenTabs.forEach((item) => {
				if (item.active) {
					item.active = 0
				}
				if (msgType.value === item.value) {
					item.active = 1
				}
			})
			// this.isShowChildren = false
			sessionStorage.setItem('lastChoiceMsgModelIndex',this.currentClickIndex)
			this.$store.commit('isShowMsgChildrenType',false)
			sessionStorage.setItem('currentChoiceMsgType', msgType.value)
			this.$emit('onSelectMagType', msgType)
		}
	}
}
</script>

<style scoped lang="scss">
.tabs_container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	position: relative;
	
	.tabs_content {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		
		::v-deep.el-button {
			border: none;
			box-shadow: 0.01rem 0.02rem 0.04rem 0.01rem #EFEFEF;
			margin-bottom: 0.1rem;
			color: rgba(23, 29, 68, 1);
			border-radius: 0.08rem;
			outline: none !important;
			
			&:hover {
				background: rgba(90, 93, 99, 0.1);
			}
			
		}
		
		.default_style {
			color: rgba(23, 29, 68, 1);
		}
		
		.active_style {
			background: $theme_c !important;
			color: #fff;
		}
	}
	
	.child_tabs_content {
		width: 100%;
		z-index: 10;
		display: flex;
		justify-content: flex-start;
		position: relative;
		
		.tag_content {
			z-index: 9;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			animation: fadeInDown 0.2s linear;
			
			::v-deep .el-card {
				padding: 0.18rem 0.18rem 0 0.18rem;
				.el-card__body {
					padding: 0;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
				}
				
				.el-tag {
					background: #fff;
					border-color: rgba(231, 234, 243, 1);
					color: #909399 !important;
					margin-right: 0.12rem;
					margin-bottom: 0.14rem;
					font-size: 0.12rem;
					cursor: pointer;
				}
				
				.active_tag_style {
					color: $theme_c !important;
					background: $tag_c !important;;
				}
			}
		}
		
		
	}
	
}

@keyframes fadeInDown {
	0% {
		transform: translateY(-0.4rem);
	}
	100% {
		transform: translateY(0);
	}
}
</style>