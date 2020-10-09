<template>
    <div class="service_information_container">
        <div class="service_information_content_wrap">
            <p class="service_information_title">
                {{$t('ExplorerLang.serviceDetail.serviceDefinition')}}
                {{$route.query.serviceName}}
            </p>
            <div class="service_information_definition_content">
                <h3 class="service_information_definition_title">
                    {{$t('ExplorerLang.serviceDetail.primary')}}
                </h3>
                <div class="service_information_content">
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.description')}}：</span>
                        <span>{{description}}</span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.author')}}：</span>
                        <span>{{author}}</span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.authorDescription')}}：</span>
                        <span>{{authorDescription}}</span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.schema')}}：</span>
                        <span>{{schemas}}</span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.tags')}}：</span>
                        <span>{{tags}}</span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.hash')}}：</span>
                        <span>
                             <router-link :to="`tx?txHash=${hash}`">
                                {{hash}}
                            </router-link>
                        </span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.height')}}：</span>
                        <span>{{height}}</span>
                    </p>
                    <p class="service_information_text_content">
                        <span>{{$t('ExplorerLang.serviceDetail.time')}}：</span>
                        <span>{{time}}</span>
                    </p>

                </div>
            </div>
            <div class="service_information_bindings_content">
                <h3 class="service_information_binding_title">
                    {{$t('ExplorerLang.serviceDetail.serviceBindings.providers')}}</h3>
                <div class="service_information_bindings_table_content">
                    <el-table class="table" :data="serviceList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                        <el-table-column :min-width="ColumnMinWidth.address"
                                         :label="$t('ExplorerLang.table.provider')">
                            <template slot-scope="scope">
                                <span>
                                    <el-tooltip placement="top" :content="scope.row.provider">
                                    <router-link :to="`/address/${scope.row.provider}`">
                                        {{Tools.formatValidatorAddress(scope.row.provider)}}
                                    </router-link>
                                </el-tooltip>

                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.respondTimes" :label="$t('ExplorerLang.table.respondTimes')">
                            <template slot-scope="scope">
                                <span>
                                    <router-link
                                            :to="`service/respond/${$route.query.serviceName}/${scope.row.provider}`">
                                        {{`${scope.row.respondTimes} ${$t('ExplorerLang.unit.time')}`}} 
                                    </router-link>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.available"
                                         :label="$t('ExplorerLang.table.isAvailable')">
                            <template slot-scope="scope">
                                <div class="service_information_available_container">
                                    <img class="service_tx_status"
                                         v-if="scope.row.available"
                                         src="../assets/true.png"/>
                                    <img class="service_tx_status"
                                         v-else
                                         src="../assets/false.png"/>
                                    <span>
                                        {{scope.row.isAvailable}}
                                    </span>
                                </div>

                            </template>
                        </el-table-column>
                        <!-- <el-table-column :min-width="ColumnMinWidth.price"
                                         :label="$t('ExplorerLang.table.price')"
                                         prop="price"></el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.deposit"
                                         :label="$t('ExplorerLang.table.deposit')"
                                         prop="deposit"></el-table-column> -->
                        <el-table-column :min-width="ColumnMinWidth.qos" :label="$t('ExplorerLang.table.minBlock')"
                                         prop="qos"></el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.time"
                                         :label="$t('ExplorerLang.table.bindTime')"
                                         prop="bindTime"></el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.time"
                                         :label="$t('ExplorerLang.table.disabledTime')"
                                         prop="disabledTime"></el-table-column>
                    </el-table>
                </div>
                <div class="pagination_content" v-show="providerCount > providerPageSize">
                    <m-pagination :page-size="providerPageSize"
                                  :total="providerCount"
                                  :page="providerPageNum"
                                  :page-change="providerPageChange">

                    </m-pagination>
                </div>
            </div>

            <div class="service_information_transaction_content">
                <h3 class="service_information_transaction_title">
                    {{$t('ExplorerLang.serviceDetail.serviceTransactions')}}
                </h3>
                <div class="service_information_transaction_condition_container">
                    <span class="service_information_transaction_condition_count">
                        {{`${txCount} ${$t('ExplorerLang.unit.Txs')}`}}
                    </span>
                    <el-select v-model="type" filterable>
                        <el-option v-for="(item, index) in txTypeOption"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="status">
                        <el-option v-for="(item, index) in statusOpt"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <div class="tx_type_mobile_content">
                        <div class="search_btn" @click="handleSearchClick">
                            {{$t('ExplorerLang.transactions.search')}}
                        </div>
                        <div class="reset_btn" @click="resetFilterCondition">
                            <i class="iconfont iconzhongzhi"></i>
                        </div>
                    </div>
                </div>

                <div class="service_information_transaction_table_content">
                    <el-table class="table" :data="transactionArray" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                        <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                            <template slot-scope="scope">
                                <img class="service_tx_status"
                                     v-if="scope.row.status === TX_STATUS.success"
                                     src="../assets/success.png"/>
                                <img class="service_tx_status"
                                     v-else
                                     src="../assets/failed.png"/>
                                <el-tooltip placement="top" :content="scope.row.txHash">
                                    <router-link :to="`tx?txHash=${scope.row.txHash}`">
                                        {{formatTxHash(scope.row.txHash)}}
                                    </router-link>
                                </el-tooltip>

                            </template>
                        </el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')"
                                         prop="type"></el-table-column>

                        <el-table-column :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
                            <template slot-scope="scope">
                                <el-tooltip placement="top" :content="scope.row.id" :disabled="!isValid(scope.row.id)">
                                    <span>{{formatAddress(scope.row.id)}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.from')">
                            <template slot-scope="scope">

                                <el-tooltip placement="top" :content="scope.row.from"
                                            :disabled="!isValid(scope.row.from)">
                                    <router-link v-if="isValid(scope.row.from)" :to="`/address/${scope.row.from}`">
                                        {{formatAddress(scope.row.from)}}
                                    </router-link>
                                    <span v-else>--</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.to')">
                            <template slot-scope="scope">
                                <el-tooltip placement="top" :content="String(scope.row.to)"
                                            :key="Math.random()"
                                            :disabled="!isValid(scope.row.to) || Array.isArray(scope.row.to)">
                                    <router-link v-if="typeof scope.row.to=='string' && isValid(scope.row.to)" :to="`/address/${scope.row.to}`">
                                        {{formatAddress(scope.row.to)}}
                                    </router-link>
                                    <router-link v-else-if="isValid(scope.row.to)" :to="`/tx?txHash=${scope.row.txHash}`">
                                        {{ `${scope.row.to.length} ${$t('ExplorerLang.unit.providers')}`}}
                                    </router-link>
                                    <span v-else>{{'--'}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
                            <template slot-scope="scope">
                                <router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
                            </template>
                        </el-table-column>

                        <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" 
                                         prop="timestamp"></el-table-column>
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
    import { TX_STATUS,ColumnMinWidth } from '../constant';
    import {
        getAllServiceTxTypes,
        getServiceDetail,
        getServiceBindingTxList,
        getServiceTxList,
        getServiceBindingByServiceName
    } from "../service/api";
    import { TxHelper } from "../helper/TxHelper";

    export default {
        name : "ServiceInformation",
        components : {MPagination},
        data(){
            return {
                TX_STATUS,
                ColumnMinWidth,
                from : '',
                chainId : '',
                publisher : '',
                description : '',
                idlContent : '',
                serviceList : [],
                transactionArray : [],
                txPageSize : 10,
                txPageNum : 1,
                txCount : 0,
                author : '',
                authorDescription : '',
                name : '',
                schemas : '',
                tags : '',
                hash : '',
                height : '',
                time : '',
                providerPageSize : 10,
                providerCount : 0,
                providerPageNum : 1,
                Tools,
                txType : '',
                txStatus : '',
                status : '',
                type : '',
                statusOpt : [
                    {
                        value : '',
                        label : this.$t('ExplorerLang.common.allTxStatus')
                    },
                    {
                        value : 1,
                        label : this.$t('ExplorerLang.common.success')
                    },
                    {
                        value : 0,
                        label : this.$t('ExplorerLang.common.failed')
                    }
                ],
                txTypeOption : [
                    {
                        value : '',
                        label : this.$t('ExplorerLang.common.allTxType')
                    },
                ],

            }
        },
        mounted(){
            this.getServiceInformation();
            this.getServiceBindingList();
            this.getServiceTransaction();
            this.getAllTxType();
        },
        methods : {
            pageChange(pageNum){
                this.txPageNum = pageNum;
                this.getServiceTransaction();
            },
            isValid(value){
                return (!value || !value.length || value=="--") ? false : true;
            },
            async getServiceInformation(){
                const res = await getServiceDetail(this.$route.query.serviceName);
                try {
                    console.log('---', res)
                    if(res.msgs && res.msgs.length > 0 && res.msgs[0].msg){
                        const {author, author_description, description, name, schemas, tags} = res.msgs[0].msg;
                        this.author = author;
                        this.authorDescription = author_description ? author_description : '--';
                        this.description = description || '--';
                        this.name = name || '--';;
                        this.schemas = schemas || '--';;
                        this.tags = tags.length > 0 ? tags : '--';
                        this.hash = res.tx_hash;
                        this.height = res.height;
                        this.time = Tools.getDisplayDate(res.time);
                    }

                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            async getServiceBindingList(){
                try {
                    const serviceList = await getServiceBindingTxList(this.$route.query.serviceName, this.providerPageNum, this.providerPageSize);
                    console.log(serviceList)
                    if(serviceList && serviceList.data){
                        let bindings = await getServiceBindingByServiceName(this.$route.query.serviceName);
                        console.log(bindings)
                        if(bindings.result){
                            serviceList.data.forEach((s) =>{
                                s.bindTime = Tools.getDisplayDate(s.bindTime);
                                bindings.result.forEach((b) =>{
                                    let deposit = `${b.deposit[0].amount} ${b.deposit[0].denom}`;
                                    if(s.provider === b.provider){
                                        s.isAvailable = b.available ? 'True' : 'False';
                                        s.available = b.available;
                                        s.price = JSON.parse(b.pricing).price;
                                        s.qos = `${b.qos} ${this.$t('ExplorerLang.unit.blocks')}`;
                                        s.deposit = deposit;
                                        s.disabledTime = b.available ? '--' : Tools.getFormatDate(b.disabled_time);
                                    }
                                })
                            })
                        }
                        console.log(serviceList)
                        this.serviceList = serviceList.data;
                        this.providerCount = Number(serviceList.count);
                        this.providerPageSize = Number(serviceList.pageSize);
                        this.providerPageNum = Number(serviceList.pageNum);
                    }
                } catch (e) {
                    console.error(e)
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }


            },
            async providerPageChange(pageNum){
                this.providerPageNum = pageNum;
                this.getServiceBindingList();
            },

            async getServiceTransaction(){
                try {
                    const res = await getServiceTxList(
                        this.txType,
                        this.txStatus,
                        this.$route.query.serviceName,
                        this.txPageNum,
                        this.txPageSize
                    );

                    this.transactionArray = res.data.map((item) =>{
                        let addrObj = TxHelper.getFromAndToAddressFromMsg(item.msgs[0]);
                        let requestContextId = TxHelper.getContextId(item.msgs[0], item.events) || '--';
                        let from = (addrObj && addrObj.from) ? addrObj.from : '--',
                            to = (addrObj && addrObj.to) ? addrObj.to : '--';
                        return {
                            type : item.type,
                            from,
                            status : item.status,
                            txHash : item.hash,
                            id : requestContextId,
                            to,
                            height : item.height,
                            timestamp : Tools.getDisplayDate(item.time)
                        };

                    });
                    console.log(this.transactionArray);
                    this.txCount = res.count;
                    this.txPageNum = Number(res.pageNum);
                    this.txPageSize = Number(res.pageSize);
                } catch (e) {
                    console.error(e)
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            async getAllTxType(){
                try {
                    const res = await getAllServiceTxTypes();
                    res.data.forEach((type) =>{
                        this.txTypeOption.push({
                            value : type.typeName,
                            item : type.typeName,
                        });
                    });
                } catch (e) {
                    console.error(e);
                    // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

            },
            handleSearchClick(){
                this.txStatus = this.status;
                this.txType = this.type;
                this.txPageNum = 1;
                this.getServiceTransaction();
            },
            resetFilterCondition(){
                this.txStatus = this.status = '';
                this.txType = this.type = '';
                this.txPageNum = 1;
                this.getServiceTransaction();
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

    @media screen and (max-width: 910px){
        .service_information_content_wrap{
            width:100%;
            padding:0 0.15rem;
            box-sizing: border-box;
            .service_information_transaction_condition_container{
                .service_information_transaction_condition_count {
                    
                }
                /deep/ .el-select {
                    
                }
                .search_btn {

                }
            }
        }

    }

    .service_information_container {
        padding: 0 0.15rem;
        .service_information_content_wrap {
            max-width: 12rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            .service_information_title {
                text-align: left;
                margin: 0.3rem 0 0.15rem 0;
                width: 100%;
                box-sizing: border-box;
                font-size: $s18;
                font-weight: 600;
                color: $t_first_c;
            }
            .service_information_definition_content {
                background: $bg_white_c;
                box-sizing: border-box;
                padding: 0.25rem 0.27rem 0.2rem 0.27rem;
                margin-bottom: 0.48rem;
                border-radius: 5px;
                border: 1px solid $bd_first_c;
                .service_information_definition_title {
                    font-size: $s18;
                    color: $t_first_c;
                    font-weight: 600;
                    margin-bottom: 0.36rem;
                    text-align: left;
                }
                .service_information_content {
                    box-sizing: border-box;
                    background: $bg_white_c;
                    .service_information_text_content {
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 0.26rem;
                        span:nth-of-type(1) {
                            margin-right:0.15rem;
                            font-size: $s14;
                            line-height: 0.16rem;
                            color: $t_second_c;
                            min-width: 1.5rem;
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
                    .service_information_text_content:last-child {
                        margin-bottom: 0;
                    }

                }
            }
            .service_information_bindings_content {
                background: $bg_white_c;
                box-sizing: border-box;
                padding: 0.25rem 0.27rem 0.2rem 0.27rem;
                margin-bottom: 0.48rem;
                border-radius: 5px;
                border: 1px solid $bd_first_c;
                .service_information_binding_title {
                    font-size: $s18;
                    color: $t_first_c;
                    font-weight: 600;
                    margin-bottom: 0.36rem;
                    text-align: left;
                }
                .service_information_bindings_table_content {
                    background: $bg_white_c;
                    .service_information_available_container {
                        display: flex;
                        align-items: center;
                    }
                }
            }
            .service_information_transaction_content {
                background: $bg_white_c;
                box-sizing: border-box;
                padding: 0.25rem 0.27rem 0.2rem 0.27rem;
                border-radius: 5px;
                border: 1px solid $bd_first_c;
                .service_information_transaction_title {
                    font-size: $s18;
                    color: $t_first_c;
                    font-weight: 600;
                    margin-bottom: 0.36rem;
                    text-align: left;
                }
                .service_information_transaction_condition_container {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 0.4rem;
                    align-items: center;
                    .service_information_transaction_condition_count {
                        font-size: $s14;
                        margin-right: 0.42rem;
                        font-weight: 600;

                    }
                    /deep/ .el-select {
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
                    .tx_type_mobile_content{
                        display: flex;
                        align-items: center;
                        .search_btn {
                            cursor: pointer;
                            background: $bg_button_c;
                            color: $t_button_c;
                            border-radius: 0.04rem;
                            padding: 0.05rem 0.18rem;
                            font-size: $s14;
                            line-height: 0.2rem;
                        }
                        .reset_btn {
                            cursor: pointer;
                            background: $bg_button_c;
                            margin-left: 0.1rem;
                            color: $t_button_c;
                            border-radius: 0.04rem;
                            padding: 0.05rem 0.1rem;
                            font-size: $s14;
                            line-height: 0.2rem;
                        }
                    }

                }
                .service_information_transaction_table_content {
                    background: $bg_white_c;
                    .service_tx_status {
                        position: relative;
                        top: 0.02rem;
                        width: 0.13rem;
                        height: 0.13rem;
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
        .service_information_container {

            .service_information_content_wrap {

                .service_information_definition_content {
                    .service_information_definition_title {

                    }
                    .service_information_content {

                        .service_information_text_content {

                            span:nth-of-type(1) {
                                min-width: 1rem;
                            }
                            span:last-child {

                            }
                        }
                        .service_information_text_content:last-child {

                        }
                    }
                }
                .service_information_bindings_content {
                    .service_information_binding_title {

                    }
                    .service_information_bindings_table_content {

                    }
                }
                .service_information_transaction_content {
                    .service_information_transaction_title {

                    }
                    .service_information_transaction_table_content {

                    }
                    .service_information_transaction_condition_container {
                        flex-direction: column;
                        align-items: flex-start;
                        .service_information_transaction_condition_count {
                            margin-bottom: 0.1rem;
                        }
                        /deep/ .el-select {
                            width: 100%;
                            margin-bottom: 0.1rem;

                        }
                        .search_btn {

                        }
                    }
                }
                .pagination_content {

                }
            }
        }
    }
</style>
