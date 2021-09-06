<template>
  <div class="deposit_card_content">
    <div class="title_container" v-if="showTitle">
      <div class="title_content">
        <router-link :to="`/ProposalsDetail/${proposalId}`">
          <span class="proposal_id_content">#{{ proposalId }}</span>
          <span class="proposal_title">{{ title }}</span>
        </router-link>
      </div>
      <div class="view_all_content">
        <span><router-link :to="`/gov/proposals`">{{ $t('ExplorerLang.gov.proposalDetail.viewAll') }}</router-link></span>
      </div>
    </div>
    <div class="deposit_title_container">
      <div class="header_title_content">
        <span>{{ proposalType }}</span>
        <span v-show="flShowVotingPeriod"><i class="iconfont iconDepositPeriod" style="color: var(--bgColor)"></i>VotingPeriod</span>
        <span v-show="!flShowPass && !flShowReject && !flShowVotingPeriod"><i style="color: var(--bgColor)" class="iconfont iconDepositPeriod-liebiao"></i>DepositPeriod</span>
        <span v-show="flShowPass"><i class="iconfont iconPass"></i>Passed</span>
        <span v-show="flShowReject"><i class="iconfont iconVeto"></i>Rejected</span>
      </div>
      <div v-if="flShowHourLeft && flShowCardHourLeft">
        <span><i style="color:#5AC8FA;" class="iconfont iconHoursLeft"></i>{{ hourLeft }} Left</span>
      </div>
    </div>
    <div class="deposit_content">
      <div class="content">
        <span class="initial_value_content">0</span>
        <div class="progress_bar_content">
          <span v-show="!flShowBurnAll" class="min_value_content" :style="minValueStyleObj">
            <span class="min_value_title">{{ $t('ExplorerLang.gov.proposalDetail.totalDeposit') }} {{ totalDeposit }}</span>
          </span>
          <span v-show="flShowBurnAll" class="min_value_content" :style="burnTipStyle0bj">
            <span class="min_value_title">{{ $t('ExplorerLang.gov.proposalDetail.burnedDeposit') }} {{ burnValue }}</span>
          </span>
          <div class="default_progress_bar_content" v-show="!flBurnAll" :class="flShowDiffStyle ? 'diff_blue' : ''"></div>
          <div class="default_progress_bar_content" v-show="flBurnAll" :class="flBurnAll ? 'diff_burn_red' : ''"></div>
          <div class="burned_progress_bar_content" :style="burnStyle0bj" :class="flShowDiffStyle ? 'show_burn_style' : ''"></div>
          <div class="min_deposit_bar_content" v-if="flShowBlue && flShowDiffStyle" :style="minDepositStyleObject" :class="flShowBlue ? 'showBlue' : ''"></div>
          <div class="min_deposit_bar_content" v-if="flHideBlue && !flShowDiffStyle" :style="minDepositStyleObject" :class="flHideBlue ? 'hideBlue' : ''"></div>
          <div class="total_deposit_bar_content"></div>
          <div class="init_content"></div>
          <span v-show="!flShowBurnAll" class="max_value_content" :style="initialDepositStyleObj">
            <span class="max_value_title">{{ $t('ExplorerLang.gov.proposalDetail.initialDeposit') }} {{ initialDeposit }}</span>
          </span>
          <span v-show="flShowBurnAll" class="max_value_content no_tool_tip_style" :style="minValueStyleObj">
            <span class="max_value_title">{{ $t('ExplorerLang.gov.proposalDetail.totalDeposit') }} {{ totalDeposit }}</span>
          </span>
        </div>
        <span class="total_value_content">{{ minDepositToken }} {{ minDepositTokenDenom }} {{ $t('ExplorerLang.gov.proposalDetail.minDeposit') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '../../util/Tools'
import { getMainToken, converCoin } from '@/helper/IritaHelper'
import { proposalStatus } from '../../constant'
export default {
  name: 'MDepositCard',
  props: {
    depositObj: {
      type: Object,
    },
    burnPercent: {
      type: Number,
    },
    status: {
      type: String,
    },
    showTitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      proposalType: '',
      title: '',
      proposalId: '',
      hourLeft: '',
      minDepositToken: '',
      minDepositTokenDenom: '',
      totalDeposit: '',
      initialDeposit: '',
      flShowHourLeft: false,
      flShowBlue: false,
      flShowDepositPeriod: false,
      flHideBlue: false,
      flShowDiffStyle: false,
      blueWidth: '',
      flBurnAll: false,
      burnValue: '',
      flTotalGreaterThanMin: false,
      flShowBurnAll: false,
      localBurnPercent: '',
      flShowPass: false,
      flShowReject: false,
      flShowVotingPeriod: false,
      flShowCardHourLeft: false,
      hourLeftTimer: null,
      minDepositStyleObject: {
        width: '',
      },
      minValueStyleObj: {
        left: '',
      },
      burnStyle0bj: {
        width: '',
      },
      initialDepositStyleObj: {
        left: '',
      },
      burnTipStyle0bj: {
        left: '',
      },
    }
  },
  watch: {
    async depositObj(depositObj) {
      await this.formatDepositObj(depositObj)
      this.flShowProgressBar()
      this.flShowInitial()
      if (this.localBurnPercent) {
        this.flShowBurn(this.localBurnPercent)
      }
    },
    burnPercent(burnPercent) {
      this.localBurnPercent = burnPercent
      this.flShowBurn(burnPercent)
    },
    status(status) {
      if (status === proposalStatus.passed) {
        this.flShowPass = true
      } else if (status === proposalStatus.rejected) {
        this.flShowReject = true
      }
    },
  },
  methods: {
    async formatDepositObj(depositObj) {
      if (depositObj) {
        if (depositObj.status === 'VotingPeriod') {
          this.flShowVotingPeriod = true
        }
        if (depositObj.status === 'DepositPeriod') {
          this.flShowCardHourLeft = true
        } else {
          this.flShowCardHourLeft = false
        }
        this.title = depositObj.content && depositObj.content.title
        this.proposalId = depositObj.id
        this.proposalType = depositObj.content && depositObj.content.type
        this.getAgeHour(depositObj.deposit_end_time)
        await this.setMinDepositToken(depositObj)
        await this.setTotalDepositToken(depositObj)
        await this.setInitialDeposit(depositObj)
      }
    },
    async setMinDepositToken(depositObj) {
      let token = await getMainToken()
      if (depositObj.min_deposit) {
        let amount = await converCoin({
          amount: depositObj.min_deposit,
          denom: token.denom,
        })
        this.minDepositToken = amount.amount
        this.minDepositTokenDenom = amount.denom.toUpperCase()
      }
    },
    async setTotalDepositToken(depositObj) {
        if(depositObj.total_deposit && depositObj.total_deposit.length > 0) {
            let amount = await converCoin(depositObj.total_deposit[0])
            this.totalDeposit = amount.amount
        }
    },
    async setInitialDeposit(depositObj) {
        if(depositObj.initial_deposit && depositObj.initial_deposit.length > 0) {
            let amount = await converCoin(depositObj.initial_deposit[0])
            this.initialDeposit = amount.amount
        }
    },
    getAgeHour(time) {
      if (time) {
        clearInterval(this.hourLeftTimer)
        let that = this
        let currentServerTime = Tools.getTimestamp()
        if (new Date(time).getTime() > currentServerTime) {
          that.hourLeft = Tools.formatAge(new Date(time).getTime(), currentServerTime * 1000)
          that.flShowHourLeft = true
        } else {
          that.flShowHourLeft = false
        }
        this.hourLeftTimer = setInterval(() => {
          currentServerTime = Tools.getTimestamp()
          if (new Date(time).getTime() > currentServerTime) {
            that.hourLeft = Tools.formatAge(new Date(time).getTime(), currentServerTime * 1000)
            that.flShowHourLeft = true
          } else {
            that.flShowHourLeft = false
          }
        }, 1000)
      }
    },
    flShowProgressBar() {
      if (Number(this.totalDeposit) === Number(this.minDepositToken)) {
        this.flHideBlue = true
        this.flShowDepositPeriod = true
        this.$set(this.minDepositStyleObject, 'width', '100%')
        this.$set(this.minValueStyleObj, 'left', '100%')
        this.$set(this.initialDepositStyleObj, 'left', '100%')
      } else if (Number(this.totalDeposit) > Number(this.minDepositToken)) {
        this.flShowBlue = true
        this.flShowDiffStyle = true
        this.flShowDepositPeriod = true
        this.$set(this.minDepositStyleObject, 'width', `${((this.minDepositToken / this.totalDeposit) * 100).toFixed(2)}%`)
        this.$set(this.minValueStyleObj, 'left', '100%')
      } else if (Number(this.totalDeposit) < Number(this.minDepositToken)) {
        this.flHideBlue = true
        this.$set(this.minDepositStyleObject, 'width', `${((this.totalDeposit / this.minDepositToken) * 100).toFixed(1)}%`)
        this.$set(this.minValueStyleObj, 'left', `${((this.totalDeposit / this.minDepositToken) * 100).toFixed(1)}%`)
      }
    },
    flShowInitial() {
      if (Number(this.initialDeposit) === Number(this.minDepositToken)) {
        this.$set(this.initialDepositStyleObj, 'left', '100%')
      } else if (Number(this.initialDeposit) > Number(this.minDepositToken)) {
        let diffNumber = this.initialDeposit - this.minDepositToken
        this.$set(this.minDepositStyleObject, 'width', `${((this.minDepositToken / this.initialDeposit) * 100).toFixed(2)}%`)
        this.$set(this.minValueStyleObj, 'left', '100%')
        this.$set(this.initialDepositStyleObj, 'left', '100%')
      } else if (Number(this.initialDeposit) < Number(this.minDepositToken)) {
        this.$set(this.initialDepositStyleObj, 'left', `${((this.initialDeposit / this.minDepositToken) * 100).toFixed(1)}%`)
      }
    },
    flShowBurn(burnPercent) {
        this.burnValue = this.totalDeposit
        this.$set(this.burnStyle0bj, 'width', `${((this.minDepositToken / this.totalDeposit) * 100).toFixed(2)}%`)
        this.$set(this.burnTipStyle0bj, 'left', '100%')
        this.flShowDiffStyle = true
        this.flBurnAll = true
        this.flShowBurnAll = true
    },
  },
  async mounted() {
    await this.formatDepositObj(this.depositObj)
    this.flShowProgressBar()
    this.flShowInitial()
    if (this.localBurnPercent) {
      this.flShowBurn(this.localBurnPercent)
    }
  },
}
</script>

<style scoped lang="scss">
.deposit_card_content {
  flex: 1;
  justify-content: space-between;
  min-height: 2rem;
  height: auto;
  background: $t_white_c;
  box-sizing: border-box;
  padding: 0.2rem;
  // border: 0.01rem solid $bd_second_c;
  margin-bottom: 0.3rem;
  .title_container {
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title_content {
      line-height: 1;
      font-size: 0.16rem;
      max-width: 480px;
      overflow: hidden;
      text-overflow: ellipsis;
      .proposal_id_content {
        color: $t_second_c;
        margin-right: 0.1rem;
      }
      .proposal_title {
        color: $theme_c;
        white-space: nowrap;
      }
    }
    .view_all_content {
      color: $theme_c;
      min-width: 0.65rem;
      span {
        line-height: 1;
        border-bottom: 0.01rem solid $theme_c;
        a {
          font-size: 0.14rem;
          color: $theme_c !important;
        }
      }
    }
  }
  .deposit_title_container {
    font-size: 0.12rem;
    display: flex;
    flex-direction: row;
    .header_title_content {
      display: flex;
    }
    i {
      margin-right: 0.1rem;
      font-size: 0.14rem;
    }
    .iconParameterChange {
      color: #ff8000;
    }
    .iconDepositPeriod {
      color: $theme_c;
    }
    .iconPass {
      color: #44c190;
    }
    .iconVeto {
      color: #ffaaa6;
    }
    .iconHoursLeft {
      color: $t_second_c;
    }
    span {
      margin-right: 0.2rem;
      color: $t_first_c;
      i {
        font-size: 0.14rem !important;
      }
    }
  }
  .deposit_content {
    margin-top: 0.4rem;
    .content {
      display: flex;
      align-items: center;
      margin-top: 0.61rem;
      .initial_value_content {
        font-size: 0.12rem;
        color: $t_first_c;
        margin-right: 0.2rem;
      }
      .progress_bar_content {
        flex: 1;
        width: 100%;
        position: relative;
        bottom: 0.07rem;
        margin-right: 0.2rem;
        .min_value_content {
          color: #ff9942;
          bottom: 0.1rem;
          position: absolute;
          .min_value_title {
            font-size: 0.12rem;
            position: relative;
            display: inline-block;
            right: 30%;
            width: 100%;
            white-space: nowrap;
            &::after {
              width: 0;
              height: 0;
              border: 0.06rem solid transparent;
              content: '';
              display: block;
              position: absolute;
              border-top-color: #ff9942;
              left: 24%;
              bottom: -0.12rem;
            }
          }
        }
        .default_progress_bar_content {
          width: 100%;
          height: 0.12rem;
          border-radius: 0.06rem;
          position: absolute;
          background: $bg_cancel_c;
          z-index: 1;
        }
        .diff_blue {
          background: $theme_c !important;
        }
        .diff_burn_red {
          background: #ffaaa6 !important;
        }
        .burned_progress_bar_content {
          height: 0.12rem;
          border-radius: 0.06rem;
          position: absolute;
          background: #d25f59;
        }
        .show_burn_style {
          z-index: 3;
        }
        .min_deposit_bar_content {
          height: 0.12rem;
          border-radius: 0.06rem;
          position: absolute;
        }
        .showBlue {
          background: #79c9ff;
          z-index: 1;
        }
        .hideBlue {
          background: $theme_c;
          z-index: 1;
        }
        .show_max_blue {
          background: $theme_c;
        }
        .total_deposit_bar_content {
          height: 0.12rem;
          border-radius: 0.06rem;
          position: absolute;
        }
        .init_content {
          height: 0.12rem;
          border-radius: 0.06rem;
          position: absolute;
        }
        .max_value_content {
          position: absolute;
          top: 0.21rem;
          .max_value_title {
            position: relative;
            right: 30%;
            width: 100%;
            white-space: nowrap;
            font-size: 0.12rem;
            color: $theme_c;
            &::after {
              width: 0;
              height: 0;
              border: 0.06rem solid transparent;
              content: '';
              display: block;
              position: absolute;
              border-bottom-color: $theme_c;
              left: 24%;
              top: -0.14rem;
            }
          }
        }
        .no_tool_tip_style {
          &::after {
            width: 0;
            height: 0;
            border: none;
            content: '';
            display: block;
            position: absolute;
            border-bottom-color: transparent;
            left: -0.06rem;
            top: -50%;
          }
        }
      }
      .total_value_content {
        color: $t_first_c;
        font-size: 0.12rem;
        margin-left: 0.02rem;
      }
    }
  }
}
@media screen and (max-width: 1280px) {
  .deposit_card_content {
    margin: 0 0 0.2rem 0;
    .deposit_title_container {
       flex-direction: row;
    }
  }
  .title_content {
    max-width: none !important;
  }
}
</style>
