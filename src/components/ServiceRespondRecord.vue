<template>
    <div class="service_respond_record_container">
        <div class="service_respond_record_content_wrap">
            <p class="service_respond_record_title">
                {{$t('ExplorerLang.serviceDetail.respondRecord')}}
                {{$route.params.serviceName}}
                <span class="service_respond_record_spread">
                    |
                </span>
                <span class="service_respond_record_provider">
                    {{$t('ExplorerLang.serviceDetail.provider')}}
                    <span class="service_respond_record_provider_content">
                        <router-link :to="`/address/${$route.params.provider}`">
                            {{$route.params.provider}}
                        </router-link>
                    </span>
                </span>
            </p>
            <div class="service_respond_record_definition_content">
                <h3 class="service_respond_record_definition_title">
                    {{$t('ExplorerLang.serviceDetail.primary')}}
                </h3>
                <div class="service_respond_record_content" :class="productionConfig.lang === 'CN' ? 'cn': ''">
                    <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.table.isAvailable')}}:</span>
                        <span>{{isAvailable}}</span>
                    </p>
                    <!-- <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.pricing')}}:</span>
                        <span>{{price}}</span>
                    </p> -->
                    <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.qos')}}:</span>
                        <span>{{`${qos} ${$t('ExplorerLang.unit.blocks')}`}} </span>
                    </p>
                    <p v-if="isShowFee" class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.deposit')}}:</span>
                        <span>{{deposit}}</span>
                    </p>
                    <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.hash')}}:</span>
                        <span>
                             <router-link :to="`/tx?txHash=${hash}`">
                                {{hash}}
                            </router-link>
                        </span>
                    </p>
                    <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.owner')}}:</span>
                        <span>
                            <router-link :to="`/address/${owner}`">
                                {{owner}}
                            </router-link>
                        </span>
                    </p>
                    <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.bindTime')}}:</span>
                        <span>{{bindTime}}</span>
                    </p>

                    <p class="service_respond_record_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.serviceBindings.disabledTime')}}:</span>
                        <span>{{disabledTime}}</span>
                    </p>

                </div>
            </div>
            <div class="service_respond_record_transaction_content">
                <h3 class="service_respond_record_transaction_title">
                    {{$t('ExplorerLang.serviceDetail.txRecord')}}
                </h3>
                <div class="service_respond_record_transaction_table_content">
                    <el-table class="table" :data="txList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                        <el-table-column class-name="hash_status" :min-width="ColumnMinWidth.respondHash" :label="$t('ExplorerLang.table.respondHash')">
                            <template slot-scope="scope">
                                <img class="service_tx_status"
                                     v-if="scope.row.respondStatus === TX_STATUS.success"
                                     src="../assets/success.png"/>
                                <img class="service_tx_status"
                                     v-else
                                     src="../assets/failed.png"/>
                                <el-tooltip placement="top" :content="scope.row.respondHash">
                                    <router-link :to="`/tx?txHash=${scope.row.respondHash}`">
                                        {{formatTxHash(scope.row.respondHash)}}
                                    </router-link>
                                </el-tooltip>

                            </template>
                        </el-table-column>
                        <el-table-column :width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')"
                                         prop="type"></el-table-column>

                        <el-table-column class-name="requestId" :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
                            <template slot-scope="scope">
                                <el-tooltip placement="top" :content="scope.row.requestContextId"
                                            v-if="scope.row.requestContextId">
                                    <span>
                                        {{formatAddress(scope.row.requestContextId)}}
                                    </span>
                                </el-tooltip>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>

                        <el-table-column :min-width="ColumnMinWidth.blockListHeight" :label="$t('ExplorerLang.table.block')">
                            <template slot-scope="scope">
                                <router-link :to="`/block/${scope.row.height}`">
                                    {{scope.row.height}}
                                </router-link>
                            </template>
                        </el-table-column>

                        <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" 
                                         prop="time"></el-table-column>
                        <el-table-column class-name="address" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.consumer')">
                            <template slot-scope="scope">
                                <el-tooltip placement="top" :content="scope.row.consumer">
                                    <router-link :to="`/address/${scope.row.consumer}`">{{formatAddress(scope.row.consumer)}}
                                    </router-link>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column class-name="hash_status" :min-width="ColumnMinWidth.requestHash"
                                         :label="$t('ExplorerLang.table.requestHash')">
                                <template slot-scope="scope">
                                    <img class="service_tx_status"
                                         src="../assets/success.png"/>

                                    <el-tooltip placement="top" :content="scope.row.requestHash">
                                        <router-link :to="`/tx?txHash=${scope.row.requestHash}`">
                                            {{formatTxHash(scope.row.requestHash)}}
                                        </router-link>
                                    </el-tooltip>
                                </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination_content" v-show="txCount > txPageSize">
                    <keep-alive>
                        <m-pagination :page-size="txPageSize"
                                      :total="txCount"
                                      :page="txPageNum"
                                      :page-change="pageChange">
                        </m-pagination>
                    </keep-alive>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools"
    import MPagination from "./common/MPagination";
    import {
      getRespondServiceRecord,
      getServiceRespondInfo,
      getServiceBindingByServiceName, getAllTxTypes,
    } from "../service/api";
    import { TX_STATUS,ColumnMinWidth } from '../constant';
    import {converCoin, getTxType} from '../helper/IritaHelper';
    import productionConfig from '@/productionConfig.js';
    export default {
        name : "ServiceInformation",
        components : {MPagination},
        data(){
            return {
                isShowFee: productionConfig.fee.isShowFee,
                TX_STATUS,
                productionConfig,
                ColumnMinWidth,
                txList : [],
                txPageSize : 10,
                txPageNum : 1,
                txCount : 0,
                isAvailable : '',
                price : '',
                qos : '',
                deposit : '',
                hash : '',
                owner : '',
                bindTime : '',
                disabledTime : '',
                providerPageSize : 10,
                providerCount : 0,
                providerPageNum : 1,
                Tools,

            }
        },
        mounted(){
            this.getServiceInfo();
            this.getRespondTxListCount();
            this.getRespondTxList();
        },
        methods : {
            pageChange(pageNum){
              this.txPageNum = pageNum;
              this.getRespondTxList();
            },
            async getServiceInfo(){
                try {
                    const serviceInfo = await getServiceRespondInfo(this.$route.params.serviceName, this.$route.params.provider);
                    const bindings = await getServiceBindingByServiceName(this.$route.params.serviceName, this.$route.params.provider);
                    if(serviceInfo){
                        this.hash = serviceInfo.hash;
                        this.owner = serviceInfo.owner;
                        this.bindTime = Tools.getDisplayDate(serviceInfo.time);
                    }
                    if(bindings && bindings.result){
                        let {available, pricing, qos, deposit, disabled_time} = bindings.result;
                        this.isAvailable = available ? this.$t('ExplorerLang.common.true') : this.$t('ExplorerLang .common.false');
                        this.price = pricing;
                        this.qos = qos;
                        if(deposit && deposit[0] && this.isShowFee) {
                            deposit = await converCoin(deposit[0])
                            this.deposit = `${deposit.amount} ${deposit.denom.toUpperCase()}`;
                        } else {
                            this.deposit = '--'
                        }
                        
                        this.disabledTime = available ? '--' : Tools.getFormatDate(disabled_time);
                    }

                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },

            async getRespondTxList(){
                try {
                    const res = await getRespondServiceRecord(
                        this.$route.params.serviceName,
                        this.$route.params.provider,
                        this.txPageNum, 
                        this.txPageSize, 
                        false                      
                    );
                    const txType = await  getTxType()
                    this.txList = res.data.map((item) =>{
                        return {
                            type : txType.TX_TYPE_DISPLAY[item.type],
                            respondHash : item.respondHash,
                            requestContextId : item.requestContextId,
                            height : item.height,
                            time : Tools.getDisplayDate(item.time),
                            consumer : item.consumer,
                            requestHash : item.requestHash,
                            respondStatus : item.respondStatus,
                        };
                    });
                    this.txPageNum = Number(res.pageNum);
                    this.txPageSize = Number(res.pageSize);
                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

            },
            async getRespondTxListCount(){
                try {
                    const res = await getRespondServiceRecord(
                        this.$route.params.serviceName,
                        this.$route.params.provider,
                        null, 
                        null, 
                        true                      
                    );
                    if(res?.count){
                      this.txCount = res.count;
                    } else {
                      this.txCount = 0
                    }

                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }
    @media screen and (min-width: 910px){
        .service_respond_record_content_wrap{
            max-width: 12rem;
            .service_respond_record_title {
                padding-left: 0.27rem;
                .service_respond_record_provider {
                    margin-right: 0.15rem;
                }
                .service_respond_record_spread {
                    margin: 0 0.15rem;
                }
            }

        }

    }
    @media screen and (max-width: 910px){
        .service_respond_record_content_wrap{
            width:100%;
            padding:0 0.15rem;
            box-sizing: border-box;
            .service_respond_record_title {
                display:flex;
                flex-direction:column;
                .service_respond_record_provider {
                    margin: 0.1rem 0;
                }
                .service_respond_record_spread {
                    display:none;
                }

            }

        }

    }

    .service_respond_record_container {
        padding: 0 0.15rem;
        .service_respond_record_content_wrap {
            max-width: 12rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;

            .service_respond_record_title {
                text-align: left;
                margin: 0.3rem 0 0.15rem 0;
                width: 100%;
                box-sizing: border-box;
                font-size: $s18;
                font-weight: 600;
                color: $t_first_c;
                .service_respond_record_provider {
                    font-size: $s14;
                    margin-right: 0.15rem;
                }
                .service_respond_record_spread {
                    margin: 0 0.15rem;
                }
                .service_respond_record_provider_content {
                    font-size: $s14;
                    word-break: break-word;
                }

            }
            .service_respond_record_definition_content {
                background: $bg_white_c;
                box-sizing: border-box;
                padding: 0.25rem 0.27rem 0.2rem 0.27rem;
                margin-bottom: 0.48rem;
                border-radius:5px;
                border:1px solid $bd_first_c;
                .service_respond_record_definition_title {
                    font-size: $s18;
                    color: $t_first_c;
                    font-weight: 600;
                    margin-bottom: 0.36rem;
                    text-align: left;
                }
                .service_respond_record_content {
                    box-sizing: border-box;
                    background: $bg_white_c;
                    .service_respond_record_text_content {
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 0.26rem;
                        span:nth-of-type(1) {
                            font-size: $s14;
                            line-height: 0.16rem;
                            color: $t_second_c;
                            min-width: 1.8rem;
                            text-align: left;
                            font-weight: 600;
                        }
                        span:last-child {
                            font-size: $s14;
                            line-height: 0.16rem;
                            color: $t_first_c;
                            flex: 1;
                            text-align: left;
                            word-break: break-all;
                        }
                    }
                    .service_respond_record_text_content:last-child {
                        margin-bottom: 0;
                    }

                }
            }
            .service_respond_record_transaction_content {
                background: $bg_white_c;
                box-sizing: border-box;
                padding: 0.25rem 0.27rem 0.2rem 0.27rem;
                border-radius:5px;
                border:1px solid $bd_first_c;
                margin-bottom: 0.2rem;
                .service_respond_record_transaction_title {
                    font-size: $s18;
                    color: $t_first_c;
                    font-weight: 600;
                    margin-bottom: 0.36rem;
                    text-align: left;
                }
                .service_respond_record_transaction_condition_container {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 0.4rem;
                    align-items: center;
                    .service_respond_record_transaction_condition_count {
                        font-size: $s14;
                        margin-right: 0.42rem;
                        font-weight: 600;

                    }
                    ::v-deep .el-select {
                        width: 1.3rem;
                        margin-right: 0.22rem;
                        .el-input {
                            .el-input__inner {
                                padding-left: 0.07rem;
                                height: 0.32rem;
                                font-size: $s14 !important;
                                line-height: 0.32rem;
                                &::-webkit-input-placeholder {
                                    font-size: $s14 !important;
                                }
                            }
                            .el-input__inner:focus {
                                border-color: $theme_c !important;
                            }
                            .el-input__suffix {
                                .el-input__suffix-inner {
                                    .el-input__icon {
                                        line-height: 0.32rem;
                                    }
                                }
                            }
                        }
                        .is-focus {
                            .el-input__inner {
                                border-color: $theme_c !important;
                            }
                        }

                    }
                    .search_btn {
                        cursor: pointer;
                        background: $bg_button_c;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        padding: 0.05rem 0.18rem;
                        font-size: $s14;
                        line-height: 0.2rem;
                        white-space: nowrap;
                    }
                }
                .service_respond_record_transaction_table_content {
                    background: $bg_white_c;
                    .service_tx_status {
                        position: relative;
                        top: 0.02rem;
                        width:0.13rem;
                        height:0.13rem;
                    }
                    .service_tx_to_container {

                        .service_tx_muti_to_container {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            .service_tx_muti_to_ellipsis {
                                color: $t_link_c;
                            }
                        }
                    }
                }
            }
            .pagination_content {
                display: flex;
                justify-content: flex-end;
                margin-top: 0.25rem;
                //background: $bg_white_c;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .service_respond_record_container {

            .service_respond_record_content_wrap {

                .service_respond_record_definition_content {
                    padding: 0.12rem;
                    .service_respond_record_definition_title {

                    }
                    .service_respond_record_content {

                        .service_respond_record_text_content {

                            span:nth-of-type(1) {
                                min-width: 1.8rem;
                            }
                            span:last-child {

                            }
                        }
                        .service_respond_record_text_content:last-child {

                        }
                    }
                    .cn {

                        .service_respond_record_text_content {

                            span:nth-of-type(1) {
                                min-width: 1rem;
                            }
                            span:last-child {

                            }
                        }
                        .service_respond_record_text_content:last-child {

                        }
                    }
                }
                .service_respond_record_transaction_content {
                    padding: 0.12rem;
                    .service_respond_record_transaction_title {

                    }
                    .service_respond_record_transaction_table_content {

                    }
                }
                .pagination_content {

                }
            }
        }
    }
</style>
