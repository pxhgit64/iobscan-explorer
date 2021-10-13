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
        isLink: true,
        linkRoute: '/ProposalsDetail',
        width: 50,
    },
    {
        label: i18n.t('ExplorerLang.table.title'),
        displayValue:'title',
        nativeValue:'id',
        isLink: true,
        linkRoute: '/ProposalsDetail',
        width: 180
    },
    {
        label: i18n.t('ExplorerLang.table.type'),
        displayValue:'type',
    },
    {
        label: i18n.t('ExplorerLang.table.status'),
        isProposalStatus:true,
        proposalStatus:'status',
        finalVotes:'finalVotes',
        width: 253
    },
    {
        label: i18n.t('ExplorerLang.table.submitTime'),
        displayValue:'submitTime',
    },
    {
        label:i18n.t('ExplorerLang.table.depositEndTime') ,
        displayValue:'depositEndTime',
    },
    {
        label: i18n.t('ExplorerLang.table.votingEndTime'),
        displayValue:'votingEndTime',
    }
]