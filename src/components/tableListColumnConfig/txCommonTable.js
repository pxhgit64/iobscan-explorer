//通用信息的前半部分，不同的交易，在列表展示会有差异，故将通用信息分开，采用数组合并的方式使得展示顺序满足需求

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
        linkRoute:'/',
        isShowMoniker:false
    },
]