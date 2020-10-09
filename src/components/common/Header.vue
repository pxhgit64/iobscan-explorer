<template>
  <div class="header_container" :style="`background-color:${(prodConfig.nav || {}).bgColor || ''}`">
    <div class="header_content">
      <div class="header_menu_content">
        <div class="header_logo_content" @click="logoClick">
          <img class="header_logo_content_icon" v-if="logoImg.length" :src="logoImg" alt="" />
          <div :style="`color:${(prodConfig.nav || {}).color || ''}`">
            <p>{{ (prodConfig.logo || {}).title || 'CSChain-Bond' }}</p>
            <p>{{ (prodConfig.logo || {}).subTitle || '债券应用链浏览器' }}</p>
          </div>
        </div>
        <div class="header_menu">
          <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            :background-color="(prodConfig.nav || {}).bgColor || '#3264FD'"
            :text-color="(prodConfig.nav || {}).color || '#CBD8FE'"
            :active-text-color="(prodConfig.nav || {}).activeTextColor || '#fff'"
          >
            <component v-for="(item, index) in menuList" :is="item.children ? 'el-submenu' : 'el-menu-item'" :index="String(index + 1)" :key="index">
              <router-link v-if="!item.children" :to="item.link">{{ item.title }}</router-link>
              <template v-else>
                <template slot="title">
                  {{ item.title }}
                </template>
                <el-menu-item :index="`${index + 1}-${subIndex + 1}`" :key="subIndex" v-for="(subItem, subIndex) in item.children">
                  <router-link :to="subItem.link">
                    {{ subItem.title }}
                  </router-link>
                </el-menu-item>
              </template>
            </component>
          </el-menu>
        </div>
        <div class="header_mobile_menu" @click="featureShow = !featureShow">
          <span v-if="netWorkArray.length !== 0" style="color:white;font-size: 0.12rem;font-family: PingFangSC-Regular, PingFang SC">{{netWorkArray[0].netWorkSelectOption}}</span>
          <!-- <img class="menu_btn" src="../../assets/menu.png" /> -->
        </div>
      </div>
      <div class="header_input_content" :style="`background-color:${(prodConfig.nav || {}).bgColor || ''}`" v-if="searchShow">
        <div class="search_input_container" :style="`background-color:${(prodConfig.nav || {}).bgColor || ''}`">
          <div class="search_input_wrap">
            <input type="text" class="search_input" :style="`color:${(prodConfig.nav || {}).color || ''}`" :placeholder="$t('ExplorerLang.Navigation.searchPlaceHolder')" v-model.trim="searchInputValue" @keyup.enter="onInputChange" />
            <span @click="getData(searchInputValue)" class="iconfont iconsousuo" :style="`color:${(prodConfig.nav || {}).color || ''}`"></span>
          </div>
          <div class="header_mobile_menu" @click="featureShow = !featureShow">
            <img class="menu_btn" src="../../assets/menu.png" />
          </div>
        </div>
      </div>
      <div v-show="moduleSupport('110', prodConfig.navFuncList)" class="header_network_container" @mouseenter="showNetWorkLogo()" @mouseleave="hideNetWorkLogo()">
          <span style="color: #fff">
              <i style="font-size: 0.24rem;padding-right: 0.02rem;" class="iconfont iconiris"></i>
              <i style="font-size: 0.08rem" class="iconfont iconwangluoqiehuanjiantou"></i>
          </span>
          <ul class="network_list_container" v-show="flShowNetworkLogo && netWorkArray.length !== 0" @mouseenter="showNetWorkLogo()" @mouseleave="hideNetWorkLogo()">
              <li class="network_list_item"
                  v-for="item in netWorkArray"
                  :key="item.chain_id"
                  @click="windowOpenUrl(item.host)"><i :class="item.icon"></i>{{item.netWorkSelectOption}}</li>
          </ul>
      </div>
      
      <div class="use_feature_mobile" v-if="featureShow">
        <div v-for="(item, index) in menuList" class="mobile_tab_item_wrap" :key="String(index)" :style="`color:${(prodConfig.nav || {}).color || ''}`">
          <span class="mobile_tab_item" @click="mobileMenuDidClick(item, index, false)" v-if="!item.children">
            {{ item.title }}
          </span>
          <div class="mobile_tab_item_children_container" v-else>
            <span class="mobile_tab_item mobile_tab_item_has_children" @click="handleParentTitleClick(index)">
              {{ item.title }}
              <img src="../../assets/expanding.svg" v-show="!expandingList.includes(index)" class="mobile_tab_item_icon" />
              <img src="../../assets/retract.svg" v-show="expandingList.includes(index)" class="mobile_tab_item_icon" />
            </span>
            <transition name="fade">
              <div class="mobile_tab_item_sub_children_container" v-show="expandingList.includes(index)">
                <span class="mobile_tab_item mobile_tab_item_child" :key="String(subIndex + 10)" @click="mobileMenuDidClick(child, subIndex, true)" v-for="(child, subIndex) in item.children">
                  {{ child.title }}
                </span>
              </div>
            </transition>
          </div>
        </div>
        <div v-show="moduleSupport('110', prodConfig.navFuncList)" class="mobile_tab_item_wrap" :style="`color:${(prodConfig.nav || {}).color || ''}`">
              
              <div class="mobile_tab_item_children_container" >
                  <span class="mobile_tab_item mobile_tab_item_has_children" @click="flShowNetWork">
                    Network
                    <img src="../../assets/expanding.svg" v-show="!flShowNetWorkMenu" class="mobile_tab_item_icon" />
                    <img src="../../assets/retract.svg" v-show="flShowNetWorkMenu" class="mobile_tab_item_icon" />
                  </span>
                  <transition name="fade">
                    <ul class="mobile_tab_item_sub_children_container" v-show="flShowNetWorkMenu && netWorkArray.length !== 0">
                        <li class="mobile_tab_item mobile_tab_item_child" v-for="item in netWorkArray" :key="item.chain_id">
                            <a style="color:white;" :href="item.host">{{item.netWorkSelectOption}}</a>
                        </li>
                    </ul>
                  </transition>
              </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Tools from '../../util/Tools'
