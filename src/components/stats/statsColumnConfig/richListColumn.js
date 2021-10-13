import VueI18n from 'vue-i18n';
import prodConfig from "../../../productionConfig";

const i18n = new VueI18n({
    locale: prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN": require('../../../../lang/CN-Cindy'),
        "EN": require('../../../../lang/EN-Cindy')
    }
})


export default [
    {
        label: '#',
        isShowIndex: true,
        width: 85,
    },
    {
        label: i18n.t('ExplorerLang.stats.address'),
        isLink: true,
        displayValue:'address',
        nativeValue:'address',
        linkRoute:'/address',
    },
    {
        label: i18n.t('ExplorerLang.stats.amount'),
        displayValue: 'amount',
        isShowTokenSymbol:true,
    },
    {
        label: i18n.t('ExplorerLang.stats.percentage'),
        displayValue: 'percent',
        width: 200
    },
]