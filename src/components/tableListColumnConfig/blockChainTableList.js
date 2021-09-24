export default  [
    {
        label:'Block',
        displayValue:'height',
        nativeValue:'height',
        isLink:true,
        linkRoute:'/block',
        isShowMoniker:false
    },
    {
        label: 'Proposer',
        displayValue: 'proposerValue',//页面展示用到的取值字段 （例:页面展示 moniker 使用这个字段取值）
        nativeValue:'proposerAddress',// 原始数据用到的取值字段（例:页面 moniker 跳转需要地址，使用这个字段取值）
        isLink: true,
        linkRoute:'/address',
        isShowMoniker: true,
    },
    {
        label: 'Transactions',
        displayValue: 'numTxs',
        nativeValue:'numTxs',
        isLink: false,
        isShowMoniker: false
    },
    {
        label: 'Timestamp',
        displayValue:'time',
        nativeValue:'time',
        isLink: false,
        isShowMoniker: false
    },
    {
        label: 'Age',
        displayValue: 'ageTime',
        isLink: false,
        isShowMoniker: false
    }
]