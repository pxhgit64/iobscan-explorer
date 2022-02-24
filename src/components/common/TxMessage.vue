<template>
	<div class="tx_message_content" v-if="hide">
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.txType')}}：</span>
			<span>{{TX_TYPE_DISPLAY[txType] || txType}}</span>
		</p>
		<div v-if="txType === TX_TYPE.define_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.description')}}：</span>
				<span>{{description}}</span>
			</p>
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.schemas')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(schemas)" v-if="schemas" :text="schemas" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.author')}}：</span>
				<template>
					<span v-if="author == '--'">{{author}}</span>
<!--					<span v-else class="address_link" @click="addressRoute(author)">{{author}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${author}`">{{author}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.authorDescription')}}：</span>
				<span>{{authorDescription}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.tags')}}：</span>
				<span>{{tags}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.bind_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="defineName != '--'" :to="`/service?serviceName=${defineName}`">
					{{defineName}}
				</router-link>
				<span v-if="defineName == '--'"> -- </span>
			</p>
			<p v-if="isShowFee">
				<span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				<span>{{pricing}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.qos')}}：</span>
				<span>{{qos}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span>
					<!-- <span v-for="(item,index) in provider" :key="index"
				                   @click="addressRoute(item)" class="address_link">{{item}}
					</span> -->
<!--					<span @click="addressRoute(provider)" class="address_link">{{provider}} </span>-->
					<router-link class="address_link" :to="`/address/${provider}`">{{provider}}</router-link>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.bindService.options')}}：</span>
				<span>{{options}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${owner}`">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_record" class="record_container">
			<div class="record_content">
				<p class="record_name">{{$t('ExplorerLang.transactionInformation.createRecord.contents')}}：</p>
				<div class="record_list_content">
					<el-table class="table" :data="recordArray"
					          :empty-text="$t('ExplorerLang.table.emptyDescription')">
						<el-table-column width="300px" label="digest" prop="digest"></el-table-column>
						<el-table-column width="150px" label="digest algo"
						                 prop="digest_algo"></el-table-column>
						<el-table-column label="uri" prop="uri">
							<template slot-scope="scope">
								<a v-if="scope.row.uri && scope.row.uri !== '--'"
								   :download="scope.row.uri" :href="scope.row.uri" target="_blank">{{scope.row.uri}}</a>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column width="200px" label="meta" prop="meta"></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div v-if="txType === TX_TYPE.burn_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.mint_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="recipient === '--'">{{recipient}}</span>
<!--					<span v-else @click="addressRoute(recipient)" class="address_link">{{recipient}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${recipient}`">{{recipient}}</router-link>
				</template>
			</p>
			
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(tokenData)" v-if="tokenData" :text="tokenData" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<!-- <a v-if="tokenUri !== '--' && tokenUri !== '[do-not-modify]'" :href="tokenUri" target="_blank">{{tokenUri}}</a>
					<span v-else>{{tokenUri}}</span> -->
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
								<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{tokenUri}}</a>
								<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri" target="_blank">{{tokenUri}}</a>
								<span class="text" v-else>{{tokenUri}}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{tokenUri}}</span>
					<span v-else>--</span>
				</template>
			</p>

		</div>
		<div v-if="txType === TX_TYPE.transfer_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="recipient === '--'">{{recipient}}</span>
<!--					<span v-else @click="addressRoute(recipient)" class="address_link">{{recipient}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${recipient}`">{{recipient}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(tokenData)" v-if="tokenData" :text="tokenData"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<!-- <a v-if="tokenUri !== '--' && tokenUri !== '[do-not-modify]'" :href="tokenUri" target="_blank">{{tokenUri}}</a>
					<span v-else>{{tokenUri}}</span> -->
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
								<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{tokenUri}}</a>
								<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri" target="_blank">{{tokenUri}}</a>
								<span class="text" v-else>{{tokenUri}}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{tokenUri}}</span>
					<span v-else>--</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(tokenData)" v-if="tokenData" :text="tokenData" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<!-- <a v-if="tokenUri !== '--' && tokenUri !== '[do-not-modify]'" :href="tokenUri" target="_blank">{{tokenUri}}</a>
					<span v-else>{{tokenUri}}</span> -->
					<div class="wrap" v-if="tokenUri && tokenUri !== '[do-not-modify]'">
								<a class="text" v-if="Tools.testUrl(tokenUri)" :href="tokenUri" target="_blank">{{tokenUri}}</a>
								<a class="text" v-else-if="startStr(tokenUri)" :href="'http://' + tokenUri" target="_blank">{{tokenUri}}</a>
								<span class="text" v-else>{{tokenUri}}</span>
					</div>
					<span v-else-if=" tokenUri === '[do-not-modify]'">{{tokenUri}}</span>
					<span v-else>--</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.issue_denom">
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.denomId')}}</span>
			<span>{{denomId}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.denomName')}}</span>
			<span>{{denomName}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.symbol')}}</span>
			<span>{{symbol}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.schema')}}</span>
			<span>{{schema}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.mintRestricted')}}</span>
			<span>{{mintRestricted}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.nft.updateRestricted')}}</span>
			<span>{{updateRestricted}}</span>
		</p>
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.issueDenom.sender')}}：</span>
			<template>
				<span v-if="sender === '--'">{{sender}}</span>
				<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
				<router-link v-else class="address_link" :to="`/address/${sender}`">{{sender}}</router-link>
			</template>
		</p>
		</div>
		<div v-if="txType === TX_TYPE.send">
			    <p>
                    <span>{{$t('ExplorerLang.transactionInformation.send.amount')}}：</span>
                    <span>
                        <p style="margin-bottom: 0.05rem" v-for="item in amountArray" :key="item">{{item}}</p>
                    </span>
                </p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="from === '--'">{{from}}</span>
<!--					<span v-else @click="addressRoute(from)" class="address_link">{{from}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${from}`">{{from}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="to === '--'">{{to}}</span>
<!--					<span v-else @click="addressRoute(to)" class="address_link">{{to}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${to}`">{{to}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.respond_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.requestId')}}：</span>
				<span>{{(requestId || '').toUpperCase()}}</span>
			</p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
<!--					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${provider}`">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.result')}}：</span>
				<span>{{result}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.output')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(output)" v-if="output" :text="output"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight" />
			</p>
		</div>
		<div v-if="txType === TX_TYPE.call_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '--').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
<!--					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>-->
					<router-link v-else class="address_link" :to="`/address/${consumer}`">{{consumer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.input')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(input)" v-if="input" :text="input"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight" />
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column">
<!--					<span
						v-for="(item,index) in provider" :key="index"
						@click="addressRoute(item)" class="address_link">{{item}}</span>-->
				<router-link v-for="(item,index) in provider"
							 :key="index"
							 class="address_link" :to="`/address/${item}`">{{item}}</router-link>
				</span>
				
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.repeated')}}：</span>
				<span>{{repeated}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}：</span>
				<span>{{repeatedFrequency}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedTotal')}}：</span>
				<span>{{repeatedTotal}}</span>
			</p>
			<p v-if="isShowFee">
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.superMode')}}：</span>
				<span>{{superMode}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}：</span>
				<span>{{timeout}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.pause_request_context ||
                   txType === TX_TYPE.start_request_context ||
                   txType === TX_TYPE.kill_request_context">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
<!--					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>-->
					<router-link v-else  class="address_link" :to="`/address/${consumer}`">{{consumer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.update_request_context">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<!--  <p>
				 <span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				 <span>{{pricing}}</span>
			 </p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
<!--					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>-->
					<router-link  v-else :to="`/address/${consumer}`" class="address_link">{{consumer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column" v-if="provider.length > 0">
<!--                    <span
		                    v-for="(item,index) in provider"
		                    :key="index"
		                    @click="addressRoute(item)" class="address_link">
                        {{item}}
                    </span>-->
					<router-link v-for="(item,index) in provider"
								 :key="index"
								 :to="`/address/${item}`" class="address_link">{{item}}</router-link>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}：</span>
				<span>{{repeatedFrequency}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedTotal')}}：</span>
				<span>{{repeatedTotal}}</span>
			</p>
			<p v-if="isShowFee">
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}：</span>
				<span>{{timeout}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.update_service_binding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p v-if="isShowFee">
				 <span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				 <span>{{pricing}}</span>
			 </p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.qos')}}：</span>
				<span>{{qos}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
<!--					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>-->
					<router-link v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.disable_service_binding || txType === TX_TYPE.refund_service_deposit">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
<!--					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>-->
					<router-link v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.enable_service_binding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
<!--					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>-->
					<router-link v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.recv_packet && prodConfig.txDetail && prodConfig.txDetail.ibc">
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.packet')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(packet)"  v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proof')}}：</span>
				<span>{{proof}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofHeight')}}：</span>
				<span>{{proofHeight}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofPath')}}：</span>
				<span>{{proofPath}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofData')}}：</span>
				<LargeString v-if="proofData" :text="proofData"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.module')}}：</span>
				<span>{{module}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.recv_packet && !(prodConfig.txDetail && prodConfig.txDetail.ibc)">
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.packet')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(packet)"
                             expand
                             v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p> -->
            <p>
                <span>{{$t('ExplorerLang.transactionInformation.ibc.amount')}}</span>
                <span>{{amount.amount}} {{ (amount.denom || '').toUpperCase()}}</span>
            </p>
            <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.from')}}：</span>
<!--                <span @click="addressRoute(sender)" class="address_link">{{ sender }}</span>-->
				<router-link :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
			</p>
            <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.to')}}：</span>
<!--                <span @click="addressRoute(receiver)" class="address_link">{{ receiver }}</span>-->
				<router-link :to="`/address/${receiver}`" class="address_link">{{receiver}}</router-link>
			</p>

			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofCommitment')}}：</span>
				<LargeString v-if="proofCommitment" :text="proofCommitment"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<!-- MsgTypeIBCTransfer -->
		<div v-if="txType === TX_TYPE.transfer">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.sourcePort')}}：</span>
				<span>{{sourcePort}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.sourceChannel')}}：</span>
				<span>{{sourceChannel}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.token')}}：</span>
                <span>{{ token.amount }} {{ (token.denom || '').toUpperCase() }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.sender')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)"
                          :class="(sender.startsWith(COSMOS_ADDRESS_PREFIX) || sender.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
                    >{{sender}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.receiver')}}：</span>
                <template>
                    <span v-if="sender === '--'">{{receiver}}</span>
                    <span v-else @click="addressRoute(receiver)"
                          :class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
                    >{{receiver}}</span>
                </template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.timeoutHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(timeoutHeight)" v-if="timeoutHeight" :text="timeoutHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.timeoutTimestamp')}}：</span>
				<span>{{timeoutTimestamp}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_identity || txType === TX_TYPE.update_identity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.id')}}：</span>
				<template>
					<span v-if="id === '--'">{{id}}</span>
					<router-link v-else :to="`/identity/${id}`">{{id}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubkey')}}：</span>
				<LargeString  v-if="pubkey" :text="pubkey"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubKeyAlgo')}}：</span>
				<span>{{pubKeyAlgo}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.certificate')}}：</span>
				<LargeString v-if="certificate" :text="certificate"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.credentials')}}：</span>
				<span v-if="credentials === '--'">{{credentials}}</span>
                <span v-else><a :href="credentials" target="_blank">{{credentials}}</a></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_client && prodConfig.txDetail && prodConfig.txDetail.ibc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.header')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(header)" v-if="header" :text="header"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_client && !(prodConfig.txDetail && prodConfig.txDetail.ibc)">
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientState')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(clientState)" v-if="clientState" :text="clientState"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusState')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(consensusState)" v-if="consensusState" :text="consensusState"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.update_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.client.header')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(header)"  v-if="header" :text="header"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.upgrade_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientState')}}：</span>
				<span>{{clientState}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusState')}}：</span>
				<span>{{consensusState}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUpgradeClient')}}：</span>
				<span>{{proofUpgradeClient}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUpgradeConsensusState')}}：</span>
				<span>{{proofUpgradeConsensusState}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.submit_misbehaviour">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.misbehaviour')}}：</span>
				<span>{{misbehaviour}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.connection_open_init">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterparty')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(counterparty)" v-if="counterparty" :text="counterparty"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.version')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(version)" v-if="version" :text="version"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.delayPeriod')}}：</span>
				<span>{{delayPeriod}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.connection_open_try">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.previousConnectionId')}}：</span>
				<span>{{previousConnectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientState')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(clientState)" v-if="clientState" :text="clientState"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterparty')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(counterparty)" v-if="counterparty" :text="counterparty"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.delayPeriod')}}：</span>
				<span>{{delayPeriod}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyVersions')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(counterpartyVersions)" v-if="counterpartyVersions" :text="counterpartyVersions"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)"  v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofInit')}}：</span>
				<LargeString v-if="proofInit" :text="proofInit"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofClient')}}：</span>
				<LargeString v-if="proofClient" :text="proofClient"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofConsensus')}}：</span>
				<LargeString v-if="proofConsensus" :text="proofConsensus"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(consensusHeight)" v-if="consensusHeight" :text="consensusHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.connection_open_ack">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.connectionId')}}：</span>
				<span>{{connectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyConnectionId')}}：</span>
				<span>{{counterpartyConnectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.version')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(version)" v-if="version" :text="version"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.clientState')}}：</span>
				<span>{{clientState}}</span>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofTry')}}：</span>
				<span>{{proofTry}}</span>
			</p>-->
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofClient')}}：</span>
				<span>{{proofClient}}</span>
			</p>-->
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofConsensus')}}：</span>
				<span>{{proofConsensus}}</span>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.consensusHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(consensusHeight)" v-if="consensusHeight" :text="consensusHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.connection_open_confirm">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.connectionId')}}：</span>
				<span>{{connectionId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofAck')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofAck)" v-if="proofAck" :text="proofAck"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.channel_open_init">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channel')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(channel)" v-if="channel" :text="channel"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.channel_open_try">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.previousChannelId')}}：</span>
				<span>{{previousChannelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channel')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(channel)" v-if="channel" :text="channel"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyVersion')}}：</span>
				<span>{{counterpartyVersion}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofInit')}}：</span>
				<span>{{proofInit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)"  v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.channel_open_ack">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyChannelId')}}：</span>
				<span>{{counterpartyChannelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.counterpartyVersion')}}：</span>
				<span>{{counterpartyVersion}}</span>
			</p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofTry')}}：</span>
				<span>{{proofTry}}</span>
			</p> -->
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofTry')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofTry)" v-if="proofTry" :text="proofTry"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.channel_open_confirm">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofAck')}}：</span>
				<span>{{proofAck}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.channel_close_init">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.channel_close_confirm">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.portId')}}：</span>
				<span>{{portId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.channelId')}}：</span>
				<span>{{channelId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofInit')}}：</span>
				<span>{{proofInit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link  v-else :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.timeout_packet">
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.packet')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(packet)" v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p> -->
            <p>
                <span>{{$t('ExplorerLang.transactionInformation.ibc.amount')}}</span>
                <span>{{amount.amount}} {{ (amount.denom || '').toUpperCase()}}</span>
            </p>
            <p>
                <span>{{$t('ExplorerLang.transactionInformation.ibc.from')}}：</span>
<!--                <span @click="addressRoute(sender)" class="address_link">{{ sender }}</span>-->
				<router-link  :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
            </p>
            <p>
                <span>{{$t('ExplorerLang.transactionInformation.ibc.to')}}：</span>
<!--                <span @click="addressRoute(receiver)" class="address_link">{{ receiver }}</span>-->
				<router-link  :to="`/address/${receiver}`" class="address_link">{{receiver}}</router-link>
            </p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUnreceived')}}：</span>
				<LargeString v-if="proofUnreceived" :text="proofUnreceived"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.nextSequenceRecv')}}：</span>
				<span>{{nextSequenceRecv}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.timeout_on_close_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.packet')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(packet)" v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofUnreceived')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofUnreceived)" v-if="proofUnreceived" :text="proofUnreceived"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofClose')}}：</span>
				<span>{{proofClose}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.nextSequenceRecv')}}：</span>
				<span>{{nextSequenceRecv}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.acknowledge_packet">
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.packet')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(packet)" v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.acknowledgement')}}：</span>
				<span>{{acknowledgement}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.token')}}：</span>
				<span>{{amount}}</span>
			</p>

<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofAcked')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofAcked)" v-if="proofAcked" :text="proofAcked"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.ibc.proofHeight')}}：</span>
				<LargeString :isShowPre="Tools.isJSON(proofHeight)" v-if="proofHeight" :text="proofHeight"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
<!--					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>-->
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>

		<div v-if="txType === TX_TYPE.begin_redelegate">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<!-- <p>
				 <span>Shares </span>
				 <span>{{from}}</span>
			 </p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
			<!--<p>
				<span>Shares </span>
				<span>{{from}}</span>
			</p>-->
			<!--<p>
				<span>End Time </span>
				<span>{{from}}</span>
			</p>-->
		</div>
		<div v-if="txType === TX_TYPE.create_validator">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'">{{operatorAddress}}</span>
<!--					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>-->
					<router-link v-else  :to="`/address/${operatorAddress}`" class="address_link">{{operatorAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.moniker')}}</span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.identity')}}</span>
				<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
				<span v-else>{{identity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.selfBonded')}}</span>
				<span>{{selfBond}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.minSelfDelegation')}}</span>
				<span>{{minSelfDelegation}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.ownerAddress')}}</span>
				<template>
					<span v-if="ownerAddress === '--'">{{ownerAddress}}</span>
<!--					<span v-else @click="addressRoute(ownerAddress)" class="address_link">{{ownerAddress}}</span>-->
					<router-link v-else  :to="`/address/${ownerAddress}`" class="address_link">{{ownerAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.consensusPubkey')}}</span>
				<span>{{consensusPubkey}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.commissionRate')}}</span>
				<span>{{commissionRate}}
					<el-tooltip placement="top" v-if="commissionRate">
  						<div slot="content" >
							<p>Max Rate : {{commissionMaxRate || '--'}}</p>
                            <p>Max Change Rate : {{commissionMaxChangeRate || '--'}}</p>
						</div>
						<i class="iconfont icontishi"></i>
					</el-tooltip>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.website')}}</span>
				<template>
					<span v-if="website !== '--' && website !== '[do-not-modify]' " class="website_link" @click="openUrl(website)">{{website}}</span>
					<span v-else>{{website}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.details')}}</span>
				<span>{{details}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.securityContact')}}</span>
				<span>{{securityContact}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_delegator_reward">
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_validator_commission">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.validator')}}</span>
				<template>
					<span v-if="moniker === '--' && validatorAddress === '--' ">{{ moniker || validatorAddress }}</span>
					<span v-else @click="addressRoute(validatorAddress)" class="address_link">{{ moniker || validatorAddress}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.set_withdraw_address">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.delegatorAddress')}}</span>
				<template>
					<span v-if="delegatorAddress === '--'">{{delegatorAddress}}</span>
<!--					<span v-else @click="addressRoute(delegatorAddress)" class="address_link">{{delegatorAddress}}</span>-->
					<router-link v-else  :to="`/address/${delegatorAddress}`" class="address_link">{{delegatorAddress}}</router-link>
					
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.withdrawAddress')}}</span>
				<template>
					<span v-if="withdrawAddress === '--'">{{withdrawAddress}}</span>
<!--					<span v-else @click="addressRoute(withdrawAddress)" class="address_link">{{withdrawAddress}}</span>-->
					<router-link v-else  :to="`/address/${withdrawAddress}`" class="address_link">{{withdrawAddress}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.begin_unbonding">
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_validator">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'">{{operatorAddress}}</span>
<!--					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>-->
					<router-link v-else  :to="`/address/${operatorAddress}`" class="address_link">{{operatorAddress}}</router-link>
				</template>
				<!-- <template>
					<span v-if="operMoniker === '--' && operatorAddress === '--' ">{{ operMoniker || operatorAddress }}</span>
					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{ operMoniker || operatorAddress}}</span>
				</template> -->

			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.moniker')}}</span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.identity')}}</span>
				<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
				<span v-else>{{identity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.minSelfDelegation')}}</span>
				<span>{{minSelfDelegation}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.commissionRate')}}</span>
				<span>{{commissionRate}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.website')}}</span>
				<template>
					<span v-if="website !== '--' && website !== '[do-not-modify]'" class="website_link" @click="openUrl(website)">{{website}}</span>
					<span v-else>{{website}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.details')}}</span>
				<span>{{details}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.securityContact')}}</span>
				<span>{{securityContact}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.delegate">
      <p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.fund_community_pool">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.depositor')}}</span>
				<template>
					<span v-if="depositor === '--'">{{depositor}}</span>
					<!-- <span @click="addressRoute(depositor)" class="address_link">{{depositor}}</span> -->
					<router-link :to="`/address/${depositor}`" class="address_link">{{depositor}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.swap_order">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.isBuyOrder')}}</span>
				<span>{{isBuyOrder}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.inputAddress')}}</span>
				<template>
					<span v-if="inputAddress === '--'">{{inputAddress}}</span>
<!--					<span v-else @click="addressRoute(inputAddress)" class="address_link">{{ inputAddress }}</span>-->
					<router-link v-else :to="`/address/${inputAddress}`" class="address_link">{{inputAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.Input')}}</span>
				<span>{{input}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.outputAddress')}}</span>
				<template>
					<span v-if="outputAddress === '--'">{{outputAddress}}</span>
<!--					<span v-else @click="addressRoute(outputAddress)" class="address_link">{{ outputAddress }}</span>-->
					<router-link v-else :to="`/address/${outputAddress}`" class="address_link">{{outputAddress}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.output')}}</span>
				<span>{{output}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.tokenPair')}}</span>
				<span>{{tokenPair || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.add_liquidity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{ sender }}</span>-->
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.exactIrisAmt')}}</span>
				<span>{{exactIrisAmt}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.maxToken')}}</span>
				<span>{{maxToken}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.amount')}}</span>
				<span>{{amount || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minLiquidity')}}</span>
				<span>{{minLiquidity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.tokenPair')}}</span>
				<span>{{tokenPair || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.remove_liquidity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{ sender }}</span>-->
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.withdrawLiquidity')}}</span>
				<span>{{withdrawLiquidity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minIrisAmt')}}</span>
				<span>{{minIrisAmt}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minToken')}}</span>
				<span>{{minToken}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.amount')}}</span>
				<span>{{amount || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.tokenPair')}}</span>
				<span>{{tokenPair || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.unjail">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'">{{operatorAddress}}</span>
<!--					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>-->
					<router-link v-else :to="`/address/${operatorAddress}`" class="address_link">{{operatorAddress}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}: </span>
				<template>
					<span v-if="serviceName == '--'"> -- </span>
					<router-link v-else :to="`/service?serviceName=${serviceName}`">
						{{serviceName}}
					</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.description')}}: </span>
				<span>{{ description }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.latestHistory')}}: </span>
				<span>{{ latestHistory }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'">{{ creator }}</span>
<!--					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>-->
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.providers')}}: </span>
				<span style="display: flex;flex-direction: column" v-if="providers.length > 0">
<!--                    <span
		                    v-for="(item,index) in providers"
		                    :key="index"
		                    @click="addressRoute(item)" class="address_link">
                        {{item}}
                    </span>-->
					<router-link v-for="(item,index) in providers"
								 :key="index" :to="`/address/${item}`" class="address_link">{{item}}</router-link>
                </span>
				<span v-else>--</span>
			</p>
<!--			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.input')}}:</span>
				<span>{{ input }}</span>
			</p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.aggregateFunc')}}: </span>
				<span>{{ aggregateFunc }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.valueJsonPath')}}: </span>
				<span>{{ valueJsonPath }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}: </span>
				<span>{{ repeatedFrequency }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.responseThreshold')}}: </span>
				<span>{{ responseThreshold }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}: </span>
				<span>{{ timeout }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.start_feed || txType === TX_TYPE.pause_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'">{{ creator }}</span>
					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>
					<!-- <router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link> -->
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.description')}}: </span>
				<span>{{ description }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.latestHistory')}}: </span>
				<span>{{ latestHistory }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'">{{ creator }}</span>
<!--					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>-->
					<router-link v-else :to="`/address/${creator}`" class="address_link">{{creator}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.providers')}}: </span>
				<span style="display: flex;flex-direction: column" v-if="providers.length > 0">
<!--                    <span
		                    v-for="(item,index) in providers"
		                    :key="index"
		                    @click="addressRoute(item)" class="address_link">
                        {{item}}
                    </span>-->
					<router-link  v-for="(item,index) in providers"
								  :key="index" :to="`/address/${item}`" class="address_link">{{item}}</router-link>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}: </span>
				<span>{{ repeatedFrequency }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.responseThreshold')}}: </span>
				<span>{{ responseThreshold }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}: </span>
				<span>{{ timeout }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.request_rand">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.random.blockInterval')}}: </span>
				<span>{{ blockInterval }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}: </span>
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
<!--					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>-->
					<router-link  v-else :to="`/address/${consumer}`" class="address_link">{{consumer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.random.oracle')}}: </span>
				<span>{{ oracle }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.service_set_withdraw_address">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.withdrawAddress')}}</span>
				<template>
					<span v-if="withdrawAddress === '--'">{{withdrawAddress}}</span>
<!--					<span @click="addressRoute(withdrawAddress)" class="address_link">{{withdrawAddress}}</span>-->
					<router-link  v-else :to="`/address/${withdrawAddress}`" class="address_link">{{withdrawAddress}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_earned_fees">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}: </span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
<!--					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>-->
					<router-link  v-else :to="`/address/${provider}`" class="address_link">{{provider}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>

		<div v-if="txType === TX_TYPE.issue_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.name')}}: </span>
				<span>{{ name }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.minUnit')}}: </span>
				<span>{{ minUnit }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.decimal')}}: </span>
				<span>{{ decimal }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.initialSupply')}}: </span>
				<span>{{ initialSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.maxSupply')}}: </span>
				<span>{{ maxSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.mintable')}}: </span>
				<span>{{ mintable }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.name')}}: </span>
				<span>{{ name }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.maxSupply')}}: </span>
				<span>{{ maxSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.mintable')}}: </span>
				<span>{{ mintable }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.mint_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.tokenId')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
<!--					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>-->
					<router-link  v-else :to="`/address/${owner}`" class="address_link">{{owner}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.amount')}}: </span>
				<span>{{ amount }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.to')}}: </span>
				<template>
					<span v-if="to === '--'">{{to}}</span>
<!--					<span v-else @click="addressRoute(to)" class="address_link">{{to}}</span>-->
					<router-link  v-else :to="`/address/${to}`" class="address_link">{{to}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.transfer_token_owner">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.tokenId')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.originalOwner')}}: </span>
				<template>
					<span v-if="originalOwner === '--'">{{originalOwner}}</span>
<!--					<span v-else @click="addressRoute(originalOwner)" class="address_link">{{originalOwner}}</span>-->
					<router-link  v-else :to="`/address/${originalOwner}`" class="address_link">{{originalOwner}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.newOwner')}}: </span>
				<template>
					<span v-if="newOwner === '--'">{{newOwner}}</span>
<!--					<span v-else @click="addressRoute(newOwner)" class="address_link">{{newOwner}}</span>-->
					<router-link  v-else :to="`/address/${newOwner}`" class="address_link">{{newOwner}}</router-link>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.burn_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.sender')}}: </span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link  v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.amount')}}: </span>
				<span>{{ amount }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.deposit">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.depositor')}}: </span>
				<template>
					<span v-if="depositor === '--'">{{depositor}}</span>
<!--					<span v-else @click="addressRoute(depositor)" class="address_link">{{depositor}}</span>-->
					<router-link  v-else :to="`/address/${depositor}`" class="address_link">{{depositor}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.proposalID')}}: </span>
				<template>
					<span v-if="proposalID === '--'">{{proposalID}}</span>
					<router-link :to="`/ProposalsDetail/${proposalID}`">{{proposalID}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.deposit')}}: </span>
				<span>{{deposit}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.vote">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.voter')}}: </span>
				<template>
					<span v-if="voter === '--'">{{voter}}</span>
<!--					<span v-else @click="addressRoute(voter)" class="address_link">{{voter}}</span>-->
					<router-link  v-else :to="`/address/${voter}`" class="address_link">{{voter}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.proposalID')}}: </span>
				<template>
					<span v-if="proposalID === '--'">{{proposalID}}</span>
					<router-link :to="`/ProposalsDetail/${proposalID}`">{{proposalID}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.option')}}: </span>
				<span>{{option}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.submit_proposal">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.proposer')}} : </span>
				<template>
					<span v-if="proposer === '--'">{{proposer}}</span>
<!--					<span v-else @click="addressRoute(proposer)" class="address_link">{{proposer}}</span>-->
					<router-link  v-else :to="`/address/${proposer}`" class="address_link">{{proposer}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.title')}}: </span>
				<span>{{title}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.initialDeposit')}}: </span>
				<span>{{initialDeposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.gov.description')}} : </span>
				<span>{{description}}</span>
			</p>
			<p v-if="parameter">
				<span>{{$t('ExplorerLang.transactionInformation.gov.parameter')}} : </span>
				<span>{{parameter}}</span>
			</p>
			<p v-if="name">
				<span>{{$t('ExplorerLang.transactionInformation.gov.name')}} : </span>
				<span>{{name}}</span>
			</p>
			<p v-if="time">
				<span>{{$t('ExplorerLang.transactionInformation.gov.time')}} : </span>
				<span>{{time}}</span>
			</p>
			<p v-if="switchHeight">
				<span>{{$t('ExplorerLang.transactionInformation.gov.switchHeight')}} : </span>
				<span>{{switchHeight}}</span>
			</p>
			<p v-if="info">
				<span>{{$t('ExplorerLang.transactionInformation.gov.info')}} : </span>
				<span>{{info}}</span>
			</p>
			<p v-if="switchHeight">
				<span>{{$t('ExplorerLang.transactionInformation.gov.upgradedClientState')}} : </span>
				<span>{{upgradedClientState}}</span>
			</p>
			<p v-if="recipient">
				<span>{{$t('ExplorerLang.transactionInformation.gov.recipient')}} : </span>
				<span>{{recipient}}</span>
			</p>
			<p v-if="amount">
				<span>{{$t('ExplorerLang.transactionInformation.gov.amount')}} : </span>
				<span>{{amount}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.multisend">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.multisend.inputs')}}: </span>
				<span>
					<p v-for="(input,index) in inputs" :key="index" class="address_container">
<!--						<span @click="addressRoute(input.address)" class="address_link">{{input.address}}</span>-->
						<router-link :to="`/address/${input.address}`" class="address_link">{{input.address}}</router-link>
						<span>{{input.amount}}</span>
					</p>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.multisend.outputs')}}: </span>
				<span>
					<p v-for="(output,index) in outputs" :key="index" class="address_container">
<!--						<span @click="addressRoute(output.address)" class="address_link">{{output.address}}</span>-->
						<router-link :to="`/address/${output.address}`" class="address_link">{{output.address}}</router-link>
						<span>{{output.amount}}</span>
					</p>
				</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_htlc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.id')}} : </span>
				<span>{{id || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.amount')}} : </span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.sender')}} : </span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.to')}} : </span>
				<template>
					<span v-if="to === '--'">{{to}}</span>
<!--					<span v-else @click="addressRoute(to)" class="address_link">{{to}}</span>-->
					<router-link v-else :to="`/address/${to}`" class="address_link">{{to}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.receiverOnOtherChain')}} : </span>
				<span>{{receiverOnOtherChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.senderOnOtherChain')}} : </span>
				<span>{{senderOnOtherChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.hashLock')}} : </span>
				<span>{{hashLock}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.timestamp')}} : </span>
				<span>{{timestamp}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.timeLock')}} : </span>
				<span>{{timeLock}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.transfer')}} : </span>
				<span>{{transfer}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.claim_htlc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.id')}} : </span>
				<span>{{id}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.amount')}} : </span>
				<span>{{amount || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.secret')}} : </span>
				<span>{{secret}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.sender')}} : </span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.recipient')}} : </span>
				<template>
					<span v-if="recipient === '--'">{{recipient}}</span>
<!--					<span v-else @click="addressRoute(recipient)" class="address_link">{{recipient}}</span>-->
					<router-link v-else :to="`/address/${recipient}`" class="address_link">{{recipient}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.hashLock')}} : </span>
				<span>{{hashLock || '--'}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.transfer')}} : </span>
				<span>{{transfer}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.refund_htlc">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.htlc.sender')}} : </span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
<!--					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>-->
					<router-link class="address_link" :to="`/address/${sender}`"></router-link>
				</template>
			</p>
			<p v-if="hashLock">
				<span>{{$t('ExplorerLang.transactionInformation.htlc.hashLock')}} : </span>
				<span>{{hashLock}}</span>
			</p>
		</div>
		<!--新增TIBC NFT Transfer Out-->
		<div v-if="txType === TX_TYPE.tibc_nft_transfer">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.idTibc')}}</span>
				<span>{{idTibc}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.classTibc')}}</span>
				<span>{{classTibc}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
				<span>{{destChain}}</span>
			</p>
			<p>
			<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
				<span>{{realayChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.receiver')}}</span>
				<template>
					<span v-if="sender === '--'">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
						  :class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
					>{{receiver}}</span>
				</template>
			</p>

			</div>
		<!--新增TIBC NFT Transfer In -->
		<div v-if="txType === TX_TYPE.tibc_recv_packet">
				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.idTibc')}}</span>
					<span>{{idTibc}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.urlTibc')}}</span>
					<span>{{urlTibc}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.classTibc')}}</span>
					<span>{{classTibc}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.sequence')}}</span>
					<span>{{sequence}}</span>
				</p>

				<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.port')}}</span>
				<span>{{port}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.sourceChain')}}</span>
					<span>{{sourceChain}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
					<span>{{destChain}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
					<span>{{realayChain}}</span>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.sender')}}</span>
					<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
					</template>
				</p>

				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.receiver')}}</span>
					<template>
					<span v-if="sender === '--'">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
			  		:class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
					>{{receiver}}</span>
					</template>
				</p>

<!--				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.nftStatus')}}</span>
					<span>{{ nftStatus}}</span>
				</p>-->
				<p>
					<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
					<template>
						<span v-if="signer === '--'">{{signer}}</span>
						<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
					</template>
				</p>
		</div>
		<!--新增TIBC Acknowledge Packet-->
        <div v-if="txType === TX_TYPE.tibc_acknowledge_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.idTibc')}}</span>
				<span>{{idTibc}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.urlTibc')}}</span>
				<span>{{urlTibc}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.classTibc')}}</span>
				<span>{{classTibc}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sequence')}}</span>
				<span>{{sequence}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.port')}}</span>
				<span>{{port}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sourceChain')}}</span>
				<span>{{sourceChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
				<span>{{destChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
				<span>{{realayChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.receiver')}}</span>
				<template>
					<span v-if="sender === '--'">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
					  	:class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
						>{{receiver}}</span>
				</template>
		</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.nftStatus')}}</span>
				<span>{{nftStatus}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
		<!--TIBC Clean Packet Out-->
		<div v-if="txType === TX_TYPE.clean_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sequence')}}</span>
				<span>{{sequence}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.sourceChain')}}</span>
				<span>{{sourceChain}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.destChain')}}</span>
				<span>{{destChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.realayChain')}}</span>
				<span>{{realayChain}}</span>
			</p>

			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
        <!--  TIBC Clean Packet In-->
		<div v-if="txType === TX_TYPE.recv_clean_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.cleanPacket')}}</span>
				<span>{{cleanPacket}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
        <!--TIBC Update Client-->
		<div v-if="txType === TX_TYPE.tibc_update_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.chainName')}}</span>
				<span>{{chainName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.tibc.signer')}}</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
					<router-link v-else  :to="`/address/${signer}`" class="address_link">{{signer}}</router-link>
				</template>
			</p>
		</div>
        <!--新增Transfer Denom (Denom Transfer)-->
		<div v-if="txType === TX_TYPE.transfer_denom">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nft.denomId')}}</span>
				<span>{{denomId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nft.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<router-link v-else :to="`/address/${sender}`" class="address_link">{{sender}}</router-link>
				</template>

			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nft.receiver')}}</span>
				<template>
					<span v-if="sender === '--'">{{receiver}}</span>
					<span v-else @click="addressRoute(receiver)"
						  :class="(receiver.startsWith(COSMOS_ADDRESS_PREFIX) || receiver.startsWith(IRIS_ADDRESS_PREFIX))? 'address_link' : ''"
					>{{receiver}}</span>
				</template>

			</p>

		</div>

<!-- exclude UpdateClient -->
		<p v-if="txType !== TX_TYPE.update_client" :style="{marginTop: '0.26rem'}">
			<span>{{$t('ExplorerLang.transactionInformation.recvPacket.viewSource')}}：</span>
			<LargeString :isShowPre="Tools.isJSON(viewSource)"  v-if="viewSource" :text="viewSource"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
		</p>
	</div>
</template>

<script>
	import {TX_TYPE,voteOptions,formatVoteOptions,EVENTS_TYPE, COSMOS_ADDRESS_PREFIX, IRIS_ADDRESS_PREFIX} from '../../constant';
	import Tools from "../../util/Tools";
	import { TxHelper } from '../../helper/TxHelper';
    import LargeString from './LargeString';
	import { converCoin,addressRoute,getTxType } from "../../helper/IritaHelper";
	import prodConfig from "../../productionConfig";
	import axios from '@/axios';
	import {ExplorerLang} from "../../../lang/EN-Cindy";
	export default {
		name: "txMessage",
		components: {LargeString},
		props: {
			msg: {
				type: Object,
				required: true,
			},
			msgIndex: {
				type: Number,
				required: true,
			},
			events: {
				type: Array,
				required: true,
			},
			eventsNew: {
				type: Array,
			},
			monikers: {
				type: Array,
				required: true,
			}
		},
		data () {
			return {
				TX_TYPE_DISPLAY: {},
				isShowFee: prodConfig.fee.isShowFee,
				Tools,
				prodConfig,
				addressRoute,
				TX_TYPE,

				// txHash : '',
				// blockHeight : '',
				// status : '',
				// timestamp : '',
				signer: '',
				// memo : '',
				txType: '',
				from: '',
				to: '',
				tokenId: '',
				denom: '',
				// url : '',
				requestId: '',
				// defineChainId : '',
				serviceName: '',
				// bindChainId : '',
				// requestChainId : '',
				// methodId : '',
				provider: '',
				consumer: '',
				input: '',
				// profiling : '',
				output: '',
				// errorMessage : '',
				// chainId : '',
				author: '',
				authorDescription: '',
				// idlContent : '',
				defineName: '',
				// bindingType : '',
				deposit: '',
				// price : '',
				// averageResponseTime : '',
				// usableTime : '',
				recordArray: [],
				amount: '',
				owner: '',
				symbol : '',
				tokenData: '',
				recipient: '',
				tokenUri: '',
				// dstOwner : '',
				// srcOwner : '',
				// minTable : '',
				schema: '',
				initialSupply : '',
				// minUnit : '',
				// scale : '',
				pricing: '',
				qos: '',
				schemas: '',
				requestContextId: '',
				serviceFeeCap: '',
				timeout: '',
				denomName: '',
				nftName: '',
				packet: '',
				proof: '',
				proofHeight: '',
				proofPath: '',
				proofData: '',
				clientID: '',
				module: '',
				id: '',
				pubkey: '',
				certificate: '',
				credentials: '',
				pubKeyAlgo: '',
				header: '',
				pubkeyShow:false,
				endTime: '',
				shares: '',
				operatorAddress: '',
				moniker: '',
				identity: '',
				selfBond: '',
				ownerAddress: '',
				consensusPubkey: '',
				commissionRate: '',
				website: '',
				details: '',
				delegatorAddress:'',
				withdrawAddress:'',
				depositor:'',

				isBuyOrder: '',
				inputAddress:'',
				outputAddress:'',
				deadline:'',
				sender:'',
				exactIrisAmt:'',
				maxToken:'',
				minLiquidity:'',
				withdrawLiquidity:'',
				minIrisAmt:'',
				keyBaseName:'',
				commissionMaxRate:'',
				commissionMaxChangeRate:'',
				validatorAddress:'',
				feedName:'',
				description:'',
				latestHistory:'',
				creator:'',
				providers:'',
				aggregateFunc:'',
				valueJsonPath:'',
				repeatedFrequency:'',
				responseThreshold:'',
				blockInterval:'',
				oracle:'',
				toMoniker:'',
				fromMoniker:'',
				operMoniker:'',
				minToken:'',
				minSelfDelegation:'',
				securityContact:'',
				LargeStringMinHeight: 100,
				LargeStringLineHeight: 20,
				name:'',
				decimal:'',
				maxSupply:'',
				mintable:'',
				originalOwner:'',
				newOwner:'',
				superMode:'',
				proposalID:'',
				option: '',
				voter: '',
				proposer:'',
				title:'',
				initialDeposit: '',
				parameter:'',
				time: '',
				switchHeight: '',
				info: '',
				upgradedClientState:'',
				minUnit:'',
				options: '',
				clientState:'',
				consensusState: '',
				proofUpgradeClient:'',
				proofUpgradeConsensusState :'',
				misbehaviour:'',
				counterparty:'',
				version:'',
				delayPeriod:'',
				previousConnectionId:'',
				counterpartyVersions:'',
				proofInit:'',
				proofClient:'',
				proofConsensus:'',
				consensusHeight:'',
				connectionId:'',
				counterpartyConnectionId:'',
				proofTry:'',
				proofAck:'',
				portId: '',
				channel:'',
				previousChannelId: '',
				counterpartyVersion: '',
				channelId: '',
				counterpartyChannelId: '',
				proofUnreceived: '',
				nextSequenceRecv: '',
				proofClose:'',
				acknowledgement: '',
				proofAcked: '',
				proofCommitment:'',
				sourcePort: '',
				sourceChannel: '',
				token: '',
				receiver: '',
				timeoutHeight: '',
				timeoutTimestamp: '',
				inputs:[],
				outputs:[],
				receiverOnOtherChain:'',
				senderOnOtherChain:'',
				hashLock:'',
				timestamp:'',
				timeLock:'',
				secret:'',
				transfer: '',
				tokenPair: '',
				viewSource: '',
				amountArray:[],
				COSMOS_ADDRESS_PREFIX,
				IRIS_ADDRESS_PREFIX,
				data:'',
				//新增
				classTibc:'',//tibc新增
				destChain:'',
				realayChain:'',
				idTibc:'',
				urlTibc:'',
				sequence:'',
				port:'',
				sourceChain:'',
				nft_status:'',
				cleanPacket:'',
				chainName:'',
				denomId:'',//nft新增
				mintRestricted:'',
				updateRestricted:'',



			}
		},
		computed: {
			hide () {
				let types = [];
				return !types.some((item) => item == this.txType);
			}
		},
		async mounted () {
			await this.getTxTypeData()
			this.getTransactionInformation();
		},
		methods: {
			async getTxTypeData(){
				try {
					let res = await getTxType()
					this.TX_TYPE_DISPLAY = res?.TX_TYPE_DISPLAY
				} catch (error) {
					console.log(error)
				}
			},
			async getTransactionInformation () {
				try {
					const message = this.msg;
					if (message) {
						let msg = message.msg;
						this.txType = message.type || '--';
						(this.txType !== TX_TYPE.update_client) && (function (that) {
							if(that.eventsNew && that.eventsNew.length > 0) {
								that.eventsNew.forEach((item) => {
									if(item.msg_index === that.msgIndex) {
										that.viewSource = JSON.stringify({
											msgs: that.msg,
											events: item.events
										})
									}
								})
							} else {
								// compatible no eventsNew situation
								that.viewSource = JSON.stringify({
									msgs: that.msg
								})
							}
						}(this))
						switch (this.txType) {
							case TX_TYPE.mint_nft:
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.name || '--';
								this.recipient = msg.recipient || '--';
								this.sender = msg.sender || '--';
								this.tokenData = msg.data || '--';
								this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.burn_nft:
								this.sender = msg.sender || '--';
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.nft_name || '--';
								break;
							case TX_TYPE.create_record:
								this.recordArray = msg.contents.map(item => {
									return {
										digest: item.digest ? item.digest : '--',
										digest_algo: item.digest_algo ? item.digest_algo : '--',
										uri: item.uri ? item.uri : '--',
										meta: item.meta ? item.meta : "--",
									}
								})
								break;
							case TX_TYPE.define_service:
								this.serviceName = msg.name || '--';
								this.description = msg.description || '--';
								this.author = msg.author || '--';
								this.authorDescription = msg.author_description || '--';
								this.tags = msg.tags.length && msg.tags || '--';
								this.schemas = msg.schemas || '--';
								break;
							case TX_TYPE.bind_service:
								this.defineName = msg.service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									let amount = await converCoin(msg.deposit[0]);
									this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}` || '--';
								}
								this.deposit = this.deposit || '--'
								this.owner = msg.owner || '--';
								this.pricing = msg.pricing || '--';
								this.qos = msg.qos || '--';
								this.options = msg.options || '--';
								break;
							case TX_TYPE.send:
								// this.from = msg.fromaddress || '--';
								// this.to = msg.toaddress || '--';
								this.from = msg.from_address || '--';
								this.to = msg.to_address || '--';
								this.amountArray = [];
								if (msg.amount && msg.amount.length > 0) {
									for (const item of msg.amount) {
										const amount = await converCoin(item);
										this.amountArray.push(`${amount.amount} ${amount.denom.toUpperCase()}` || '--')
									}
								}
								this.amountArray && this.amountArray.length > 0 ? '' : this.amountArray = ['--']
								break;
							case TX_TYPE.call_service:
								this.consumer = msg.consumer || '--';
								this.input = msg.input || '--';
								this.provider = msg.providers || '--';
								this.repeated = msg.repeated || '--';
								this.repeatedFrequency = msg.repeated_frequency || '--';
								this.repeatedTotal = msg.repeated_total || '--';
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0]);
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								}
								this.serviceFeeCap = this.serviceFeeCap || '--'
								this.serviceName = msg.service_name || '--';
								this.superMode = msg.super_mode || '--';
								this.timeout = msg.timeout || '--';
								if(this.eventsNew && this.eventsNew.length > 0) {
									(this.eventsNew || []).forEach((item) => {
										if(item.msg_index === this.msgIndex) {
											(item.events || []).forEach((events) => {
												(events.attributes || []).forEach((attr) => {
													if (attr.key == 'request_context_id') {
														this.requestContextId = attr.value || '--';
													}
												});
											})
										}
									});
								} else {
									(this.events || []).forEach((item) => {
										(item.attributes || []).forEach((attr) => {
											if (attr.key == 'request_context_id') {
												this.requestContextId = attr.value || '--';
											}
										});
									})
								}
								break;
							case TX_TYPE.transfer_nft:
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.name || '--';
								this.recipient = msg.recipient || '--';
								this.sender = msg.sender || '--';
								this.tokenData = msg.data || '--';
								this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.edit_nft:
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.name || '--';
								this.sender = msg.sender || '--';
								this.tokenData = msg.data || '--';
								this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.issue_denom:
								this.denomId=msg.id || '--';
								this.denomName=msg.name || '--';
								this.symbol=msg.symbol || '--';
								this.schema=msg.schema || '--';
								this.mintRestricted=msg.mint_restricted ;
								this.updateRestricted=msg.update_restricted ;
								this.sender= msg.sender;
								break;
							case TX_TYPE.respond_service:
								this.output = msg.output || '--';
								this.provider = msg.provider || '--';
								this.requestId = msg.request_id || '--';
								this.requestContextId = (msg.ex || {}).request_context_id || '--';
								this.result = msg.result || '--';
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								break;
							case TX_TYPE.pause_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.start_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || (msg.ex || {}).service_name  || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.kill_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.update_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								this.provider = msg.providers || '--';
								this.repeatedFrequency = msg.repeated_frequency || '--';
								this.repeatedTotal = msg.repeated_total || '--';
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								} else {
									this.serviceFeeCap = '--';
								}
								this.timeout = (msg.timeout) ? msg.timeout : '--';
								break;
							case TX_TYPE.update_service_binding:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									let amount = await converCoin(msg.deposit[0]);
									this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
									// this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.deposit = this.deposit || '--'
								this.owner = msg.owner || '--';
								this.pricing = msg.pricing || '--';
								this.qos = msg.qos || '--';
								break;
							case TX_TYPE.disable_service_binding:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.enable_service_binding:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									let amount = await converCoin(msg.deposit[0]);
									this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
									// this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.deposit = this.deposit || '--'
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.refund_service_deposit:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name ||  (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.recv_packet:
								if(prodConfig.txDetail && prodConfig.txDetail.ibc) {
									this.packet = JSON.stringify(msg.packet || {}) || '--';
									this.proof = msg.proof || '--';
									this.proofHeight = msg.proof_height || '--';
									this.proofPath = JSON.stringify(msg.proof_path || []) || '--';
									this.proofData = msg.proof_data || '--';
									this.clientID = msg.client_id || '--';
									this.module = msg.module || '--';
									this.signer = msg.signer || '--';
								} else {
									this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
									this.proofCommitment = msg.proof_commitment || '--';
									this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
									this.signer = msg.signer || '--';
									let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,message.type);
									if(msg.packet && msg.packet.data){
										this.sender = msg.packet.data.sender;
										this.receiver = msg.packet.data.receiver;
										this.amount = await converCoin({
											denom:originalDenom || msg.packet.data.denom,
											amount:msg.packet.data.amount,
										});
									}
								}
								break;
							case TX_TYPE.create_identity:
							case TX_TYPE.update_identity:
								let pubkey = msg.pubkey || {};
								this.id = msg.id || '--';
								this.pubkey = pubkey.pubkey || '--';
								this.certificate = msg.certificate || '--';
								this.credentials = msg.credentials && msg.credentials !== '[do-not-modify]' ? msg.credentials : '--';
								this.pubKeyAlgo = TxHelper.getPubKeyAlgorithm(pubkey.algorithm) || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.create_client:
								if(prodConfig.txDetail && prodConfig.txDetail.ibc) {
									this.clientID = msg.client_id || '--';
									this.header = JSON.stringify(msg.header || {}) || '--';
									this.signer = msg.signer || '--';
								} else {
									this.clientState = msg.client_state || '--';
									this.consensusState = msg.consensus_state || '--';
									this.signer = msg.signer || '--';
								}
								break;
							case TX_TYPE.update_client:
								this.clientID = msg.client_id || '--';
								this.header = msg.header || '--';
								this.signer = msg.signer || '--';
								break;
							case TX_TYPE.begin_redelegate:
                                let amount = await converCoin(msg.amount);
								this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								this.from = msg.validator_src_address;
								// this.shares = '需要取值';
								this.to = msg.validator_dst_address;
								// this.endTime = Tools.format2UTC(message.time)
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.create_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								if(msg.description.identity) {
									this.getKeyBaseName(msg.description.identity)
								}
								this.identity = msg.description.identity || '--';
								if(msg && msg.value && msg.value.amount ) {
									let selfBond = await converCoin(msg.value)
									this.selfBond = `${selfBond.amount} ${selfBond.denom.toUpperCase()}` || '--';
								}else {
									this.selfBond = '--'
								}
								this.ownerAddress = msg.delegator_address || '--';
								this.consensusPubkey = msg.pubkey;
								this.commissionRate = `${Tools.formatPercentage(msg.commission.rate)} %`;
								this.commissionMaxRate = `${Tools.formatPercentage(msg.commission.max_rate)} %`
								this.commissionMaxChangeRate = `${Tools.formatPercentage(msg.commission.max_change_rate)} %`
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								this.minSelfDelegation = msg.min_self_delegation || '--';
								this.securityContact = msg.description && msg.description.security_contact || '--';
								break;
							case TX_TYPE.withdraw_delegator_reward:
								this.from = msg.validator_address;
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
											if (events.type == 'withdraw_rewards') {
												(events.attributes || []).forEach((attr) => {
													if (attr.key == 'amount') {
														amount = attr.value || '--';
													}
												});
											}
											if(events.type === 'transfer') {
												(events.attributes || []).forEach((attr) => {
													if (attr.key == 'recipient') {
														this.to = attr.value || '--';
													}
												});
											}
										})
									}
								});
								if(!this.to) {
									this.to = '--';
								}
								if( amount && amount !== '--') {
									amount = await converCoin(amount);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								} else {
									this.amount = '--'
								}
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.withdraw_validator_commission:
								this.validatorAddress = msg.validator_address
								this.moniker = this.getMoniker(this.validatorAddress,this.monikers)
								break;
							case TX_TYPE.set_withdraw_address:
								this.delegatorAddress = msg.delegator_address;
								this.withdrawAddress = msg.withdraw_address;
								break;
							case TX_TYPE.begin_unbonding:
								if(msg.amount) {
									let amount = await converCoin(msg.amount);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								}
								this.amount = this.amount || '--'
								this.from = msg.validator_address;
								this.to = msg.delegator_address;
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.edit_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								if(msg.description.identity) {
									this.getKeyBaseName(msg.description.identity)
								}
								this.identity = msg.description.identity || '--';
								if(msg.commission_rate) {
									this.commissionRate = `${Tools.formatPercentage(msg.commission_rate)} %`  || '--';
								} else {
									this.commissionRate = '--'
								}
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								this.operMoniker = this.getMoniker(this.operatorAddress,this.monikers);
								this.minSelfDelegation = msg.min_self_delegation || '--'
								this.securityContact = msg.description && msg.description.security_contact || '--'
								break;
							case TX_TYPE.delegate:
								this.from = msg.delegator_address;
								this.to = msg.validator_address;
								amount = await converCoin(msg.amount);
								this.amount = `${amount.amount} ${amount.denom.toUpperCase()}` || '--'
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.fund_community_pool:
								this.depositor = msg.depositor;
								let poolAmount = await converCoin(msg.amount[0])
								this.amount =  `${poolAmount.amount} ${poolAmount.denom.toLocaleUpperCase()}`
								break;
							case TX_TYPE.swap_order:
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
											if(events.type === 'swap') {
												(events.attributes || []).forEach(async attribute => {
													if(attribute.key === 'token_pair') {
														let list = attribute.value.split('-');
														if(list.length > 1){
															let token1 = await converCoin({
																denom:list[0],
																amount:0
															})
															let token2 = await converCoin({
																denom:list[1],
																amount:0
															})
															this.tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
														}

													}
												})
											}
										})
									}
								});
								this.isBuyOrder = msg.is_buy_order;
								this.inputAddress = msg.input.address || '--';
                                if(this.eventsNew && this.eventsNew.length > 0){
                                    let currentEvents = this.eventsNew.find((e)=>e.msg_index === this.msgIndex);
                                    if(currentEvents && currentEvents.events.length > 0){
                                        let transferItem = currentEvents.events.find(e=>e.type === TX_TYPE.transfer);
                                        if(transferItem && transferItem.attributes && transferItem.attributes.length > 0){
                                            let amountList = transferItem.attributes.filter((t)=>t.key === 'amount');
                                            if(amountList && amountList.length > 0){
                                                let inputItem = amountList[0],
                                                    outputItem = amountList[amountList.length - 1]
                                                let inputAmount = inputItem.value.match(/\d+/g), inputDenom = '',
                                                    outputAmount = outputItem.value.match(/\d+/g), outputDenom = '';
                                                if(inputAmount && inputAmount.length > 0){
                                                    inputDenom = inputItem.value.substr(inputAmount[0].length);
                                                }
                                                if(outputAmount && outputAmount.length > 0){
													outputDenom = outputItem.value.substr(outputAmount[0].length);
                                                }
                                                let input = await converCoin({
                                                    denom:inputDenom,
                                                    amount:inputAmount[0]
												})

                                                this.input = `${input.amount} ${input.denom.toLocaleUpperCase()}`;
                                                let output = await converCoin({
                                                    denom:outputDenom,
                                                    amount:outputAmount[0]
                                                })
                                                this.output = `${output.amount} ${output.denom.toLocaleUpperCase()}`;
                                            }
                                        }
                                    }
                                }else{
                                    let input = await converCoin({
                                        denom:msg.input.coin.denom,
                                        amount:msg.input.coin.amount
                                    })
                                    this.input = `${input.amount} ${input.denom.toLocaleUpperCase()}`;
                                    let output = await converCoin({
                                        denom:msg.output.coin.denom,
                                        amount:msg.output.coin.amount
                                    })
                                    this.output = `${output.amount} ${output.denom.toLocaleUpperCase()}`;
                                }


								this.outputAddress = msg.output.address || '--';
								this.deadline = Tools.formatLocalTime(msg.deadline)  || '--';
								break;
							case TX_TYPE.add_liquidity:
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
											if(events.type === 'transfer') {
												(events.attributes || []).forEach(async attribute => {
													if(attribute.key === 'amount') {
														if(attribute.value && attribute.value.includes(",")) {
															const amount1 = this.getAmountByAmountStr(attribute.value.split(',')[0]);
															const amount2 = this.getAmountByAmountStr(attribute.value.split(',')[1]);
															const amountItem1 = await converCoin(amount1);
															const amountItem2 = await converCoin(amount2);
															this.amount = `${amountItem1.amount} ${amountItem1.denom.toUpperCase()}, ${amountItem2.amount} ${amountItem2.denom.toUpperCase()}`
														}
													}
												})
											}
											if(events.type === 'add_liquidity') {
												(events.attributes || []).forEach(async attribute => {
													if(attribute.key === 'token_pair') {
														let list = attribute.value.split('-');
														if(list.length > 1){
															let token1 = await converCoin({
																denom:list[0],
																amount:0
															})
															let token2 = await converCoin({
																denom:list[1],
																amount:0
															})
															this.tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
														}
													}
												})
											}
										})
									}
								});
								this.sender = msg.sender || '--';
								// let exactIrisAmt = await converCoin({
								// 	amount: msg.exact_iris_amt,
								// 	denom: mainToken.denom
								// })
								// this.exactIrisAmt = `${exactIrisAmt.amount} ${exactIrisAmt.denom.toLocaleUpperCase()}`;
								this.exactIrisAmt = msg.exact_iris_amt;
								let maxToken = await converCoin(msg.max_token);
								this.maxToken = `${maxToken.amount} ${maxToken.denom.toLocaleUpperCase()}`;
								this.minLiquidity = msg.min_liquidity || '--';
								this.deadline = Tools.formatLocalTime(msg.deadline)  || '--';
								break;
							case TX_TYPE.remove_liquidity:
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
											if(events.type === 'transfer') {
												(events.attributes || []).forEach(async attribute => {
													if(attribute.key === 'amount') {
														if(attribute.value && attribute.value.includes(",")) {
															const amount1 = this.getAmountByAmountStr(attribute.value.split(',')[0]);
															const amount2 = this.getAmountByAmountStr(attribute.value.split(',')[1]);
															const amountItem1 = await converCoin(amount1);
															const amountItem2 = await converCoin(amount2);
															this.amount = `${amountItem1.amount} ${amountItem1.denom.toUpperCase()}, ${amountItem2.amount} ${amountItem2.denom.toUpperCase()}`
														}
													}
												})
											}
											if(events.type === 'remove_liquidity') {
												(events.attributes || []).forEach(async attribute => {
													if(attribute.key === 'token_pair') {
														let list = attribute.value.split('-');
														if(list.length > 1){
															let token1 = await converCoin({
																denom:list[0],
																amount:0
															})
															let token2 = await converCoin({
																denom:list[1],
																amount:0
															})
															this.tokenPair = `${token1.denom.toUpperCase()} - ${token2.denom.toUpperCase()}`;
														}
													}
												})
											}
										})
									}
								});
								this.sender = msg.sender || '--';
								let withdrawLiquidity = await converCoin(msg.withdraw_liquidity)
								this.withdrawLiquidity = `${withdrawLiquidity.amount} ${withdrawLiquidity.denom.toLocaleUpperCase()}` ;
								// let minIrisAmt = await converCoin({
								// 	amount: msg.min_iris_amt,
								// 	denom: mainToken.denom
								// })
								// this.minIrisAmt = `${minIrisAmt.amount} ${minIrisAmt.denom.toLocaleUpperCase()}`;
								this.minIrisAmt = msg.min_iris_amt;
								this.minToken = msg.min_token;
								this.deadline = Tools.formatLocalTime(msg.deadline)  || '--';
							break;
							case TX_TYPE.unjail:
								this.operatorAddress = msg.address || '--';
							break;
							case TX_TYPE.create_feed:
								this.serviceName = msg.serviceName || msg.service_name || '--';
								this.feedName = msg.feed_name || '--';
								this.description = msg.description || '--';
								this.latestHistory = msg.latest_history !== 0 ?  msg.latest_history || '--' : '--';
								this.creator = msg.creator || '--';
								this.providers = msg.providers || '--';
								this.input = msg.input || '--';
								if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toLocaleUpperCase()}`;
								} else {
									this.serviceFeeCap = '--'
								}
								this.aggregateFunc = msg.aggregate_func || '--';
								this.valueJsonPath = msg.value_json_path || '--';
								this.repeatedFrequency = msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--';
								this.responseThreshold = msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--';
								this.timeout = msg.timeout !== 0 ? msg.timeout || '--' : '--';
							break;
							case TX_TYPE.start_feed:
								this.feedName = msg.feed_name || '--';
								this.creator = msg.creator || '--';
							break;
							case TX_TYPE.pause_feed:
								this.feedName = msg.feed_name || '--';
								this.creator = msg.creator || '--';
							break;
							case TX_TYPE.edit_feed:
								this.feedName = msg.feed_name || '--';
								this.description = msg.description || '--';
								this.latestHistory = msg.latest_history !== 0 ?  msg.latest_history || '--' : '--';
								this.creator = msg.creator || '--';
								this.providers = msg.providers || '--';
								if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toLocaleUpperCase()}`;
								} else {
									this.serviceFeeCap = '--'
								}
								this.repeatedFrequency = msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--';
								this.responseThreshold = msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--';
								this.timeout = msg.timeout !== 0 ? msg.timeout || '--' : '--';
							break;
							case TX_TYPE.request_rand:
								this.blockInterval = msg.block_interval == 0 ? msg.block_interval : msg.block_interval || '--';
								this.consumer = msg.consumer || '--';
								this.oracle = msg.oracle;
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0]);
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								} else {
									this.serviceFeeCap = '--';
								}
							break;
							case TX_TYPE.service_set_withdraw_address:
							this.owner = msg.owner || '--';
							this.withdrawAddress = msg.withdraw_address || '--';
							break;
							case TX_TYPE.withdraw_earned_fees:
								this.owner = msg.owner || '--';
								this.provider = msg.provider || '--';
							break;
							case TX_TYPE.issue_token:
								this.symbol = msg.symbol || '--';
								this.name = msg.name || '--';
								this.decimal = msg.scale || '--';
								this.initialSupply = msg.initial_supply || '--';
								this.maxSupply = msg.max_supply || '--';
								this.mintable = msg.mintable;
								this.owner = msg.owner || '--';
								this.minUnit = msg.min_unit || '--';
							break;
							case TX_TYPE.edit_token:
								this.symbol = msg.symbol || '--';
								this.name = msg.name || '--';
								this.maxSupply = msg.max_supply !== 0 ? msg.max_supply || '--' : msg.max_supply;
								this.mintable = msg.mintable;
								this.owner = msg.owner || '--';
							break;
							case TX_TYPE.mint_token:
								this.symbol = msg.symbol || '--';
								this.owner = msg.owner || '--';
								this.amount = msg.amount || '--';
								this.to = msg.to || '--';
							break;
							case TX_TYPE.transfer_token_owner:
								this.symbol = msg.symbol || '--';
								this.originalOwner = msg.src_owner || '--';
								this.newOwner = msg.dst_owner || '--';
							break;
							case TX_TYPE.burn_token:
								this.symbol = msg.symbol || '--';
								this.sender = msg.sender || '--';
								this.amount = msg.amount || '--';
							break;
							case TX_TYPE.deposit:
								if(msg.amount && msg.amount.length > 0) {
									let deposit = await converCoin(msg.amount[0]);
									this.deposit = `${deposit.amount} ${deposit.denom.toUpperCase()}`;
								} else {
									this.deposit = '--'
								}
								this.depositor = msg.depositor || '--';
								this.proposalID = msg.proposal_id || '--';
							break;
							case TX_TYPE.vote:
								this.voter = msg.voter || '--';
								this.proposalID = msg.proposal_id || '--';
								this.option = msg.option ? formatVoteOptions[voteOptions[msg.option]] : '--';
							break;
							case TX_TYPE.submit_proposal:
								this.proposer = msg.proposer || '--';
								if(msg.initial_deposit && msg.initial_deposit.length > 0) {
									let initialDeposit = await converCoin(msg.initial_deposit[0]);
									this.initialDeposit = `${initialDeposit.amount} ${initialDeposit.denom.toUpperCase()}`;
								} else {
									this.initialDeposit = '--'
								}
								this.title = msg.content && msg.content.title || '--'
								this.description = msg.content && msg.content.description || '--'
								this.parameter = msg.content && msg.content.changes
								let plan = msg.content &&  msg.content.plan
								if(plan) {
									this.name = plan.name
									let timestamp = plan.time  && Math.floor(new Date(plan.time).getTime() / 1000)
									this.time = timestamp && Tools.formatLocalTime(timestamp)
									this.switchHeight = plan.height ? plan.height : '--'
									if(this.switchHeight && this.switchHeight !== '--') {
										this.time = '--'
									} else {
										this.time = timestamp && Tools.formatLocalTime(timestamp)
									}
									this.info = plan.info
									this.upgradedClientState = plan.upgradedclientstate || '--'
								}
								this.recipient = msg.content && msg.content.recipient
								let n = msg.content && msg.content.amount && msg.content.amount[0]
								if(n) {
									n = await converCoin(n)
									if(n.amount !== '0') {
										this.amount = `${n.amount} ${n.denom.toUpperCase()}`
									} else {
										this.amount = '--'
									}

								}
							break;
							case TX_TYPE.upgrade_client:
								this.clientID = msg.client_id || '--';
								this.clientState = msg.client_state || '--';
								this.consensusState = msg.consensus_state || '--';
								this.proofUpgradeClient = msg.proof_upgrade_client || '--';
								this.proofUpgradeConsensusState = msg.proof_upgrade_consensus_state || '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.submit_misbehaviour:
								this.clientID = msg.client_id || '--';
								this.misbehaviour = msg.misbehaviour || '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_init:
								this.clientID = msg.client_id || '--';
								this.counterparty = msg.counterparty ? JSON.stringify(msg.counterparty) : '--';
								this.version = msg.version ? JSON.stringify(msg.version) : '--';
								this.delayPeriod = msg.delay_period || '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_try:
								this.clientID = msg.client_id || '--';
								this.previousConnectionId  = msg.previous_connection_id  || '--';
								this.clientState = msg.client_state || '--';
								this.counterparty = msg.counterparty ? JSON.stringify(msg.counterparty) : '--';
								this.delayPeriod = msg.delay_period || '--';
								this.counterpartyVersions = msg.counterparty_versions ? JSON.stringify(msg.counterparty_versions) : '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.proofInit = msg.proof_init || '--';
								this.proofClient = msg.proof_client || '--';
								this.proofConsensus = msg.proof_consensus || '--';
								this.consensusHeight = msg.consensus_height ? JSON.stringify(msg.consensus_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_ack:
								this.connectionId = msg.connection_id || '--';
								this.counterpartyConnectionId = msg.counterparty_connection_id || '--';
								this.version = msg.version ? JSON.stringify(msg.version) : '--';
								this.clientState = msg.client_state  || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.proofTry = msg.proof_try || '--';
								this.proofClient = msg.proof_client || '--';
								this.proofConsensus = msg.proof_consensus || '--';
								this.consensusHeight = msg.consensus_height ? JSON.stringify(msg.consensus_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.connection_open_confirm:
								this.connectionId = msg.connection_id || '--';
								this.proofAck = msg.proof_ack || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_init:
								this.portId = msg.port_id || '--';
								this.channel = msg.channel ? JSON.stringify(msg.channel) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_try:
								this.portId = msg.port_id || '--';
								this.previousChannelId = msg.previous_channel_id || '--';
								this.channel = msg.channel ? JSON.stringify(msg.channel) : '--';
								this.counterpartyVersion = msg.counterparty_version || '--';
								this.proofInit  = msg.proof_init || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_ack:
								this.portId = msg.port_id || '--';
								this.channelId = msg.channel_id || '--';
								this.counterpartyChannelId = msg.counterparty_channel_id || '--',
								this.counterpartyVersion = msg.counterparty_version || '--',
								this.proofTry = msg.proof_try || '--',
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_open_confirm:
								this.portId = msg.port_id || '--';
								this.channelId = msg.channel_id || '--';
								this.proofAck = msg.proof_ack || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_close_init:
								this.portId = msg.port_id || '--';
								this.channelId = msg.channel_id || '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.channel_close_confirm:
								this.portId = msg.port_id || '--';
								this.channelId = msg.channel_id || '--';
								this.proofInit = msg.proof_init || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.timeout_packet:
								this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								this.proofUnreceived = msg.proof_unreceived || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.nextSequenceRecv = msg.next_sequence_recv || '--';
								this.signer = msg.signer || '--';
								let originalDenom = TxHelper.getOriginalDenomFromPacket(msg.packet,message.type);
                                if(msg.packet && msg.packet.data && JSON.stringify(msg.packet.data) !== '{}'){
                                    this.sender = msg.packet.data.sender;
                                    this.receiver = msg.packet.data.receiver;
                                    this.amount = await converCoin({
                                        denom:originalDenom || msg.packet.data.denom,
                                        amount:msg.packet.data.amount,
                                    });
                                }
							break;
							case TX_TYPE.timeout_on_close_packet:
								this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								this.proofUnreceived = msg.proof_unreceived || '--';
								this.proofClose = msg.proof_close || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.nextSequenceRecv = msg.next_sequence_recv || '--';
								this.signer = msg.signer || '--';
							break;
							case TX_TYPE.acknowledge_packet:
								if(msg.packet && msg.packet.data && JSON.stringify(msg.packet.data) !== '{}' ){
									this.amount = await converCoin({
										denom:originalDenom || msg.packet.data.denom,
										amount:msg.packet.data.amount,
									});
								}
								this.packet = msg.packet ? JSON.stringify(msg.packet) : '--';
								this.acknowledgement = msg.acknowledgement || '--';
								this.proofAcked = msg.proof_acked || '--';
								this.proofHeight = msg.proof_height ? JSON.stringify(msg.proof_height) : '--';
								this.signer = msg.signer || '--';
								this.amount = `${this.amount.amount} ${this.amount.denom.toUpperCase()}`
							break;
							// MsgTypeIBCTransfer
							case TX_TYPE.transfer:
								this.sourcePort = msg.source_port || '--';
								this.sourceChannel = msg.source_channel || '--';
								this.token = msg.token ?  await converCoin(msg.token) : '--';
								this.sender = msg.sender || '--';
								this.receiver = msg.receiver || '--';
								this.timeoutHeight = msg.timeout_height ? JSON.stringify(msg.timeout_height) : '--';
								let timeoutTimestamp = msg.timeout_timestamp  && Math.floor(new Date(msg.timeout_timestamp).getTime() / 1000);
								timeoutTimestamp ? this.timeoutTimestamp = Tools.formatLocalTime(timeoutTimestamp) : this.timeoutTimestamp ='--';
							break;
							case TX_TYPE.multisend:
								this.inputs = [];
								this.outputs = [];
								if(msg && msg.inputs.length >0) {
									for (const input of msg.inputs) {
										let n = input.coins && input.coins[0] && await converCoin(input.coins[0])
										this.inputs.push({
											address: input.address,
											amount: n ? `${n.amount} ${n.denom.toUpperCase()}` : '--'
										})
									}
									for (const output of msg.outputs) {
										let n = output.coins && output.coins[0] && await converCoin(output.coins[0])
										this.outputs.push({
											address: output.address,
											amount: n ? `${n.amount} ${n.denom.toUpperCase()}` : '--'
										})
									}
								}
							break;
							case TX_TYPE.create_htlc:
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
											if(events.type === 'create_htlc') {
												(events.attributes || []).forEach(attrs => {
													if(attrs.key === 'id') {
														this.id = attrs.value
													}
												})
											}
										})
									}
								});
								this.sender = msg.sender || '--';
								this.to = msg.to || '--';
								this.receiverOnOtherChain = msg.receiver_on_other_chain || '--';
								this.senderOnOtherChain = msg.sender_on_other_chain || '--';
								if(msg.amount && msg.amount[0]) {
                  let coin = await converCoin(msg.amount[0])
									this.amount = `${coin.amount} ${coin.denom.toUpperCase()}`;
								} else {
									this.amount = '--';
								}
								this.hashLock = msg.hash_lock || '--';
								// this.timestamp = msg.timestamp ? `${msg.timestamp} s` : '--';
								this.timestamp = Tools.formatLocalTime(msg.timestamp) || '--';
								this.timeLock = msg.time_lock ? `${msg.time_lock} block` : '--';
								this.transfer = msg.transfer === false ? 'HTLC' : 'HTLT';
								// let timeLock = msg.time_lock  && Math.floor(new Date(msg.time_lock).getTime() / 1000);
								// timeLock ? this.timeLock = Tools.getDisplayDate(timeLock) : this.timeLock ='--';
							break;
							case TX_TYPE.claim_htlc:
								let transfer;
                let attributeMap;
								(this.eventsNew || []).forEach((item) => {
									if(item.msg_index === this.msgIndex) {
										(item.events || []).forEach((events) => {
												if(events.type === 'claim_htlc') {
													(events.attributes || []).forEach(item => {
														if(item.key === 'transfer')  {
															transfer = item.value
														}
														if(item.key == 'hash_lock') {
															this.hashLock = item.value
														}
													})
												}
											  if(events.type === "transfer") {
                          attributeMap = Tools.MultKeyValueObjToOneMap(events.attributes)
                        //   (events.attributes || []).forEach(item => {
												// 		if(item.key === 'amount')  {
                        //       this.amount = item.value
												// 		}
												// 		if(item.key === 'recipient') {
												// 			this.recipient = item.value
												// 		}
												// })
											}
										})
									}
								});
								if(attributeMap && attributeMap.has('amount')){
								  let coin = await converCoin(attributeMap.get('amount'))
								  this.amount = `${coin.amount} ${coin.denom.toUpperCase()}`;
								}
								if(attributeMap && attributeMap.has('recipient')){
								  this.recipient = attributeMap.get('recipient')
								}
								if(!this.recipient) {
									this.recipient = '--'
								}
								this.transfer = transfer === 'false' ? 'HTLC' : 'HTLT';
								this.sender = msg.sender || '--';
								this.id = msg.id || '--';
								this.secret = msg.secret || '--';
							break;
							case TX_TYPE.refund_htlc:
								this.sender = msg.sender || '--';
								this.hashLock = msg.hash_lock || '--';
							break;
							//新增TIBC NFT Transfer Out
							case TX_TYPE.tibc_nft_transfer:
								this.classTibc = msg.class  || '--';
								this.idTibc = msg.id|| '--';
								this.destChain = msg. dest_chain || '--';
								this.realayChain = msg.realay_chain || '--';
								this.sender = msg.sender || '--';
								this.receiver = msg.receiver || '--';
								break;
							//新增TIBC NFT Transfer In
							case TX_TYPE.tibc_recv_packet:
								/*let recvPacketAcknowledgementValue = ''
								if(this?.eventsNew?.length){
									this.eventsNew.forEach( item => {
										if(item?.msg_index === this.msgIndex && item?.events?.length){
											item.events.forEach( i => {
												if(i.type === EVENTS_TYPE.writeAcknowledgement && i?.attributes?.length){
													i.attributes.forEach( value => {
														if(value?.key === 'packet_ack'){
															recvPacketAcknowledgementValue = value.value
														}
													})
												}
											})
										}
										
									})
								}*/
								this.idTibc=msg.packet.data.id || '--';
								this.urlTibc = msg.packet.data.uri || '--';
								this.classTibc = msg.packet.data.class|| '--'
								this.sequence = msg.packet.sequence|| '--'
								this.port = msg.packet.port|| '--'
								this.sourceChain = msg.packet.source_chain|| '--'
								this.destChain = msg.packet.destination_chain|| '--'
								this.realayChain = msg.packet.relay_chain|| '--'
								this.sender = msg.packet.data.sender|| '--'
								this.signer = msg.signer|| '--'
								this.receiver = msg.packet.data.receiver || '--';
								// const recvPacketAcknowledgementResult = recvPacketAcknowledgementValue ? recvPacketAcknowledgementValue.splice(/[^0-9]/ig,"") : '';
								// this.nftStatus = recvPacketAcknowledgementResult && Number(acknowledgementResult) === 1  ? this.$t('ExplorerLang.common.success'):this.$t('ExplorerLang.common.failed')

								break;
							//新增TIBC Acknowledge Packet
							case TX_TYPE.tibc_acknowledge_packet:
								
								this.idTibc=msg.packet.data.id || '--';
								this.urlTibc = msg.packet.data.uri || '--';
								this.classTibc = msg.packet.data.class|| '--'
								this.sequence = msg.packet.sequence|| '--'
								this.port = msg.packet.port|| '--'
								this.sourceChain = msg.packet.source_chain|| '--'
								this.destChain = msg.packet.destination_chain|| '--'
								this.realayChain = msg.packet.relay_chain|| '--'
								this.sender = msg.packet.data.sender|| '--'
								this.signer = msg.signer|| '--'
								this.receiver = msg.packet.data.receiver || '--';
								let acknowledgementResult = ''
								if(msg?.acknowledgement){
									acknowledgementResult = msg.acknowledgement.replace(/[^0-9]/ig,"");
								}
								this.nftStatus = acknowledgementResult && Number(acknowledgementResult) === 1 ? this.$t('ExplorerLang.common.success'):this.$t('ExplorerLang.common.failed')
								break;
                            //新增 TIBC Clean Packet Out
							case TX_TYPE.clean_packet:
								this.sequence = msg.clean_packet.sequence|| '--'
								this.sourceChain = msg.clean_packet.source_chain|| '--'
								this.destChain = msg.clean_packet.destination_chain|| '--'
								this.realayChain = msg.clean_packet.relay_chain|| '--'
								this.signer = msg.signer|| '--'
								break;
							//新增 	TIBC Clean Packet In
							case TX_TYPE.recv_clean_packet:
								this.cleanPacket= msg.clean_packet|| '--'
								this.signer = msg.signer|| '--'
								break;
							//新增TIBC Update Client
							case TX_TYPE.tibc_update_client:
								this.chainName=msg.chain_name|| '--'
								this.signer = msg.signer
								break;
                            //新增Transfer Denom (Denom Transfer)
							case TX_TYPE.transfer_denom:
								this.denomId=msg.id || '--'
								this.sender= msg.sender|| '--'
								this.receiver= msg.recipient|| '--'
								break;
						}
					}
				} catch (e) {
					console.error(e);
				}
			},
			getAmountByAmountStr(str){
				let amount = str.match(/\d+/g), denom = '';
                if(amount && amount.length > 0){
					denom = str.substr(amount[0].length);
					return {
						amount:amount[0],
						denom
					}
                }
			},
			// 处理需打开的网站地址
			openUrl(url) {
				url = url.trim();
				if (url) {
					if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
						url = `http://${url}`;
					}
					window.open(url);
				}
			},
			// 通过identity，拿到keyBaseName数据
			getKeyBaseName(identity) {
				let url = `https://keybase.io/_/api/1.0/user/lookup.json?fields=basics&key_suffix=${identity}`;
				if (identity) {
					axios.http(url).then(res => {
						if (res.them && res.them.length > 0 && res.them[0].basics && res.them[0].basics.username) {
							this.keyBaseName = `https://keybase.io/${res.them[0].basics.username}`;
						}else {
							this.keyBaseName = ''
						}
					});
				}
			},
			getMoniker(address,monikers) {
				let moniker
				if(monikers.length) {
					monikers.map( item => {
						moniker = moniker || item[address] || ''
					})
				}
				return moniker
			},
			startStr(url){
				return url.startsWith('www.')
			},
		}
	}
