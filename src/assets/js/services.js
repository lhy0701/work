// import { ajax } from './ajax'
import { $ } from 'zepto-browserify'
export const requestServices = (params) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/yunstore/YunStore/Action', // 'http://60.205.224.28:8080/YunStore', //
            type: 'post',
            headers: {
                Accept: 'application/json; charset=utf-8'
            },
            data: JSON.stringify({
                Message: params
            }),
            dataType: 'json',
            success: function(res) {
                console.log('我是res', res)
                if (res.Message.ErrorMessage) {
                    reject(res.Message.ErrorMessage.ErrMsg)
                }
                resolve(res)
            },
            error: function(error) {
                console.log('失败')
                reject('获取数据失败，请稍后重试')
            }
        })
    })
}
export const requestPayment = (params) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://www.joinpay.com/trade/uniPayApi.action',
            type: 'post',
            data: params,
            // dataType: 'jsonp',
            success: function(res) {
                resolve(res)
            },
            error: function(error) {
                reject(error)
            }
        })
    })
}