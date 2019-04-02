import { $ } from 'zepto-browserify'
import { requestServices } from '../../assets/js/services'
import { getUrlParams } from '../../assets/js/global'
// import VConsole from 'vconsole';
// var vConsole = new VConsole();
// console.log('你好')
//判断 支付宝内核
console.log(getUrlParams())

function isAli() {
    var ua = navigator.userAgent; // 用来识别各种浏览器的
    console.log('我是', ua)
    if (/AliApp/g.test(ua)) {
        return true;
    } else {
        return false;
    }
}
// 判断是 qq内核
function isQQ() {
    var ua = navigator.userAgent;
    console.log(ua)
    if (/QQBrowser/g.test(ua)) {
        return true;
    } else {
        return false;
    }
}

window.onload = () => {

    // $('.product-banner').html(navigator.userAgent	)
}
if (isAli()) {
    alert('支付宝浏览器')
} else if (isQQ()) {
    console.log('我是qq浏览器')
        // alert('qq内核浏览器')
        //   $('body').append(`<div style="position: fixed;
        // top: 0;
        // left: 0;
        // right: 0;
        // bottom: 0;
        // background: #fff;
        // text-align: center;
        // display: flex;
        // align-items: center;
        // justify-content: center;">请在手机浏览器内打开</div>`)
        // throw '微信浏览器'
}
let explain = [], // 数据详情
    currSession = sessionStorage.software ? JSON.parse(sessionStorage.software) : '' // 从支付跳转回，默认选择

requestServices({
        Code: '00200067'
    })
    .then((res) => {
        console.log('打印数据', 1)
        let softwareList = res.Message.SoftwarePricesGroup
        explain = softwareList
        createDom(softwareList, $('.list-main ul').eq(0))
        console.log(explain[currSession.RoleType])
        $('.list-desc').html(`<pre>${explain[currSession.RoleType ? currSession.RoleType : 0].Description}<pre>`)
    })
    .catch((error) => {
        alert(error)
    })

/**
 *
 * 选择软件版本
 *
 */
$('.list-main').on('click', 'li', function(e) {
    e.stopPropagation()
    $('.list-desc').html(`<pre>${explain[$(this).data('index')].Description}<pre>`)
    setSession($(this).find('input'))
})

/**
 * 点击下一步，跳转到支付页面
 */
$('.next').on('click', function() {
    // console.log('我是input', document.querySelectorAll('input'))
    // const checkedProduct = [...document.querySelectorAll('input')].filter((item) => {
    //     console.log(item)
    //     if (item.checked) {
    //         return item
    //     }
    // })

    // 跳转支付页面
    window.location.href = '/information.html' // /sharepage
})

/**
 * 设置 Session
 */
function setSession(tar) {
    window.sessionStorage.software = JSON.stringify({
        VersionName: tar.data('name').trim(), // 软件名称
        Price: tar.attr('value'), // 价格
        RoleType: tar.attr('data-roleType'), // flag
        invitation: getUrlParams().invitation // 邀请码
    })
}
/**
 * 创建节点
 *  @param softwareList 数据
 *  @param tar 追加到目标元素
 */
function createDom(softwareList, tar) {
    let dom = ''
    let session = sessionStorage.software ? JSON.parse(sessionStorage.software) : ''
    softwareList.forEach((item, index) => {
        dom += `
    <li data-index="${index}">
      <input
        type="radio"
        id="${item.VersionName + item.Price}"
        name="product"
        data-name="${item.VersionName}"
        data-roleType="${item.RoleType}"
        value="${item.Price}"
       ${!!session
			? session.VersionName + session.Price === item.VersionName + item.Price ? 'checked' : ''
			: index === 0 ? 'checked' : ''}
      />
      <label for="${item.VersionName + item.Price}" onclick="">${item.VersionName} - <span style="color:#ff7449">￥${item.Price}.00</span></label>
    </li>
    `
    })
    $(dom).appendTo(tar)
    setSession($('.list-main').eq(0).find('input:checked'))
}