import {cfg} from "../../config";

export const needAddColumn = {
    send: [
        {
            label: 'Amount',
            displayValue: 'amount',
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
        }
    ],
    multisend: [
        {
            label: 'Amount',
            displayValue: 'amount',
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
            label: 'Number of To',
            displayValue: 'numberOfTo',
            nativeValue: 'txHash',
            isLink: true,
            linkRoute: '/tx?txHash='
        }
    ],
    begin_redelegate: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'From',
            displayValue: 'fromMonikers',
            nativeValue: 'from',
            isFormatMoniker: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/staking',
        },
        {
            label: 'To',
            displayValue: 'toMonikers',
            nativeValue: 'to',
            isFormatMoniker: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/staking',
        }
    ],
    delegate: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'From',
            displayValue: 'from',
            nativeValue: 'from',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address',
        },
        {
            label: 'To',
            displayValue: 'toMonikers',
            nativeValue: 'to',
            isFormatMoniker: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/staking',
        }
    ],
    begin_unbonding: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'From',
            displayValue: 'fromMonikers',
            nativeValue: 'from',
            isNeedFormat: true,
            isFormatMoniker: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking',
        },
        {
            label: 'To',
            displayValue: 'to',
            nativeValue: 'to',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address',
        }
    ],
    withdraw_delegator_reward: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'From',
            displayValue: 'fromMonikers',
            nativeValue: 'from',
            isFormatMoniker: true,
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/staking',
        },
        {
            label: 'To',
            displayValue: 'to',
            nativeValue: 'to',
            isNeedFormat: true,
            isFormatAddress: true,
            isLink: true,
            linkRoute: '/address',
        }
    ],
    withdraw_validator_commission: [
        {
            label: 'Validator',
            displayValue: 'validatorMoniker',
            nativeValue: 'validatorAddress',
            isFormatMoniker: true,
            isLink: true,
            isNeedFormat: true,
            linkRoute: '/staking'
        },

    ],
    fund_community_pool: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'Depositor',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    unjail: [
        {
            label: 'Operator Address',
            displayValue: 'validatorAddress',
            nativeValue: 'validatorAddress',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
        },
    ],
    //TODO zhangjinbiao 现在返回的列表中并没有下面这些数据，需要从msg中取
    create_validator: [
        {
            label: 'Self-Bonded',
            displayValue: 'amount',
        },
        {
            label: 'Operator Address',
            displayValue: 'validatorAddress',
            nativeValue: 'validatorAddress',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/staking',
        },
        {
            label: 'Owner Address',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    edit_validator: [
        {
            label: 'Moniker',
            displayValue: 'validatorMoniker',
            nativeValue: 'validatorAddress',
            isLink: true,
            isFormatMoniker: true,
            linkRoute: '/staking',
        },
        {
            label: 'Operator Address',
            displayValue: 'validatorAddress',
            nativeValue: 'validatorAddress',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/staking',
        },
    ],
    set_withdraw_address: [
        {
            label: 'Delegator Address',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Withdraw Address',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        }
    ],
    respond_service: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Request ID',
            displayValue: 'requestId',
            nativeValue: 'requestId',
            isHref: true,
            href: '',
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: 'Provider',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    'service/set_withdraw_address': [
        {
            label: 'Owner',
            value: '',
        },
        {
            label: 'Withdraw Address',
            value: '',
        },
    ],
    withdraw_earned_fees: [
        {
            label: 'Provider',
            value: '',
        },
        {
            label: 'Owner',
            value: '',
        },
    ],
    define_service: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Author',
            value: '',
        }
    ],
    disable_service_binding: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Owner',
            value: '',
        },
        {
            label: 'Provider',
            value: '',
        },
    ],
    refund_service_deposit: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Owner',
            value: '',
        },
        {
            label: 'Provider',
            value: '',
        },
    ],
    bind_service: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Owner',
            value: '',
        },
        {
            label: 'Provider',
            value: '',
        },
    ],
    enable_service_binding: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Owner',
            value: '',
        },
        {
            label: 'Provider',
            value: '',
        },
    ],
    update_service_binding: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Owner',
            value: '',
        },
        {
            label: 'Provider',
            value: '',
        },
    ],
    call_service: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Request Context ID',
            value: '',
        },
        {
            label: 'Consumer',
            value: '',
        },
    ],
    start_request_context: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Request Context ID',
            value: '',
        },
        {
            label: 'Consumer',
            value: '',
        },
    ],
    pause_request_context: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Request Context ID',
            value: '',
        },
        {
            label: 'Consumer',
            value: '',
        },
    ],
    update_request_context: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Request Context ID',
            value: '',
        },
        {
            label: 'Consumer',
            value: '',
        },
    ],
    kill_request_context: [
        {
            label: 'Service Name',
            value: '',
        },
        {
            label: 'Request Context ID',
            value: '',
        },
        {
            label: 'Consumer',
            value: '',
        },
    ],
    burn_nft: [
        {
            label: 'NFT Id',
            displayValue: 'nftId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId='
        },
        {
            label: 'Denom Id',
            displayValue: 'denomId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId='
        },
        {
            label: 'From',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    edit_nft: [
        {
            label: 'NFT Id',
            displayValue: 'nftId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId='
        },
        {
            label: 'Denom Id',
            displayValue: 'denomId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId='
        },
        {
            label: 'From',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    mint_nft: [
        {
            label: 'NFT Id',
            displayValue: 'nftId',
            nativeValue: 'nftId',
            nftRouterParamsValue: 'denomId',
            isLink: true,
            isNft: true,
            linkRoute: '/nft/token?denom=',
            denomRouter: '&tokenId='
        },
        {
            label: 'From',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'To',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    transfer_nft: [
        {
            label: 'NFT Id',
            displayValue: 'nftId',
            nativeValue: 'nftId',
        },
        {
            label: 'From',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'To',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    issue_denom: [
        {
            label: 'Denom Id',
            displayValue: 'denomId',
            nativeValue: 'denomId',
        },
        {
            label: 'Denom Name',
            value: '',
        },
        {
            label: 'Sender',
            value: '',
        },
    ],
    transfer_denom: [
        {
            label: 'Denom Id',
            value: '',
        },
        {
            label: 'Sender',
            value: '',
        },
        {
            label: 'Recipient',
            value: '',
        },
    ],
    swap_order: [
        {
            label: 'Sender',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Amount',
            value: '',
        },
        {
            label: 'Amount',
            value: '',
        },
    ],
    add_liquidity: [
        {
            label: 'Sender',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Amount',
            value: '',
        },
        {
            label: 'Amount',
            value: '',
        },
    ],
    remove_liquidity: [
        {
            label: 'Sender',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Amount',
            value: '',
        },
        {
            label: 'Amount',
            value: '',
        },
    ],
    transfer: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'Sender',
            displayValue: 'from',
            nativeValue: 'from',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Receiver',
            displayValue: 'to',
            nativeValue: 'to',
            isHref: true,
            href: cfg.cosmosXpAddress,
            isNeedFormat: true,
            isFormatAddress: true,
        }
    ],
    recv_packet: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'Sender',
            displayValue: 'from',
            nativeValue: 'from',
            isHref: true,
            href: cfg.cosmosXpAddress,
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: 'Receiver',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
        }
    ],
    timeout_packet: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'Sender',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: 'Receiver',
            displayValue: 'from',
            nativeValue: 'from',
            isHref: true,
            href: cfg.cosmosXpAddress,
            isNeedFormat: true,
            isFormatAddress: true,
        }
    ],
    create_htlc: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'Sender',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Receiver',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        }
    ],
    claim_htlc: [
        {
            label: 'Amount',
            displayValue: 'amount',
        },
        {
            label: 'Sender',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Receiver',
            displayValue: 'to',
            nativeValue: 'to',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        }
    ],
    create_feed: [
        {
            label: 'Feed Name',
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: 'Creator',
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink:true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    pause_feed: [
        {
            label: 'Feed Name',
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: 'Creator',
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink:true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    start_feed: [
        {
            label: 'Feed Name',
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: 'Creator',
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink:true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    edit_feed: [
        {
            label: 'Feed Name',
            displayValue: 'feedName',
            nativeValue: 'feedName'
        },
        {
            label: 'Creator',
            displayValue: 'oracleCreator',
            nativeValue: 'oracleCreator',
            isLink:true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    request_rand: [
        {
            label: 'Consumer',
            displayValue: 'consumer',
            nativeValue: 'consumer',
            isLink:true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Service Fee Cap',
            displayValue: 'amount',
            nativeValue: 'amount',
        },
    ],
    create_record: [
        {
            label: 'Digest',
            displayValue:'digest',
            nativeValue:'digest',
            isNeedFormatHash: true,
            isHref: true,
            href: '',
            isNeedFormat: true,
            isFormatAddress: true,
        },
        {
            label: 'Digest algo',
            displayValue: 'digest_algo',
        }
    ],
    issue_token: [
        {
            label: 'Symbol',
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: 'MinUnit',
            displayValue: 'minUnit',
            nativeValue: 'minUnit',
        },
        {
            label: 'Owner',
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    edit_token: [
        {
            label: 'Symbol',
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: 'Owner',
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    transfer_token_owner: [
        {
            label: 'TokenId',
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: 'Original Owner',
            displayValue: 'srcOwner',
            nativeValue: 'srcOwner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'New Owner',
            displayValue: 'dstOwner',
            nativeValue: 'dstOwner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        }
    ],
    mint_token: [
        {
            label: 'TokenId',
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: 'Amount',
            displayValue: 'amount',
            nativeValue: 'amount',
        },
        {
            label: 'Owner',
            displayValue: 'owner',
            nativeValue: 'owner',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    burn_token: [
        {
            label: 'Symbol',
            displayValue: 'symbol',
            nativeValue: 'symbol',
        },
        {
            label: 'Amount',
            displayValue: 'amount',
            nativeValue: 'amount',
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
    ],
    submit_proposal: [
        {
            label: 'Proposer',
            displayValue: 'from',
            nativeValue: 'from',
            isFormatAddress: true,
            isNeedFormat: true,
            isLink: true,
            linkRoute: '/address',
        },
        {
            label: 'Title',
            displayValue: 'title',
            nativeValue: 'title',
            isNeedFormat: true,
            isFormatMoniker: true,
        },
        {
            label: 'Initial Deposit',
            displayValue: 'amount',
            nativeValue: 'amount',
        },
    ],
    deposit: [
        {
            label: 'Proposal ID',
            displayValue:'proposalId',
            nativeValue:'proposalId',
            isLink: true,
            linkRoute: '/ProposalsDetail'
        },
        {
            label: 'Depositor',
            displayValue:'depositor',
            nativeValue:'depositor',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Deposit',
            displayValue:'amount',
            nativeValue:'amount',
        },
    ],
    vote: [
        {
            label: 'Proposal ID',
            displayValue:'proposalId',
            nativeValue:'proposalId',
            isLink: true,
            linkRoute: '/ProposalsDetail'
        },
        {
            label: 'Voter',
            displayValue:'voter',
            nativeValue:'voter',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Option',
            displayValue:'option',
            nativeValue:'option'
        },
    ],
    create_client: [
        {
            label: 'Client ID',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    update_client: [
        {
            label: 'Client ID',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    channel_open_confirm: [
        {
            label: 'PortId',
            value: '',
        },
        {
            label: 'ChannelId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    channel_open_try: [
        {
            label: 'PortId',
            value: '',
        },
        {
            label: 'ChannelId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    channel_open_ack: [
        {
            label: 'PortId',
            value: '',
        },
        {
            label: 'ChannelId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    channel_open_init: [
        {
            label: 'PortId',
            value: '',
        },
        {
            label: 'ChannelId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    connection_open_confirm: [
        {
            label: 'ClientID',
            value: '',
        },
        {
            label: 'ConnectionId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    connection_open_init: [
        {
            label: 'ClientID',
            value: '',
        },
        {
            label: 'ConnectionId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    connection_open_try: [
        {
            label: 'ClientID',
            value: '',
        },
        {
            label: 'ConnectionId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    connection_open_ack: [
        {
            label: 'ClientID',
            value: '',
        },
        {
            label: 'ConnectionId',
            value: '',
        },
        {
            label: 'Signer',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
    ],
    acknowledge_packet: [
        {
            label: 'Amount',
            value: '',
        },
        {
            label: 'Sender',
            displayValue: 'signer',
            nativeValue: 'signer',
            isLink: true,
            isNeedFormat: true,
            isFormatAddress: true,
            linkRoute: '/address',
        },
        {
            label: 'Receiver',
            value: '',
        },
    ]

}