<template>
    <div class="common_pagination_content">
        <button
			class="first_button"
            v-if="showToFristEnd"
            @click="toFrist"
            :class="[currentPage === 1 || total === 0 ? 'no_disable' : '']"
        ><span class="iconfont icondiyiye"></span></button>
        <button class="prev_button" v-debounce="[prev,`click`,300]" :class="[currentPage === 1 || total === 0 ? 'no_disable' : '']"><span class="iconfont iconxiangqianyiye
"></span></button>
        <span class="page_number_content">{{currentPage}}/{{Math.ceil(total/pageSize) === 0 ? 1 : Math.ceil(total/pageSize)}}</span>
        <button class="next_button" v-debounce="[after,`click`,300]" :class="[forMaxRange() || total === 0 ? 'no_disable' : '']"><span class="iconfont iconxianghouyiye"></span></button>
        <button
			class="latest_button"
            v-if="showToFristEnd"
            @click="toEnd"
            :class="[currentPage === totalPages || total === 0 ? 'no_disable' : '']"
        ><span class="iconfont iconzuihouyiye"></span></button>
    </div>
</template>

<script>
export default {
    name: "MPagination",
    props: {
        page: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 30
        },
        pageChange: {
            type: Function,
            default: function() {}
        },
        range: {
            type: Array,
            default: function() {
                return [];
            }
        },
        showToFristEnd: {
            type: Boolean,
            default: true
        },
	    showInfo:{
        	type: Boolean,
            default: true
        },
        ascending: {
            //rang升序
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            currentPage: this.page || 1,
            currentRange: []
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.total / this.pageSize);
        },
        from() {
            return (this.currentPage - 1) * this.pageSize + 1;
        },
        to() {
            let to = this.currentPage * this.pageSize;
            if (to < this.total) {
                return to;
            } else {
                return this.total;
            }
        }
    },
    methods: {
        toFrist() {
            this.currentPage = 1;
        },
        toEnd() {
            this.currentPage = this.totalPages;
        },
        prev() {
            if (this.currentPage > 1) {
                this.currentPage = this.currentPage - 1;
            }
        },
        after() {
            if (this.currentPage < this.totalPages && this.currentRange[1]) {
                if (!this.ascending) {
                    if (this.currentRange[1] > 1) {
                        this.currentPage = this.currentPage + 1;
                    }
                } else {
                    if (this.currentRange[1] < this.total) {
                        this.currentPage = this.currentPage + 1;
                    }
                }
            }
        },
        forRange() {
            if (this.ascending) {
                let after = this.currentPage * this.pageSize;
                this.currentRange = [
                    (this.currentPage - 1) * this.pageSize + 1,
                    after > this.total ? this.total : after
                ];
            } else {
                this.currentRange = this.range;
            }
        },
        forMaxRange() {
            if (this.ascending && this.currentRange[1] >= this.total) {
                return true;
            } else if (this.currentRange[1] === 1) {
                return true;
            }
            return false;
        }
    },
    watch: {
        page(newVal) {
          this.currentPage = newVal;
        },
        currentPage(newVal) {
          this.pageChange(newVal);
          this.forRange();
        },
        range(newVal) {
            this.currentRange = newVal;
        },
        total(newVal) {
            this.forRange();
        }
    },
    mounted() {
        this.currentPage = this.page;
        this.forRange();
    }
};
</script>

<style lang="scss" scoped>
.info {
    color: $t_second_c;
    vertical-align: middle;
    margin-right: 0.1rem;
}
.common_pagination_content{
	display: flex;
	justify-content: flex-end;
    //border: 0.01rem solid $bd_second_c;
	.first_button{
		border: 0.01rem solid $bd_second_c;
		border-radius: 0.08rem;
		margin-right: 0.06rem;
		.iconfont{
			font-size: 0.12rem;
		}
	}
	.latest_button{
		border: 0.01rem solid $bd_second_c;
		border-radius: 0.08rem;
		margin-left: 0.06rem;
		.iconfont{
			font-size: 0.12rem;
		}
	}
	.prev_button{
		border: 0.01rem solid $bd_second_c;
		border-radius: 0.08rem 0 0 0.08rem;
		.iconfont{
			font-size: 0.12rem;
		}
	}
	.next_button{
		border: 0.01rem solid $bd_second_c;
		border-radius: 0 0.08rem 0.08rem 0;
		.iconfont{
			font-size: 0.12rem;
		}
	}
}
.page_number_content{
    padding: 0.07rem 0.05rem;
    font-size: $s14;
    line-height: 1;
    background: $bg_white_c;
    display: inline-block;
	border-bottom: 0.01rem solid $bd_second_c;
	border-top: 0.01rem solid $bd_second_c;
}
button {
    outline: none;
    border: none;
    padding: 5px 7.5px;
    color: $theme_c;
    line-height: 17px;
    background-color: $bg_white_c;
    cursor: pointer;
    &:hover {
        background-color: $bg_highlight_c;
    }
    &:focus {
        outline: none;
    }
}
button:nth-child(1) {
    border-top-left-radius: 0.025rem;
    border-bottom-left-radius: 0.025rem;
    border-right: 0.01rem solid $bd_second_c;
}
button:nth-of-type(2){
    border-right: 0.01rem solid $bd_second_c;
}
button:nth-of-type(3){
    border-left: 0.01rem solid $bd_second_c;
}
button:nth-last-child(1) {
    border-left: 0.01rem solid $bd_second_c;
    border-top-right-radius: 0.025rem;
    border-bottom-right-radius: 0.025rem;
}
button.no_disable {
    cursor: auto;
    color: $t_third_c;
    &:hover {
        background-color: $bg_white_c;
    }
}
</style>
