import config from './config'
import Vue from 'vue'
import * as constants from './constants'
import router, { dynamicRoutes } from '../router'
const CryptoJS = require('crypto-js')

// import apiService from '@/services/api'
const key = CryptoJS.enc.Utf8.parse('1443122412ABCDEF')
const iv = CryptoJS.enc.Utf8.parse('ABCDEF4124412412')
class Env {
    constructor() {
        this.config = config
        this.user = {
            name: '',
            userName: '',
            userType: '',
            userId: ''
        }
        this.vm = new Vue()
        this.roles = []
    }

    init() {
        this.initUser()
        this.initRoles()
    }

    initUser() {
        let userCache = sessionStorage.getItem('user')
        console.log('userCache', userCache)
        if (userCache && userCache !== null) {
            this.user = JSON.parse(this.decryptr(userCache))
        } else if (this.getCookie('user') && this.getCookie('user') != 'null') {
            this.user = JSON.parse(this.getCookie('user'))
        }
        console.log("我是登录人信息", this.user)
    }

    /**
     * 初始化权限
     */
    initRoles() {
        let rolesCache = sessionStorage.getItem('roles')
        if (rolesCache && rolesCache !== null) {
            this.roles = JSON.parse(this.decryptr(rolesCache))
            this.setRouter()
        }
    }

    /**
     * 设置权限路由
     */
    setRouter() {
        let roles = []
        let addRouter = []
        let role = this.roles.reduce((item, current) => `${item}${current.ChildFunction},`, '')
        role = role.substring(0, role.length - 1)
        roles = role.split(',')
        for (let i = 0; i < roles.length; i++) {
            let element = roles[i]
            for (let route of dynamicRoutes) {
                if (route.meta.name == element) {
                    addRouter.push(route)
                }
            }
        }
        // 手动挂载路由
        router.options.routes[2].children.push(...addRouter)
        router.addRoutes([router.options.routes[2]])
    }

    /**
     * 获取环境配置
     */
    getConfig() {
        return this.config
    }

    setCookie(name, value, Days) {
        if (Days == null || Days == '') {
            Days = 300
        }
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + escape(value) + '; path=/;expires=' + exp.toGMTString()
    }

    getCookie(name) {
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        arr = document.cookie.match(reg)
        if (arr) {
            return unescape(arr[2])
        } else {
            return null
        }
    }

    /**
     * 设置登录用户信息
     * @param user 登录用户
     */
    setUser(user) {
        this.user = user
        let md5 = this.encrypt(JSON.stringify(user))
        sessionStorage.setItem('user', md5)
    }

    /**
     * 设置用户权限
     */
    setRoles(roles) {
        this.roles = roles
        let md5 = this.encrypt(JSON.stringify(roles))
        sessionStorage.setItem('roles', md5)
        if (roles.length) {
            this.setRouter()
        }
    }

    /**
     * 获取用户权限
     */
    getRoles() {
        return this.roles
    }

    /**
     * 获取登录用户信息
     */
    getUser() {
        return this.user
    }

    /**
     * 设置Vue实例
     * @param vm Vue实例
     */
    setVm(vm) {
        this.vm = vm
    }

    /**
     * 获取Vue实例
     */
    getVm() {
            return this.vm
        }
        /**
         *
         * 加密
         */
    encrypt(word) {
            let srcs = CryptoJS.enc.Utf8.parse(word)
            let encrypted = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            })
            return encrypted.ciphertext.toString().toUpperCase()
        }
        /**
         * 解密
         */
    decryptr(word) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
        return decryptedStr.toString()
    }
}

let env = new Env()

export { env, constants }