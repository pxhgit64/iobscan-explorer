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
        //todo 这里的翻译有问题
        label: i18n.t('ExplorerLang.table.proposalId') ,
        displayValue:'id',
        nativeValue:'id',
        isLink:true,
        linkRoute:'/ProposalsDetail'
    },
    {
        label: i18n.t('ExplorerLang.table.proposer'),
        displayValue: 'proposer',
        nativeValue: 'proposer',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address',
    },
    {
        label: i18n.t('ExplorerLang.table.deposit'),
        displayValue: 'deposit',
        nativeValue: 'deposit',
        isShowTokenSymbol:true
    },
    {
        label: i18n.t('ExplorerLang.table.submited'),
        displayValue: 'submited',
        nativeValue: 'submited'
    },
    {
        label: i18n.t('ExplorerLang.table.txHash'),
        displayValue:'hash',
        nativeValue:'hash',
        isLink:true,
        isNeedFormat:true,
        isNeedFormatHash:true,
        isNeedShowTxStatus:true,
        linkRoute:'/tx?txHash=',
        isShowMoniker:false,
        isShowTxStatusIcon:true
    },
]