import constant,{ addrPrefix, ModuleMap } from '../../constant'
import prodConfig from '../../productionConfig'
import { getBlockWithHeight, getTxDetail, getAddressTxList } from '../../service/api'
import { moduleSupport } from "@/helper/ModulesHelper"
import axios from 'axios'
export default {
  data() {
    return {
      moduleSupport,
      prodConfig,
      activeIndex: '1',
      activeIndex2: '0',
      searchInputValue: '',
      featureShow: false,
      menuList: [],
      searchShow: false,
      expandingList: [],
      flShowNetworkLogo:false,
      netWorkArray:[],
      currentNetworkClass:'',
      flShowNetWorkMenu:false,
    }
  },
  computed: {
    logoImg() {
      let img = ''
      try {
        img = require('../../assets/logo.png')
      } catch (e) {}
      return img
    },
  },
  beforeMount() {
    this.menuList = this.loadModules(prodConfig.navFuncList)
  },
  created() {
    this.getConfig()
  },
  mounted() {
    // this.$Crypto.getCrypto('iris', 'testnet');
    this.setActiveIndex()
  },
  watch: {
    $route: {
      handler(val) {
        this.setActiveIndex(val.path)
      },
      deep: true,
    },
  },
  methods: {
    loadModules(funcList) {
      let menuList = []
      if (funcList && funcList.length) {
        funcList.forEach(item => {
          if (item.children && item.children.length) {
            let submenu = { title: item.title }
            submenu.children = this.loadModules(item.children)
            menuList.push(submenu)
          } else if (ModuleMap[item.id]) {
            let menu = ModuleMap[item.id]
            if (item.title) {
              menu.title = item.title
            }
            menuList.push(menu)
          }
          if (item == '1000') {
            this.searchShow = true
          }
        })
      }
      return menuList
    },
    handleSelect(key, keyPath) {},
    handleParentTitleClick(index) {
      if (this.expandingList.includes(index)) {
        this.expandingList.splice(
          this.expandingList.findIndex(i => i === index),
          1
        )
      } else {
        this.expandingList.push(index)
      }
    },
    onInputChange() {
      this.getData()
    },
    logoClick() {
      this.$router.push(`/home`)
    },
    setActiveIndex(hash = window.location.hash) {
      if (this.menuList.every(m => !hash.includes(m.link))) {
        this.activeIndex2 = ''
      } else {
        this.menuList.forEach((m, i) => {
          if (hash.includes(m.link)) {
            this.activeIndex2 = String(i + 1)
          }
        })
      }
    },
    clearSearchContent() {
      this.searchInputValue = ''
    },
    mobileMenuDidClick(item, index) {
      this.$router.push(item.link)
      this.activeIndex2 = String(index + 1)
      this.featureShow = false
      this.expandingList = []
    },
    getData() {
      if (Tools.removeAllSpace(this.searchInputValue) === '') {
        this.clearSearchContent()
        return
      } else {
        if (/^[A-F0-9]{64}$/.test(this.searchInputValue)) {
          this.searchTx()
        } else if (Tools.isBech32(this.searchInputValue)) {
          this.searchDelegator()
        } else if (/^\+?[1-9][0-9]*$/.test(this.searchInputValue)) {
          this.searchBlock()
        } else {
          this.toSearchResultPage()
        }
      }
    },
    async searchBlock() {
      try {
        let blockData = await getBlockWithHeight(this.searchInputValue)
        if (blockData && blockData.height) {
          this.$router.push(`/block/${this.searchInputValue}`)
          this.clearSearchContent()
        } else {
          this.toSearchResultPage()
        }
      } catch (e) {
        console.error(e)
        this.toSearchResultPage()
      }
    },
    async searchDelegator() {
      try {
        const res = await getAddressTxList(this.searchInputValue, '', '', 1, 10)
        if (res) {
          this.$router.push(`/address/${this.searchInputValue}`)
          this.clearSearchContent()
        } else {
          this.toSearchResultPage()
        }
      } catch (e) {
        console.error(e)
        this.toSearchResultPage()
      }
    },
    async searchTx() {
      try {
        const res = await getTxDetail(this.searchInputValue)
        if (res) {
          this.$router.push(`/tx?txHash=${this.searchInputValue}`)
          this.clearSearchContent()
        } else {
          this.toSearchResultPage()
        }
      } catch (e) {
        console.error(e)
        this.toSearchResultPage()
      }
    },
    toSearchResultPage() {
      this.$router.push(`/searchResult?${this.searchInputValue}`)
      this.searchInputValue = ''
    },
    showNetWorkLogo(){
				this.flShowNetworkLogo = true;
    },
		hideNetWorkLogo(){
				this.flShowNetworkLogo = false;
    },
    async getConfig () {
        const { data: res } = await axios.get(`https://www.irisplorer.io/api/config`)
        this.handleConfigs(res.configs)
				// Service.commonInterface({headerConfig:{}},(res) => {
				// 	try {
				// 		sessionStorage.setItem('skinEnvInformation',JSON.stringify(res));
        //                 if(res.cur_env === constant.ENVCONFIG.TESTNET || res.cur_env === constant.ENVCONFIG.MAINNET){
        //                     this.$store.commit('hideTestSkinStyle',false)
        //                 }
				// 		this.flShowLogo = true;
				// 		this.toggleTestnetLogo(res);
				// 		this.setCurrentSelectOption(res.cur_env, res.chain_id, res.configs);
				// 		this.setEnvConfig(res);
				// 		this.handleConfigs(res.configs);
        //                 this.setNetWorkLogo();
        //                 this.flShowHeaderNetwork = true;
				// 		this.chainId = `${res.chain_id.toUpperCase()} ${res.cur_env.toUpperCase()}`;
				// 		res.configs.forEach(item => {
				// 			if (res.cur_env === item.env && res.chain_id === item.chain_id) {
				// 				if (item.show_faucet && item.show_faucet === 1) {
				// 					this.flShowFaucet = true;
				// 					sessionStorage.setItem("Show_faucet", JSON.stringify(1))
				// 				} else {
				// 					this.flShowFaucet = false;
				// 					sessionStorage.setItem("Show_faucet", JSON.stringify(0))
				// 				}
				// 			}
				// 		})
				// 	}catch (e) {
				// 		console.error(e);
				// 		this.explorerLogo = require("../../assets/logo.png")
				// 	}
        // });
    },
    handleConfigs (configs) {
				this.netWorkArray = configs.map(item => {
					if(item.network_name === constant.CHAINID.IRISHUB){
              item.icon = 'iconfont iconiris'
          }else if(item.network_name === constant.CHAINID.FUXI){
              item.icon = 'iconfont iconfuxi1'
          }else if(item.network_name === constant.CHAINID.NYANCAT){
              item.icon = 'iconfont iconcaihongmao'
          }else if(item.network_name === constant.CHAINID.GOZTESTNET){
              item.icon = 'iconfont iconGOZ'
          } else if (item.network_name === constant.CHAINID.BIFROST) {
              item.icon = 'iconfont iconBI-01'
          }
					item.netWorkSelectOption = `${Tools.firstWordUpperCase(item.env)} ${item.chain_id.toLocaleUpperCase()}`;
					return item
        });
				this.netWorkArray = this.netWorkArray.filter(item => {
					return item.env !== constant.ENVCONFIG.DEV && item.env !== constant.ENVCONFIG.QA && item.env !== constant.ENVCONFIG.STAGE
        });
        // console.log(this.netWorkArray)
    },
    windowOpenUrl (url) {
				window.open(url)
    },
    flShowNetWork() {
      this.flShowNetWorkMenu = !this.flShowNetWorkMenu
    }
  },
}
</script>

