<template>
  <div class="statistical_bar_container">
      <div class="statistical_bar_wrap" :class="{noStaking: !moduleSupport('107', prodConfig.navFuncList)}">
        <div class="statistical_validator_content" v-if="moduleSupport('107', prodConfig.navFuncList)">
            <div class="statistical_validator_top_content">
                <p class="statistical_validator_header">
                    <span class="iconfont iconBlocks"></span>
                    <span class="statistical_validator_header_label">{{$t('ExplorerLang.home.blockHeight')}}</span>
                </p>
                <p class="statistical_current_block skip_route">
                    <router-link v-if="currentBlockHeight" :to="`/block/${currentBlockHeight}`">{{currentBlockHeight}}</router-link>
                    <span v-else>--</span>
                </p>
            </div>
            <div class="statistical_validator_bottom_content">
                <div class="statistical_img_content">
                    <a @click="addressRoute(proposerAddress)">
                        <div class="statistical_validator_header_img_content">
                            <span >{{validatorHeaderImgSrc}}</span>
                            <img v-show="validatorHeaderImgHref" :src="validatorHeaderImgHref"  @error="imgLoadError()">
                        </div>
                    </a>
                </div>
                <p class="statistical_moniker_content skip_route">
                    <span class="address_link" @click="addressRoute(proposerAddress)">{{moniker}}</span>
                </p>
            </div>
        </div>
        <div class="statistical_bar_content">
            <ul class="statistical_list_content" :class="lineNum">
                <li class="statistical_item_content" v-for="(item,index) in navigationArray" :key="index">
                    <p class="statistical_header_content">
                        <i :class="item.iconClass"></i>
                        <span class="statistical_content">{{item.label}}</span>
                    </p>
                    <p class="statistical_center_content">
                        <router-link v-if="item.to && item.value !== '--'" :to="item.to">{{item.value}}</router-link>
                        <span v-else>{{item.value}}</span>
                    </p>
                    <p class="statistical_footer_content" :class="isChrome ? 'chrome' : ''">
                        {{item.footerLabel}}
                    </p>
                </li>
            </ul>
        </div>
      </div>
  </div>
</template>

<script>
import prodConfig from "../../productionConfig"
import { getDbStatistics,getNetworkStatistics } from "../../service/api";
import Tools from "../../util/Tools";
import {moduleSupport} from "../../helper/ModulesHelper";
import { addressRoute,formatMoniker,getMainToken,converCoin } from '@/helper/IritaHelper'
import { monikerNum } from '../../constant'

