export default [
    {
        label:'ID',
        displayValue:'id',
        nativeValue:'id',
        isLink:true,
        linkRoute:'/ProposalsDetail'
    },
    {
        label: 'Title',
        displayValue: 'title',
    },
    {
        label: 'Status',
        displayValue: 'status',
    },
    {
        label: 'Voted',
        displayValue: 'voted'
    },
    {
        label:'TxHash',
        displayValue:'txHash',
        nativeValue:'txHash',
        isLink:true,
        isNeedFormat:true,
        isNeedFormatHash:true,
        linkRoute:'/tx?txHash=',
        isShowMoniker:false,
    },
]