<style scoped lang="scss">
.header_container {
  background: $bg_main_c;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;

  .header_content {
    max-width: 12rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header_menu_content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 0.2rem;
      .header_logo_content {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-right: 0.2rem;
        height: 0.6rem;
        font-size: $s12;
        font-family: PingFangSC-Regular, PingFang SC;
        color: $t_white_c;
        text-align: left;
        line-height: 1.3;
        .header_logo_content_icon {
          height: 0.3rem;
          width: 0.3rem;
          margin-right: 0.12rem;
        }
        .header_logo_content_title {
        }
        .header_logo_content_subTitle {
        }
      }

      .header_menu {
        display: block;
        position: relative;
        bottom: 1px;
        .el-menu-demo {
          width: 100%;
          background: $bg_main_c;
          .el-menu-item {
            a {
              display: inline-block;
              width: 100%;
              // height: 100%;
              height: 0.6rem;
            }
          }
          /deep/.el-submenu {
            .el-submenu__title {
              .el-submenu__icon-arrow {
                color: inherit !important;
              }
            }
          }
        }
        .el-menu.el-menu--horizontal {
          border-bottom: solid 0px;
        }
      }
      .header_mobile_menu {
        display: none;
        .menu_btn {
          width: 0.2rem;
          height: 0.2rem;
          top: 0.26rem;
          right: 0.1rem;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .header_input_content {
    flex: 1;
    background: $bg_main_c;
    .search_input_container {
      flex: 1;
      background: $bg_main_c;
      z-index: 1;
      .search_input_wrap {
        max-width: 12.8rem;
        margin: 0 auto;
        display: flex;
        align-items: center;
        border: 0.01rem solid $t_fourth_c;
        border-radius: 0.06rem;
        input {
          width: 100%;
          height: 0.3rem;
          background: transparent;
          border: 0.01rem solid transparent;
          color: $t_white_c;
          font-size: $s14;
          text-indent: 0.1rem;
        }
        input::placeholder {
          font-size: $s14;
          color: $t_fourth_c;
        }
        span {
          right: 0.3rem;
          height: 0.3rem;
          font-size: $s20;
          padding: 0 0.1rem;
          line-height: 0.3rem;
          cursor: pointer;
          color: $t_fourth_c;
        }
      }
    }
    .header_mobile_menu {
      display: none;
      .menu_btn {
          width: 0.2rem;
          height: 0.2rem;
          top: 0.26rem;
          right: 0.1rem;
          img {
            width: 100%;
          }
        }
    }
  }
  .header_network_container{
      position: relative;
      height:0.6rem;
      line-height: 0.6rem;
      padding-left: 0.2rem;
      .network_list_container{
          background: #fff;
          box-shadow: 0 0.02rem 0.1rem 0 rgba(3,16,114,0.15);
          width: auto;
          position: absolute;
          right: 0;
          top: 0.6rem;
          z-index: 2;
          text-align: right;
          .network_list_item{
              height: 0.4rem;
              line-height: 0.4rem;
              white-space: nowrap;
              padding: 0 0.2rem;
              cursor: pointer;
              font-size: 0.14rem;
              display: flex;
              &:hover{
                  background: #F6F7FF;
              }
              i{
                  font-size: 0.18rem;
                  color: var(--titleColor);
                  padding-right: 0.2rem;
              }
          }
          .network_list_item:last-child{
              padding-bottom: 0.05rem;
          }
      }
  }
  .use_feature_mobile {
    display: none;
    width: 100%;
    // margin-top: 0.1rem;
    .mobile_tab_item_wrap {
      display: flex;
      color: $t_white_c;
      flex-direction: column;
      .mobile_tab_item {
        cursor: pointer;
        color: inherit;
        font-size: $s14;
        font-family: PingFangSC-Regular, PingFang SC;
        text-align: left;
        padding: 0.05rem 0;
        width: 100%;
        box-sizing: border-box;
      }
      .mobile_tab_item_children_container {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .mobile_tab_item_has_children {
          position: relative;
          .mobile_tab_item_icon {
            position: absolute;
            right: 0;
            width: 0.17rem;
            height: 0.08rem;
            top: 0.12rem;
          }
        }
        .mobile_tab_item_sub_children_container {
          background: rgba(0, 0, 0, 0.3);
          width: 100vw;
          position: relative;
          left: -0.15rem;
          display: flex;
          flex-direction: column;
          .mobile_tab_item_child {
            text-indent: 0.15rem;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .header_container {
    position: absolute;
    .header_content {
      padding: 0.1rem 0.15rem 0rem 0.15rem;
      flex-direction: column;
      .header_menu_content {
        width: 100%;
        .header_logo_content {
          margin-left: 0.1rem;
        }
        .header_menu {
          display: none;
        }
        .header_mobile_menu {
          display: block;
        }
      }
    }
    .header_input_content {
      width: 100%;
      padding-bottom: 0.1rem;
      .search_input_container {
        margin-top: 0.05rem;
        display: flex;
        .search_input_wrap {
          flex: 1;
        }
        .header_mobile_menu {
          display: block;
          padding: 0.1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .header_network_container {
      display: none;
    }
    .use_feature_mobile {
      display: block;
      .mobile_tab_item_wrap {
        .mobile_tab_item {
        }
        .mobile_tab_item_children_container {
          .mobile_tab_item_has_children {
            .mobile_tab_item_icon {
            }
          }
          .mobile_tab_item_sub_children_container {
            box-sizing: border-box;
            width: 100vw;
            .mobile_tab_item_child {
              width: 100%;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
}

@media screen and (max-width: 375px) {
}
</style>
