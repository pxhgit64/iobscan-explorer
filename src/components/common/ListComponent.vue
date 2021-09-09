<template>
	<div class="list_table_content_container">
		<el-card  class="box-card">
			<loading v-if="isLoading"></loading>
			<el-table :data="tabList" stripe>
				<el-table-column
					v-for="(item,index) in columns"
					:key="index"
					:prop="item.displayValue"
					:label="item.label">
					
					<template slot="header" slot-scope="scope">
						<span>{{item.label}}</span>
					</template>
					<template  slot-scope="scope">
						<router-link class="link_style"  v-if="item.isLink" :to="`${item.linkRoute}/${scope.row[item.nativeValue]}`">{{scope.row[item.displayValue]}}</router-link>
						<span v-else >{{scope.row[item.displayValue]}}</span>
					</template>
				</el-table-column>
			</el-table>
			<m-pagination :page-size="pagination.pageSize" :total="pagination.dataCount" :page="pagination.pageNumber"
						  :page-change="pageChange"></m-pagination>
		</el-card>
	</div>
</template>

<script>
import Loading from "./Loading";
import MPagination from "./MPagination";
export default {
	name: "ListComponent",
	components: {MPagination, Loading},
	data() {
		return {
			tabList: [],
			columns: []
		}
	},
	props: {
		isLoading:{
			type:Boolean,
			default:false
		},
		pagination:{
			type:Object,
			default:{}
		},
		columnList: {
			type: Array,
			default: []
		},
		listData:{
			type:Array,
			default: []
		}
	},
	watch: {
		columnList: {
			handler(newValue, oldValue) {
				this.columns = newValue
			},
			deep: true
		},
		listData: {
			handler(newValue, oldValue) {
				this.tabList = newValue
			},
			deep: true
		}
	},
	methods:{
		pageChange(pageNum){
			this.$emit('pageChange',pageNum)
		}
	},
	mounted() {
		this.columns = this.columnList
	}
}
</script>

<style scoped lang="scss">
.list_table_content_container {
	::v-deep.box-card{
		box-sizing: border-box;
		padding: 0.08rem 0.2rem 0 0.2rem;
		border-radius: 0.08rem;
		border: none;
		box-shadow: 0 0.03rem 0.06rem 0 #EDEDED;
		margin-bottom: 0.2rem;
		.el-card__body{
			width: 100%;
			height: 100%;
			padding: 0;
			border-radius: 0.8rem;
		}
		.link_style{
			color: $t_link_c !important;
		}
		.el-table td, .el-table th.is-leaf{
			border-bottom: 0.01rem solid rgba(248, 248, 248, 1);
		}
	}
}

</style>