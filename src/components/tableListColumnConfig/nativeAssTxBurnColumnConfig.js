
import VueI18n from 'vue-i18n';
import prodConfig from "../../productionConfig";
const i18n = new VueI18n({
    locale:prodConfig.lang == 'EN' ? 'EN' : 'CN',
    messages: {
        "CN" : require('../../../lang/CN-Cindy'),
        "EN" : require('../../../lang/EN-Cindy')
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
        label: i18n.t('ExplorerLang.table.amount'),
        displayValue: 'amount',
        nativeValue: 'amount'
    },
    {
        label: i18n.t('ExplorerLang.table.token'),
        displayValue: 'token',
        nativeValue: 'token',
        isLink: true,
        linkRoute: '/assets'
    },
    {
        label: i18n.t('ExplorerLang.table.sender'),
        displayValue: 'sender',
        nativeValue: 'sender',
        isNeedFormat: 'sender',
        isNeedFormatHash: 'sender',
        isLink: true,
        linkRoute: '/address'
    },

    {
        label: i18n.t('ExplorerLang.table.block'),
        displayValue: 'block',
        nativeValue: 'block',
        isLink:true,
        linkRoute:'/block'
    },
    {
        label: i18n.t('ExplorerLang.table.fee'),
        displayValue: 'fee',
        nativeValue: 'fee',
        isShowTokenSymbol:true,
    },
    {
        label:i18n.t('ExplorerLang.table.time'),
        displayValue:'Time',
        nativeValue:'Time',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150
    },




]