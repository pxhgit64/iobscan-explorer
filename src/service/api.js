import { HttpHelper } from '../helper/httpHelper';
import { TX_STATUS } from '../constant'
import moment from 'moment';

function get(url){
	return new Promise(async (res,rej)=>{
        url = `/api/${url.replace(/^\//, '')}`;
		try{
			let data = await HttpHelper.get(url);
			if(data && data.code == 0){
				res(data.data || data);
			}else{
				console.error(`error from ${url}:`,JSON.stringify(data));
				rej(data);
			}
		}catch(err){
			console.error(`error from ${url}:`,err.message);
			rej(err);
		}
	});
}

function getFromLcd(url){
    url = `/lcd/${url.replace(/^\//,'')}`;
	return new Promise(async (res,rej)=>{
		try{
			let data = await HttpHelper.get(url);
			if(data){
				res(data);
			}else{
				console.error(`error from ${url}:`,JSON.stringify(data));
				rej(data);
			}
		}catch(err){
			console.error(`error from ${url}:`,err.message);
			rej(err);
		}
	})
}



export function getStatistics(){
	let url = `statistics`;
	return get(url);
}

export function getBlockList(pageNum, pageSize, useCount=false){
	let url = `blocks?pageNum=${pageNum || ''}&pageSize=${pageSize | ''}&useCount=${useCount}`;
	return get(url);
}

