<template>
    <div class="service_list_container_content">
        <div class="service_list_content_wrap">
            <div class="service_list_content_wrap_title">
                <div class="service_list_title">
                    {{ txCount }} {{$t('ExplorerLang.service.services')}}{{txCount > 1 && $t('ExplorerLang.service.services').length > 2 ? 's':'' }}
                </div>
                <div class="nft_list_header_content">
                    <el-input v-model="iptVal"
                            @change="handleSearchClick"
                            :placeholder="$t('ExplorerLang.service.placeHolder')"></el-input>
                    <div class="tx_type_mobile_content">
                        <div class="search_btn" @click="handleSearchClick">{{$t('ExplorerLang.nftAsset.search')}}</div>
                        <div class="reset_btn" @click="reset"><i class="iconfont iconzhongzhi"></i></div>
                    </div>
                </div>
            </div>
            <div class="service_list_content" v-for="(service,index) in serviceList" :key="index">
                <div class="service_list_top">
                    <span class="service_list_service_name bold_name">
                        <router-link :to="`/service?serviceName=${service.serviceName}`">
                            {{ service.serviceName }}
                        </router-link>
                    </span>
                    <span class="service_list_service_name">
                        <router-link :to="`/service?serviceName=${service.serviceName}`">
                            {{ service.description }}
                        </router-link>
                    </span>
                </div>
                <div class="table">
                    <el-table :data="service.bindList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                        <el-table-column class-name="address" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.provider')">
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
                                            :to="`service/respond/${service.serviceName}/${scope.row.provider}`">
                                            {{`${scope.row.respondTimes} ${$t('ExplorerLang.unit.time')}`}}
                                        </router-link>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="ColumnMinWidth.available" :label="$t('ExplorerLang.table.isAvailable')">
                            <template slot-scope="scope">
                                <div class="service_information_available_container">
                                    <img class="service_tx_status"
                                        v-if="(typeof scope.row.available !== 'undefined')"
                                        :src="require(`../assets/${scope.row.available?'true':'false'}.png`)"/>
                                    <span>
                                        {{(typeof scope.row.available == 'undefined')?'--':(scope.row.available?'True':'False')}}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column :min-width="ColumnMinWidth.price" :label="$t('ExplorerLang.table.price')" prop="price"></el-table-column> -->
                        <el-table-column :min-width="ColumnMinWidth.qos" :label="$t('ExplorerLang.table.minBlock')">
                            <template slot-scope="scope">
                                <span>{{scope.row.qos||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.bindTime')" prop="bindTime"></el-table-column>
                    </el-table>
                </div>	
            </div>
            <div class="pagination_content" v-if="txCount > pageSize">
                <m-pagination :page-size="pageSize"
                    :total="txCount"
                    :page="pageNum"
                    :page-change="pageChange">
                </m-pagination>
            </div>
            <div class="service_list_empty_container" v-if="serviceList.length === 0">
                <img src="../assets/empty.png" alt="" class="service_list_empty">
                <span class="service_list_empty_description">
                    {{ $t('ExplorerLang.table.emptyDescription') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools"
    import MPagination from "./common/MPagination";
    import {getAllServiceTxList, getServiceBindingByServiceName} from "../service/api";
    import { ColumnMinWidth } from '../constant';
    export default {
        name: "ServiceList",
        components: {MPagination},
        data() {
            return {
                ColumnMinWidth,
                pageNum: 1,
                pageSize: 5,
                serviceList:[],
                txCount:0,
                Tools,
                iptVal:'',
            }
        },
        mounted () {
            this.getServiceListCount();
            this.getServiceList();
        },
        methods:{
            async getServiceList(){
                try {
                    let serviceList = await getAllServiceTxList(this.pageNum, this.pageSize, false, this.iptVal);
                    if(serviceList?.data && serviceList.data.length > 0){          
                        for(let service of serviceList.data){
                            try {
                                let bindings = await getServiceBindingByServiceName(service.serviceName);                                                  
                                if(bindings.result){
                                    service.bindList.forEach((s)=>{
                                        s.bindTime = Tools.getDisplayDate(s.bindTime);
                                        bindings.result.forEach((b)=>{
                                            if(s.provider === b.provider){
                                                s.available = b.available;
                                                s.price = JSON.parse(b.pricing).price;
                                                s.qos = `${b.qos??'--'} ${this.$t('ExplorerLang.unit.blocks')}`;
                                            }
                                        })
                                    })
                                }
                            } catch(e) {
                                console.error(e);
                            };                           
                        }
                        this.serviceList = serviceList.data;
                    } else {
                        this.serviceList = []
                    }
                } catch (e) {
                    console.error(e);
                    // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            async getServiceListCount(){
                try {
                    let serviceList = await getAllServiceTxList(null,null,true, this.iptVal);
                    if(serviceList?.count){
                        this.txCount = serviceList.count;
                    } else {
                        this.txCount = 0;
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
            pageChange(pageNum) {
                this.pageNum = pageNum;
                this.getServiceList();
            },
            handleSearchClick(){
                this.pageNum = 1;
                this.getServiceListCount()
                this.getServiceList();
            },
            reset(){
                this.iptVal = '';
                this.handleSearchClick();
            }
        }
    }
</script>

<style scoped lang="scss">
	a{
		color: $t_link_c !important;
	}

	.service_list_container_content{
        @media screen and (min-width: 910px){
            .service_list_title{
                //padding-left: 0.27rem;
            }
            .service_list_content_wrap{
                max-width: 12rem;
            }
            .nft_list_header_content{
                display: flex;
                align-items: center;
                .el-select{
                    ::v-deep .el-input{
                        width: 1.8rem;
                        .el-input__inner{
                            padding-left: 0.07rem;
                            height: 0.32rem;
                            line-height: 0.32rem;
                        }
                        .el-input__inner:focus{
                            border-color: $theme_c !important;
                        }

                        .el-input__suffix{
                            .el-input__suffix-inner{
                                .el-input__icon{
                                    line-height: 0.32rem;
                                }
                            }
                        }
                    }
                }

                ::v-deep .el-input{
                    min-width: 3.5rem;
                    .el-input__inner{
                        padding-left: 0.07rem;
                        height: 0.32rem;
                        font-size: $s14 !important;
                        line-height: 0.32rem;
                    }
                    .el-input__inner:focus{
                        border-color: $theme_c !important;
                    }
                }
                .tx_type_mobile_content{
                    align-items: center;
                }
            }

        }
        @media screen and (max-width: 910px){
            .service_list_content_wrap{
                width:100%;
                padding:0 0.15rem;
                box-sizing: border-box;

            }
            .nft_list_header_content{
                display: flex;
                .el-select{
                    // margin-bottom:0.1rem;
                    ::v-deep .el-input{
                        //width: 1.8rem;
                        .el-input__inner{
                            padding-left: 0.07rem;
                            height: 0.32rem;
                            line-height: 0.32rem;
                        }
                        .el-input__inner:focus{
                            border-color: $theme_c !important;
                        }
                        .el-input__suffix{
                            .el-input__suffix-inner{
                                .el-input__icon{
                                    line-height: 0.32rem;
                                }
                            }
                        }
                    }
                }

                ::v-deep .el-input{
                    // margin-bottom:0.1rem;
                    .el-input__inner{
                        padding-left: 0.07rem;
                        height: 0.32rem;
                        font-size: $s14 !important;
                        line-height: 0.32rem;
                    }
                    .el-input__inner:focus{
                        border-color: $theme_c !important;
                    }
                }
                .tx_type_mobile_content{
                    justify-content: flex-end;
                    // margin-bottom:0.1rem;
                }
            }

        }
        @media screen and (max-width: 540px){ 
            .service_list_content_wrap_title {
                flex-direction: column;
                .nft_list_header_content {
                   .el-input,.tx_type_mobile_content {
                       margin-bottom: 0px;
                   }
                }
            }
        }
		.service_list_content_wrap{
			margin: 0 auto;
            padding:0 0.15rem;
            ::v-deep.el-table{
                .cell{
                    padding-left:0 !important;
                }
            }
            .service_list_empty_container{
                display:flex;
                flex-direction:column;
                align-items: center;
                margin-top:1.32rem;
                .service_list_empty{
                    height:1.78rem;
                    width:1.74rem;
                    margin-bottom:0.18rem;
                }
                .service_list_empty_description{
                    color: $t_second_c;
                    font-size: $s14;

                }
            }
            .service_list_content_wrap_title{
                display: flex;
                margin: 0.3rem 0 0.16rem 0rem;
            }
			.service_list_title{
                text-align: left;
                margin-right: 0.2rem;
                line-height: 0.32rem;
                box-sizing: border-box;
                font-size: $s18;
                font-weight: 600;
                color: $t_first_c;
			}
            .nft_list_header_content{
                .el-select{
                    ::v-deep .el-input{
                        .el-input__inner{
                            font-size: $s14 !important;
                            &::-webkit-input-placeholder{
                                font-size: $s14 !important;
                            }
                        }
                        .el-input__inner:focus{
                            border-color: $theme_c !important;
                        }
                    }
                }

                ::v-deep .el-input{
                    .el-input__inner{
                        font-size: $s14 !important;
                        border: 0.01rem solid $bd_first_c;
                        &::-webkit-input-placeholder{
                            font-size: $s14 !important;
                        }
                    }
                    .el-input__inner:focus{
                        border-color: $theme_c !important;
                    }
                }
                .nft_list_header_title{
                    font-size: $s18;
                    color: $t_first_c;
                    line-height: 0.21rem;
                    text-align: left;
                    //text-indent: 0.2rem;
                }
                .nft_denom_content{
                    margin-top: 0.1rem;
                    width: 100%;
                    height:0.5rem;
                    line-height: 0.5rem;
                    font-size: $s14;
                    color: $t_second_c;
                    text-align: left;
                    background: $bg_white_c;
                    text-indent: 0.2rem;
                }
                .tx_type_mobile_content{
                    display: flex;


                    ::v-deep.el-select{
                        width: 1.3rem;
                        .el-input{
                            .el-input__inner{
                                padding-left: 0.07rem;
                                height: 0.32rem;
                                font-size: $s14 !important;
                                line-height: 0.32rem;
                                &::-webkit-input-placeholder{
                                    font-size: $s14 !important;
                                }
                            }
                            .el-input__inner:focus{
                                border-color: $theme_c !important;
                            }
                            .el-input__suffix{
                                .el-input__suffix-inner{
                                    .el-input__icon{
                                        line-height: 0.32rem;
                                    }
                                }
                            }
                        }
                        .is-focus{
                            .el-input__inner{
                                border-color: $theme_c !important;
                            }
                        }

                    }
                    ::v-deep.el-date-editor{
                        width: 1.3rem;
                        .el-icon-circle-close{
                            display: none !important;
                        }
                        .el-input__inner{
                            height:0.32rem;
                            padding-left: 0.07rem;
                            padding-right: 0;
                            line-height: 0.32rem;
                            &::-webkit-input-placeholder{
                                font-size: $s14 !important;
                            }
                            &:focus{
                                border-color: $theme_c;
                            }
                        }
                        .el-input__prefix{
                            right: 5px;
                            left: 1rem;
                            .el-input__icon{
                                line-height: 0.32rem;
                            }
                        }
                    }
                    .joint_mark{
                        margin: 0 0.08rem;
                    }
                    .reset_btn{
                        background: $bg_button_c;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        margin-left: 0.1rem;
                        cursor: pointer;
                        i{
                            padding: 0.08rem;
                            font-size: $s14;
                            line-height: 1;
                            display: inline-block;
                        }
                    }
                    .search_btn{
                        cursor: pointer;
                        background: $bg_button_c;
                        margin-left: 0.1rem;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        padding: 0.05rem 0.18rem;
                        font-size: $s14;
                        line-height: 0.2rem;
                        white-space: nowrap;
                    }
                }
            }
            .service_list_content{
                display:flex;
                flex-direction:column;
                margin-bottom:0.48rem;
                padding:0.28rem 0.28rem 0.18rem 0.28rem;
                background: $bg_white_c;
                border-radius:5px;
                // border:1px solid $bd_first_c;
                overflow-x: auto;
                .service_information_available_container{
                    display:flex;
                    align-items: center;
                }
                .service_list_top{
                    display:flex;
                    justify-content: flex-start;
                    margin-bottom:0.4rem;
                    .service_list_service_name{
                        color: $t_link_c;
                        font-size: $s14;
                        cursor:pointer;
                        margin-right:0.15rem;
                    }
                    .bold_name{
                        font-weight:600;
                    }
                }
                .table {
                    overflow-x: auto;
                    .el-table {
                        min-width: 10rem;
                    }
                }
            }
            @media (max-width: 767px) {
                .service_list_content {
                    padding: 0.28rem 0.12rem 0.18rem 0.12rem;
                }
            }
        }
        .pagination_content{
            display: flex;
            justify-content: flex-end;
            margin: 0.1rem 0 0.2rem 0;
        }
    }
</style>
