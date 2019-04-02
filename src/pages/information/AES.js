import CryptoJS, { SHA256 } from 'crypto-js'
import sha1 from 'crypto-js/sha1'
/**
 * AES加密
 *
 * @param { String } password
 * @returns base64转码加密后的密码
 * @description
 *
 *  AES_Encrypt(666666)
 *
 *  >AES WDY4aJqKQ0Ee64zEFsJGUA==
 *
 *  >sha1 FBFnigueJe4vfIsveskranSz+cU=
 */
export default function AES_Encrypt(password) {
	// 密钥 key
	// let key = CryptoJS.enc.Base64.parse('Zz2aAhN86By947mNh+QfQs4+iiYzvXdBpuIWcrHaIQQ=')
	// // 偏移量 iv
	// let iv = CryptoJS.enc.Base64.parse('5IjGHGqTqHuaff4prjyMGg==')

	// // 将密码转码
	// var srcs = CryptoJS.enc.Utf8.parse(password)

	// var encrypted = CryptoJS.AES.encrypt(srcs, key, {
	// 	iv, // iv 偏移量
	// 	mode: CryptoJS.mode.CBC, // AES加密模式
	// 	padding: CryptoJS.pad.Pkcs7 // 填充
	// })
	// // 默认输出为 hex
	// var hexStr = encrypted.ciphertext.toString().toUpperCase()
	// var oldHexStr = CryptoJS.enc.Hex.parse(hexStr)
	// console.log(encrypted.ciphertext.toString())
	// console.log(oldHexStr.toString())
	// // 将密文转为Base64的字符串
	// var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr)
	//这里根据需求返回 base64Str 或 hexStr(解密时有小小差别)
	// return encrypted.toString()

	var srcs = CryptoJS.enc.Utf8.parse(password)

	var encrypted = sha1(srcs)

	return CryptoJS.enc.Base64.stringify(encrypted)
}
