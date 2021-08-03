import { HttpHelper } from '../helper/httpHelper';
import { requestThrottler } from '../helper/throttleHttpHelper';
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

async function throttlerPost(url, payload){
  url = `/api/${url.replace(/^\//, '')}`;
  try{
    let data = await requestThrottler(url, payload);
    if(data && data.code == 0){
      return data;
    }else{
      console.error(`error from ${url}:`,JSON.stringify(data));
      return data;
    }
  }catch(err){
    console.error(`error from ${url}:`,err.message);
    return err;
  }
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

export async function getIbcToken(payload){
  const url = '/upload-token-info'   
	return await throttlerPost(url, payload);
}

export function getDbStatistics(params){
	let url = `statistics/db?params=${params}`;
	return get(url);
}

export function getNetworkStatistics(params){
	let url = `statistics/network?params=${params}`;
	return get(url);
}

export function getBlockList(pageNum, pageSize, useCount=false){
	let url = `blocks?pageNum=${pageNum || ''}&pageSize=${pageSize || ''}&useCount=${useCount}`;
	return get(url);
}

export function getRangeBlockList(start, end, useCount=false){
  let url = `blocks/range?start=${start || ''}&end=${end | ''}&useCount=${useCount}`;
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
    const {txType, status, beginTime, endTime, pageNum, pageSize, useCount} = params;
    let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}`;
    if(useCount){
        url += `&useCount=true`;
    }
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

// export function getDefineServiceTxList(type, status, pageNum, pageSize){
//     let url = `txs?pageNum=${pageNum}&pageSize=${pageSize}&type=${type}&status=${status}`;
//     return get(url);
// }

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



export async function getServiceBindingByServiceName(serviceName, provider){
    let url = `service/bindings/${serviceName}`;
    if(provider){
        url += `/${provider}`;
    }
    let res = await getFromLcd(url);
    if (res && res.result && res.result.value) {
        res.result = res.result.value;
    }
    return res;
}

export async function getServiceContextsByServiceName(requestContextId){
    let url = `service/contexts/${requestContextId}`;
    let res = await getFromLcd(url);
    if (res && res.result && res.result.value) {
        res.result = res.result.value;
    }
    return res;
}

export function getRespondServiceRecord(serviceName, provider, pageNum, pageSize){
    let url = `txs/services/respond?serviceName=${serviceName}&provider=${provider}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
    return get(url);
}

export function getNodeInfo(){
    return getFromLcd('node_info');
}
export function getIdentities(identity, pageNum, pageSize){
    let url = `identities?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true&search=${identity}`;
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
export function getIdentityDetail(identity){
    let url = `/identities/${identity}`;
    return get(url);
}

export function getPubkeyListByIdentity(identity, pageNum, pageSize, useCount){
    let url = `identities/pubkey?id=${identity}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getCertificateListByIdentity(identity, pageNum, pageSize, useCount){
    let url = `identities/certificate?id=${identity}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getTxListByIdentity(identity, pageNum, pageSize, useCount){
    let url = `txs/identity?id=${identity}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getIdentityListByAddress(address, pageNum, pageSize, useCount){
    let url = `identities/address?address=${address||''}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
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

export function getDelegationTxsApi (valAddress, pageNum, pageSize, useCount=true, type='', status='', beginTime='', endTime='') {
    let url = `/txs/staking?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&type=${type}&status=${status}&address=${valAddress}&beginTime=${beginTime}&endTime=${endTime}`
    return get(url);
}

export function getValidationTxsApi(valAddress, pageNum, pageSize, useCount=true, type='', status='', beginTime='', endTime=''){
    let url = `/txs/declaration?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&type=${type}&status=${status}&address=${valAddress}&beginTime=${beginTime}&endTime=${endTime}`
    return get(url);
}

export function getAddressInformationApi(address){
    let url = `/staking/account/${address}`;
    return get(url);
}

export function getDelegationListApi(address,pageNum,pageSize,useCount=true){
    let url = `/staking/delegators/${address}/delegations?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getUnBondingDelegationListApi(address,pageNum,pageSize,useCount=true){
    let url = `/staking/delegators/${address}/unbonding_delegations?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getRewardsItemsApi(address){
    let url = `/distribution/delegators/${address}/rewards`;
    return get(url);
}

export function getTypeStakingApi(address){
    let url = `/txs/types/staking`;
    return get(url);
}

export function getTypeDeclarationApi(address){
    let url = `/txs/types/declaration`;
    return get(url);
}

export function getTypeGovApi(address){
    let url = `/txs/types/gov`;
    return get(url);
}

export function getValidatorSetList (pageNum,pageSize,height) {
	const url = `/blocks/validatorset?height=${height}&pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`
	return get(url)
}

export function getConfig () {
  const url = `/config`
	return get(url)
}

export function stakingBlockInformation(height) {
	const url = `/blocks/staking/${height}`
	return get(url)
}

export function getNativeAssetsListApi(pageNum, pageSize, useCount) {
    const url = `/asset/tokens?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`
	return get(url)
}

export function getNativeAssetsTxsApi (pageNum, pageSize, useCount, type, symbol) {
    let url = `/txs/asset?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&type=${type}`
    if (symbol) {
        url += `&symbol=${symbol}`
    }
	return get(url)
}

export function getNativeAssetDetailApi (symbol) {
    let url = `/asset/tokens/${symbol}`
	return get(url)
}

export function getProposalsListApi (status,pageNum="",pageSize="", useCount=true) {
    let url = `/gov/proposals?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&status=${status}`
	return get(url)
}

export function getProposalsDetailApi (id) {
    let url = `/gov/proposals/${id}`
	return get(url)
}

export function getProposalDetailVotersApi (id,pageNum, pageSize, useCount,voterType) {
    let url = `/gov/proposals/${id}/voter?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&voterType=${voterType}`
	return get(url)
}

export function getProposalDetailDepositorApi (id,pageNum, pageSize, useCount) {
    let url = `/gov/proposals/${id}/depositor?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`
	return get(url)
}

export function getGovTxsApi(valAddress, pageNum, pageSize, useCount=true, type='', status='', beginTime='', endTime=''){
    let url = `/txs/gov?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}&type=${type}&status=${status}&address=${valAddress}&beginTime=${beginTime}&endTime=${endTime}`
    return get(url);
}

export function getDepositedProposalsApi (valAddress,pageNum,pageSize,useCount) {
    let url = `/staking/validators/${valAddress}/deposit?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getVotedProposalsApi (valAddress,pageNum,pageSize,useCount) {
    let url = `/staking/validators/${valAddress}/votes?pageNum=${pageNum}&pageSize=${pageSize}&useCount=${useCount}`;
    return get(url);
}

export function getIbcTransferByHash(hash){
    let url = `ibc/applications/transfer/v1beta1/denom_traces/${hash}`;
    return getFromLcd(url);
}

export function fetchTokenStats () {
    let url = `/statistics/token_stats`;
    return get(url);
}

export function fetchTokenDistribution () {
    let url = `/statistics/account_total`;
    return get(url);
}

export function fetchTokenRichList () {
    let url = `/statistics/accounts`;
    return get(url);
}




