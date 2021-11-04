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
        label:i18n.t('ExplorerLang.table.voter'),
        flDepositor: true,
    },
    {
        label:i18n.t('ExplorerLang.table.amount'),
        displayValue:'amount',
        isShowTokenSymbol:true,

    },
    {
        label:i18n.t('ExplorerLang.table.type'),
        displayValue: 'type'
    },
    {
        label:i18n.t('ExplorerLang.table.txHash'),
        displayValue:'hash',
        nativeValue:'hash',
        isLink:true,
        isNeedFormat:true,
        isNeedFormatHash:true,
        isNeedShowTxStatus:true,
        linkRoute:'/tx?txHash=',
    },
    {
        label:i18n.t('ExplorerLang.table.time'),
        displayValue:'time',
    },
]