/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'

 * createBEM 接收一个参数 blockName 即组件的名称，返回一个函数，这个函数接收多个参数
 * 参数类型可以是，字符串、对象、数组
 * 字符串为 element 元素
 * 对象或数组为 modifier 修饰符
 */
export function createBEM(name: string) {
  // 参数 element modifier
  // el 一定是元素名
  // modes {[disable, true],[primary,false]]}
  // const {prefix,createBEM} =  createNamespace(button) -> prefix = op-button
  // const modifiers = new Record()
  // modifiers['primary',true]
  // modifiers['seconds',true]
  // modifiers['disable',true]
  // createBEM('text',modifiers
  // 结果字符串  op-button__text op-button__text--seconds op-button__text--disable
  return (el?: string, mods?: Record<string, boolean>) => {
    // element  根据 __ 划分
    let result = `${name}${el ? `__${el}` : ''}`

    if (mods) {
      //假如 k-v 的v是true，就把 key包装成指定格式的字符串
      const modsStr = Object.keys(mods)
        .filter((mod) => mods[mod])
        .map((mod) => ` ${result}--${mod}`)
        .join('')
      result += modsStr
    }
    return result
  }
}

/**
 * 封装 name
 * prefixedName `op-${name}`
 * createBEM 将 name 当成闭包变量，并根据 element and modifier 生成className
 * @param name
 * @return [prefixedName, createBEM(prefixedName)]
 */
export function createNamespace(name: string) {
  const prefixedName = `op-${name}`
  return [prefixedName, createBEM(prefixedName)] as const
}
