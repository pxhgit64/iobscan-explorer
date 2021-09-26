export default [
    {
        label:'TxHash',
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
        label:'MsgType',
        displayValue:'txType',
        nativeValue:'txType',
        isNeedFormat:true,
        isShowTag:true,
        isLink:false,
        isShowMoniker:false
    },
    {
        label: 'Proposal ID',
        displayValue:'proposalId',
        nativeValue:'proposalId',
        isLink: true,
        linkRoute: '/ProposalsDetail'
    },
    {
        label:'Proposal Type',
        displayValue: 'proposalType',
        nativeValue: 'proposalType'
    },
    {
        label:'Signer',
        displayValue: 'signer',
        nativeValue: 'signer',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address',
    },
    {
        label:'Block',
        displayValue:'blockHeight',
        nativeValue:'blockHeight',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block',
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