import {
	$
} from 'zepto-browserify'
import {
	requestPayment,
	requestServices
} from '../../assets/js/services'
import {
	number
} from '../../assets/js/filter'

function openUrl(url) {
	var a = $('<a href="' + url + '" target="_blank"></a>')[0]
	var e = document.createEvent('MouseEvents')
	e.initEvent('click', true, true)
	a.dispatchEvent(e)
}
// 倒计时
function countDown(tar) {
	// 获取验证码倒计时

	var countdown = 10

	settime($(tar))

	function settime(obj) {
		//发送验证码倒计时

		if (countdown == 0) {
			obj.attr('disabled', false)

			obj.removeAttr("disabled");

			obj.text('我已支付')
			obj.removeClass('disabled')

			countdown = 10

			return
		} else {
			obj.attr('disabled', true)
			obj.addClass('disabled')

			obj.text('我已支付')

			countdown--
		}

		setTimeout(function () {
			settime(obj)
		}, 1000)
	}
}
$(function () {
	// 获取选中信息
	const payment = JSON.parse(sessionStorage.software)
	// ui设置文本
	$('.describe-product').eq(0).text(payment.VersionName)
	$('.describe-product.sum').text('￥' + number(payment.Price, 2))
	//   // 点击支付
	$('.next').on('click', function () {
		// 请求支付接口
		requestServices({
				...JSON.parse(sessionStorage.message),
				ProductName: JSON.parse(sessionStorage.software).VersionName,
				PayMethod: '4',
				AcctId: '',
				Code: '00200039'
			})
			.then((result) => {
				// result.Message.TradePayId
				$('.search-result').show()
				$('.search-result .have-paid').on('click', function () {
					countDown(this)
					let i = 0
					let timer = setInterval(() => {
						i++
						if (i > 10) {
							i = 0;
							clearInterval(timer)
							alert('未查询到支付结果，请稍后重试')
						}
						requestServices({
							Code: '00200117',
							TradePayId: result.Message.TradePayId
						}).then((res) => {
							if (res.Message.Status === '0') {
								alert('支付成功,请下载车企典app进行登陆。')

								i = 0;
								$('.loading').hide()
								delete sessionStorage.software
								delete sessionStorage.message
								var u = navigator.userAgent
								var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
								var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
								// if (isAndroid) {
								// 	window.location.href =
								// 		'https://edcc930960499eba831735ca91274947.dd.cdntips.com/wxz.myapp.com/16891/87341E6B2CEC2EE08EC7B1A29EB236FE.apk?mkey=5c651b936fc6364c&f=0c99&fsname=com.chexiongdi.mobile_1.2_3.apk&hsr=4d5s&cip=111.198.16.185&proto=https'
								// } else if (isiOS) {
								// 	window.location.href = 'http://www.chexd.com/#/download'
								// }
								// window.location.href = 'http://www.chexd.com/#/download'
							window.location.href = './download.html'

								clearInterval(timer)
							}
						})
					}, 1000)
				})
				if (window) {
					if (window.location) {
						if (window.location.href) {
							window.location.href = result.Message.Result.match(/location.href=(.*);/g)[0].split("='")[1].replace("';", '')
						}
					}
				} else {
					openUrl(result.Message.Result.match(/location.href=(.*);/g)[0].split("='")[1].replace("';", ''))
				}
			})
			.catch((err) => {
				alert(err)
				$('.loading').hide()
			})
		// $('.loading').show()
	})
	$('.search-result .close').on('click', function(){
		let initUrl =  '/?invitation='+JSON.parse(sessionStorage.software).invitation
		for(let key in sessionStorage) {

				delete sessionStorage[key]

		}

		window.location.href = initUrl
	})
	$('.search-result .have-paid').on('click', function () {
		countDown(this)
		let i = 0
		let timer = setInterval(() => {
			i++
			if (i > 10) {
				clearInterval(timer)
				alert('未查询到支付结果，请稍后重试')
				i = 0;
			}
			requestServices({
				Code: '00200117',
				TradePayId: result.Message.TradePayId
			}).then((res) => {
				if (res.Message.Status === '0') {
					i = 0;
					alert('支付成功')
					$('.loading').hide()
					delete sessionStorage.software
					delete sessionStorage.message
					var u = navigator.userAgent
					var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
					var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
					// if (isAndroid) {
					// 	window.location.href =
					// 		'https://edcc930960499eba831735ca91274947.dd.cdntips.com/wxz.myapp.com/16891/87341E6B2CEC2EE08EC7B1A29EB236FE.apk?mkey=5c651b936fc6364c&f=0c99&fsname=com.chexiongdi.mobile_1.2_3.apk&hsr=4d5s&cip=111.198.16.185&proto=https'
					// } else if (isiOS) {
					// 	window.location.href = 'http://www.chexd.com/#/download'
					// }
					window.location.href = './download.html'
					clearInterval(timer)
				}
			})
		}, 1000)
	})
})
