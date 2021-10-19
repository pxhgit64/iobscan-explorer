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
        flMoniker: true,

    },
    {
        label:i18n.t('ExplorerLang.table.voteOption'),
        displayValue: 'option'
    },
    {
        label:i18n.t('ExplorerLang.table.block'),
        displayValue:'block',
        nativeValue:'block',
        isLink:true,
        linkRoute:'/block/',
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