export function getDenoms(pageNum, pageSize,denomNameOrId, needAll){
	let url = `denoms`;
	if(needAll){
	    url += `?needAll=true`;
    }else{
	    url += `?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
	    if(denomNameOrId){
	        url += `&denomNameOrId=${denomNameOrId}`;
        }
    }
	return get(url);
}

export function getNfts(denom, nftId, owner, pageNum, pageSize, useCount=false){
	let url = `nfts?pageNum=${pageNum||''}&pageSize=${pageSize||''}&useCount=${useCount}&denomId=${denom||''}&nftId=${nftId||''}&owner=${owner||''}`;
	return get(url);
}

export function getNftDetail(denom, nftId){
	let url = `nfts/details?denomId=${denom}&nftId=${nftId}`;
	return get(url);
}

export function getBlockWithHeight(height){
	let url = `blocks/${height}`;
	return get(url);
}

export function getLatestBlock(){
	let url = `blocks/latest`;
	return get(url);
}

export function getValidatorList(isJailed, pageNum, pageSize, useCount=false){
	let url = `validators?jailed=${isJailed}&pageNum=${pageNum||''}&pageSize=${pageSize||''}&useCount=${useCount}`;
	return get(url);
}

export function getAllTxTypes(){
    let url = `txs/types`;
    return get(url);
}

export function getAllServiceTxTypes(){
    let url = `txs/types/service`;
    return get(url);
}



export function getTxList(params){
    const {txType, status, beginTime, endTime, pageNum, pageSize} = params;
    let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
    if(txType){
        url += `&type=${txType}`;
    }
    if(status){
        url += `&status=${status}`;
    }
    if(beginTime){
        url += `&beginTime=${moment(beginTime).startOf('d').unix()}`;
    }
    if(endTime){
        url += `&endTime=${moment(endTime).endOf('d').unix()}`;
    }
    // console.log('query tx url', url);
    return get(url);
}

export function getRelevanceTxList(type, contextId, pageNum, pageSize, useCount=false){
    let url = `txs/relevance?pageNum=${pageNum}&pageSize=${pageSize}&type=${type}&contextId=${contextId}&useCount=${useCount}`;
    return get(url);
}

export function getTokenTxList(nftId, denom, pageNum, pageSize,){
    let url = `txs/nfts?pageNum=${pageNum}&pageSize=${pageSize}&tokenId=${nftId}&denomId=${denom}&useCount=true`;
    return get(url);
}

export function getCallServiceWithAddress(consumerAddr, pageNum, pageSize, useCount=false){
    let url = `txs/services/call-service?pageNum=${pageNum}&pageSize=${pageSize}&consumerAddr=${consumerAddr}&useCount=${useCount}`;
    return get(url);
}

export function getRespondServiceWithAddress(providerAddr, pageNum, pageSize, useCount=false){
    let url = `txs/services/respond-service?pageNum=${pageNum}&pageSize=${pageSize}&providerAddr=${providerAddr}&useCount=${useCount}`;
    return get(url);
}

export function getServiceDetail(serviceName){
    let url = `txs/services/detail/${serviceName}`;
    return get(url);
}

export function getServiceBindingTxList(serviceName, pageNum, pageSize){
    let url = `txs/services/providers?serviceName=${serviceName}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
    return get(url);
}

export function getServiceTxList(type, status, serviceName,currentPageNum,pageSize,){
    let url = `txs/services/tx?pageNum=${currentPageNum}&pageSize=${pageSize}&serviceName=${serviceName}&useCount=true`;
    if(type){
        url += `&type=${type}`;
    }
    if(status==TX_STATUS.success || status === TX_STATUS.fail){
        url += `&status=${status}`;
    }

    return get(url);
}

export function getBlockTxList(height){
    let url = `txs/blocks?pageNum=1&pageSize=100&height=${height}`;
    return get(url);
}

export function getTxDetail(hash){
    let url = `txs/${hash}`;
    return get(url);
}

export function getAddressTxList(address, type, status, pageNum=1, pageSize=10){
    let url = `txs/addresses?pageNum=${pageNum}&pageSize=${pageSize}&address=${address}&type=${type}&status=${status}&useCount=true`;
    return get(url);
}

export function getDefineServiceTxList(type, status, pageNum, pageSize){
    let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&type=${type}&status=${status}`;
    return get(url);
}

export function getAllServiceTxList(pageNum, pageSize, iptVal){
    let url = `txs/services?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
    if(iptVal){
        url += `&nameOrDescription=${iptVal}`;
    }
    return get(url);
}

export function getServiceRespondInfo(serviceName, provider){
    let url = `txs/services/bind_info?serviceName=${serviceName}&provider=${provider}`;
    return get(url);
}



export function getServiceBindingByServiceName(serviceName, provider){
    let url = `service/bindings/${serviceName}`;
    if(provider){
        url += `/${provider}`;
    }
    return getFromLcd(url);
}

export function getServiceContextsByServiceName(requestContextId){
    let url = `service/contexts/${requestContextId}`;
    return getFromLcd(url);
}

export function getRespondServiceRecord(serviceName, provider, pageNum, pageSize){
    let url = `txs/services/respond?serviceName=${serviceName}&provider=${provider}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
    return get(url);
}

export function getNodeInfo(){
    return getFromLcd('node_info');
}
export function getIdentities(identity, pageNum, pageSize){
    let url = `txs/identities?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true&search=${identity}`;
    return get(url);
}

export function getValidatorsListApi(pageNum, pageSize, useCount,status){
    let url = `staking/validators?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&status=${status}`;
    return get(url);
}

export function getValidatorsInfoApi(valAddress){
    let url = `staking/validators/${valAddress}`;
    return get(url);
}

export function getValidatorWithdrawAddrApi(delegatorAddr){
    let url = `/distribution/delegators/${delegatorAddr}/withdraw_address`;
    return get(url);
}

export function getValidatorRewardsApi(valAddress){
    let url = `/distribution/validators/${valAddress} `;
    return get(url);
}

export function getValidatorCommissionInfoApi(){
    let url = `/staking/commission_info`;
    return get(url);
}

export function getValidatorsDelegationsApi(valAddress,pageNum,pageSize,useCount){
    let url = `/staking/validators/${valAddress}/delegations?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getUnbondingDelegationsApi(valAddress,pageNum,pageSize,useCount){
    let url = `/staking/validators/${valAddress}/unbonding-delegations?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

// 验证人详情页面 获取Delegation Txs 待调整
export function getDelegationTxsApi(valAddress,pageNum,pageSize){
    let url = `/txs/staking?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true&address=${valAddress}`;
    return get(url);
}

// 验证人详情页面 获取Validation Txs 待调整
export function getValidationTxsApi(valAddress,pageNum,pageSize){
    let url = `/txs/declaration?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true&address=${valAddress}`;
    return get(url);
}

// 地址详情接口 operator_address和withdrawAddress无数据
export function getAddressInformationApi(address){
    let url = `/staking/account/${address}`;
    return get(url);
}

export function getDelegationListApi(address){
    let url = `/staking/delegators/${address}/delegations`;
    return get(url);
}

export function getUnBondingDelegationListApi(address){
    let url = `/staking/delegators/${address}/unbonding_delegations`;
    return get(url);
}
