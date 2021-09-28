import {cfg} from "../../config";

export default [
    {
        label:'NFT ID',
        displayValue:'nft_id',
        nativeValue: 'nft_id',
        nftRouterParamsValue: 'denom_id',
        isNeedFormat: true,
        isFormatAddress:true,
        isLink:true,
        isNft: true,
        linkRoute: '/nft/token?denom=',
        denomRouter: '&tokenId='
    },
    {
        label: 'NFT Name',
        displayValue:'nft_name',
        nativeValue: 'nft_id',
        nftRouterParamsValue: 'denom_id',
        isNeedFormat: true,
        isFormatAddress:true,
        isLink:true,
        isNft: true,
        linkRoute: '/nft/token?denom=',
        denomRouter: '&tokenId='
    },
    {
        label: 'Denom',
        displayValue: 'denom_id'
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
    {
        label: 'Uri',
        displayValue: 'tokenUri',
        nativeValue: 'tokenUri',
        isNftHref: true,
    },
    {
        label: 'Time',
        displayValue: 'last_block_time',

    }
]