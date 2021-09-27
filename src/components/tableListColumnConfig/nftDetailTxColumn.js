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
        label: 'Denom Id',
        displayValue: ''
    },
    {
        label: 'Sender',
        displayValue: 'sender',
        nativeValue: 'sender',
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
        displayValue:'fee',
        nativeValue:'fee',
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