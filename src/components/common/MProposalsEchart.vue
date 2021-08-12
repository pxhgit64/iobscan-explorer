<template>
  <div class="propsals_echart_container">
    <div class="text">
      <div class="top">
        <span class="title">#{{data.proposal_id}}</span>
        <div class="title_value_content">
          <span class="value title_value" ref="titleValue">
            <router-link :to="`/ProposalsDetail/${data.proposal_id}`"
                        class="link_style">{{data.title}}</router-link>
          </span>
          <div v-if="titleValueTipShow" class="tooltip_span"><div>{{data.title}}</div></div>
        </div>
      </div>
      <div class="content">
        <div class="content_div">
          <div class="content_header_content">
            <div>
              <span style="margin-left: 0.22rem;">{{data.type}}</span>
            </div>
            <div class="deposit_period_content" style="margin-top: 0.12rem;display: flex;align-items: center;" v-show="data.status === 'DepositPeriod'">
              <i class="iconfont iconDepositPeriod-liebiao" style="color: var(--bgColor)"></i>
              <span>{{ $t('ExplorerLang.gov.proposalsType.DepositPeriod') }}</span>
            </div>
            <div class="voting_period_content" style="margin-top: 0.12rem;display: flex;align-items: center;" v-show="data.status === 'VotingPeriod'">
              <i class="iconfont iconDepositPeriod" style="color: var(--bgColor)"></i>
              <span>{{ $t('ExplorerLang.gov.proposalsType.VotingPeriod') }}</span>
            </div>
            <div class="voting_period_content" style="margin-top: 0.12rem;display: flex;align-items: center;" v-show="flShowTime">
              <i class="iconfont iconHoursLeft" style="color: rgb(90, 200, 250)"></i>
              <span>{{votingHourLeft}} Left</span>
            </div>
          </div>
          <div class="per_div">
            <div class="per_title">{{ $t('ExplorerLang.gov.govTallying') }}</div>
            <div style="margin-top: 0.16rem;">
              <p>
                <!-- <img v-if="data.participation > data.participationNum" src="../../assets/participant.png"/>
                <img v-if="data.participation <= data.participationNum" src="../../assets/no_threshold.png"/> -->
                <i :style="{color: data.participation > data.participationNum ? 'var(--bgColor)' : '#D7DCE0'}" class="iconfont iconBondedTokens icon"></i>
                <span>{{ $t('ExplorerLang.gov.participation') }}</span>
              </p>
              <span style="margin-left: 0.2rem;">{{data.participationNum}} %</span>
            </div>
            <div style="margin-top: 0.16rem;">
              <p>
                <!-- <img v-if="data.passThreshold > data.passThresholdNum" src="../../assets/pass_threshold.png"/>
                <img v-if="data.passThreshold <= data.passThresholdNum" src="../../assets/no_threshold.png"/> -->
                <i :style="{color: data.passThreshold > data.passThresholdNum ? 'var(--bgColor)' : '#D7DCE0'}" class="iconfont iconBondedTokens"></i>
                <span>{{ $t('ExplorerLang.gov.passThreshold') }}</span>
              </p>
              <span style="margin-left:0.2rem;">{{data.passThresholdNum}} %</span>
            </div>
            <div style="margin-top: 0.16rem;">
              <p>
                <!-- <img v-if="data.vetoThreshold > data.vetoThresholdNum" src="../../assets/veto_threshold.png"/>
                <img v-if="data.vetoThreshold <= data.vetoThresholdNum" src="../../assets/no_threshold.png"/> -->
                <i :style="{color: data.vetoThreshold > data.vetoThresholdNum ? '#FE8A8A' : '#D7DCE0'}" class="iconfont iconBondedTokens"></i>
                <span>{{ $t('ExplorerLang.gov.vetoThreshold') }}</span>
              </p>
              <span style="margin-left: 0.2rem;">{{data.vetoThresholdNum}} %</span>
            </div>
          </div>
        </div>
        <div class="propsals_echart_content">
          <div class="propsals_echart" ref="propsalsEchart">
            <div class="propsals_echart_center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var echarts = require('echarts')
import Tools from '../../util/Tools';