</script>

<style scoped lang="scss">
	a {
		color: $t_link_c !important;
	}

	.tx_message_content {
		padding: 0.36rem 0;
		background: $bg_white_c;
		font-size: $s14;
		.record_container {
			display: flex;
			width: 100%;
			max-width: 12rem;

			.record_content {
				width: 100%;

				.record_name {
					color: $t_second_c;
					min-width: 1.5rem;
					text-align: left;
					font-size: $s14;
				}

				.record_list_content {
					flex: 1;
					width: 100%;
					box-sizing: border-box;
					background: $bg_cancel_c;
					border-radius: 0.05rem;

					::v-deep .el-table {
						background: $bg_cancel_c;

						tr {
							background: $bg_cancel_c;

							th {
								background: $bg_cancel_c;
							}
						}
					}
				}
			}
		}
		.address_container{
			flex-wrap: wrap;
			a{
				margin-right: 0.1rem;
			}
			span{
				
				font-weight: normal !important;
				color: #171D44 !important;
			}
		}

		p {
			display: flex;
			margin-bottom: 0.26rem;

			span:nth-of-type(1) {
				margin-right: 0.15rem;
				color: $t_second_c;
				// min-width: 1.52rem;
				min-width: 1.64rem;
				text-align: left;
				font-size: $s14;
				font-weight: 600;
			}

			span:nth-of-type(2) {
				text-align: left;
				font-size: $s14;
				color: $t_first_c;
				word-break: break-all;
				line-height: 0.20rem;
			}
			.wrap {
				.text {
					flex: 1;
					text-align: left;
					font-size: $s14;
					color: $t_first_c;
					word-break: break-all;
					line-height: 0.20rem;
					font-weight: normal;
				}
			}
			a {
				word-break: break-all;
			}
		}

		p:last-child {
			margin-bottom: 0;
		}

		.website_link{
			font-size:  $s14;
			line-height: 0.16rem;
			color:$theme_c !important;
			cursor: pointer;
		}

	}

	@media screen and (max-width: 768px) {
		.tx_message_content {

			.record_container {

				.record_content {

					.record_name {
						min-width: 1.4rem;
					}

					.record_list_content {

						::v-deep .el-table {

							tr {

								th {

								}
							}
						}
					}
				}
			}

			p {
				span:nth-of-type(1) {
					min-width: 1.4rem;
				}

				span:nth-of-type(2) {

				}
			}

			p:last-child {

			}
		}
	}
</style>
