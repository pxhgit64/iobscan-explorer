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
        label:'Owner',
        displayValue: 'owner',
        nativeValue: 'owner',
        isLink:true,
        linkRoute:'/address/',
        isNeedFormat:true,
        isFormatAddress: true,

    },
    {
        label: 'Symbol',
        displayValue: 'symbol',
        nativeValue: 'symbol',
        isLink:true,
        linkRoute:'/assets/'

    },
    {
        label: 'InitialSupply',
        displayValue: 'initialSupply',
        nativeValue: 'initialSupply'
    },
    {
        label: 'MinTable',
        displayValue: 'mintable',
        nativeValue: 'mintable'
    },
    {
        label: 'Block',
        displayValue: 'block',
        nativeValue: 'block',
        isLink:true,
        linkRoute:'/block/'
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