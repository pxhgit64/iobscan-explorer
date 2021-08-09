<template>
	<div class="address_container_content">
		<div class="address_content_wrap">
			<div class="address_content_title">
				<div class="address_content_title_first">{{`${$t('ExplorerLang.addressDetail.addressDetail')} |`}}</div>
				<div class="address_content_title_address">{{address}}</div>
			</div>
			<div class="address_tab_container">
				<div class="address_tab_content">
					<div class="address_tab_item"
						 :key="index"
					     v-for="(item,index) in tabList"
					     :class="item.isActive ? 'active_content' : ''" @click="selectOptions(index)">
						<span>{{item.label}}</span>
					</div>
				</div>
			</div>
			<div class="address_content" v-if="moduleSupport('103', prodConfig.navFuncList)" v-show="isNftInfo">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.assets')}}</div>
				<el-table class="table" :data="assetArray" row-key="nft_id" :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.denom" :label="$t('ExplorerLang.table.denom')"  prop="denomName"></el-table-column>
					<el-table-column :min-width="ColumnMinWidth.tokenId" :label="$t('ExplorerLang.table.tokenName')" >
						<template slot-scope="scope">
							<el-tooltip
										:content="scope.row.nftName"
										placement="top"
										effect="dark"
										:disabled="Tools.disabled(scope.row.nftName)">
								<router-link v-if="formatAddress(scope.row.nftName) != '--'" :to="`/nft/token?denom=${scope.row.denomId}&&tokenId=${scope.row.id}`">{{formatAddress(scope.row.nftName)}}</router-link>
								<span v-else>{{'--'}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.tokenId" :label="$t('ExplorerLang.table.tokenId')" >
						<template slot-scope="scope">
							<el-tooltip
										:content="scope.row.id"
										placement="top"
										effect="dark"
										:disabled="Tools.disabled(scope.row.id)">
								<router-link :to="`/nft/token?denom=${scope.row.denomId}&&tokenId=${scope.row.id}`">{{formatAddress(scope.row.id)}}</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :width="ColumnMinWidth.schema" :label="$t('ExplorerLang.table.data')" prop="tokenData">
						<template slot-scope="scope">
							<LargeString :isShowPre="Tools.isJSON(scope.row.tokenData)" :key="scope.row.nftName + scope.row.id + nftKey" v-if="scope.row.tokenData" :text="scope.row.tokenData" mode="cell" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.URI" :label="$t('ExplorerLang.table.uri')"
					                 prop="tokenUri">
						<template slot-scope="scope">
							<a v-if="scope.row.tokenUri" :download="scope.row.tokenUri" :href="scope.row.tokenUri"
							   target="_blank">{{scope.row.tokenUri}}</a>
							<span v-else>--</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination_content" v-show="assetCount > assetPageSize">
					<m-pagination :page-size="assetPageSize"
					              :total="assetCount"
					              :page="assetPageNum"
					              :page-change="assetPageChange">
					</m-pagination>
				</div>
			</div>
			<div class="address_content" v-if="moduleSupport('106', prodConfig.navFuncList)" v-show="isIdentity">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.identities')}}</div>
				<el-table class="table" :data="identityList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.identity" :label="$t('ExplorerLang.table.identity')">
						<template slot-scope="scope">
							<router-link :to="`/identity/${scope.row.id}`">{{scope.row.id}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.txHash" :label="$t('ExplorerLang.table.txHash')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.txHash"
							            placement="top"
							            :disabled="!Tools.isValid(scope.row.txHash)">
								<router-link :to="`/tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}
								</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')"
					                 prop="time">
						<template slot-scope="scope">
							<span>{{scope.row.time}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination_content" v-show="identityCount > identityPageSize">
					<m-pagination :page-size="identityPageSize"
					              :total="identityCount"
					              :page="identityPageNum"
					              :page-change="identityPageChange">
					</m-pagination>
				</div>
			</div>
			<div class="consumer_transaction_content" v-if="moduleSupport('105', prodConfig.navFuncList)" v-show="isIservice">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.consumerTitle')}}</div>
				<el-table class="table" :data="consumerTxList"
				          row-key="txHash"
				          :empty-text="$t('ExplorerLang.table.emptyDescription')"
				          :span-method="arraySpanMethod"
				>
					<el-table-column :min-width="ColumnMinWidth.serviceName"
					                 :label="$t('ExplorerLang.table.serviceName')">
						<template slot-scope="scope">
							<el-tooltip v-if="!scope.row.isChildren" :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">
									{{scope.row.serviceName}}
								</router-link>
							</el-tooltip>
							<span class="serviceNameText" v-if="scope.row.isChildren && scope.row.index==0">{{getRespondCount(scope.row.count)}}</span>
						</template>
					</el-table-column>
					<el-table-column class-name="tx_type" :width="ColumnMinWidth.minTxType" :label="$t('ExplorerLang.table.txType')"
					                 prop="txType"></el-table-column>
					<el-table-column :min-width="ColumnMinWidth.state" :label="$t('ExplorerLang.table.requestStatus')">
						<template slot-scope="scope">
							<div v-if="scope.row.state" class="consumer_transaction_content_available">
								<span class="consumer_transaction_content_available_icon"
								      :style="`background:${getBgColorWithState(scope.row.state)}`"></span>
								<span>{{$t( 'ExplorerLang.table.' + getContentWithState(scope.row.state) )}}</span>
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.blockListHeight" :label="$t('ExplorerLang.table.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
						</template>
					</el-table-column>
					<el-table-column class-name="hash_status" :min-width="ColumnMinWidth.addressTxHash" :label="$t('ExplorerLang.table.txHash')">
						<template slot-scope="scope">
							<div class="address_transaction_content_hash">
								<div class="status">
									<img class="status_icon"
										:src="require(`../assets/${scope.row.status==TX_STATUS.success?'success.png':'failed.png'}`)"/>
								</div>
								<el-tooltip :content="scope.row.txHash"
								            placement="top">
									<div>
										<router-link :to="`/tx?txHash=${scope.row.txHash}`">
											{{formatTxHash(scope.row.txHash)}}
										</router-link>
									</div>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column class-name="requestId" :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
						<template slot-scope="scope">
							<el-tooltip
										:content="scope.row.requestContextId"
										placement="top"
										effect="dark"
										:disabled="Tools.disabled(scope.row.requestContextId)">
								<span>{{formatAddress(scope.row.requestContextId)}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column class-name="address" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.provider')">
						<template slot-scope="scope">
							<el-tooltip v-if="scope.row.txType==TX_TYPE_DISPLAY.respond_service"
							            :content="scope.row.provider"
							            placement="top">
								<router-link :to="`/address/${scope.row.provider}`">
									{{formatAddress(scope.row.provider)}}
								</router-link>
							</el-tooltip>
							<div v-if="scope.row.txType==TX_TYPE_DISPLAY.call_service">
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
			<div class="provider_transaction_content" v-if="moduleSupport('105', prodConfig.navFuncList)" v-show="isIservice">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.providerTitle')}}</div>
				<el-table class="table" :data="providerTxList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.serviceName"
					                 :label="$t('ExplorerLang.table.serviceName')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">
									{{scope.row.serviceName}}
								</router-link>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.respondTimes"
					                 :label="$t('ExplorerLang.table.respondTimes')">
						<template slot-scope="scope">
							<router-link :to="`/service/respond/${scope.row.serviceName}/${address}`">
								{{`${scope.row.respond_times} ${$t('ExplorerLang.unit.time')}`}}
							</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.available"
					                 :label="$t('ExplorerLang.table.isAvailable')">
						<template slot-scope="scope">
							<div class="provider_transaction_content_available">
								<span class="provider_transaction_content_available_icon"
								      :style="`background:${scope.row.isAvailable?'#B1E96E':'#C4C4C4'}`"></span>
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
					<el-table-column :width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.disabledTime')">
						<template slot-scope="scope">
							<span>{{scope.row.isAvailable ? '--' : scope.row.unbindTime}}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="content_title" style="margin-top:0.4rem">
					{{$t('ExplorerLang.addressDetail.respondRecord')}}
				</div>
				<el-table class="table" :data="respondRecordList"
				          :empty-text="$t('ExplorerLang.table.emptyDescription')">
					<el-table-column :min-width="ColumnMinWidth.serviceName"
					                 :label="$t('ExplorerLang.table.serviceName')">
						<template slot-scope="scope">
							<el-tooltip v-if="scope.row.serviceName" :content="scope.row.serviceName" placement="top">
								<router-link :to="`/service?serviceName=${scope.row.serviceName}`">
									{{scope.row.serviceName}}
								</router-link>
							</el-tooltip>
							<span v-if="!scope.row.serviceName">--</span>
						</template>
					</el-table-column>
					<el-table-column class-name="tx_type" :width="ColumnMinWidth.txType" :label="$t('ExplorerLang.table.txType')"
					                 prop="type"></el-table-column>
					<el-table-column class-name="hash_status" :min-width="ColumnMinWidth.respondHash" :label="$t('ExplorerLang.table.respondHash')">
						<template slot-scope="scope">
							<div class="respond_transaction_content_hash">
								<div class="status">
									<img class="status_icon"
								     :src="require(`../assets/${scope.row.respondStatus==TX_STATUS.success?'success.png':'failed.png'}`)"/>
								</div>
								<el-tooltip :content="scope.row.respondHash"
								            placement="top">
									<div>
										<router-link :to="`/tx?txHash=${scope.row.respondHash}`">
											{{formatTxHash(scope.row.respondHash)}}
										</router-link>
									</div>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column class-name="requestId" :min-width="ColumnMinWidth.requestId" :label="$t('ExplorerLang.table.requestId')">
						<template slot-scope="scope">
							<el-tooltip
										:content="scope.row.requestContextId"
										placement="top"
										effect="dark"
										:disabled="Tools.disabled(scope.row.requestContextId)">
								<span>{{formatAddress(scope.row.requestContextId)}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.blockListHeight" :label="$t('ExplorerLang.table.block')">
						<template slot-scope="scope">
							<router-link :to="`/block/${scope.row.height}`">{{scope.row.height}}</router-link>
						</template>
					</el-table-column>
					<el-table-column :min-width="ColumnMinWidth.time" :label="$t('ExplorerLang.table.timestamp')"
					                 prop="time">
						<template slot-scope="scope">
							<span>{{Tools.getDisplayDate(scope.row.time)}}</span>
						</template>
					</el-table-column>
					<el-table-column class-name="address" :min-width="ColumnMinWidth.address" :label="$t('ExplorerLang.table.consumer')">
						<template slot-scope="scope">
							<el-tooltip :content="scope.row.consumer" placement="top">
								<router-link v-if="scope.row.consumer && scope.row.consumer.length"
								             :to="`/address/${scope.row.consumer}`">
									{{formatAddress(scope.row.consumer)}}
								</router-link>
							</el-tooltip>
							<span v-if="!scope.row.consumer">--</span>
						</template>
					</el-table-column>
					<el-table-column class-name="hash_status" :min-width="ColumnMinWidth.requestHash" :label="$t('ExplorerLang.table.requestHash')">
						<template slot-scope="scope">
							<div class="address_transaction_content_hash">
								<div class="status">
									<img v-if="scope.row.requestHash && scope.row.requestHash !='--'" class="status_icon"
								     src="../assets/success.png"/>
								</div>
								<el-tooltip v-if="scope.row.requestHash && scope.row.requestHash != '--'"
								            :content="scope.row.requestHash"
								            placement="top">
									<div>
										<router-link :to="`/tx?txHash=${scope.row.requestHash}`">
											{{formatTxHash(scope.row.requestHash)}}
										</router-link>
									</div>
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
			<div v-if="moduleSupport('107', prodConfig.navFuncList)" v-show="isAsset">
				<!-- 地址详情 -->
				<address-information-component :address="address" :data="assetsItems" :isProfiler="isProfiler"/>
				<div class="delegations_wrap">
					<div class="delegations_container">
						<!-- Delegations -->
						<div class="one_table_container">
							<p class="validator_information_content_title">
								{{ $t('ExplorerLang.validatorDetail.delegationsTitle') }}
								<span class="address_information_delegation_value" v-show="totalDelegatorValue">{{totalDelegatorValue}}</span>
							</p>
							<div class="delegations_table_container">
								<el-table :empty-text="$t('ExplorerLang.table.emptyDescription')"
								          :data="delegationsItems" style="width: 100%">
									<el-table-column class-name="address" prop="address" :label="$t('ExplorerLang.table.address')"
									                 :min-width="ColumnMinWidth.address">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<span v-if="row.moniker" class="address_link"
												             @click="addressRoute(row.address)">
													{{formatMoniker(row.moniker,monikerNum.otherTable)}}
												</span>
												<span v-if="!row.moniker" style="font-family:Arial"
												             class="address_link" @click="addressRoute(row.address)">
													{{formatAddress(row.address)}}
												</span>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 align="right" :min-width="ColumnMinWidth.ownerDetailDelegationsAmount">
										<template slot="header" slot-scope="scope">
											<span>{{ $t('ExplorerLang.table.amount')}}</span>
											<el-tooltip :content="mainTokenSymbol"
														placement="top">
												<i class="iconfont iconyiwen yiwen_icon" />
											</el-tooltip>
										</template >
									</el-table-column>
									<el-table-column prop="shares" :label="$t('ExplorerLang.table.shares')" align="left"
									                 :min-width="ColumnMinWidth.shares"></el-table-column>
									<!-- <el-table-column prop="block" :label="$t('ExplorerLang.table.block')" min-width="100">
										<template v-slot:default="{ row }">
										<router-link style="font-family: Arial;" :to="'/block/' + row.block" :style="{ color: '$theme_c !important' }">{{ row.block }}</router-link>
										</template>
									</el-table-column> -->
								</el-table>
							</div>
							<m-pagination v-if="flDelegationNextPage" :page="delegationCurrentPage"
							              :page-size="tablePageSize" :total="delegationCountNum"
							              :page-change="delegationPageChange"></m-pagination>
						</div>
						<!-- Unbonding Delegations -->
						<div class="second_table_container">
							<p class="validator_information_content_title">
								{{ $t('ExplorerLang.validatorDetail.unbondingDelegationsTitle') }}
								<span class="address_information_unbonding_delegation_value"
								      v-show="totalUnBondingDelegatorValue">{{totalUnBondingDelegatorValue}}</span>
							</p>
							<div class="delegations_table_container">
								<el-table :empty-text="$t('ExplorerLang.table.emptyDescription')"
								          :data="unBondingDelegationsItems" style="width: 100%">
									<el-table-column class-name="address" prop="address" :label="$t('ExplorerLang.table.address')"
									                 :min-width="ColumnMinWidth.address">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<span v-if="row.moniker" class="address_link"
												             @click="addressRoute(row.address)">
													{{formatMoniker(row.moniker,monikerNum.otherTable)}}
												</span>
												<span v-if="!row.moniker" style="font-family:Arial"
												             class="address_link" @click="addressRoute(row.address)">
													{{formatAddress(row.address)}}
												</span>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 :min-width="ColumnMinWidth.amount">
										<template slot="header" slot-scope="scope">
											<span>{{ $t('ExplorerLang.table.amount')}}</span>
											<el-tooltip :content="mainTokenSymbol"
														placement="top">
												<i class="iconfont iconyiwen yiwen_icon" />
											</el-tooltip>
										</template >
									</el-table-column>
									<el-table-column prop="block" :label="$t('ExplorerLang.table.block')"
									                 :min-width="ColumnMinWidth.blockListHeight">
										<template v-slot:default="{ row }">
											<router-link style="font-family: Arial;"
											             :to="'/block/' + row.block"
											             :style="{ color: '$theme_c !important' }">{{ row.block }}
											</router-link>
										</template>
									</el-table-column>
									<el-table-column prop="endTime" :label="$t('ExplorerLang.table.endTime')"
									                 :min-width="ColumnMinWidth.time"></el-table-column>
								</el-table>
							</div>
							<m-pagination v-if="flUnBondingDelegationNextPage" :page-size="tablePageSize"
							              :total="unBondingDelegationCountNum" :page="unBondingDelegationCurrentPage"
							              :page-change="unBondingDelegationPageChange"></m-pagination>
						</div>
					</div>
				</div>
				<!-- Delegator Rewards 标题 -->
				<div class="address_information_redelegation_header_title">{{
					$t('ExplorerLang.addressInformation.delegatorRewards.title') }}
					<span class="address_information_redelegation_rewards_value" v-show="totalDelegatorRewardValue">{{totalDelegatorRewardValue}}</span>
				</div>
				<div class="address_information_redelegation_tx_container">
					<div class="address_information_delegator_rewards_content">
						<!-- Withdraw To: -->
						<div class="address_information_detail_option">
							<span class="address_information_detail_option_name">{{ $t('ExplorerLang.addressInformation.delegatorRewards.withdrawTo') }}:</span>
							<span class="address_information_detail_option_value">
								<router-link
										:to="`/address/${withdrewToAddress}`">{{withdrewToAddress}}</router-link></span>
						</div>
						<!-- Delegator Rewards 的表格 -->
						<div class="address_information_list_content">
							<div>
								<el-table :empty-text="$t('ExplorerLang.table.emptyDescription')" :data="rewardsItems"
								          style="width: 100%">
									<el-table-column class-name="address" prop="address" :label="$t('ExplorerLang.table.address')"
									                 align="left" :min-width="ColumnMinWidth.address">
										<template v-slot:default="{ row }">
											<el-tooltip :content="`${row.address}`">
												<router-link v-if="row.moniker" class="address_link"
												             :to="`/staking/${row.address}`">
													{{formatMoniker(row.moniker,monikerNum.otherTable)}}
												</router-link>
												<router-link v-if="!row.moniker" style="font-family:Arial"
												             class="address_link" :to="`/staking/${row.address}`">
													{{formatAddress(row.address)}}
												</router-link>
											</el-tooltip>
										</template>
									</el-table-column>
									<el-table-column prop="amount" :label="$t('ExplorerLang.table.amount')"
									                 align="right" :min-width="ColumnMinWidth.amount">
										<template slot="header" slot-scope="scope">
											<span>{{ $t('ExplorerLang.table.amount')}}</span>
											<el-tooltip :content="mainTokenSymbol"
														placement="top">
												<i class="iconfont iconyiwen yiwen_icon" />
											</el-tooltip>
										</template >
									</el-table-column>
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
					<div class="address_information_detail_container"
					     :class="OperatorAddress !== '--' ? '' :'hide_style'"
					     :style="{visibility:OperatorAddress && OperatorAddress !== '--' ? 'visible':'hidden'}">
						<!-- 标题 -->
						<div class="address_information_redelegation_title">{{
							$t('ExplorerLang.addressInformation.validatorRewards.title') }}
							<span class="address_information_validator_rewards_value" v-show="totalValidatorRewards">{{totalValidatorRewards}}</span>
						</div>
						<!-- 需展示的数据 -->
						<ul class="address_information_detail_content">
							<li class="address_information_detail_option">
								<span class="address_information_detail_option_name">{{ $t('ExplorerLang.addressInformation.validatorRewards.validatorMoniker') }}:</span>
								<div class="validator_status_content">
									<span class="address_information_detail_option_value">
										<router-link v-show="OperatorAddress !== '--' && validatorMoniker !== '--'"
										             :to="`/staking/${OperatorAddress}`">{{validatorMoniker}}</router-link>
										<span v-show="OperatorAddress === '--' || validatorMoniker === '--'">{{validatorMoniker}}</span>
									</span>
									<span class="address_information_address_status_active"
									      v-if="validatorStatus === 'active'">{{ $t('ExplorerLang.staking.status.active')}}</span>
									<span class="address_information_address_status_candidate"
									      v-if="validatorStatus === 'candidate'">{{ $t('ExplorerLang.staking.status.candidate') }}</span>
									<span class="address_information_address_status_jailed"
									      v-if="validatorStatus === 'jailed'">{{ $t('ExplorerLang.staking.status.jailed') }}</span>
								</div>
							</li>
							<li class="address_information_detail_option" style="margin-top: 0.05rem">
								<span class="address_information_detail_option_name">{{ $t('ExplorerLang.addressInformation.validatorRewards.operatorAddress') }}:</span>
								<span class="address_information_detail_option_value">
									<router-link v-show="OperatorAddress !== '--'" :to="`/staking/${OperatorAddress}`">{{OperatorAddress}}</router-link>
									<span v-show="OperatorAddress === '--'">{{OperatorAddress}}</span>
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div v-show="isTx" class="address_transaction_content">
				<div class="content_title">{{$t('ExplorerLang.addressDetail.txRecord')}}</div>
				<div class="address_transaction_condition_container">
                    <span class="address_transaction_condition_count">
                        {{ `${totalTxNumber} ${$t('ExplorerLang.unit.Txs')}` }}
                    </span>
					<!-- <el-select popper-class="tooltip" v-model="type_temp" filterable>
						<el-option v-for="(item, index) in txTypeOption"
						           :key="index"
						           :label="item.label"
						           :value="item.value"></el-option>
					</el-select> -->
					<el-cascader
                            popper-class="tooltip"
                            :placeholder="$t('ExplorerLang.common.allTxType')"
                            v-model="txTypeArray"
                            :options="txTypeOption"
                            :props="{ expandTrigger: 'hover' }"
                            :show-all-levels="false"
                            :filterable="true"
                            @change="handleChange"></el-cascader>
					<el-select popper-class="tooltip" v-model="status_temp">
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
				<TxListComponent v-if="address" :txData="txList" :address="address"></TxListComponent>
				<div class="pagination_content" v-show="totalTxNumber > pageSize">
          <div class="tooltip_box">
            <span class="tooltip_title">Cross-chain TokenType:</span>
            <span class="tooltip_title_box">
              <span class="tooltip_title_IBC">{{ IBC }}</span>
              <span class="tooltip_title_HTLT">{{ HashLock }}</span>
            </span>
          </div>
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
	import Tools from "../util/Tools";
	import MPagination from "./common/MPagination";
	import {TxHelper} from "../helper/TxHelper";
	import {moduleSupport} from "../helper/ModulesHelper";
	import TxListComponent from "./common/TxListComponent";
	import prodConfig from "../productionConfig"
	import Constant, {TX_TYPE,TX_TYPE_DISPLAY,TX_STATUS, ColumnMinWidth,monikerNum,ibcDenomPrefix} from '../constant';
	import AddressInformationComponent from "./AddressInformationComponent";
	import LargeString from './common/LargeString';
	import { addressRoute,formatMoniker } from '@/helper/IritaHelper';
	import {
		getNfts,
		getAddressTxList,
		getCallServiceWithAddress,
		getRespondServiceWithAddress,
		getRespondServiceRecord,
		getServiceBindingByServiceName,
		getServiceContextsByServiceName,
		getIdentityListByAddress,
		getAllTxTypes,
		getAddressInformationApi,
		getDelegationListApi,
		getUnBondingDelegationListApi,
		getRewardsItemsApi,
		getValidatorRewardsApi,
		getIbcTransferByHash
	} from "@/service/api";
	import BigNumber from 'bignumber.js'
	import moveDecimal from 'move-decimal-point'
	import {converCoin,getMainToken} from "../helper/IritaHelper"
	export default {
		name: "OwnerDetail",
		components: {MPagination, TxListComponent, AddressInformationComponent, LargeString},
		data () {
			return {
        IBC: 'IBC',
        HashLock: 'Hash Lock',
				addressRoute,
				formatMoniker,
				monikerNum,
				TX_TYPE,
				TX_STATUS,
				TX_TYPE_DISPLAY,
				ColumnMinWidth,
				prodConfig,
				moduleSupport,
				Tools,
				assetArray: [],
				assetPageNum: 1,
				assetPageSize: 5,
				assetCount: 0,
				denomArray: [],
				address: '',
				pageNum: 1,
				pageSize: 5,
				txList: [],
				totalTxNumber: 0,
				providerTxList: [],
				consumerTxPageNum: 1,
				consumerTxPageSize: 5,
				consumerTxCount: 0,
				consumerTxList: [],
				respondRecordList: [],
				respondRecordPageNum: 1,
				respondRecordPageSize: 5,
				respondRecordCount: 0,
				identityList: [],
				identityPageNum: 1,
				identityPageSize: 5,
				identityCount: 0,
				type: '',
				status: '',
				type_temp: '',
				status_temp: '',
				txTypeArray:[''],
				statusOpt: [
					{
						value: '',
						label: this.$t('ExplorerLang.common.allTxStatus')
					},
					{
						value: 1,
						label: this.$t('ExplorerLang.common.success')
					},
					{
						value: 2,
						label: this.$t('ExplorerLang.common.failed')
					}
				],
				txTypeOption: [
					{
						value: '',
						label: this.$t('ExplorerLang.common.allTxType')
					},
				],
				isProfiler: false,
				assetsItems: [],
				assetList: [],
				withdrewToAddress: '',
				validatorMoniker: '',
				validatorStatus: '',
				OperatorAddress: '',
				fixedNumber: 2, // 展示2位小数
				computerNumber: 5, // 计算保留5位小数
				totalDelegatorReward: 0,
				totalDelegatorRewardValue: 0,
				totalUnBondingDelegator: 0,
				totalUnBondingDelegatorValue: 0,
				totalDelegator: 0,
				totalDelegatorValue: 0,
				totalValidatorRewards: 0,
				delegatorRewardsValue: 0,
				validatorRewardsValue: 0,
				allRewardsValue: 0,
				allRewardsAmountValue: 0,

				tablePageSize: 5,
				flDelegationNextPage: false,
				flUnBondingDelegationNextPage: false,
				flRewardsDelegationNextPage: false,
				delegationCountNum: 0,
				unBondingDelegationCountNum: 0,
				rewardsDelegationCountNum: 0,
				delegationCurrentPage: 1,
				unBondingDelegationCurrentPage: 1,
				rewardsDelegationCurrentPage: 1,
				delegationsItems: [],
				unBondingDelegationsItems: [],
				rewardsItems: [],
				delegationPageNationArrayData: [],
				unBondingDelegationPageNationArrayData: [],
				rewardsDelegationPageNationArrayData: [],
				mainToken: {},
				tabList: [],
				isAsset:false,
				isNftInfo:false,
				nftKey:0,
				isIdentity:false,
				isIservice:false,
				isTx:false,
				assetInfo: {
					label: this.$t('ExplorerLang.addressInformation.tab.assetInfo'),
					isActive: false,
					moduleNumber:'107'
				},
				nftCount: {
					label: this.$t('ExplorerLang.addressInformation.tab.nftCount'),
					isActive: false,
					moduleNumber:'103'
				},
				identity: {
					label: this.$t('ExplorerLang.addressInformation.tab.identity'),
					isActive: false,
					moduleNumber:'106'
				},
				iService: {
					label: this.$t('ExplorerLang.addressInformation.tab.iService'),
					isActive: false,
					moduleNumber:'105'
				},
				tx: {
					label: this.$t('ExplorerLang.addressInformation.tab.tx'),
					isActive: false,
				},
				LargeStringMinHeight: 69,
				LargeStringLineHeight:23,
        mainTokenSymbol:'',
			}
		},
		watch: {
			$route () {
				this.address = this.$route.params.param;
				this.getAssetList();
				this.getTxByAddress();
        this.getConsumerTxList(null, null, true)
        this.getConsumerTxList(this.consumerTxPageNum, this.consumerTxPageSize)
        this.getRspondRecordList(null, null, true);
        this.getRspondRecordList(this.respondRecordPageNum, this.respondRecordPageSize);
				this.getProviderTxList(null, null, true);
        this.getProviderTxList(1, 1000);
			},
			totalDelegatorReward (totalDelegatorReward) {
				this.getAssetList()
			},
			totalUnBondingDelegator (totalDelegatorReward) {
				this.getAssetList()
			},
			totalDelegator () {
				this.getAssetList()
			},
			OperatorAddress () {
				this.getValidatorRewards()
			}
		},
		async created(){
			this.mainToken = await getMainToken();
		},
		mounted () {
			document.documentElement.scrollTop = 0;
			this.address = this.$route.params.param
			this.getTabList()
			this.setMainToken()

		},
		methods: {
            async setMainToken(){
                let mainToken = await getMainToken();
                if(mainToken && mainToken.symbol){
                    this.mainTokenSymbol = mainToken.symbol.toUpperCase();
                }
            },
			getTabList(){
				this.tabList = []
				if(moduleSupport('107', prodConfig.navFuncList)){
					this.tabList.push(this.assetInfo)
					this.getAddressInformation()
					this.getRewardsItems()
					this.getAssetList()
          this.getDelegationList(null, null, true)
					this.getDelegationList(1,1000)
					this.getUnBondingDelegationList(null, null, true)
          this.getUnBondingDelegationList(1,1000)
				}
				if(moduleSupport('103', prodConfig.navFuncList)){
					this.tabList.push(this.nftCount)
					this.getNftList(null, null, true)
          this.getNftList(this.assetPageNum, this.assetPageSize)
				}
				if(moduleSupport('106', prodConfig.navFuncList)){
					this.tabList.push(this.identity)
          this.getIdentityList(null, null, true);
					this.getIdentityList(this.identityPageNum, this.identityPageSize);

				}
				if(moduleSupport('105', prodConfig.navFuncList)){
					this.tabList.push(this.iService)
					this.getRspondRecordList(null, null, true);
          this.getRspondRecordList(this.respondRecordPageNum, this.respondRecordPageSize);
          this.getProviderTxList(null, null, true);
					this.getProviderTxList(1, 1000);   
          this.getConsumerTxList(null, null, true)
          this.getConsumerTxList(this.consumerTxPageNum, this.consumerTxPageSize)

				}
				this.tabList.push(this.tx)
				this.tabList[0].isActive = true
				this.showAndHideByModule()
			},
			showAndHideByModule(){
				this.isNftInfo = false
				this.isIservice = false
				this.isIdentity = false
				this.isAsset = false
				this.isTx = false
				this.tabList.forEach( item => {
					if(item.isActive){
						switch (item.moduleNumber) {
							case "103":
								this.nftKey++;
								this.isNftInfo = true;
								break;
							case "105":
								this.isIservice = true;
								break;
							case "106":
								this.isIdentity = true;
								break
							case "107":
								this.isAsset = true
								break
							default:
								this.isTx =true
                this.getTxByAddress(null, null ,true);
                this.getTxByAddress(this.pageNum, this.pageSize);
								this.getAllTxType();

						}
					}
				})
			},
			selectOptions (index) {
				this.tabList.forEach(item => {
					item.isActive = false
				})
				this.tabList[index].isActive = true
				this.showAndHideByModule()
			},
			assetPageChange (pageNum) {
				this.assetPageNum = pageNum;
				this.getNftList(this.assetPageNum, this.assetPageSize)
			},
			async getNftList (pageNum, pageSize, useCount = false) {
				try {
					let nftData = await getNfts(pageNum, pageSize, useCount, '', '', this.$route.params.param);
					if (nftData && nftData.data) {
            if(useCount){
              this.assetCount = nftData.count;
            }			
						this.assetArray = nftData.data.map(item => {
							return {
								id: item.nft_id,
								denomName: item.denom_name || item.denom_id,
								denomId: item.denom_id,
								nftName: item.nft_name,
								owner: item.owner,
								tokenData: item.tokenData,
								tokenUri: item.tokenUri,

							}
						})
					}
				} catch (e) {
					console.error(e)
				}
			},
			//身份id列表
			identityPageChange (pageNum) {
				this.identityPageNum = pageNum;
				this.getIdentityList(this.identityPageNum, this.identityPageSize)
			},
			async getIdentityList (pageNum, pageSize, useCount = false) {
				try {
					const res = await getIdentityListByAddress(this.$route.params.param, pageNum, pageSize, useCount);
					if (res) {
            if(useCount){
              this.identityCount = res.count;
            } 
						this.identityList = res.data.map((item) => {
							return {
								id: item.identities_id,
								txHash: item.update_tx_hash || '--',
								time: Tools.getDisplayDate(item.update_block_time) || '--'
							}
						});
					}
				} catch (e) {
					console.error(e);
					this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
				}
			},
			//地址相关交易记录
			async getTxByAddress(pageNum, pageSize, useCount = false) {
				try {
					const res = await getAddressTxList(this.$route.params.param, this.type, this.status, pageNum, pageSize, useCount);
					if (res) {
            if(useCount){
              this.totalTxNumber = res.count;
            }
						this.txList = res.data;
					}
				} catch (e) {
					console.error(e);
					this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
				}
			},
			pageChange (pageNum) {
				this.pageNum = pageNum;
        this.getTxByAddress(this.pageNum, this.pageSize);
				this.type ?  this.txTypeArray= TxHelper.getTxTypeArray(this.txTypeOption,this.type) : this.txTypeArray = ['']
				this.status_temp = this.status
				this.type_temp = this.type
			},
			//服务调用-消费者
			async getConsumerTxList (pageNum, pageSize, useCount = false) {
				try {
					const res = await getCallServiceWithAddress(pageNum, pageSize, useCount, this.$route.params.param);
					if (res) {
             if(useCount){
              this.consumerTxCount = res.count;
            }			
						this.consumerTxList = [];
						for (let item of res.data) {
							let result = {
								serviceName: item.msgs[0].msg.service_name || '--',
								txHash: item.tx_hash,
								blockHeight: item.height,
								txType: TX_TYPE_DISPLAY[item.type],
								provider: item.msgs[0].msg.providers,
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
                          console.log(context)
	                        if (context && context.result) {
	                        	result.state = context.result.state;
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
										txType: TX_TYPE_DISPLAY[r.type],
										provider: r.msgs[0].msg.provider,
										time: Tools.getDisplayDate(r.time),
										requestContextId: (r.msgs[0].msg.ex || {}).request_context_id,
										requestStatus: '--',
										status: r.status,
									};
									this.consumerTxList.push(respondResult);
								});
							}
						}
					}
				} catch (e) {
					console.error(e);
					this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
				}
			},
			consumerTxPageChange (pageNum) {
				this.consumerTxPageNum = pageNum;
				this.getConsumerTxList(this.consumerTxPageNum, this.consumerTxPageSize)
			},
			//响应记录
			async getRspondRecordList (pageNum, pageSize, useCount = false) {
				try {
					const res = await getRespondServiceRecord('', this.$route.params.param, pageNum, pageSize, useCount);
					if (res) {
            if(useCount){
              this.respondRecordCount = res.count;
            }
						this.respondRecordList = (res.data || []).map(tx => {
							tx.type = TX_TYPE_DISPLAY[tx.type]
							return tx
						});
					}
				} catch (e) {
					console.error(e);
					this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
				}

			},
			respondRecordPageChange (pageNum) {
				this.respondRecordPageNum = pageNum;
        this.getRspondRecordList(this.respondRecordPageNum, this.respondRecordPageSize);
			},
			//服务调用-提供者
			async getProviderTxList (pageNum, pageSize, useCount = false) {
				try {
					const res = await getRespondServiceWithAddress(this.$route.params.param, pageNum, pageSize, useCount);
					if (res) {
						this.providerTxList = [];
						for (let item of res.data) {
							let result = {
								serviceName: (item.msgs[0].msg.ex || {}).service_name,
								provider: item.msgs[0].msg.provider,
								owner: item.msgs[0].msg.owner,
								respond_times: item.respond_times,
								pricing: JSON.parse(item.msgs[0].msg.pricing || '{}').price,
								qos: item.msgs[0].msg.qos,
								time: Tools.getDisplayDate(item.time),
								unbindTime: item.unbinding_time ? Tools.getDisplayDate(item.unbinding_time) : '--',
								txHash: item.tx_hash,
								blockHeight: item.height,
								txType: item.type,
								status: item.status,
							};
							if (item.msgs[0].msg.deposit && item.msgs[0].msg.deposit.length) {
								result.deposit = `${item.msgs[0].msg.deposit[0].amount} ${item.msgs[0].msg.deposit[0].denom}`;
							}
							let bindings = await getServiceBindingByServiceName(result.serviceName);
							(bindings.result || []).forEach((bind) => {
								if (result.provider === bind.provider && result.owner == bind.owner) {
									result.isAvailable = bind.available;
									result.pricing = JSON.parse(bind.pricing || '{}').price;
									result.qos = bind.qos;
									if (bind.disabled_time) {
										let time = new Date(bind.disabled_time).getTime();
										result.unbindTime = time > 0 ? Tools.getDisplayDate(time / 1000) : '--';
									}
								}
							})
							if (result.pricing && result.pricing.length) {
								result.pricing = result.pricing.replace('point', ' point');
							}
							this.providerTxList.push(result);
						}
					}
				} catch (e) {
					console.error(e);
					this.$message.error(this.$t('ExplorerLang.message.requestFailed'));
				}

			},
			formatTxHash (TxHash) {
				if (TxHash) {
					return Tools.formatTxHash(TxHash)
				} else {
					return '--';
				}
			},
			getCallProviders (providers) {
				if (providers && providers.length > 2) {
					return providers.slice(0, 2);
				}
				return providers;
			},
      getContentWithState (state) {
        let content = '';
				switch (state) {
					case 0:
						content = 'running';
						break;
          case 1:
						content = 'paused';
						break;
					case 2:
						content = 'completed';
						break;
				}
				return content;
      },
			getBgColorWithState (state) {
				let bgColor = '';
				switch (state) {
					case 0:
						bgColor = '#B1E96E';
						break;
          case 1:
						bgColor = '#E96E6E';
						break;
					case 2:
						bgColor = '#FFC456';
						break;	
				}
				return bgColor;
			},
			arraySpanMethod (table) {
				if (table.columnIndex === 0) {
					if (table.row.isChildren) {
						if (table.row.index == 0) {
							return {
								rowspan: table.row.count,
								colspan: 1
							};
						} else {
							return {
								rowspan: 0,
								colspan: 0
							};
						}
					} else {
						return {
							rowspan: 1,
							colspan: 1
						};
					}
				}

			},
			getRespondCount (count) {
				return this.$t('ExplorerLang.unit.totalRespond').replace(/\$\{\%value\%\}/, count);
			},
			handleSearchClick () {
				this.type = this.type_temp;
				this.status = this.status_temp;
				this.pageNum = 1;
        this.getTxByAddress(null, null, true)
        this.getTxByAddress(this.pageNum, this.pageSize)
			},
			resetFilterCondition () {
				this.type_temp = '';
				this.status_temp = '';
				this.type = '';
				this.status = '';
				this.pageNum = 1;
				this.getTxByAddress(null, null ,true);
        this.getTxByAddress(this.pageNum, this.pageSize);
				this.txTypeArray=['']
			},
			async getAllTxType () {
				try {
					const res = await getAllTxTypes();
					const typeList = TxHelper.formatTxType(res.data)
                    typeList.unshift({
                        value : '',
                        label : this.$t('ExplorerLang.common.allTxType'),
                        slot : 'allTxType'
					});
                    this.txTypeOption = typeList;

				} catch (e) {
					console.error(e);
				}
			},
			async getAddressInformation () {
				try {
					let res = await getAddressInformationApi(this.$route.params.param)
					if (res) {
						let arrayIndexOneData;
						if (res.amount) {
							res.amount.forEach(item => {
								if (item.denom === this.mainToken.denom) {
									arrayIndexOneData = item
								}
							});
							if(arrayIndexOneData) {
								res.amount.unshift(arrayIndexOneData);
							}
							res.amount = Array.from(new Set(res.amount));
							this.assetList = res.amount;
						}
						this.validatorMoniker = res.moniker ? res.moniker : '--';
						this.OperatorAddress = res.operator_address ? res.operator_address : '--';
						this.validatorStatus = res.status;
						this.withdrewToAddress = res.withdrawAddress ? res.withdrawAddress : '--';
						this.isProfiler = res.isProfiler;
						this.getAssetList()
					}
				} catch (e) {
					console.error(e)
				}
			},
			async getAssetList () {
				let assetList = [];
				let balanceAmountsArr = [];
				// console.time('amount')
				for (let key in this.assetList) {
					let item = this.assetList[key];
					balanceAmountsArr.push(item && item.amount ? converCoin(item) : {});
				}
				let balanceAmounts = await Promise.all(balanceAmountsArr);
			 	for (let key in this.assetList) {
			 		let item = this.assetList[key];
			 		// let balanceAmount = item && item.amount ? await converCoin(item) : {};
			 		let balanceAmount = balanceAmounts[key]
			 		if (item && item.denom && item.denom === this.mainToken.denom) {
						assetList.unshift({
							token: this.mainToken.symbol.toUpperCase(),
							balance: balanceAmount  && balanceAmount.amount ? `${new BigNumber(Tools.formatStringToFixedNumber(balanceAmount.amount, this.fixedNumber)).toFormat()} ${balanceAmount.denom.toUpperCase()}` : 0,
							balanceNumber: balanceAmount.amount,
							delegatedValue: this.totalDelegator ? this.totalDelegator : 0,
							delegated: this.totalDelegator ? `${Tools.formatStringToFixedNumber(new BigNumber(this.totalDelegator).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}` : 0,
							unBondingValue: this.totalUnBondingDelegator ? this.totalUnBondingDelegator : 0,
							unBonding: this.totalUnBondingDelegator ? `${Tools.formatStringToFixedNumber(new BigNumber(this.totalUnBondingDelegator).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}` : 0,
							rewards: this.allRewardsValue ? `${Tools.formatStringToFixedNumber(new BigNumber(this.allRewardsAmountValue).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`: 0,
							rewardsValue: this.allRewardsAmountValue ? this.allRewardsAmountValue : 0,
							totalAmount: `${Tools.formatStringToFixedNumber(new BigNumber((Number(Tools.formatStringToFixedNumber(balanceAmount.amount.toString(), this.computerNumber)) +
								Number(Tools.formatStringToFixedNumber(this.totalDelegator.toString(), this.computerNumber)) +
								Number(Tools.formatStringToFixedNumber(this.totalUnBondingDelegator.toString(), this.computerNumber)) +
								Number(Tools.formatStringToFixedNumber(this.allRewardsAmountValue.toString(), this.computerNumber))).toString()).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`,
						});
					} else {
						if(balanceAmount && balanceAmount.denom) {
							let denom = balanceAmount.denom;
							if(denom.startsWith(ibcDenomPrefix)){
								let hash = denom.replace(ibcDenomPrefix,'')
								let res = await getIbcTransferByHash(hash)
								if(res && res.denom_trace && res.denom_trace.base_denom) {
									denom = (ibcDenomPrefix + res.denom_trace.base_denom).toUpperCase()
								}
							}
							assetList.push({
								token: item.denom.toUpperCase(),
								balance: balanceAmount.amount ? `${new BigNumber(balanceAmount.amount).toFormat()} ${denom.toUpperCase()}` : 0,
								delegated: 0,
								unBonding: 0,
								rewards: 0,
								totalAmount: balanceAmount.amount ? `${new BigNumber(balanceAmount.amount).toFormat()} ${balanceAmount.denom.toUpperCase()}` : 0
							});
						}
					}
			 	}
				this.assetsItems = assetList;
				//  console.timeEnd('amount')
			},
			pageNation (dataArray) {
				let index = 0;
				let newArray = [];
				if (dataArray.length > this.pageSize) {
					while (index < dataArray.length) {
						newArray.push(dataArray.slice(index, index += this.pageSize));
					}
				} else {
					newArray = dataArray
				}
				return newArray
			},
			async getDelegationList (pageNum, pageSize, useCount = false) {
				try {
					const {data: res} = await getDelegationListApi(this.$route.params.param,pageNum, pageSize, useCount)
					if (res && res.length > 0) {
						let copyResult = JSON.parse(JSON.stringify(res));
						this.delegationPageNationArrayData = this.pageNation(copyResult);
						if (res.length > this.pageSize) {
							this.flDelegationNextPage = true;
						} else {
							this.flDelegationNextPage = false;
						}
            if(useCount){
              this.delegationCountNum = res.count;
            }	
						this.delegationPageChange(this.delegationCurrentPage);
						if (res.length > 0) {
							// res.forEach(async (item) => {
							// 	if (item.amount && item.amount.amount) {
							// 		const amount = await converCoin(item.amount)
							// 		item.amount.amount = amount.amount
							// 		if (item.amount.amount.toString().indexOf('.') !== -1) {
							// 			let splitNumber = item.amount.amount.toString().split('.')[1].substr(0, 2);
							// 			item.amount.amount = Number(`${item.amount.amount.toString().split('.')[0]}.${splitNumber}`) * 100
							// 		} else {
							// 			item.amount.amount = item.amount.amount * 100
							// 		}
							// 	}
							// });

							let totalAmount = res.reduce((total, item) => {
								return Number(item.amount.amount) + Number(total)
							}, 0);
							totalAmount = await converCoin({
								amount:totalAmount,
								denom:res[0].amount.denom,
							});
							this.totalDelegator = totalAmount.amount;
						}
						this.totalDelegatorValue = `${Tools.formatStringToFixedNumber(new BigNumber(this.totalDelegator.toString()).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`
					} else {
						this.delegationsItems = []
					}
				} catch (e) {
					console.error(e)
				}
			},
			async getUnBondingDelegationList (pageNum, pageSize, useCount = false) {
				try {
					const {data: res} = await getUnBondingDelegationListApi(this.$route.params.param, pageNum, pageSize, useCount)
					if (res && res.length > 0) {
						let copyResult = JSON.parse(JSON.stringify(res));
						this.unBondingDelegationPageNationArrayData = this.pageNation(copyResult);
						if (res.length > this.pageSize) {
							this.flUnBondingDelegationNextPage = true
						} else {
							this.flUnBondingDelegationNextPage = false
						}
            if(useCount){
              this.unBondingDelegationCountNum = res.count;
            }
						this.unBondingDelegationPageChange(this.unBondingDelegationCurrentPage);
						if (res.length > 0) {
							// res.forEach(async (item) => {
							// 	if (item.amount && item.amount.amount) {
							// 		let amount = await converCoin(item.amount)
							// 		item.amount.amount = amount.amount
							// 	}
							// });
							let totalUnBondingDelegator = res.reduce((total, item) => {
								return Number(item.amount.amount) + Number(total)
							}, 0)
							totalUnBondingDelegator = await converCoin({
								amount:totalUnBondingDelegator,
								denom:res[0].amount.denom,
							})
							this.totalUnBondingDelegator = totalUnBondingDelegator.amount;
						}
						this.totalUnBondingDelegatorValue = `${Tools.formatStringToFixedNumber(new BigNumber(this.totalUnBondingDelegator.toString()).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`
					}
				} catch (e) {
					console.error(e)
				}
			},
			async getRewardsItems () {
				let res = await getRewardsItemsApi(this.$route.params.param)
				try {
					if (res && res.rewards && res.rewards.length > 0) {
						res.rewards.map(item => {
							if (item.reward && item.reward.length === 0) {
								item.reward.push({
									amount: 0,
									denom: this.mainToken.denom
								})
							}
						});
						let copyResult = JSON.parse(JSON.stringify(res));
						let amount = await converCoin((res.total || [])[0])
						this.delegatorRewardsValue = res.total ? amount.amount : 0;
						this.totalDelegatorReward = amount.amount;
						this.rewardsDelegationPageNationArrayData = this.pageNation(copyResult.rewards);
						if (res.rewards.length > this.pageSize) {
							this.flRewardsDelegationNextPage = true
						} else {
							this.flRewardsDelegationNextPage = false
						}
						this.rewardsDelegationCountNum = res.rewards.length;
						this.rewardsDelegationPageChange(this.rewardsDelegationCurrentPage);
						this.totalDelegatorRewardValue = `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(this.totalDelegatorReward.toString(), 0)).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`
						this.allRewardsAmountValue = Number(this.delegatorRewardsValue) + Number(this.validatorRewardsValue)
						this.allRewardsValue = `${Tools.formatStringToFixedNumber(new BigNumber(this.allRewardsAmountValue.toString()).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`
						this.getAssetList()
					}
				} catch (e) {
					console.error(e)
				}
			},
			async getValidatorRewards () {
				try {
					if(this.OperatorAddress && this.OperatorAddress !== '--'){
						let data = await getValidatorRewardsApi(this.OperatorAddress)
						if (data) {
							let commission = data.val_commission && data.val_commission.commission &&  data.val_commission.commission[0]
							if (commission) {
								let amount = await converCoin(commission)
								this.validatorRewardsValue = amount.amount
								// this.totalValidatorRewards = `${ Number(amount.amount).toFixed(2)} ${this.mainToken.symbol.toUpperCase()}` || '--'
								this.totalValidatorRewards = `${Tools.formatStringToFixedNumber(new BigNumber(amount.amount.toString()).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}` || '--'
								this.allRewardsAmountValue = Number(this.delegatorRewardsValue) + Number(amount.amount)
							} else {
								this.totalValidatorRewards = '--'
							}
							this.allRewardsValue = `${Tools.formatStringToFixedNumber(this.allRewardsAmountValue.toString(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`
							this.getAssetList()
						}
					}
				} catch (e) {
					console.error(e)
				}
			},
			async delegationPageChange (pageNums) {
				let pageNum = pageNums - 1;
				this.delegationsItems = [];
				let data = this.flDelegationNextPage ? this.delegationPageNationArrayData[pageNum] : this.delegationPageNationArrayData;
				for(let item of data){
						let amount = await converCoin(item.amount)
						this.delegationsItems.push({
							address: item.address,
							// amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)} ${amount.denom.toUpperCase()}`,
							amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)}`,
							shares: new BigNumber((Number(item.shares)).toFixed(2)).toFormat(),
							block: item.height,
							moniker: item.moniker
						});
					}
			},
			async unBondingDelegationPageChange (pageNums) {
				let pageNum = pageNums - 1;
				this.unBondingDelegationsItems = [];
				let data = this.flUnBondingDelegationNextPage ? this.unBondingDelegationPageNationArrayData[pageNum] : this.unBondingDelegationPageNationArrayData;
				for (let item of data){
					let amount = await converCoin(item.amount)
					this.unBondingDelegationsItems.push({
						address: item.address,
						// amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)} ${amount.denom.toUpperCase()}`,
						amount: `${Tools.formatStringToFixedNumber(amount.amount.toString(), this.fixedNumber)}`,
						block: item.height,
						// endTime: Tools.format2UTC(item.end_time),
						endTime: Tools.getFormatDate(new Date(item.end_time).getTime()),
						moniker: item.moniker
					});
				}
			},
			async rewardsDelegationPageChange (pageNums) {
				let pageNum = pageNums - 1;
				this.rewardsItems = [];
				let data = this.flRewardsDelegationNextPage ? this.rewardsDelegationPageNationArrayData[pageNum] : this.rewardsDelegationPageNationArrayData;
				for(let item of data){
					if (item.reward && item.reward.length > 0) {
						let amount = await converCoin(item.reward[0])
						item.reward[0].amount = amount.amount
					}
					this.rewardsItems.push({
						address: item.validator_address,
						// amount: `${Tools.formatStringToFixedNumber(new BigNumber(item.reward[0].amount).toFormat(), this.fixedNumber)} ${this.mainToken.symbol.toUpperCase()}`,
						amount: `${Tools.formatStringToFixedNumber(new BigNumber(item.reward[0].amount).toFormat(), this.fixedNumber)}`,
						moniker: item.moniker
					});
				}
			},
			formatAddress (address) {
				return Tools.formatValidatorAddress(address) || '--';
			},
			handleChange(value) {
                value ? this.type_temp = value[1] ? value[1] : '' : ''
            }
		}
	}
</script>

<style scoped lang="scss">
	a {
		color: $t_link_c !important;
	}

	::v-deep .el-table__empty-block {
		height: 0.48rem !important;
		min-height: 0.48rem !important;
	}

	.address_container_content {
		padding: 0 0.15rem;

		.address_content_wrap {
			max-width: 12rem;
			margin: 0 auto;

			.address_content_title {
				display: flex;
				justify-content: flex-start;
				color: $t_first_c;
				font-size: $s18;
				line-height: 0.21rem;
				margin: 0.3rem 0 0.15rem 0rem;
				text-align: left;
				font-family: Arial;
				font-weight: 600;

				.address_content_title_first {
					white-space: nowrap;
					margin-right: 0.05rem;
				}

				.address_content_title_address {
					font-size: $s16;
					font-family: Arial;
					font-weight: 400;
					color: $t_first_c;
					line-height: 0.2rem;
					word-break: break-all;
				}
			}

			.address_tab_container {
				margin-bottom: 0.16rem;

				.address_tab_content {
					display: flex;
					// margin-left: 0.28rem;

					.address_tab_item {
						cursor: pointer;
						width: 1.2rem;
						height: 0.3rem;
						line-height: 0.3rem;
						border: 0.01rem solid $bd_first_c;
						border-right: none;
						font-size: 0.14rem;
						background-color: $bg_white_c;
					}

					.address_tab_item:last-child {
						border-right: 0.01rem solid $bd_first_c
					}
				}

				.active_content {
					background: $bg_button_c !important;
					color: $t_white_c;
				}
			}

			.address_content {
				background: $bg_white_c;
				padding: 0.25rem;
				border-radius: 0.05rem;
				// border: 0.01rem solid $bd_first_c;
				margin-bottom: 0.48rem;
			}

			.consumer_transaction_content {
				margin-bottom: 0.48rem;
				background: $bg_white_c;
				padding: 0.25rem;
				border-radius: 0.05rem;
				// border: 0.01rem solid $bd_first_c;
				.address_transaction_content_hash {
					display: flex;
					.status {
						.status_icon{
							width:0.13rem;
							height:0.13rem;
							margin-right:0.05rem;
						}
					}
				}
				.serviceNameText {
					color: $t_second_c;
				}
				.consumer_transaction_content_hash {
					display: flex;
					align-items: center;
				}

				.consumer_transaction_content_available {
					display: flex;
					align-items: center;

					.consumer_transaction_content_available_icon {
						width: 0.1rem;
						height: 0.1rem;
						border-radius: 50%;
						margin-right: 0.1rem;
					}
				}
			}

			.provider_transaction_content {
				margin-bottom: 0.48rem;
				background: $bg_white_c;
				padding: 0.25rem;
				border-radius: 0.05rem;
				// border: 0.01rem solid $bd_first_c;

				.respond_transaction_content_hash {
					display: flex;
					.status {
						.status_icon{
							width:0.13rem;
							height:0.13rem;
							margin-right:0.05rem;
						}
					}
				}
				.address_transaction_content_hash {
					display: flex;
					.status {
						.status_icon{
							width:0.13rem;
							height:0.13rem;
							margin-right:0.05rem;
						}
					}
				}
				.provider_transaction_content_available {
					display: flex;
					align-items: center;

					.provider_transaction_content_available_icon {
						width: 0.1rem;
						height: 0.1rem;
						border-radius: 50%;
						margin-right: 0.1rem;
					}
				}
			}

			.address_transaction_content {
				// margin-top: 0.48rem;
				margin-bottom: 0.2rem;
				background: $bg_white_c;
				padding: 0.25rem;
				border-radius: 0.05rem;
				// border: 0.01rem solid $bd_first_c;

				.address_transaction_content_hash {
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

					::v-deep.el-cascader{
						width: 1.3rem;
						margin-right: 0.1rem;
						.el-input{
							input::-webkit-input-placeholder{   /* 使用webkit内核的浏览器 */
								color: $t_first_c;
							}
							input:-moz-placeholder{    /* Firefox版本4-18 */
								color: $t_first_c;
							}
							input::-moz-placeholder{    /* Firefox版本19+ */
								color: $t_first_c;
							}
							input:-ms-input-placeholder{   /* IE浏览器 */
								color: $t_first_c;
							}
							.el-input__inner{
								padding-left: 0.07rem;
								height: 0.32rem;
								font-size: $s14 !important;
								line-height: 0.32rem;
								&::-webkit-input-placeholder{
									font-size: $s14 !important;
								}
							}
							.el-input__inner:focus{
								border-color: $theme_c !important;
							}
							.el-input__suffix{
								.el-input__suffix-inner{
									.el-input__icon{
										line-height: 0.32rem;
									}
								}
							}
						}
						.is-focus{
							.el-input__inner{
								border-color: $theme_c !important;
							}
						}
					}

					::v-deep .el-select {
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
						white-space: nowrap;
					}

					.address_transaction_condition_action {
						display: flex;

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
			}

			.content_title {
				color: $t_first_c;
				margin-bottom: 0.4rem;
				text-align: left;
				font-size: $s16;
				font-family: Arial;
				font-weight: 600;
				line-height: 22px;
			}

			.status_icon {
				width: 0.13rem;
				height: 0.13rem;
				margin-right: 0.05rem;
			}

			.delegations_wrap {
				margin: 0 auto;

				.delegations_container {
					display: flex;

					.validator_information_content_title {
						height: 0.2rem;
						line-height: 0.2rem;
						color: $t_first_c;
						font-size: $s18;
						margin-top: 0.3rem;
						// padding-left: 0.2rem;
						margin-bottom: 0.06rem !important;
						text-align: left;

						.address_information_delegation_value,
						.address_information_unbonding_delegation_value {
							font-size: $s14;
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
						border-radius: 0.05rem;
						// border: 0.01rem solid $bd_first_c;
						min-height: 2.34rem;
						background: $bg_white_c;
					}
				}

				.common_pagination_content {
					margin-top: 0.2rem;
					float: right;
				}
			}

			.address_information_redelegation_header_title {
				text-align: left;
				font-size: $s18;
				color: $t_first_c;
				line-height: 0.21rem;
				margin: 0.27rem 0 0 0rem;

				.address_information_redelegation_rewards_value {
					font-size: $s14;
					color: $t_second_c;
					line-height: 0.16rem;
					margin-left: 0.15rem;
				}
			}

			.address_information_redelegation_tx_container {
				text-align: left;
				display: flex;
				margin-bottom: 0.2rem;
				.address_information_delegator_rewards_content {
					width: calc(50% - 0.1rem);
					margin-right: 0.2rem;

					.address_information_detail_option {
						padding: 0 0 0.1rem 0rem;

						.address_information_detail_option_name {
							font-size: $s14;
							color: $t_second_c;
							margin-right: 0.1rem;
						}

						.address_information_detail_option_value {
							font-size: $s14;
							a {
								color: $theme_c !important;
							}
						}
					}

					.address_information_list_content {
						overflow-x: auto;
						box-sizing: border-box;
						border-radius: 0.05rem;
						// border: 0.01rem solid $bd_first_c;
						min-height: 2.34rem;
						background: $bg_white_c;
					}

					.pagination_content {
						margin-top: 0.2rem;
						display: flex;
						justify-content: flex-end;
					}
				}

				.address_information_detail_container {
					width: calc(50% - 0.1rem);

					.address_information_redelegation_title {
						width: 100%;
						font-size: $s18;
						color: $t_first_c;
						padding: 0 0 0.06rem 0rem;

						.address_information_validator_rewards_value {
							font-size: $s14;
							color: $t_second_c;
							line-height: 0.16rem;
							margin-left: 0.15rem;
						}
					}

					.address_information_detail_content {
						// border: 0.01rem solid $bd_first_c;
						border-radius: 0.05rem;
						background: $bg_white_c;
						box-sizing: border-box;
						padding: 0.2rem;
						min-height: 2.34rem;

						.address_information_detail_option {
							display: flex;
							align-items: center;

							.address_information_detail_option_name {
								min-width: 1.3rem;
								font-size: $s14;
								color: $t_second_c;
								line-height: 0.16rem;
								margin-right: 0.3rem;
							}

							.address_information_detail_option_value {
								font-size: $s14;
								color: $t_first_c;
								margin-right: 0.1rem;

								a {
									color: $theme_c !important;
								}
							}

							.address_information_address_status_active {
								background: $theme_c;
								font-size: $s12;
								color: $t_button_c;
								padding: 0.02rem 0.14rem;
								border-radius: 0.22rem;
								margin-right: 0.1rem;
							}

							.address_information_address_status_candidate {
								background: $bg_candidate_c;
								font-size: $s12;
								color: $t_button_c;
								padding: 0.02rem 0.14rem;
								border-radius: 0.22rem;
								margin-right: 0.1rem;
							}

							.address_information_address_status_jailed {
								background: $bg_jailed_c;
								font-size: $s12;
								color: $t_button_c;
								padding: 0.02rem 0.14rem;
								border-radius: 0.22rem;
								margin-right: 0.1rem;
							}
						}

					}
				}
			}

				 .pagination_content {
                display: flex;
                justify-content: space-between;
                margin: 0.1rem 0 0.2rem 0;
                .tooltip_box{
                  display: flex;
                  align-items: center;
                  background-color: white;
                  padding: 0.05rem 0.2rem;
                  font-size: $s12;
                  color: #8d8b8b;
                  .tooltip_title{
                    margin-right: 0.24rem;
                  }
                  .tooltip_title_box{
                    display: flex;
                  }
                   .tooltip_title_IBC {
                      margin-right: 0.24rem;
                      display: flex;
                      align-items: center;
                      position: relative;
                      &::before{
                        left: -0.12rem;
                        content: ' ';
                        position: absolute;
                        height: 0.08rem;
                        width: 0.08rem;
                        border-radius: 0.04rem;
                        background-color: #D47D78;
                      }
                    }
                    .tooltip_title_HTLT{
                      display: flex;
                      align-items: center;
                      position: relative;
                      &::before{
                        left: -0.12rem;
                        content: ' ';
                        position: absolute;
                        height: 0.08rem;
                        width: 0.08rem;
                        border-radius: 0.04rem;
                        background-color: #51A3A3;
                      }
                    }
                }
            }
		}
	}

	@media screen and (max-width: 1280px) {
		.address_container_content {
			.address_content_wrap {
				.address_content_title {
					.address_content_title_first {
					}

					.address_content_title_address {
					}
				}

				.address_asset_content {
				}

				.consumer_transaction_content {
					.consumer_transaction_content_hash {
					}

					.consumer_transaction_content_available {
						.consumer_transaction_content_available_icon {
						}
					}

					.pagination_content {
					}
				}

				.provider_transaction_content {
					.respond_transaction_content_hash {
					}

					.provider_transaction_content_available {
						.provider_transaction_content_available_icon {
						}
					}

					.pagination_content {
					}
				}

				.address_transaction_content {
					.address_transaction_content_hash {
					}

					.address_transaction_condition_container {
						.address_transaction_condition_count {
						}

						::v-deep .el-select {
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

					.pagination_content {
					}
				}

				.content_title {
				}

				.status_icon {
				}

				.delegations_wrap {
					.delegations_container {
						display: block;
						// margin-left: 0.2rem;
						.validator_information_content_title {
							// padding-left: 0rem;
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

				.address_information_redelegation_header_title {
					margin-left: 0rem;
				}

				.address_information_redelegation_tx_container {
					flex-direction: column;
					// margin: 0 0.1rem;
					.address_information_delegator_rewards_content {
						width: 100%;
						margin-right: 0;

						.address_information_detail_option {
							padding-left: 0;
							display: flex;
							.address_information_detail_option_value {
								padding-right: 0.1rem;
								word-break: break-word;
							}
						}

						.address_information_list_content {
							overflow-x: auto;
						}
					}

					.address_information_detail_container {
						width: 100%;

						.address_information_redelegation_title {
							padding: 0.2rem 0;
						}

						.address_information_detail_content {
							.address_information_detail_option {
								display: flex;
								align-items: center;
								flex-direction: row;
								.address_information_detail_option_name {
									margin-right: 0.05rem;
								}
								.validator_status_content {
									display: flex;
									margin: 0.05rem 0;
								}

								.address_information_detail_option_value {
									word-break: break-word;
								}
							}
						}
					}

					.hide_style {
						display: none;
					}
				}
			}
		}
	}

	@media screen and (max-width: 768px) {
		.address_container_content {
			.address_content_wrap {
				.address_content_title {
					.address_content_title_first {
					}

					.address_content_title_address {
					}
				}

				.address_content {
				}

				.consumer_transaction_content {
					.consumer_transaction_content_hash {
					}

					.consumer_transaction_content_available {
						.consumer_transaction_content_available_icon {
						}
					}
				}

				.provider_transaction_content {
					.respond_transaction_content_hash {
					}

					.provider_transaction_content_available {
						.provider_transaction_content_available_icon {
						}
					}
				}

				.address_transaction_content {
					.address_transaction_content_hash {
					}

					.address_transaction_condition_container {
						flex-direction: column;
						align-items: flex-start;

						.address_transaction_condition_count {
							margin-bottom: 0.1rem;
						}

						::v-deep .el-select {
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
				}

				.content_title {
				}

				.status_icon {
				}

				.pagination_content {
				}
			}
		}
	}
	@media screen and (max-width: 705px) {
		.address_container_content {
			.address_content_wrap {
				.address_content_title {
					margin-left: 0rem;
					.address_content_title_first {
					}

					.address_content_title_address {
					}
				}
				.address_tab_container {
					.address_tab_content {
						margin-left: 0rem;
					}
				}
				.address_content {

				}

				.consumer_transaction_content {
					.consumer_transaction_content_hash {
					}

					.consumer_transaction_content_available {
						.consumer_transaction_content_available_icon {
						}
					}
				}

				.provider_transaction_content {
					.respond_transaction_content_hash {
					}

					.provider_transaction_content_available {
						.provider_transaction_content_available_icon {
						}
					}
				}

				.address_transaction_content {
					.address_transaction_content_hash {
					}

					.address_transaction_condition_container {

						.address_transaction_condition_count {
						}

						::v-deep .el-select {

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
				}

				.content_title {
				}

				.status_icon {
				}

				.pagination_content {
				}
			}
		}
	}
	@media screen and (max-width: 551px) {
		.address_container_content {
			.address_content_wrap {
				.address_content_title {
					display: block;
					.address_content_title_first {
					}

					.address_content_title_address {
					}
				}

				.address_asset_content {
				}

				.consumer_transaction_content {
					.consumer_transaction_content_hash {
					}

					.consumer_transaction_content_available {
						.consumer_transaction_content_available_icon {
						}
					}

					.pagination_content {
					}
				}

				.provider_transaction_content {
					.respond_transaction_content_hash {
					}

					.provider_transaction_content_available {
						.provider_transaction_content_available_icon {
						}
					}

					.pagination_content {
					}
				}

				.address_transaction_content {
					.address_transaction_content_hash {
					}

					.address_transaction_condition_container {
						.address_transaction_condition_count {
						}

						::v-deep .el-select {
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

					.pagination_content {
					}
				}

				.content_title {
				}

				.status_icon {
				}

				.delegations_wrap {
					.delegations_container {
						.validator_information_content_title {
						}

						.one_table_container {
						}

						.second_table_container {
						}

						.delegations_table_container {
						}

						.common_pagination_content {
						}
					}
				}

				.address_information_redelegation_header_title {
				}

				.address_information_redelegation_tx_container {
					.address_information_delegator_rewards_content {
						.address_information_detail_option {
							display: block;
							.address_information_detail_option_value {
								display: block;
							}
						}

						.address_information_list_content {
						}
					}

					.address_information_detail_container {
						.address_information_redelegation_title {
						}

						.address_information_detail_content {
							.address_information_detail_option {
								.address_information_detail_option_name {
									min-width: 1.2rem;
									margin-right: 0.01rem;
								}
								.validator_status_content {
								}

								.address_information_detail_option_value {
								}
							}
						}
					}

					.hide_style {
					}
				}
			}
		}
	}
</style>
