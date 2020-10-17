export const ExplorerLang = {
    common:{
        allTxStatus:'All Status',
        success:'Success',
        failed:'Failed',
        allTxType:'All TxType',
        selectDate:'Select Date',
        copied:'Copied',
        copyFailed:'Failed',
        all:'All',
        more:'Expand',
        fewer:'Collapse',
    },
    table:{
        emptyDescription:'- No Data -',
        block: 'Block',
        transactions: 'Transactions',
        timestamp: 'Timestamp',
        age: 'Age',
        txHash: 'TxHash',
        txType: 'TxType',
        message:'Message',
        from: 'From',
        to: 'To',
        signer: 'Signer',
        txTimestamp: 'Timestamp',
        requestId: 'Request Id',
        number:'#',
        name: 'Moniker',
        operator: 'Operator',
        votingPower: 'Voting Power',
        pubKey: 'PubKey',
        denom: 'Denom',
        denomId: 'Denom Id',
        owner: 'Owner',
        tokenName: 'NFT Name',
        tokenId: 'NFT ID',
        data: 'Data',
        uri: 'Uri',
        serviceName: 'Service Name',
        provider:'Provider',
        respondTimes:'Respond Times',
        isAvailable:'Is Available',
        price:'Cost Per Call',
        minBlock:'Minimum Response Time',
        bindTime:'Bind Time',
        disabledTime: 'Disabled Time',
        respondHash:'Respond Hash',
        consumer:'Consumer:',
        requestHash:'Request Hash',
        requestStatus:'Request Status',
        deposit: 'Deposit',
        createHash:'TxHash',
        nftCount:'NFT',
        creator:'Creator',
        createTime:'Timestamp',
        identity:'ID',
        idPubkey:'Pubkey',
        pubKeyAlgo:'PubKey Algo',
        certificate:'Certificate',
        credentials: 'Credentials',
        updateTime:'Timestamp',
        // 新增
        commission: 'Commission',
        bondedTokens: 'Bonded_Tokens',
        uptime: 'Uptime',
        selfBonded: 'Self-Bonded',
        delegators: 'Delegators',
        bondHeight: 'Bond_Height',
        unbondingHeight: 'Unbonding_Height', // 新增
        address: 'Address',
        amount: 'Amount',
        shares: 'Shares',
        endTime: 'End Time',
        fee: 'Fee',
        status: 'Status',
        consensusAddress: 'Consensus Address',
        proposerPriority: 'Proposer Priority',
    },
    unit:{
        ellipsis:' ,...',
        msgCountUnit:'',
        providers:'providers',
        time:'Time',
        blocks:'Blocks',
        totalRespond:'Total${%value%}Responds',
        Txs:'Txs',
        second:'Second',
    },
    message:{
        requestFailed:'Failed to get data, please try again later',
    },
    Navigation:{
        block: 'Blockchain',
        transactions: 'Transactions',
        validators: 'Validators',
        nftAsset: 'NFT',
        denoms: 'Denom',
        service: 'iService',
        searchPlaceHolder: 'Search by Address / Txhash / Block / HashLock',
        network:'Network'
    },
    home:{
        blockHeight: 'Block Height',
        transactions: 'Transactions',
        avgBlockTime: 'Avg Block Time',
        last100Blocs: 'Last 100 Blocks',
        validators: 'Consensus Nodes',
        services: 'iService',
        denoms:'Denom',
        assets: 'NFT',
        identities: 'Idendity',
        blocks: 'Blocks',
        viewAll: 'View All',
        listTransactions: 'Transactions',
        tx:'TX#',
        txn:'Txn'
    },
    block:{
        currentHeight: 'Current Height',
    },
    blockDetail:{
        blockHash: 'Block Hash:',
        transaction: 'Transactions:',
        timestamp: 'Timestamp:',
        transactions: 'Transactions',
        // 新增
        proposer: 'Proposer:',
        validators: 'Validators:',
        votingPower: 'Voting Power:',
        inflation: 'Inflation:',
        validatorSet:'Validator Set'
    },
    transactions:{
        txs: 'Txs',
        search: 'Search',
        status: ' Status',
        // 新增
        delegationTxsList: 'Delegation Txs List',
        validationTxsList: 'Validation Txs List'
    },
    validators:{
        bonded:'Active',
        unbonding:'Candidate',
        unbonded:'Jailed',
    },
    nftAsset:{
        assets: 'NFT',
        search: 'Search',
        placeHolder: 'Search by NFT Id',
    },
    denom:{
        title: 'Denom',
        search: 'Search',
        placeHolder: 'Search by Denom Name or Denom ID',
    },
    identityList:{
        title: 'Identity',
        search: 'Search',
        placeHolder: 'Search by ID / Owner',
    },
    identityDetail:{
        title: 'Identity Details',
        baseInfo: 'Base Info',
        credentialsInfo: 'Credentials Info',
        txRecord: 'Txs',
        owner: 'Owner',
        credentials: 'Credentials',
        createTxHash: 'Created TxHash',
        createHeight: 'Block',
        createTime: 'Timestamp',
    },
    service: {
        services: 'iService List',
        from: 'From',
        description: 'Description',
        status: 'Status',
        placeHolder:'Search by iService Name or Description',
        serviceCount:' Services',
    },
    transactionInformation:{
        transactionInformation: 'Transaction Details',
        baseInfo:'Base Info',
        txHash: 'TxHash',
        blockHeight: 'Block',
        status: 'Status',
        timestamp: 'Timestamp',
        signer: 'Signer',
        memo: 'Memo',
        // transactionMessage: 'Transaction Message or Result',
        relevanceTx:'Related Transaction',
        txType: 'TxType',
        denomId: 'Denom Id',
        denomName: 'Denom Name',
        from: '  From',
        to: 'To',
        consumer: 'Consumer',
        provider: 'Provider',
        repeatedFrequency: 'Repeated Frequency',
        repeatedTotal: 'Repeated Total',
        serviceFeeCap: 'Service Fee Cap',
        timeOut: 'Timeout',
        serviceName: 'Service Name',
        requestContextId: 'Request Id',
        pricing: 'Cost Per Call',
        owner: 'Owner',
        qos: 'Minimum Response Time',
        deposit: 'Deposit',
        nftId: 'NFT Id',
        nftName: 'NFT Name',
        data: 'Data',
        uri: 'Uri',
        fee: 'Fee',
        gasUsed:'Gas Used',
        issueDenom:{
            schema: 'Schema',
            sender: 'Sender',
        },
        send:{
            amount: 'Amount',
        },
        createRecord:{
            contents:'Contents',
        },
        callService: {
            input: 'Input',
            repeated: 'Repeated',
            superMode: 'SuperMode',
        },
        respondService:{
            output: 'Output:',
            requestId: 'Request Id',
            result: 'Result',
        },
        defineService: {
            description: 'Description',
            tags: 'Tags',
            author: 'Author',
            authorDescription: 'Author Description',
            schemas:'Schemas',
        },
        identity:{
            id:'ID',
            pubkey:'Pubkey',
            certificate:'Certificate',
            credentials:'Credentials',
            pubKeyAlgo:'PubKey Algo'
        },
        recvPacket:{
            packet:'Packet',
            proof:'Proof',
            proofHeight:'Proof Height',
            proofPath:'Proof Path',
            proofData:'Proof Data',
            clientID:'Client ID',
            module:'Module',
        },
        client:{
            clientID:'Client ID',
            header:'Header',
        },
        // 新增
        transactionInformations: {
            title: 'Transaction Information',
            block: 'Block',
            status: 'Status',
            timestamp: 'Timestamp',
            fee: 'Fee',
            gasUsed: 'Gas Used',
            signer: 'Signer',
            memo:'Memo'
        },
        transactionMessage: {
            title: 'Transaction Message or Result',
            TxType: 'TxType :',
            from: 'From :',
            amount: 'Amount :',
            to: 'To :',
            shares: 'Shares :',
            toShares: 'Shares : ',//'Shares : '此处有空格
            endTime: 'End Time :',
            withdrawAddress: 'Withdraw Address:',
            delegatorAddress: 'Delegator Address :',
            operatorAddress: 'Operator Address :',
            moniker: 'Moniker :',
            identity: 'Identity :',
            selfBonded: 'Self-Bonded :',
            ownerAddress:'Owner Address :',
            consensusPubkey: 'Consensus Pubkey :',
            commissionRate: 'Commission Rate :',
            website: 'Website :',
            details: 'Details :',
            // 新的交易类型展示
            isBuyOrder: 'isBuyOrder :',
            inputAddress: 'Input Address :',
            Input: 'Input :',
            outputAddress: 'Output Address :',
            output: 'Output :',
            deadline: 'Deadline :',
            sender: 'Sender :',
            exactIrisAmt: 'Exact Iris Amt :',
            minIrisAmt: 'Min Iris Amt :',
            maxToken: 'Max Token :',
            minToken: 'Min Token :',
            minLiquidity: 'Min Liquidity :',
            withdrawLiquidity: 'Withdraw Liquidity :',
            depositor: 'Depositor :'
        }
    },
    addressDetail: {
        addressDetail:'Address Details',
        txRecord:'Txs',
        consumerTitle:'iService-As Consumer',
        providerTitle:'iService-As Provider',
        respondRecord:'Respond Record',
        assets: 'NFT',
        identities:'身份列表'
    },
    nftDetail: {
        nftInformation:'NFT Details',
        owner: 'Owner',
        denom: 'Denom',
        tokenName:'NFT Name',
        tokenId: 'NFT ID',
        schema: 'Schema',
        data: 'Data',
        creator: 'Creator',
        uri: 'Uri',
        nftTxs: 'Txs',
    },
    serviceDetail: {
        serviceDefinition: 'iService Details',
        primary: 'Base Info',
        author: 'Author',
        authorDescription: 'Author Description',
        description: 'Description',
        name: 'Name',
        schema: 'Schema',
        tags: 'Tags',
        serviceBindings: {
            serviceBindings: 'Service Binding',
            providers: 'Providers',
            deposit: 'Deposit',
            owner: 'Owner',
            pricing: 'Cost Per Call',
            qos: 'Minimum Response Time',
            bindTime: 'Bind Time',
            disabledTime: 'Disabled Time',
            hash:'Bind Details',
        },
        serviceTransactions: 'iService Transactions',
        hash:'Define Details',
        height:'Define Block',
        time:'Define Time',
        respondRecord:'iService Respond Record',
        provider:'Provider',
        txRecord:'Respond Record',
    },
    searchResult:{
        title: 'Search Results',
        backHome: 'Back Home',
        resultTitle: 'There is no valid result.',
        searchTip: 'Try to search with Address, Transaction, Block Number, Proposal ID, HashLock.',
    },
    // 新增
    // 验证人列表
    staking: {
        title: 'Validator List',
        status:{
            active:'Active',
            candidate:'Candidate',
            jailed:'Jailed',
        }
    },
    // 验证人详情
    validatorDetail: {
        title: 'Validator Details',
        validatorInformation: {
            validatorTip: 'The validator has no more information',
            operatorAddressTip: 'The address you used to Create a Validator , Delegate or Withdraw DelegatorReward, etc.',
            validationAssetInfoArr: {
                operatorAddress: 'Operator Address:',
                ownerAddress: 'Owner Address:',
                withdrawAddress: 'Withdraw Address:',
                votingPower: 'Voting Power:',
                uptime: 'Uptime:',
                missedBlocks: 'Missed Blocks:',
                bondHeight: 'Bond Height:',
                unbondingHeight:'Unbonding Height:',
                consensusPubkey: 'Consensus Pubkey:',
                jailedUntil:'Jailed Until:'
            }
        },
        commissionInfo: {
            title: 'Commission Info',
            scatter: {
                title: 'Commission Rate & Bonded Tokens Distribution',
                xAxis: 'Commission Rate(%)',
                yAxis: 'Bonded_Token(IRIS)',
                tooltip: {
                    commissionRate: 'Commission Rate',
                    bondedTokens: 'Bonded Tokens',
                },
                otherValidator: 'Other Validator'
            },
            bondedAndCommissionArr: {
                commissionRate: 'Commission Rate:',
                bondedTokens: 'Bonded Tokens:',
                delegators: 'Delegators:',
                totalShares: 'Total Shares:',
                commissionRewards: 'Commission Rewards:',
                commissionRateRange: 'Commission Rate Range:',
                children: {
                    maxChangeRateEverytime: 'Max Change Rate Everytime:',
                    selfBonded: 'Self-Bonded:',
                    delegatorBonded:'Delegator Bonded:'
                }
            }
        },
        delegationsTitle: 'Delegations',
        unbondingDelegationsTitle: 'Unbonding Delegations',
        delegationsTxsTitle: 'Delegation Txs',
        validationTxsTitle: 'Validation Txs'
    },
    // 普通地址详情
    addressInformation: {
        tab:{
            assetInfo:'Assets',
            nftCount:'NFT',
            identity:'Identity',
            iService:'iService',
            tx:'Txs',
        },
        content: {
            address: 'Address',
            token: 'Token',
            totalAmount: 'Total Amount',
            balance: 'Balance',
            delegated: 'Delegated',
            unBonding: 'UnBonding',
            rewards: 'Rewards'
        },
        delegatorRewards: {
            title: 'Delegator Rewards',
            withdrawTo: 'Withdraw To'
        },
        validatorRewards: {
            title: 'Validator Rewards',
            validatorMoniker: 'Validator Moniker',
            operatorAddress:'Operator Address'
        }
    }
}
