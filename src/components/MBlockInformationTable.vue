<template>
    <div>
        <m-table :data="items" :columns="fields">
            <template slot-scope="{ row }" slot="moniker">
                <div class="moniker_conent">
                    <div class="proposer_img_content">
                        <img :style="{visibility:row.flProposer ? 'visible' : 'hidden'}" src="../assets/proposer_img.png"/>
                    </div>
                    <span class="skip_route">
                        <router-link :to="`/staking/${row.OperatorAddress}`">{{row.moniker? row.moniker :''}}</router-link>
                    </span>
                </div>
            </template>
            <template slot-scope="{ row }" slot="OperatorAddress">
                <div class="common_hover_address_parent skip_route">
                    <router-link :to="`/staking/${row.OperatorAddress}`" style="font-family: Consolas,Menlo" class="link_style common_font_style">{{formatAddress(row.OperatorAddress)}}
                    </router-link>
                </div>
            </template>
        </m-table>
    </div>
</template>

<script>
	import Tools from "../util/Tools.js"
	import MTable from './common/MTable'
	export default {
		name: "MBlocKInformationTable",
		components:{ MTable },
        data() {
			return {
				fields:[
                    {
	                    title: this.$t('ExplorerLang.table.number'),
	                    key: 'index',
                    },
					{
						title: this.$t('ExplorerLang.table.name'),
						slot:'moniker',
					},
					{
						title: this.$t('ExplorerLang.table.operator'),
						slot:'OperatorAddress',
						tooltip: true
					},
					{
						title: this.$t('ExplorerLang.table.consensusAddress'),
						key:'Consensus'
					},
					{
						title: this.$t('ExplorerLang.table.proposerPriority'),
						key:'ProposerPriority'
					},
					{
						title:this.$t('ExplorerLang.table.votingPower'),
						key:'VotingPower'
					}
                ]
            }
        },
		props:{
	        items:{
		        type: Array,
		        default: []
            }
        },
		watch:{
			items(items){
				if(items){
					this.items.map((item,i)=>{
						return item.index = i + 1
					})
				}
				this.items = this.items;
			}
		},
        methods:{
	        formatAddress (address) {
		        if (address) {
			        return Tools.formatValidatorAddress(address)
		        }
	        },
        }

	}
</script>

<style lang="scss">
	.moniker_conent {
		display: flex;
		.proposer_img_content {
			width: 0.13rem;
			margin-right: 0.06rem;
			display: flex;
			align-items: center;
			img {
				width: 100%;
			}
		}
	}
	.skip_route{
		a{
			font-size: 0.14rem;
			color: $theme_c !important;
		}
	}
    .block_validator_set_content{
        .m-table-header{
            table{
                thead{
                    tr{
                        th:nth-of-type(2){
                            padding-left: 0.27rem;
                        }
                    }
                }
			}
        }
    }
</style>
