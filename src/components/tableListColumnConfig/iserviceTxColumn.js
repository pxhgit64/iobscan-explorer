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
        label: i18n.t('ExplorerLang.table.txType'),
        displayValue:'type',
        nativeValue:'type',
        isNeedFormat:true,
        isShowTag:true,
        isLink:false,
        isShowMoniker:false
    },
    {
        label: i18n.t('ExplorerLang.table.requestContentId'),
        displayValue: 'id',
        nativeValue: 'id',
        isNeedFormat: true,
        isFormatAddress: true,
    },
    {
        label: i18n.t('ExplorerLang.table.from'),
        displayValue: 'from',
        nativeValue: 'from',
        isFormatAddress: true,
        isNeedFormat: true,
        isLink: true,
        linkRoute: '/address',
    },
    {
        label:  i18n.t('ExplorerLang.table.to'),
        displayValue: 'to',
        nativeValue: 'to',
        isNeedFormat: true,
        isFormatAddress: true,
        isLink: true,
        linkRoute: '/address',
    },
    {
        label: i18n.t('ExplorerLang.table.fee'),
        displayValue: 'fee',
        isShowTokenSymbol:true
    },
    {
        label: i18n.t('ExplorerLang.table.block'),
        displayValue:'height',
        nativeValue:'height',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block',
        isShowMoniker:false
    },
    {
        label: i18n.t('ExplorerLang.table.time'),
        displayValue:'timestamp',
        nativeValue:'timestamp',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150
    }
]