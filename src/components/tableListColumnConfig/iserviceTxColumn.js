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
        label: 'MsgType',
        displayValue:'type',
        nativeValue:'type',
        isNeedFormat:true,
        isShowTag:true,
        isLink:false,
        isShowMoniker:false
    },
    {
        label: 'Request Context Id',
        displayValue: 'id',
        nativeValue: 'id',
        isNeedFormat: true,
        isFormatAddress: true,
    },
    {
        label: 'From',
        displayValue: 'from',
        nativeValue: 'from',
        isFormatAddress: true,
        isNeedFormat: true,
        isLink: true,
        linkRoute: '/address',
    },
    {
        label: 'To',
        displayValue: 'to',
        nativeValue: 'to',
        isNeedFormat: true,
        isFormatAddress: true,
        isLink: true,
        linkRoute: '/address',
    },
    {
        label: 'Fee',
        displayValue: 'fee',
        isShowTokenSymbol:true
    },
    {
        label: 'Block',
        displayValue:'height',
        nativeValue:'height',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block',
        isShowMoniker:false
    },
    {
        label: 'Time',
        displayValue:'timestamp',
        nativeValue:'timestamp',
        isLink:false,
        linkRoute:'',
        isShowMoniker:false,
        width: 150
    }
]