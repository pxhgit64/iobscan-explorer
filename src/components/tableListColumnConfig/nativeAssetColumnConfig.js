
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
        label:i18n.t('ExplorerLang.table.symbol'),
        displayValue:'symbol',
        nativeValue:'symbol',
        isLink:true,
        linkRoute:'/assets/',
    },
    {
        label:i18n.t('ExplorerLang.table.owner'),
        displayValue: 'owner',
        nativeValue: 'owner',
        isLink: true,
        linkRoute:'/address/',
        width: 425,
    },
    {
        label: i18n.t('ExplorerLang.table.totalSupply'),
        displayValue: 'totalSupply',
        nativeValue: 'totalSupply'
    },
    {
        label: i18n.t('ExplorerLang.table.initialSupply'),
        displayValue: 'initialSupply',
        nativeValue: 'initialSupply'
    },
    {
        label: i18n.t('ExplorerLang.table.maxSupply'),
        displayValue: 'maxSupply',
        nativeValue: 'maxSupply'
    },
    {
        label: i18n.t('ExplorerLang.table.mintable'),
        displayValue: 'mintable',
        nativeValue: 'mintable'
    }
]

