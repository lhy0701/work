import { constants, env } from '@/core/js/env'

const defaultErrorHandler = {
  /**
   * 处理网络异常
   */
  netWork: function() {
    env.getVm().$message.error('网络异常,请稍后重试')
  },

  /**
   * 处理 http 服务器异常
   */
  httpError: function(status) {
    // console.log(status + ' ', constants.ERROR_MESSAGE.get(status))
    let message = constants.ERROR_MESSAGE.get(status)
    env.getVm().$message.error(message ? message : '错误码 ' + status)
  },

  /**
   * 用户未登录，弹出登录窗
   */
  noLogin: function() {
    env.setUser({})
    env.setRoles([])
    window.location.href = __DEV__ ? '/' : '/backend'
  },

  /**
   * 处理其他异常操作
   */
  other: function(err) {
    let code = err.response && err.response.data.Message.ErrorMessage.ErrCode
    let message = err.response && err.response.data.Message.ErrorMessage.ErrMsg
    // console.log(code + ' ', constants.ERROR_MESSAGE.get(code))
    if (code) {
      env.getVm().$message.error(message)
    }
  }
}

function errorResponse(err, errorHandler) {
  let response = err.response

  if (response) {
    let status = response.status

    if (status === 200) {
      // http请求成功，但是业务状态码不是回执加1
      let stateCode = response.data.Message.ErrorMessage.ErrCode
      let message = response.data.Message.ErrorMessage.ErrMsg
      if (stateCode == constants.ERROR.NO_LOGIN && message.includes('未知用户身份信息')) {
        errorHandler.noLogin && errorHandler.noLogin(err)
      } else {
        errorHandler.other && errorHandler.other(err)
      }
    } else if (status < 200 || status > 300) {
      errorHandler.httpError && errorHandler.httpError(status)
    }
  } else if (err.message === 'Network Error') {
    errorHandler.network && errorHandler.network()
  } else {
    // TODO 此处脚本异常
    console.log(constants.ERROR_MESSAGE.get(constants.ERROR.JS_EXCEPTION) + ' ' + err.stack, 'red')
  }
}

export default function(customErrorHandler = defaultErrorHandler) {
  let errorHandle = Object.assign({}, defaultErrorHandler)
  Object.assign(errorHandle, customErrorHandler)

  return function(err) {
    errorResponse(err, errorHandle)
  }
}
