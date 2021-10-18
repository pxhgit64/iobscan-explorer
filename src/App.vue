<template>
  <div id="app" @click.stop="closeMsgChildrenType()">
    <Header></Header>
    <router-view class="content" :key="$route.fullPath"/>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/common/Header"
import Footer from "./components/common/Footer";
import { getTxType } from './helper/IritaHelper';
export default {
  name: 'app',
  components:{Footer, Header},
  data (){
    return {
      key: new Date(),
    }
  },
  created(){
    try {
      getTxType()
    } catch (error) {
      console.log(error)
    }
  },
  mounted(){
    // echart不能使用媒体查询
    if (window.innerWidth > 910) {
        this.$store.commit('isMobile',false);
    } else {
        this.$store.commit('isMobile',true);
    }
  },
	methods:{
		closeMsgChildrenType(){
			const lastChoiceMsgModelIndex = sessionStorage.getItem('lastChoiceMsgModelIndex') || 0
			this.$store.commit('isShowMsgChildrenType',false)
			this.$store.commit('currentTxModelIndex',Number(lastChoiceMsgModelIndex))
		}
	}
}
</script>

<style lang="scss">
@import "style/index.css";
@font-face {
	font-family: PlblicScas;
	src: url("./font/PublicSans-Regular-14.otf");
}
#app {
  font-family: PlblicScas, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $t_first_c;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
	-webkit-tap-highlight-color:rgba(0,0,0,0);
 }
  html {
    width: 100%;
    height: 100%;
    font-size: 625% !important;
    -webkit-text-size-adjust: none;
  }
  body{
    // overflow-y: scroll;
    overflow-y: auto;
    background: $bg_cancel_c;
    font-size: $s16 !important;
  }
 html body{
   height: 100%;
    .el-menu--horizontal{
      .el-menu {
        background: $bg_white_c !important;
        .el-menu-item{
          background: $bg_white_c !important;
          a{
            color: $t_first_c;
          }
          a:hover{
            color: $t_link_c !important;
          }
        }
      }
    }
  }
  .content{
    margin-top: 0.61rem;
    flex: 1;
  }

  @media screen and (max-width: 1000px) {
    .content{
      margin-top: 1.21rem;
    }
  }
/*  {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }*/
  .el-select-dropdown__item.selected{
    color: $theme_c !important;
  }
  .el-popper .in-active-path,
  .el-popper .is-active {
    color: $theme_c !important;
  }
  //el-tooltip 适配移动端
  @media screen and (max-width: 768px) {
    .el-tooltip__popper{
      max-width: 3.2rem;
    }
  }
  .address_link {
    color: $t_link_c !important;
    cursor:pointer;
    font-weight: normal !important;
  }

  .el-table .cell {
    word-break: break-word !important;
    overflow: visible !important;
  }

  .tx_type .cell span {
    white-space: nowrap;
    text-overflow:ellipsis;
  }

  .yiwen_icon {
      font-weight: normal;
      margin-left: 0.05rem;
  }
  .ty_type_message {
    display: flex;
    align-items: center;
    // justify-content: space-between;
  }
  .message_number {
    margin-left: 0.08rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F4F4F4;
    width: 0.35rem;
    height: 0.18rem;
    border-radius: 4px;
  }
  .more_icontiaozhuan {
      font-size: 12px !important;
  }
  td.from,td.hash_status,td.to,td.moniker,td.operator,td.signer,td.address,td.requestId,td.amount,td.sender {
      font-family: DroidSansMono;
  }
  .table_overflow_x,
  .el-table {
    overflow-x: auto !important;
  }
  .el-table__header-wrapper,.el-table__body-wrapper {
    overflow: visible !important;
  }
.el-table__row.statistics-blue-row {
	background-color: $table_tr_c !important;
}
.statistics-white-row{
	&:hover{
		background-color: $table_tr_c !important;
	}
}
.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
	background: transparent !important;
}
</style>
