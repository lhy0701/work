import { env } from '@/core/js/env'
export const checkNumber = (rule, value, callback) => {
  if (value !== '') {
    setTimeout(() => {
      if (!env.getUser().isAgent) {
        if (0 <= Number(value) && Number(value) <= 90) {
          callback()
        } else {
          callback(new Error('试用期最大天数为90天'))
        }
      } else {
        if (0 <= Number(value) && Number(value) <= 7) {
          callback()
        } else {
          callback(new Error('试用期最大天数为7天'))
        }
      }
    }, 500)
  } else {
    callback(new Error('请输入试用天数'))
  }
}
