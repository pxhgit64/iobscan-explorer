import VueI18n from 'vue-i18n';
import prodConfig from "../../../productionConfig";
const i18n = new VueI18n({
    locale:prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN" : require('../../../../lang/CN-Cindy'),
        "EN" : require('../../../../lang/EN-Cindy')
    }
})


export default [
    {
        label:i18n.t('ExplorerLang.table.proposalId'),
        displayValue:'id',
        nativeValue:'id',
        isLink:true,
        linkRoute:'/ProposalsDetail/'
    },
    {
        label: i18n.t('ExplorerLang.table.title'),
        displayValue: 'title',
    },
    {
        label: i18n.t('ExplorerLang.table.status'),
        displayValue: 'status',
    },
    {
        label: i18n.t('ExplorerLang.table.voted'),
        displayValue: 'voted'
    },
    {
        label:i18n.t('ExplorerLang.table.txHash'),
        displayValue:'txHash',
        nativeValue:'txHash',
        isLink:true,
        isNeedFormat:true,
        isNeedFormatHash:true,
        linkRoute:'/tx?txHash=',
        isShowMoniker:false,
    },
]