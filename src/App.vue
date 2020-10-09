<template>
  <div id="app">
    <Header></Header>
    <router-view class="content" :key="$route.fullPath"/>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/common/Header"
import Footer from "./components/common/Footer";
export default {
  name: 'app',
  components:{Footer, Header},
  data (){
    return {
      key: new Date()
    }
  }
}
</script>

<style lang="scss">
@import "style/index.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $t_first_c;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
  html {
    width: 100%;
    height: 100%;
    font-size: 625% !important;
    -webkit-text-size-adjust: none;
  }
  body{
    overflow-y: overlay;
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
  //el-tooltip 适配移动端
  @media screen and (max-width: 768px) {
    .el-tooltip__popper{
      max-width: 3.2rem;
    }
  }
 
</style>