export default {
  name: 'MProposalsEchart',
  data() {
    return {
      titleValueTipShow: false,
      chart: null,
      level: 4,
      levelName: '',
      levels: [
        {
          r0: '0%',
          r: '25%',
          itemStyle: {
            borderWidth: 0,
            color: '#51A9FF'
          }
        },
        {
          r0: '25%',
          r: '50%',
          itemStyle: {
            borderWidth: 0
          }
        },
        {
          r0: '50%',
          r: '75%'
        },
        {
          r0: '75%',
          r: '100%',
        }
      ],
      bundClickEventFun: function() {},
      votingTimer:null,
      votingHourLeft:'',
      flShowTime:false
    }
  },
  props: {
    data: {
      type: Object,
      default: function() {return {}}
    }
  },
  methods: {
    getVotingEndTime(time){
      if(time){
        let that = this;
        let currentServerTime = Tools.getTimestamp();
        if(new Date(time).getTime() >  currentServerTime){
          that.flShowTime = true;
          that.votingHourLeft =  Tools.formatAge(new Date(time).getTime(),currentServerTime * 1000);
        }else {
        }
        clearInterval(this.votingTimer);
        this.votingTimer = setInterval(() => {
          currentServerTime = Tools.getTimestamp();
          if(new Date(time).getTime() >  currentServerTime){
            that.flShowTime = true;
            that.votingHourLeft =  Tools.formatAge(new Date(time).getTime(),currentServerTime * 1000);
          }else {
          }
        },1000);
      }
    },
    configuration(data, levels) {
      this.forChildrenBorderWidth(data);
      let that = this;
      let option = {
        series: {
          type: 'sunburst',
          data: data,
          radius: ['0%', '100%'],
          label: {
            rotate: '0',
            textBorderColor: '#787C99',
            textBorderWidth: 1,
            fontWeight: 600,
            fontFamily: 'Arial'
          },
          sort: null,
          startAngle: 145,
          nodeClick: false,
          levels: levels
        },
        tooltip: {
          confine: true,
          formatter: function(v) {
            let info = v.data.info;
            that.levelName = v.name;
            if (v.data.info) {
              if(info.isValidator) {
                return `${v.marker}${info.moniker || info.address}: ${info.notVoteVotingPower + info.selfDelVotingPower + info.delVotingPower } (${v.data.per} %)`;
              }
              return `${v.marker}${Tools.formatValidatorAddress(info.address)}: ${info.delVotingPower} (${v.data.per} %)`;
            } else {
              if (v.dataIndex === 1 || !v.name) {
                return `${v.marker}${v.data.tipName || v.name}: ${v.value} (${v.data.perData} %)`;
              }
              return `${v.marker}${v.data.tipName || v.name}: ${v.value} (${v.data.per} %)`;
            }
          },
          textStyle: {
            fontFamily: 'Arial'
          }
        }
      };
      this.chart.setOption(option);
    },
    forChildrenBorderWidth(data, all) {
      all = all || data.reduce((init, v) => v.value + init, 0);
      if (all > 0) {
        data.forEach(v => {
          let per = v.value / all;
          v.itemStyle.borderWidth = per < 1 ? 0.5 : 0;
          v.per = Tools.formatPerNumber(per * 100);
          v.children && this.forChildrenBorderWidth(v.children, all);
        })
      }
    },
    bundClickFun(w, h) {
      return (e) => {
        let x = (e.offsetX - w);
        let y = (e.offsetY - h);
        let l = Math.sqrt(x*x + y*y);
        let per = Math.min(w, h) / this.level;
        if (this.level === 4) {
          let levels = [];
          if (l > per && l <= per * 2) {
            this.level = 3;
            let arr = this.data.data;
            let data = arr.filter(v => v.name === this.levelName);
            this.configuration(data, levels);
          }
          if (l > per * 2 && l <= per * 3) {
            if (this.levelName) {
              this.level = 2;
              let arr = this.data.data[0].children;
              let data = arr.filter(v => v.name === this.levelName);
              this.configuration(data, levels);
            }
          }
        } else if (this.level === 3){
          if (l >= 0 && l <= per) {
            this.level = 4;
            this.configuration(this.data.data, this.levels);
          }
          if (l > per && l <= per * 2) {
            if (this.levelName) {
              this.level = 2;
              let levels = [];
              let arr = this.data.data[0].children;
              let data = arr.filter(v => v.name === this.levelName);
              this.configuration(data, levels);
            }
          }
        } else if (this.level === 2) {
          if (l >= 0 && l <= per) {
            this.level = 3;
            let levels = [];
            let arr = [this.data.data[0]];
            this.configuration(arr, levels);
          }
        }
      }
    },
    bundClick() {
      let w = this.$refs.propsalsEchart.getBoundingClientRect().width / 2;
      let h = this.$refs.propsalsEchart.getBoundingClientRect().height / 2;
      this.bundClickEventFun = this.bundClickFun(w, h);
      this.$refs.propsalsEchart && this.$refs.propsalsEchart.addEventListener('click', this.bundClickEventFun);
    },
    unBundClick() {
      this.$refs.propsalsEchart && this.$refs.propsalsEchart.removeEventListener('click', this.bundClickEventFun);
    }
  },
  mounted() {
    this.getVotingEndTime(this.data.votingEndTime);
    this.chart = echarts.init(this.$refs.propsalsEchart);
    this.bundClick();
    this.configuration(this.data.data, this.levels);
    this.$nextTick(() => {
      let title_value_a_w = this.$refs.titleValue.querySelector('a').getBoundingClientRect().width;
      let w = this.$refs.titleValue.getBoundingClientRect().width;
      this.titleValueTipShow = title_value_a_w > w;
    });
  },
  destroyed() {
    this.unBundClick();
  }
}
</script>

