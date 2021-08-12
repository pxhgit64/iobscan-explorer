<template>
    <div class="search_result_detail_wrap">
        <div class="search_result_title_wrap">
            <div class="search_result_title_content">
                <span>{{$t('ExplorerLang.searchResult.title')}}</span>
                <span>{{Object.keys(this.$route.query)[0]}}</span>
            </div>
            <div class="result_content_container">
                <div>
                    <img class="result_img" src="../assets/resultless.png" alt="">
                </div>
                <p class="result_title">{{$t('ExplorerLang.searchResult.resultTitle')}}</p>
                <p class="try_info">{{$t('ExplorerLang.searchResult.searchTip')}}</p>
                <div class="back_home_btn" @click="backHome">
                    <span>{{$t('ExplorerLang.searchResult.backHome')}}</span>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>

	import Tools from '../util/Tools';
    import { TX_TYPE,TX_STATUS } from '../constant';
	export default {
		name: "searchResult",
		data() {
			return {
			     TX_TYPE,
                 TX_STATUS
			}
		},
		
		methods:{
			backHome(){
				this.$router.push("/home")
			},
		},
	}
</script>

<style lang="scss" scoped>
   .search_result_detail_wrap{
       .search_result_title_wrap{
           max-width: 12rem;
           margin: 0 auto;
           text-align: left;
           display: flex;
           flex-direction: column;
           .search_result_title_content{
               margin: 0.3rem 0 0.1rem 0;
               span:nth-of-type(1){
                   font-size: $s18;
                   color: $t_first_c;
                   line-height: 0.21rem;
               }
               span:nth-of-type(2){
                   margin-left: 0.1rem;
                   font-size: $s18;
                   color: $t_first_c;
                   line-height: 0.21rem;
               }
           
           }
           .result_content_container{
               margin: 1.5rem 0 0.5rem 0;
               flex: 1;
               height: 100%;
               display: flex;
               justify-content: center;
               align-items: center;
               flex-direction: column;
               .result_img{
                    width:1.65rem;
                    height:1.75rem;
               }
               .result_title{
                   margin-top: 0.2rem;
                   color: $t_first_c;
                   font-size: $s18;
               }
               .try_info{
                   font-size: $s14;
                   color: $t_second_c;
                   margin-bottom: 0.44rem ;
               }
               .back_home_btn{
                   text-align: center;
                   width: 1.58rem;
                   height: 0.36rem;
                   margin: 0 auto;
                   background: $bg_button_c;
                   border-radius: 0.05rem;
                   color: $t_button_c;
                   font-size: $s14;
                   line-height: 0.36rem;
                   cursor: pointer;
               }
           }
       }
   }
   @media (max-width: 1248px) {
        .search_result_title_content{
            margin: 0.3rem 0.24rem 0.1rem 0.24rem !important;
        }
   }
   @media (max-width: 768px) {
        .search_result_title_content{
            margin: 0.3rem 0.12rem 0.1rem 0.12rem !important;
        }
   }
</style>
