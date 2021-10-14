import VueI18n from 'vue-i18n';
import prodConfig from "../../../productionConfig";
const i18n = new VueI18n({
    locale:prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN" : require('../../../../lang/CN-Cindy'),
        "EN" : require('../../../../lang/EN-Cindy')
    }
})
export default  [
    {
        label:i18n.t('ExplorerLang.table.address'),
        displayValue:'address',
        nativeValue:'address',
        isLink: true,
        isNeedFormat: true,
        linkRoute:'/address/',
        isFormatAddress: true,
    },
    {
        label:i18n.t('ExplorerLang.table.amount'),
        displayValue:'amount',
        nativeValue:'amount',
        isShowTokenSymbol:true
    },
    {
        label: i18n.t('ExplorerLang.table.shares'),
        displayValue: 'shares',
        nativeValue: 'shares',
        width:251
    }
]