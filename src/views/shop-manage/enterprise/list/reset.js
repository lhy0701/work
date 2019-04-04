/**
 * 时间串格式化
 * @param timeStr 必需，要格式化的时间串 例: 20180312161533
 * 
 */
export const transitionTime = timeStr => {
  
  return timeStr ? timeStr
    .match(/(\d{8})|(\d{6}|\d{4}|\d{2})/g)
    .map((item, index) => {
      if (index >= 1) {
        return item.replace(/(\d{2})/g, '$1:').replace(/:$/, '')
      }
      return item.replace(/\d{4}/g, ($1, $2, $3) => {
        if ($2 === 4) {
          return $1.replace(/(\d{2})/g, '-$1')
        }
        return $1
      })
    })
    .join(' ') : ''
}