<style lang="scss" scoped>
  a {
    color: $t_link_c !important;
  }
  .propsals_echart_container {
    box-sizing: border-box;
    width: 5.9rem;
    height: 4.2rem;
    border-radius: 0.01rem;
    border: 0.01rem solid  $bd_second_c;
    display: flex;
    flex-direction: column;
      background: $bg_white_c;
    .text {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .top {
        padding: 0.3rem 0.3rem 0.22rem;
        font-size: $s18;
        white-space: nowrap;
        display: flex;
        .title {
          color: $t_second_c;
          white-space: nowrap;
        }
        .value {
          margin-left: 0.06rem;
          color: $theme_c;
          white-space: nowrap;
        }
        .title_value_content {
          width: 0.01rem;
          flex: 1;
          display: flex;
          position: relative;
          cursor: pointer;
          .title_value {
            width: 0.01rem;
            flex: 1;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &:hover .tooltip_span{
            display: block;
          }
        }
      }
      .content {
        width: 100%;
        margin: auto;
        flex: 1;
        top: 0;
        display: flex;
        div.content_div {
          margin-left: 0.3rem;
          display: inline-block;

          div.per_title {
            margin-top: 0.3rem;
            font-size: $s14;
            color: $t_second_c$t_second_c;
          }
          & > div {
            font-size: $s12;
            color: $t_second_c;
            vertical-align: middle;
            // img {
            //   width: 0.14rem;
            //   vertical-align: middle;
            // }
            span {
              // vertical-align: middle;
              margin-left: 0.08rem;
            }
            p {
              margin-bottom: 0.06rem !important;
            }
          }
        }
      }
    }
    .propsals_echart_content {
      flex: 1;
      display: flex;
      justify-content: center;
      .propsals_echart {
        width: calc(100% - 0.2rem);
        max-width: 3.2rem;
        height: calc(100% - 0.2rem);
        max-height: 3.2rem;
        .propsals_echart_center {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
    }
  }
  .tooltip_span {
    width: 100%;
    max-width: calc(100% + 0.4rem);
    display: none;
    position: absolute;
    z-index: 1000;
    bottom: calc(100% + 0.04rem);
    left: 50%;
    transform: translateX(-50%);
    color: $bg_white_c;
    background-color: #000000;
    border-radius: 0.04rem;
    word-wrap: break-word;
    white-space: normal;
    font-size: $s12;
    line-height: 0.16rem;
    div {
      padding: 0.08rem 0.15rem;
    }
    &::after {
      width: 0;
      height: 0;
      border: 0.06rem solid transparent;
      content: "";
      display: block;
      position: absolute;
      border-top-color: #000000;
      left: 50%;
      margin-left: -0.06rem;
    }
  }
</style>
