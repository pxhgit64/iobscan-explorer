<template>
	<div class="address_container_content">
		<div class="address_content_wrap">
			<div class="address_content_title">
	          <div class="address_content_title_first">{{`${$t('ExplorerLang.addressDetail.addressDetail')} |`}}</div>
	          <div class="address_content_title_address">{{address}}</div>
	      	</div>
			<div class="address_asset_content" v-show="moduleSupport('103', prodConfig.navFuncList)">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.assets')}}</div>
				<el-table class="table" :data="assetArray" :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.denom" :label="$t('ExplorerLang.table.denom')"  prop="denomName"></el-table-column>
					<el-table-column :min-width="ColumnMinWidth.tokenId" :label="$t('ExplorerLang.table.id')" >
						<template slot-scope="scope">
							<router-link :to="`/nft/token?denom=${scope.row.denomId}&&tokenId=${scope.row.id}`">{{scope.row.nftName || formatAddress(scope.row.id)}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.schema" :label="$t('ExplorerLang.table.data')" prop="tokenData"></el-table-column>
					<el-table-column :min-width="ColumnMinWidth.URI" :label="$t('ExplorerLang.table.uri')" prop="tokenUri">
						<template slot-scope="scope">
							<a v-if="scope.row.tokenUri" :download="scope.row.tokenUri" :href="scope.row.tokenUri" target="_blank">{{scope.row.tokenUri}}</a>
							<span v-else>--</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="consumer_transaction_content" v-show="moduleSupport('105', prodConfig.navFuncList)">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.consumerTitle')}}</div>
				<el-table class="table" :data="consumerTxList"
						  row-key="txHash"
                          :empty-text="$t('ExplorerLang.table.emptyDescription')"
						  :span-method="arraySpanMethod"
    					  >
					<el-table-column :min-width="ColumnMinWidth.serviceName" :label="$t('ExplorerLang.table.serviceName')">
						<template slot-scope="scope">
							<el-tooltip v-if="!scope.row.isChildren"  :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</el-tooltip>
							<span v-if="scope.row.isChildren && scope.row.index==0">{{getRespondCount(scope.row.count)}}</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')" prop="txType"></el-table-column>
					<el-table-column :min-width="ColumnMinWidth.state" :label="$t('ExplorerLang.table.requestStatus')">
						<template slot-scope="scope">
							<div v-if="scope.row.state" class="consumer_transaction_content_available">
								<span class="consumer_transaction_content_available_icon" :style="`background:${getBgColorWithState(scope.row.state)}`"></span>
								<span>{{scope.row.state}}</span>
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
						<template slot-scope="scope">
							<div class="address_transaction_content_hash">
								<img class="status_icon"
                                             :src="require(`../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
								<el-tooltip :content="scope.row.txHash"
								            placement="top">
									<router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}</router-link>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
                        <template slot-scope="scope">
                            <span>{{formatAddress(scope.row.requestContextId)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.provider')">
                        <template slot-scope="scope">
                            <el-tooltip v-if="scope.row.txType==TX_TYPE.respond_service" 
								        :content="scope.row.provider"
								        placement="top">
								<router-link   :to="`/address/${scope.row.provider}`">
                                	{{formatAddress(scope.row.provider)}}
                            	</router-link>
							</el-tooltip>
                            <div v-if="scope.row.txType==TX_TYPE.call_service">
                                    <el-tooltip v-if="(scope.row.provider || []).length === 1"
								            	:content="scope.row.provider[0]"
								            	placement="top">
						            	<router-link :to="`/address/${scope.row.provider[0]}`">
                                        	{{formatAddress(scope.row.provider[0])}}
                                    	</router-link>
									</el-tooltip>
                                <div class="service_tx_muti_to_container"
                                     v-else>
                                    <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                                        {{ `${scope.row.provider.length} ${$t('ExplorerLang.unit.providers')}` }} 
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')">
						<template slot-scope="scope">
							<span>{{`${scope.row.time}`}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination_content" v-show="consumerTxCount > consumerTxPageSize">
					<m-pagination :page-size="consumerTxPageSize"
					              :total="consumerTxCount"
					              :page="consumerTxPageNum"
					              :page-change="consumerTxPageChange">
					</m-pagination>
				</div>
			</div>
			<div class="provider_transaction_content" v-show="moduleSupport('105', prodConfig.navFuncList)">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.providerTitle')}}</div>
				<el-table class="table" :data="providerTxList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.serviceName" :label="$t('ExplorerLang.table.serviceName')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.respondTimes" :label="$t('ExplorerLang.table.respondTimes')">
						<template slot-scope="scope">
							<router-link :to="`/service/respond/${scope.row.serviceName}/${address}`">{{`${scope.row.respond_times} ${$t('ExplorerLang.unit.time')}`}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.available" :label="$t('ExplorerLang.table.isAvailable')">
						<template slot-scope="scope">
							<div class="provider_transaction_content_available">
								<span class="provider_transaction_content_available_icon" :style="`background:${scope.row.isAvailable?'#B1E96E':'#C4C4C4'}`"></span>
								<span class="provider_transaction_content_available_status">{{scope.row.isAvailable?"True":'False'}}</span>
							</div>
						</template>
					</el-table-column>
					<!-- <el-table-column :min-width="ColumnMinWidth.price" :label="$t('ExplorerLang.table.price')">
						<template slot-scope="scope">
							<span>{{scope.row.pricing}}</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.deposit" :label="$t('ExplorerLang.table.deposit')">
						<template slot-scope="scope">
							<span>{{scope.row.deposit}}</span>
						</template>
					</el-table-column> -->
					<el-table-column :min-width="ColumnMinWidth.qos" :label="$t('ExplorerLang.table.minBlock')">
						<template slot-scope="scope">
							<span>{{`${scope.row.qos} ${$t('ExplorerLang.unit.blocks')}`}}</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.bindTime')">
						<template slot-scope="scope">
							<span>{{`${scope.row.time}`}}</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.disabledTime')">
						<template slot-scope="scope">
							<span>{{scope.row.isAvailable ? '--' : scope.row.unbindTime}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="content_title" style="margin-top:0.4rem">{{$t('ExplorerLang.addressDetail.respondRecord')}}</div>
				<el-table class="table" :data="respondRecordList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.serviceName" :label="$t('ExplorerLang.table.serviceName')">
						<template slot-scope="scope">
							<el-tooltip v-if="scope.row.serviceName" :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">{{scope.row.serviceName}}</router-link>
							</el-tooltip>
							<span v-if="!scope.row.serviceName">--</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')" prop="type"></el-table-column>
					<el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.respondHash')">
						<template slot-scope="scope">
							<div class="respond_transaction_content_hash">
								<img class="status_icon"
                                             :src="require(`../assets/${scope.row.respondStatus==TX_STATUS.success?'success.png':'failed.png'}`)"/>
								<el-tooltip :content="scope.row.respondHash"
								            placement="top">
									<router-link :to="`/tx?txHash=${scope.row.respondHash}`">{{formatTxHash(scope.row.respondHash)}}</router-link>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
                        <template slot-scope="scope">
                            <span>{{formatAddress(scope.row.requestContextId)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.blockHeight" :label="$t('ExplorerLang.table.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.height}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')" prop="time">
						<template slot-scope="scope">
							<span>{{Tools.getDisplayDate(scope.row.time)}}</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.consumer')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.consumer" placement="top">
								<router-link  v-if="scope.row.consumer && scope.row.consumer.length" :to="`/address/${scope.row.consumer}`">{{formatAddress(scope.row.consumer)}}</router-link>
							</el-tooltip>
							<span v-if="!scope.row.consumer">--</span>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.requestHash')">
						<template slot-scope="scope">
							<div class="address_transaction_content_hash">
								<img v-if="scope.row.requestHash && scope.row.requestHash !='--'" class="status_icon"
                                            src="../assets/success.png"/>
								<el-tooltip v-if="scope.row.requestHash && scope.row.requestHash != '--'" 
								            :content="scope.row.requestHash"
								            placement="top">
									<router-link :to="`/tx?txHash=${scope.row.requestHash}`">{{formatTxHash(scope.row.requestHash)}}</router-link>
								</el-tooltip>
								<span v-else>{{'--'}}</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination_content" v-show="respondRecordCount > respondRecordPageSize">
					<m-pagination :page-size="respondRecordPageSize"
					              :total="respondRecordCount"
					              :page="respondRecordPageNum"
					              :page-change="respondRecordPageChange">
					</m-pagination>
				</div>
			</div>
			<template v-if="moduleSupport('107', prodConfig.navFuncList)">
				<!-- 地址详情 -->
				<address-information-component :address="address" :data="assetsItems" :isProfiler="isProfiler" />
				<div class="delegations_wrap">
					<div class="delegations_container">
						<!-- Delegations -->
						<div class="one_table_container">
							<p class="validator_information_content_title">
								{{ $t('ExplorerLang.validatorDetail.delegationsTitle') }}
								<span class="address_information_delegation_value" v-show="totalDelegatorValue">{{totalDelegatorValue}}</span>
							</p>
							<div class="delegations_table_container">
								<el-table :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="delegationsItems" style="width: 100%">
									<el-table-column prop="address" :label="$t('ExplorerLang.table.address')" min-width="150">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<router-link v-if="row.moniker" class="address_link" :to="`/staking/${row.address}`">{{formatMoniker(row.moniker)}}</router-link>
												<router-link v-if="!row.moniker" style="font-family:Consolas,Menlo" class="address_link" :to="`/staking/${row.address}`">{{formatAddress(row.address)}}</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')" align="right" min-width="180"> </el-table-column>
									<el-table-column prop="shares" :label="$t('ExplorerLang.table.shares')" align="left" min-width="150"> </el-table-column>
									<el-table-column prop="block" :label="$t('ExplorerLang.table.block')" min-width="100">
										<template v-slot:default="{ row }">
										<router-link style="font-family: Consolas,Menlo;" :to="'/block/' + row.block" :style="{ color: '$theme_c !important' }">{{ row.block }}</router-link>
										</template>
									</el-table-column>
								</el-table>
							</div>
							<m-pagination v-if="flDelegationNextPage" :page="delegationCurrentPage" :page-size="tablePageSize" :total="delegationCountNum" :page-change="delegationPageChange"></m-pagination>
						</div>
						<!-- Unbonding Delegations -->
						<div class="second_table_container">
							<p class="validator_information_content_title">
								{{ $t('ExplorerLang.validatorDetail.unbondingDelegationsTitle') }}
								<span class="address_information_unbonding_delegation_value" v-show="totalUnBondingDelegatorValue">{{totalUnBondingDelegatorValue}}</span>
							</p>
							<div class="delegations_table_container">
								<el-table :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="unBondingDelegationsItems" style="width: 100%">
									<el-table-column prop="address" :label="$t('ExplorerLang.table.address')" width="130">
										<template v-slot:default="{ row }">
										<el-tooltip :content="`${row.address}`">
											<router-link style="font-family: Consolas,Menlo;" :to="'address/' + row.address" :style="{ color: '$theme_c !important' }">{{ formatAddress(row.address) }}</router-link>
										</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')" min-width="150"> </el-table-column>
									<el-table-column prop="block" :label="$t('ExplorerLang.table.block')" min-width="118">
										<template v-slot:default="{ row }">
										<router-link style="font-family: Consolas,Menlo;" :to="'/block/' + row.block" :style="{ color: '$theme_c !important' }">{{ row.block }}</router-link>
										</template>
									</el-table-column>
									<el-table-column prop="end_time" :label="$t('ExplorerLang.table.endTime')" width="180"> </el-table-column>
								</el-table>
							</div>
							<m-pagination v-if="flUnBondingDelegationNextPage" :page-size="tablePageSize" :total="unBondingDelegationCountNum" :page="unBondingDelegationCurrentPage" :page-change="unBondingDelegationPageChange"></m-pagination>
						</div>
					</div>
				</div>
				<!-- Delegator Rewards 标题 -->
				<div class="address_information_redelegation_header_title">{{ $t('ExplorerLang.addressInformation.delegatorRewards.title') }}
					<span class="address_information_redelegation_rewards_value" v-show="totalDelegatorRewardValue">{{totalDelegatorRewardValue}}</span>
				</div>
				<div class="address_information_redelegation_tx_container">
					<div class="address_information_delegator_rewards_content">
						<!-- Withdraw To: -->
						<div class="address_information_detail_option">
							<span class="address_information_detail_option_name">{{ $t('ExplorerLang.addressInformation.delegatorRewards.withdrawTo') }}:</span>
							<span class="address_information_detail_option_value">
								<router-link :to="`/address/${withdrewToAddress}`">{{withdrewToAddress}}</router-link></span>
						</div>
						<!-- Delegator Rewards 的表格 -->
						<div class="address_information_list_content">
							<div>
								<el-table :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="rewardsItems" style="width: 100%">
									<el-table-column prop="address" :label="$t('ExplorerLang.table.address')" align="left" min-width="294">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<router-link v-if="row.moniker" class="address_link" :to="`/staking/${row.address}`">{{formatMoniker(row.moniker)}}</router-link>
												<router-link v-if="!row.moniker" style="font-family:Consolas,Menlo" class="address_link" :to="`/staking/${row.address}`">{{formatAddress(row.address)}}</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')" align="right" min-width="294"></el-table-column>
								</el-table>
							</div>
						</div>
						<!-- 换页 -->
						<div class="pagination_content" v-if="flRewardsDelegationNextPage">
							<keep-alive>
								<m-pagination
										:page-size="pageSize"
										:total="rewardsDelegationCountNum"
										:page="rewardsDelegationCurrentPage"
										:page-change="rewardsDelegationPageChange"
								></m-pagination>
							</keep-alive>
						</div>
					</div>
					<!-- Validator Rewards -->
					<div class="address_information_detail_container" :class="OperatorAddress !== '--' ? '' :'hide_style'" :style="{visibility:OperatorAddress && OperatorAddress !== '--' ? 'visible':'hidden'}">
						<!-- 标题 -->
						<div class="address_information_redelegation_title">{{ $t('ExplorerLang.addressInformation.validatorRewards.title') }}
							<span class="address_information_validator_rewards_value" v-show="totalValidatorRewards">{{totalValidatorRewards}}</span>
						</div>
						<!-- 需展示的数据 -->
						<ul class="address_information_detail_content">
							<li class="address_information_detail_option">
								<span class="address_information_detail_option_name">{{ $t('ExplorerLang.addressInformation.validatorRewards.validatorMoniker') }}:</span>
								<div class="validator_status_content">
									<span class="address_information_detail_option_value">
										<router-link v-show="OperatorAddress !== '--' && validatorMoniker !== '--'" :to="`/staking/${OperatorAddress}`">{{validatorMoniker}}</router-link>
										<span v-show="OperatorAddress === '--' || validatorMoniker === '--'">{{validatorMoniker}}</span>
									</span>
									<span class="address_information_address_status_active" v-if="validatorStatus === 'Active'">{{ $t('ExplorerLang.staking.status.active') }}</span>
									<span class="address_information_address_status_candidate" v-if="validatorStatus === 'Candidate'">{{ $t('ExplorerLang.staking.status.candidate') }}</span>
									<span class="address_information_address_status_jailed" v-if="validatorStatus === 'Jailed'">{{ $t('ExplorerLang.staking.status.jailed') }}</span>
								</div>
							</li>
							<li class="address_information_detail_option" style="margin-top: 0.05rem">
								<span class="address_information_detail_option_name">{{ $t('ExplorerLang.addressInformation.validatorRewards.operatorAddress') }}:</span>
								<span class="address_information_detail_option_value">
									<router-link v-show="OperatorAddress !== '--'" :to="`/staking/${OperatorAddress}`">{{OperatorAddress}}</router-link>
									<span v-show="OperatorAddress === '--'" >{{OperatorAddress}}</span>
								</span>
							</li>
						</ul>
					</div>
				</div>
			</template>
			<div class="address_transaction_content">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.txRecord')}}</div>
				<div class="address_transaction_condition_container">
                    <span class="address_transaction_condition_count">
                        {{ `${totalTxNumber} ${$t('ExplorerLang.unit.Txs')}` }}
                    </span>
                    <el-select v-model="type_temp">
                        <el-option v-for="(item, index) in txTypeOption"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="status_temp">
                        <el-option v-for="(item, index) in statusOpt"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <div class="address_transaction_condition_action">
                    	<div class="search_btn" @click="handleSearchClick">
	                        {{$t('ExplorerLang.transactions.search')}}
	                    </div>
	                    <div class="reset_btn" @click="resetFilterCondition"><i class="iconfont iconzhongzhi"></i></div>
                    </div>
                </div>
				<TxListComponent :txData="txList"></TxListComponent>
				<div class="pagination_content" v-show="totalTxNumber > pageSize">
					<m-pagination :page-size="pageSize"
					              :total="totalTxNumber"
					              :page="pageNum"
					              :page-change="pageChange">
					</m-pagination>
				</div>
			</div>
			
		</div>
	</div>

</template>

<script>
	import { getNfts } from "../service/api";
	import Tools from "../util/Tools";
	import MPagination from "./common/MPagination";
	import { TxHelper } from "../helper/TxHelper";
	import { moduleSupport } from "../helper/ModulesHelper";
	import TxListComponent from "./common/TxListComponent";
	import prodConfig from "../productionConfig"
	import { TX_TYPE, TX_STATUS, ColumnMinWidth } from '../constant';
    import AddressInformationComponent from "./AddressInformationComponent";
  	import {
  		getAddressTxList,
    	getCallServiceWithAddress,
		getRespondServiceWithAddress,
		getRespondServiceRecord,
		getServiceBindingByServiceName,
		getServiceContextsByServiceName,
		getAllTxTypes} from "../service/api";
    import axios from 'axios'
	import BigNumber from 'bignumber.js'
	import moveDecimal from 'move-decimal-point'
	import Constant from '../constant'
	import Config from '@/productionConfig.js'
	import { getAddressInformationApi,getDelegationListApi,getUnBondingDelegationListApi } from "@/service/api";
    export default {
		name: "OwnerDetail",
		components: { MPagination, TxListComponent,AddressInformationComponent },
		data() {
			return{
				TX_TYPE,
				TX_STATUS,
				ColumnMinWidth,
				prodConfig,
				moduleSupport,
				Tools,
				assetArray:[],
				denomArray:[],
				address:'',
				pageNum: 1,
				pageSize: 10,
				txList:[],
				totalTxNumber:0,
				providerTxList:[],
				consumerTxPageNum:1,
				consumerTxPageSize: 5,
				consumerTxCount:0,
				consumerTxList:[],
				respondRecordList:[],
				respondRecordPageNum:1,
				respondRecordPageSize: 5,
				respondRecordCount:0,
				type:'',
                status:'',
                type_temp:'',
                status_temp:'',
                statusOpt : [
                    {
                        value : '',
                        label : this.$t('ExplorerLang.common.allTxStatus')
                    },
                    {
                        value : 1,
                        label : this.$t('ExplorerLang.common.success')
                    },
                    {
                        value : 2,
                        label : this.$t('ExplorerLang.common.failed')
                    }
                ],
                txTypeOption : [
                    {
                        value : '',
                        label : this.$t('ExplorerLang.common.allTxType')
                    },
				],
				isProfiler:false,
				assetsItems:[],
				assetList: [],
				withdrewToAddress: '',
				validatorMoniker: '',
                validatorStatus:'',
				OperatorAddress: '',
				fixedNumber: 2,

				totalDelegatorReward: 0,
                totalDelegatorRewardValue: 0,
                totalUnBondingDelegator:0,
                totalUnBondingDelegatorValue:0,
                totalDelegator:0,
				totalDelegatorValue:0,
				totalValidatorRewards:0,
                allRewardsValue: 0,
				allRewardsAmountValue:0,
				
				tablePageSize: 5,
				flDelegationNextPage:false,
                flUnBondingDelegationNextPage:false,
				flRewardsDelegationNextPage:false,
				delegationCountNum: 0,
				unBondingDelegationCountNum:0,
				rewardsDelegationCountNum:0,
				delegationCurrentPage:1,
				unBondingDelegationCurrentPage:1,
				rewardsDelegationCurrentPage:1,
				delegationsItems:[],
                unBondingDelegationsItems:[],
				rewardsItems:[],
				delegationPageNationArrayData:[],
                unBondingDelegationPageNationArrayData:[],
				rewardsDelegationPageNationArrayData:[],
			}
		},
		watch:{
			$route(){
				this.address = this.$route.params.param;
				this.getOwnerDetail();
				this.getTxByAddress();
				this.getConsumerTxList();
				this.getRspondRecordList();
				this.getProviderTxList();	
			},
	        totalDelegatorReward(totalDelegatorReward){
				this.getAssetList()
            },
	        totalUnBondingDelegator(totalDelegatorReward){
		        this.getAssetList()
            },
	        totalDelegator(){
		        this.getAssetList()
            }
		},
		created () {
		},
		mounted () {
			document.documentElement.scrollTop = 0;
			this.getOwnerDetail();
			this.getAllTxType();
			this.getTxByAddress();
			this.getConsumerTxList();
			this.getRspondRecordList();
			this.getProviderTxList();
			this.address = this.$route.params.param
			this.getAddressInformation()
			this.getDelegationList()
			this.getUnBondingDelegationList()
			this.getRewardsItems()
			this.getAssetList()
		},
		methods:{
			async getOwnerDetail(){
				try {				
					let nftData = await getNfts('', '', this.$route.params.param, 1, 1000, true);
					// console.log('----',nftData)
					if(nftData && nftData.data ){
						this.assetArray = nftData.data.map(item => {
							return{
								id: item.nft_id,
                                denomName:item.denom_name || item.denom_id,
                                denomId: item.denom_id,
                                nftName:item.nft_name,
								owner: item.owner,
								tokenData: item.tokenData,
								tokenUri: item.tokenUri,

							}
						})
					}
				}catch (e) {
					console.error(e)
				}
			},
			//地址相关交易记录
			async getTxByAddress(){
			    try {
                    const res = await getAddressTxList(this.$route.params.param, this.type, this.status, this.pageNum, this.pageSize);
                    if(res){
                        // console.log('addressTx======:',res);
                        this.totalTxNumber = res.count;
                        this.txList = res.data;
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
			},
			pageChange(pageNum) {
				this.pageNum = pageNum;
				this.getTxByAddress()
			},
			//服务调用-消费者
			async getConsumerTxList(){
			    try {
                    const res = await getCallServiceWithAddress(this.$route.params.param, this.consumerTxPageNum, this.consumerTxPageSize, true);
                    if(res){
                        // console.log('ConsumerTx======:',res);
                        this.consumerTxCount = res.count;
                        this.consumerTxList = [];
                        for (let item of res.data){
                            let result = {
                                serviceName:item.msgs[0].msg.service_name || '--',
								txHash: item.tx_hash,
								blockHeight: item.height,
								txType: item.type,
								provider:item.msgs[0].msg.providers,
								time: Tools.getDisplayDate(item.time),
								state:"Running",
								status:item.status,
								respond:[],
                            };
                            item.events.forEach((item)=>{
	                            (item.attributes || []).forEach((attr)=>{
	                                if (attr.key == 'request_context_id') {
	                                    result.requestContextId = attr.value;
	                                }
	                            });
	                        });
	                        let context = await getServiceContextsByServiceName(result.requestContextId || '');
	                        if (context && context.result && context.result.value) {
	                        	result.state = context.result.value.state;
	                        }
                            this.consumerTxList.push(result);
                            if (item.respond && item.respond.length) {
	                        	item.respond.forEach((r,index)=>{
	                        		let respondResult = {
	                        			index,
	                        			isChildren:true,
	                        			count:item.respond.length,
		                        		serviceName:(r.msgs[0].msg.ex || {}).service_name || '',
										txHash: r.tx_hash,
										blockHeight: r.height,
										txType: r.type,
										provider:r.msgs[0].msg.provider,
										time: Tools.getDisplayDate(r.time),
										requestContextId:(r.msgs[0].msg.ex || {}).request_context_id,
										requestStatus:'--',
										status:r.status,
	                        		};
	                        		this.consumerTxList.push(respondResult);
	                        	});	 
	                        }
                        }
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

			},
			consumerTxPageChange(pageNum) {
				this.consumerTxPageNum = pageNum;
				this.getConsumerTxList()
			},
			//响应记录
			async getRspondRecordList(){
			    try {
                    const res = await getRespondServiceRecord('',this.$route.params.param, this.respondRecordPageNum, this.respondRecordPageSize);
                    if(res){
                        // console.log('RspondRecordList======:',res);
                        this.respondRecordCount = res.count;
                        this.respondRecordList = res.data || [];
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

			},
			respondRecordPageChange(pageNum) {
				this.respondRecordPageNum = pageNum;
				this.getRspondRecordList()
			},
			//服务调用-提供者
			async getProviderTxList(){
			    try {
                    const res = await getRespondServiceWithAddress(this.$route.params.param, 1, 1000);
                    if(res){
                        // console.log('ProviderTxList======:',res);
                        this.providerTxList = [];
                        for(let item of res.data){
                        	let result = {
                            	serviceName:(item.msgs[0].msg.ex || {}).service_name,
                            	provider:item.msgs[0].msg.provider,
                            	owner:item.msgs[0].msg.owner,
                                respond_times:item.respond_times,
                                pricing:JSON.parse(item.msgs[0].msg.pricing || '{}').price,
                                qos:item.msgs[0].msg.qos,
                                time: Tools.getDisplayDate(item.time),
                                unbindTime:item.unbinding_time ? Tools.getDisplayDate(item.unbinding_time) : '--',
                                txHash: item.tx_hash,
                                blockHeight: item.height,
                                txType: item.type,
                                status:item.status,
                            };
                            if (item.msgs[0].msg.deposit && item.msgs[0].msg.deposit.length) {
                                result.deposit = `${item.msgs[0].msg.deposit[0].amount} ${item.msgs[0].msg.deposit[0].denom}`;
                            }
                            let bindings = await getServiceBindingByServiceName(result.serviceName);
                            (bindings.result || []).forEach((bind)=>{
                                if(result.provider === bind.provider && result.owner == bind.owner){
                                    result.isAvailable = bind.available;
                                    result.pricing = JSON.parse(bind.pricing || '{}').price;
                                    result.qos = bind.qos;
                                    if (bind.disabled_time) {
                                    	let time = new Date(bind.disabled_time).getTime();
                                    	result.unbindTime = time>0 ? Tools.getDisplayDate(time/1000) : '--';
                                    }
                                }
                            })
                            if (result.pricing && result.pricing.length) {
                            	result.pricing = result.pricing.replace('point',' point');
                            }
                            this.providerTxList.push(result);
                        }
                    }
                }catch (e) {
                	console.error(e);
                    this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }

			},
			formatTxHash(TxHash){
				if(TxHash){
					return Tools.formatTxHash(TxHash)
				}else{
					return '--';
				}
			},
			formatAddress(address){
				return Tools.formatValidatorAddress(address) || '--';
			},
			getCallProviders(providers){
                if (providers && providers.length>2) {
                    return providers.slice(0, 2);
                }
                return providers;
            },
            getBgColorWithState(state){
            	let bgColor = '';
            	switch(state){
            		case 'running': bgColor = '#B1E96E'; break;
            		case 'completed': bgColor = '#FFC456'; break;
            		case 'paused': bgColor = '#E96E6E'; break;
            	}
            	return bgColor;
            },
            arraySpanMethod(table){
            	if (table.columnIndex === 0) {
            		if (table.row.isChildren) {
			          	if (table.row.index==0) {
			          		return {
				              rowspan: table.row.count,
				              colspan: 1
				            };
			          	}else{
			          		return {
				              rowspan: 0,
				              colspan: 0
				            };
			          	}
			        }else{
			          	return {
			              rowspan: 1,
			              colspan: 1
			            };
			        }
		        }

            },
            getRespondCount(count){
            	return this.$t('ExplorerLang.unit.totalRespond').replace(/\$\{\%value\%\}/, count);
            },
            handleSearchClick(){
            	this.type = this.type_temp;
            	this.status = this.status_temp;
                this.pageNum = 1;
                this.getTxByAddress();
            },
            resetFilterCondition(){
                this.type = '';
				this.status = '';
                this.pageNum = 1;
                this.getTxByAddress();
            },
            async getAllTxType(){
                try {
                    const res = await getAllTxTypes();
                    res.data.forEach((type) =>{
                        this.txTypeOption.push({
                            value : type.typeName,
                            item : type.typeName,
                        });
                    });
                } catch (e) {
                    console.error(e);
                    // this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
                }
			},
			async getAddressInformation(){
				// const { data:res } = await axios.get(`https://www.irisplorer.io/api/account/${this.$route.params.param}`)
				try {
					let res = await getAddressInformationApi(this.$route.params.param)
					// console.log(res)
					if(res){
						let arrayIndexOneData;
						// 后续调整这里的代码
						if(res.amount){
							res.amount.forEach( item => {
								if(item.denom === 'uiris'){
									arrayIndexOneData = item
								}
							});
							res.amount.unshift(arrayIndexOneData);
							res.amount = Array.from(new Set(res.amount));
							this.assetList = res.amount;
						}
						this.validatorMoniker = res.moniker ? res.moniker : '--';
						// 接口没有返回数据
						this.OperatorAddress = res.operator_address ? res.operator_address : '--';
						this.validatorStatus = res.status;
						// 接口没有返回数据
						this.withdrewToAddress = res.withdrawAddress ? res.withdrawAddress : '--';
						this.isProfiler = res.isProfiler;
						this.getAssetList()
					}
				}catch (e) {
					console.error(e)
				}

                // Server.commonInterface({addressInformation:{
		        //         address:this.$route.params.param
                //     }},(res) => {
                // 	try {
                //         if(res){
                //         	let arrayIndexOneData;
                //         	if(res.amount){
                //                 res.amount.forEach( item => {
                //                     if(item.denom === 'iris-atto'){
                //                         arrayIndexOneData = item
                //                     }
                //                 });
                //                 res.amount.unshift(arrayIndexOneData);
                //                 res.amount = Array.from(new Set(res.amount));
                //                 this.assetList = res.amount;
                //             }
	            //             this.validatorMoniker = res.moniker ? res.moniker : '--';
	            //             this.OperatorAddress = res.operator_address ? res.operator_address : '--';
	            //             this.validatorStatus = res.status;
	            //             this.withdrewToAddress = res.withdrawAddress ? res.withdrawAddress : '--';
	            //             this.isProfiler = res.isProfiler;
	            //             this.getAssetList()
                //         }
	            //     }catch (e) {
                //         console.error(e)
	            //     }
                // })
            },
            getAssetList(){
                this.assetsItems = this.assetList.map( item => {
	            	if(item.denom === 'uiris'){
			            return {
				            token: Tools.formatDenom(item.denom),
				            balance: item.amount ? Tools.formatAmount2(item,this.fixedNumber): 0,
                            balanceNumber: item.amount,
				            delegatedValue: this.totalDelegator ? this.totalDelegator : 0,
				            delegated: this.totalDelegator ? `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalDelegator.toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}`: 0,
				            unBondingValue: this.totalUnBondingDelegator ? this.totalUnBondingDelegator : 0,
				            unBonding: this.totalUnBondingDelegator ?`${new BigNumber(Tools.formatStringToFixedNumber(moveDecimal(this.totalUnBondingDelegator.toString(),-2),this.fixedNumber)).toFormat()} ${Constant.Denom.IRIS.toUpperCase()}`  : 0,
				            reward: this.allRewardsValue ? this.allRewardsValue : 0,
                            rewards:this.allRewardsValue ? this.allRewardsValue : 0,
				            totalAmount:`${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal((Number(Tools.formatStringToFixedNumber(Tools.numberMoveDecimal(item.amount.toString(),-18),this.fixedNumber))*100 +
					            Number(Tools.formatStringToFixedNumber(this.totalDelegator.toString(),this.fixedNumber)) +
					            Number(Tools.formatStringToFixedNumber(this.totalUnBondingDelegator.toString(),this.fixedNumber))+
					            Number(Tools.formatStringToFixedNumber(this.allRewardsAmountValue.toString(),this.fixedNumber)) * 100).toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}` ,
			            }
                    }else {
			            return {
				            token: item.denom,
				            balance: item.amount ? `${new BigNumber(item.amount).toFormat()} ${item.denom.toUpperCase()}`: 0,
				            delegated: 0,
				            unBonding: 0,
				            reward: 0,
				            totalAmount: item.amount ? `${new BigNumber(item.amount).toFormat()} ${item.denom.toUpperCase()}`: 0
			            }
                    }
                });
			},
			pageNation(dataArray){
	            let index = 0;
	        	let newArray  = [];
	        	if(dataArray.length > this.pageSize){
			        while(index < dataArray.length) {
				        newArray.push(dataArray.slice(index, index += this.pageSize));
			        }
                }else {
			        newArray = dataArray
                }
	            return newArray
            },
			async getDelegationList(){	
				try {
					const {data:res} = await getDelegationListApi(this.$route.params.param)
					if(res && res.length > 0){
						let copyResult = JSON.parse(JSON.stringify(res));
						this.delegationPageNationArrayData = this.pageNation(copyResult);
						if(res.length > this.pageSize){
							this.flDelegationNextPage = true;
						}else {
							this.flDelegationNextPage = false;
						}
						this.delegationCountNum = res.length;
						this.delegationPageChange(this.delegationCurrentPage);
						if(res.length > 0){
							res.forEach( item => {
								if(item.amount && item.amount.amount){
									if(item.amount.amount.toString().indexOf('.') !== -1){
										let splitNumber = item.amount.amount.toString().split('.')[1].substr(0,2);
										item.amount.amount =  Number(`${item.amount.amount.toString().split('.')[0]}.${splitNumber}`) * 100
									}else {
										item.amount.amount = item.amount.amount * 100
									}
								}
							});
							this.totalDelegator = res.reduce( (total,item) => {
								return Number(item.amount.amount) + Number(total)
							},0)
						}
						this.totalDelegatorValue = `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalDelegator.toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}`
					}else {
						this.delegationsItems = []
					}
				}catch (e) {
					console.error(e)
				}
            },
            async getUnBondingDelegationList(){
				const {data:res} = await getUnBondingDelegationListApi(this.$route.params.param)
				console.log(res,2222222)
				// const { data:res } =  await axios.get(`https://www.irisplorer.io/api/account/${this.$route.params.param}/unbonding_delegations`)
				try {
					if(res && res.length > 0){
						let copyResult = JSON.parse(JSON.stringify(res));
						this.unBondingDelegationPageNationArrayData = this.pageNation(copyResult);
						if(res.length > this.pageSize){
							this.flUnBondingDelegationNextPage = true
						}else {
							this.flUnBondingDelegationNextPage = false
						}
						this.unBondingDelegationCountNum = res.length;
						this.unBondingDelegationPageChange(this.unBondingDelegationCurrentPage);
						if(res.length > 0){
							res.forEach( item => {
								if(item.amount && item.amount.amount){
									if(item.amount.denom == Config.unit.minUnit ){
										item.amount.amount = Number(item.amount.amount) / Config.unit.conversionRatio
									} else if (item.amount.denom == Config.unit.maxUnit) {
										item.amount.amount = item.amount.amount
									}
									// if(item.amount.amount.toString().indexOf('.') !== -1){
									// 	let splitNumber = item.amount.amount.toString().split('.')[1].substr(0,2);
									// 	item.amount.amount =  Number(`${item.amount.amount.toString().split('.')[0]}.${splitNumber}`) * 100
									// }else {
									// 	item.amount.amount = item.amount.amount * 100
									// }
								}
							});
							this.totalUnBondingDelegator = res.reduce( (total,item) => {
								return Number(item.amount.amount) + Number(total)
							},0)
						}
						this.totalUnBondingDelegatorValue = `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalUnBondingDelegator.toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}`
					}
				}catch (e) {
					console.error(e)
				}

				// Server.commonInterface({unDelegationList:{
	            // 	address: this.$route.params.param
                //     }},(res) => {
		        //     try {
		        //     	if(res && res.length > 0){
		        //     		let copyResult = JSON.parse(JSON.stringify(res));
				//             this.unBondingDelegationPageNationArrayData = this.pageNation(copyResult);
				//             if(res.length > this.pageSize){
				// 	            this.flUnBondingDelegationNextPage = true
				//             }else {
				// 	            this.flUnBondingDelegationNextPage = false
				//             }
				//             this.unBondingDelegationCountNum = res.length;
                //             this.unBondingDelegationPageChange(this.unBondingDelegationCurrentPage);
		        //     		if(res.length > 0){
                //                 res.forEach( item => {
                //                     if(item.amount && item.amount.amount){
                //                         if(item.amount.amount.toString().indexOf('.') !== -1){
                //                             let splitNumber = item.amount.amount.toString().split('.')[1].substr(0,2);
                //                             item.amount.amount =  Number(`${item.amount.amount.toString().split('.')[0]}.${splitNumber}`) * 100
                //                         }else {
                //                             item.amount.amount = item.amount.amount * 100
                //                         }
                //                     }
                //                 });
				// 	            this.totalUnBondingDelegator = res.reduce( (total,item) => {
				// 		            return Number(item.amount.amount) + Number(total)
				// 	            },0)
                //             }
				//             this.totalUnBondingDelegatorValue = `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalUnBondingDelegator.toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}`
                //         }
		        //     }catch (e) {
			    //         console.error(e)
		        //     }
	            // })
            },
            async getRewardsItems(){
				const { data:res } = await axios.get(`https://www.irisplorer.io/api/account/${this.$route.params.param}/rewards`)
				try {
					if(res && res.delagations_rewards && res.delagations_rewards.length > 0) {
						res.delagations_rewards.map( item => {
							if(item.amount.length === 0){
								item.amount.push({
									amount:0,
									denom:'iris-atto'
								})
							}
						});
						let copyResult = JSON.parse(JSON.stringify(res));
						this.totalValidatorRewards = res.commission_rewards ? Tools.formatAmount2(res.commission_rewards,this.fixedNumber) : 0;
						this.allRewardsValue = res.total_rewards ? Tools.formatAmount2(res.total_rewards,this.fixedNumber) : 0;
						this.rewardsDelegationPageNationArrayData = this.pageNation(copyResult.delagations_rewards);
						if(res.delagations_rewards.length > this.pageSize){
							this.flRewardsDelegationNextPage = true
						}else {
							this.flRewardsDelegationNextPage = false
						}
						this.rewardsDelegationCountNum = res.delagations_rewards.length;
						this.rewardsDelegationPageChange(this.rewardsDelegationCurrentPage);
						if(res.delagations_rewards.length > 0){
							res.delagations_rewards.forEach( item => {
								if(item.amount && item.amount.length > 0){
									item.amount[0].amount = (Tools.formatStringToFixedNumber(Tools.numberMoveDecimal(item.amount[0].amount,-18),this.fixedNumber)) * 100
								}
							})
							this.totalDelegatorReward = res.delagations_rewards.reduce( (total,item) => {
								return Number(item.amount[0].amount) + Number(total)
							},0);
						}
						this.allRewardsAmountValue = res.total_rewards ? Tools.formatStringToFixedNumber(Tools.numberMoveDecimal(res.total_rewards[0].amount,-18),this.fixedNumber) : 0;
						this.totalDelegatorRewardValue = `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalDelegatorReward.toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}`
						this.getAssetList()
					}
				}catch (e) {
					console.error(e)
				}
				// Server.commonInterface({rewardList:{
	            // 	address: this.$route.params.param
                //     }},(res) => {
		        //     try {
		        //     	if(res && res.delagations_rewards && res.delagations_rewards.length > 0) {
                //             res.delagations_rewards.map( item => {
				//             	if(item.amount.length === 0){
				// 		            item.amount.push({
				// 			            amount:0,
                //                         denom:'iris-atto'
                //                     })
                //                 }
                //             });
                //             let copyResult = JSON.parse(JSON.stringify(res));
				//             this.totalValidatorRewards = res.commission_rewards ? Tools.formatAmount2(res.commission_rewards,this.fixedNumber) : 0;
		        //     		this.allRewardsValue = res.total_rewards ? Tools.formatAmount2(res.total_rewards,this.fixedNumber) : 0;
				//             this.rewardsDelegationPageNationArrayData = this.pageNation(copyResult.delagations_rewards);
				//             if(res.delagations_rewards.length > this.pageSize){
				// 	            this.flRewardsDelegationNextPage = true
				//             }else {
				// 	            this.flRewardsDelegationNextPage = false
				//             }
                //             this.rewardsDelegationCountNum = res.delagations_rewards.length;
				//             this.rewardsDelegationPageChange(this.rewardsDelegationCurrentPage);
                //             if(res.delagations_rewards.length > 0){
                //                 res.delagations_rewards.forEach( item => {
                //                     if(item.amount && item.amount.length > 0){
                //                         item.amount[0].amount = (Tools.formatStringToFixedNumber(Tools.numberMoveDecimal(item.amount[0].amount,-18),this.fixedNumber)) * 100
                //                     }
                //                 })
                //                 this.totalDelegatorReward = res.delagations_rewards.reduce( (total,item) => {
                //                     return Number(item.amount[0].amount) + Number(total)
                //                 },0);
                //             }
                //             this.allRewardsAmountValue = res.total_rewards ? Tools.formatStringToFixedNumber(Tools.numberMoveDecimal(res.total_rewards[0].amount,-18),this.fixedNumber) : 0;
                //             this.totalDelegatorRewardValue = `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalDelegatorReward.toString(),-2)).toFormat(),this.fixedNumber)} ${Constant.Denom.IRIS.toUpperCase()}`
                //             this.getAssetList()
			    //         }
		        //     }catch (e) {
			    //         console.error(e)
		        //     }
	            // })
			},
	        delegationPageChange(pageNum){
		        pageNum = pageNum - 1
	        	if(this.flDelegationNextPage){
			        this.delegationsItems = this.delegationPageNationArrayData[pageNum].map(item => {
				        return {
					        address: item.address,
					        amount: `${new BigNumber(Tools.formatStringToFixedNumber(item.amount.amount.toString(),this.fixedNumber)).toFormat()} ${item.amount.denom.toUpperCase()}`,
					        shares: new BigNumber((Number(item.shares)).toFixed(2)).toFormat(),
					        block: item.height,
					        moniker: item.moniker
				        }
			        });
                }else {
			        this.delegationsItems = this.delegationPageNationArrayData.map(item => {
				        return {
					        address: item.address,
					        amount: `${new BigNumber(Tools.formatStringToFixedNumber(item.amount.amount.toString(),this.fixedNumber)).toFormat()} ${item.amount.denom.toUpperCase()}`,
					        shares: new BigNumber((Number(item.shares)).toFixed(2)).toFormat(),
					        block: item.height,
					        moniker: item.moniker
				        }
			        });
                }
            },
			unBondingDelegationPageChange(pageNum){
		        pageNum = pageNum - 1;
		        if(this.flUnBondingDelegationNextPage){
			        this.unBondingDelegationsItems = this.unBondingDelegationPageNationArrayData[pageNum].map( item =>{
						console.log(item,1111)
						return {
					        address: item.address,
					        amount: `${new BigNumber(Tools.formatStringToFixedNumber(item.amount.amount.toString(),this.fixedNumber)).toFormat()} ${Config.unit.maxUnit.toUpperCase()}`,
					        block: item.height,
					        endTime: Tools.format2UTC(item.end_time),
					        moniker: item.moniker
				        }
			        });
                }else {
			        this.unBondingDelegationsItems = this.unBondingDelegationPageNationArrayData.map( item =>{
						console.log(item,1111)
						return {
					        address: item.address,
					        amount: `${new BigNumber(Tools.formatStringToFixedNumber(item.amount.amount.toString(),this.fixedNumber)).toFormat()} ${Config.unit.maxUnit.toUpperCase()}`,
					        block: item.height,
					        endTime: Tools.format2UTC(item.end_time),
					        moniker: item.moniker
				        }
			        });
                }
            },
	        rewardsDelegationPageChange(pageNum){
		        pageNum = pageNum - 1;
	        	if(this.flRewardsDelegationNextPage){
			        this.rewardsItems = this.rewardsDelegationPageNationArrayData[pageNum].map( item => {
				        return {
					        address: item.address,
					        amount: Tools.formatAmount2(item.amount,this.fixedNumber),
					        moniker: item.moniker
				        }
			        });
                }else {
			        this.rewardsItems = this.rewardsDelegationPageNationArrayData.map( item => {
				        return {
					        address: item.address,
					        amount: item.amount && item.amount.length > 0 ? Tools.formatAmount2(item.amount,this.fixedNumber) : 0,
					        moniker: item.moniker
				        }
			        });
                }

            },
			formatAddress(address) {
		        return Tools.formatValidatorAddress(address);
	        },
	        formatTxHash(TxHash){
		        if(TxHash){
			        return Tools.formatTxHash(TxHash)
		        }
	        },
	        formatMoniker(moniker) {
		        if (!moniker) {
			        return "";
		        }
		        return Tools.formatString(moniker, 15, "...");
	        },
		}
	}
</script>

<style scoped lang="scss">
	a{
		color: $t_link_c !important;
	}
	.address_container_content{
		padding:0 0.15rem;
		.address_content_wrap{
			max-width: 12rem;
			margin: 0 auto;
			.address_content_title {
		        display: flex;
		        justify-content: flex-start;
		        color: $t_first_c;
		        font-size: $s18;
		        line-height: 0.21rem;
		        margin: 0.3rem 0 0.15rem 0.25rem;
		        text-align: left;
		        font-family:PingFangSC-Semibold,PingFang SC;
		        font-weight:600;
		        .address_content_title_first{
		            white-space: nowrap;
		            margin-right:0.05rem;
		        }
		        .address_content_title_address{
		            font-size: $s16;
		            font-family:ArialMT;
		            font-weight:400;
		            color: $t_first_c;
		            line-height:20px;
		            word-break: break-all;
		        }
		    }
			.address_asset_content{
				background: $bg_white_c;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid $bd_first_c;
			}

			.consumer_transaction_content{
				margin-top: 0.48rem;
				background: $bg_white_c;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid $bd_first_c;
				.consumer_transaction_content_hash{
					display: flex;
                    align-items: center;
				}
				.consumer_transaction_content_available{
					display: flex;
                    align-items: center;
                    .consumer_transaction_content_available_icon{
                    	width:0.1rem;
                    	height:0.1rem;
                    	border-radius:50%;
                    	margin-right:0.1rem;
                    }
				}
				.pagination_content{
					margin: 0.2rem 0 0.2rem 0;
					display: flex;
					justify-content: flex-end;
				}
			}
			.provider_transaction_content{
				margin-top: 0.48rem;
				background: $bg_white_c;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid $bd_first_c;
				.respond_transaction_content_hash{
					display: flex;
                    align-items: center;
				}
				.provider_transaction_content_available{
					display: flex;
                    align-items: center;
                    .provider_transaction_content_available_icon{
                    	width:0.1rem;
                    	height:0.1rem;
                    	border-radius:50%;
                    	margin-right:0.1rem;
                    }
				}
				.pagination_content{
					margin: 0.2rem 0 0.2rem 0;
					display: flex;
					justify-content: flex-end;
				}
			}

			.address_transaction_content{
				margin-top: 0.48rem;
				background: $bg_white_c;
				padding:0.25rem;
				border-radius:0.05rem;
				border:1px solid $bd_first_c;
				.address_transaction_content_hash{
					display: flex;
                    align-items: center;
				}
				.address_transaction_condition_container {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 0.4rem;
                    align-items: center;
                    .address_transaction_condition_count {
                        font-size: $s14;
                        margin-right: 0.42rem;
                        font-weight: 600;
                    }
                    /deep/ .el-select {
                        width: 1.3rem;
                        margin-right: 0.22rem;
                        .el-input {
                            .el-input__inner {
                                padding-left: 0.07rem;
                                height: 0.32rem;
                                font-size: $s14 !important;
                                line-height: 0.32rem;
                                &::-webkit-input-placeholder {
                                    font-size: $s14 !important;
                                }
                            }
                            .el-input__inner:focus {
                                border-color: $theme_c !important;
                            }
                            .el-input__suffix {
                                .el-input__suffix-inner {
                                    .el-input__icon {
                                        line-height: 0.32rem;
                                    }
                                }
                            }
                        }
                        .is-focus {
                            .el-input__inner {
                                border-color: $theme_c !important;
                            }
                        }

                    }
                    .search_btn {
                        cursor: pointer;
                        background: $bg_button_c;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        padding: 0.05rem 0.18rem;
                        font-size: $s14;
                        line-height: 0.2rem;
                    }
                    .address_transaction_condition_action{
                    	display:flex;
                    	.reset_btn {
	                        background: $bg_button_c;
	                        color: $t_button_c;
	                        border-radius: 0.04rem;
	                        margin-left: 0.1rem;
	                        cursor: pointer;
	                        i {
	                            padding: 0.08rem;
	                            font-size: $s14;
	                            line-height: 1;
	                            display: inline-block;
	                        }
	                    }
                    }
                    
                }
                .pagination_content{
					margin: 0.2rem 0 0.2rem 0;
					display: flex;
					justify-content: flex-end;
				}
			}
			
			.content_title{
				color: $t_first_c;
				margin-bottom: 0.4rem;
				text-align: left;
				font-size: $s16;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				line-height:22px;
			}

			.status_icon{
                width:0.13rem;
                height:0.13rem;
                margin-right:0.05rem;
			}
			
			.delegations_wrap {
				margin: 0 auto;
				.delegations_container {
					display: flex;
					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size: 0.18rem;
						margin-top: 0.3rem;
						padding-left: 0.2rem;
						margin-bottom: 0.2rem !important;
						text-align: left;
						.address_information_delegation_value,
						.address_information_unbonding_delegation_value{
                            font-size: 0.14rem;
                            color: $t_second_c;
                            line-height: 0.16rem;
                            margin-left: 0.15rem;
						}
					}
					.one_table_container {
						width: calc(50% - 0.1rem);
					}
					.second_table_container {
						margin-left: 0.2rem;
						width: calc(50% - 0.1rem);
					}
					.delegations_table_container {
						overflow-x: auto;
						// border: 0.01rem solid #e7e9eb;
						border-radius: 0.05rem;
   						border: 1px solid #D7D7D7;
						min-height: 2.34rem;
						background: #fff;
						/deep/ .el-table__header thead tr {
							border-left: 1px solid #dee2e6;
							border-right: 1px solid #dee2e6;
							height: 50px;
						}
						/deep/ .el-table__header .has-gutter .cell {
							color: $t_second_c !important;
							font-family: Arial, Helvetica, sans-serif;
							font-weight: 400;
						}
						/deep/ .el-table__body-wrapper .el-table__row .cell {
							font-family: Arial, Helvetica, sans-serif;
							color: $t_first_c !important;
						}
						/deep/ .el-table th.is-leaf {
							border-bottom: 0.01rem solid $theme_c !important;
						}
				    }
				}
				.common_pagination_content {
					margin-top: 0.2rem;
					float: right;
				}
			}

			.address_information_redelegation_header_title{
				text-align: left;
                font-size: 0.18rem;
                color: #171D44;
                line-height: 0.21rem;
                margin: 0.27rem 0 0 0.2rem;
                .address_information_redelegation_rewards_value{
                    font-size: 0.14rem;
                    color: #787C99;
                    line-height: 0.16rem;
                    margin-left: 0.15rem;
                }
			}
			
			.address_information_redelegation_tx_container{
				text-align: left;
				display: flex;
				.address_information_delegator_rewards_content{
					width: calc(50% - 0.1rem);
                    margin-right: 0.2rem;
                    .address_information_detail_option{
                        padding: 0 0 0.1rem 0.2rem;
                        .address_information_detail_option_name{
                            font-size: 0.14rem;
                            color: #787C99;
                            margin-right: 0.1rem;
                        }
                        .address_information_detail_option_value{
                            font-size: 0.14rem;
                            a{
                                color: $theme_c !important;
                            }
                        }
                    }
                    .address_information_list_content{
                        overflow-x: auto;
						box-sizing: border-box;
						border-radius: 0.05rem;
   						border: 1px solid #D7D7D7;
						min-height: 2.34rem;
						background: #fff;
						/deep/ .el-table__header thead tr {
							border-left: 1px solid #dee2e6;
							border-right: 1px solid #dee2e6;
							height: 50px;
						}
						/deep/ .el-table__header .has-gutter .cell {
							color: $t_second_c !important;
							font-family: Arial, Helvetica, sans-serif;
							font-weight: 400;
						}
						/deep/ .el-table__body-wrapper .el-table__row .cell {
							font-family: Arial, Helvetica, sans-serif;
							color: $t_first_c !important;
						}
						/deep/ .el-table th.is-leaf {
							border-bottom: 0.01rem solid $theme_c !important;
						}
                    }
                    .pagination_content{
                        margin-top: 0.2rem;
                        display: flex;
                        justify-content: flex-end;
                    }
                }
                .address_information_detail_container{
					width: calc(50% - 0.1rem);
                    .address_information_redelegation_title{
						width: 100%;
                        font-size: 0.18rem;
                        color: #171D44;
                        padding: 0 0 0.06rem 0.2rem;
                        .address_information_validator_rewards_value{
                            font-size: 0.14rem;
                            color: #787C99;
                            line-height: 0.16rem;
                            margin-left: 0.15rem;
                        }
                    }
                    .address_information_detail_content{
						border: 1px solid #D7D7D7;
						border-radius: 0.05rem;
                        background: #fff;
                        box-sizing: border-box;
                        padding: 0.2rem;
                        min-height: 2.34rem;
                        .address_information_detail_option{
                            display: flex;
                            align-items: center;
                            .address_information_detail_option_name{
                                width: 1.3rem;
                                font-size: 0.14rem;
                                color: #787c99;
                                line-height: 0.16rem;
                                margin-right: 0.3rem;
                            }
                            .address_information_detail_option_value{
                                font-size: 0.14rem;
                                color: #171D44;
                                margin-right: 0.1rem;
                                a{
                                    color: $theme_c !important;
                                }
                            }
                            .address_information_address_status_active{
                                background: $theme_c;
                                font-size: 0.12rem;
                                color: #fff;
                                padding: 0.02rem 0.14rem;
                                border-radius: 0.22rem;
                                margin-right: 0.1rem;
                            }
                            .address_information_address_status_candidate{
                                background: #3DA87E;
                                font-size: 0.12rem;
                                color: #fff;
                                padding: 0.02rem 0.14rem;
                                border-radius: 0.22rem;
                                margin-right: 0.1rem;
                            }
                            .address_information_address_status_jailed{
                                background: #FA7373;
                                font-size: 0.12rem;
                                color: #fff;
                                padding: 0.02rem 0.14rem;
                                border-radius: 0.22rem;
                                margin-right: 0.1rem;
                            }
                        }

                    }
                }
            }
		}
	}

	@media screen and (max-width: 1280px) {
		.address_container_content{
			.address_content_wrap{
				.address_content_title {
			        .address_content_title_first{
			        }
			        .address_content_title_address{
			        }
			    }
				.address_asset_content{
				}
				.consumer_transaction_content{
					.consumer_transaction_content_hash{
					}
					.consumer_transaction_content_available{
	                    .consumer_transaction_content_available_icon{
	                    }
					}
					.pagination_content{
					}
				}
				.provider_transaction_content{
					.respond_transaction_content_hash{
					}
					.provider_transaction_content_available{
	                    .provider_transaction_content_available_icon{
	                    }
					}
					.pagination_content{
					}
				}

				.address_transaction_content{
					.address_transaction_content_hash{
					}
					.address_transaction_condition_container {
	                    .address_transaction_condition_count {
	                    }
	                    /deep/ .el-select {
	                        .el-input {
	                            .el-input__inner {
	                            }
	                            .el-input__inner:focus {
	                            }
	                            .el-input__suffix {
	                                .el-input__suffix-inner {
	                                    .el-input__icon {
	                                    }
	                                }
	                            }
	                        }
	                        .is-focus {
	                            .el-input__inner {
	                            }
	                        }
	                    }
	                    .search_btn {
	                    }
	                    .reset_btn {
	                        i {
	                        }
	                    }
	                }
	                .pagination_content{
					}
				}
				.content_title{
				}
				.status_icon{
				}
				
				.delegations_wrap {
					.delegations_container {
						display: block;
						// margin-left: 0.2rem;
						.validator_information_content_title {
							padding-left:0.05rem;
						}
						.one_table_container {
							width: 100%;
						}
						.second_table_container {
							width: 100%;
							margin-left: 0rem;
						}
						.delegations_table_container {
						}
						.common_pagination_content {
						}
					}
				}

				.address_information_redelegation_header_title{
                    margin-left: 0.1rem;
				}
				
				.address_information_redelegation_tx_container{
                    flex-direction: column;
                    margin: 0 0.1rem;
                    .address_information_delegator_rewards_content{
						width: 100%;
                        margin-right: 0;
                        .address_information_detail_option{
                            padding-left: 0;
                            display: flex;
                            flex-direction: column;
                        }
                        .address_information_list_content{
                            overflow-x: auto;
                        }
                    }
                    .address_information_detail_container{
						width: 100%;
                        .address_information_redelegation_title{
                            padding: 0.2rem 0;
                        }
                        .address_information_detail_content{
                            .address_information_detail_option{
                                display: flex;
                                align-items: flex-start;
                                flex-direction: column;
                                .validator_status_content{
                                    display: flex;
                                    margin: 0.05rem 0;
                                }
                                .address_information_detail_option_value{
                                }
                            }
                        }
                    }
                    .hide_style{
                        display: none;
                    }
                }
			}
		}
	}

	@media screen and (max-width: 768px) {
		.address_container_content{
			.address_content_wrap{
				.address_content_title {
			        .address_content_title_first{
			        }
			        .address_content_title_address{
			        }
			    }
				.address_asset_content{
				}
				.consumer_transaction_content{
					.consumer_transaction_content_hash{
					}
					.consumer_transaction_content_available{
	                    .consumer_transaction_content_available_icon{
	                    }
					}
					.pagination_content{
					}
				}
				.provider_transaction_content{
					.respond_transaction_content_hash{
					}
					.provider_transaction_content_available{
	                    .provider_transaction_content_available_icon{
	                    }
					}
					.pagination_content{
					}
				}

				.address_transaction_content{
					.address_transaction_content_hash{
					}
					.address_transaction_condition_container {
						flex-direction:column;
                        align-items: flex-start;
	                    .address_transaction_condition_count {
	                    	margin-bottom:0.1rem;
	                    }
	                    /deep/ .el-select {
	                    	width: 100%;
                            margin-bottom: 0.1rem;
	                        .el-input {
	                            .el-input__inner {
	                            }
	                            .el-input__inner:focus {
	                            }
	                            .el-input__suffix {
	                                .el-input__suffix-inner {
	                                    .el-input__icon {
	                                    }
	                                }
	                            }
	                        }
	                        .is-focus {
	                            .el-input__inner {
	                            }
	                        }
	                    }
	                    .search_btn {
	                    }
	                    .reset_btn {
	                        i {
	                        }
	                    }
	                }
	                .pagination_content{
					}
				}
				.content_title{
				}
				.status_icon{
	            }
			}
		}
	}
</style>
