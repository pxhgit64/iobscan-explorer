export default [
    {
        label:'ID',
        displayValue:'id',
        nativeValue:'id',
        isLink:true,
        linkRoute:'/ProposalsDetail'
    },
    {
        label: 'Proposer',
        displayValue: 'proposer',
        nativeValue: 'proposer',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address',
    },
    {
        label: 'Deposit',
        displayValue: 'deposit',
        nativeValue: 'deposit',
        isShowTokenSymbol:true
    },
    {
        label: 'Submited',
        displayValue: 'submited',
        nativeValue: 'submited'
    },
    {
        label:'TxHash',
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