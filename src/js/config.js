/**
 * 环境相关配置文件
 */
let serverIndex;
switch (document.location.host){
	case 'm2.cattlepie.com':
		serverIndex = '2';
		break;
	case 'm1.cattlepie.com':
		serverIndex = '1';
		break;
	case 'm.cattlepie.com':
	case 'm.cattlepie.me':
		serverIndex = '';
		break;
	default:
		serverIndex = '2';
		break;
}

//serverIndex = '';
var domainSuffix = '.com';	//.me or .com

var config = {
	domainSuffix : domainSuffix,
	apiUrl: '//apidev' + serverIndex + '.cattlepie' + domainSuffix + '/',
	siteUrl: '//' + document.location.host + '/',
	userSiteUrl: '//m' + serverIndex + '.cattlepie' + domainSuffix + '/',
	shopSiteUrl: '//m' + serverIndex + '.cattlepie' + domainSuffix + '/',
	imgServer: 'http://img0.cattlepie.com/',
}

export default config;