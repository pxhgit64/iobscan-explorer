export default [
    {
        label: 'Owner',
        displayValue: 'owner',
        nativeValue: 'owner',
        isLink: true,
        isNeedFormat: true,
        isFormatAddress: true,
        linkRoute: '/address',
    },
    {
        label: 'Token',
        displayValue: 'token',
        nativeValue: 'token',
        isLink: true,
        linkRoute: '/assets'
    },
    {
        label: "MintTo",
        displayValue: "mintTo",

    },
    {
        label: 'Amount',
        displayValue: 'amount',
        nativeValue: 'amount'
    },

    {
        label: 'Block',
        displayValue: 'block',
        nativeValue: 'block',
        isLink:true,
        linkRoute:'/block'
    },
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
        label: 'Fee',
        displayValue: 'fee',
        nativeValue: 'fee',
        isShowTokenSymbol:true,
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