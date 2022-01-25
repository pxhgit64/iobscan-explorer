<template>
    <div class="nft_search_container">
        <el-input class="nft_search_content" v-model.trim="input" size="small" @change="handleSearchClick"
                  :placeholder="inputPlaceholder"></el-input>
        <div class="tx_type_mobile_content">
            <el-button type="primary" size="small" class="search_btn" @click="handleSearchClick">
                {{ $t('ExplorerLang.nftAsset.search') }}
            </el-button>
            
        </div>
    </div>


</template>

<script>
export default {
    name: "NftSearchComponent",
    props: {
        inputPlaceholder: {
            type:String,
            default:''
        }
    },
    data() {
        return {
            input: ''
        }
    },
    methods: {
        handleSearchClick() {
            this.$emit('searchInput', this.input)
        },
		resetFilterCondition() {
			this.input = ''
			this.$emit('resetFilterCondition',this.input)
		}
    }
}
</script>

<style scoped lang="scss">
.nft_search_container {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-start;
	margin: 0.2rem 0;
    .nft_search_content {
        max-width: 3.5rem;
    }

    .tx_type_mobile_content {
        align-items: center;
        display: flex;

        .search_btn {
            background: $theme_c;
            border-color: $theme_c;
            margin: 0 0.1rem;
			border-radius: 0.08rem;
			padding: 0.08rem 0.15rem;
        }

        
    }
	::v-deep .el-input {
		.el-input__inner:focus {
			border-color: $theme_c !important;
		}
	}
}
</style>