export default {
  name: 'StatisticalBar',
  data () {
    return {
        prodConfig,
        moduleSupport,
        Tools,
        addressRoute,
        navigationObj:{
            201: {
                id:201,
                iconClass:'iconfont iconTransactions',
                label: this.$t('ExplorerLang.home.transactions'),
                footerLabel:'',
                value:'--',
                to: '/txs',
            },
            202: {
                id:202,
                iconClass:'iconfont iconBlocks',
                label: this.$t('ExplorerLang.home.validators'),
                footerLabel:'',
                value:'--',
                to: '/validators',
            },
            203: {
                id:203,
                iconClass:'iconfont iconAvgBlockTime',
                label: this.$t('ExplorerLang.home.avgBlockTime'),
                footerLabel:this.$t('ExplorerLang.home.last100Blocs'),
                value:'--',
                to: '',
            },
            204: {
                id:204,
                iconClass:'iconfont iconAssets',
                label: this.$t('ExplorerLang.home.assets'),
                footerLabel:'',
                value:'--',
                to: '/nftAsset',
            },
            205: {
                id:205,
                iconClass:'iconfont iconshujuleibie',
                label: this.$t('ExplorerLang.home.denoms'),
                footerLabel:'',
                value:'--',
                to: '/denoms',
            },
            206:{
                id:206,
                iconClass:'iconfont iconservice',
                label: this.$t('ExplorerLang.home.services'),
                footerLabel:'',
                value:'--',
                to: '/services',
            },
            207:{
                id:207,
                iconClass:'iconfont iconID',
                label: this.$t('ExplorerLang.home.identities'),
                footerLabel:'',
                value:'--',
                to: '/identities',
            },
            208:{
                id:208,
                iconClass:'iconfont iconVotingPower',
                label: this.$t('ExplorerLang.home.validatorNumCount'),
                footerLabel:'',
                value:'--',
                to: '/staking',
            },
            209:{
                id:209,
                iconClass:'iconfont iconBondedTokens',
                label: this.$t('ExplorerLang.home.bondedTokens'),
                footerLabel:'',
                value:'--',
                to: '',
            },
        },
        navigationArray:[],
        syncTimer: null,
        currentBlockHeight:0,
        validatorHeaderImgSrc:'',
        validatorHeaderImgHref:'',
        moniker:'',
        proposerAddress:'',
        isChrome: window.navigator.userAgent.indexOf("Chrome") > -1,
    }
  },
  computed: {
      lineNum() {
          let HomeCardArray = prodConfig.homeCard.filter( item => {
              return item !== 200
          })
          let num = HomeCardArray.length
          if(num <= 4) {
              return ''
          } else if ( num <= 6) {
              return 'lineThree'
          } else if ( num <= 8) {
              return 'lineFour'
          } else {
               return 'lineFive'
          }
      }
  },
  watch: {},
  created () {
  },
  mounted () {
        this.getNavigation();
        clearInterval(this.syncTimer )
        this.syncTimer = setInterval(() => {
            this.getNavigation();
        },20000)//TODO (lvshenchao) 目前cosmos lcd接口很难获取到, 暂时降低请求频率
  },
  methods: {
        async getNavigation(){
            try{
                let HomeCardArrayDb=[],HomeCardArrayNetwork=[];
                prodConfig.homeCard.forEach(code => {
                    if(code == 200 || code == 201 || code == 209) {
                        HomeCardArrayNetwork.push(code)
                    } else {
                        HomeCardArrayDb.push(code)
                    }
                })
                let statisticsDb = await getDbStatistics(HomeCardArrayDb)
                this.navigationArray=[]
                if(statisticsDb) {
                    // this.validatorHeaderImgHref = ''
                    // //先通过正则剔除符号空格及表情，只保留数字字母汉字
                    // let regex =  /[^\w\u4e00-\u9fa50-9a-zA-Z]/g;
                    // if(statisticsNetwork.moniker) {
                    //     let replaceMoniker = statisticsNetwork.moniker && statisticsNetwork.moniker.replace(regex,'');
                    //     this.validatorHeaderImgHref = statisticsNetwork.validator_icon ? statisticsNetwork.validator_icon : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg');
                    //     this.validatorHeaderImgSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : '';
                    //     this.moniker = formatMoniker(statisticsNetwork.moniker,monikerNum.home);
                    // }
                    // this.proposerAddress = statisticsNetwork.operator_addr;
                    // this.currentBlockHeight = statisticsNetwork.blockHeight;
                    prodConfig.homeCard.forEach(item => {
                        if(item === 200) return
                        let itemObj = this.navigationObj[item]
                        switch(item) {
                            case 201:
                                // itemObj.value = statisticsNetwork.txCount;
                                // itemObj.footerLabel = Tools.getDisplayDate(statisticsNetwork.latestBlockTime)
                                break;
                             case 202:
                                itemObj.value = statisticsDb.validatorCount;
                                break;
                            case 203:
                                itemObj.value = `${statisticsDb.avgBlockTime}${this.$t('ExplorerLang.common.s')}`
                                break;
                            case 204:
                                itemObj.value = statisticsDb.assetCount
                                break;
                            case 205:
                                itemObj.value = statisticsDb.denomCount
                                break;
                            case 206:
                                itemObj.value = statisticsDb.serviceCount
                                break;
                            case 207:
                                itemObj.value = statisticsDb.identityCount
                                break;
                            case 208:
                                itemObj.value = statisticsDb.validatorNumCount
                                break;
                            case 209:
                                // if(statisticsNetwork.total_supply) {
                                //     itemObj.value = Tools.formatPercentageNumbers(statisticsNetwork.bonded_tokens,statisticsNetwork.total_supply)
                                //     itemObj.footerLabel = Tools.formatBondedTokens(statisticsNetwork.bonded_tokens,statisticsNetwork.total_supply)
                                // } else {
                                //     itemObj.value = '--';
                                //     itemObj.footerLabel = `${statisticsNetwork.bonded_tokens || '--'} / ${statisticsNetwork.total_supply || '--'}`;
                                // }
                                break;
                        }
                        this.navigationArray.push(itemObj)
                    })
                    if(!moduleSupport('107', prodConfig.navFuncList)) {
                        this.navigationArray.unshift({
                            id:200,
                            iconClass:'iconfont iconBlocks',
                            label: this.$t('ExplorerLang.home.blockHeight'),
                            footerLabel:'',
                            value: this.currentBlockHeight,
                            to: `/block/${this.currentBlockHeight}`,
                        })
                    }
                }
                let statisticsNetwork = await getNetworkStatistics(HomeCardArrayNetwork)
                if(statisticsDb && statisticsNetwork) {
                    this.navigationArray=[];
                    this.validatorHeaderImgHref = ''
                    //先通过正则剔除符号空格及表情，只保留数字字母汉字
                    let regex =  /[^\w\u4e00-\u9fa50-9a-zA-Z]/g;
                    if(statisticsNetwork.moniker) {
                        let replaceMoniker = statisticsNetwork.moniker && statisticsNetwork.moniker.replace(regex,'');
                        this.validatorHeaderImgHref = statisticsNetwork.validator_icon ? statisticsNetwork.validator_icon : replaceMoniker ? '' : require('../../assets/default_validator_icon.svg');
                        this.validatorHeaderImgSrc = replaceMoniker ? Tools.firstWordUpperCase(replaceMoniker.match(/^[0-9a-zA-Z\u4E00-\u9FA5]/g)[0]) : '';
                        this.moniker = formatMoniker(statisticsNetwork.moniker,monikerNum.home);
                    }
                    this.proposerAddress = statisticsNetwork.operator_addr;
                    this.currentBlockHeight = statisticsNetwork.blockHeight;
                    for (const item of prodConfig.homeCard) {
                        if(item !== 200)  {
                            let itemObj = this.navigationObj[item]
                            switch(item) {
                                case 201:
                                    itemObj.value = statisticsNetwork.txCount;
                                    itemObj.footerLabel = Tools.formatLocalTime(statisticsNetwork.latestBlockTime)
                                    break;
                                case 202:
                                    itemObj.value = statisticsDb.validatorCount;
                                    break;
                                case 203:
                                    itemObj.value = `${statisticsDb.avgBlockTime}${this.$t('ExplorerLang.common.s')}`
                                    break;
                                case 204:
                                    itemObj.value = statisticsDb.assetCount
                                    break;
                                case 205:
                                    itemObj.value = statisticsDb.denomCount
                                    break;
                                case 206:
                                    itemObj.value = statisticsDb.serviceCount
                                    break;
                                case 207:
                                    itemObj.value = statisticsDb.identityCount
                                    break;
                                case 208:
                                    itemObj.value = statisticsDb.validatorNumCount
                                    break;
                                case 209:
                                    if(Number(statisticsNetwork.total_supply) && Number(statisticsNetwork.bonded_tokens)) {
                                        itemObj.value = Tools.formatPercentageNumbers(statisticsNetwork.bonded_tokens,statisticsNetwork.total_supply)
                                        let mainToken  = await getMainToken()
                                        let [bonded_tokens,total_supply] = await Promise.all([converCoin({
                                            denom: mainToken.denom,
                                            amount: Number(statisticsNetwork.bonded_tokens)
                                        }),converCoin({
                                            denom: mainToken.denom,
                                            amount: Number(statisticsNetwork.total_supply)
                                        })])
                                        itemObj.footerLabel = Tools.formatBondedTokens(Number(bonded_tokens.amount || 0),Number(total_supply.amount || 0))
                                    } else {
                                        itemObj.value = '--';
                                        itemObj.footerLabel = `${statisticsNetwork.bonded_tokens || '--'} / ${statisticsNetwork.total_supply || '--'}`;
                                    }
                                    break;
                            }
                            this.navigationArray.push(itemObj)
                        }
                    }
                    if(!moduleSupport('107', prodConfig.navFuncList)) {
                        this.navigationArray.unshift({
                            id:200,
                            iconClass:'iconfont iconBlocks',
                            label: this.$t('ExplorerLang.home.blockHeight'),
                            footerLabel:'',
                            value: this.currentBlockHeight,
                            to: `/block/${this.currentBlockHeight}`,
                        })
                    }
                }
            }catch(err){
                console.error(err);
            }
        },
        imgLoadError(){
			this.validatorHeaderImgHref = ""
		},
  },
  destroyed () {
        clearInterval(this.syncTimer)
  }
}
</script>

