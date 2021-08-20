<template>
    <div class="asset_container">
        <div class="asset_content">
            <div class="asset_title_container">
                <section class="asset_title_container_left">
                    <span class="asset_sub_title _left">{{ mainTokenSymbol }} {{ $t('ExplorerLang.stats.richList') }}</span>
                    <span class="asset_sub_title _center">|</span>
                    <span class="asset_sub_title _right">{{ $t('ExplorerLang.stats.title') }} {{ mainTokenSymbol }}</span>
                    <el-tooltip class="item"
                                effect="dark"
                                transition="el-fade-in-linear"
                                :content="$t('ExplorerLang.stats.help')"
                                :placement="$store.state.isMobile ? 'bottom' : 'right-end'">
                        <img src="../../assets/help.svg">
                    </el-tooltip>
                </section>
                <span class="asset_title_container_right">
                    Updated : {{ updateTime }}
                </span>
            </div>
            <div class="asset_table_list_content">
                <el-table class="table" :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="tableData">
                    <el-table-column :label="$t('ExplorerLang.stats.id')" prop="index" :min-width="ColumnMinWidth.No"></el-table-column>
                    <el-table-column class-name="address" :label="$t('ExplorerLang.stats.address')" prop="owner" :min-width="ColumnMinWidth.proposer">
                        <template v-slot:default="{ row }">
                            <span class="address_link" @click="addressRoute(row.address)"> {{row.address}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="right" prop="amount" :min-width="ColumnMinWidth.maxSupply">
                        <template slot="header" slot-scope="scope">
                            <span>{{ $t('ExplorerLang.stats.amount')}}</span>
                            <el-tooltip :content="mainTokenSymbol"
                                        placement="top">
                                <i class="iconfont iconyiwen yiwen_icon" />
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('ExplorerLang.stats.percentage')" align="right" prop="percent" :min-width="ColumnMinWidth.mintable"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import MPagination from '.././common/MPagination'
import Tools from '../../util/Tools'
import { fetchTokenRichList } from "@/service/api"
import productionConfig from '@/productionConfig.js'
import { ColumnMinWidth } from '@/constant'
import { addressRoute, getMainToken } from '@/helper/IritaHelper'
import moment from 'moment';
import {converCoin} from "@/helper/IritaHelper";

export default {
    name: 'RichList',
    components: { MPagination },
    props: {},
    data() {
        return {
            Tools,
            addressRoute,
            ColumnMinWidth,
            tableData: [],
            pageSize:30,
            pageNumber:1,
            dataCount:0,
            updateTime:'',
            mainTokenSymbol:'hello',
        }
    },
    mounted() {
        this.fetchTokenRichList()
        this.setMainToken()
    },
    methods: {
        async fetchTokenRichList() {
            try{
                let res = await fetchTokenRichList()
                if (res) {
                    this.handleData(res);
                }
            }catch(err){
                console.error(err);
            }
        },
        async setMainToken(){
            let mainToken = await getMainToken();
            if(mainToken && mainToken.symbol){
                this.mainTokenSymbol = mainToken.symbol.toUpperCase();
            }
        },
        async handleData(data){
            if(data){
                if(data.data && data.data.length > 0){
                    let tableData = [];
                    for(let i = 0; i < data.data.length; i++){
                        let t = await converCoin(data.data[i].balance) || {denom: '', amount:0}
                        let amount = Tools.getDisplayNumber(t.amount);
                        tableData.push({
                            index: i + 1,
                            address: data.data[i].address,
                            amount,
                            percent:`${Tools.formatNum(Tools.bigNumberMultiply(data.data[i].percent, 100),2)}%`,
                            tooltip:'world'
                        })
                    }
                    this.tableData = tableData;
                }
                if(data.updated_time){
                    // this.updateTime = `${moment(data.updated_time*1000).utc().format('YYYY-MM-DD HH:MM:SS')}+UTC`
                    this.updateTime = Tools.getDisplayDate(data.updated_time)
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
a {
    color: $t_link_c !important;
}
.asset_container {
    .asset_content {
        max-width: 12rem;
        margin: 0 auto;
        padding: 0 0.15rem;
        text-align: left;
        @media screen and (min-width: 910px){
            .asset_title_container{
                flex-direction:row;
                justify-content: space-between;

            }

        }
        @media screen and (max-width: 910px){
            .asset_title_container{
                flex-direction: column;
                .asset_title_container_right{
                    margin-top:.1rem;
                }
            }

        }
        .asset_title_container {
            margin: 0.30rem 0 0.16rem 0;
            text-align: left;
            display: flex;
            line-height: 0.3rem;
            color: $t_first_c;
            font-size: $s18;
            font-weight: bold;

            .asset_title_container_left{
                display:flex;
                flex-direction: row;
                align-items: center;
                ._left {
                    margin-right: 0.1rem;
                    font-size:0.18rem;
                    font-family: Arial-BoldMT, Arial;
                    font-weight: normal;
                    color: #171D44;
                }
                ._center {
                    margin-top: -0.04rem;
                }
                ._right {
                    margin: 0 0.1rem;
                    font-size: .14rem;
                    font-family: Arial-BoldMT, Arial;
                    font-weight: normal;
                    color: #171D44;
                }
            }
            .asset_title_container_right{

                height: .2rem;
                font-size: .14rem;
                font-family: ArialMT;
                color: #787C99;
                line-height: .16rem;
            }


        }
        .asset_table_list_content {
            width: 100%;
            margin-bottom:.2rem;
            .pagination_content {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                margin: 0.05rem 0 0.2rem 0;
            }
        }
    }
}
</style>
