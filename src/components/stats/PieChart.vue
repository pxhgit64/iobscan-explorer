<template>
    <div id="pie_chart" />
</template>

<script>
import echarts from'echarts';
import { fetchTokenDistribution } from "@/service/api";
import {DISTRIBUTION} from "@/constant";
import config from '../../productionConfig';
import Tools from "@/util/Tools";
import { converCoin, getMainToken } from "@/helper/IritaHelper";

export default {
    name: "PieChart",
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {
            chart: null,
            timer: null,
            option:null,
            dataList:[],
            mainTokenSymbol:'',
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById('pie_chart'));
        //window.addEventListener("resize", this.windowResizeFunc);
        this.fetchTokenDistribution()
        this.chart.on('legendselectchanged',(params)=> {
            if(this.dataList && this.dataList.length > 0 && params && params.name){
                let index = this.dataList.findIndex((item)=>item.name === params.name);
                if(index >= 0){
                    setTimeout(()=>{
                        this.chart.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0,
                            dataIndex: index
                        });
                    },10)
                }
            }

            let o = this.chart.getOption();
            o.legend[0].selected[params.name] = true;
            this.chart.setOption(o)
        })
        this.setMainToken();
    },
    destroyed() {
        //window.removeEventListener("resize", this.windowResizeFunc);
    },

    methods: {
        async fetchTokenDistribution(){
            try {
                const res = await fetchTokenDistribution();
                if(res){
                    this.handleData(res);
                }
            }catch (e) {

            }
        },
        async setMainToken(){
            let mainToken = await getMainToken();
            if(mainToken && mainToken.symbol){
                this.mainTokenSymbol = mainToken.symbol.toUpperCase();
            }
        },
        async handleData(res){
            let data = [];
            for(let k in DISTRIBUTION){
                let o = DISTRIBUTION[k];
                o.id = k;
                o.percent = 0;
                o.value = 0;

                if(k in res){
                    o.percent = Tools.FormatScientificNotationToNumber(res[k].percent)
                    o.value = res[k].total_amount.amount
                    o.denom = res[k].total_amount.denom
                }
                let t = await converCoin({
                    denom: o.denom,
                    amount:o.value,
                }) || {denom: '', amount:0}
                o.displayAmount = Tools.getDisplayNumber(t.amount);
                o.symbol = t.denom;
                o.label = {
                    show:false,
                }
                o.labelLine = {
                    show:false,
                }

                data.push(o);
            }
            this.dataList = data;

            this.setOption(data)
        },
        setOption(data) {
            let option = {
                tooltip: {
                    show: true,
                    confine: true,
                    formatter: (v)=> {
                        return `${v.marker}${v.data.name}: ${Tools.formatNum(Tools.bigNumberMultiply(v.data.percent, 100),2)}%<br/>
                        ${v.data.displayAmount} ${this.mainTokenSymbol}<br/>`;
                    }
                },
                backgroundColor:'#ffffff',
                 color: [
                     "#5470C6",
                    "#91CC75",
                    "#FAC858",
                    "#EE6666",
                    "#73C0DE",
                    "#A17DD5",
                    "#D39186",
                 ],
                legend: {
                    orient: "vertical",
                    data: data.map(v => {
                        return {
                            name: v.name,
                            textStyle: {
                                rich: this.$store.state.isMobile ?
                                    {
                                        a: {
                                            padding: [-40, 0, 0, 6],
                                            width:120,
                                            fontSize:17,
                                            align:'left',
                                        },
                                        b:{
                                            padding: [-40, 0, 0, 0],
                                            color: "#ccc",
                                            width:14,
                                            fontSize:15,
                                            align:'left'
                                        },
                                        c:{
                                            padding: [-40, 0, 0, 0],
                                            width:30,
                                            color:'#787C99',
                                            fontSize:15,
                                            align:'right',
                                        },
                                        d:{
                                            width:250,
                                            fontSize:16,
                                            align:'right',
                                            lineHeight:40,
                                            padding:[-40,0,0,6],
                                            fontFamily:'ArialMT'
                                        },

                                    }:{
                                    a: {
                                        padding: [0, 0, 0, 6],
                                        width:120,
                                        fontSize:16,
                                        align:'left'
                                    },
                                    b:{
                                        color: "#ccc",
                                        width:14,
                                        fontSize:15,
                                        align:'left'
                                    },
                                    c:{
                                        width:60,
                                        color:'#787C99',
                                        fontSize:15,
                                        align:'right',
                                    },
                                    d:{
                                        width:250,
                                        fontSize:16,
                                        align:'right',
                                        fontFamily:'ArialMT'
                                    },

                                }
                            }
                        };
                    }),
                    formatter:  (name)=>{
                        let str = '', distributionItem = data.find((item)=>item.name === name);
                        if(distributionItem){
                            if(this.$store.state.isMobile){
                                str = `{a|${name}} {b||} {c|${Tools.formatNum(Tools.bigNumberMultiply(distributionItem.percent, 100),2)}%}\n{d|${distributionItem.displayAmount} ${this.mainTokenSymbol}}`
                            }else{
                                str = `{a|${name}} {b||} {c|${Tools.formatNum(Tools.bigNumberMultiply(distributionItem.percent, 100),2)}%} {d|${distributionItem.displayAmount} ${this.mainTokenSymbol}}`

                            }
                        }
                        return str;
                    },
                },
                series: [
                    {
                        type: "pie",
                        radius: ["50%", "70%"],
                        avoidLabelOverlap: true, //是否启用防止标签重叠策略
                        minAngle: 5,
                        center: this.$store.state.isMobile ? ["50%", '25%']: ["25%", "55%"],
                        hoverOffset: this.$store.state.isMobile ? 10 : 0,
                        data: data,
                        labelLine:{
                            show:false,
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '60',
                                fontWeight: 'bold'
                            }
                        },
                    }
                ]
            };
            if(this.$store.state.isMobile){
                option.legend.bottom = "2%";
                option.legend.left = "center";

            }else{
                option.legend.right = "3%";
                option.legend.top = "center";

            }
            this.option = option;
            this.chart.setOption(option);
            setTimeout(()=>{
                this.chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: 0
                });
            },10)
        },
    },

};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 910px){
    #pie_chart {
        height: 5rem;
    }

}
@media screen and (max-width: 910px){
    #pie_chart {
        height: 8rem;
    }
}

</style>
