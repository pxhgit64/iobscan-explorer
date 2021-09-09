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
        displayValue: 'proposerValue',
        nativeValue:'proposerAddress',
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