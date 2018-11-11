<template>
	<div class="page">
		<div class="toolbar tabbar tabbar-labels toolbar-bottom-md color-theme-yellow">
			<div class="toolbar-inner">
				<a @click="$gotoShop('')" class="tab-link">
					<i class="icon material-icons">shop</i>
					<span class="tabbar-label">商城</span>
				</a>
				<a @click="$gotoShop('store_list.html?distanceSort=1')" class="tab-link">
					<i class="icon material-icons">location_on</i>
					<span class="tabbar-label">附近</span>
				</a>
				<a @click="$redirect('/index/')" class="tab-link">
					<i class="icon material-icons">pets</i>
					<span class="tabbar-label">趣看</span>
				</a>
				<a href="#tab-3" class="tab-link  tab-link-active">
					<i class="icon f7-icons">person_fill</i>
					<span class="tabbar-label">我的</span>
				</a>
			</div>
		</div>

		<!-- Views/Tabs container -->
		<div class="page-content hide-navbar-on-scroll hide-toolbar-on-scroll">
			<div class="list">
				<ul>
					<li class="top-li" style="">
						<a class="item-content">
							<div class="item-inner">
								<div class="item-title">
									<img @click="$gotoShop('mine_info.html')" v-lazy="$getMember().member_avatar" />
									<div v-if="$getMemberID()" class="hnp-title membername">{{$getMember().member_name}}</div>
									<div v-else @click="gotoLogin()" class="hnp-title membername">登录查看个人信息</div>
									<div v-if="$getMemberID()" @click="$gotoShop('mine_info.html')" class="text-color-orange membername-link">个人信息</div>
								</div>
								<div class="item-after" style="margin-top:-3.6rem;">
									<i @click="$gotoShop('user_setting.html')" class="icon f7-icons">gear</i>
								</div>
							</div>
						</a>
					</li>
				</ul>
			</div>
			<!--<div class="br"></div>
			<div class="list">
				<ul>
					<li>
						<a @click="$gotoShop('order_list.html')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">list</i>我的订单</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
					<li class="order-state row">
						<div @click="$gotoShop('order_list.html?state=10')" class="col">
							<div><i class="icon f7-icons text-color-red">timer</i></div>
							<div class="text">待付款</div>
						</div>
						<div @click="$gotoShop('order_list.html?state=20')" class="col">
							<div><i class="icon f7-icons text-color-orange">timer</i></div>
							<div class="text">待使用</div>
						</div>
						<div @click="$gotoShop('order_list.html?state=30')" class="col">
							<div><i class="icon f7-icons  text-color-green">timer</i></div>
							<div class="text">已使用</div>
						</div>
						<div @click="$gotoShop('order_list.html?state=0')" class="col">
							<div><i class="icon f7-icons">timer</i></div>
							<div class="text">已取消</div>
						</div>
					</li>
				</ul>
			</div>-->
			
			<div class="br"></div>
			<div class="list">
				<ul>
					<li>
						<a @click="$gotoShop('ordercode_list.html')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">ticket</i> 我的派</div>
								<div class="item-after"><font style="font-size: 14px;">特权券（查看抢购的券）</font></div>
							</div>
						</a>
					</li>
					<li class="order-state row">
						<div @click="$gotoShop('ordercode_list.html?state=0')" class="col">
							<div><i class="icon f7-icons text-color-orange">timer</i></div>
							<div class="text">待使用</div>
						</div>
						<div @click="$gotoShop('ordercode_list.html?state=1')" class="col">
							<div><i class="icon f7-icons  text-color-green">timer</i></div>
							<div class="text">已使用</div>
						</div>
						<div @click="$gotoShop('ordercode_list.html?state=2')" class="col">
							<div><i class="icon f7-icons">timer</i></div>
							<div class="text">已失效</div>
						</div>
					</li>
					<!--<li>
						<a @click="$gotoShop('my_coin.html')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">money_yen</i> 我的牛币</div>
								<div class="item-after"><font style="font-size: 14px;">牛币充值优惠</font></div>
							</div>
						</a>
					</li>-->
				</ul>
			</div>
			
			<div class="br"></div>
			<div class="list">
				<ul>
					<li>
						<a @click="$gotoShop('order_list.html')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">list</i>我的订单</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
				</ul>
			</div>
			
			<div class="br"></div>
			
			<div class="list">
				<ul>
					<li>
						<a @click="$redirect('/my/fav-article/')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">heart</i> 我的收藏</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
					<!--<li>
						<a @click="$redirect('/my/follow-circle/')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">at</i> 我的关注</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>-->
					<li>
						<a @click="$redirect('/my/follow-circle/')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon material-icons normal-size">people_outline</i> 我的派友圈</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
					<li>
						<a @click="$redirect('/my/circletheme/')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">images</i> 我的生活贴</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
				</ul>
			</div>
			
			<div class="br"></div>
			<div class="list">
				<ul>
					<li>
						<a @click="$gotoShop('user_feedback.html')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title">
									<i><svg class="icon f7-icons normal-size" style="vertical-align: middle;fill: #808080;overflow: hidden;" viewBox="0 0 1051 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15347"><path d="M55.351351 553.402811v110.924108a83.027027 83.027027 0 0 0 166.054054 0v-110.924108a83.027027 83.027027 0 0 0-166.054054 0z m763.101406 211.552865A137.852541 137.852541 0 0 1 774.918919 664.326919v-110.924108A138.378378 138.378378 0 0 1 912.328649 415.135135C898.131027 214.071351 730.499459 55.351351 525.837838 55.351351 321.148541 55.351351 153.544649 214.071351 139.347027 415.135135A138.461405 138.461405 0 0 1 276.756757 553.402811v110.924108a138.378378 138.378378 0 0 1-276.756757 0v-110.924108a138.378378 138.378378 0 0 1 83.303784-126.865297C91.883243 189.523027 286.72 0 525.837838 0s433.954595 189.523027 442.534054 426.537514A138.461405 138.461405 0 0 1 1051.675676 553.402811v110.924108a138.378378 138.378378 0 0 1-184.790487 130.269405 470.763243 470.763243 0 0 1-188.858811 121.21946A96.809514 96.809514 0 0 1 580.912432 1010.162162h-82.528864c-53.690811 0-97.113946-43.174054-97.113946-96.864865 0-53.607784 43.284757-96.864865 97.141621-96.864865h82.473514c34.954378 0 65.536 18.265946 82.639567 45.803244a415.273514 415.273514 0 0 0 154.900757-97.28zM830.27027 553.402811v110.924108a83.027027 83.027027 0 0 0 166.054054 0v-110.924108a83.027027 83.027027 0 0 0-166.054054 0zM498.438919 954.810811h82.473513c23.302919 0 41.79027-18.487351 41.790271-41.513514 0-23.053838-18.570378-41.513514-41.790271-41.513513h-82.473513c-23.302919 0-41.79027 18.487351-41.79027 41.513513 0 23.053838 18.570378 41.513514 41.79027 41.513514z" p-id="15348"></path></svg></i>
									用户反馈</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
					<li>
						<a @click="$gotoShop('faqcat_list.html?ac_code=user_faq')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">help</i> 问题帮助</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
					<li>
						<a @click="$gotoShop('faq_detail.html?id=10')" class="item-link item-content">
							<div class="item-inner">
								
								<div class="item-title">
									<i><svg class="icon f7-icons normal-size" style="vertical-align: middle;fill: #808080;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15521"><path d="M492.032 950.784c-17.408 0-33.792-6.656-46.08-18.944l-427.008-427.008c-12.288-12.288-18.944-28.672-18.944-46.08 0-17.408 6.656-33.792 18.944-46.08l320.512-320.512c12.288-12.288 28.672-18.944 46.08-18.944 17.408 0 33.792 6.656 46.08 18.944l109.568 109.568 104.96-104.96c12.288-12.288 28.672-18.944 46.08-18.944 17.408 0 33.792 6.656 46.08 18.944l266.752 266.752c12.288 12.288 18.944 28.672 18.944 46.08 0 17.408-6.656 33.792-18.944 46.08l-120.32 120.32-6.144-6.144-5.12 15.872c-3.584 10.752-8.192 18.944-14.848 25.6l-320.512 320.512c-12.288 12.288-28.672 18.944-46.08 18.944z m-106.496-807.424c-12.8 0-25.088 5.12-34.304 14.336l-266.752 266.752c-9.216 9.216-14.336 20.992-14.336 34.304 0 12.8 5.12 25.088 14.336 34.304l373.76 373.76c9.216 9.216 20.992 14.336 34.304 14.336 12.8 0 25.088-5.12 34.304-14.336l19.968-19.968-208.896-208.896c-3.072-3.072-3.072-8.704 0-11.776l26.624-26.624c1.536-1.536 3.584-2.56 6.144-2.56 2.048 0 4.608 1.024 6.144 2.56l208.896 208.896 55.808-55.808-189.952-189.952c-3.072-3.072-3.072-8.704 0-11.776l26.624-26.624c1.536-1.536 3.584-2.56 6.144-2.56 2.048 0 4.608 1.024 6.144 2.56l189.952 189.952 55.808-55.808-171.008-171.008c-3.072-3.072-3.072-8.704 0-11.776l26.624-26.624c1.536-1.536 3.584-2.56 6.144-2.56 2.048 0 4.608 1.024 6.144 2.56l171.008 171.008 19.968-19.968c9.216-9.216 14.336-20.992 14.336-34.304 0-12.8-5.12-25.088-14.336-34.304l-373.76-373.76c-10.752-9.216-23.04-14.336-35.84-14.336z m306.688 4.608c-12.8 0-25.088 5.12-34.304 14.336l-78.336 78.336 281.6 281.6 78.336-78.336c9.216-9.216 14.336-20.992 14.336-34.304s-5.12-25.088-14.336-34.304l-213.504-213.504c-9.216-8.704-20.992-13.824-33.792-13.824z" p-id="15522"></path></svg></i>
									商务合作
								</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
				</ul>
			</div>
			
			<div class="br"></div>
			<div class="list">
				<ul>
					<li>
						<a @click="$gotoShop('user_setting.html')" class="item-link item-content">
							<div class="item-inner">
								<div class="item-title"><i class="icon f7-icons normal-size">gear</i> 设置</div>
								<div class="item-after"></div>
							</div>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>

</template>
<style scoped>
	.top-li {
		padding: 0.7rem 0 0.4rem;
	}
	.top-li .item-title {
		width:100%;position: relative;overflow: hidden;
	}
	.top-li .item-title img {
		width: 70px;height: 70px;border-radius: 50%;
	}
	.top-li .item-title .membername {
		position: absolute;top: 18px;left:80px;
	}
	.top-li .item-title .membername-link {
		position: absolute;top: 44px;left:80px;font-size: 14px;
	}
	
	.list .item-inner .item-title i {
		margin-right: 0.5rem;
	}
	.order-state {
		width:100%;
		text-align: center;
		font-size: 14px;
		padding: 0.7rem 0.5rem;
	}
	.order-state .col .text {
		margin: 0.4rem 0 0;
	}
</style>
<script>
	import wap from '../js/wap.js';
	export default {
		data() {
			return {
			}
		},
		mounted() {
			var app = this.setF7();
			
			document.title = "我的";
		},
		methods: {
			gotoLogin() {
				wap.setLoginRedirectUrl();
				this.$gotoShop('login.html');
			},
		},
		computed: {
		},
		components: {}

	}
</script>