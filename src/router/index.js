import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
	routes:[
		{
			path:'/',
			redirect:'/home',
		},
		{
			path:'/home',
			component: () => import('@/components/Home.vue')
		},
		{
			path:'/blocks',
			component: () => import('@/components/BlockList.vue')
		},
		{
			path:'/block/:height',
			component: () => import('@/components/BlockDetail.vue')
		},
		{
			path:'/txs',
			component: () => import('@/components/TxList.vue')
		},
		{
			path: '/txs/:txType', component: () => import('@/components/TxListPage.vue'),
		},
		{
			path:'/nftAsset',
			component: () => import('@/components/NftList.vue')
		},
        {
			path:'/denoms',
			component: () => import('@/components/DenomList.vue')
		},
		{
			path:'/identities',
			component: () => import('@/components/IdentityList.vue')
		},
		{
			path:'/identity/:id',
			component: () => import('@/components/IdentityDetail.vue')
		},
		{
			path:'/address/:param',
			component: () => import('@/components/OwnerDetail.vue')
		},
        {
			path:'/service/respond/:serviceName/:provider',
			component: () => import('@/components/ServiceRespondRecord.vue')
		},

		{
			path:'/nft/token',
			component: () => import('@/components/NftToken.vue')
		},
		{
			path:'/service',
			component: () => import('@/components/ServiceInformation.vue')
		},
		{
			path:'/tx',
			component: () => import('@/components/TxDetail.vue')
		},
		{
			path:'/services',
			component: () => import('@/components/ServiceList.vue')
		},
		{
			path:'/validators',
			component: () => import('@/components/ValidatorList.vue')
		},
		{
			path: '/searchResult', component: () => import('@/components/SearchResult.vue'),
		},
		{
			path: '/staking', component: () => import('@/components/Staking/Staking.vue'),
		},
		{
			path: '/staking/:param',
			component: () => import('@/components/Staking/ValidatorDetail.vue'),
		},
	]
})
export default router
