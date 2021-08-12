<template>
    <div class="stats_content_container">
        <div class="stats_content_wrap">
            <div class="stats_content_header_wrap">
                <div class="total_stats_content">
                    {{ mainTokenSymbol }} {{$t('ExplorerLang.stats.stats')}}
                </div>
                <div class="stats_preview_content">
                    <section class="stats_preview_content_item">
                        <span class="stats_preview_content_title">
                            Total Supply
                        </span>
                        <span class="stats_preview_content_content">
                            {{ Tools.getDisplayNumber(supply) }} {{ mainTokenSymbol }}
                        </span>
                    </section>
                    <section class="stats_preview_content_item">
                        <span class="stats_preview_content_title">
                            Circulation
                        </span>
                        <span class="stats_preview_content_content">
                            {{ Tools.getDisplayNumber(circulation) ? `${Tools.getDisplayNumber(circulation)} ${mainTokenSymbol}` : '--' }}
                        </span>
                    </section>

                    <section class="stats_preview_content_item">
                        <span class="stats_preview_content_title">
                            Community Pool
                        </span>
                        <span class="stats_preview_content_content">
                            {{ Tools.getDisplayNumber(CommunityTax) }} {{ mainTokenSymbol }}
                        </span>
                    </section>

                    <section class="stats_preview_content_item">
                        <span class="stats_preview_content_title">
                            Bonded
                        </span>
                        <span class="stats_preview_content_content">
                            {{  Tools.getDisplayNumber(bonded) }} {{ mainTokenSymbol }}
                        </span>
                    </section>


                </div>
            </div>
            <div class="stats_content_header_wrap">
                <div class="total_stats_content">
                    {{ mainTokenSymbol }} {{$t('ExplorerLang.stats.distribution')}}
                </div>
                <div class="stats_preview_content_pie_container">
                    <PieChart />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PieChart from "@/components/stats/PieChart";
import {fetchTokenStats} from "@/service/api";
import config from '../../productionConfig';
import Tools from "@/util/Tools";
import { converCoin, getMainToken } from "@/helper/IritaHelper";

export default {
    name : "Stats",
    data(){
        return {
            title:'',
            config,
            supply:'0.0000',
            circulation:'0.0000',
            bonded:'0.0000',
            CommunityTax:'0.0000',
            Tools,
            mainTokenSymbol:'',
        }
    },
    components:{
        PieChart,
    },
    mounted(){
        this.fetchTokenStats();
        this.setMainToken();
    },
    methods : {
        async fetchTokenStats(){
            try {
                const res = await fetchTokenStats();
                if(res){
                    this.handleTokenStatsData(res);
                }
            }catch (e) {

            }
        },
        async setMainToken(){
            let mainToken = await getMainToken();
            if(mainToken && mainToken.symbol){
                this.mainTokenSymbol = mainToken.symbol.toUpperCase();
            }
        },
        async handleTokenStatsData(data){
            const {bonded_tokens, circulation_tokens, total_supply_tokens,community_tax} = data;
            if(bonded_tokens){
                this.bonded = (await converCoin(bonded_tokens) || {amount: 0}).amount;
            }
            if(circulation_tokens){
                this.circulation = (await converCoin(circulation_tokens) || {amount: 0}).amount;
            }
            if(total_supply_tokens){
                this.supply = (await converCoin(total_supply_tokens) || {amount: 0}).amount;
            }
            if(community_tax) {
                this.CommunityTax = (await converCoin(community_tax) || {amount: 0}).amount;
            }
        }
    }
}
</script>

<style scoped lang="scss">
a {
    color: $t_link_c !important;
}

.stats_content_container {
    width:100%;
    @media screen and (min-width: 910px){
        .stats_content_wrap{
            max-width: 12.3rem;
            .stats_content_header_wrap{
                display: flex;
                justify-content: flex-start;
                flex-direction:column;
                align-items: flex-start;
                .stats_preview_content{
                    flex-direction:row;
                    .stats_preview_content_item{
                        flex:1;
                        margin-right:0.2rem;
                        &:last-child{
                            margin-right:0;
                        }
                    }
                }
            }
        }

    }
    @media screen and (max-width: 910px){
        .stats_content_wrap{
            width:100%;
            .stats_content_header_wrap{
                display: flex;
                flex-direction:column;
                align-items: flex-start;
                .stats_preview_content{
                    flex-direction:column;
                    .stats_preview_content_item{
                        width:100%;
                        margin-bottom:0.1rem;
                    }
                }

            }
        }

    }
    .stats_content_wrap {
        margin: 0 auto;
        width:100%;
        box-sizing:border-box;
        padding:0 0.15rem;
        .service_stats_to_container{
            .service_stats_muti_to_container {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .service_stats_muti_to_ellipsis {
                    color: $t_link_c;
                }
            }
        }
        .service_stats_status {
            position: relative;
            top: 0.02rem;
            left: -0.04rem;
            width:0.13rem;
            height:0.13rem;
        }
        .stats_content_header_wrap {
            width:100%;
            padding: 0.3rem 0 0.13rem 0;
            box-sizing:border-box;
            .total_stats_content {
                // height: 0.64rem;
                //line-height: 0.4rem;
                color: $t_first_c;
                font-size: $s18;
                font-weight: bold;
                margin-bottom: .16rem;
                //text-indent: 0.2rem;
            }
            .stats_preview_content{
                width:100%;
                display:flex;
                box-sizing:border-box;
                .stats_preview_content_item{
                    height: .89rem;
                    background: #FFFFFF;
                    border-radius: .06rem;
                    display:flex;
                    flex-direction:column;
                    align-items: flex-start;
                    //justify-content: center;
                    padding-top:0.16rem;
                    padding-left:0.2rem;
                    box-sizing:border-box;
                    .stats_preview_content_title{
                        margin-bottom:0.2rem;

                        font-size: .14rem;
                        font-family: ArialMT;
                        color: #787C99;
                        line-height: .16rem;
                    }
                    .stats_preview_content_content{

                        font-size: .16rem;
                        font-family: ArialMT;
                        color: #171D44;
                        line-height: .18rem;
                    }

                }
            }
            .stats_preview_content_pie_container{
                width:100%;
            }

        }

    }
}
</style>
