
export default {
  // tofix: 图表在切出页面且resize后返回空白的问题
  activated() {
    // console.log('activated')
    window.dispatchEvent(new Event('resize'))
  }
}