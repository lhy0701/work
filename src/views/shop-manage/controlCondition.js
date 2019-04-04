/**
 *
 * 修改搜索条件
 * @param {any} type // 查询 true, 重置 false
 * @param {any} condition // 要修改的条件
 * @returns 修改后的数据
 */
export const updateCondition = (type, condition) => {
  let modified = {}
  if (!type) {
    for (let key in condition) {
      condition[key] = ''
    }
  }
  modified = Object.assign({
    ...condition
  })
  return modified
}
