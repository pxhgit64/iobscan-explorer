//通用信息的后半部分
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
        label:i18n.t('ExplorerLang.table.block'),
        displayValue:'blockHeight',
        nativeValue:'blockHeight',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block/',
        isShowMoniker:false,
    },
    {
        label:i18n.t('ExplorerLang.table.fee'),
        displayValue:'Tx_Fee',
        nativeValue:'Tx_Fee',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        isShowTokenSymbol:true,
    },
    {
        label:i18n.t('ExplorerLang.table.time'),
        displayValue:'Time',
        nativeValue:'Time',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 160
    },
]