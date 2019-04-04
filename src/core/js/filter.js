/**
 * 时间戳
 * @param val 必需，要格式化的时间戳
 */
export const formatDate = (val, format = 'yyyy-mm-dd') => {
  if (val.length && val.length === 13) {
    val = parseInt(val)
  }
  var d = new Date(val)
  var year = d.getFullYear()
  var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1)
  var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
  var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours()
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()
  var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds()
  let result = ''
  switch (format) {
    case 'yyyymmdd':
      result = year + month + day
      break
    case 'yyyymm':
      result = year + month
      break
    case 'yyyy-mm-dd':
      result = year + '-' + month + '-' + day
      break
    case 'yyyy-mm-dd hh:MM':
      result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
      break
    case 'yyyy-mm-dd hh:MM:ss':
      result = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
      break
    default:
      break
  }
  return result
}

/**
 * 千分位数字格式化
 * @param number 必需，要格式化的数字
 * @param decimals 可选，规定多少个小数位。
 * @param point 可选，规定用作小数点的字符串（默认为 . ）。
 * @param thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
 */
export const number = (number, decimals, point, thousands) => {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
    sep = thousands || ',',
    dec = point || '.',
    s,
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec)
      return '' + (Math.round(n * k) / k).toFixed(prec)
    }

  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
/**
 * 时间串格式化
 * @param timeStr 必需，要格式化的时间串 例: 20180312161533
 *
 */
export const transitionTime = timeStr => {
  return timeStr && timeStr * 1 !== 0
    ? timeStr
        .match(/(\d{8})|(\d{6}|\d{4}|\d{2})/g)
        .map((item, index) => {
          if (index >= 1) {
            return item.replace(/(\d{2})/g, '$1:').replace(/:$/, '')
          }
          return item.replace(/\d{4}/g, ($1, $2) => {
            if ($2 === 4) {
              return $1.replace(/(\d{2})/g, '-$1')
            }
            return $1
          })
        })
        .join(' ')
    : ''
}
