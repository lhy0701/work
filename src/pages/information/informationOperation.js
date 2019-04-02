import { $ } from 'zepto-browserify'
import { requestServices } from '../../assets/js/services'
import AES_Encrypt from './AES'
import '../../assets/js/resetRem'
(function($) {
    // 校验规则
    function checkRules(form, rules) {
        let pass = true
        console.log(rules)
        $(form).serializeArray().forEach((formItem) => {
            // 是否存在校验规则
            if (rules[formItem.name]) {
                // 是否存在正则判断
                if (rules[formItem.name].pattern) {
                    if (!rules[formItem.name].pattern.test(formItem.value) || /\s/.test(formItem.value)) {
                        pass = false

                        form.find('input[name=' + formItem.name + ']').css('border', '2px solid #ff0000')

                        return
                    }
                }
                // 是否存在必须引入
                if (rules[formItem.name].required) {
                    if (formItem.value === '') {
                        pass = false
                        form.find('input[name=' + formItem.name + ']').css('border', '2px solid #ff0000')
                        return
                    }
                }
                form.find('input[name=' + formItem.name + ']').css('border', '2px solid #999999')
            }
        })
        return pass
    }
    // 倒计时
    function countDown(tar) {
        // 获取验证码倒计时

        var countdown = 60

        settime($(tar))

        function settime(obj) {
            //发送验证码倒计时

            if (countdown == 0) {
                obj.attr('disabled', false)

                obj.removeAttr('disabled')

                obj.html('获取验证码')
                obj.removeClass('disabled')

                countdown = 60

                return
            } else {
                obj.attr('disabled', true)
                obj.addClass('disabled')

                obj.html('重新发送(' + countdown + ')')

                countdown--
            }

            setTimeout(function() {
                settime(obj)
            }, 1000)
        }
    }

    // 规则
    const rules = {
        StoreName: {
            required: true,
            message: '请输入店铺名称'
        },
        Mobile: {
            pattern: /^1[34578]\d{9}$/,
            required: true,
            message: '请输入正确手机号码'
        },
        Password: {
            required: true,
            pattern: /.{6,16}/,
            message: '请输入密码,长度为6-16位'
        },
        Address: {
            required: true,
            message: '请输入店铺地址'
        },
        verification: {
            required: true,
            message: '请输入验证码'
        }
    }

    const product = JSON.parse(sessionStorage.software) || {}
        // console.log('我是product', product)
    $('.invitation').html(product.invitation)
    $('input[name=Invitation]').val(product.invitation)
        // 获取验证码
    console.log($('.verification'))
    $('.verification').on('click', function(e) {
            console.log(1)
            let ev = e || event
            event.returnValue = false
            ev.preventDefault()
            countDown(this)
            requestServices({
                    Code: '00200107',
                    Mobile: $('input[name=Mobile]').val(),
                    Token: AES_Encrypt($('input[name=Mobile]').val()), // 进行加密
                    SmsTemplate: 'SMS_156345443'
                })
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => console.log(err))
        })
        // 监听表单键盘事件
    $('form').on('change', function(e) {
        let pass = true
        $(this).serializeArray().forEach((item) => {
            if (item.value === '') {
                pass = false
            }
        })
        if (pass) {
            $('.next').removeClass('disabled')
            $('.next').removeAttr('disabled')
        } else {
            $('.next').addClass('disabled')
            $('.next').attr('disabled', true)
        }
    })
    $('form').on('keyup', function() {
            let pass = true
            $(this).serializeArray().forEach((item) => {
                if (item.value === '') {
                    pass = false
                }
            })
            if (pass) {
                $('.next').removeClass('disabled')
                $('.next').removeAttr('disabled')
            } else {
                $('.next').addClass('disabled')
                $('.next').attr('disabled', true)
            }
        })
        // 表单提交
    $('form').on('submit', function(e) {
        let ev = e || event
        let formData = {}
        event.returnValue = false
        ev.preventDefault()
        if (checkRules($(this), rules)) {
            $('form').serializeArray().forEach((item) => {
                if (item.name === 'Password') {
                    formData[item.name] = AES_Encrypt(item.value)
                } else {
                    formData[item.name] = item.value
                }
            })

            sessionStorage.message = JSON.stringify({
                Code: '00200039',
                Years: 1,
                Amount: product.Price,
                RoleType: product.RoleType,
                ...formData
            })
            location.href = './payForOrder.html'
        }
    })
})($)