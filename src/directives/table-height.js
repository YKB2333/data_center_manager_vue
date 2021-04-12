import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

// 设置表格高度
const doResize = async (el, binding, vnode) => {
  console.log('el', el)
  console.log('binding', binding)
  console.log('vnode', vnode)
  // 获取表格Dom对象
  const { componentInstance: $table } = await vnode
  // 获取调用传递过来的数据
  const { value } = binding
  // if (!$table.height) {
  //   throw new Error(`el-$table must set the height. Such as height='100px'`)
  // }
  // console.log($table, '$table$table$table$table')
  // 获取距底部距离（用于展示页码等信息）
  const bottomOffset = (value && value.bottomOffset) || 0
  if (!$table) return
  // 计算列表高度并设置
  const height = window.innerHeight - el.getBoundingClientRect().top - 90
  // $table.layout.setMaxHeight(height)
  console.log('layinnerHeightout', window.innerHeight)
  console.log('top', el.getBoundingClientRect().top)
  // el.class += 'el-table--fluid-height'
  $table.layout.setHeight(height)
  // el-table--fluid-height
  // $table.maxHeight = height
  $table.doLayout()
}

const tableHeight = {
  // 初始化设置
  bind(el, binding, vnode) {
    // 设置resize监听方法
    el.resizeListener = async () => {
      await doResize(el, binding, vnode)
    }
    // 绑定监听方法到addResizeListener
    addResizeListener(window.document.body, el.resizeListener)
  },
  // // 绑定默认高度
  async inserted(el, binding, vnode) {
    doResize(el, binding, vnode)
  },
  // // 销毁时设置
  unbind(el) {
    // 移除resize监听
    removeResizeListener(el, el.resizeListener)
  }
}

tableHeight.install = function(Vue) {
  Vue.directive('tableHeight', tableHeight)
}

export default tableHeight