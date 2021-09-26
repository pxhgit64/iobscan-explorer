<template>
  <div class="asset_container">
    <div class="asset_content">
      <div class="asset_title_container">
        <span>{{ $t("ExplorerLang.asset.nativeAssetsList") }}</span>
      </div>
      <div class="asset_table_list_content">
		  <list-component
			  :is-loading="isLoading"
			  :list-data="tableData"
			  :column-list="columnList"
			  :pagination="{pageSize:Number(pageSize),dataCount:dataCount,pageNum:Number(pageNumber)}"
			  @pageChange="pageChange"></list-component>
      </div>
    </div>
  </div>
</template>

<script>
import MPagination from ".././common/MPagination";
import Tools from "../../util/Tools";
import { getNativeAssetsListApi } from "@/service/api";
import productionConfig from "@/productionConfig.js";
import { ColumnMinWidth } from "@/constant";
import { addressRoute } from "@/helper/IritaHelper";
import ListComponent from "../common/ListComponent";
import nativeAssetColumnConfig from "../tableListColumnConfig/nativeAssetColumnConfig";
export default {
  name: "NativeAssetsList",
  components: {ListComponent, MPagination },
  props: {},
  data() {
    return {
		isLoading:false,
      Tools,
      addressRoute,
      ColumnMinWidth,
      tableData: [],
      pageSize: 10,
      pageNumber: 1,
      dataCount: 0,
		columnList:[]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  	this.columnList = nativeAssetColumnConfig
    this.getNtvAssetsListCount();
    this.getNtvAssetsList();
  },
  methods: {
    async getNtvAssetsList() {
    	this.isLoading = true
      try {
        let res = await getNativeAssetsListApi(
          this.pageNumber,
          this.pageSize,
          false
        );
        let result = res && res.data ? res.data : null;
        if (result) {
          this.tableData = await Promise.all(
            result.map(async item => {
              return {
                symbol: item.symbol,
                owner: item.owner,
                totalSupply: Tools.formatNumber(item.total_supply),
                initialSupply: Tools.formatNumber(item.initial_supply),
                maxSupply: Tools.formatNumber(item.max_supply),
                mintable: Tools.firstWordUpperCase(String(item.mintable))
              };
            })
          );
          this.isLoading =false
        } else {
          this.tableData = [];
			this.isLoading =false
		}
      } catch (err) {
		  this.isLoading =false
        console.error(err);
      }
    },
    async getNtvAssetsListCount() {
      try {
        let res = await getNativeAssetsListApi(null, null, true);
        if (res?.count) {
          this.dataCount = res.count;
        } else {
          this.dataCount = 0
        }
      } catch (err) {
        console.error(err);
      }
    },
    pageChange(pageNum) {
      if (this.pageNumber == pageNum) {
        return;
      }
      this.pageNumber = pageNum;
      this.getNtvAssetsList();
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.asset_container {
  .asset_content {
    max-width: 12rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    text-align: left;
    .asset_title_container {
      margin: 0.3rem 0 0.16rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
      span {
        margin-right: 0.1rem;
      }
    }
    .asset_table_list_content {
      width: 100%;
      .pagination_content {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin: 0.05rem 0 0.2rem 0;
      }
    }
  }
}
</style>
