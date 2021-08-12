<template>
  <div class="propsals_card_container">
    <div class="top">
      <span class="title">#{{ data.proposal_id }}</span>
      <div class="title_value_content">
        <span class="value title_value" ref="titleValue">
          <router-link :to="`/ProposalsDetail/${data.proposal_id}`" class="link_style">{{ data.title }}</router-link>
        </span>
      </div>
    </div>
    <div class="text_content">
      <div>
        <span>{{data.type}}</span>
      </div>
      <div>
        <i class="iconfont iconDepositPeriod-liebiao" style="color: var(--bgColor)"></i>
        <span>{{ $t('ExplorerLang.gov.proposalsType.DepositPeriod') }}</span>
      </div>
    </div>
    <div class="content" ref="content">
      <span class="start" :style="{ marginLeft:30 }">0</span>
      <div class="progress">
        <div class="current" :style="{ width: `${data.total_deposit_number_per}` }">
          <div class="current_value">
            <span ref="totalDeposit">{{ $t('ExplorerLang.gov.CurrentDeposit') }} {{ data.total_deposit_format }}</span>
          </div>
        </div>
        <div class="initial" :style="{ left: `${data.initial_deposit_number_per}` }">
          <div class="initial_value">
            <span ref="intialDeposit">{{ $t('ExplorerLang.gov.InitialDeposit') }} {{ data.initial_deposit_format }}</span>
          </div>
        </div>
      </div>
      <span class="end">
        <span>
          {{ data.min_deposit_format }}
          <span class="end_value">({{ $t('ExplorerLang.gov.MinDeposit') }})</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MProposalsCard',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  watch: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {},
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.propsals_card_container {
  width: 5.9rem;
  box-sizing: border-box;
  height: 100%;
  border-radius: 1px;
  border: 1px solid $bd_first_c;
  position: relative;
  display: flex;
  flex-direction: column;
  background: $t_white_c;
  font-size: $s12;
  .top {
    padding: 0.3rem 0.3rem 0.20rem;
    display: flex;
    font-size: $s18;
    position: relative;
    z-index: 1;
    .title {
      color: $t_second_c;
    }
    .value {
      margin-left: 0.06rem;
      color: $theme_c;
      white-space: nowrap;
    }
    .title_value_content {
      width: 1px;
      flex: 1;
      display: flex;
      position: relative;
      cursor: pointer;
      .title_value {
        width: 1px;
        flex: 1;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .text_content {
    padding: 0 0.3rem;
    font-size: $s12;
    display: flex;
    align-items: center;
    div {
      img {
        width: 0.14rem;
      }
      span {
        margin-left: 0.08rem;
        margin-right: 0.3rem;
      }
    }
    & > div:nth-child(2) {
      margin-left: 0.15rem;
    }
  }
  .content {
    margin: 0.57rem 0rem 0.42rem;
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    span.start {
      text-align: right;
      margin-left: 0.3rem;
      margin-right: 0.16rem;
      color: $t_second_c;
    }
    span.end {
      margin-left: 0.16rem;
      margin-right: 0.3rem;
      color: $t_second_c;
      span.end_value {
        color: $t_second_c;
      }
    }
    .progress {
      width: 4.6rem;
      height: 0.12rem;
      background: $bg_cancel_c;
      border-radius: 0.17rem;
      position: relative;
      overflow: visible;
      white-space: nowrap;
      flex: 1;
      .current {
        position: absolute;
        height: 100%;
        background: $theme_c;
        border-radius: 0.17rem;
        .current_value {
          position: relative;
          &::before {
            display: block;
            content: '';
            width: 0;
            height: 0;
            border: 4.5px solid transparent;
            border-top-color: #ff9942;
            margin-left: 100%;
            margin-top: -2px;
            transform: translateX(-50%) translateY(-50%);
          }
          span {
            position: absolute;
            top: -100%;
            left: 100%;
            margin-top: -20px;
            font-size: 12px;
            transform: translateX(-50%);
            color: #ff9942;
            margin-left: 0.35rem;
          }
        }
      }
      .initial {
        position: absolute;
        width: 0px;
        height: 100%;
        overflow: visible;
        .initial_value {
          text-align: center;
          position: absolute;
          top: 100%;
          font-size: 12px;
          transform: translateX(-50%);
          color: $theme_c;
          .initial_value_span {
            display: block;
            color: $t_second_c;
          }
          span {
            display: inline-block;
            padding-top: 2px;
            margin-left: 0.3rem;
          }
          &::before {
            display: block;
            content: '';
            width: 0;
            height: 0;
            border: 4.5px solid transparent;
            border-bottom-color: $theme_c;
            margin: auto;
            margin-top: 2px;
            transform: translateX(1px) translateY(-50%);
          }
        }
      }
    }
  }
}
</style>