<style lang="scss" scoped>
    a {
		color: $t_link_c !important;
	}
    .statistical_bar_container {
        width: 100%;
        max-width: 12rem;
		margin: 0.2rem auto 0 auto;
        .statistical_bar_wrap{
            box-sizing: border-box;
            padding: .2rem;
            background: $bg_white_c;
            display: grid;
            grid-template-columns: 24% 76%;
            // border: .01rem solid $bd_second_c;
            .statistical_validator_content{
                display: flex;
                flex-direction: column;
                align-items: center;
                .statistical_validator_top_content{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .statistical_validator_header{
                        margin-bottom: 0.2rem;
                        margin-top: 0.15rem;
                        .iconBlocks{
                            color: $theme_c;
                            margin-right: 0.08rem;
                        }
                        .statistical_validator_header_label{
                            color:$t_second_c;
                            font-size: $s14;
                            line-height: 0.16rem;
                        }
                    }
                    .statistical_current_block{
                        margin-bottom: 0.2rem;
                        a{
                            font-size: $s20;
                        }
                        font-weight: bold;
                    }
                }
                .statistical_validator_bottom_content{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .statistical_img_content{
                        width: 1.2rem;
                        height: 1.19rem;
                        margin-bottom: 0.27rem;
                        .statistical_validator_header_img_content{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            background: $bg_avatar;
                            overflow: hidden;
                            position: relative;
                            img{
                                position: absolute;
                                width: 100%;
                            }
                            span{
                                font-size: $s52;
                            }
                        }
                    }
                }
            }
            .statistical_bar_content {
                    .statistical_list_content{
                        // margin-top: 0.2rem;
                        display: grid;
                        grid-template-columns: repeat(2,1fr);
                        grid-template-rows: repeat(2,1.33rem);
                        grid-gap:0.2rem 0.2rem;
                        .statistical_item_content{
                            border-radius: 0.04rem;
                            border: 0.01rem solid $bd_second_c;
                            background: $bg_white_c;
                            text-align: left;
                            box-sizing: border-box;
                            padding: 0.15rem;
                            font-size: $s14;
                            i{
                                color: $theme_c;
                                margin-right: 0.1rem;
                            }
                            .statistical_center_content{
                                font-size: $s20;
                                margin-top: 0.35rem;
                            }
                            .statistical_footer_content{
                                font-size: $s10;
                                color: $t_second_c;
                                margin-top: 0.1rem;
                                white-space: nowrap;
                            }
                            .chrome {
                                -webkit-transform:scale(0.83);
                                -webkit-transform-origin-X: left;
                            }
                        }
                    }
                    .lineThree {
                        grid-template-columns: repeat(3,1fr);
                    }
                    .lineFour {
                        grid-template-columns: repeat(4,1fr);
                    }
                    .lineFive {
                        grid-template-columns: repeat(5,1fr);
                    }
            }
        }
        .noStaking {
            display: block;
        }
    }
    @media screen and (max-width: 1178px) {
        .statistical_bar_container {
            .statistical_bar_wrap{
                .statistical_validator_content{
                    .statistical_validator_top_content{
                        .statistical_validator_header{
                        }
                    }
                    .statistical_validator_bottom_content{
                        .statistical_img_content{
                            a{
                                .statistical_validator_header_img_content{
                                    span{
                                    }
                                }
                            }
                        }
                    }
                }
                .statistical_bar_content {
                    .statistical_list_content{
                        grid-gap: 0.2rem 0.1rem;
                        .statistical_item_content{
                            .statistical_center_content{
                            }
                        }
                    }
                }
            }
        }
	}
    @media screen and (max-width: 1123px) {
        .statistical_bar_container {
            .statistical_bar_wrap{
                .statistical_validator_content{
                    .statistical_validator_top_content{
                        .statistical_validator_header{
                        }
                    }
                    .statistical_validator_bottom_content{
                        .statistical_img_content{
                            a{
                                .statistical_validator_header_img_content{
                                    span{
                                    }
                                }
                            }
                        }
                    }
                }
                .statistical_bar_content {
                    .statistical_list_content{
                        grid-gap: 0.2rem 0.05rem;
                        .statistical_item_content{
                            .statistical_center_content{
                            }
                        }
                    }
                }
            }
        }
	}
    @media screen and (max-width: 1050px) {
        .statistical_bar_container {
            .statistical_bar_wrap{
                margin: 0;
                padding: 0.1rem;
                grid-template-columns: repeat(1,auto);
                .statistical_validator_content{
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    .statistical_validator_top_content{
                        .statistical_validator_header{
                            margin-bottom: 0.15rem;
                        }
                    }
                    .statistical_validator_bottom_content{
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        .statistical_img_content{
                            width: 0.3rem;
                            height: 0.3rem;
                            border-radius: 0.15rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 0.07rem;
                            a{
                                width: 100%;
                                height: 100%;
                                .statistical_validator_header_img_content{
                                    span{
                                        font-size: $s10;
                                    }
                                }
                            }
                        }
                    }
                }
                .statistical_bar_content {
                    .statistical_list_content{
                        grid-template-columns: repeat(1,1fr);
                        grid-template-rows: 1.1rem;
                        grid-gap: 0.1rem 0rem;
                        .statistical_item_content{
                            .statistical_center_content{
                                margin-top: 0.2rem;
                            }
                        }
                    }
                }
            }
        }
	}
</style>
