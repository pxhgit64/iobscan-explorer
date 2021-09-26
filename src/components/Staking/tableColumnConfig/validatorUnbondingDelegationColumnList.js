export default [
    {
        label:'Address',
        displayValue:'address',
        nativeValue:'address',
        isLink:true,
        isNeedFormat: true,
        linkRoute:'/address',
        isFormatAddress: true,
    },
    {
        label:'Amount',
        displayValue:'amount',
        nativeValue:'amount',
        isShowTokenSymbol:true
    },
    {
        label:'Block',
        displayValue:'block',
        nativeValue:'block',
        isLink:true,
        isNeedFormatHash:false,
        linkRoute:'/block',
        isShowMoniker:false
    },
    {
        label:'End Time',
        displayValue:'end_time',
        width:150
    },
]