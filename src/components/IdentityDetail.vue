<template>
    <div class="identity_detail_container">
        <div class="identity_detail_content_wrap">
            <div class="identity_detail_title">
                <div class="identity_detail_title_first">
                    {{`${$t('ExplorerLang.identityDetail.title')} |`}}
                </div>
                <div class="identity_detail_title_hash">
                    {{id}}
                    <MClip :text="id"></MClip>
                </div>
            </div>
            <div class="identity_information_content">
                <p class="content_title">{{$t('ExplorerLang.identityDetail.baseInfo')}}</p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.owner')}}：</span>
                    <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.credentials')}}：</span>
                    <a v-if="credentials !=='[do-not-modify]' && credentials !=='--'" :href="formatUrl(credentials)" target="_blank">{{credentials}}</a>
                    <span v-else>{{credentials}}</span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.createTxHash')}}：</span>
                    <span><router-link :to="`/tx?txHash=${createTxHash}`">{{createTxHash}}</router-link></span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.createHeight')}}：</span>
                    <span><router-link :to="`/block/${createHeight}`">{{createHeight}}</router-link></span>
                </p>
                <p class="identity_information_list_item">
                    <span>{{$t('ExplorerLang.identityDetail.createTime')}}：</span>
                    <span>{{createTime}}</span>
                </p>
            </div>
            <div class="identity_detail_bg">
                <div class="content_title">{{$t('ExplorerLang.identityDetail.credentialsInfo')}}</div>
                <el-table class="table" :data="pubkeyList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :width="ColumnMinWidth.idPubKeyFull" :label="$t('ExplorerLang.table.idPubkey')">
                        <template slot-scope="scope">
                            <LargeString :text="scope.row.pubkey" mode="cell" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.pubKeyAlgo" :label="$t('ExplorerLang.table.pubKeyAlgo')">
                        <template slot-scope="scope">
                            <span>{{scope.row.pubKeyAlgo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.txHash"
                                        placement="top">
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')">
                        <template slot-scope="scope">
                            <span>{{scope.row.time}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination_content" v-if="pubkeyListCount > pubkeyListPageSize">
                    <m-pagination :page-size="pubkeyListPageSize"
                                  :total="pubkeyListCount"
                                  :page="pubkeyListPageNum"
                                  :page-change="pubkeyPageChange">
                    </m-pagination>
                </div>
                <div v-else style="height:30px"></div>
                <el-table class="table" :data="certificateList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :min-width="ColumnMinWidth.certificateFull" :label="$t('ExplorerLang.table.certificate')">
                        <template slot-scope="scope">
                            <LargeString v-if="scope.row.certificate" :text="scope.row.certificate" mode="cell" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.txHash"
                                        placement="top">
                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
                        <template slot-scope="scope">
                            <span>{{scope.row.time}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination_content" v-if="certificateListCount > certificateListPageSize">
                    <m-pagination :page-size="certificateListPageSize"
                                  :total="certificateListCount"
                                  :page="certificateListPageNum"
                                  :page-change="certificatePageChange">
                    </m-pagination>
                </div>
            </div>
            <div class="identity_detail_bg">
                <div class="content_title">{{$t('ExplorerLang.identityDetail.txRecord')}}</div>
                <TxListComponent :txData="txList"></TxListComponent>
                <div class="pagination_content" v-if="txListCount > txListPageSize">
                    <m-pagination :page-size="txListPageSize"
                                  :total="txListCount"
                                  :page="txListPageNum"
                                  :page-change="txPageChange">
                    </m-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools";
    import MPagination from "./common/MPagination";
    import MClip from "./common/MClip.vue";
    import {TxHelper} from "../helper/TxHelper";
    import TxListComponent from "./common/TxListComponent";
    import {getIdentityDetail,
            getPubkeyListByIdentity,
            getCertificateListByIdentity,
            getTxListByIdentity} from "../service/api";
    import { TX_TYPE, TX_STATUS,ColumnMinWidth } from '../constant';
    import LargeString from './common/LargeString';
    export default {
        name : "TxDetail",
        components : {MPagination, MClip, TxListComponent, LargeString},
        data(){
            return {
                Tools,
                TX_TYPE,
                TX_STATUS,
                ColumnMinWidth,
                id:this.$route.params.id,
                owner: '',
                credentials: '',
                createTxHash: '',
                createHeight: '',
                createTime: '',
                pubkeyList:[],
                pubkeyListPageNum:1,
                pubkeyListPageSize: 5,
                pubkeyListCount:0,
                certificateList:[],
                certificateListPageNum:1,
                certificateListPageSize: 5,
                certificateListCount:0,
                txList:[],
                txListPageNum:1,
                txListPageSize: 10,
                txListCount:0,
                LargeStringMinHeight: 69,
                LargeStringLineHeight:23
            }
        },
        mounted(){
            this.getIdentityDetail();
            this.getPubkeyListCount();
            this.getPubkeyList();
            this.getCertificateListCount();
            this.getCertificateList();
            this.getTxList();
        },
        methods : {
            async getIdentityDetail(){
                try {
                    const res = await getIdentityDetail(this.id);
                    if(res){
                        this.owner = res.owner || '';
                        this.credentials = res.credentials || '--';
                        this.createTxHash = res.create_tx_hash || '--';
                        this.createHeight = res.create_block_height || '--';
                        this.createTime = Tools.formatLocalTime(res.create_block_time);
                    }
                } catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            pubkeyPageChange(pageNum){
                if(this.pubkeyListPageNum === pageNum) return;
                this.pubkeyListPageNum = pageNum;
                this.getPubkeyList();
            },
            certificatePageChange(pageNum){
                if(this.certificateListPageNum === pageNum) return;
                this.certificateListPageNum = pageNum;
                this.getCertificateList();
            },
            txPageChange(pageNum){
                if(this.txListPageNum === pageNum) return;
                this.txListPageNum = pageNum;
                this.getTxList();
            },
            async getPubkeyList(){
                try {
                    const res = await getPubkeyListByIdentity(this.id, this.pubkeyListPageNum, this.pubkeyListPageSize, false);
                    if(res?.data.length > 0){
                        this.pubkeyList = res.data.map((item) =>{
                            let result = {
                                pubkey: (item.pubkey || {}).pubkey || '',
                                pubKeyAlgo: (item.pubkey || {}).algorithm || '',
                                txHash: item.hash || '',
                                time: Tools.formatLocalTime(item.time),
                            };
                            return result;
                        });
                    } else {
                      this.pubkeyList = []
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            async getPubkeyListCount(){
              try {
                  const res = await getPubkeyListByIdentity(this.id, null, null, true);
                  if(res?.count){
                    this.pubkeyListCount = res.count;
                  } else {
                    this.pubkeyListCount = 0
                  }
              } catch (e) {
                  console.error(e);
              }
            },
            async getCertificateList(){
                try {
                    const res = await getCertificateListByIdentity(this.id, this.certificateListPageNum, this.certificateListPageSize, false);
                    if(res?.data.length > 0){
                        this.certificateList = res.data.map((item) =>{
                            let result = {
                                certificate: item.certificate || '--',
                                txHash: item.hash || '--',
                                time: Tools.formatLocalTime(item.time),
                            };
                            return result;
                        });
                    } else {
                      this.certificateList = []
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            async getCertificateListCount(){
              try {
                  const res = await getCertificateListByIdentity(this.id, null, null,true);
                  if(res?.count){
                    this.certificateListCount = res.count;
                  } else {
                    this.certificateListCount = 0
                  }
              } catch (e) {
                  console.error(e);
              }
            },
            async getTxList(){
                try {
                    this.txList = [];
                    const res = await getTxListByIdentity(this.id, this.txListPageNum, this.txListPageSize, true);
                    if(res){
                        this.txListCount = res.count;
                        this.txList = res.data;
                    }
                } catch (e) {
                    console.error(e);
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
            formatUrl(url){
                if (!(/^http:\/\/|^https:\/\//).test(url)) {
                    return `http://${url}`;
                }
                return url;
            }
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }
    ::v-deep .cell {
        padding: 0 0.08rem;
    }
    .identity_detail_container {
        padding: 0 0.15rem;
        .identity_detail_content_wrap {
            max-width: 12rem;
            margin: 0 auto 0.4rem auto;
            .identity_detail_title {
                display: flex;
                justify-content: flex-start;
                color: $t_first_c;
                font-size: $s18;
                line-height: 0.21rem;
                margin: 0.3rem 0 0.15rem 0.25rem;
                text-align: left;
                font-family: Arial;
                font-weight: 600;
                .identity_detail_title_first {
                    white-space: nowrap;
                    margin-right: 0.05rem;
                }
                .identity_detail_title_hash {
                    font-size: $s14;
                    font-weight: 400;
                    color: $t_first_c;
                    line-height: 0.2rem;
                    word-break: break-all;
                    margin-right:0.05rem;
                }
            }
            .identity_information_content {
                box-sizing: border-box;
                padding: 0.25rem;
                background: $bg_white_c;
                text-align: left;
                border-radius: 0.05rem;
                border: 1px solid $bd_first_c;
                .identity_information_list_item {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 0.26rem;
                    a{
                        font-size: $s14;
                        line-height: 1;
                    }
                    span:nth-of-type(1) {
                        margin-right:0.15rem;
                        text-align: left;
                        min-width: 1.5rem;
                        color: $t_second_c;
                        font-size: $s14;
                        line-height: 0.16rem;
                        font-family: Arial;
                        font-weight: 600;
                    }
                    span:nth-of-type(2) {
                        text-align: left;
                        flex: 1;
                        color: $t_first_c;
                        font-size: $s14;
                        line-height: 0.16rem;
                        word-break: break-all;
                    }
                }
                .identity_information_list_item:last-child {
                    margin-bottom: 0;
                }
            }
            ::v-deep .identity_detail_bg{
                margin-top:0.48rem;
                background: $bg_white_c;
                padding:0.25rem;
                border-radius:0.05rem;
                border:1px solid $bd_first_c;
                .el-table{
                    .el-table__header-wrapper{
                        .el-table__header{
                            .has-gutter{
                                tr{
                                    th:first-child{
                                        .cell{
                                            padding-left: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .el-table__body-wrapper{
                        .el-table__body{
                            tbody{
                                .el-table__row{
                                    td:first-child{
                                        .cell{
                                            padding-left: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .content_title{
                color: $t_first_c;
                margin-bottom: 0.4rem;
                text-align: left;
                font-size: $s16;
                font-family:Arial;
                font-weight:600;
                line-height:22px;
            }
            .pagination_content{
                margin: 0.2rem 0 0.2rem 0;
                display: flex;
                justify-content: flex-end;
            }
            .status_icon{
                width:0.13rem;
                height:0.13rem;
                margin-right:0.05rem;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .identity_detail_container {
            .identity_detail_content_wrap {

                .identity_detail_title {

                    .identity_detail_title_first {

                    }
                    .identity_detail_title_hash {

                    }
                }
                .identity_information_content {

                    .identity_information_list_item {

                        span:nth-of-type(1) {
                            min-width: 1rem;
                        }
                        span:nth-of-type(2) {

                        }
                    }
                    .identity_information_list_item:last-child {
                    }
                }
                .identity_detail_bg{

                }
                .content_title{

                }
                .pagination_content{

                }
                .status_icon{

                }
            }
        }
    }
</style>
