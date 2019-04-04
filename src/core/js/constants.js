/**
 * 手机号格式验证
 */
export const MOBILE_REG = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57]|19[89]|166)[0-9]{8}$/
/**
 * 邮箱格式验证
 */
export const EMAIL_REG = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
/**
 * 姓名校验
 */
export const REAL_NAME = /^[\u4e00-\u9fa5]{2,4}$/
/**
 * 身份证校验
 */
export const ID_CARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

/**
 * 约定的错误码
 */
export let ERROR = {
  ZERO: 0, // http网络异常，未联网
  JS_EXCEPTION: 1, // 客户端脚本异常
  NO_LOGIN: 9999, // 未登录
  INVALID_PARAMS: 400, // 无效参数
  SERVICE_EXCEPTION: 500 // 服务异常
}

/**
 * 错误信息
 */
export const ERROR_MESSAGE = new Map([
  [0, 'http网络异常'],
  [1, '客户端脚本异常'],
  [9999, '用户未登陆'],
  [400, '请求参数无效'],
  [500, '对不起，系统繁忙，请您稍候再试']
])
