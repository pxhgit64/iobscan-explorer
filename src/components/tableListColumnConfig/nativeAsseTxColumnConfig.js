export default [
    {
        label:'TxHash',
        displayValue:'txHash',
        nativeValue: 'txHash',
        isLink:true,
        linkRoute:'/tx?txHash=',
        isNeedFormat:true,
        isNeedFormatHash:true,
    },
    {
        label:'Owner',
        displayValue: 'owner',
        nativeValue: 'owner',
        isLink:true,
        linkRoute:'/address',
        isNeedFormat:true,
        isNeedFormatHash:true,

    },
    {
        label: 'Symbol',
        displayValue: 'symbol',
        nativeValue: 'symbol',
        isLink:true,
        linkRoute:'/assets'

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
        linkRoute:'/block'
    },
    {
        label: 'Fee',
        displayValue: 'fee',
        nativeValue: 'fee',

    },
    {
        label: 'Age',
        displayValue: 'time',
        nativeValue: 'time'
    },

]