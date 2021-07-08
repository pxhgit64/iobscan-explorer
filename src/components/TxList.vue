<template>
    <div class="tx_content_container">
        <div class="tx_content_wrap">
            <div class="tx_content_header_wrap">
                <div class="total_tx_content">{{txCount}} {{$t('ExplorerLang.transactions.txs')}}</div>
                    <div class="tx_type_mobile_content">
                        <!--<el-select popper-class="tooltip" v-model="value" filterable :change="filterTxByTxType(value)">
                            <el-option v-for="(item, index) in txTypeOption"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>-->
                        
                        <el-cascader
                            class="tx_type_transactions"
                            popper-class="tooltip"
                            :placeholder="$t('ExplorerLang.common.allTxType')"
                            v-model="txTypeArray"
                            :options="txTypeOption"
                            :props="{ expandTrigger: 'hover' }"
                            :show-all-levels="false"
                            :filterable="true"
                            @change="handleChange"></el-cascader>

                        <!--<el-select  popper-class="tooltip" v-model="statusValue" :change="filterTxByStatus(statusValue)">
                            <el-option v-for="(item, index) in statusOpt"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>-->
                        <el-select popper-class="tooltip" v-model="statusValue">
                            <el-option v-for="(item) in statusOpt"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>

                    </div>
                    <div class="tx_type_mobile_content">
                        <el-date-picker type="date"
                                        popper-class="tooltip"
                                        v-model="beginTime"
                                        @change="getStartTime(beginTime)"
                                        :picker-options="PickerOptions"
                                        :editable="false"
                                        value-format="yyyy-MM-dd"
                                        :placeholder="$t('ExplorerLang.common.selectDate')">
                        </el-date-picker>
                        <span class="joint_mark">~</span>
                        <el-date-picker type="date"
                                        popper-class="tooltip"
                                        v-model="endTime"
                                        value-format="yyyy-MM-dd"
                                        @change="getEndTime(endTime)"
                                        :picker-options="PickerOptions"
                                        :editable="false"
                                        :placeholder="$t('ExplorerLang.common.selectDate')">
                        </el-date-picker>
                        <div class="tooltip_content">
                            <el-tooltip popper-class="tooltip"  :content="$t('ExplorerLang.transactions.tooltip')">
                                <i class="iconfont iconyiwen"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="tx_type_mobile_content">
                        <div class="search_btn" @click="getFilterTxs">{{$t('ExplorerLang.transactions.search')}}</div>
                        <div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
                    </div>
            </div>
            <TxListComponent :txData="transactionArray"></TxListComponent>
            <div class="pagination_content">
                <div class="tooltip_box">
                  <span class="tooltip_title">Cross-chain TokenType:</span>
                  <span class="tooltip_title_box">
                    <span class="tooltip_title_IBC">{{ IBC }}</span>
                    <span class="tooltip_title_HTLT">{{ HashLock }}</span>
                  </span>
                </div>
                <keep-alive>
                    <m-pagination :page-size="Number(pageSize)"
                                  :total="txCount"
                                  :page="Number(pageNum)"
                                  :page-change="pageChange">
                    </m-pagination>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools"
    import MPagination from "./common/MPagination";
    import TxListComponent from "./common/TxListComponent";
    import {TxHelper} from "../helper/TxHelper";
    import {getAllTxTypes, getTxList } from '../service/api';
    import { TX_TYPE,TX_STATUS,LEVEL_TX_TYPE } from '../constant';
    export default {
        name : "TxList",
        components : {MPagination, TxListComponent},
        data(){
            const {txType, status, beginTime, endTime, pageNum, pageSize} = Tools.urlParser();
            return {
                IBC: LEVEL_TX_TYPE.IBC,
                HashLock: LEVEL_TX_TYPE.HashLock,
                PickerOptions: {
					      disabledDate: (time) => {
						      return time.getTime() < new Date(this.pickerStartTime).getTime() || time.getTime() > Date.now()
					      }
				},
                TX_TYPE,
                TX_STATUS,
                transactionArray : [],
                txCount : 0,
                txTypeOption : [],
                statusOpt : [
                    {
                        value : 0,
                        label : this.$t('ExplorerLang.common.allTxStatus')
                    },
                    {
                        value : 1,
                        label : this.$t('ExplorerLang.common.success')
                    },
                    {
                        value : 2,
                        label : this.$t('ExplorerLang.common.failed')
                    }
                ],
                statusValue : status ? status : '',
                txType : txType ? txType : '',
                beginTime : beginTime ? beginTime : '',
                endTime : endTime ? endTime : '',
                /*filterStartTime : '',
                filterEndTime : '',
                urlParamsShowStartTime : this.getParamsByUrlHash().urlParamShowStartTime ? this.getParamsByUrlHash().urlParamShowStartTime : '',
                urlParamsShowEndTime : this.getParamsByUrlHash().urlParamShowEndTime ? this.getParamsByUrlHash().urlParamShowEndTime : '',*/
                txStatus : '',
                pageNum: pageNum ? pageNum : 1,
                pageSize: pageSize ? pageSize : 30,
                txTypeArray:['']
            }
        },
        mounted(){
            this.getFilterTxs('init');
            this.getAllTxType();
        },
        methods : {
            getFilterTxs(param){
                this.statusValue = Number(this.statusValue || 0);
                this.pageNum = 1;
                let url = `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&useCount=true`;
                // if(this.txType){
                //     url += `&txType=${this.txType}`;
                // }
                if(this.txType){
                    url += `&txType=${this.txType}`;
                } 
                if(this.statusValue){
                    url += `&status=${this.statusValue}`;
                }
                if(this.beginTime){
                    url += `&beginTime=${this.beginTime}`;
                }
                if(this.endTime){
                    url += `&endTime=${this.endTime}`;
                }
                param == 'init' ? history.replaceState(null, null, url) : history.pushState(null, null, url);
                this.getTxList();
            },
            /*filterTxByTxType(e){
                if(e === 'allTxType' || e === undefined){
                    this.TxType = ''
                } else {
                    this.TxType = e
                }
            },*/
            resetUrl(){
                this.beginTime = '';
                this.endTime = '';
                this.txType = '';
                this.statusValue = 0;
                this.txStatus = '';
                this.beginTime = '';
                this.endTime = '';
                history.pushState(null, null, `/#/txs?pageNum=${this.pageNum}&pageSize=${this.pageSize}&useCount=true`);
            },
            async getTxList(){
                const {txType, status, beginTime, endTime, pageNum, pageSize} = Tools.urlParser();
                const params = {
                    txType,status, beginTime, endTime, pageNum, pageSize
                };

                try{
                    const res = await getTxList(params);
                    this.transactionArray = res.data;
                    this.txCount = res.count;
                    this.pageNum = res.pageNum;
                    this.pageSize = res.pageSize;
                }catch (e) {
                    console.error(e);
                    // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
            },
            async getAllTxType(){
                try {
                    const res = await getAllTxTypes();
                    const typeList = TxHelper.formatTxType(res.data)
                    typeList.unshift({
                        value : '',
                        label : this.$t('ExplorerLang.common.allTxType'),
                        slot : 'allTxType',
                    });
                    this.txTypeOption = typeList;
                    this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption,this.txType)
                }catch (e) {
                    console.error(e);
                    // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

            },
            /*filterTxByStatus(e){
                if(e === '' || e === undefined){
                    this.txStatus = ''
                } else {
                    this.txStatus = e
                }
            },*/
            getStartTime(time){
                this.beginTime = time;
            },
            getEndTime(time){
                this.endTime =time;
            },
            /*formatEndTime(time){

                // let utcTime = Tools.conversionTimeToUTCByValidatorsLine(new Date(time).toISOString());
                let oneDaySeconds = 24 * 60 * 60;
                return Number(new Date(time).getTime() / 1000) + Number(oneDaySeconds)
            },
            formatStartTime(time){
                // let utcTime = Tools.conversionTimeToUTCByValidatorsLine(new Date(time).toISOString());
                return Number(new Date(time).getTime() / 1000)
            },*/
            resetFilterCondition(){
                this.txType = '';
                this.statusValue = '';
                this.beginTime = '';
                this.endTime = '';
                this.pageNum = 1;
                this.pageSize = 30;
                this.resetUrl();
                this.getTxList()
                this.txTypeArray=['']
            },
            /*getParamsByUrlHash(){
                let txType,
                    txStatus,
                    filterStartTime,
                    urlParamShowStartTime,
                    urlParamShowEndTime,
                    filterEndTime;
                let path = window.location.hash;
                if(path.includes("?")){
                    let urlHash = path.split('?')[1];
                    let params = urlHash.split("&");
                    params.forEach(item =>{
                        if(item.includes('txType')){
                            txType = item.split("=")[1]
                        } else if(item.includes('status')){
                            txStatus = item.split("=")[1]
                        } else if(item.includes('beginTime')){
                            urlParamShowStartTime = item.split("=")[1]
                            filterStartTime = this.formatStartTime(item.split("=")[1])
                        } else if(item.includes('endTime')){
                            urlParamShowEndTime = item.split("=")[1]
                            filterEndTime = this.formatEndTime(item.split("=")[1])
                        }
                    })
                }
                return {txType, txStatus, filterStartTime, filterEndTime, urlParamShowStartTime, urlParamShowEndTime}
            },*/
            pageChange(pageNum){
                if(this.pageNum === pageNum) return;
                this.pageNum = pageNum;

                /*let urlParams = this.getParamsByUrlHash();
                this.statusValue = urlParams.txStatus ? urlParams.txStatus : '';
                this.txType = urlParams.txType ? urlParams.txType : 'allTxType';
                this.beginTime = urlParams.urlParamShowStartTime ? urlParams.urlParamShowStartTime : '';
                this.endTime = urlParams.urlParamShowEndTime ? urlParams.urlParamShowEndTime : '';*/

                const {txType, status, beginTime, endTime, pageSize} = Tools.urlParser();
                let url = `/#/txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
                if(txType){
                    url += `&txType=${txType}`;
                    this.txTypeArray = TxHelper.getTxTypeArray(this.txTypeOption,txType)
                    this.txType = txType
                } else {
                    this.txTypeArray=['']
                    this.txType = ''
                }
                if(status){
                    url += `&status=${status}`;
                    this.statusValue = Number(status)
                } else {
                    this.statusValue = 0
                }
                if(beginTime){
                    url += `&beginTime=${beginTime}`;
                    this.beginTime = beginTime
                } else {
                    this.beginTime = ''
                }
                if(endTime){
                    url += `&endTime=${endTime}`;
                    this.endTime = endTime
                } else {
                    this.endTime = ''
                }
                history.pushState(null, null, url);
                this.getTxList();
            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            handleChange(value) {
                this.txType = value[1] ? value[1] : ''
            }
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: $t_link_c !important;
    }

    .tx_content_container {
        width:100%;
        @media screen and (min-width: 910px){
            .tx_content_wrap{
                max-width: 12.3rem;
                .tx_content_header_wrap{
                    display: flex;
                    justify-content: flex-start;
                }
            }

        }
        @media screen and (max-width: 910px){
            .tx_content_wrap{
                width:100%;
                .tx_content_header_wrap{
                    display: flex;
                    flex-direction:column;
                    align-items: flex-start;

                    .tx_type_mobile_content{
                        margin-bottom:0.1rem;
                        &:last-child{
                            width:100%;
                            justify-content: flex-end;
                            .search_btn{
                                margin-left:0;
                            }
                        }
                        .tx_type_transactions {
                            margin-right: 0.26rem !important;
                        }
                    }
                }
            }

        }
        .tx_content_wrap {
            margin: 0 auto;
            box-sizing: border-box;
            padding:0 0.15rem;
            .service_tx_to_container{
                .service_tx_muti_to_container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    .service_tx_muti_to_ellipsis {
                        color: $t_link_c;
                    }
                }
            }
            .service_tx_status {
                position: relative;
                top: 0.02rem;
                left: -0.04rem;
                width:0.13rem;
                height:0.13rem;
            }
            .tx_content_header_wrap {
                padding: 0.3rem 0 0.13rem 0;
                .tx_transaction_content_hash{
                    display: flex;
                    align-items: center;
                }
                .total_tx_content {
                    // height: 0.64rem;
                    line-height: 0.4rem;
                    color: $t_first_c;
                    font-size: $s18;
                    font-weight: bold;
                    margin:0rem 0.2rem 0rem 0rem;
                   //text-indent: 0.2rem;
                }
                /*.filer_content {
                    display: flex;
                    align-items: center;*/
                    .tx_type_mobile_content {
                        display: flex;
                        align-items: center;
                        .tooltip_content {
							padding: 0 0 0 0.1rem;
                        }
                        /deep/.el-cascader{
                            width: 1.3rem;
                            margin-right: 0.1rem;
                            .el-input{
                                input::-webkit-input-placeholder{   /* 使用webkit内核的浏览器 */
                                    color: $t_first_c;
                                }
                                input:-moz-placeholder{    /* Firefox版本4-18 */
                                    color: $t_first_c;
                                }              
                                input::-moz-placeholder{    /* Firefox版本19+ */
                                    color: $t_first_c;
                                }              
                                input:-ms-input-placeholder{   /* IE浏览器 */
                                    color: $t_first_c;
                                }
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
                        /deep/ .el-select {
                            width: 1.3rem;
                            margin-right: 0.1rem;
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
                        /deep/ .el-date-editor {
                            width: 1.3rem;
                            .el-icon-circle-close {
                                display: none !important;
                            }
                            .el-input__inner {
                                height: 0.32rem;
                                padding-left: 0.07rem;
                                padding-right: 0;
                                line-height: 0.32rem;
                                &::-webkit-input-placeholder {
                                    font-size: $s14 !important;
                                }
                                &:focus {
                                    border-color: $theme_c;
                                }
                            }
                            .el-input__prefix {
                                right: 5px;
                                left: 1rem;
                                .el-input__icon {
                                    line-height: 0.32rem;
                                }
                            }
                        }
                        .joint_mark {
                            margin: 0 0.08rem;
                        }
                        .reset_btn {
                            background: $bg_button_c;
                            color: $t_button_c;
                            border-radius: 0.04rem;
                            margin-left: 0.1rem;
                            cursor: pointer;
                            i {
                                padding: 0.08rem;
                                font-size: $s14;
                                line-height: 1;
                                display: inline-block;
                            }
                        }
                        .search_btn {
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
                //}
            }
            .status_icon{
                width:0.13rem;
                height:0.13rem;
                margin-right:0.05rem;
            }
            .pagination_content {
                display: flex;
                justify-content: space-between;
                margin: 0.1rem 0 0.2rem 0;
                .tooltip_box{
                  display: flex;
                  align-items: center;
                  background-color: white;
                  padding: 0.05rem 0.2rem;
                  font-size: $s12;
                  color: #8d8b8b;
                  .tooltip_title{
                    margin-right: 0.24rem;
                  }
                  .tooltip_title_box{
                    display: flex;
                  }
                   .tooltip_title_IBC {
                      margin-right: 0.24rem;
                      display: flex;
                      align-items: center;
                      position: relative;
                      &::before{
                        left: -0.12rem;
                        content: ' ';
                        position: absolute;
                        height: 0.08rem;
                        width: 0.08rem;
                        border-radius: 0.04rem;
                        background-color: #D47D78;
                      }
                    }
                    .tooltip_title_HTLT{
                      display: flex;
                      align-items: center;
                      position: relative;
                      &::before{
                        left: -0.12rem;
                        content: ' ';
                        position: absolute;
                        height: 0.08rem;
                        width: 0.08rem;
                        border-radius: 0.04rem;
                        background-color: #51A3A3;
                      }
                    }
                }
            }
        }
    }
</style>
