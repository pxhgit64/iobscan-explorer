
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
        label:i18n.t('ExplorerLang.table.txHash'),
        displayValue:'txHash',
        nativeValue:'txHash',
        isLink:true,
        isNeedFormat:true,
        isNeedFormatHash:true,
        isNeedShowTxStatus:true,
        linkRoute:'/tx?txHash=',
        isShowMoniker:false,
        isShowTxStatusIcon:true
    },
    {
        label:i18n.t('ExplorerLang.table.txType'),
        displayValue:'txType',
        nativeValue:'txType',
        isNeedFormat:true,
        isShowTag:true,
        isLink:false,
        isShowMoniker:false
    },
    {
        label: i18n.t('ExplorerLang.table.proposalID'),
        displayValue:'proposalId',
        nativeValue:'proposalId',
        isLink: true,
        linkRoute: '/ProposalsDetail/'
    },
    {
        label: i18n.t('ExplorerLang.table.proposalType'),
        displayValue: 'proposalType',
        nativeValue: 'proposalType'
    },
    {
        label: i18n.t('ExplorerLang.table.signer'),
        displayValue: 'signer',
        nativeValue: 'signer',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address/',
    },
    {
        label:'Block',
        displayValue:'blockHeight',
        nativeValue:'blockHeight',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block/',
        isShowMoniker:false
    },
    {
        label:'Fee',
        displayValue:'Tx_Fee',
        nativeValue:'Tx_Fee',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        isShowTokenSymbol:true
    },
    {
        label:'Time',
        displayValue:'Time',
        nativeValue:'Time',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150
    },
]