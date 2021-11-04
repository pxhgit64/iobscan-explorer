<template>
    <div style="height: 100%;">
        <div class="line_tab_container">
            <div
                v-for="(v, i) in data"
                :key="i"
                :class="{'active': v.isActive}"
                @click="choseTab(v, i)"
            >{{v.title}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MTabs",
    props: {
        data: {
            type: Array,
            default: []
        },
        chose: {
            type: Function,
            default: function() {}
        }
    },
    methods: {
        choseTab(v, i) {
            this.data.forEach(v => {
                v.isActive = false;
            });
            v.isActive = true;
            this.chose && this.chose(i, v);
        }
    }
};
</script>

<style lang="scss" scoped>
.line_tab_container {
    width: auto;
    display: flex;
    font-size: $s14;
    text-align: center;
    cursor: pointer;
    height: 0.3rem;
    margin-top: 0.3rem;
    div {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 1px solid $bd_second_c;
        background-color: $bg_white_c;
        &:nth-of-type(1) {
            border-right-width: 0;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }
        &:last-child {
            border-left-width: 0;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }
    .active {
        background-color: $theme_c;
        border-color: $theme_c;;
        color: $t_button_c;
    }
}
</style>
